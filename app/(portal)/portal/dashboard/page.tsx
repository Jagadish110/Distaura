import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CustomerDashboard } from '@/components/customer/customer-dashboard';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function PortalDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const [profileRes, companyRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('companies').select('*').eq('user_id', user.id).single(),
  ]);

  const companyData = companyRes?.data as any;
  const companyId = companyData?.id;

  const [ordersRes, notificationsRes] = await Promise.all([
    companyId
      ? supabase
        .from('orders')
        .select('id, order_number, status, total_paise, created_at, products(name, logo_url)')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(5)
      : Promise.resolve({ data: [] }),
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  // Redirect to onboarding if billing address not yet set
  if (companyData && !companyData.billing_address && companyData.onboarding_step < 3) {
    redirect('/portal/onboarding');
  }

  return (
    <CustomerDashboard
      profile={profileRes.data}
      company={companyRes.data}
      recentOrders={(ordersRes.data as any[]) ?? []}
      notifications={notificationsRes.data ?? []}
    />
  );
}
