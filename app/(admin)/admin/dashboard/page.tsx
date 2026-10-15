import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export const metadata: Metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/sign-in');

  // Parallel data fetches for dashboard stats
  const [ordersRes, commissionsRes, enquiriesRes, suppliersRes] = await Promise.all([
    supabase
      .from('orders')
      .select('id, status, total_paise, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('commissions')
      .select('id, status, commission_amount_paise, due_date')
      .in('status', ['due', 'overdue'])
      .order('due_date', { ascending: true })
      .limit(10),
    supabase
      .from('enquiries')
      .select('id, name, enquiry_type, status, created_at')
      .eq('status', 'new')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('suppliers')
      .select('id, name, status')
      .eq('status', 'active')
      .limit(1),
  ]);

  const totalOrders = ordersRes.data?.length ?? 0;
  const pendingCommissionsCount = commissionsRes.data?.length ?? 0;
  const pendingCommissionsValue = (commissionsRes.data as any[])?.reduce(
    (sum, c) => sum + (c.commission_amount_paise || 0),
    0,
  ) ?? 0;
  const newEnquiries = enquiriesRes.data?.length ?? 0;

  return (
    <AdminDashboard
      stats={{ totalOrders, pendingCommissionsCount, pendingCommissionsValue, newEnquiries }}
      recentOrders={(ordersRes.data as any[]) ?? []}
      pendingCommissions={(commissionsRes.data as any[]) ?? []}
      newEnquiries={(enquiriesRes.data as any[]) ?? []}
    />
  );
}
