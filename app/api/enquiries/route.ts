import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { site } from '@/lib/site';

/**
 * Emails the enquiry to the right desk via Resend. Best-effort: the enquiry is already
 * saved, so a missing key or a send failure must not fail the request.
 */
async function notifyDesk(type: 'supplier' | 'business', lines: string[], replyTo: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[enquiries] RESEND_API_KEY not set; skipping email notification');
    return;
  }
  const to = process.env.ENQUIRY_NOTIFY_TO || (type === 'supplier' ? site.emails.partners : site.emails.hello);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL || 'Distaura <onboarding@resend.dev>',
        to: [to],
        reply_to: replyTo,
        subject: type === 'supplier' ? 'New supplier enquiry' : 'New quote request',
        text: lines.join('\n'),
      }),
    });
    if (!res.ok) console.error('[enquiries] email send failed:', res.status, await res.text());
  } catch (err) {
    console.error('[enquiries] email send error:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { enquiry_type, name, company_name, email, phone, message, product_desc, budget } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const type = enquiry_type === 'supplier' ? 'supplier' : 'business';
    const fullMessage = budget ? `${message}\n\nBudget range: ${budget}` : message;

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
        message: fullMessage,
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

    await notifyDesk(
      type,
      [
        `Name: ${name}`,
        `Company: ${company_name || '-'}`,
        `Email: ${email}`,
        `Phone: ${phone || '-'}`,
        '',
        fullMessage,
        product_desc ? `\nProduct: ${product_desc}` : '',
      ],
      email,
    );

    return NextResponse.json({
      success: true,
      referenceId: (data as any)?.id,
      message: 'Your enquiry has been received successfully. Our team will get back to you shortly.',
    });
  } catch (err: any) {
    console.error('[enquiries] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Failed to submit enquiry. Please try again.' },
      { status: 500 }
    );
  }
}
