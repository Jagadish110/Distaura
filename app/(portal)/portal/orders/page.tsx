import { createServerSupabaseClient } from '@/lib/supabase/server';
import { OrdersPage, type CustomerOrder } from '@/components/customer/orders-page';

async function getOrders(): Promise<CustomerOrder[]> {
  const supabase = await createServerSupabaseClient();

  // RLS scopes this to the current user's company
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total_paise,
      billing_cycle,
      status,
      created_at,
      products ( name ),
      product_plans ( name )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[orders] fetch error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    order_number: row.order_number,
    product_name: row.products?.name ?? 'Unknown Product',
    plan_name: row.product_plans?.name ?? null,
    total_paise: row.total_paise,
    billing_cycle: row.billing_cycle,
    status: row.status,
    created_at: row.created_at,
  }));
}

export default async function CustomerOrdersPageServer() {
  const orders = await getOrders();
  return <OrdersPage orders={orders} />;
}
