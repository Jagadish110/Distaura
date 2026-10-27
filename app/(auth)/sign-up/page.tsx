import type { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { Building2, ShieldCheck, CheckCircle2, FileText, ArrowRight, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create Account | Distaura Customer Portal',
  description: 'Create a Distaura customer account to track your quotes and enquiries.',
};

export default function SignUpPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
      {/* Left Column: Value Proposition & Onboarding Benefits */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between pr-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--lime-hi)]">
            <Building2 className="size-3.5" />
            Corporate Account Registration
          </span>

          <h2 className="mt-5 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-100 leading-tight">
            Create your customer account <br />
            <span className="text-[var(--lime-hi)]">to follow your quotes.</span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            Create an account for your company to browse our solutions and keep track of your quotation requests.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#1a1b18]/60 p-4 backdrop-blur-md">
              <ShieldCheck className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-stone-200">One point of contact</h4>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">We coordinate with the supplier on your behalf.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#1a1b18]/60 p-4 backdrop-blur-md">
              <FileText className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-stone-200">Written quotes</h4>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">Scope, price and terms are confirmed in writing.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#1a1b18]/60 p-4 backdrop-blur-md">
              <Zap className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-stone-200">Supplier delivery</h4>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">Delivery and support come directly from the supplier.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-xs text-[var(--muted)]">
          <span>Are you a software vendor seeking distribution? </span>
          <Link
            href="/partner"
            className="font-medium text-[var(--lime-hi)] hover:underline no-underline"
          >
            Apply as a supplier →
          </Link>
        </div>
      </div>

      {/* Right Column: Registration Card */}
      <div className="lg:col-span-7">
        <div className="rounded-3xl border border-white/10 bg-[#1c1d1a]/95 p-6 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <div className="mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
              Enterprise Buyer Onboarding
            </span>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-stone-100">
              Create your corporate account
            </h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Start procuring software with Indian tax invoices and dedicated support.
            </p>
          </div>

          <SignUpForm />

          {/* Bottom Switcher */}
          <div className="mt-6 border-t border-white/5 pt-5 text-center text-xs text-[var(--muted)]">
            <span>Already registered your company? </span>
            <Link
              href="/sign-in"
              className="font-bold text-[var(--lime-hi)] hover:underline no-underline"
            >
              Sign in to portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
