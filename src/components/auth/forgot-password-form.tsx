'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas/auth';
import { useAuthActions } from '@/lib/auth/use-auth-actions';

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuthActions();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordInput) => {
    const result = await forgotPassword(data);
    if (!result.error) setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <CheckCircle className="size-12 text-[var(--lime)]" />
        <h2 className="font-display text-xl font-semibold">Check your inbox</h2>
        <p className="text-sm text-[var(--muted)]">
          We&apos;ve sent a password reset link to{' '}
          <strong className="text-[var(--text)]">{getValues('email')}</strong>.
          It expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className="error-msg">{errors.email.message}</p>}
      </div>
      <button type="submit" className="btn w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {isSubmitting ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}
