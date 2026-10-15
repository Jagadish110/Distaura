-- ============================================================
-- 00004_commissions.sql
-- Commission ledger, payments, invoices, credit notes, counters
-- ============================================================

-- ── Invoice counters (atomic numbering) ─────────────────────
create table public.invoice_counters (
  financial_year text primary key,        -- e.g. '26-27'
  last_number    int not null default 0,
  updated_at     timestamptz not null default now()
);
alter table public.invoice_counters enable row level security;

-- ── Commission ledger ───────────────────────────────────────
create table public.commissions (
  id                 uuid primary key default gen_random_uuid(),
  order_id           uuid not null references public.orders(id) unique,
  supplier_id        uuid not null references public.suppliers(id),
  sale_amount_paise  bigint not null,
  commission_amount_paise bigint not null,
  payment_confirmed_date date,           -- when supplier confirmed customer paid
  due_date           date,               -- payment_confirmed + due_days
  grace_end_date     date,               -- due_date + grace_days
  status             text not null default 'pending'
                     check (status in (
                       'pending',        -- order not yet confirmed
                       'due',            -- confirmed, awaiting commission
                       'overdue',        -- past grace period
                       'paid',           -- fully paid
                       'waived',         -- fully waived
                       'cancelled'       -- order cancelled
                     )),
  waived_amount_paise bigint not null default 0,
  waiver_reason      text,
  waived_by          uuid references auth.users(id),
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
alter table public.commissions enable row level security;
create index idx_commissions_supplier on public.commissions(supplier_id);
create index idx_commissions_status on public.commissions(status);
create index idx_commissions_due on public.commissions(due_date);

-- ── Commission payments ─────────────────────────────────────
create table public.commission_payments (
  id                uuid primary key default gen_random_uuid(),
  commission_id     uuid not null references public.commissions(id) on delete cascade,
  amount_paise      bigint not null,
  payment_date      date not null,
  method            text,                 -- bank, upi, cash, etc.
  reference         text,                 -- UTR number, transaction ref
  recorded_by       uuid not null references auth.users(id),
  created_at        timestamptz not null default now()
);
alter table public.commission_payments enable row level security;
create index idx_cp_commission on public.commission_payments(commission_id);

-- ── Commission invoices ─────────────────────────────────────
create table public.commission_invoices (
  id                uuid primary key default gen_random_uuid(),
  invoice_number    text not null unique,
  financial_year    text not null,
  supplier_id       uuid not null references public.suppliers(id),
  status            text not null default 'draft'
                    check (status in ('draft', 'sent', 'paid', 'cancelled')),
  issued_date       date not null default current_date,
  due_date          date not null,
  subtotal_paise    bigint not null,
  gst_paise         bigint not null default 0,
  total_paise       bigint not null,
  file_url          text,                 -- PDF stored in storage
  paid_at           timestamptz,
  notes             text,
  created_by        uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table public.commission_invoices enable row level security;
create index idx_ci_supplier on public.commission_invoices(supplier_id);
create index idx_ci_status on public.commission_invoices(status);

-- ── Commission invoice line items ───────────────────────────
create table public.commission_invoice_lines (
  id              uuid primary key default gen_random_uuid(),
  invoice_id      uuid not null references public.commission_invoices(id) on delete cascade,
  commission_id   uuid not null references public.commissions(id),
  description     text not null,
  amount_paise    bigint not null,
  gst_rate        numeric(5,2) not null default 18.00,
  created_at      timestamptz not null default now()
);
alter table public.commission_invoice_lines enable row level security;
create index idx_cil_invoice on public.commission_invoice_lines(invoice_id);

-- ── Credit notes ────────────────────────────────────────────
create table public.credit_notes (
  id              uuid primary key default gen_random_uuid(),
  invoice_id      uuid not null references public.commission_invoices(id),
  credit_number   text not null unique,
  reason          text not null,
  amount_paise    bigint not null,
  file_url        text,
  created_by      uuid references auth.users(id),
  created_at      timestamptz not null default now()
);
alter table public.credit_notes enable row level security;
create index idx_cn_invoice on public.credit_notes(invoice_id);

-- ── Atomic invoice number generator ─────────────────────────
create or replace function public.next_invoice_number(prefix text, fy text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_num int;
begin
  insert into public.invoice_counters (financial_year, last_number)
  values (fy, 1)
  on conflict (financial_year)
  do update set last_number = public.invoice_counters.last_number + 1,
               updated_at = now()
  returning last_number into next_num;

  return prefix || '/' || fy || '/' || lpad(next_num::text, 4, '0');
end;
$$;

-- ── Commission balance calculator ───────────────────────────
create or replace function public.commission_balance(
  p_commission_id uuid,
  p_as_of date default current_date
)
returns table (
  commission_paise bigint,
  paid_paise bigint,
  outstanding_paise bigint,
  days_late int,
  penalty_paise bigint,
  total_due_paise bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_comm public.commissions;
  v_terms public.order_terms_snapshot;
  v_paid bigint;
  v_outstanding bigint;
  v_days_late int;
  v_penalty bigint;
  v_penalty_cap bigint;
begin
  select * into v_comm from public.commissions where id = p_commission_id;
  if not found then
    return;
  end if;

  select * into v_terms from public.order_terms_snapshot where order_id = v_comm.order_id;

  -- Total paid so far
  select coalesce(sum(amount_paise), 0) into v_paid
  from public.commission_payments where commission_id = p_commission_id;

  v_outstanding := greatest(v_comm.commission_amount_paise - v_paid - v_comm.waived_amount_paise, 0);

  -- Days late (past grace end)
  if v_comm.grace_end_date is not null and p_as_of > v_comm.grace_end_date then
    v_days_late := (p_as_of - v_comm.grace_end_date);
  else
    v_days_late := 0;
  end if;

  -- Penalty calculation
  if v_days_late > 0 and v_terms.penalty_value > 0 then
    if v_terms.penalty_type = 'percentage_daily' then
      v_penalty := (v_outstanding * v_terms.penalty_value / 100.0 * v_days_late)::bigint;
    else  -- fixed_daily
      v_penalty := (v_terms.penalty_value * 100 * v_days_late)::bigint;  -- convert rupees to paise
    end if;

    -- Apply cap
    v_penalty_cap := (v_comm.commission_amount_paise * v_terms.penalty_cap_pct / 100.0)::bigint;
    v_penalty := least(v_penalty, v_penalty_cap);
  else
    v_penalty := 0;
  end if;

  return query select
    v_comm.commission_amount_paise,
    v_paid,
    v_outstanding,
    v_days_late,
    v_penalty,
    v_outstanding + v_penalty;
end;
$$;
