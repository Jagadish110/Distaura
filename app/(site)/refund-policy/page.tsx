import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Refund & Cancellation Policy' };

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
          Refund & Cancellation Policy
        </h1>
        <p className="mt-2 text-xs text-[var(--muted)]">Last updated: October 2026.</p>

        <div className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-[#1c1d1a] p-8 sm:p-12 text-xs sm:text-sm leading-relaxed text-stone-300">
          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">1. Before work or delivery begins</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              If you wish to cancel an accepted quotation before the supplier has started delivery or activated anything for you, tell us as soon as possible and we will work with the supplier to cancel and refund any amount you have paid, less any costs that cannot be recovered.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">2. After delivery or activation</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Refunds after delivery or activation depend on the supplier&apos;s own terms and on what is stated in your quotation. If a product or service does not match what was agreed, contact us and we will raise it with the supplier.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">3. Renewals</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Where a subscription renews, the renewal terms are set out in your quotation or agreement. Contact us before the renewal date if you do not wish to renew.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">4. How refunds are made</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Approved refunds are returned to the original payer, and any credit note is issued as required by applicable tax rules. Timelines depend on the payment method and the supplier.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">Contact</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Questions about this page? Email{' '}
              <a className="text-[var(--lime-hi)]" href={`mailto:${site.emails.hello}`}>{site.emails.hello}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
