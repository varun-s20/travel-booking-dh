/* =====================================================================
   Landfall server: checkout input
   Everything the browser sends at checkout, validated before any
   supplier or payment call. Rules follow what Duffel accepts:
   - names: letters (ASCII, Latin-1, Latin Extended-A), spaces, hyphens
     and apostrophes; a traveler's given and family name 40 characters
     together at most;
   - phone numbers in international (E.164) form; spaces, dots, dashes
     and brackets are removed first, a leading 00 becomes +;
   - dates as YYYY-MM-DD; passport countries as ISO alpha-2 codes.
   ===================================================================== */
import 'server-only';
import { z } from 'zod';
import { isCountryCode } from '@/lib/data/countries';
import { FARE_TIERS } from '@/lib/travel/flights';

const NAME = /^[A-Za-zÀ-ÖØ-öø-ſ]+(?:[ '’-][A-Za-zÀ-ÖØ-öø-ſ]+)*$/;
const name = z.string().trim().min(1).max(40).regex(NAME, 'letters, spaces, hyphens and apostrophes only').transform((s) => s.replace(/’/g, "'"));
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((s) => !Number.isNaN(Date.parse(`${s}T00:00:00Z`)), 'not a date');

export const phone = z.string().trim()
  .transform((s) => s.replace(/[\s().\-]/g, '').replace(/^00/, '+'))
  .pipe(z.string().regex(/^\+[1-9]\d{6,14}$/, 'use the international format, starting with + and the country code'));

export const contact = z.object({
  email: z.email().max(254).transform((s) => s.trim().toLowerCase()),
  phone
});

export const checkoutKey = z.string().min(16).max(64).regex(/^[A-Za-z0-9_-]+$/);

export const flightTraveler = z.object({
  title: z.string().trim().toLowerCase().pipe(z.enum(['mr', 'ms', 'mrs', 'miss', 'dr'])),
  given: name,
  family: name,
  bornOn: isoDate,
  gender: z.enum(['m', 'f']),
  type: z.enum(['adult', 'child', 'infant']),
  passport: z.object({
    number: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{5,20}$/, 'letters and digits only'),
    country: z.string().trim().toUpperCase().refine(isCountryCode, 'unknown country'),
    expiresOn: isoDate
  }).nullable().optional(),
  /* save this traveler to the signed-in customer's profile */
  save: z.boolean().optional()
}).refine((t) => t.given.length + t.family.length <= 40, { message: 'given and family name together can be 40 characters at most', path: ['family'] });

export const flightCheckout = z.object({
  kind: z.literal('flight'),
  checkoutKey,
  offerId: z.string().min(4).max(200),
  fare: z.enum(FARE_TIERS as [string, ...string[]]),
  expectedTotal: z.number().int().positive(),
  contact,
  travelers: z.array(flightTraveler).min(1).max(9)
});

export const stayCheckout = z.object({
  kind: z.literal('stay'),
  checkoutKey,
  hotelId: z.string().min(2).max(80),
  rateId: z.string().min(4).max(200),
  expectedTotal: z.number().int().positive(),
  contact,
  guests: z.array(z.object({ given: z.string().trim().min(1).max(60), family: z.string().trim().min(1).max(60) })).min(1).max(8),
  requests: z.string().trim().max(500).optional()
});

export const checkoutInput = z.discriminatedUnion('kind', [flightCheckout, stayCheckout]);
export type FlightCheckoutInput = z.infer<typeof flightCheckout>;
export type StayCheckoutInput = z.infer<typeof stayCheckout>;
export type CheckoutInput = z.infer<typeof checkoutInput>;

/* full years between two ISO dates */
export function ageOn(bornOn: string, onDate: string): number {
  const [by, bm, bd] = bornOn.split('-').map(Number);
  const [y, m, d] = onDate.split('-').map(Number);
  return y - by - (m < bm || (m === bm && d < bd) ? 1 : 0);
}
