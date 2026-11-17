/* GET /api/places?q=lis&type=airport|city
   Airport and city suggestions for the search fields.
   - Airports: Duffel's place suggestions when Duffel is the supplier, the built-in list otherwise.
   - Cities (the hotel destination): the curated cities first, then, with Duffel, any other city
     Duffel knows. Those get an id that carries their name and centre (lib/data/places.ts
     geoCityId), since Duffel Stays searches by coordinates. The simulated catalogue only has the
     curated cities, so without Duffel only those are offered. */
import { z } from 'zod';
import { ok, rateLimit, readQuery, route } from '@/server/http';
import { duffelLive, supplyMode } from '@/server/env';
import { duffelPlaces } from '@/server/supply/duffel';
import { AIRPORTS, CITIES, geoCityId } from '@/lib/data/places';

export const dynamic = 'force-dynamic';

const Query = z.object({ q: z.string().trim().min(2).max(60), type: z.enum(['airport', 'city']).optional() });
type Place = { code: string; name: string; city: string; country: string; type: 'airport' | 'city'; lat: number | null; lng: number | null };

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function curatedCities(q: string, withTest: boolean): Place[] {
  const t = fold(q);
  return CITIES.filter((c) => (!c.testOnly || withTest) && (fold(c.name).startsWith(t) || fold(c.name).includes(` ${t}`) || fold(c.country).startsWith(t)))
    .map((c) => ({ code: c.id, name: c.name, city: c.name, country: c.country, type: 'city', lat: c.lat, lng: c.lng }));
}

export const GET = route(async (ctx) => {
  const { q, type } = readQuery(ctx.req, Query);
  await rateLimit(ctx, 'places', 60, 60);
  const duffel = supplyMode() === 'duffel';
  const local = type === 'airport' ? [] : curatedCities(q, duffel && !duffelLive());

  if (duffel) {
    const list = await duffelPlaces(q);
    if (type === 'airport') return ok({ places: list.filter((p) => p.type === 'airport') });
    /* Duffel mostly answers with airports ("Porto Airport", city Porto) and has city entries only for
       multi-airport cities (London), centred on their airports' midpoint. So a destination is a city
       entry, or else an airport's city placed at the airport; one per city name and country. */
    const seen = new Set(local.map((c) => `${fold(c.name)}|${c.country}`));
    const cities: Place[] = [];
    for (const p of list) {
      const name = p.type === 'city' ? p.name : p.city;
      const key = `${fold(name)}|${p.country}`;
      if (!name || p.lat == null || p.lng == null || seen.has(key)) continue;
      const id = geoCityId(name, p.country, p.lat, p.lng);
      if (!id) continue;
      seen.add(key);
      cities.push({ code: id, name, city: name, country: p.country, type: 'city', lat: p.lat, lng: p.lng });
    }
    /* Duffel's order, with names that start with what was typed first ("porto": Porto before Beaumont/Port Arthur) */
    const t = fold(q);
    cities.sort((x, y) => Number(fold(y.name).startsWith(t)) - Number(fold(x.name).startsWith(t)));
    if (type === 'city') return ok({ places: [...local, ...cities].slice(0, 12) });
    return ok({ places: [...list, ...local.filter((c) => !list.some((p) => p.code === c.code))].slice(0, 12) });
  }

  const t = q.toLowerCase();
  const airports: Place[] = AIRPORTS.filter((a) => a.code.toLowerCase() === t || a.name.toLowerCase().includes(t) || a.city.toLowerCase().startsWith(t))
    .map((a) => ({ code: a.code, name: a.name, city: a.city, country: a.country, type: 'airport', lat: null, lng: null }));
  const places = type === 'airport' ? airports : type === 'city' ? local : [...airports, ...local];
  return ok({ places: places.slice(0, 12) });
});
