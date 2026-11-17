/* =====================================================================
   Landfall: names for codes (airports, cities, airlines)
   Pages show "Lisbon" and "Kittiwake Air" where data carries "LIS" and
   "KT". The demo airports are seeded here; every supplier response
   carries a `dict` with the names for the codes it uses, and whoever
   receives one calls registerDict() before rendering. Registration only
   adds public facts (an airport's name never differs between visitors),
   so it is safe in shared server memory and idempotent during render.
   ===================================================================== */
import { AIRPORTS } from '@/lib/data/places';

export type PlaceInfo = { code: string; name: string; city: string; country?: string };
export type AirlineInfo = { code: string; name: string; logo?: string | null };
export type Dict = { places?: Record<string, PlaceInfo>; airlines?: Record<string, AirlineInfo> };

const PLACES: Record<string, PlaceInfo> = Object.fromEntries(
  AIRPORTS.map((a) => [a.code, { code: a.code, name: a.name, city: a.city, country: a.country }])
);
/* Airline names by code; filled from dicts. Read through airlineName() where a code may be unknown. */
export const AIRLINES: Record<string, AirlineInfo> = {};

const MAX = 20000; /* a ceiling on shared memory: there are about 10,000 airports */

export function registerDict(d: Dict | null | undefined): void {
  if (!d) return;
  for (const [k, v] of Object.entries(d.places ?? {})) if (!PLACES[k] && Object.keys(PLACES).length < MAX) PLACES[k] = v;
  for (const [k, v] of Object.entries(d.airlines ?? {})) if (!AIRLINES[k] && Object.keys(AIRLINES).length < MAX) AIRLINES[k] = v;
}

export const airport = (code: string): PlaceInfo | undefined => PLACES[code];
export const airlineOf = (code: string): AirlineInfo | undefined => AIRLINES[code];
export const airlineName = (code: string): string => AIRLINES[code]?.name ?? code;

/* "Lisbon" for LIS; the code itself when nothing is known */
export const cityOf = (code: string): string => PLACES[code]?.city ?? code;

/* "London Heathrow" where a city has more than one known airport, otherwise the city */
export function placeName(code: string): string {
  const a = PLACES[code];
  if (!a) return code;
  const same = Object.values(PLACES).filter((x) => x.city === a.city).length;
  return same > 1 ? a.name : a.city;
}

/* a dict holding just these codes, for a response or a stored booking */
export function dictFor(placeCodes: Iterable<string>, airlineCodes: Iterable<string>): Dict {
  const places: Record<string, PlaceInfo> = {};
  const airlines: Record<string, AirlineInfo> = {};
  for (const c of placeCodes) if (PLACES[c]) places[c] = PLACES[c];
  for (const c of airlineCodes) if (AIRLINES[c]) airlines[c] = AIRLINES[c];
  return { places, airlines };
}
