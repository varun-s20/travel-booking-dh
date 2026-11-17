/* =====================================================================
   Landfall server: sending email
   Every email is written to email_log first, then delivered:
   - with SMTP configured (any provider: Resend, Postmark, SES...) it is
     sent and marked sent, or marked failed for the job to retry;
   - without SMTP (development) it is marked logged and printed to the
     server console, so flows can be tested with no email account.
   A dedupe key (e.g. booking_confirmed:<booking id>) makes an email go
   out once, however many workers finish the same booking. Account emails
   (confirm address, reset password) are sent by Supabase Auth, not here.
   ===================================================================== */
import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { adminDb } from '@/server/db/supabase';
import { env, smtpConfigured } from '@/server/env';
import { log } from '@/server/log';

export type OutgoingEmail = {
  template: string; to: string; subject: string; html: string; text: string;
  replyTo?: string; bookingId?: string | null; dedupeKey?: string; payload?: Record<string, unknown>;
};
export type SendResult = 'sent' | 'logged' | 'duplicate' | 'failed';

let transport: Transporter | null = null;
function smtp(): Transporter {
  if (!transport) {
    const e = env();
    transport = nodemailer.createTransport({
      host: e.SMTP_HOST, port: e.SMTP_PORT, secure: e.SMTP_PORT === 465,
      auth: e.SMTP_USER ? { user: e.SMTP_USER, pass: e.SMTP_PASSWORD } : undefined,
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000
    });
  }
  return transport;
}

export async function sendEmail(m: OutgoingEmail): Promise<SendResult> {
  const db = adminDb();
  /* claim the dedupe key; an earlier failed or pending row with the same key is retried */
  let id: string;
  const { data: inserted, error } = await db.from('email_log').insert({
    template: m.template, to_email: m.to, subject: m.subject, booking_id: m.bookingId ?? null,
    dedupe_key: m.dedupeKey ?? null, payload: (m.payload ?? {}) as never, status: 'pending'
  }).select('id').single();
  if (error) {
    if (error.code !== '23505' || !m.dedupeKey) throw new Error(`email_log.insert: ${error.message}`);
    const { data: prev } = await db.from('email_log').select('id, status').eq('dedupe_key', m.dedupeKey).single();
    if (!prev || prev.status === 'sent' || prev.status === 'logged') return 'duplicate';
    id = prev.id;
  } else {
    id = inserted.id;
  }
  return deliver(id, m);
}

/* sends (again) the email of an existing email_log row */
export async function deliver(id: string, m: OutgoingEmail): Promise<SendResult> {
  const db = adminDb();
  const { data: row } = await db.from('email_log').select('attempts').eq('id', id).single();
  const attempts = (row?.attempts ?? 0) + 1;
  if (!smtpConfigured()) {
    await db.from('email_log').update({ status: 'logged', attempts, sent_at: new Date().toISOString() }).eq('id', id);
    log.info('email.logged', { template: m.template, to: m.to, subject: m.subject });
    if (env().NODE_ENV !== 'production') console.log(`\n----- email (not sent: SMTP_HOST is empty) -----\nTo: ${m.to}\nSubject: ${m.subject}\n\n${m.text}\n-----\n`);
    return 'logged';
  }
  try {
    const info = await smtp().sendMail({ from: env().EMAIL_FROM, to: m.to, subject: m.subject, html: m.html, text: m.text, replyTo: m.replyTo });
    await db.from('email_log').update({ status: 'sent', attempts, message_id: info.messageId ?? null, sent_at: new Date().toISOString(), last_error: null }).eq('id', id);
    log.info('email.sent', { template: m.template, to: m.to });
    return 'sent';
  } catch (e) {
    const message = (e as Error).message?.slice(0, 500) ?? 'send failed';
    await db.from('email_log').update({ status: 'failed', attempts, last_error: message }).eq('id', id);
    log.error('email.failed', { template: m.template, to: m.to, error: message });
    return 'failed';
  }
}
