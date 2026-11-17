/* POST /api/auth/sign-in { email, password }
   Opens a session (Supabase cookies). 401 mismatch, 403 email_not_confirmed, 429 too_many_requests.
   Limited per visitor and per address, on top of Supabase Auth's own limits. */
import { z } from 'zod';
import { ok, rateLimit, readJson, route } from '@/server/http';
import { signIn } from '@/server/accounts';
import { email } from '@/server/validation';
import { sha256 } from '@/server/crypto';

export const dynamic = 'force-dynamic';

const Body = z.object({ email, password: z.string().min(1).max(72) });

export const POST = route(async (ctx) => {
  const v = await readJson(ctx.req, Body);
  await rateLimit(ctx, 'sign-in-ip', 30, 900);
  await rateLimit(ctx, 'sign-in-email', 8, 900, sha256(v.email));
  await signIn(v.email, v.password);
  return ok({ signedIn: true });
});
