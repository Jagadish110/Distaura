/**
 * Confirmed solutions available through Distaura's supplier partners.
 *
 * Only add an entry once the supplier (e.g. Acreo Tech) has confirmed in writing
 * that the solution is available, how it is described, and — if shown — its price.
 * Leave `priceNote` undefined to display "Price on request" instead of a number.
 */
export interface Offering {
  slug: string;
  name: string;
  supplier: string;
  summary: string;
  targetCustomers: string;
  benefits: string[];
  /** Supplier-approved pricing text, e.g. "From ₹X per user / month + GST". */
  priceNote?: string;
}

export const offerings: Offering[] = [];
