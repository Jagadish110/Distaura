import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CustomerOnboardingWizard } from '@/components/customer/customer-onboarding-wizard';

export const metadata: Metadata = {
  title: 'Corporate Onboarding | Distaura Customer Portal',
  description: 'Complete your business profile and billing details to unlock enterprise software procurement in India.',
};

export default async function OnboardingPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const [profileRes, companyRes, categoriesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('companies').select('*').eq('user_id', user.id).single(),
    supabase.from('categories').select('id, name, slug').order('sort_order', { ascending: true }),
  ]);

  return (
    <div className="mx-auto max-w-3xl py-6 sm:py-10">
      <CustomerOnboardingWizard 
        profile={profileRes.data} 
        company={companyRes.data}
        availableCategories={categoriesRes.data ?? []}
      />
    </div>
  );
}
