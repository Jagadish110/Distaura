import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    const { data, error } = await (supabase
      .from('orders') as any)
      .select(`
        id,
        order_number,
        status,
        total_paise,
        billing_cycle,
        created_at,
        companies ( name ),
        products ( name ),
        product_plans ( name ),
        supplier_confirmations ( invoice_number )
      `)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const orders = (data ?? []).map((o: any) => ({
      id: o.id,
      order_number: o.order_number,
      status: o.status,
      total_paise: o.total_paise,
      billing_cycle: o.billing_cycle,
      created_at: o.created_at,
      company_name: o.companies?.name ?? 'Unknown',
      product_name: o.products?.name ?? 'Unknown',
      plan_name: o.product_plans?.name ?? null,
      invoice_number: Array.isArray(o.supplier_confirmations) && o.supplier_confirmations[0]
        ? o.supplier_confirmations[0].invoice_number
        : null,
    }));

    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 });

    const supabase = createAdminSupabaseClient();
    const { error } = await (supabase.from('orders') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
