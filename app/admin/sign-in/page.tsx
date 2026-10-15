import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminSignInForm } from '@/components/admin/admin-sign-in-form';
import { Mark } from '@/components/site/mark';
import { 
  ShieldCheck, Lock, KeyRound, Terminal, 
  ArrowLeft, CheckCircle2, ShieldAlert, Cpu 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Internal Operations Sign In | Distaura Security Gateway',
  description: 'Administrative command center sign-in for Distaura internal staff and operations.',
};

export default function AdminSignInPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#0a0b09] text-stone-100 flex flex-col justify-between">
      {/* Background ambient security glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 right-1/4 size-[600px] rounded-full bg-[var(--lime)]/10 blur-[150px]" />
        <div className="absolute -bottom-32 left-10 size-[500px] rounded-full bg-emerald-600/10 blur-[150px]" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 wrap flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <Mark className="size-10 drop-shadow-[0_0_20px_rgba(184,224,44,0.5)] transition-transform group-hover:scale-105" />
          <div>
            <span className="logo !text-2xl font-bold tracking-wider text-stone-100 block">
              DISTAURA
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[var(--lime-hi)] uppercase">
              Operations Control
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:bg-white/10 hover:text-white no-underline"
        >
          <ArrowLeft className="size-3.5" />
          <span>Public Exchange</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Security Dossier */}
            <div className="hidden lg:flex lg:col-span-6 flex-col justify-between pr-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--lime-hi)]">
                  <Terminal className="size-3.5" />
                  Restricted Gateway • Clearance Required
                </span>

                <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-stone-100 leading-tight">
                  Distribution operations & <br />
                  <span className="text-[var(--lime-hi)]">financial clearinghouse.</span>
                </h1>

                <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
                  Welcome to the internal administrative console. This portal governs OEM supplier contracts, real-time GST tax invoicing, distributor margin ledger accounting, and order fulfillment.
                </p>

                <div className="mt-8 space-y-3.5">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#141513]/70 p-4 backdrop-blur-md">
                    <ShieldCheck className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-stone-200">Database-Enforced AAL2 MFA</h4>
                      <p className="mt-0.5 text-[11px] text-[var(--muted)]">Mandatory time-based one-time password (TOTP) verification.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#141513]/70 p-4 backdrop-blur-md">
                    <Lock className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-stone-200">Strictly Invitation-Only Accounts</h4>
                      <p className="mt-0.5 text-[11px] text-[var(--muted)]">Public registrations are blocked at Postgres trigger level.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#141513]/70 p-4 backdrop-blur-md">
                    <Cpu className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-stone-200">Immutable Audit Trail</h4>
                      <p className="mt-0.5 text-[11px] text-[var(--muted)]">Every database modification is cryptographically recorded.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/5 pt-5 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Looking for the Customer Portal?</span>
                <Link
                  href="/sign-in"
                  className="font-medium text-[var(--lime-hi)] hover:underline no-underline"
                >
                  Customer Sign In →
                </Link>
              </div>
            </div>

            {/* Right Card: Authentication Console */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-[var(--lime)]/30 bg-[#161714]/95 p-8 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
                      Admin Credentials
                    </span>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                      SSL v3 • Protected
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-stone-100">
                    Sign in to Admin
                  </h2>
                  <p className="mt-1.5 text-xs text-[var(--muted)]">
                    Enter your authorized staff email and master password.
                  </p>
                </div>

                <AdminSignInForm />

                <div className="mt-8 border-t border-white/5 pt-5 text-center text-xs text-stone-500">
                  Lost operator credentials? Contact the <Link href="/contact" className="text-stone-400 hover:text-stone-200 underline">security administrator</Link>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center text-xs text-stone-600 border-t border-white/5">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>Distaura Administrative Terminal • Session ID: {new Date().toISOString().slice(0, 10)}</span>
          <div className="flex items-center gap-3">
            <span className="text-stone-500">Internal Use Only</span>
            <span>•</span>
            <Link href="/" className="text-stone-400 hover:text-stone-200 no-underline">Return Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
