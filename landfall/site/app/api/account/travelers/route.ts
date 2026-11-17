/* /api/account/travelers (signed in): saved travelers for the passenger form
   GET  the list
   POST { title, given, family, bornOn, gender, type } */
import { ok, rateLimit, readJson, route } from '@/server/http';
import { requireUser } from '@/server/auth';
import { addTraveler, listTravelers } from '@/server/accounts';
import { traveler } from '@/server/validation';

export const dynamic = 'force-dynamic';

export const GET = route(async () => ok({ travelers: await listTravelers(await requireUser()) }));

export const POST = route(async (ctx) => {
  const u = await requireUser();
  await rateLimit(ctx, 'travelers', 30, 600, u.id);
  return ok({ traveler: await addTraveler(u, await readJson(ctx.req, traveler)) }, 201);
});
