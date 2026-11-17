/* =====================================================================
   Landfall server: encryption, tokens, references
   - Passenger documents are sealed with AES-256-GCM between checkout and
     booking (key: DATA_ENCRYPTION_KEY), so a database leak in that window
     exposes no passport numbers; the ciphertext is erased after booking.
   - Guest access keys are random; only their SHA-256 is stored.
   - Booking references come from a CSPRNG without modulo bias.
   ===================================================================== */
import 'server-only';
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { need } from '@/server/env';

const VERSION = 'v1';

function key(): Buffer {
  return Buffer.from(need('DATA_ENCRYPTION_KEY', 'encrypting passenger details'), 'base64');
}

export function seal(value: unknown, aad = ''): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  if (aad) cipher.setAAD(Buffer.from(aad));
  const ct = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString('base64url'), tag.toString('base64url'), ct.toString('base64url')].join('.');
}

/* aad binds the ciphertext to its row (the booking id), so it can't be moved to another booking */
export function unseal<T>(sealed: string, aad = ''): T {
  const [v, iv, tag, ct] = sealed.split('.');
  if (v !== VERSION || !iv || !tag || !ct) throw new Error('Unknown sealed format');
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64url'));
  if (aad) decipher.setAAD(Buffer.from(aad));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  const pt = Buffer.concat([decipher.update(Buffer.from(ct, 'base64url')), decipher.final()]);
  return JSON.parse(pt.toString('utf8')) as T;
}

export const randomToken = (bytes = 32) => randomBytes(bytes).toString('base64url');
export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
export const hmacSha256Hex = (secret: string, message: string) => createHmac('sha256', secret).update(message).digest('hex');

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/* letters and digits that can't be misread (no I, O, 0, 1); matches the bookings.reference check */
const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export function newReference(): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += REF_CHARS[randomInt(REF_CHARS.length)];
  return s;
}

/* The access key for a booking made signed out: derived from the booking id with the app key,
   so the confirmation email can carry it; only its SHA-256 is stored (bookings.guest_token_hash),
   and clearing that column revokes it. */
export function guestKeyFor(bookingId: string): string {
  return createHmac('sha256', key()).update(`guest-access:${bookingId}`).digest('base64url');
}

/* Proof that this browser opened a password-recovery link for this user in the last 15 minutes
   (an httpOnly cookie set by /auth/confirm): "<user id>.<expiry ms>.<HMAC>" */
export const RECOVERY_COOKIE = 'lf_recovery';
export const RECOVERY_TTL_S = 15 * 60;
export function recoveryToken(userId: string, now = Date.now()): string {
  const exp = now + RECOVERY_TTL_S * 1000;
  return `${userId}.${exp}.${createHmac('sha256', key()).update(`recovery:${userId}.${exp}`).digest('base64url')}`;
}
export function recoveryValid(token: string | undefined, userId: string, now = Date.now()): boolean {
  const [id, exp, mac] = (token ?? '').split('.');
  if (!id || !exp || !mac || id !== userId || !(Number(exp) > now)) return false;
  return safeEqual(mac, createHmac('sha256', key()).update(`recovery:${id}.${exp}`).digest('base64url'));
}

/* a one-way hash of the client IP for abuse checks, keyed so it can't be reversed by brute force */
export function ipHash(ip: string): string {
  const k = process.env.DATA_ENCRYPTION_KEY || 'landfall';
  return hmacSha256Hex(k, `ip:${ip}`).slice(0, 32);
}
