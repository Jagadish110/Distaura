import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/portal/dashboard';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Check if this is a new Google user (no company record yet)
      const isGoogleProvider = user.app_metadata?.provider === 'google';
      let redirectTo = next;

      if (isGoogleProvider) {
        // Check if company already exists for this user
        const { data: company } = await (supabase
          .from('companies') as any)
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!company) {
          // New Google user — send them to onboarding
          redirectTo = '/onboarding/google';
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      const base = isLocalEnv ? origin : (forwardedHost ? `https://${forwardedHost}` : origin);
      return NextResponse.redirect(`${base}${redirectTo}`);
    }
  }

  // return the user to error on sign-in
  return NextResponse.redirect(`${origin}/sign-in?error=oauth_error`);
}
