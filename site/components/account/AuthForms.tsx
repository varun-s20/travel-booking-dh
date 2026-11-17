'use client';
/* =====================================================================
   Account forms (spec 2b: one 440 column, centred, H1 32px, the fields
   of the booking forms, one deep pill, secondary links under it): log in,
   sign up, forgot and reset password. The simulated accounts live in the
   browser (lib/store.ts explains the demo log in rules). Copy:
   content/copy.md, Account.
   ===================================================================== */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { CheckField, TextField } from '@/components/ui/Field';
import { currentUser, logIn, register, useStore } from '@/lib/store';
import { toast } from '@/lib/client';
import { ROUTES } from '@/lib/site';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const safeNext = (n: string | undefined, d: string) => (n && n.startsWith('/') && !n.startsWith('//') ? n : d);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Password({ id, label, help, value, error, onChange, autoComplete }: { id: string; label: string; help?: string; value: string; error?: string; onChange: (v: string) => void; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <TextField id={id} label={label} help={help} type={show ? 'text' : 'password'} autoComplete={autoComplete} value={value} error={error} onChange={(e) => onChange(e.target.value)}
      after={<button className="a-link" type="button" aria-controls={id} aria-pressed={show} onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</button>} />
  );
}

function FormError({ id, msg }: { id: string; msg: string }) {
  return <p className="o-auth__error" id={id} tabIndex={-1} role="alert" hidden={!msg}><Icon name="alert" size="s" />{msg}</p>;
}

function focusFirst(errs: Record<string, string>) {
  const first = Object.keys(errs)[0];
  if (first) window.setTimeout(() => document.getElementById(first)?.focus(), 0);
}

/* ===== Log in ===== */
export function LoginForm({ next, reset }: { next?: string; reset?: boolean }) {
  const router = useRouter();
  const user = currentUser(useStore());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (user && !busy) router.replace(safeNext(next, ROUTES.account)); }, [user, busy, next, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const errs: Record<string, string> = {};
    if (!email.trim()) errs['li-email'] = 'Enter your email address.';
    if (!password) errs['li-password'] = 'Enter your password.';
    setErrors(errs); setFormError('');
    if (Object.keys(errs).length) return focusFirst(errs);
    setBusy(true);
    await wait(700);
    const r = logIn(email.trim(), password);
    if (r.ok) { router.replace(safeNext(next, ROUTES.account)); return; }
    setBusy(false);
    setFormError((r as { error: string }).error === 'too_many' ? 'Too many attempts. Wait a few minutes, then try again or reset your password.' : 'That email and password don’t match. Try again or reset your password.');
    window.setTimeout(() => document.getElementById('li-error')?.focus(), 0);
  }

  return (
    <div className="o-auth">
      <h1 className="o-auth__title">Log in</h1>
      {reset && <p className="o-auth__intro" role="status">Log in with your new password.</p>}
      <form className="o-auth__form" noValidate onSubmit={submit}>
        <FormError id="li-error" msg={formError} />
        <TextField id="li-email" label="Email" type="email" autoComplete="email" inputMode="email" value={email} error={errors['li-email']} onChange={(e) => setEmail(e.target.value)} />
        <Password id="li-password" label="Password" autoComplete="current-password" value={password} error={errors['li-password']} onChange={setPassword} />
        <Link className="a-link o-auth__forgot" href={ROUTES.forgot}>Forgot your password?</Link>
        <button className="a-button -block" type="submit" aria-disabled={busy || undefined}><span className="a-button__label">Log in</span></button>
      </form>
      <p className="o-auth__alt">New here? <Link className="a-link" href={next ? `${ROUTES.register}?next=${encodeURIComponent(next)}` : ROUTES.register}>Create an account</Link></p>
    </div>
  );
}

/* ===== Sign up ===== */
export function RegisterForm({ next }: { next?: string }) {
  const router = useRouter();
  const [v, setV] = useState({ first: '', last: '', email: '', password: '', terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const errs: Record<string, string> = {};
    if (!v.first.trim()) errs['su-first'] = 'Enter your first name.';
    if (!v.last.trim()) errs['su-last'] = 'Enter your last name.';
    if (!EMAIL.test(v.email.trim())) errs['su-email'] = 'Enter an email address like name@example.com.';
    if (v.password.length < 8) errs['su-password'] = 'Use at least 8 characters.';
    if (!v.terms) errs['su-terms'] = 'Tick the box to agree to the terms.';
    setErrors(errs); setFormError('');
    if (Object.keys(errs).length) return focusFirst(errs);
    setBusy(true);
    await wait(800);
    const r = register({ firstName: v.first, lastName: v.last, email: v.email, password: v.password });
    if (r.ok) { router.replace(safeNext(next, ROUTES.bookings)); return; }
    setBusy(false);
    setFormError('An account with this email already exists. Log in or reset your password.');
    window.setTimeout(() => document.getElementById('su-error')?.focus(), 0);
  }

  return (
    <div className="o-auth">
      <h1 className="o-auth__title">Create an account</h1>
      <p className="o-auth__intro">Keep your bookings, booking references and e-ticket numbers in one place.</p>
      <form className="o-auth__form" noValidate onSubmit={submit}>
        <FormError id="su-error" msg={formError} />
        <TextField id="su-first" label="First name" autoComplete="given-name" value={v.first} error={errors['su-first']} onChange={(e) => setV({ ...v, first: e.target.value })} />
        <TextField id="su-last" label="Last name" autoComplete="family-name" value={v.last} error={errors['su-last']} onChange={(e) => setV({ ...v, last: e.target.value })} />
        <TextField id="su-email" label="Email" type="email" autoComplete="email" inputMode="email" value={v.email} error={errors['su-email']} onChange={(e) => setV({ ...v, email: e.target.value })} />
        <Password id="su-password" label="Password" help="At least 8 characters." autoComplete="new-password" value={v.password} error={errors['su-password']} onChange={(p) => setV({ ...v, password: p })} />
        <CheckField id="su-terms" checked={v.terms} error={errors['su-terms']} onChange={(e) => setV({ ...v, terms: e.target.checked })}
          label={<>I agree to the <Link href={ROUTES.terms}>Terms and conditions</Link> and <Link href={ROUTES.privacy}>Privacy policy</Link>.</>} />
        <button className="a-button -block" type="submit" aria-disabled={busy || undefined}><span className="a-button__label">Create account</span></button>
      </form>
      <p className="o-auth__alt">Already have an account? <Link className="a-link" href={next ? `${ROUTES.login}?next=${encodeURIComponent(next)}` : ROUTES.login}>Log in</Link></p>
    </div>
  );
}

/* ===== Forgot password ===== */
export function ForgotForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');
  const [busy, setBusy] = useState(false);
  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    if (busy) return;
    if (!EMAIL.test(email.trim())) { setError('Enter an email address like name@example.com.'); focusFirst({ 'fp-email': 'x' }); return; }
    setError(''); setBusy(true);
    await wait(800);
    setBusy(false); setSent(email.trim());
    window.setTimeout(() => document.getElementById('fp-sent')?.focus(), 0);
  }
  if (sent) {
    return (
      <div className="o-auth">
        <h1 className="o-auth__title" id="fp-sent" tabIndex={-1}>Check your email</h1>
        <p className="o-auth__intro">If there’s an account for {sent}, a reset link is on its way. It works once and expires after a short time.</p>
        <p className="o-auth__alt"><button className="a-link" type="button" onClick={() => { void send(); }}>Didn’t get it? Send another link</button></p>
        <p className="o-auth__alt"><Link className="a-link" href={ROUTES.login}>Back to log in</Link></p>
      </div>
    );
  }
  return (
    <div className="o-auth">
      <h1 className="o-auth__title">Reset your password</h1>
      <p className="o-auth__intro">Enter the email you signed up with and we’ll send you a link to choose a new password.</p>
      <form className="o-auth__form" noValidate onSubmit={send}>
        <TextField id="fp-email" label="Email" type="email" autoComplete="email" inputMode="email" value={email} error={error} onChange={(e) => setEmail(e.target.value)} />
        <button className="a-button -block" type="submit" aria-disabled={busy || undefined}><span className="a-button__label">Send reset link</span></button>
      </form>
      <p className="o-auth__alt"><Link className="a-link" href={ROUTES.login}>Back to log in</Link></p>
    </div>
  );
}

/* ===== Reset password (the emailed link; ?token=expired shows the expired state) ===== */
export function ResetForm({ expired }: { expired: boolean }) {
  const router = useRouter();
  useEffect(() => { if (expired) document.title = 'This link has expired | Overwing'; }, [expired]);
  const [pw, setPw] = useState('');
  const [again, setAgain] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  if (expired) {
    return (
      <div className="o-auth">
        <h1 className="o-auth__title">This link has expired</h1>
        <p className="o-auth__intro">Reset links work once and only for a short time. Ask for a new one.</p>
        <Link className="a-button -block" href={ROUTES.forgot}><span className="a-button__label">Send a new link</span></Link>
      </div>
    );
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (pw.length < 8) errs['rp-new'] = 'Use at least 8 characters.';
    else if (pw !== again) errs['rp-again'] = 'These passwords don’t match.';
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirst(errs);
    toast('Password changed');
    router.replace(`${ROUTES.login}?reset=1`);
  }
  return (
    <div className="o-auth">
      <h1 className="o-auth__title">Choose a new password</h1>
      <form className="o-auth__form" noValidate onSubmit={submit}>
        <Password id="rp-new" label="New password" help="At least 8 characters." autoComplete="new-password" value={pw} error={errors['rp-new']} onChange={setPw} />
        <Password id="rp-again" label="Confirm new password" autoComplete="new-password" value={again} error={errors['rp-again']} onChange={setAgain} />
        <button className="a-button -block" type="submit"><span className="a-button__label">Save password</span></button>
      </form>
    </div>
  );
}
