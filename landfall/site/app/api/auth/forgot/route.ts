/* POST /api/auth/forgot { email }
   Sends the password reset email (Supabase Auth, template supabase/templates/recovery.html).
   Always answers { sent: true }, so it never reveals whether an address has an account. */
import { z } from 'zod';
import { ok, rateLimit, readJson, route } from '@/server/http';
import { forgotPassword } from '@/server/accounts';
import { email } from '@/server/validation';
import { sha256 } from '@/server/crypto';

export const dynamic = 'force-dynamic';

const Body = z.object({ email });

export const POST = route(async (ctx) => {
  const v = await readJson(ctx.req, Body);
  await rateLimit(ctx, 'forgot-ip', 10, 3600);
  await rateLimit(ctx, 'forgot-email', 3, 3600, sha256(v.email));
  await forgotPassword(v.email);
  return ok({ sent: true });
});
