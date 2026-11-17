/* /api/account/travelers/<id> (signed in, own travelers only)
   PATCH { title, given, family, bornOn, gender, type }
   DELETE */
import { ok, rateLimit, readJson, route } from '@/server/http';
import { requireUser } from '@/server/auth';
import { removeTraveler, updateTraveler } from '@/server/accounts';
import { traveler } from '@/server/validation';
import { notFound } from '@/server/errors';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const PATCH = route<{ id: string }>(async (ctx, { id }) => {
  if (!UUID.test(id)) throw notFound();
  const u = await requireUser();
  await rateLimit(ctx, 'travelers', 30, 600, u.id);
  return ok({ traveler: await updateTraveler(u, id, await readJson(ctx.req, traveler)) });
});

export const DELETE = route<{ id: string }>(async (ctx, { id }) => {
  if (!UUID.test(id)) throw notFound();
  const u = await requireUser();
  await rateLimit(ctx, 'travelers', 30, 600, u.id);
  await removeTraveler(u, id);
  return ok({ deleted: true });
});
