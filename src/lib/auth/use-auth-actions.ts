'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { SignInInput, SignUpInput, ForgotPasswordInput, ResetPasswordInput } from '@/lib/schemas/auth';

/**
 * Auth action hooks — call from forms.
 * These are standalone functions (not a hook) so they can be
 * called from event handlers without React rules issues.
 */

export function useAuthActions() {
  const supabase = createClient();
  const router = useRouter();

  const signUp = async (data: SignUpInput & { companyName: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone,
          // NOTE: company_name stored separately after email verification
          company_name: data.companyName,
        },
        emailRedirectTo: `${window.location.origin}/verify-email/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      return { error };
    }

    // Company row is created in a server action after email verification
    toast.success('Check your inbox to verify your email');
    router.push('/verify-email');
    return { error: null };
  };

  const signIn = async (data: SignInInput) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Incorrect email or password');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email first');
        router.push('/verify-email');
      } else {
        toast.error(error.message);
      }
      return { error, user: null };
    }

    // Check role and redirect accordingly
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authData.user.id)
      .single() as { data: { role: string } | null; error: unknown };

    if (roleData?.role === 'admin' || roleData?.role === 'team') {
      // Admin/team who signed in from customer form — sign out with message
      await supabase.auth.signOut();
      toast.error('Please use the admin sign-in page');
      return { error: new Error('wrong_page'), user: null };
    }

    router.push('/portal/dashboard');
    return { error: null, user: authData.user };
  };

  const adminSignIn = async (data: SignInInput) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return { error, user: null };
    }

    // Verify role is admin or team
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authData.user.id)
      .single() as { data: { role: string } | null; error: unknown };

    if (roleData?.role === 'customer' || !roleData) {
      await supabase.auth.signOut();
      toast.error('You do not have admin access');
      return { error: new Error('no_access'), user: null };
    }

    // Go directly to admin dashboard (MFA optional for now)
    router.push('/admin/dashboard');
    return { error: null, user: authData.user };
  };

  const forgotPassword = async (data: ForgotPasswordInput) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
      return { error };
    }

    toast.success('Password reset link sent to your email');
    return { error: null };
  };

  const resetPassword = async (data: ResetPasswordInput) => {
    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
      toast.error(error.message);
      return { error };
    }

    toast.success('Password updated successfully');
    router.push('/sign-in');
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Verification email resent');
    }
  };

  const signInWithGoogle = async (next = '/portal/dashboard') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return { error };
    }

    return { data, error: null };
  };

  return { 
    signUp, 
    signIn, 
    adminSignIn, 
    signInWithGoogle, 
    forgotPassword, 
    resetPassword, 
    signOut, 
    resendVerification 
  };
}
