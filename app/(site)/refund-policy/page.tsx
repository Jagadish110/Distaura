import Link from 'next/link';
import { ShieldCheck, ChevronRight, RefreshCw } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="wrap max-w-4xl">
        <nav className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-stone-200">Home</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-stone-300 font-medium">Refund & Cancellation Policy</span>
        </nav>

        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold text-stone-100">
          Refund & Cancellation Commercial Policy
        </h1>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Transparent guidelines for enterprise software licensing, trial periods, and credit notes
        </p>

        <div className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-[#1c1d1a] p-8 sm:p-12 text-xs sm:text-sm leading-relaxed text-stone-300">
          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">1. Pre-Activation Cancellations</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              If an order has been placed but the vendor has not yet generated and dispatched digital activation credentials or tenant provision tokens, an order may be cancelled with a 100% refund or credited towards another software solution.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">2. Post-Activation Policy & OEM Warranties</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Once software license keys or perpetual activation files are generated and accessed, refunds are subject to the specific upstream OEM manufacturer warranty terms. If the software suffers documented non-conformity or failure to meet the stated technical specifications, Distaura coordinates an immediate replacement or full credit note.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">3. Subscription Renewals & Termination</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Customers receive automatic renewal notices at 60, 30, and 14 calendar days prior to contract expiry. Subscriptions can be designated for non-renewal at any time through the Customer Portal with zero cancellation penalty.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">4. Credit Note Issuance & Adjustment</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Where refunds are approved, Distaura issues a statutory GST Credit Note compliant with Section 34 of the CGST Act. The credited amount may be adjusted against future invoices or refunded directly to the originating corporate bank account within 5–7 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
