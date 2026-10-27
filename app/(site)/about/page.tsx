import type { Metadata } from 'next';
import Link from 'next/link';
import { Handshake, Search, Users2, Sparkles } from 'lucide-react';
import { Mark } from '@/components/site/mark';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Distaura is a growing B2B distribution business connecting software and service suppliers with Indian businesses.',
};

const pillars = [
  {
    icon: Search,
    title: 'Matched to your need',
    copy: 'We start with your requirement and team, then check what our supplier partners can actually provide.',
  },
  {
    icon: Handshake,
    title: 'Agreed in writing',
    copy: 'Pricing, scope, support and responsibilities are confirmed with the supplier and with you before anything is committed.',
  },
  {
    icon: Users2,
    title: 'Supplier-led delivery',
    copy: 'The supplier delivers and supports the product or service. We coordinate, so you have one team to talk to.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="wrap relative">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--lime-hi)]">
            <Sparkles className="size-3.5" />
            About Distaura
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-100">
            A distribution partner <br />
            <span className="text-[var(--lime-hi)]">for Indian businesses.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--muted)]">
            Many software and service providers want to reach Indian businesses but do not have a local
            sales presence. Many Indian businesses want a dependable, local point of contact when
            choosing a solution. Distaura connects the two.
          </p>
        </div>
      </section>

      <section className="wrap mt-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#1c1d1a] p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">For businesses</span>
            <h2 className="mt-2 font-display text-xl font-bold text-stone-200">Find a solution and get a clear quote</h2>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              Tell us what you need. We check it with our suppliers and send you a written quotation, so
              you know the scope and price before you decide.
            </p>
          </div>
          <div className="rounded-3xl border border-[var(--lime)]/30 bg-[var(--lime)]/5 p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--lime-hi)]">For suppliers</span>
            <h2 className="mt-2 font-display text-xl font-bold text-stone-200">Reach customers in India</h2>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              We act as a distribution partner on terms agreed in writing. We bring qualified enquiries;
              you keep delivery and the customer relationship.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap mt-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-stone-100">How we work</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {pillars.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-stone-100">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap mt-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#21231f] to-[#171816] p-8 sm:p-12 text-center">
          <Mark className="mx-auto size-12 drop-shadow-[0_0_15px_rgba(184,224,44,0.4)]" />
          <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            Talk to us about your requirement
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)] max-w-lg mx-auto">
            Email <a className="text-[var(--lime-hi)]" href={`mailto:${site.emails.hello}`}>{site.emails.hello}</a> or
            call <a className="text-[var(--lime-hi)]" href={site.phoneHref}>{site.phone}</a>.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/find-a-solution"
              className="rounded-xl bg-[var(--lime)] px-5 py-3 text-xs font-bold text-stone-950 no-underline transition-all hover:bg-[var(--lime-hi)]"
            >
              Request a Quote
            </Link>
            <Link
              href="/partner"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-semibold text-stone-200 no-underline hover:bg-white/10"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
