'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { 
  Building2, User, Mail, Phone, Lock, Eye, 
  EyeOff, Loader2, ArrowRight, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { signUpSchema, type SignUpInput } from '@/lib/schemas/auth';
import { useAuthActions } from '@/lib/auth/use-auth-actions';

export function SignUpForm() {
  const { signUp, signInWithGoogle } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { acceptTerms: false },
  });

  const pwd = watch('password', '');
  const hasMinLen = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNum = /[0-9]/.test(pwd);

  const onSubmit = async (data: SignUpInput) => {
    await signUp({ ...data, companyName: data.companyName ?? '' });
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle('/portal/dashboard');
    } catch {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Google Workspace Sign Up */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
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
        <span>{isGoogleLoading ? 'Connecting to Google...' : 'Quick Register with Google Workspace'}</span>
      </button>

      {/* Divider */}
      <div className="relative my-3 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative bg-[#1c1d1a] px-3 text-[11px] font-medium uppercase tracking-wider text-stone-400">
          or complete corporate registration
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Row 1: Company Name & Contact Name */}
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="companyName" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300">
              Registered Entity / Company Name <span className="text-[var(--lime)]">*</span>
            </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <Building2 className="size-3.5" />
            </div>
            <input
              id="companyName"
              type="text"
              autoComplete="organization"
              placeholder="e.g. Acme Tech Solutions Pvt Ltd"
              {...register('companyName')}
              className={`w-full rounded-xl border bg-[#161715]/90 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 shadow-inner focus:outline-none focus:ring-1 ${
                errors.companyName
                  ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                  : 'border-white/10 focus:border-[var(--lime)] focus:ring-[var(--lime)]'
              }`}
            />
          </div>
          {errors.companyName && (
            <p className="mt-1 text-[10px] font-medium text-red-400">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fullName" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300">
            Authorized Representative Name <span className="text-[var(--lime)]">*</span>
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <User className="size-3.5" />
            </div>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="e.g. Ramesh Patel"
              {...register('fullName')}
              className={`w-full rounded-xl border bg-[#161715]/90 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 shadow-inner focus:outline-none focus:ring-1 ${
                errors.fullName
                  ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                  : 'border-white/10 focus:border-[var(--lime)] focus:ring-[var(--lime)]'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-[10px] font-medium text-red-400">{errors.fullName.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Work Email & Phone Number */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300">
            Corporate Work Email <span className="text-[var(--lime)]">*</span>
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <Mail className="size-3.5" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ramesh@acmetech.com"
              {...register('email')}
              className={`w-full rounded-xl border bg-[#161715]/90 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 shadow-inner focus:outline-none focus:ring-1 ${
                errors.email
                  ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                  : 'border-white/10 focus:border-[var(--lime)] focus:ring-[var(--lime)]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[10px] font-medium text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300">
            Official Contact Number <span className="text-[var(--lime)]">*</span>
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <Phone className="size-3.5" />
            </div>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              {...register('phone')}
              className={`w-full rounded-xl border bg-[#161715]/90 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 shadow-inner focus:outline-none focus:ring-1 ${
                errors.phone
                  ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                  : 'border-white/10 focus:border-[var(--lime)] focus:ring-[var(--lime)]'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-[10px] font-medium text-red-400">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Row 3: Password & Confirm Password */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300">
            Password <span className="text-[var(--lime)]">*</span>
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <Lock className="size-3.5" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••••••"
              {...register('password')}
              className={`w-full rounded-xl border bg-[#161715]/90 py-2.5 pl-9 pr-10 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 shadow-inner focus:outline-none focus:ring-1 ${
                errors.password
                  ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                  : 'border-white/10 focus:border-[var(--lime)] focus:ring-[var(--lime)]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-200"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[10px] font-medium text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300">
            Confirm Password <span className="text-[var(--lime)]">*</span>
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <Lock className="size-3.5" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••••••"
              {...register('confirmPassword')}
              className={`w-full rounded-xl border bg-[#161715]/90 py-2.5 pl-9 pr-10 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 shadow-inner focus:outline-none focus:ring-1 ${
                errors.confirmPassword
                  ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                  : 'border-white/10 focus:border-[var(--lime)] focus:ring-[var(--lime)]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-200"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-[10px] font-medium text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Password criteria pills */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] text-[var(--muted)]">
        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 ${hasMinLen ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-stone-400'}`}>
          <CheckCircle2 className="size-2.5" /> 8+ Characters
        </span>
        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 ${hasUpper ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-stone-400'}`}>
          <CheckCircle2 className="size-2.5" /> 1 Uppercase Letter
        </span>
        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 ${hasNum ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-stone-400'}`}>
          <CheckCircle2 className="size-2.5" /> 1 Number
        </span>
      </div>

      {/* Terms Checkbox */}
      <div className="pt-2">
        <label className="flex cursor-pointer items-start gap-2.5 select-none">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded accent-[var(--lime)]"
            {...register('acceptTerms')}
          />
          <span className="text-xs text-[var(--muted)] leading-relaxed">
            I confirm I am an authorized corporate representative and agree to Distaura&apos;s{' '}
            <Link href="/terms" className="text-[var(--lime-hi)] hover:underline no-underline" target="_blank">
              Terms of Distribution
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[var(--lime-hi)] hover:underline no-underline" target="_blank">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1 text-[11px] font-medium text-red-400">{errors.acceptTerms.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime)] py-3 text-xs sm:text-sm font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_30px_rgba(184,224,44,0.4)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] mt-3"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Establishing Corporate Account...</span>
          </>
        ) : (
          <>
            <span>Complete Registration & Enter Portal</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  </div>
);
}
