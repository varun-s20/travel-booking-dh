/* POST /api/contact { name, email, topic?, reference?, message, website? }
   Stores the message (contact_messages) and emails it to SUPPORT_EMAIL with the sender as
   reply-to. `website` is a honeypot field the form keeps hidden: bots that fill it are accepted
   silently and dropped. Answers { received: true } only once the message is stored. */
import { z } from 'zod';
import { ok, rateLimit, readJson, route } from '@/server/http';
import { getUser } from '@/server/auth';
import { adminDb } from '@/server/db/supabase';
import { env } from '@/server/env';
import { ipHash } from '@/server/crypto';
import { log } from '@/server/log';
import { sendEmail } from '@/server/email/send';
import { esc } from '@/lib/emails';
import { email } from '@/server/validation';

export const dynamic = 'force-dynamic';

const Body = z.object({
  name: z.string().trim().min(1).max(100),
  email,
  topic: z.string().trim().max(60).optional(),
  reference: z.string().trim().toUpperCase().max(12).optional(),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(200).optional()
});

export const POST = route(async (ctx) => {
  await rateLimit(ctx, 'contact', 5, 3600);
  const v = await readJson(ctx.req, Body);
  if (v.website) { log.info('contact.honeypot'); return ok({ received: true }); }
  const user = await getUser();
  const { data, error } = await adminDb().from('contact_messages').insert({
    user_id: user?.id ?? null, name: v.name, email: v.email, topic: v.topic ?? null,
    booking_reference: v.reference || null, message: v.message, ip_hash: ipHash(ctx.ip)
  }).select('id').single();
  if (error) throw new Error(`contact_messages.insert: ${error.message}`);

  const to = env().SUPPORT_EMAIL;
  if (to) {
    const subject = `Contact form: ${v.topic || 'message'}${v.reference ? ` (booking ${v.reference})` : ''} from ${v.name}`;
    const text = `From: ${v.name} <${v.email}>\nTopic: ${v.topic || '-'}\nBooking: ${v.reference || '-'}\n\n${v.message}`;
    const html = `<p><strong>From:</strong> ${esc(v.name)} &lt;${esc(v.email)}&gt;<br><strong>Topic:</strong> ${esc(v.topic || '-')}<br><strong>Booking:</strong> ${esc(v.reference || '-')}</p><p style="white-space:pre-wrap">${esc(v.message)}</p>`;
    /* never fails the request: the message is stored, and the job retries a failed send */
    try {
      await sendEmail({ template: 'contact', to, subject, html, text, replyTo: v.email, dedupeKey: `contact:${data.id}`, payload: { html, text, replyTo: v.email } });
    } catch (e) { log.error('contact.email', { error: e }); }
  } else {
    log.warn('contact.no_support_email', { id: data.id });
  }
  return ok({ received: true }, 201);
});
