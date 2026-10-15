// ============================================================
// Distaura Constants
// Enums, categories, and configuration values
// ============================================================

// ── User Roles ──────────────────────────────────────────────
export const USER_ROLES = ['customer', 'admin', 'team'] as const;
export type UserRole = (typeof USER_ROLES)[number];

// ── Team Permissions ────────────────────────────────────────
export const PERMISSIONS = [
  'suppliers',
  'products',
  'orders',
  'commissions',
  'invoices',
  'enquiries',
  'reports',
  'team',
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<Permission, string> = {
  suppliers: 'Suppliers & Agreements',
  products: 'Products & Catalogue',
  orders: 'Orders & Deliveries',
  commissions: 'Commission Ledger',
  invoices: 'Commission Invoices',
  enquiries: 'Enquiries & Leads',
  reports: 'Reports & Analytics',
  team: 'Team Management',
};

// ── Business Types ──────────────────────────────────────────
export const BUSINESS_TYPES = [
  'sole_proprietor',
  'partnership',
  'pvt_ltd',
  'llp',
  'public_ltd',
  'other',
] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  sole_proprietor: 'Sole Proprietorship',
  partnership: 'Partnership',
  pvt_ltd: 'Private Limited',
  llp: 'LLP',
  public_ltd: 'Public Limited',
  other: 'Other',
};

// ── Industries ──────────────────────────────────────────────
export const INDUSTRIES = [
  'technology',
  'manufacturing',
  'retail',
  'healthcare',
  'education',
  'finance',
  'real_estate',
  'logistics',
  'hospitality',
  'agriculture',
  'media',
  'consulting',
  'legal',
  'other',
] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const INDUSTRY_LABELS: Record<Industry, string> = {
  technology: 'Technology & IT',
  manufacturing: 'Manufacturing',
  retail: 'Retail & E-commerce',
  healthcare: 'Healthcare & Pharma',
  education: 'Education & EdTech',
  finance: 'Finance & Banking',
  real_estate: 'Real Estate',
  logistics: 'Logistics & Supply Chain',
  hospitality: 'Hospitality & Travel',
  agriculture: 'Agriculture',
  media: 'Media & Entertainment',
  consulting: 'Consulting',
  legal: 'Legal Services',
  other: 'Other',
};

// ── Company Sizes ───────────────────────────────────────────
export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '500+',
] as const;
export type CompanySize = (typeof COMPANY_SIZES)[number];

// ── Order Statuses ──────────────────────────────────────────
export const ORDER_STATUSES = [
  'pending',
  'supplier_confirmed',
  'payment_received',
  'delivered',
  'completed',
  'cancelled',
  'refunded',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  supplier_confirmed: 'Supplier Confirmed',
  payment_received: 'Payment Received',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  supplier_confirmed: 'bg-blue-500/20 text-blue-400',
  payment_received: 'bg-emerald-500/20 text-emerald-400',
  delivered: 'bg-violet-500/20 text-violet-400',
  completed: 'bg-lime-500/20 text-lime-400',
  cancelled: 'bg-red-500/20 text-red-400',
  refunded: 'bg-orange-500/20 text-orange-400',
};

// ── Commission Statuses ─────────────────────────────────────
export const COMMISSION_STATUSES = [
  'pending',
  'due',
  'overdue',
  'paid',
  'waived',
  'cancelled',
] as const;
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  pending: 'Pending',
  due: 'Due',
  overdue: 'Overdue',
  paid: 'Paid',
  waived: 'Waived',
  cancelled: 'Cancelled',
};

// ── Supplier Statuses ───────────────────────────────────────
export const SUPPLIER_STATUSES = ['active', 'inactive', 'suspended'] as const;
export type SupplierStatus = (typeof SUPPLIER_STATUSES)[number];

// ── Product Statuses ────────────────────────────────────────
export const PRODUCT_STATUSES = ['draft', 'published', 'archived'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

// ── Plan Types ──────────────────────────────────────────────
export const PLAN_TYPES = ['one_time', 'monthly', 'quarterly', 'annual'] as const;
export type PlanType = (typeof PLAN_TYPES)[number];

export const PLAN_TYPE_LABELS: Record<PlanType, string> = {
  one_time: 'One-Time',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
};

// ── Commission Types ────────────────────────────────────────
export const COMMISSION_TYPES = ['percentage', 'fixed'] as const;
export type CommissionType = (typeof COMMISSION_TYPES)[number];

// ── Penalty Types ───────────────────────────────────────────
export const PENALTY_TYPES = ['percentage_daily', 'fixed_daily'] as const;
export type PenaltyType = (typeof PENALTY_TYPES)[number];

// ── Agreement Statuses ──────────────────────────────────────
export const AGREEMENT_STATUSES = ['active', 'expired', 'terminated'] as const;
export type AgreementStatus = (typeof AGREEMENT_STATUSES)[number];

// ── Enquiry Types ───────────────────────────────────────────
export const ENQUIRY_TYPES = ['business', 'supplier'] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export const ENQUIRY_STATUSES = ['new', 'in_progress', 'responded', 'closed'] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

// ── Renewal Statuses ────────────────────────────────────────
export const RENEWAL_STATUSES = ['upcoming', 'due', 'renewed', 'lapsed'] as const;
export type RenewalStatus = (typeof RENEWAL_STATUSES)[number];

// ── Invoice Statuses ────────────────────────────────────────
export const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'cancelled'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

// ── Payment Method Types ────────────────────────────────────
export const PAYMENT_METHOD_TYPES = ['bank', 'upi', 'checkout_link'] as const;
export type PaymentMethodType = (typeof PAYMENT_METHOD_TYPES)[number];

// ── Document Types ──────────────────────────────────────────
export const DOCUMENT_TYPES = [
  'invoice',
  'payment_proof',
  'agreement',
  'delivery_proof',
  'other',
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

// ── Indian States ───────────────────────────────────────────
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry',
] as const;

// ── Software Categories (for customer onboarding) ───────────
export const SOFTWARE_CATEGORIES = [
  'CRM', 'ERP', 'Accounting', 'HR & Payroll', 'Project Management',
  'Marketing Automation', 'E-commerce', 'Communication & Collaboration',
  'Cybersecurity', 'Data Analytics', 'DevOps & Cloud',
  'Document Management', 'Customer Support', 'Inventory & Warehouse',
  'Legal & Compliance', 'Design & Creative', 'Other',
] as const;

// ── Money Helpers ───────────────────────────────────────────
/** Convert paise (integer) to rupees (display string) */
export function paiseToRupees(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(paise / 100);
}

/** Convert rupees (decimal) to paise (integer) */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

// ── Financial Year ──────────────────────────────────────────
/** Get financial year string for a date, e.g. '26-27' for Oct 2026 */
export function getFinancialYear(date: Date = new Date()): string {
  const month = date.getMonth() + 1; // 1-indexed
  const year = date.getFullYear() % 100;
  if (month >= 4) {
    return `${year}-${(year + 1).toString().padStart(2, '0')}`;
  }
  return `${year - 1}-${year.toString().padStart(2, '0')}`;
}

// ── Onboarding Steps ────────────────────────────────────────
export const ONBOARDING_STEPS = [
  { step: 1, title: 'Welcome', description: 'How buying on Distaura works' },
  { step: 2, title: 'Company Details', description: 'Tell us about your business' },
  { step: 3, title: 'Address & Contact', description: 'Where to invoice and who to contact' },
  { step: 4, title: 'What do you need?', description: 'Pick software categories (optional)' },
] as const;
