import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="wrap max-w-4xl">
        <nav className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-stone-200">Home</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-stone-300 font-medium">Terms of Service</span>
        </nav>

        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold text-stone-100">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-[var(--muted)]">Last updated: October 2026. These terms apply to use of this website and to quotations issued through it.</p>

        <div className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-[#1c1d1a] p-8 sm:p-12 text-xs sm:text-sm leading-relaxed text-stone-300">
          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">1. Who we are</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Distaura is a business-to-business distribution service that connects suppliers of software and services with businesses in India. Distaura acts as a distributor or intermediary for the solutions listed on this site; the supplier named in a quotation is responsible for delivering and supporting its product or service, unless the quotation states otherwise.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">2. Quotations and pricing</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Information on this website is for general guidance and is not an offer. Prices and availability are confirmed only in a written quotation from Distaura. Taxes, payment terms, delivery timelines and support commitments are those stated in the quotation or in the agreement signed with you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">3. Accounts and enquiries</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Please provide accurate information when you submit an enquiry or create an account. Accounts are intended for businesses and individuals acting on behalf of a business with authority to commit to a purchase.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">4. Delivery and support</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Delivery, licensing, warranty and support for a product or service are provided as set out in the quotation and in the supplier&apos;s own terms. We will tell you which terms apply before you commit.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">5. Limitation of liability</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              To the extent permitted by law, Distaura is not liable for indirect or consequential losses, or for outages and failures of a supplier&apos;s own systems. Our liability for any engagement is limited to the fees we received for it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">6. Governing law</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              These terms are governed by the laws of India.
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
