import { z } from 'zod';

// ── Public Enquiry Forms ─────────────────────────────────────

export const businessEnquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  companyName: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Phone number is required')
    .regex(/^[+]?[\d\s-]+$/, 'Invalid phone number'),
  message: z.string().min(10, 'Please describe what you need (at least 10 characters)'),
});
export type BusinessEnquiryInput = z.infer<typeof businessEnquirySchema>;

export const supplierEnquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  companyName: z.string().min(2, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Phone number is required')
    .regex(/^[+]?[\d\s-]+$/, 'Invalid phone number'),
  productDesc: z.string().min(20, 'Please describe your product or service (at least 20 characters)'),
  message: z.string().optional().or(z.literal('')),
});
export type SupplierEnquiryInput = z.infer<typeof supplierEnquirySchema>;

// ── Enquiry Note (Admin) ─────────────────────────────────────
export const enquiryNoteSchema = z.object({
  enquiryId: z.string().uuid(),
  note: z.string().min(1, 'Note is required'),
  followUpDate: z.string().optional().or(z.literal('')),
});
export type EnquiryNoteInput = z.infer<typeof enquiryNoteSchema>;
