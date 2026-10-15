import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = { title: 'Reset Password' };

export default function ForgotPasswordPage() {
  return (
    <div className="card">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Reset your password</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Remember your password?{' '}
        <a href="/sign-in" className="text-[var(--lime-hi)] hover:underline">Back to sign in</a>
      </p>
    </div>
  );
}
