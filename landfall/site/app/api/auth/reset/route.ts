/* POST /api/auth/reset { password }
   Sets a new password in the recovery session that /auth/confirm opened from the email link.
   401 link_expired when there is no such session. */
import { z } from 'zod';
import { ok, rateLimit, readJson, route } from '@/server/http';
import { resetPassword } from '@/server/accounts';
import { password } from '@/server/validation';

export const dynamic = 'force-dynamic';

const Body = z.object({ password });

export const POST = route(async (ctx) => {
  await rateLimit(ctx, 'reset', 10, 3600);
  const v = await readJson(ctx.req, Body);
  await resetPassword(v.password);
  return ok({ reset: true });
});
