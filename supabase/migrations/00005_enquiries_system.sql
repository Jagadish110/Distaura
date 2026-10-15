-- ============================================================
-- 00005_enquiries_system.sql
-- Enquiries, notifications, email log, audit log
-- ============================================================

-- ── Enquiries ───────────────────────────────────────────────
create table public.enquiries (
  id             uuid primary key default gen_random_uuid(),
  enquiry_type   text not null
                 check (enquiry_type in ('business', 'supplier')),
  name           text not null,
  company_name   text,
  email          text not null,
  phone          text,
  message        text not null,
  product_desc   text,                   -- for supplier enquiries
  status         text not null default 'new'
                 check (status in ('new', 'in_progress', 'responded', 'closed')),
  assigned_to    uuid references auth.users(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.enquiries enable row level security;
create index idx_enquiries_status on public.enquiries(status);
create index idx_enquiries_type on public.enquiries(enquiry_type);

-- ── Enquiry notes ───────────────────────────────────────────
create table public.enquiry_notes (
  id            uuid primary key default gen_random_uuid(),
  enquiry_id    uuid not null references public.enquiries(id) on delete cascade,
  note          text not null,
  follow_up_date date,
  author_id     uuid not null references auth.users(id),
  created_at    timestamptz not null default now()
);
alter table public.enquiry_notes enable row level security;
create index idx_enquiry_notes_enquiry on public.enquiry_notes(enquiry_id);

-- ── Notifications ───────────────────────────────────────────
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  body        text,
  link        text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table public.notifications enable row level security;
create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_read on public.notifications(user_id, is_read);

-- ── Email log ───────────────────────────────────────────────
create table public.email_log (
  id            uuid primary key default gen_random_uuid(),
  template      text not null,
  to_email      text not null,
  subject       text,
  related_type  text,
  related_id    uuid,
  status        text not null default 'sent'
                check (status in ('sent', 'failed', 'bounced')),
  error         text,
  sent_at       timestamptz not null default now()
);
alter table public.email_log enable row level security;
create index idx_email_log_related on public.email_log(related_type, related_id);

-- ── Reminder log (prevents duplicate reminders) ─────────────
create table public.reminder_log (
  id             uuid primary key default gen_random_uuid(),
  record_type    text not null,
  record_id      uuid not null,
  reminder_type  text not null,
  sent_at        timestamptz not null default now(),
  unique (record_type, record_id, reminder_type)
);
alter table public.reminder_log enable row level security;

-- ── Audit log (append-only) ─────────────────────────────────
create table public.audit_log (
  id           uuid primary key default gen_random_uuid(),
  actor_id     uuid references auth.users(id),
  actor_email  text,
  action       text not null,
  record_type  text not null,
  record_id    uuid,
  before_data  jsonb,
  after_data   jsonb,
  ip_address   text,
  created_at   timestamptz not null default now()
);
alter table public.audit_log enable row level security;
create index idx_audit_log_actor on public.audit_log(actor_id);
create index idx_audit_log_record on public.audit_log(record_type, record_id);
create index idx_audit_log_created on public.audit_log(created_at);

-- No update or delete policies will be created for audit_log — it is append-only.
