/* POST /api/flights/offers/<id>/refresh
   After the 30-minute offer expiry: searches again and returns the same flights with their new
   prices and ids, or no_longer_available when they're gone. */
import { ok, rateLimit, route, visitorKey } from '@/server/http';
import { refreshItinerary } from '@/server/flights';
import { conflict } from '@/server/errors';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const POST = route<{ id: string }>(async (ctx, { id }) => {
  await rateLimit(ctx, 'flight-search', 20, 60);
  const offer = await refreshItinerary(id, visitorKey(ctx));
  if (!offer) throw conflict('no_longer_available');
  return ok({ offer });
});
