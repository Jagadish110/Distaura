import { z } from 'zod';

// ── Supplier Form ────────────────────────────────────────────
export const supplierSchema = z.object({
  name: z.string().min(2, 'Supplier name is required'),
  contactName: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  country: z.string().default('India'),
  gstin: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GSTIN format',
    )
    .optional()
    .or(z.literal('')),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
    .optional()
    .or(z.literal('')),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  notes: z.string().optional().or(z.literal('')),
});
export type SupplierInput = z.infer<typeof supplierSchema>;

// ── Supplier Payment Method ──────────────────────────────────
export const supplierPaymentMethodSchema = z
  .object({
    supplierId: z.string().uuid(),
    methodType: z.enum(['bank', 'upi', 'checkout_link']),
    label: z.string().optional().or(z.literal('')),
    bankName: z.string().optional().or(z.literal('')),
    accountNumber: z.string().optional().or(z.literal('')),
    ifscCode: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
      .optional()
      .or(z.literal('')),
    upiId: z.string().optional().or(z.literal('')),
    checkoutUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    instructions: z.string().optional().or(z.literal('')),
    isDefault: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.methodType === 'bank') {
      if (!data.bankName)
        ctx.addIssue({ code: 'custom', path: ['bankName'], message: 'Bank name is required' });
      if (!data.accountNumber)
        ctx.addIssue({
          code: 'custom',
          path: ['accountNumber'],
          message: 'Account number is required',
        });
      if (!data.ifscCode)
        ctx.addIssue({ code: 'custom', path: ['ifscCode'], message: 'IFSC is required' });
    }
    if (data.methodType === 'upi' && !data.upiId) {
      ctx.addIssue({ code: 'custom', path: ['upiId'], message: 'UPI ID is required' });
    }
    if (data.methodType === 'checkout_link' && !data.checkoutUrl) {
      ctx.addIssue({
        code: 'custom',
        path: ['checkoutUrl'],
        message: 'Checkout URL is required',
      });
    }
  });
export type SupplierPaymentMethodInput = z.infer<typeof supplierPaymentMethodSchema>;

// ── Agreement Form ───────────────────────────────────────────
export const agreementSchema = z.object({
  supplierId: z.string().uuid(),
  commissionType: z.enum(['percentage', 'fixed']),
  commissionValue: z.number().min(0, 'Must be 0 or more'),
  commissionOnTaxInclusive: z.boolean().default(false),
  dueDays: z.number().int().min(1).max(365),
  graceDays: z.number().int().min(0).max(90),
  penaltyType: z.enum(['percentage_daily', 'fixed_daily']),
  penaltyValue: z.number().min(0),
  penaltyCapPct: z.number().min(0).max(100),
  renewalsEarnCommission: z.boolean().default(true),
  autoRenew: z.boolean().default(true),
  signedFileUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  validFrom: z.string().min(1, 'Start date is required'), // ISO date string
  validTo: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'expired', 'terminated']).default('active'),
});
export type AgreementInput = z.infer<typeof agreementSchema>;
