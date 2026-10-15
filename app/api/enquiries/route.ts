import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { enquiry_type, name, company_name, email, phone, message, product_desc } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const type = enquiry_type === 'supplier' ? 'supplier' : 'business';

    // Use service-role client so RLS doesn't block anonymous form submissions.
    // This route is server-only (Route Handler) — the key is never exposed to the browser.
    const supabase = createAdminSupabaseClient();

    const { data, error } = await (supabase
      .from('enquiries') as any)
      .insert({
        enquiry_type: type,
        name,
        company_name: company_name || null,
        email,
        phone: phone || null,
        message,
        product_desc: product_desc || null,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[enquiries] DB insert failed:', error.message, error.details);
      return NextResponse.json(
        { error: 'Failed to save enquiry. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      referenceId: (data as any)?.id,
      message: 'Your enquiry has been received successfully. Our team will contact you within 24 business hours.',
    });
  } catch (err: any) {
    console.error('[enquiries] Unexpected error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
