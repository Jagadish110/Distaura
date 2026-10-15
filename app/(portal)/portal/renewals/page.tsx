import { createServerSupabaseClient } from '@/lib/supabase/server';
import { RenewalsPage, type RenewalOrder } from '@/components/customer/renewals-page';

// ── Data fetch ────────────────────────────────────────────────────────────────

async function getRenewals(): Promise<RenewalOrder[]> {
  const supabase = await createServerSupabaseClient();

  // RLS ensures company_id is scoped to the logged-in user's company automatically
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      quantity,
      total_paise,
      billing_cycle,
      status,
      renewal_date,
      products ( name ),
      product_plans ( name )
    `)
    .in('status', ['delivered', 'completed', 'payment_received'])
    .order('renewal_date', { ascending: true });

  if (error) {
    console.error('[renewals] fetch error:', error.message);
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (data ?? []).map((row: any) => {
    let days_remaining: number | null = null;
    if (row.renewal_date) {
      const renewal = new Date(row.renewal_date);
      renewal.setHours(0, 0, 0, 0);
      days_remaining = Math.ceil((renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }

    return {
      id: row.id,
      order_number: row.order_number,
      product_name: row.products?.name ?? 'Unknown Product',
      plan_name: row.product_plans?.name ?? null,
      billing_cycle: row.billing_cycle,
      quantity: row.quantity,
      total_paise: row.total_paise,
      renewal_date: row.renewal_date,
      status: row.status,
      days_remaining,
    };
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CustomerRenewalsPageServer() {
  const renewals = await getRenewals();
  return <RenewalsPage renewals={renewals} />;
}
