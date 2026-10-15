import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

/**
 * DELETE /api/admin/suppliers?id=<supplier_uuid>
 * Deletes a supplier (cascades to agreements, products via FK).
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Supplier id is required.' }, { status: 400 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await (supabase.from('suppliers') as any).delete().eq('id', id);

    if (error) {
      console.error('[admin/suppliers] Delete failed:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    const { data, error } = await (supabase
      .from('suppliers') as any)
      .select(`
        id,
        name,
        contact_name,
        email,
        phone,
        city,
        state,
        status,
        agreements ( commission_value, due_days ),
        products ( id )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data ?? []).map((s: any) => {
      const agreement = Array.isArray(s.agreements) ? s.agreements[0] : null;
      return {
        id: s.id,
        name: s.name,
        contact_name: s.contact_name,
        email: s.email,
        phone: s.phone,
        city: s.city,
        state: s.state,
        status: s.status,
        commission_value: agreement?.commission_value ?? null,
        due_days: agreement?.due_days ?? null,
        products_count: Array.isArray(s.products) ? s.products.length : 0,
      };
    });

    return NextResponse.json({ suppliers: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact_name, email, phone, city, state, commission_value, due_days } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Supplier name and email are required.' },
        { status: 400 }
      );
    }

    // Service-role client bypasses RLS so admin UI can always write
    const supabase = createAdminSupabaseClient();

    // 1. Insert supplier
    const { data: supplier, error: supErr } = await (supabase
      .from('suppliers') as any)
      .insert({
        name: name.trim(),
        contact_name: contact_name?.trim() || null,
        email: email.trim(),
        phone: phone?.trim() || null,
        city: city?.trim() || 'Bengaluru',
        state: state?.trim() || 'Karnataka',
        status: 'active',
      })
      .select('id')
      .single();

    if (supErr) {
      console.error('[admin/suppliers] Insert supplier failed:', supErr.message);
      return NextResponse.json({ error: supErr.message }, { status: 500 });
    }

    const supplierId = (supplier as any).id as string;

    // 2. Insert agreement
    const { error: agreeErr } = await (supabase.from('agreements') as any).insert({
      supplier_id: supplierId,
      commission_type: 'percentage',
      commission_value: Number(commission_value ?? 15),
      due_days: Number(due_days ?? 30),
    });

    if (agreeErr) {
      console.error('[admin/suppliers] Insert agreement failed:', agreeErr.message);
      // Supplier was created; return partial success
      return NextResponse.json({
        success: true,
        supplierId,
        warning: 'Supplier created but agreement could not be saved: ' + agreeErr.message,
      });
    }

    return NextResponse.json({ success: true, supplierId });
  } catch (err: any) {
    console.error('[admin/suppliers] Unexpected error:', err);
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
