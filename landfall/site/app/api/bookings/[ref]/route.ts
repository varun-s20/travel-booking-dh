/* GET /api/bookings/<reference>?key=<guest key>
   One booking with its itinerary, payment card, e-tickets and status, for its owner, an admin or
   the holder of its guest key. Everyone else: 404. */
import { ok, rateLimit, route } from '@/server/http';
import { getUser } from '@/server/auth';
import { viewable } from '@/server/bookings/view';
import { notFound } from '@/server/errors';

export const dynamic = 'force-dynamic';

export const GET = route<{ ref: string }>(async (ctx, { ref }) => {
  await rateLimit(ctx, 'booking-view', 60, 60);
  const found = await viewable(ref.toUpperCase(), await getUser(), new URL(ctx.req.url).searchParams.get('key'));
  if (!found) throw notFound();
  return ok({ booking: found.view });
});
