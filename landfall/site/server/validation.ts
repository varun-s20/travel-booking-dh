/* =====================================================================
   Landfall server: shared input rules for account routes
   ===================================================================== */
import 'server-only';
import { z } from 'zod';
import { isoDate } from '@/server/bookings/schemas';

export const email = z.email().max(254).transform((s) => s.trim().toLowerCase());
/* 8 characters at least (the forms say so); 72 at most (the bcrypt limit Supabase Auth hashes with) */
export const password = z.string().min(8, 'at least 8 characters').max(72, '72 characters at most');
export const personName = z.string().trim().min(1).max(60);
/* optional phone: empty, or international form after removing spaces and punctuation */
export const optionalPhone = z.string().trim().max(32)
  .transform((s) => (s ? s.replace(/[\s().\-]/g, '').replace(/^00/, '+') : ''))
  .pipe(z.union([z.literal(''), z.string().regex(/^\+[1-9]\d{6,14}$/, 'use the international format, starting with + and the country code')]));

export const traveler = z.object({
  title: z.string().trim().toLowerCase().pipe(z.enum(['mr', 'ms', 'mrs', 'miss', 'dr'])),
  given: z.string().trim().min(1).max(40),
  family: z.string().trim().min(1).max(40),
  bornOn: isoDate,
  gender: z.enum(['m', 'f']),
  type: z.enum(['adult', 'child', 'infant']).default('adult')
});
