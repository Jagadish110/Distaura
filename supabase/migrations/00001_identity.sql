-- ============================================================
-- 00001_identity.sql
-- Profiles, roles, companies, team invites
-- ============================================================

-- ── Profiles (synced from auth.users via trigger) ───────────
create table public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text not null default '',
  phone            text,
  avatar_url       text,
  onboarding_done  boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- ── User roles (server-written ONLY) ────────────────────────
-- No browser user can insert, update or delete here.
create table public.user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'customer'
              check (role in ('customer', 'admin', 'team')),
  permissions text[] not null default '{}',
  created_at  timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;
create index idx_user_roles_user on public.user_roles(user_id);

-- ── Companies (one user = one company in v1) ────────────────
create table public.companies (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade unique,
  name             text not null,
  gstin            text,
  business_type    text,
  industry         text,
  company_size     text,
  billing_address  text,
  city             text,
  state            text,
  pincode          text,
  contact_person   text,
  contact_role     text,
  contact_phone    text,
  onboarding_step  int not null default 0,
  categories       text[] not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.companies enable row level security;
create index idx_companies_user on public.companies(user_id);

-- ── Team invites ────────────────────────────────────────────
create table public.team_invites (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  role            text not null default 'team'
                  check (role in ('admin', 'team')),
  permissions     text[] not null default '{}',
  token_hash      text not null unique,
  expires_at      timestamptz not null,
  accepted_at     timestamptz,
  invited_by      uuid not null references auth.users(id),
  created_at      timestamptz not null default now()
);
alter table public.team_invites enable row level security;
create index idx_team_invites_token on public.team_invites(token_hash);
create index idx_team_invites_email on public.team_invites(email);

-- ── App settings (singleton) ────────────────────────────────
create table public.app_settings (
  id                  uuid primary key default gen_random_uuid(),
  company_name        text not null default 'Distaura',
  legal_name          text,
  gstin               text,
  address             text,
  logo_url            text,
  invoice_prefix      text not null default 'DIS',
  financial_year_start int not null default 4,  -- April
  gst_rate            numeric(5,2) not null default 18.00,
  bank_name           text,
  bank_account        text,
  bank_ifsc           text,
  bank_upi            text,
  sender_name         text not null default 'Distaura',
  sender_email        text,
  commission_due_days  int not null default 30,
  commission_grace_days int not null default 7,
  penalty_rate        numeric(5,2) not null default 0,
  penalty_cap_pct     numeric(5,2) not null default 10,
  reminder_days       int[] not null default '{30,15,7}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
alter table public.app_settings enable row level security;

-- ── Trigger: auto-create profile on signup ──────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Always create a profile
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone'
  );

  -- Always assign customer role (ignore any role in metadata)
  insert into public.user_roles (user_id, role)
  values (new.id, 'customer');

  return new;
end;
$$;

-- Drop if exists to make re-runs safe
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ── Helper functions for RLS policies ───────────────────────

-- Check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

-- Check if current user is team
create or replace function public.is_team()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role in ('admin', 'team')
  );
$$;

-- Check if current user has a specific permission
create or replace function public.has_permission(perm text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and (role = 'admin' or perm = any(permissions))
  );
$$;

-- Get the company id for the current user
create or replace function public.my_company_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id from public.companies
  where user_id = auth.uid()
  limit 1;
$$;

-- Check if session has AAL2 (two-factor completed)
create or replace function public.is_aal2()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select (auth.jwt() -> 'aal')::text = '"aal2"'),
    false
  );
$$;
