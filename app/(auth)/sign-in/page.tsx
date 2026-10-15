import type { Metadata } from 'next';
import Link from 'next/link';
import { SignInForm } from '@/components/auth/sign-in-form';
import { ShieldCheck, CheckCircle2, Building2, Zap, ArrowRight, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In | Distaura Customer Portal',
  description: 'Access your enterprise software subscriptions, license keys, and GST tax invoices.',
};

export default function SignInPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
      {/* Left Column: Brand & Security Proof */}
      <div className="hidden lg:flex lg:col-span-6 flex-col justify-between pr-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-3.5 py-1 text-xs font-semibold text-[var(--lime-hi)]">
            <ShieldCheck className="size-3.5" />
            Enterprise Procurement Portal
          </span>

          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-stone-100 leading-tight">
            Manage your corporate software stack <br />
            <span className="text-[var(--lime-hi)]">under one unified roof.</span>
          </h2>

          <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
            Sign in to access your procured enterprise licenses, download statutory GST tax invoices with input tax credit (ITC) validity, track software renewal countdowns, and manage team seats.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#1a1b18]/60 p-4 backdrop-blur-md">
              <CheckCircle2 className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-stone-200">100% Statutory GST e-Invoicing</h4>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">Automatic HSN/SAC classification for seamless Input Tax Credit.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#1a1b18]/60 p-4 backdrop-blur-md">
              <Zap className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-stone-200">Instant License Credential Vault</h4>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">Direct access to tenant keys, activation files, and SLA contacts.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-[#1a1b18]/60 p-4 backdrop-blur-md">
              <Lock className="size-4 shrink-0 text-[var(--lime)] mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-stone-200">Multi-User Role-Based Access</h4>
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">Separate permissions for Finance, IT Technical Leads, and Buyers.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>Are you an internal staff member?</span>
          <Link
            href="/admin/sign-in"
            className="font-medium text-stone-300 hover:text-[var(--lime-hi)] no-underline flex items-center gap-1"
          >
            Go to Admin Login <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Right Column: Sign In Card */}
      <div className="lg:col-span-6">
        <div className="rounded-3xl border border-white/10 bg-[#1c1d1a]/95 p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <div className="mb-8">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--lime-hi)]">
              Client Portal Authentication
            </span>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-stone-100">
              Welcome back
            </h1>
            <p className="mt-1.5 text-xs text-[var(--muted)]">
              Sign in with your verified corporate email to access your dashboard.
            </p>
          </div>

          <SignInForm />

          {/* Bottom Callout */}
          <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-[var(--muted)]">
            <span>Don&apos;t have a customer account yet? </span>
            <Link
              href="/sign-up"
              className="font-bold text-[var(--lime-hi)] hover:underline no-underline"
            >
              Register your company
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
