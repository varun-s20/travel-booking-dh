/* =====================================================================
   Landfall (working name, a placeholder), group H: sign-in pages
   Spec 2b, Account: a split page at 1025 and up, the left half a water
   photo of a hero city (the image rule, decorative), the right half a
   440 form column; at 390 the photo is a 160px strip with rounded lower
   corners above the form. Sign in, Create an account, Forgot password
   and Reset password, against the site's API (Supabase Auth behind it:
   app/api/auth/*). Accounts are confirmed by email before first sign in;
   the reset link opens a recovery session through /auth/confirm.
   Copy: landfall/content/copy.md, Account (as content/copy.md, with the
   Sign in swap).
   ===================================================================== */
'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, type ApiError } from '@/lib/api';
import { refreshSession, useSession, type AccountUser } from '@/lib/session';
import { toast } from '@/lib/client';
import Photo from '@/components/ui/Photo';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Checkbox, PasswordField, TextField } from '@/components/ui/Field';
import Notice from '@/components/ui/Notice';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHOTOS = {
  login: { name: 'hero/lisbon-alfama-river', fx: 46, fy: 58, tall: '150vh' },
  register: { name: 'hero/cape-town-waterfront', fx: 40, fy: 62, tall: '150vh' },
  forgot: { name: 'hero/new-york-harbour', fx: 62, fy: 55, tall: '205vh' },
  reset: { name: 'hero/new-york-harbour', fx: 62, fy: 55, tall: '205vh' }
} as const;

/* the server's answers in the pages' words */
const TOO_MANY = 'Too many attempts. Wait a few minutes, then try again or reset your password.';
const NETWORK = 'We couldn’t reach Landfall just now. Check your connection and try again.';
const WEAK = 'Choose a stronger password: longer, and not a common word or phrase.';
const generic = (e: ApiError) => (e.code === 'network' ? NETWORK : e.code === 'too_many_requests' ? TOO_MANY : 'Something went wrong on our side. Try again in a moment.');
/* validation_failed { fields: [{ path, message }] } -> the paths that failed */
const failedFields = (e: ApiError) => new Set(((e.fields as { path: string }[] | undefined) ?? []).map((f) => f.path));

export function AuthShell({ photo, children }: { photo: keyof typeof PHOTOS; children: ReactNode }) {
  const p = PHOTOS[photo];
  return (
    <div className="t-auth">
      <div className="a-photo -grade t-auth__photo" style={{ ['--fx' as string]: `${p.fx}%`, ['--fy' as string]: `${p.fy}%` }}>
        <Photo name={p.name} alt="" box={false} priority sizes={`(min-width: 1025px) ${p.tall}, 100vw`} />
      </div>
      <div className="t-auth__side"><div className="t-auth__col">{children}</div></div>
    </div>
  );
}

/* where to go after signing in: ?next= only when it resolves to a page on this site. Parsed as a
   URL against this origin (browsers drop tabs and newlines and read "\" as "/", so prefix checks
   alone let "/\t/evil.example" through), then reduced to its own path, query and hash. */
const BASE = 'https://landfall.invalid'; /* a fixed origin: the same answer on the server and in the browser */
export function safeNext(n: string | null, fallback = '/bookings'): string {
  if (!n || !n.startsWith('/')) return fallback;
  try {
    const u = new URL(n, BASE);
    const out = `${u.pathname}${u.search}${u.hash}`;
    /* "/.//evil.example" normalises to "//evil.example", which a browser reads as another host */
    return u.origin === BASE && !out.startsWith('//') ? out : fallback;
  } catch {
    return fallback;
  }
}
function useNext(): string {
  return safeNext(useSearchParams().get('next'));
}

export function SignIn() {
  const router = useRouter();
  const q = useSearchParams();
  const next = useNext();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [errors, setErrors] = useState<{ email?: string; pw?: string }>({});
  const [form, setForm] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const er: typeof errors = {};
    if (!email.trim()) er.email = 'Enter your email address.';
    else if (!EMAIL.test(email.trim())) er.email = 'Enter an email address like name@example.com.';
    if (!pw) er.pw = 'Enter your password.';
    setErrors(er);
    setForm(null);
    if (er.email) { document.getElementById('si-email')?.focus(); return; }
    if (er.pw) { document.getElementById('si-pw')?.focus(); return; }
    setBusy(true);
    const r = await api<{ signedIn: boolean }>('/api/auth/sign-in', { method: 'POST', body: { email: email.trim(), password: pw } });
    if (r.error) {
      setBusy(false);
      const c = r.error.code;
      setForm(c === 'mismatch' ? 'That email and password don’t match. Try again or reset your password.'
        : c === 'email_not_confirmed' ? 'Confirm your email first: we sent you a link when you created the account.'
        : generic(r.error));
      return;
    }
    await refreshSession();
    router.push(next);
  };
  return (
    <AuthShell photo="login">
      <h1 className="t-display t-h1">Sign in</h1>
      {q.get('reset') === '1' && <p className="t-lead">Sign in with your new password.</p>}
      {q.get('link') === 'expired' && <Notice tone="info">That link has expired or was already used. Sign in below, or create your account again if you never confirmed it.</Notice>}
      <div>{form && <Notice tone="error" focusOnMount role="alert">{form}</Notice>}</div>
      <form className="t-auth__form" onSubmit={submit} noValidate>
        <TextField id="si-email" label="Email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <PasswordField id="si-pw" label="Password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} error={errors.pw} />
        <Link prefetch={false} className="a-link t-auth__forgot" href="/forgot-password">Forgot your password?</Link>
        <Button type="submit" block large disabled={busy} aria-busy={busy || undefined}>{busy ? 'Signing in' : 'Sign in'}</Button>
      </form>
      <p className="t-auth__alt">New here? <Link prefetch={false} className="a-link" href={`/register${next !== '/bookings' ? `?next=${encodeURIComponent(next)}` : ''}`}>Create an account</Link></p>
    </AuthShell>
  );
}

export function Register() {
  const [v, setV] = useState({ first: '', last: '', email: '', pw: '', agree: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (sent) h1.current?.focus(); }, [sent]);
  const set = (k: 'first' | 'last' | 'email' | 'pw') => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const er: Record<string, string> = {};
    if (!v.first.trim()) er.first = 'Enter your first name.';
    if (!v.last.trim()) er.last = 'Enter your last name.';
    if (!EMAIL.test(v.email.trim())) er.email = 'Enter an email address like name@example.com.';
    if (v.pw.length < 8) er.pw = 'Use at least 8 characters.';
    else if (v.pw.length > 72) er.pw = 'Use 72 characters at most.';
    if (!v.agree) er.agree = 'Tick the box to agree to the terms.';
    setForm(null);
    if (!Object.keys(er).length) {
      setBusy(true);
      const r = await api<{ confirmEmail: boolean }>('/api/auth/sign-up', { method: 'POST', body: { firstName: v.first.trim(), lastName: v.last.trim(), email: v.email.trim(), password: v.pw } });
      setBusy(false);
      if (!r.error) { setSent(v.email.trim()); return; }
      if (r.error.code === 'weak_password') er.pw = WEAK;
      else if (r.error.code === 'validation_failed') {
        const f = failedFields(r.error);
        if (f.has('firstName')) er.first = 'Enter your first name.';
        if (f.has('lastName')) er.last = 'Enter your last name.';
        if (f.has('email')) er.email = 'Enter an email address like name@example.com.';
        if (f.has('password')) er.pw = 'Use between 8 and 72 characters.';
        if (!Object.keys(er).length) setForm(generic(r.error));
      } else setForm(generic(r.error));
    }
    setErrors(er);
    const first = ['first', 'last', 'email', 'pw', 'agree'].find((k) => er[k]);
    if (first) document.getElementById(`rg-${first}`)?.focus();
  };
  if (sent) return (
    <AuthShell photo="register">
      <h1 className="t-display t-h1" ref={h1} tabIndex={-1}>Check your inbox</h1>
      <p className="t-lead">We sent a link to {sent}. Open it to confirm your email and finish creating your account.</p>
      <p className="t-auth__alt"><Link prefetch={false} className="a-link" href="/login">Back to sign in</Link></p>
    </AuthShell>
  );
  return (
    <AuthShell photo="register">
      <h1 className="t-display t-h1">Create an account</h1>
      <p className="t-lead">Keep your bookings, booking references and e-ticket numbers in one place.</p>
      <div>{form && <Notice tone="error" focusOnMount role="alert">{form}</Notice>}</div>
      <form className="t-auth__form" onSubmit={submit} noValidate>
        <div className="m-field__row -two">
          <TextField id="rg-first" label="First name" autoComplete="given-name" value={v.first} onChange={set('first')} error={errors.first} />
          <TextField id="rg-last" label="Last name" autoComplete="family-name" value={v.last} onChange={set('last')} error={errors.last} />
        </div>
        <TextField id="rg-email" label="Email" type="email" autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email} />
        <PasswordField id="rg-pw" label="Password" autoComplete="new-password" hint="At least 8 characters." value={v.pw} onChange={set('pw')} error={errors.pw} />
        <Checkbox id="rg-agree" checked={v.agree} onChange={(e) => setV((x) => ({ ...x, agree: e.target.checked }))} error={errors.agree}>
          I agree to the <Link prefetch={false} className="a-link" href="/terms">Terms and conditions</Link> and <Link prefetch={false} className="a-link" href="/privacy">Privacy policy</Link>.
        </Checkbox>
        <Button type="submit" block large disabled={busy} aria-busy={busy || undefined}>{busy ? 'Creating your account' : 'Create account'}</Button>
      </form>
      <p className="t-auth__alt">Already have an account? <Link prefetch={false} className="a-link" href="/login">Sign in</Link></p>
    </AuthShell>
  );
}

export function Forgot() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const h1 = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (sent) h1.current?.focus(); }, [sent]);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!EMAIL.test(email.trim())) { setError('Enter an email address like name@example.com.'); document.getElementById('fp-email')?.focus(); return; }
    setError(undefined);
    setBusy(true);
    const r = await api<{ sent: boolean }>('/api/auth/forgot', { method: 'POST', body: { email: email.trim() } });
    setBusy(false);
    if (r.error) { setError(r.error.code === 'too_many_requests' ? 'Too many reset links asked for. Wait an hour, then try again.' : generic(r.error)); document.getElementById('fp-email')?.focus(); return; }
    setSent(email.trim());
  };
  if (sent) return (
    <AuthShell photo="forgot">
      <h1 className="t-display t-h1" ref={h1} tabIndex={-1}>Check your email</h1>
      <p className="t-lead">If there’s an account for {sent}, a reset link is on its way. It works once and expires after a short time.</p>
      <p className="t-auth__alt"><button type="button" className="a-link t-auth__again" onClick={() => setSent(null)}>Didn’t get it? Send another link</button></p>
      <p className="t-auth__alt"><Link prefetch={false} className="a-link" href="/login">Back to sign in</Link></p>
    </AuthShell>
  );
  return (
    <AuthShell photo="forgot">
      <h1 className="t-display t-h1">Reset your password</h1>
      <p className="t-lead">Enter the email you signed up with and we’ll send you a link to choose a new password.</p>
      <form className="t-auth__form" onSubmit={submit} noValidate>
        <TextField id="fp-email" label="Email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <Button type="submit" block large disabled={busy} aria-busy={busy || undefined}>{busy ? 'Sending' : 'Send reset link'}</Button>
      </form>
      <p className="t-auth__alt"><Link prefetch={false} className="a-link" href="/login">Back to sign in</Link></p>
    </AuthShell>
  );
}

/* reached from the email link: /auth/confirm opens a recovery session, then sends the visitor here */
export function Reset() {
  const router = useRouter();
  const q = useSearchParams();
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [errors, setErrors] = useState<{ a?: string; b?: string }>({});
  const [form, setForm] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (q.get('expired') === '1') return (
    <AuthShell photo="reset">
      <h1 className="t-display t-h1">This link has expired</h1>
      <p className="t-lead">Reset links work once and only for a short time. Ask for a new one.</p>
      <ButtonLink href="/forgot-password" block large>Send a new link</ButtonLink>
    </AuthShell>
  );
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const er: typeof errors = {};
    if (a.length < 8) er.a = 'Use at least 8 characters.';
    else if (a.length > 72) er.a = 'Use 72 characters at most.';
    else if (a !== b) er.b = 'These passwords don’t match.';
    setForm(null);
    if (!er.a && !er.b) {
      setBusy(true);
      const r = await api<{ reset: boolean }>('/api/auth/reset', { method: 'POST', body: { password: a } });
      setBusy(false);
      if (!r.error) {
        await refreshSession();
        toast('Password changed');
        router.push('/bookings');
        return;
      }
      const c = r.error.code;
      if (c === 'link_expired' || c === 'unauthorized') { router.replace('/reset-password?expired=1'); return; }
      if (c === 'same_password') er.a = 'Choose a password you haven’t used for this account before.';
      else if (c === 'weak_password') er.a = WEAK;
      else if (c === 'validation_failed') er.a = 'Use between 8 and 72 characters.';
      else setForm(generic(r.error));
    }
    setErrors(er);
    if (er.a) { document.getElementById('rp-a')?.focus(); return; }
    if (er.b) { document.getElementById('rp-b')?.focus(); return; }
  };
  return (
    <AuthShell photo="reset">
      <h1 className="t-display t-h1">Choose a new password</h1>
      <div>{form && <Notice tone="error" focusOnMount role="alert">{form}</Notice>}</div>
      <form className="t-auth__form" onSubmit={submit} noValidate>
        <PasswordField id="rp-a" label="New password" autoComplete="new-password" hint="At least 8 characters." value={a} onChange={(e) => setA(e.target.value)} error={errors.a} />
        <PasswordField id="rp-b" label="Confirm new password" autoComplete="new-password" value={b} onChange={(e) => setB(e.target.value)} error={errors.b} />
        <Button type="submit" block large disabled={busy} aria-busy={busy || undefined}>{busy ? 'Saving' : 'Save password'}</Button>
      </form>
    </AuthShell>
  );
}

/* signed-in pages: send a signed-out visitor to Sign in and back. undefined while the session is
   read; proxy.ts already redirects without a session, this covers one that ends on the page */
export function useSignedIn(path: string): AccountUser | null | undefined {
  const s = useSession();
  const router = useRouter();
  useEffect(() => { if (s.status === 'ready' && !s.user) router.replace(`/login?next=${encodeURIComponent(path)}`); }, [s, router, path]);
  return s.status === 'loading' ? undefined : s.user;
}
