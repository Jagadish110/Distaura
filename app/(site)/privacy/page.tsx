import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="wrap max-w-4xl">
        <nav className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-stone-200">Home</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-stone-300 font-medium">Privacy Policy</span>
        </nav>

        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold text-stone-100">
          Privacy Policy & Data Protection Standards
        </h1>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Conforming to the Digital Personal Data Protection (DPDP) Act, 2023 of India
        </p>

        <div className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-[#1c1d1a] p-8 sm:p-12 text-xs sm:text-sm leading-relaxed text-stone-300">
          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">1. Information We Collect</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              We collect corporate identity information including company name, registered corporate address, business email, authorized representative contact name and phone number. We do not store sensitive payment card details; all banking and transaction processing is routed through RBI-compliant payment aggregators.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">2. Row Level Security & Architectural Isolation</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Customer data is safeguarded at the database level utilizing Postgres Row Level Security (RLS). Customer purchase histories, invoices, and internal company member rosters are never accessible to other customers or software suppliers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">3. Purpose of Processing</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Information is processed strictly for: fulfilling corporate software licenses, generating statutory GST invoices, dispatching renewal alerts, processing vendor payouts, and maintaining mandatory corporate audit logs.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-stone-100">4. Data Localization</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              In accordance with Indian regulatory directives, all customer transactional records, invoice archives, and audit data are stored within cloud data regions located physically within the Republic of India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
