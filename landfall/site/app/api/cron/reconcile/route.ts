/* GET /api/cron/reconcile  (Authorization: Bearer <CRON_SECRET>)
   The scheduled job (server/bookings/reconcile.ts). Vercel Cron sends the CRON_SECRET header
   itself when the variable is set (vercel.json schedules it); any other scheduler can call it the
   same way. Answers a count of what it did. */
import { fail, ok, route } from '@/server/http';
import { env } from '@/server/env';
import { safeEqual } from '@/server/crypto';
import { reconcile } from '@/server/bookings/reconcile';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export const GET = route(async (ctx) => {
  const secret = env().CRON_SECRET;
  const auth = ctx.req.headers.get('authorization') ?? '';
  if (!secret || !safeEqual(auth, `Bearer ${secret}`)) return fail('unauthorized', 401);
  return ok({ report: await reconcile() });
});
