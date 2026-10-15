-- ============================================================
-- 00003_sales.sql
-- Orders, order events, supplier tokens, confirmations, documents
-- ============================================================

-- ── Sequence for order numbers ──────────────────────────────
create sequence if not exists public.order_number_seq start 1001;

-- ── Orders ──────────────────────────────────────────────────
create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text not null unique
                    default 'ORD-' || lpad(nextval('public.order_number_seq')::text, 6, '0'),
  company_id        uuid not null references public.companies(id),
  product_id        uuid not null references public.products(id),
  plan_id           uuid references public.product_plans(id),
  supplier_id       uuid not null references public.suppliers(id),
  requested_by      uuid not null references auth.users(id),
  quantity          int not null default 1,
  unit_price_paise  bigint not null,       -- snapshot at time of order
  total_paise       bigint not null,       -- quantity × unit price
  currency          text not null default 'INR',
  billing_cycle     text,
  status            text not null default 'pending'
                    check (status in (
                      'pending',
                      'supplier_confirmed',
                      'payment_received',
                      'delivered',
                      'completed',
                      'cancelled',
                      'refunded'
                    )),
  notes             text,
  -- Status timestamps
  confirmed_at      timestamptz,
  payment_received_at timestamptz,
  delivered_at      timestamptz,
  completed_at      timestamptz,
  cancelled_at      timestamptz,
  renewal_date      date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table public.orders enable row level security;
create index idx_orders_company on public.orders(company_id);
create index idx_orders_supplier on public.orders(supplier_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_requested_by on public.orders(requested_by);

-- ── Order terms snapshot (admin only) ───────────────────────
-- Frozen copy of commission terms at time of sale
create table public.order_terms_snapshot (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade unique,
  commission_type   text not null,
  commission_value  numeric(10,2) not null,
  commission_on_tax_inclusive boolean not null default false,
  due_days          int not null,
  grace_days        int not null,
  penalty_type      text not null,
  penalty_value     numeric(10,4) not null,
  penalty_cap_pct   numeric(5,2) not null,
  created_at        timestamptz not null default now()
);
alter table public.order_terms_snapshot enable row level security;

-- ── Order events (timeline) ─────────────────────────────────
create table public.order_events (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  event_type   text not null,
  from_status  text,
  to_status    text,
  title        text not null,
  detail       text,
  actor_id     uuid references auth.users(id),
  actor_type   text not null default 'system'
               check (actor_type in ('system', 'customer', 'admin', 'team', 'supplier')),
  created_at   timestamptz not null default now()
);
alter table public.order_events enable row level security;
create index idx_order_events_order on public.order_events(order_id);

-- ── Supplier action tokens ──────────────────────────────────
create table public.supplier_action_tokens (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  action_type  text not null
               check (action_type in ('confirm_payment', 'confirm_delivery')),
  token_hash   text not null unique,
  expires_at   timestamptz not null,
  used_at      timestamptz,
  created_at   timestamptz not null default now()
);
alter table public.supplier_action_tokens enable row level security;
create index idx_sat_token on public.supplier_action_tokens(token_hash);
create index idx_sat_order on public.supplier_action_tokens(order_id);

-- ── Supplier confirmations ──────────────────────────────────
create table public.supplier_confirmations (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  action_type       text not null
                    check (action_type in ('confirm_payment', 'confirm_delivery')),
  amount_paise      bigint,
  payment_date      date,
  invoice_number    text,
  note              text,
  confirmed_via     text not null default 'link'
                    check (confirmed_via in ('link', 'admin')),
  confirmed_at      timestamptz not null default now()
);
alter table public.supplier_confirmations enable row level security;
create index idx_sc_order on public.supplier_confirmations(order_id);

-- ── Documents ───────────────────────────────────────────────
create table public.documents (
  id           uuid primary key default gen_random_uuid(),
  owner_type   text not null
               check (owner_type in ('order', 'company', 'supplier', 'commission_invoice')),
  owner_id     uuid not null,
  bucket       text not null,
  path         text not null,
  name         text not null,
  file_type    text,                     -- invoice, payment_proof, agreement, other
  mime_type    text,
  size_bytes   bigint,
  uploaded_by  uuid references auth.users(id),
  created_at   timestamptz not null default now()
);
alter table public.documents enable row level security;
create index idx_documents_owner on public.documents(owner_type, owner_id);

-- ── Renewals ────────────────────────────────────────────────
create table public.renewals (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  renewal_date    date not null,
  renewal_price_paise bigint not null,
  currency        text not null default 'INR',
  status          text not null default 'upcoming'
                  check (status in ('upcoming', 'due', 'renewed', 'lapsed')),
  reminders_sent  int not null default 0,
  renewed_at      timestamptz,
  new_order_id    uuid references public.orders(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table public.renewals enable row level security;
create index idx_renewals_order on public.renewals(order_id);
create index idx_renewals_date on public.renewals(renewal_date);
create index idx_renewals_status on public.renewals(status);
