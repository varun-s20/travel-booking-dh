/* Simulated Stripe confirmation with Stripe's own test cards:
   4242 4242 4242 4242 succeeds; 4000 0000 0000 0002 is declined;
   ...9995 insufficient funds; ...0069 expired card; 4000 0027 6000 3184
   fails the bank's check; ...0119 a processing error. Any other number is
   refused as invalid, as Stripe's test mode does. Nothing is charged. */
import { body, fail, ok, wait } from '@/lib/mock/server';

export const dynamic = 'force-dynamic';

const OUTCOMES: Record<string, { code: string; decline?: string } | null> = {
  '4242424242424242': null,
  '4000056655665556': null,
  '5555555555554444': null,
  '4000000000000002': { code: 'card_declined', decline: 'generic_decline' },
  '4000000000009995': { code: 'card_declined', decline: 'insufficient_funds' },
  '4000000000000069': { code: 'expired_card' },
  '4000002760003184': { code: 'payment_intent_authentication_failure' },
  '4000000000000119': { code: 'processing_error' }
};

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const b = await body<{ number?: string }>(req);
  const number = String(b?.number || '').replace(/\D/g, '');
  await wait(1200);
  if (!(number in OUTCOMES)) return fail('incorrect_number', 402);
  const outcome = OUTCOMES[number];
  if (outcome) return fail(outcome.code, 402, outcome.decline ? { decline_code: outcome.decline } : {});
  return ok({ id, status: 'requires_capture', card: { brand: number.startsWith('5') ? 'Mastercard' : 'Visa', last4: number.slice(-4) } });
}
