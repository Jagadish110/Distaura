import Link from 'next/link';
import { ShieldCheck, FileText, ChevronRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="wrap max-w-4xl">
        <nav className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-stone-200">Home</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-stone-300 font-medium">Terms of Distribution & Use</span>
        </nav>

        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold text-stone-100">
          Terms of Commercial Distribution & Platform Use
        </h1>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Last updated: October 2026 • Governed under the Information Technology Act, 2000 and laws of India
        </p>

        <div className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-[#1c1d1a] p-8 sm:p-12 text-xs sm:text-sm leading-relaxed text-stone-300">
          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">1. Commercial Role of Distaura</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Distaura Distribution Technologies Pvt Ltd operates as an authorized enterprise software distributor and marketplace. When purchasing software subscriptions or licenses, Distaura issues the commercial Tax Invoice as the Vendor of Record, while the respective OEM (Original Equipment Manufacturer) provides the underlying software code and warranties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">2. Customer Account & Authority</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Customer accounts are strictly intended for verified commercial and business entities. By registering an account, the user warrants that they possess legal authority to bind their organization and commit to corporate purchase orders issued through the portal.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">3. Taxation, Invoicing & GST Compliance</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              All prices displayed on Distaura are quoted in Indian Rupees (INR) exclusive of Goods and Services Tax (GST). Official Tax Invoices will be generated and dispatched with HSN/SAC codes conforming to GST regulations, enabling eligible Indian registered enterprises to claim Input Tax Credit (ITC).
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">4. Software License Delivery & SLAs</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              License keys, activation links, or cloud tenant credentials are delivered electronically via the customer portal and verified email upon successful order confirmation or milestone approval. Fulfillment SLAs vary per product and are guaranteed as stated on respective product detail pages.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">5. Limitation of Liability</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Distaura is not liable for secondary damages or service outages attributable to upstream software vendor cloud infrastructures. In all events, Distaura's aggregate commercial liability is limited to the distributor fee received for the specific active license period.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
