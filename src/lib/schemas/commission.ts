import { z } from 'zod';

// ── Record Commission Payment ────────────────────────────────
export const commissionPaymentSchema = z.object({
  commissionId: z.string().uuid(),
  amountRupees: z.number().positive('Amount must be greater than 0'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  method: z.string().optional().or(z.literal('')),
  reference: z.string().optional().or(z.literal(''))
    .describe('UTR number or transaction reference'),
});
export type CommissionPaymentInput = z.infer<typeof commissionPaymentSchema>;

// ── Waive Penalty ────────────────────────────────────────────
export const waivePenaltySchema = z.object({
  commissionId: z.string().uuid(),
  waiveAmountRupees: z.number().positive('Amount must be greater than 0'),
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)'),
});
export type WaivePenaltyInput = z.infer<typeof waivePenaltySchema>;

// ── Create Commission Invoice ────────────────────────────────
export const createInvoiceSchema = z.object({
  supplierId: z.string().uuid('Supplier is required'),
  commissionIds: z.array(z.string().uuid()).min(1, 'Select at least one commission'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional().or(z.literal('')),
});
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

// ── Credit Note ──────────────────────────────────────────────
export const creditNoteSchema = z.object({
  invoiceId: z.string().uuid(),
  reason: z.string().min(10, 'Please provide a reason'),
  amountRupees: z.number().positive('Amount must be greater than 0'),
});
export type CreditNoteInput = z.infer<typeof creditNoteSchema>;
