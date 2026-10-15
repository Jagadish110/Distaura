import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

/**
 * DELETE /api/admin/products?id=<product_uuid>
 * Deletes a product and its plans (cascade via FK).
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Product id is required.' }, { status: 400 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await (supabase.from('products') as any).delete().eq('id', id);

    if (error) {
      console.error('[admin/products] Delete failed:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/products
 * Body: { name, slug, category_id, supplier_id, short_desc, price_paise, sort_order }
 * Creates product + default Standard plan, bypassing RLS with service-role key.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, category_id, supplier_id, short_desc, price_paise, sort_order } = body;

    if (!name?.trim() || !slug?.trim() || !supplier_id) {
      return NextResponse.json(
        { error: 'name, slug and supplier_id are required.' },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    // 1. Insert product
    const { data: product, error: prodErr } = await (supabase.from('products') as any)
      .insert({
        name: name.trim(),
        slug: slug.trim(),
        category_id: category_id || null,
        supplier_id,
        short_desc: short_desc?.trim() || null,
        features: [],
        images: [],
        status: 'published',
        sort_order: sort_order ?? 0,
      })
      .select('id')
      .single();

    if (prodErr) {
      console.error('[admin/products] Insert product failed:', prodErr.message);
      return NextResponse.json({ error: prodErr.message }, { status: 500 });
    }

    const productId = (product as any).id as string;

    // 2. Insert default plan
    const { error: planErr } = await (supabase.from('product_plans') as any).insert({
      product_id: productId,
      name: 'Standard',
      plan_type: 'annual',
      price_paise: Number(price_paise ?? 199900),
      currency: 'INR',
      tax_inclusive: false,
      features: [],
      is_active: true,
      sort_order: 1,
    });

    if (planErr) {
      console.error('[admin/products] Insert plan failed:', planErr.message);
      return NextResponse.json({
        success: true,
        productId,
        warning: 'Product created but default plan failed: ' + planErr.message,
      });
    }

    return NextResponse.json({ success: true, productId });
  } catch (err: any) {
    console.error('[admin/products] Unexpected error:', err);
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

/**
 * GET /api/admin/products
 * Returns all products with their plans, category name, supplier name.
 */
export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    const [prodRes, catRes, supRes] = await Promise.all([
      (supabase.from('products') as any)
        .select('*, product_plans(*)')
        .order('sort_order', { ascending: true }),
      (supabase.from('categories') as any)
        .select('id, name')
        .order('sort_order', { ascending: true }),
      (supabase.from('suppliers') as any)
        .select('id, name')
        .eq('status', 'active')
        .order('name'),
    ]);

    if (prodRes.error) return NextResponse.json({ error: prodRes.error.message }, { status: 500 });

    const catMap = new Map<string, string>(
      (catRes.data ?? []).map((c: any) => [c.id, c.name])
    );
    const supMap = new Map<string, string>(
      (supRes.data ?? []).map((s: any) => [s.id, s.name])
    );

    const products = (prodRes.data ?? []).map((p: any) => ({
      ...p,
      category_name: p.category_id ? (catMap.get(p.category_id) ?? null) : null,
      supplier_name: supMap.get(p.supplier_id) ?? 'Unknown',
      plans: p.product_plans ?? [],
    }));

    return NextResponse.json({
      products,
      categories: catRes.data ?? [],
      suppliers: supRes.data ?? [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
