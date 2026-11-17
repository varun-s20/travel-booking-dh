/* The contact form's endpoint. The demo has no support inbox, so it
   answers that nothing was sent (copy.md: never a fake success). */
import { body, fail, ok, wait } from '@/lib/mock/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const b = await body<{ name?: string; email?: string; message?: string }>(req);
  if (!b?.name || !b.email || !b.message) return fail('invalid_request', 422);
  await wait(800);
  return ok({ delivered: false, demo: true });
}
