'use client';

import { Mail, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useAuthActions } from '@/lib/auth/use-auth-actions';
import { useAuth } from '@/lib/auth/auth-provider';

export function VerifyEmailPage() {
  const { user } = useAuth();
  const { resendVerification } = useAuthActions();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!user?.email) return;
    setResending(true);
    await resendVerification(user.email);
    setResending(false);
    setResent(true);
  };

  return (
    <div className="card flex flex-col items-center gap-6 py-8 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-[var(--gloss)] shadow-[var(--btn)]">
        <Mail className="size-9 text-[var(--ink)]" />
      </div>

      <div>
        <h1 className="font-display text-2xl font-semibold">Check your inbox</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          We&apos;ve sent a verification link to{' '}
          {user?.email ? (
            <strong className="text-[var(--text)]">{user.email}</strong>
          ) : (
            'your email'
          )}
          . Click the link to activate your account.
        </p>
      </div>

      {!resent ? (
        <button
          type="button"
          className="btn alt sm flex items-center gap-2"
          disabled={resending}
          onClick={handleResend}
        >
          <RefreshCw className={`size-4 ${resending ? 'animate-spin' : ''}`} />
          {resending ? 'Sending…' : 'Resend email'}
        </button>
      ) : (
        <p className="text-sm text-[var(--lime)]">✓ Email resent</p>
      )}

      <p className="text-xs text-[var(--muted)]">
        Wrong address?{' '}
        <a href="/sign-up" className="text-[var(--lime-hi)] hover:underline">
          Start over
        </a>
      </p>
    </div>
  );
}
