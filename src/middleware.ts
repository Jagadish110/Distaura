import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Next.js middleware — runs on protected routes only.
 * 1. Protects portal routes (requires authenticated customer)
 * 2. Protects admin routes (requires admin login)
 * 3. Redirects authenticated users away from auth pages
 *
 * NOTE: We only call supabase.auth.getUser() (network round-trip) when
 * the route actually needs auth. Public site pages are NOT matched by
 * this middleware at all — see `config.matcher` below.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Validate session — secure server-side check (network call to Supabase).
  // Only runs on matched routes (portal, admin, auth pages).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Customer portal protection ───────────────────────────
  if (pathname.startsWith('/portal')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── Admin panel protection ───────────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/sign-in')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/sign-in';
      return NextResponse.redirect(url);
    }

    // Role check is done in layouts/pages (avoids extra DB query per request)
    // The DB enforces real access via RLS + AAL2 requirement
  }

  // ── Redirect authenticated users away from auth pages ────
  if (user && (pathname === '/sign-in' || pathname === '/sign-up')) {
    const url = request.nextUrl.clone();
    url.pathname = '/portal/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Only run middleware on routes that need auth checks:
     * - /portal/* — customer portal (must be logged in)
     * - /admin/* — admin panel (must be logged in)
     * - /sign-in, /sign-up — redirect if already logged in
     *
     * Public site pages (/, /products, /about, etc.) are intentionally
     * excluded so they incur ZERO middleware latency.
     */
    '/portal/:path*',
    '/admin/:path*',
    '/sign-in',
    '/sign-up',
  ],
};
