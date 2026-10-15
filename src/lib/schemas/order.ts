import { z } from 'zod';

// ── Buy Request (Customer creates order) ─────────────────────
export const buyRequestSchema = z.object({
  productId: z.string().uuid('Product is required'),
  planId: z.string().uuid('Plan is required'),
  quantity: z.number().int().min(1).max(1000).default(1),
  notes: z.string().max(500).optional().or(z.literal('')),
});
export type BuyRequestInput = z.infer<typeof buyRequestSchema>;

// ── Order Status Update (Admin) ──────────────────────────────
export const orderStatusUpdateSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum([
    'pending',
    'supplier_confirmed',
    'payment_received',
    'delivered',
    'completed',
    'cancelled',
    'refunded',
  ]),
  note: z.string().max(500).optional().or(z.literal('')),
});
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;

// ── Record Payment (Admin) ───────────────────────────────────
export const recordPaymentSchema = z.object({
  orderId: z.string().uuid(),
  amountRupees: z.number().positive('Amount must be greater than 0'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  method: z.string().optional().or(z.literal('')),
  reference: z.string().optional().or(z.literal('')),
  note: z.string().optional().or(z.literal('')),
});
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

// ── Supplier Confirmation (token link) ──────────────────────
export const supplierConfirmPaymentSchema = z.object({
  token: z.string().min(1),
  amountRupees: z.number().positive('Amount must be greater than 0'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  invoiceNumber: z.string().optional().or(z.literal('')),
  note: z.string().optional().or(z.literal('')),
});
export type SupplierConfirmPaymentInput = z.infer<typeof supplierConfirmPaymentSchema>;

export const supplierConfirmDeliverySchema = z.object({
  token: z.string().min(1),
  note: z.string().optional().or(z.literal('')),
});
export type SupplierConfirmDeliveryInput = z.infer<typeof supplierConfirmDeliverySchema>;
