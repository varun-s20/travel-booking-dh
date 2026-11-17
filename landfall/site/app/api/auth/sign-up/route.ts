/* POST /api/auth/sign-up { firstName, lastName, email, password }
   Creates the account and sends Supabase's confirmation email. The answer is the same whether or
   not the address already has an account: { confirmEmail: true } (check your inbox). */
import { z } from 'zod';
import { ok, rateLimit, readJson, route } from '@/server/http';
import { signUp } from '@/server/accounts';
import { email, password, personName } from '@/server/validation';

export const dynamic = 'force-dynamic';

const Body = z.object({ firstName: personName, lastName: personName, email, password });

export const POST = route(async (ctx) => {
  await rateLimit(ctx, 'sign-up', 5, 3600);
  const v = await readJson(ctx.req, Body);
  return ok(await signUp(v), 201);
});
