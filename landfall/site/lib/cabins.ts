/* Cabin classes, shared by the search (client) and the simulated backend
   (server), so neither imports the other. Labels: content/copy.md, Search. */
export type Cabin = 'economy' | 'premium_economy' | 'business' | 'first';

export const CABINS: { value: Cabin; label: string; short: string }[] = [
  { value: 'economy', label: 'Economy', short: 'Economy' },
  /* short: Overwing's search cell shows "Premium" so the longest value fits; Landfall's search may not need it */
  { value: 'premium_economy', label: 'Premium economy', short: 'Premium' },
  { value: 'business', label: 'Business', short: 'Business' },
  { value: 'first', label: 'First', short: 'First' }
];

export function cabinLabel(c: Cabin): string {
  return CABINS.find((x) => x.value === c)?.label ?? 'Economy';
}

export function isCabin(v: unknown): v is Cabin {
  return typeof v === 'string' && CABINS.some((c) => c.value === v);
}
