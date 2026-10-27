import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ClipboardList, MessageSquareQuote, FileCheck2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing & Quotations',
  description:
    'Distaura prices each solution to your requirement. Learn how our quotation process works and request a quote.',
};

const steps = [
  {
    icon: ClipboardList,
    title: '1. Tell us what you need',
    copy: 'Share your requirement, team size and an approximate budget range. A short description is enough to start.',
  },
  {
    icon: MessageSquareQuote,
    title: '2. We confirm with the supplier',
    copy: 'We check scope and commercial terms with the supplier, so the quote reflects what can actually be delivered.',
  },
  {
    icon: FileCheck2,
    title: '3. You receive a written quote',
    copy: 'You get a written quotation with scope, price and terms. Taxes and payment terms are stated on the quote itself.',
  },
];

export default function PricingPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="wrap max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--lime-hi)]">
          Pricing &amp; quotations
        </span>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-stone-100">
          Priced to your requirement, <span className="text-[var(--lime-hi)]">confirmed in writing.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--muted)]">
          Final pricing depends on scope, number of users and the supplier&apos;s terms, so we do not
          publish fixed price lists. Every engagement starts with a written quotation.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="card">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-[var(--lime)]/10 text-[var(--lime)]">
                <Icon className="size-5" />
              </div>
              <h2 className="font-display text-lg font-semibold text-[var(--lime-hi)]">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-[var(--lime)]/25 bg-[#1e2218] p-8 sm:p-10">
          <h2 className="font-display text-2xl font-bold text-stone-100">Ready for a quote?</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            It takes about two minutes. We will reply with next steps by email or phone.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/find-a-solution"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--lime)] px-5 py-3 text-sm font-bold text-stone-950 no-underline transition-all hover:bg-[var(--lime-hi)]"
            >
              Request a Quote <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-stone-200 no-underline hover:bg-white/10"
            >
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
