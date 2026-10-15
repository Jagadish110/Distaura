'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { signInSchema, type SignInInput } from '@/lib/schemas/auth';
import { useAuthActions } from '@/lib/auth/use-auth-actions';

export function SignInForm() {
  const { signIn, signInWithGoogle } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle('/portal/dashboard');
    } catch {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isSubmitting}
        className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#191a17] py-3.5 px-4 text-xs sm:text-sm font-semibold text-stone-200 transition-all hover:bg-[#22241f] hover:border-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-inner active:scale-[0.99]"
      >
        {isGoogleLoading ? (
          <Loader2 className="size-4 animate-spin text-[var(--lime)]" />
        ) : (
          <svg className="size-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google Workspace'}</span>
      </button>

      {/* Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative bg-[#1c1d1a] px-3 text-[11px] font-medium uppercase tracking-wider text-stone-400">
          or sign in with email
        </div>
      </div>

      <form onSubmit={handleSubmit(signIn)} className="space-y-5" noValidate>
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
            Corporate Email Address
          </label>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
            <Mail className="size-4" />
          </div>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            {...register('email')}
            className={`w-full rounded-2xl border bg-[#161715]/90 py-3 pl-10 pr-4 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 shadow-inner transition-all focus:outline-none focus:ring-1 ${
              errors.email
                ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                : 'border-white/10 focus:border-[var(--lime)] focus:ring-[var(--lime)]'
            }`}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-[11px] font-medium text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
            Account Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-[var(--lime-hi)] hover:underline no-underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
            <Lock className="size-4" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••••••"
            {...register('password')}
            className={`w-full rounded-2xl border bg-[#161715]/90 py-3 pl-10 pr-11 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 shadow-inner transition-all focus:outline-none focus:ring-1 ${
              errors.password
                ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                : 'border-white/10 focus:border-[var(--lime)] focus:ring-[var(--lime)]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400 hover:text-stone-200 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-[11px] font-medium text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Trust & Security note */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)] pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" defaultChecked className="size-3.5 rounded accent-[var(--lime)]" />
          <span>Keep me signed in</span>
        </label>
        <span className="flex items-center gap-1 text-[11px] text-stone-400">
          <ShieldCheck className="size-3.5 text-[var(--lime)]" />
          End-to-End Encrypted
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime)] py-3.5 text-xs sm:text-sm font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_30px_rgba(184,224,44,0.4)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <span>Sign in to Customer Portal</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  </div>
);
}
