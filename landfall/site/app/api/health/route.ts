/* GET /api/health
   Which services are connected, for setup and monitoring. Never shows a key: only "configured",
   "missing", the supplier mode and whether the database answers. In production the details need
   the CRON_SECRET as a bearer token; without it the route only says it is up. */
import { ok, route } from '@/server/http';
import { env, smtpConfigured, stripeConfigured, supabaseConfigured, supplyMode } from '@/server/env';
import { adminDb } from '@/server/db/supabase';
import { safeEqual } from '@/server/crypto';

export const dynamic = 'force-dynamic';

export const GET = route(async (ctx) => {
  const e = env();
  const auth = ctx.req.headers.get('authorization') ?? '';
  const allowed = e.NODE_ENV !== 'production' || (!!e.CRON_SECRET && safeEqual(auth, `Bearer ${e.CRON_SECRET}`));
  if (!allowed) return ok({ up: true });
  let database = 'missing';
  if (supabaseConfigured()) {
    const { error } = await adminDb().from('profiles').select('id', { head: true, count: 'exact' });
    database = !error ? 'ok' : /does not exist|schema cache/i.test(error.message) ? 'tables missing: run npm run db:push' : `error: ${error.message}`;
  }
  return ok({
    up: true,
    supplier: supplyMode(),
    duffel: e.DUFFEL_ACCESS_TOKEN ? (e.DUFFEL_ACCESS_TOKEN.startsWith('duffel_test_') ? 'test token' : 'live token') : 'missing (simulated catalogue in use)',
    duffelWebhooks: e.DUFFEL_WEBHOOK_SECRET ? 'configured' : 'missing',
    supabase: supabaseConfigured() ? 'configured' : 'missing',
    database,
    stripe: stripeConfigured() ? (e.STRIPE_SECRET_KEY?.includes('_test_') ? 'test mode' : 'live mode') : 'missing',
    stripeWebhooks: e.STRIPE_WEBHOOK_SECRET ? 'configured' : 'missing',
    email: smtpConfigured() ? 'smtp' : 'logged only (SMTP_HOST empty)',
    encryptionKey: e.DATA_ENCRYPTION_KEY ? 'configured' : 'missing',
    cronSecret: e.CRON_SECRET ? 'configured' : 'missing',
    currency: e.APP_CURRENCY,
    markup: { percent: e.PRICE_MARKUP_PERCENT, fixedCents: e.PRICE_MARKUP_FIXED_CENTS }
  });
});
