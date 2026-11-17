/* =====================================================================
   Landfall (working name, a placeholder), group H: content pages
   About, Contact (with its form: a real status from /api/contact, never a
   fake success),
   Terms and Privacy (one reading column), and the 404 and error pages
   (the hero treatment at 60vh with a water photo, the search card).
   Copy: landfall/content/copy.md, Pages (as content/copy.md).
   ===================================================================== */
'use client';
import { useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SITE } from '@/lib/site';
import { api } from '@/lib/api';
import Photo from '@/components/ui/Photo';
import Notice from '@/components/ui/Notice';
import { Button } from '@/components/ui/Button';
import { TextArea, TextField } from '@/components/ui/Field';
import SearchCard from '@/components/search/SearchCard';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REF = /^[A-Za-z0-9]{6}$/;
/* ?topic= from a booking page: what the message is about, sent with it */
const TOPICS: Record<string, { label: string; message: string }> = {
  cancel: { label: 'Cancel a booking', message: 'I’d like to cancel this booking.' },
  change: { label: 'Change a booking', message: 'I’d like to ask about changing this booking.' }
};

/* POST /api/contact: stored on the server and sent to the support inbox. Success shows only when
   the server says it received the message. `website` is a honeypot: hidden from people and
   assistive technology, left empty by them, filled by bots. */
export function ContactForm() {
  const q = useSearchParams();
  const topicKey = q.get('topic') ?? '';
  const topic = TOPICS[topicKey];
  const refParam = (q.get('ref') ?? '').toUpperCase();
  const [v, setV] = useState({ name: '', email: '', ref: REF.test(refParam) ? refParam : '', message: topic?.message ?? '' });
  const [hp, setHp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed' | 'limited'>('idle');
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    const er: Record<string, string> = {};
    if (!v.name.trim()) er.name = 'Enter your name.';
    if (!EMAIL.test(v.email.trim())) er.email = 'Enter an email address like name@example.com.';
    if (v.ref.trim() && !REF.test(v.ref.trim())) er.ref = 'A booking reference has 6 letters and numbers.';
    if (!v.message.trim()) er.message = 'Write a message.';
    else if (v.message.length > 5000) er.message = 'Keep your message under 5,000 characters.';
    setErrors(er);
    const first = ['name', 'email', 'ref', 'message'].find((k) => er[k]);
    if (first) { document.getElementById(`ct-${first}`)?.focus(); return; }
    setState('sending');
    const r = await api<{ received: boolean }>('/api/contact', {
      method: 'POST',
      body: { name: v.name.trim(), email: v.email.trim(), reference: v.ref.trim() || undefined, topic: topic ? topicKey : undefined, message: v.message.trim(), website: hp }
    });
    if (r.data?.received) { setState('sent'); return; }
    if (r.error?.code === 'validation_failed') {
      const map: Record<string, string> = { name: 'name', email: 'email', reference: 'ref', message: 'message' };
      const fe: Record<string, string> = {};
      for (const f of (r.error.fields as { path: string }[] | undefined) ?? []) {
        const k = map[f.path];
        if (k) fe[k] = k === 'email' ? 'Enter an email address like name@example.com.' : k === 'ref' ? 'A booking reference has 6 letters and numbers.' : k === 'name' ? 'Enter your name.' : 'Write a message.';
      }
      if (Object.keys(fe).length) { setErrors(fe); setState('idle'); document.getElementById(`ct-${Object.keys(fe)[0]}`)?.focus(); return; }
    }
    setState(r.error?.code === 'too_many_requests' ? 'limited' : 'failed');
  };
  return (
    <form className="c-form" onSubmit={submit} noValidate>
      {topic && <p className="t-small t-muted">About: {topic.label}</p>}
      <div className="m-field__row -two">
        <TextField id="ct-name" label="Name" autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} />
        <TextField id="ct-email" label="Email" type="email" autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} />
      </div>
      <TextField id="ct-ref" label="Booking reference" optional hint="Six letters and numbers, for example K7MQ2D" value={v.ref} onChange={set('ref')} error={errors.ref} autoCapitalize="characters" />
      <TextArea id="ct-message" label="Message" rows={6} value={v.message} onChange={set('message')} error={errors.message} />
      {/* honeypot: people never see or reach it */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="ct-website">Website</label>
        <input id="ct-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>
      <div role="status" aria-live="polite">
        {state === 'sent' && <Notice tone="success">Your message is sent. We’ll reply to {v.email.trim()}.</Notice>}
        {state === 'failed' && <Notice tone="error">Your message didn’t send. Try again, or email {SITE.email}.</Notice>}
        {state === 'limited' && <Notice tone="error">You’ve sent several messages in a short time. Try again later, or email {SITE.email}.</Notice>}
      </div>
      <div><Button type="submit" large arrow disabled={state === 'sending'} aria-busy={state === 'sending' || undefined}>{state === 'sending' ? 'Sending' : 'Send message'}</Button></div>
    </form>
  );
}

/* 404 and error: the hero treatment at 60vh, then the search card */
export function Lost({ title, line, actions }: { title: string; line: ReactNode; actions: ReactNode }) {
  return (
    <div className="x-lost">
      <div className="x-lost__hero">
        <Photo name="pages/quay-colunas" alt="" box={false} priority sizes="(min-aspect-ratio: 3/2) 100vw, 90vh" />
        <div className="x-lost__scrim" aria-hidden="true" />
        <div className="x-lost__text">
          <h1 className="t-display t-h1">{title}</h1>
          <p className="t-lead">{line}</p>
        </div>
      </div>
      <div className="l-container x-lost__search">
        <SearchCard variant="hero" />
        <div className="x-lost__actions">{actions}</div>
      </div>
    </div>
  );
}

export function NotFoundBody() {
  return <Lost title="We couldn’t find that page" line="The link may be broken, or the page may have moved. Search again below, or go back to the home page."
    actions={<Link prefetch={false} className="a-link" href="/">Go to the home page</Link>} />;
}

export function ErrorBody({ retry }: { retry: () => void }) {
  return <Lost title="Something went wrong on our side" line={<>Please try again in a moment. If you were paying, check My bookings or your email first, so you don’t book twice.</>}
    actions={<><Button onClick={retry} arrow>Try again</Button><Link prefetch={false} className="a-link" href="/bookings">Go to My bookings</Link></>} />;
}

