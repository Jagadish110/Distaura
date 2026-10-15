-- ============================================================
-- 00006_rls_policies.sql
-- Row Level Security policies for all tables
-- Default deny: RLS is already enabled, these grant access
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- PROFILES
-- ════════════════════════════════════════════════════════════
create policy "Users read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Admin reads all profiles"
  on public.profiles for select
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- USER ROLES — no browser policies. Server-only (service_role).
-- ════════════════════════════════════════════════════════════
-- Users can read their own roles (needed for route guards)
create policy "Users read own roles"
  on public.user_roles for select
  using (user_id = auth.uid());

-- ════════════════════════════════════════════════════════════
-- COMPANIES
-- ════════════════════════════════════════════════════════════
create policy "Users read own company"
  on public.companies for select
  using (user_id = auth.uid());

create policy "Users update own company"
  on public.companies for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users insert own company"
  on public.companies for insert
  with check (user_id = auth.uid());

create policy "Admin reads all companies"
  on public.companies for select
  using (public.is_team() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- TEAM INVITES (admin only)
-- ════════════════════════════════════════════════════════════
create policy "Admin manages invites"
  on public.team_invites for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- APP SETTINGS (admin only)
-- ════════════════════════════════════════════════════════════
create policy "Admin reads settings"
  on public.app_settings for select
  using (public.is_admin() and public.is_aal2());

create policy "Admin updates settings"
  on public.app_settings for update
  using (public.is_admin() and public.is_aal2());

create policy "Admin inserts settings"
  on public.app_settings for insert
  with check (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- CATEGORIES (public read, admin write)
-- ════════════════════════════════════════════════════════════
create policy "Anyone reads categories"
  on public.categories for select
  using (true);

create policy "Admin manages categories"
  on public.categories for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- SUPPLIERS (admin/team only)
-- ════════════════════════════════════════════════════════════
create policy "Team reads suppliers"
  on public.suppliers for select
  using (public.has_permission('suppliers') and public.is_aal2());

create policy "Admin manages suppliers"
  on public.suppliers for all
  using (public.is_admin() and public.is_aal2());

create policy "Team with perm manages suppliers"
  on public.suppliers for insert
  with check (public.has_permission('suppliers') and public.is_aal2());

create policy "Team with perm updates suppliers"
  on public.suppliers for update
  using (public.has_permission('suppliers') and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- SUPPLIER PAYMENT METHODS (admin/team only)
-- ════════════════════════════════════════════════════════════
create policy "Team reads payment methods"
  on public.supplier_payment_methods for select
  using (public.has_permission('suppliers') and public.is_aal2());

create policy "Admin manages payment methods"
  on public.supplier_payment_methods for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- AGREEMENTS (admin/team only)
-- ════════════════════════════════════════════════════════════
create policy "Team reads agreements"
  on public.agreements for select
  using (public.has_permission('suppliers') and public.is_aal2());

create policy "Admin manages agreements"
  on public.agreements for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- PRODUCTS (admin writes, public reads published via view)
-- ════════════════════════════════════════════════════════════
create policy "Team reads all products"
  on public.products for select
  using (public.has_permission('products') and public.is_aal2());

create policy "Admin manages products"
  on public.products for all
  using (public.is_admin() and public.is_aal2());

create policy "Team with perm manages products"
  on public.products for insert
  with check (public.has_permission('products') and public.is_aal2());

create policy "Team with perm updates products"
  on public.products for update
  using (public.has_permission('products') and public.is_aal2());

-- For the public_products view to work, anon/authenticated need
-- to read published products through the view's underlying tables
create policy "Public reads published products"
  on public.products for select
  using (status = 'published');

create policy "Public reads active suppliers for catalogue"
  on public.suppliers for select
  using (status = 'active');

-- ════════════════════════════════════════════════════════════
-- PRODUCT PLANS
-- ════════════════════════════════════════════════════════════
create policy "Public reads active plans"
  on public.product_plans for select
  using (is_active = true);

create policy "Team reads all plans"
  on public.product_plans for select
  using (public.has_permission('products') and public.is_aal2());

create policy "Admin manages plans"
  on public.product_plans for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- PRODUCT COMMISSION OVERRIDES (admin only)
-- ════════════════════════════════════════════════════════════
create policy "Admin manages commission overrides"
  on public.product_commission_overrides for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- PRICE HISTORY (admin/team only)
-- ════════════════════════════════════════════════════════════
create policy "Team reads price history"
  on public.price_history for select
  using (public.has_permission('products') and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- ORDERS
-- ════════════════════════════════════════════════════════════
create policy "Customer reads own orders"
  on public.orders for select
  using (company_id = public.my_company_id());

-- Customers create orders via secure function only (no direct insert)
-- but we need the policy for the function to work with the user's context
create policy "Customer inserts own order"
  on public.orders for insert
  with check (requested_by = auth.uid() and company_id = public.my_company_id());

create policy "Team reads orders"
  on public.orders for select
  using (public.has_permission('orders') and public.is_aal2());

create policy "Admin manages orders"
  on public.orders for all
  using (public.is_admin() and public.is_aal2());

create policy "Team updates orders"
  on public.orders for update
  using (public.has_permission('orders') and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- ORDER TERMS SNAPSHOT (admin only, never customer)
-- ════════════════════════════════════════════════════════════
create policy "Admin reads terms snapshot"
  on public.order_terms_snapshot for select
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- ORDER EVENTS
-- ════════════════════════════════════════════════════════════
create policy "Customer reads own order events"
  on public.order_events for select
  using (
    order_id in (
      select id from public.orders where company_id = public.my_company_id()
    )
  );

create policy "Team reads order events"
  on public.order_events for select
  using (public.has_permission('orders') and public.is_aal2());

create policy "Admin manages order events"
  on public.order_events for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- SUPPLIER ACTION TOKENS (server-only write, no browser access)
-- ════════════════════════════════════════════════════════════
-- No browser policies — managed via Edge Functions with service_role

-- ════════════════════════════════════════════════════════════
-- SUPPLIER CONFIRMATIONS (server-only write)
-- ════════════════════════════════════════════════════════════
create policy "Team reads confirmations"
  on public.supplier_confirmations for select
  using (public.has_permission('orders') and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- DOCUMENTS
-- ════════════════════════════════════════════════════════════
create policy "Customer reads own documents"
  on public.documents for select
  using (
    (owner_type = 'order' and owner_id in (
      select id from public.orders where company_id = public.my_company_id()
    ))
    or
    (owner_type = 'company' and owner_id = public.my_company_id())
  );

create policy "Customer uploads to own order"
  on public.documents for insert
  with check (
    owner_type = 'order' and owner_id in (
      select id from public.orders where company_id = public.my_company_id()
    ) and uploaded_by = auth.uid()
  );

create policy "Team reads all documents"
  on public.documents for select
  using (public.has_permission('orders') and public.is_aal2());

create policy "Admin manages documents"
  on public.documents for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- RENEWALS
-- ════════════════════════════════════════════════════════════
create policy "Customer reads own renewals"
  on public.renewals for select
  using (
    order_id in (
      select id from public.orders where company_id = public.my_company_id()
    )
  );

create policy "Team reads renewals"
  on public.renewals for select
  using (public.has_permission('orders') and public.is_aal2());

create policy "Admin manages renewals"
  on public.renewals for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- COMMISSIONS (admin/team only — NEVER customer)
-- ════════════════════════════════════════════════════════════
create policy "Team reads commissions"
  on public.commissions for select
  using (public.has_permission('commissions') and public.is_aal2());

create policy "Admin manages commissions"
  on public.commissions for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- COMMISSION PAYMENTS (admin only)
-- ════════════════════════════════════════════════════════════
create policy "Team reads commission payments"
  on public.commission_payments for select
  using (public.has_permission('commissions') and public.is_aal2());

create policy "Admin manages commission payments"
  on public.commission_payments for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- COMMISSION INVOICES (admin only)
-- ════════════════════════════════════════════════════════════
create policy "Team reads invoices"
  on public.commission_invoices for select
  using (public.has_permission('invoices') and public.is_aal2());

create policy "Admin manages invoices"
  on public.commission_invoices for all
  using (public.is_admin() and public.is_aal2());

create policy "Team reads invoice lines"
  on public.commission_invoice_lines for select
  using (public.has_permission('invoices') and public.is_aal2());

create policy "Admin manages invoice lines"
  on public.commission_invoice_lines for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- CREDIT NOTES (admin only)
-- ════════════════════════════════════════════════════════════
create policy "Admin manages credit notes"
  on public.credit_notes for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- INVOICE COUNTERS (admin only)
-- ════════════════════════════════════════════════════════════
create policy "Admin manages counters"
  on public.invoice_counters for all
  using (public.is_admin() and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- ENQUIRIES (public insert, admin read/manage)
-- ════════════════════════════════════════════════════════════
create policy "Anyone can submit enquiry"
  on public.enquiries for insert
  with check (true);

create policy "Team reads enquiries"
  on public.enquiries for select
  using (public.has_permission('enquiries') and public.is_aal2());

create policy "Admin manages enquiries"
  on public.enquiries for all
  using (public.is_admin() and public.is_aal2());

create policy "Team updates enquiries"
  on public.enquiries for update
  using (public.has_permission('enquiries') and public.is_aal2());

-- ════════════════════════════════════════════════════════════
-- ENQUIRY NOTES (admin/team only)
-- ════════════════════════════════════════════════════════════
create policy "Team reads enquiry notes"
  on public.enquiry_notes for select
  using (public.has_permission('enquiries') and public.is_aal2());

create policy "Team inserts enquiry notes"
  on public.enquiry_notes for insert
  with check (public.has_permission('enquiries') and public.is_aal2() and author_id = auth.uid());

-- ════════════════════════════════════════════════════════════
-- NOTIFICATIONS
-- ════════════════════════════════════════════════════════════
create policy "Users read own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users update own notifications"
  on public.notifications for update
  using (user_id = auth.uid());

-- ════════════════════════════════════════════════════════════
-- AUDIT LOG (read only for admin, no update/delete ever)
-- ════════════════════════════════════════════════════════════
create policy "Admin reads audit log"
  on public.audit_log for select
  using (public.is_admin() and public.is_aal2());

-- No insert policy for browser — audit log written by triggers/service_role only

-- ════════════════════════════════════════════════════════════
-- EMAIL LOG, REMINDER LOG (server-only, no browser access)
-- ════════════════════════════════════════════════════════════
-- Admin can read email log
create policy "Admin reads email log"
  on public.email_log for select
  using (public.is_admin() and public.is_aal2());
