/* =====================================================================
   travel-booking (working name Overwing, a placeholder): the catalogue
   Typed access to content/mock-catalogue.md (demo data), which
   tools/catalogue.mjs writes to lib/data/catalogue.json: the 24 cities in
   6 regions, who flies each route from London, the twelve airlines and
   their fare families. Hotels are built in lib/mock/hotels.ts.
   Prices here are cents, for one adult in Economy, return, from London
   Heathrow, taxes and fees included.
   ===================================================================== */
import catalogue from '@/lib/data/catalogue.json';

export const REGIONS6 = ['Southern Europe', 'Northern and Western Europe', 'North America', 'Latin America', 'Asia and Pacific', 'Africa and Middle East'] as const;
export type Region6 = (typeof REGIONS6)[number];

type RawCity = { name: string; slug: string; region: string; country: string; iata: string; blurb: string; flightTime: string; returnFrom: number; typicalReturn: number; hasHotels: boolean };
type RawFamily = { name: string; step: number; personalItem: string; cabinBag: string; checkedBag: string; seatChoice: string; changes: string; refunds: string };
type RawAirline = { name: string; code: string; country: string; hub: string; aircraft: string; longAircraft: string; aircraftAll: string[]; ticketPrefix: string; online: boolean };
type Raw = {
  cities: RawCity[]; routeAirlines: Record<string, { nonstop: string[]; stops: { airline: string; via: string }[] }>;
  airlines: RawAirline[]; fareFamilies: Record<string, RawFamily[]>; centers: Record<string, string>; complete: boolean;
};
const RAW = catalogue as unknown as Raw;
export const CATALOGUE_COMPLETE = RAW.complete;

export type CatalogueCity = {
  slug: string; name: string; country: string; region: Region6; iata: string; blurb: string; flightTime: string;
  /* cents: the lowest return fare the mock search returns, and the usual fare on the route (deals compare against it) */
  returnFrom: number; typicalReturn: number; hasHotels: boolean; centerPoint: string;
};
export const CATALOGUE_CITIES: CatalogueCity[] = RAW.cities.map((c) => ({
  slug: c.slug, name: c.name, country: c.country, region: c.region as Region6, iata: c.iata, blurb: c.blurb, flightTime: c.flightTime,
  returnFrom: c.returnFrom * 100, typicalReturn: c.typicalReturn * 100, hasHotels: c.hasHotels, centerPoint: RAW.centers[c.slug] ?? ''
}));
export const catalogueCity = (slugOrIata: string) => CATALOGUE_CITIES.find((c) => c.slug === slugOrIata || c.iata === slugOrIata);

export type AirlineInfo = RawAirline;
export const CATALOGUE_AIRLINES: AirlineInfo[] = RAW.airlines;
const codeOf = (name: string) => RAW.airlines.find((a) => a.name === name)?.code ?? '';

/* Who flies each route from London: the first option owns the cheapest offer (catalogue section 1) */
export type RouteOption = { code: string; via: string | null };
export const ROUTE_OPTIONS: Record<string, RouteOption[]> = Object.fromEntries(
  RAW.cities.map((c) => {
    const r = RAW.routeAirlines[c.slug];
    if (!r) return [c.iata, []];
    const list: RouteOption[] = [...r.nonstop.map((n) => ({ code: codeOf(n), via: null })), ...r.stops.map((s) => ({ code: codeOf(s.airline), via: s.via || null }))].filter((o) => o.code);
    return [c.iata, list];
  })
);

export type FareFamily = RawFamily;
export const FARE_FAMILIES: Record<string, FareFamily[]> = RAW.fareFamilies;
