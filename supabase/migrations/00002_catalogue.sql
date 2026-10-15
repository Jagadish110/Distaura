-- ============================================================
-- 00002_catalogue.sql
-- Suppliers, agreements, categories, products, plans
-- ============================================================

-- ── Categories ──────────────────────────────────────────────
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;

-- ── Suppliers ───────────────────────────────────────────────
create table public.suppliers (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  contact_name   text,
  email          text,
  phone          text,
  website        text,
  address        text,
  city           text,
  state          text,
  country        text not null default 'India',
  gstin          text,
  pan            text,
  status         text not null default 'active'
                 check (status in ('active', 'inactive', 'suspended')),
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.suppliers enable row level security;

-- ── Supplier payment methods ────────────────────────────────
create table public.supplier_payment_methods (
  id            uuid primary key default gen_random_uuid(),
  supplier_id   uuid not null references public.suppliers(id) on delete cascade,
  method_type   text not null
                check (method_type in ('bank', 'upi', 'checkout_link')),
  label         text,                     -- e.g. "HDFC Business Account"
  bank_name     text,
  account_number text,
  ifsc_code     text,
  upi_id        text,
  checkout_url  text,
  instructions  text,                     -- payment instructions for customer
  is_default    boolean not null default false,
  created_at    timestamptz not null default now()
);
alter table public.supplier_payment_methods enable row level security;
create index idx_spm_supplier on public.supplier_payment_methods(supplier_id);

-- ── Agreements ──────────────────────────────────────────────
create table public.agreements (
  id                     uuid primary key default gen_random_uuid(),
  supplier_id            uuid not null references public.suppliers(id) on delete cascade,
  commission_type        text not null default 'percentage'
                         check (commission_type in ('percentage', 'fixed')),
  commission_value       numeric(10,2) not null default 0,
  commission_on_tax_inclusive boolean not null default false,
  due_days               int not null default 30,
  grace_days             int not null default 7,
  penalty_type           text not null default 'percentage_daily'
                         check (penalty_type in ('percentage_daily', 'fixed_daily')),
  penalty_value          numeric(10,4) not null default 0,
  penalty_cap_pct        numeric(5,2) not null default 10,
  renewals_earn_commission boolean not null default true,
  auto_renew             boolean not null default true,
  signed_file_url        text,
  notes                  text,
  valid_from             date not null default current_date,
  valid_to               date,
  status                 text not null default 'active'
                         check (status in ('active', 'expired', 'terminated')),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
alter table public.agreements enable row level security;
create index idx_agreements_supplier on public.agreements(supplier_id);

-- ── Products ────────────────────────────────────────────────
create table public.products (
  id              uuid primary key default gen_random_uuid(),
  supplier_id     uuid not null references public.suppliers(id) on delete cascade,
  category_id     uuid references public.categories(id) on delete set null,
  name            text not null,
  slug            text not null unique,
  short_desc      text,
  description     text,
  features        text[] not null default '{}',
  demo_url        text,
  delivery_time   text,                   -- e.g. "2-3 business days"
  support_email   text,
  support_phone   text,
  logo_url        text,
  images          text[] not null default '{}',
  status          text not null default 'draft'
                  check (status in ('draft', 'published', 'archived')),
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table public.products enable row level security;
create index idx_products_supplier on public.products(supplier_id);
create index idx_products_category on public.products(category_id);
create index idx_products_slug on public.products(slug);
create index idx_products_status on public.products(status);

-- ── Product plans (pricing tiers) ───────────────────────────
create table public.product_plans (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  name           text not null,
  plan_type      text not null default 'monthly'
                 check (plan_type in ('one_time', 'monthly', 'quarterly', 'annual')),
  price_paise    bigint not null,         -- price in paise (₹1 = 100 paise)
  currency       text not null default 'INR',
  tax_inclusive   boolean not null default false,
  user_limit     int,                     -- null = unlimited
  features       text[] not null default '{}',
  is_active      boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.product_plans enable row level security;
create index idx_plans_product on public.product_plans(product_id);

-- ── Product commission overrides (admin only) ───────────────
create table public.product_commission_overrides (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references public.products(id) on delete cascade unique,
  commission_type  text not null
                   check (commission_type in ('percentage', 'fixed')),
  commission_value numeric(10,2) not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.product_commission_overrides enable row level security;

-- ── Price history ───────────────────────────────────────────
create table public.price_history (
  id            uuid primary key default gen_random_uuid(),
  plan_id       uuid not null references public.product_plans(id) on delete cascade,
  old_price_paise bigint not null,
  new_price_paise bigint not null,
  changed_by    uuid references auth.users(id),
  changed_at    timestamptz not null default now()
);
alter table public.price_history enable row level security;
create index idx_price_history_plan on public.price_history(plan_id);

-- ── Safe public catalogue view ──────────────────────────────
-- This is the ONLY source for visitors and customers.
-- Commission data, supplier internals, and draft products are excluded.
create or replace view public.public_products as
select
  p.id,
  p.name,
  p.slug,
  p.short_desc,
  p.description,
  p.features,
  p.demo_url,
  p.delivery_time,
  p.logo_url,
  p.images,
  p.sort_order as product_sort,
  c.id as category_id,
  c.name as category_name,
  c.slug as category_slug,
  s.name as supplier_name,
  pp.id as plan_id,
  pp.name as plan_name,
  pp.plan_type,
  pp.price_paise,
  pp.currency,
  pp.tax_inclusive,
  pp.user_limit,
  pp.features as plan_features,
  pp.sort_order as plan_sort
from public.products p
join public.suppliers s on s.id = p.supplier_id and s.status = 'active'
left join public.categories c on c.id = p.category_id
left join public.product_plans pp on pp.product_id = p.id and pp.is_active = true
where p.status = 'published';
