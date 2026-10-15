-- ============================================================
-- seed.sql — Development seed data
-- Only run in development / staging, never in production
-- ============================================================

-- ── Categories ──────────────────────────────────────────────
insert into public.categories (name, slug, sort_order) values
  ('CRM', 'crm', 1),
  ('ERP', 'erp', 2),
  ('Accounting & Finance', 'accounting', 3),
  ('HR & Payroll', 'hr-payroll', 4),
  ('Project Management', 'project-management', 5),
  ('Marketing Automation', 'marketing', 6),
  ('E-commerce', 'ecommerce', 7),
  ('Communication', 'communication', 8),
  ('Cybersecurity', 'cybersecurity', 9),
  ('Data Analytics', 'analytics', 10)
on conflict (slug) do nothing;

-- ── Sample Supplier ─────────────────────────────────────────
insert into public.suppliers (id, name, contact_name, email, phone, website, city, state, status) values
  (
    'aaaaaaaa-0000-4000-a000-000000000001',
    'TechCorp India Pvt Ltd',
    'Rahul Sharma',
    'partners@techcorp.in',
    '+91 98765 43210',
    'https://techcorp.in',
    'Bengaluru',
    'Karnataka',
    'active'
  )
on conflict (id) do nothing;

-- ── Sample Supplier Payment Method ──────────────────────────
insert into public.supplier_payment_methods (supplier_id, method_type, bank_name, account_number, ifsc_code, instructions, is_default) values
  (
    'aaaaaaaa-0000-4000-a000-000000000001',
    'bank',
    'HDFC Bank',
    '50100123456789',
    'HDFC0001234',
    'Please transfer to the above account and share the UTR number.',
    true
  )
on conflict do nothing;

-- ── Sample Agreement ─────────────────────────────────────────
insert into public.agreements (supplier_id, commission_type, commission_value, due_days, grace_days, penalty_type, penalty_value, penalty_cap_pct, status) values
  (
    'aaaaaaaa-0000-4000-a000-000000000001',
    'percentage',
    15.00,
    30,
    7,
    'percentage_daily',
    0.05,
    10.00,
    'active'
  )
on conflict do nothing;

-- ── Sample Products ──────────────────────────────────────────
insert into public.products (id, supplier_id, category_id, name, slug, short_desc, description, features, status, sort_order)
select
  'bbbbbbbb-0000-4000-b000-000000000001',
  'aaaaaaaa-0000-4000-a000-000000000001',
  (select id from public.categories where slug = 'crm'),
  'TechCRM Pro',
  'techcrm-pro',
  'Complete CRM solution for growing Indian businesses',
  'TechCRM Pro is a full-featured customer relationship management platform designed for the Indian market. Supports GST, Hindi UI, and integrates with popular Indian payment gateways.',
  array['Lead management', 'Pipeline tracking', 'GST-compliant invoicing', 'WhatsApp integration', 'Mobile app', 'Hindi & English UI'],
  'published',
  1
on conflict (id) do nothing;

insert into public.products (id, supplier_id, category_id, name, slug, short_desc, description, features, status, sort_order)
select
  'bbbbbbbb-0000-4000-b000-000000000002',
  'aaaaaaaa-0000-4000-a000-000000000001',
  (select id from public.categories where slug = 'hr-payroll'),
  'PayrollEase',
  'payrollease',
  'Automated payroll and HR management for Indian companies',
  'PayrollEase handles your entire payroll cycle including PF, ESI, PT, and TDS. Generates Form 16, Form 12BB, and all statutory compliance reports automatically.',
  array['PF & ESI automation', 'TDS computation', 'Form 16 generation', 'Leave management', 'Attendance tracking', 'Mobile self-service'],
  'published',
  2
on conflict (id) do nothing;

-- ── Sample Plans ─────────────────────────────────────────────
insert into public.product_plans (product_id, name, plan_type, price_paise, tax_inclusive, features, is_active, sort_order) values
  ('bbbbbbbb-0000-4000-b000-000000000001', 'Starter', 'monthly', 299900, false, array['5 users', '1,000 contacts', 'Basic reporting'], true, 1),
  ('bbbbbbbb-0000-4000-b000-000000000001', 'Professional', 'monthly', 699900, false, array['25 users', '10,000 contacts', 'Advanced reporting', 'WhatsApp integration'], true, 2),
  ('bbbbbbbb-0000-4000-b000-000000000001', 'Enterprise', 'annual', 5999900, false, array['Unlimited users', 'Unlimited contacts', 'Custom integrations', 'Dedicated support'], true, 3),
  ('bbbbbbbb-0000-4000-b000-000000000002', 'Basic', 'monthly', 199900, false, array['Up to 25 employees', 'Payroll + PF + ESI', 'Form 16'], true, 1),
  ('bbbbbbbb-0000-4000-b000-000000000002', 'Standard', 'monthly', 449900, false, array['Up to 100 employees', 'All compliance reports', 'Leave + Attendance', 'Mobile app'], true, 2)
on conflict do nothing;

-- ── App Settings (singleton) ──────────────────────────────────
insert into public.app_settings (company_name, legal_name, invoice_prefix, financial_year_start, gst_rate, sender_name, commission_due_days, commission_grace_days)
select 'Distaura', 'Distaura Distribution Pvt Ltd', 'DIS', 4, 18.00, 'Distaura', 30, 7
where not exists (select 1 from public.app_settings);
