/* =====================================================================
   Landfall server: accounts (Supabase Auth)
   Registration, sign in and out, forgot and reset password, profile,
   password change, account deletion and saved travelers. Sessions are
   Supabase's cookies (set through @supabase/ssr in the route handler).
   - Answers never say whether an email has an account (forgot password,
     sign up), so addresses can't be harvested.
   - Changing the password or deleting the account needs the current
     password, checked with a throwaway client that keeps no session.
   - Bookings made signed out with a confirmed email join the account at
     sign in (claim_guest_bookings).
   - Deleting an account keeps its bookings (legal and accounting records)
     but detaches them from the deleted user.
   ===================================================================== */
import 'server-only';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { RECOVERY_COOKIE, RECOVERY_TTL_S, recoveryToken, recoveryValid } from '@/server/crypto';
import { adminDb, userDb } from '@/server/db/supabase';
import { appOrigin, need } from '@/server/env';
import { AppError, conflict } from '@/server/errors';
import { log } from '@/server/log';
import type { SessionUser } from '@/server/auth';
import type { SavedTravelerRow } from '@/server/db/types';

export type AccountView = { id: string; email: string; firstName: string; lastName: string; phone: string; role: string; emailPending?: string | null };

/* Supabase auth errors as the site's codes */
function authError(e: { code?: string; status?: number; message?: string }): AppError {
  const c = e.code ?? '';
  if (c === 'invalid_credentials') return new AppError('mismatch', 401);
  if (c === 'email_not_confirmed') return new AppError('email_not_confirmed', 403);
  if (c === 'over_request_rate_limit' || c === 'over_email_send_rate_limit' || e.status === 429) return new AppError('too_many_requests', 429, undefined, { retry_after: 60 });
  if (c === 'weak_password') return new AppError('weak_password', 422);
  if (c === 'same_password') return new AppError('same_password', 422);
  if (c === 'user_already_exists' || c === 'email_exists') return new AppError('email_taken', 409);
  if (c === 'session_not_found' || c === 'refresh_token_not_found' || c === 'session_expired') return new AppError('unauthorized', 401);
  log.warn('auth.error', { code: c, status: e.status, message: e.message });
  return new AppError('auth_failed', 400);
}

async function claimGuest(userId: string, email: string | undefined, confirmed: boolean): Promise<void> {
  if (!email || !confirmed) return;
  const { data, error } = await adminDb().rpc('claim_guest_bookings', { p_user: userId, p_email: email });
  if (error) log.warn('auth.claim_guest', { error: error.message });
  else if (data) log.info('auth.claimed_guest_bookings', { userId, count: data });
}

export async function signIn(email: string, password: string): Promise<void> {
  const sb = await userDb();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw authError(error);
  await claimGuest(data.user.id, data.user.email, !!data.user.email_confirmed_at);
}

/* answers the same whether or not the address already has an account */
export async function signUp(v: { firstName: string; lastName: string; email: string; password: string }): Promise<{ confirmEmail: boolean }> {
  const sb = await userDb();
  const { data, error } = await sb.auth.signUp({
    email: v.email, password: v.password,
    options: { data: { first_name: v.firstName, last_name: v.lastName }, emailRedirectTo: `${appOrigin()}/auth/confirm?next=/bookings` }
  });
  if (error && error.code !== 'user_already_exists' && error.code !== 'email_exists') throw authError(error);
  return { confirmEmail: !data?.session };
}

export async function signOut(): Promise<void> {
  const sb = await userDb();
  await sb.auth.signOut({ scope: 'local' });
}

export async function forgotPassword(email: string): Promise<void> {
  const sb = await userDb();
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${appOrigin()}/auth/confirm?next=/reset-password` });
  /* rate limits are reported; "no such user" never is */
  if (error && (error.status === 429 || error.code?.startsWith('over_'))) throw authError(error);
  if (error) log.warn('auth.forgot', { code: error.code });
}

/* Only in the session /auth/confirm opened from a password-recovery email, within 15 minutes:
   any other session must use changePassword, which asks for the current password. */
export async function resetPassword(password: string): Promise<void> {
  const sb = await userDb();
  const { data } = await sb.auth.getClaims();
  const store = await cookies();
  const userId = data?.claims?.sub as string | undefined;
  if (!userId || !recoveryValid(store.get(RECOVERY_COOKIE)?.value, userId)) throw new AppError('link_expired', 401);
  const { error } = await sb.auth.updateUser({ password });
  if (error) throw authError(error);
  store.delete(RECOVERY_COOKIE);
}

/* the email link from Supabase (sign-up confirmation, password recovery, email change) */
export async function confirmEmailLink(tokenHash: string, type: 'email' | 'recovery' | 'email_change' | 'signup' | 'invite'): Promise<boolean> {
  const sb = await userDb();
  const { data, error } = await sb.auth.verifyOtp({ token_hash: tokenHash, type });
  if (error || !data.user) { log.info('auth.link_invalid', { type, code: error?.code }); return false; }
  if (type === 'email' || type === 'signup') await claimGuest(data.user.id, data.user.email, true);
  if (type === 'recovery') {
    (await cookies()).set(RECOVERY_COOKIE, recoveryToken(data.user.id), {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: RECOVERY_TTL_S
    });
  }
  return true;
}

export function accountView(u: SessionUser, emailPending?: string | null): AccountView {
  return { id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, phone: u.phone, role: u.role, emailPending: emailPending ?? null };
}

export async function updateProfile(u: SessionUser, v: { firstName: string; lastName: string; phone: string; email?: string }): Promise<{ emailPending: string | null }> {
  const sb = await userDb();
  const { error } = await sb.from('profiles').update({ first_name: v.firstName, last_name: v.lastName, phone: v.phone }).eq('id', u.id);
  if (error) throw new Error(`profiles.update: ${error.message}`);
  if (v.email && v.email.toLowerCase() !== u.email.toLowerCase()) {
    const { error: e2 } = await sb.auth.updateUser({ email: v.email }, { emailRedirectTo: `${appOrigin()}/auth/confirm?next=/account` });
    if (e2) throw authError(e2);
    return { emailPending: v.email };
  }
  return { emailPending: null };
}

/* checks a password without touching the visitor's session */
async function passwordMatches(email: string, password: string): Promise<boolean> {
  const probe = createClient(need('NEXT_PUBLIC_SUPABASE_URL', 'auth'), need('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'auth'), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  const { error } = await probe.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === 'invalid_credentials') return false;
    throw authError(error);
  }
  await probe.auth.signOut({ scope: 'local' });
  return true;
}

export async function changePassword(u: SessionUser, current: string, next: string): Promise<void> {
  if (!(await passwordMatches(u.email, current))) throw new AppError('mismatch', 401);
  const sb = await userDb();
  const { error } = await sb.auth.updateUser({ password: next });
  if (error) throw authError(error);
}

export async function deleteAccount(u: SessionUser, password: string): Promise<void> {
  if (!(await passwordMatches(u.email, password))) throw new AppError('mismatch', 401);
  const { error } = await adminDb().auth.admin.deleteUser(u.id);
  if (error) throw new Error(`auth.delete_user: ${error.message}`);
  const sb = await userDb();
  await sb.auth.signOut({ scope: 'local' });
  log.info('account.deleted', { userId: u.id });
}

/* ---------- saved travelers ---------- */
export type TravelerInput = { title: string; given: string; family: string; bornOn: string; gender: 'm' | 'f'; type: 'adult' | 'child' | 'infant' };
export type TravelerView = TravelerInput & { id: string };
const MAX_TRAVELERS = 20;
const travelerView = (r: SavedTravelerRow): TravelerView => ({ id: r.id, title: r.title, given: r.given_name, family: r.family_name, bornOn: r.born_on, gender: r.gender, type: r.passenger_type });
const travelerRow = (t: TravelerInput) => ({ title: t.title, given_name: t.given, family_name: t.family, born_on: t.bornOn, gender: t.gender, passenger_type: t.type });

export async function listTravelers(u: SessionUser): Promise<TravelerView[]> {
  const sb = await userDb();
  const { data, error } = await sb.from('saved_travelers').select('*').eq('user_id', u.id).order('created_at');
  if (error) throw new Error(`saved_travelers.list: ${error.message}`);
  return (data ?? []).map(travelerView);
}
export async function addTraveler(u: SessionUser, t: TravelerInput): Promise<TravelerView> {
  const sb = await userDb();
  const { count } = await sb.from('saved_travelers').select('id', { count: 'exact', head: true }).eq('user_id', u.id);
  if ((count ?? 0) >= MAX_TRAVELERS) throw conflict('too_many_travelers', { max: MAX_TRAVELERS });
  const { data, error } = await sb.from('saved_travelers').insert({ user_id: u.id, ...travelerRow(t) }).select('*').single();
  if (error) throw new Error(`saved_travelers.insert: ${error.message}`);
  return travelerView(data);
}
export async function updateTraveler(u: SessionUser, id: string, t: TravelerInput): Promise<TravelerView> {
  const sb = await userDb();
  const { data, error } = await sb.from('saved_travelers').update(travelerRow(t)).eq('id', id).eq('user_id', u.id).select('*').maybeSingle();
  if (error) throw new Error(`saved_travelers.update: ${error.message}`);
  if (!data) throw new AppError('not_found', 404);
  return travelerView(data);
}
export async function removeTraveler(u: SessionUser, id: string): Promise<void> {
  const sb = await userDb();
  const { error } = await sb.from('saved_travelers').delete().eq('id', id).eq('user_id', u.id);
  if (error) throw new Error(`saved_travelers.delete: ${error.message}`);
}

