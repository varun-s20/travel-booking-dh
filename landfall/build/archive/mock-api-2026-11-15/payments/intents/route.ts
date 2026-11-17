/* Simulated Stripe PaymentIntent: created for the amount on the Pay button. */
import { body, fail, ok, wait } from '@/lib/mock/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const b = await body<{ amount?: number; currency?: string }>(req);
  const amount = Math.round(Number(b?.amount));
  if (!Number.isFinite(amount) || amount <= 0) return fail('amount_invalid', 422);
  await wait(300);
  const id = `pi_demo_${Math.random().toString(36).slice(2, 12)}`;
  return ok({ id, client_secret: `${id}_secret_demo`, amount, currency: 'usd', status: 'requires_payment_method' }, 201);
}
