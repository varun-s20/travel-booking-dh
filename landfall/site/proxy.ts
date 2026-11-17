/* =====================================================================
   Landfall: request proxy (Next.js 16's name for middleware)
   1. Keeps the Supabase session fresh: reads the auth cookies, lets
      @supabase/ssr refresh an expiring token, and writes the new cookies
      on the response (Server Components can't write cookies themselves).
   2. Account pages (/account, /bookings) need a session: without one the
      visitor goes to /login?next=<the page>. Their data routes check the
      session again on the server; this only spares a flash of empty page.
   3. Gives each browser an anonymous visitor id (cookie lf_vid) for search caches.
   Static files, webhooks and the scheduled job skip all of this.
   ===================================================================== */
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED = [/^\/account(\/|$)/, /^\/bookings(\/|$)/];

/* an anonymous id per browser, so search caches are never shared between customers (server/http.ts visitorKey) */
const VISITOR = 'lf_vid';
function withVisitor(request: NextRequest, response: NextResponse): NextResponse {
  if (!request.cookies.get(VISITOR)) {
    response.cookies.set(VISITOR, crypto.randomUUID(), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 365 });
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return withVisitor(request, NextResponse.next({ request }));

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list, headers) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
        for (const [k, v] of Object.entries(headers ?? {})) response.headers.set(k, v as string);
      }
    }
  });

  /* verifies the token (and refreshes it when needed); never trust the cookie without this */
  const { data } = await supabase.auth.getClaims();
  const signedIn = !!data?.claims?.sub;

  const path = request.nextUrl.pathname;
  if (!signedIn && PROTECTED.some((r) => r.test(path))) {
    const to = request.nextUrl.clone();
    to.pathname = '/login';
    to.search = `?next=${encodeURIComponent(path + request.nextUrl.search)}`;
    const redirect = NextResponse.redirect(to);
    for (const c of response.cookies.getAll()) redirect.cookies.set(c);
    return withVisitor(request, redirect);
  }
  return withVisitor(request, response);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images/|fonts/|icon.svg|favicon.ico|api/webhooks|api/cron|api/health|.*\\.(?:png|jpg|jpeg|webp|avif|svg|woff2?|ico|txt|xml)$).*)']
};
