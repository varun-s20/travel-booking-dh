/* POST /api/account/password { current, next } (signed in)
   Changes the password after checking the current one. 401 mismatch, 422 same_password / weak_password. */
import { z } from 'zod';
import { ok, rateLimit, readJson, route } from '@/server/http';
import { requireUser } from '@/server/auth';
import { changePassword } from '@/server/accounts';
import { password } from '@/server/validation';

export const dynamic = 'force-dynamic';

const Body = z.object({ current: z.string().min(1).max(72), next: password });

export const POST = route(async (ctx) => {
  const u = await requireUser();
  await rateLimit(ctx, 'password-change', 5, 900, u.id);
  const v = await readJson(ctx.req, Body);
  await changePassword(u, v.current, v.next);
  return ok({ changed: true });
});
