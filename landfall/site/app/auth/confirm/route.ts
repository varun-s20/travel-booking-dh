/* GET /auth/confirm?token_hash=...&type=email|recovery|email_change&next=/path
   Where Supabase's emails link to (supabase/templates/). Verifies the one-time token on the
   server, which opens the session in cookies, then sends the visitor on:
   - sign-up confirmation -> next (My bookings), with guest bookings joined to the account;
   - password recovery -> /reset-password, or /reset-password?expired=1 for a used or old link;
   - email change -> /account.
   `next` must be a path on this site (no open redirect). */
import { NextResponse } from 'next/server';
import { confirmEmailLink } from '@/server/accounts';
import { log } from '@/server/log';

export const dynamic = 'force-dynamic';

const TYPES = new Set(['email', 'recovery', 'email_change', 'signup', 'invite']);
const safeNext = (n: string | null, fallback: string) => (n && /^\/(?!\/)[A-Za-z0-9/_?=&.-]*$/.test(n) ? n : fallback);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') ?? '';
  const fallback = type === 'recovery' ? '/reset-password' : type === 'email_change' ? '/account' : '/bookings';
  const next = safeNext(url.searchParams.get('next'), fallback);
  let ok = false;
  if (tokenHash && TYPES.has(type)) {
    try {
      ok = await confirmEmailLink(tokenHash, type as 'email' | 'recovery' | 'email_change' | 'signup' | 'invite');
    } catch (e) {
      log.error('auth.confirm', { error: e });
    }
  }
  const to = new URL(ok ? next : type === 'recovery' ? '/reset-password?expired=1' : '/login?link=expired', url.origin);
  const res = NextResponse.redirect(to, 303);
  res.headers.set('cache-control', 'no-store');
  return res;
}
