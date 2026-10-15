'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, 
  KeyRound, AlertCircle, Fingerprint, ShieldAlert 
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { signInSchema, type SignInInput } from '@/lib/schemas/auth';
import { useAuthActions } from '@/lib/auth/use-auth-actions';

export function AdminSignInForm() {
  const { adminSignIn } = useAuthActions();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'no_access') {
      toast.error('Access Denied: This account lacks administrative credentials.');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  return (
    <form onSubmit={handleSubmit(adminSignIn)} className="space-y-5" noValidate>
        {/* Access alert if redirected */}
        {searchParams.get('error') === 'no_access' && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-950/20 p-3.5 text-xs text-red-300">
            <ShieldAlert className="size-4 shrink-0 text-red-400 mt-0.5" />
            <span>Restricted gateway. Customer credentials cannot access administrative surfaces.</span>
          </div>
        )}

        {/* Staff Email Field */}
        <div>
          <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
            Operator Work Email
          </label>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
            <Mail className="size-4" />
          </div>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            placeholder="staff@distaura.com"
            {...register('email')}
            className={`w-full rounded-2xl border bg-[#141513]/90 py-3 pl-10 pr-4 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 shadow-inner transition-all focus:outline-none focus:ring-1 ${
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

      {/* Staff Password Field */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
            Master Password
          </label>
          <span className="text-[11px] font-medium text-stone-400">
            Hardware / TOTP Protected
          </span>
        </div>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
            <Lock className="size-4" />
          </div>
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••••••"
            {...register('password')}
            className={`w-full rounded-2xl border bg-[#141513]/90 py-3 pl-10 pr-11 text-xs sm:text-sm text-stone-100 placeholder:text-stone-500 shadow-inner transition-all focus:outline-none focus:ring-1 ${
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

      {/* Security Checklist notice */}
      <div className="rounded-xl border border-white/5 bg-[#121311] p-3 text-[11px] text-[var(--muted)] space-y-1.5">
        <div className="flex items-center gap-2 text-stone-300">
          <Fingerprint className="size-3.5 text-[var(--lime)]" />
          <span className="font-semibold text-stone-200">AAL2 Multi-Factor Enforcement</span>
        </div>
        <p className="text-[10px] leading-relaxed text-stone-400">
          You will be prompted for your 6-digit TOTP authenticator token on step 2 before administrative session clearance.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime)] py-3.5 text-xs sm:text-sm font-bold text-stone-950 transition-all hover:bg-[var(--lime-hi)] hover:shadow-[0_0_35px_rgba(184,224,44,0.45)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Verifying Credentials...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="size-4" />
            <span>Authenticate & Verify 2FA</span>
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-stone-500">
        All login attempts are immutably logged with client IP telemetry.
      </p>
    </form>
  );
}
