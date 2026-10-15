import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    // Fetch all profiles joined with their companies
    const { data, error } = await (supabase
      .from('profiles') as any)
      .select(`
        id,
        full_name,
        email,
        phone,
        created_at,
        companies (
          id,
          name,
          billing_address,
          city,
          state,
          pincode,
          onboarding_step
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback: try simpler query if join fails
      const { data: profilesOnly, error: e2 } = await (supabase
        .from('profiles') as any)
        .select('id, full_name, email, phone, created_at')
        .order('created_at', { ascending: false });
      if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

      const customers = (profilesOnly ?? []).map((p: any) => ({
        id: p.id,
        company_name: null,
        billing_address: null,
        city: null,
        state: null,
        full_name: p.full_name,
        email: p.email,
        phone: p.phone,
        onboarding_step: 1,
        created_at: p.created_at,
      }));
      return NextResponse.json({ customers });
    }

    const customers = (data ?? []).map((p: any) => {
      const company = Array.isArray(p.companies) ? p.companies[0] : p.companies;
      return {
        id: p.id,
        company_name: company?.name ?? null,
        billing_address: company?.billing_address ?? null,
        city: company?.city ?? null,
        state: company?.state ?? null,
        full_name: p.full_name,
        email: p.email,
        phone: p.phone,
        onboarding_step: company?.onboarding_step ?? 1,
        created_at: p.created_at,
      };
    });

    return NextResponse.json({ customers });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
