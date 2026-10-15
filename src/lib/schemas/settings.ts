import { z } from 'zod';

// ── App Settings (Admin) ─────────────────────────────────────
export const companySettingsSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  legalName: z.string().optional().or(z.literal('')),
  gstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN')
    .optional()
    .or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});
export type CompanySettingsInput = z.infer<typeof companySettingsSchema>;

export const invoiceSettingsSchema = z.object({
  invoicePrefix: z.string().min(2, 'Prefix is required').max(10),
  financialYearStart: z.number().int().min(1).max(12).default(4),
  gstRate: z.number().min(0).max(100).default(18),
  bankName: z.string().optional().or(z.literal('')),
  bankAccount: z.string().optional().or(z.literal('')),
  bankIfsc: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
    .optional()
    .or(z.literal('')),
  bankUpi: z.string().optional().or(z.literal('')),
});
export type InvoiceSettingsInput = z.infer<typeof invoiceSettingsSchema>;

export const emailSettingsSchema = z.object({
  senderName: z.string().min(2, 'Sender name is required'),
  senderEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
});
export type EmailSettingsInput = z.infer<typeof emailSettingsSchema>;

export const commissionDefaultsSchema = z.object({
  commissionDueDays: z.number().int().min(1).max(365).default(30),
  commissionGraceDays: z.number().int().min(0).max(90).default(7),
  penaltyRate: z.number().min(0).max(100).default(0),
  penaltyCapPct: z.number().min(0).max(100).default(10),
  reminderDays: z.array(z.number().int().positive()).default([30, 15, 7]),
});
export type CommissionDefaultsInput = z.infer<typeof commissionDefaultsSchema>;
