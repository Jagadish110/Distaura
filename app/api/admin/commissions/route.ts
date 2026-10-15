import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    const { data, error } = await (supabase
      .from('commissions') as any)
      .select(`
        id,
        sale_amount_paise,
        commission_amount_paise,
        due_date,
        status,
        created_at,
        orders ( order_number ),
        suppliers ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const commissions = (data ?? []).map((c: any) => {
      const commissionPct = c.sale_amount_paise > 0
        ? (c.commission_amount_paise / c.sale_amount_paise) * 100
        : 0;
      return {
        id: c.id,
        sale_amount_paise: c.sale_amount_paise,
        commission_amount_paise: c.commission_amount_paise,
        supplier_payout_paise: c.sale_amount_paise - c.commission_amount_paise,
        commission_pct: commissionPct,
        due_date: c.due_date,
        status: c.status,
        order_number: c.orders?.order_number ?? '—',
        supplier_name: c.suppliers?.name ?? 'Unknown',
      };
    });

    const totalMargin = commissions.reduce((s: number, c: any) => s + c.commission_amount_paise, 0);
    const pendingPayout = commissions
      .filter((c: any) => c.status === 'pending' || c.status === 'due')
      .reduce((s: number, c: any) => s + c.supplier_payout_paise, 0);

    return NextResponse.json({ commissions, stats: { totalMargin, pendingPayout } });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const supabase = createAdminSupabaseClient();
    const { error } = await (supabase.from('commissions') as any)
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
