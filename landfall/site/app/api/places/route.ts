/* GET /api/places?q=lis&type=airport|city
   Airport and city suggestions for the search fields: Duffel's place suggestions when Duffel is
   the supplier, the built-in airport and city list otherwise. */
import { z } from 'zod';
import { ok, rateLimit, readQuery, route } from '@/server/http';
import { supplyMode } from '@/server/env';
import { duffelPlaces } from '@/server/supply/duffel';
import { AIRPORTS, CITIES } from '@/lib/data/places';

export const dynamic = 'force-dynamic';

const Query = z.object({ q: z.string().trim().min(2).max(60), type: z.enum(['airport', 'city']).optional() });

export const GET = route(async (ctx) => {
  const { q, type } = readQuery(ctx.req, Query);
  await rateLimit(ctx, 'places', 60, 60);
  if (supplyMode() === 'duffel') {
    const list = await duffelPlaces(q);
    return ok({ places: type ? list.filter((p) => p.type === type) : list });
  }
  const t = q.toLowerCase();
  const airports = AIRPORTS.filter((a) => a.code.toLowerCase() === t || a.name.toLowerCase().includes(t) || a.city.toLowerCase().startsWith(t))
    .map((a) => ({ code: a.code, name: a.name, city: a.city, country: a.country, type: 'airport' as const, lat: null, lng: null }));
  const cities = CITIES.filter((c) => !c.testOnly && c.name.toLowerCase().startsWith(t))
    .map((c) => ({ code: c.id, name: c.name, city: c.name, country: c.country, type: 'city' as const, lat: c.lat, lng: c.lng }));
  const places = type === 'airport' ? airports : type === 'city' ? cities : [...airports, ...cities];
  return ok({ places: places.slice(0, 12) });
});
