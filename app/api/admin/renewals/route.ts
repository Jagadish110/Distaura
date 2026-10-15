import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    const { data, error } = await (supabase
      .from('renewals') as any)
      .select(`
        id,
        renewal_date,
        renewal_price_paise,
        status,
        reminders_sent,
        created_at,
        order_id,
        orders:order_id (
          order_number,
          companies ( name ),
          products ( name )
        )
      `)
      .order('renewal_date', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const today = new Date();
    const renewals = (data ?? []).map((r: any) => {
      const renewalDate = new Date(r.renewal_date);
      const daysRemaining = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: r.id,
        renewal_date: r.renewal_date,
        renewal_price_paise: r.renewal_price_paise,
        status: r.status,
        reminders_sent: r.reminders_sent,
        days_remaining: daysRemaining,
        order_number: r.orders?.order_number ?? '—',
        company_name: r.orders?.companies?.name ?? 'Unknown',
        product_name: r.orders?.products?.name ?? 'Unknown',
      };
    });

    // Stats
    const next60Days = renewals.filter((r: any) => r.days_remaining >= 0 && r.days_remaining <= 60);
    const pipeline60Value = next60Days.reduce((s: number, r: any) => s + r.renewal_price_paise, 0);
    const totalBase = renewals.reduce((s: number, r: any) => s + r.renewal_price_paise, 0);

    return NextResponse.json({ renewals, stats: { pipeline60Value, totalBase } });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
