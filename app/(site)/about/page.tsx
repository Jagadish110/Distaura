import Link from 'next/link';
import { 
  ShieldCheck, ArrowRight, Building2, Zap, Users2, 
  Award, Globe2, Sparkles, CheckCircle2, Lock
} from 'lucide-react';
import { Mark } from '@/components/site/mark';

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Hero */}
      <section className="wrap relative">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--lime-hi)]">
            <Sparkles className="size-3.5" />
            Our Mission & Foundation
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-100">
            Rebuilding software distribution <br />
            <span className="text-[var(--lime-hi)]">for the Indian enterprise economy.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--muted)]">
            India is experiencing an unprecedented surge in business digitisation. Yet, enterprise software procurement remains entangled in vendor mistrust, manual vendor onboarding, TDS deduction friction, and unpredictable collection cycles. Distaura was built to bridge this divide.
          </p>
        </div>
      </section>

      {/* The Problem & Our Solution */}
      <section className="wrap mt-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-red-500/20 bg-red-950/10 p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              The Broken Status Quo
            </span>
            <h3 className="mt-2 font-display text-xl font-bold text-stone-200">
              Friction, Delayed Payouts & Tax Overhead
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Software makers waste months chasing accounts receivable, managing localized GST reverse charges, and negotiating one-off procurement MSAs. Indian business buyers get stuck in protracted vendor empanelment processes, fearing vendor abandonment after payment.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--lime)]/30 bg-[var(--lime)]/5 p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--lime-hi)]">
              The Distaura Model
            </span>
            <h3 className="mt-2 font-display text-xl font-bold text-stone-200">
              Single Distributor of Record + Guaranteed Settlements
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Distaura acts as a unified legal and financial layer. Enterprises buy all software through a single pre-approved Indian entity with compliant GST input tax credit. Suppliers enjoy automated contract enforcement, zero credit default risk, and scheduled disbursements.
            </p>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="wrap mt-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="rounded-md border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3 py-1 text-xs font-semibold text-[var(--lime-hi)]">
            Architectural Principles
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-stone-100">
            Engineered for Compliance and Trust
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-stone-100">Database as Security Boundary</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              Row Level Security physically isolates customer purchase data from supplier commission records. Roles are cryptographically validated with Supabase AAL2 two-factor verification.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
              <Lock className="size-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-stone-100">Zero Supplier Login Burden</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              Software vendors should build products, not manage another SaaS admin portal. Order activations and license dispatches execute securely via cryptographically hashed single-use tokens.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#1c1d1a] p-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--lime)]/15 text-[var(--lime-hi)]">
              <Zap className="size-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-stone-100">Predictable Commercial Flow</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              Automatic renewal tracking with 60, 30, and 14-day proactive alerts. Transparent commission calculation, GST e-way billing, and real-time ledger accounting.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="wrap mt-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#21231f] to-[#171816] p-8 sm:p-12 text-center">
          <Mark className="mx-auto size-12 drop-shadow-[0_0_15px_rgba(184,224,44,0.4)]" />
          <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-stone-100">
            Ready to partner or modernise your software stack?
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)] max-w-lg mx-auto">
            Join hundreds of forward-thinking Indian businesses and innovative software vendors on Distaura.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="rounded-xl bg-[var(--lime)] px-5 py-3 text-xs font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)]"
            >
              Explore Software Catalogue
            </Link>
            <Link
              href="/partner"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-semibold text-stone-200 hover:bg-white/10"
            >
              Distribute Your Software
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
