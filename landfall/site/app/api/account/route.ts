/* /api/account (signed in)
   GET    the profile
   PATCH  { firstName, lastName, phone, email? }: a new email is confirmed by a link Supabase sends
          to it before it takes effect ({ emailPending })
   DELETE { password }: deletes the account; its bookings stay on record, detached from it */
import { z } from 'zod';
import { ok, rateLimit, readJson, route } from '@/server/http';
import { requireUser } from '@/server/auth';
import { accountView, deleteAccount, updateProfile } from '@/server/accounts';
import { email, optionalPhone, personName } from '@/server/validation';

export const dynamic = 'force-dynamic';

export const GET = route(async () => ok({ account: accountView(await requireUser()) }));

const Patch = z.object({ firstName: personName, lastName: personName, phone: optionalPhone.default(''), email: email.optional() });

export const PATCH = route(async (ctx) => {
  const u = await requireUser();
  await rateLimit(ctx, 'profile', 20, 600, u.id);
  const v = await readJson(ctx.req, Patch);
  const { emailPending } = await updateProfile(u, v);
  return ok({ account: accountView({ ...u, firstName: v.firstName, lastName: v.lastName, phone: v.phone }, emailPending) });
});

const Delete = z.object({ password: z.string().min(1).max(72) });

export const DELETE = route(async (ctx) => {
  const u = await requireUser();
  await rateLimit(ctx, 'account-delete', 5, 3600, u.id);
  const v = await readJson(ctx.req, Delete);
  await deleteAccount(u, v.password);
  return ok({ deleted: true });
});
