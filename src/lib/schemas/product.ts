import { z } from 'zod';

// ── Product Form ─────────────────────────────────────────────
export const productSchema = z.object({
  supplierId: z.string().uuid('Supplier is required'),
  categoryId: z.string().uuid().optional().or(z.literal('')),
  name: z.string().min(2, 'Product name is required'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  shortDesc: z.string().max(200, 'Max 200 characters').optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  features: z.array(z.string()).default([]),
  demoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  deliveryTime: z.string().optional().or(z.literal('')),
  supportEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  supportPhone: z.string().optional().or(z.literal('')),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  images: z.array(z.string().url()).default([]),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  sortOrder: z.number().int().default(0),
});
export type ProductInput = z.infer<typeof productSchema>;

// ── Product Plan Form ────────────────────────────────────────
export const productPlanSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(1, 'Plan name is required'),
  planType: z.enum(['one_time', 'monthly', 'quarterly', 'annual']),
  priceRupees: z.number().min(0, 'Price must be 0 or more'), // UI uses rupees, we convert to paise
  currency: z.string().default('INR'),
  taxInclusive: z.boolean().default(false),
  userLimit: z.number().int().positive().optional().nullable(),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type ProductPlanInput = z.infer<typeof productPlanSchema>;

// ── Category Form ────────────────────────────────────────────
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  sortOrder: z.number().int().default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;
