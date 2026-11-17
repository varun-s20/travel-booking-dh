'use client';
/* =====================================================================
   The contact form (spec 2b; conventions.md: never a fake success). It
   posts to /api/contact, which in this demo has no inbox to deliver to,
   so the result says so (copy.md, Contact). Field names for the live
   endpoint: name, email, reference, message.
   ===================================================================== */
import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { TextArea, TextField } from '@/components/ui/Field';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const [v, setV] = useState({ name: '', email: '', reference: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const errs: Record<string, string> = {};
    if (!v.name.trim()) errs['ct-name'] = 'Enter your name.';
    if (!EMAIL.test(v.email.trim())) errs['ct-email'] = 'Enter an email address like name@example.com.';
    if (v.reference.trim() && !/^[A-Za-z0-9]{6}$/.test(v.reference.trim())) errs['ct-ref'] = 'A booking reference has 6 letters and numbers.';
    if (!v.message.trim()) errs['ct-message'] = 'Write a message.';
    setErrors(errs); setResult('');
    if (Object.keys(errs).length) { document.getElementById(Object.keys(errs)[0])?.focus(); return; }
    setBusy(true);
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...v, reference: v.reference.trim().toUpperCase() }) });
      const j = await r.json();
      setResult(r.ok && j.data ? `Thanks, your message is on its way. We’ll reply to ${v.email.trim()}.` : 'Your message didn’t send. Try again, or email hello@example.com.');
    } catch {
      setResult('Your message didn’t send. Try again, or email hello@example.com.');
    }
    setBusy(false);
    window.setTimeout(() => document.getElementById('ct-result')?.focus(), 0);
  }

  return (
    <form className="o-contact__form" noValidate onSubmit={submit} aria-labelledby="ct-title">
      <h2 className="a-h3" id="ct-title">Send us a message</h2>
      <TextField id="ct-name" name="name" label="Name" autoComplete="name" value={v.name} error={errors['ct-name']} onChange={(e) => setV({ ...v, name: e.target.value })} />
      <TextField id="ct-email" name="email" label="Email" type="email" autoComplete="email" inputMode="email" value={v.email} error={errors['ct-email']} onChange={(e) => setV({ ...v, email: e.target.value })} />
      <TextField id="ct-ref" name="reference" label="Booking reference (optional)" help="Six letters and numbers, for example K7MQ2D" autoComplete="off" value={v.reference} error={errors['ct-ref']} onChange={(e) => setV({ ...v, reference: e.target.value })} />
      <TextArea id="ct-message" name="message" label="Message" value={v.message} error={errors['ct-message']} onChange={(e) => setV({ ...v, message: e.target.value })} />
      <button className="a-button" type="submit" aria-disabled={busy || undefined}><span className="a-button__label">Send message</span><Icon name="arrow" className="a-button__icon" /></button>
      <p className="o-contact__result" id="ct-result" tabIndex={-1} role="status" hidden={!result}><Icon name="info" size="s" />{result}</p>
    </form>
  );
}
