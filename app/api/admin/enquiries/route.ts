import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    const { data, error } = await (supabase
      .from('enquiries') as any)
      .select('id, enquiry_type, name, company_name, email, phone, message, status, created_at')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ enquiries: data ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 });

    const supabase = createAdminSupabaseClient();
    const { error } = await (supabase.from('enquiries') as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
