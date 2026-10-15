import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { GoogleOnboardingFlow } from '@/components/auth/google-onboarding-flow';

export const metadata: Metadata = {
  title: 'Setup Your Account | Distaura',
  description: 'Complete your Distaura account setup to start procuring enterprise software.',
};

export default async function GoogleOnboardingPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Check if they already have a company (shouldn't be here then)
  const { data: company } = await (supabase
    .from('companies') as any)
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (company) {
    redirect('/portal/dashboard');
  }

  return (
    <GoogleOnboardingFlow
      userId={user.id}
      userEmail={user.email ?? ''}
      userName={user.user_metadata?.full_name ?? user.user_metadata?.name ?? ''}
    />
  );
}
