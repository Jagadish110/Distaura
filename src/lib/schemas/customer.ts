import { z } from 'zod';

// ── Customer Onboarding ─────────────────────────────────────

export const companyDetailsSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  businessType: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
});
export type CompanyDetailsInput = z.infer<typeof companyDetailsSchema>;

export const addressContactSchema = z.object({
  billingAddress: z.string().min(5, 'Billing address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid pincode').optional().or(z.literal('')),
  contactPerson: z.string().min(2, 'Contact person is required'),
  contactRole: z.string().optional(),
  contactPhone: z.string().min(10, 'Phone number is required'),
});
export type AddressContactInput = z.infer<typeof addressContactSchema>;

export const categoriesSchema = z.object({
  categories: z.array(z.string()).default([]),
});
export type CategoriesInput = z.infer<typeof categoriesSchema>;

// ── Company Profile (full edit) ─────────────────────────────
export const companyProfileSchema = companyDetailsSchema.merge(addressContactSchema);
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
