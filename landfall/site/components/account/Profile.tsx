/* =====================================================================
   Landfall (working name, a placeholder), group H: profile
   Spec 2b, Account, Profile: one 680 column of hairline cards, no
   sidebar: personal details, saved travelers, password, delete account,
   and Sign out at the end (landfall/content/copy.md, Profile).
   Data: /api/account (details, email change confirmed by a link to the
   new address, delete with the current password), /api/account/password
   and /api/account/travelers. After each change the session is read
   again so the header shows the new name.
   ===================================================================== */
'use client';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api, type ApiError } from '@/lib/api';
import { refreshSession, signOut } from '@/lib/session';
import { toast } from '@/lib/client';
import Dialog from '@/components/ui/Dialog';
import Notice from '@/components/ui/Notice';
import { Button } from '@/components/ui/Button';
import { PasswordField, SelectField, TextField } from '@/components/ui/Field';
import { useSignedIn } from './Auth';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TITLES = ['Mr', 'Ms', 'Mrs', 'Miss', 'Dr'];
const TOO_MANY = 'Too many attempts. Wait a few minutes, then try again.';
const WEAK = 'Choose a stronger password: longer, and not a common word or phrase.';
const failed = (e: ApiError) => (e.code === 'network' ? 'We couldn’t reach Landfall just now. Check your connection and try again.' : e.code === 'too_many_requests' ? TOO_MANY : 'Something went wrong on our side. Try again in a moment.');
const fieldsOf = (e: ApiError) => new Set(((e.fields as { path: string }[] | undefined) ?? []).map((f) => f.path));

/* a saved traveler as /api/account/travelers sends it (title lower case, date YYYY-MM-DD) */
export type SavedTraveler = { id: string; title: string; given: string; family: string; bornOn: string; gender: 'm' | 'f'; type: 'adult' | 'child' | 'infant' };
type TravelerEdit = { id: string | null; title: string; given: string; family: string; bornOn: string; gender: '' | 'm' | 'f' };
const titleCase = (t: string) => TITLES.find((x) => x.toLowerCase() === t.toLowerCase()) ?? '';

/* the traveler type follows the date of birth: under 2 an infant, under 12 a child */
function typeFor(bornOn: string): SavedTraveler['type'] {
  const [y, m, d] = bornOn.split('-').map(Number);
  const now = new Date();
  const age = now.getFullYear() - y - (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d) ? 1 : 0);
  return age < 2 ? 'infant' : age < 12 ? 'child' : 'adult';
}

/* the account's saved travelers, read once the visitor is signed in */
export function useSavedTravelers(enabled: boolean): { list: SavedTraveler[] | null; reload: () => Promise<void> } {
  const [list, setList] = useState<SavedTraveler[] | null>(null);
  const reload = useCallback(async () => {
    const r = await api<{ travelers: SavedTraveler[] }>('/api/account/travelers');
    setList(r.data?.travelers ?? []);
  }, []);
  useEffect(() => { if (enabled) void reload(); }, [enabled, reload]);
  return { list, reload };
}

export default function Profile() {
  const router = useRouter();
  const user = useSignedIn('/account');
  const { list: travelerList, reload } = useSavedTravelers(!!user);
  const travelers = travelerList ?? [];
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [dErr, setDErr] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<string | null>(null);
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ cur: '', a: '', b: '' });
  const [pwErr, setPwErr] = useState<Record<string, string>>({});
  const [trv, setTrv] = useState<TravelerEdit | null>(null);
  const [tErr, setTErr] = useState<Record<string, string>>({});
  const [removing, setRemoving] = useState<SavedTraveler | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [delPw, setDelPw] = useState('');
  const [delErr, setDelErr] = useState<string>();
  const [busy, setBusy] = useState(false);

  if (!user) return <div className="l-narrow p-profile" aria-busy="true" />;

  const startEdit = () => { setD({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone }); setDErr({}); setEdit(true); };
  const saveDetails = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const er: Record<string, string> = {};
    if (!d.firstName.trim()) er.firstName = 'Enter your first name.';
    if (!d.lastName.trim()) er.lastName = 'Enter your last name.';
    if (!EMAIL.test(d.email.trim())) er.email = 'Enter an email address like name@example.com.';
    if (!Object.keys(er).length) {
      setBusy(true);
      const r = await api<{ account: { emailPending: string | null } }>('/api/account', { method: 'PATCH', body: { firstName: d.firstName.trim(), lastName: d.lastName.trim(), phone: d.phone.trim(), email: d.email.trim() } });
      setBusy(false);
      if (!r.error) {
        setEdit(false);
        setPending(r.data.account.emailPending ?? null);
        await refreshSession();
        toast('Saved');
        return;
      }
      if (r.error.code === 'email_taken') er.email = 'An account with this email already exists.';
      else if (r.error.code === 'validation_failed') {
        const f = fieldsOf(r.error);
        if (f.has('phone')) er.phone = 'Use the international format, starting with + and the country code, for example +44 20 7946 0000.';
        if (f.has('email')) er.email = 'Enter an email address like name@example.com.';
        if (f.has('firstName')) er.firstName = 'Enter your first name.';
        if (f.has('lastName')) er.lastName = 'Enter your last name.';
        if (!Object.keys(er).length) er._form = failed(r.error);
      } else er._form = failed(r.error);
    }
    setDErr(er);
    const first = ['firstName', 'lastName', 'email', 'phone'].find((k) => er[k]);
    if (first) document.getElementById(`pf-${first}`)?.focus();
  };
  const savePw = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const er: Record<string, string> = {};
    if (!pw.cur) er.cur = 'Enter your current password.';
    if (pw.a.length < 8) er.a = 'Use at least 8 characters.';
    else if (pw.a.length > 72) er.a = 'Use 72 characters at most.';
    else if (pw.a !== pw.b) er.b = 'These passwords don’t match.';
    if (!Object.keys(er).length) {
      setBusy(true);
      const r = await api<{ changed: boolean }>('/api/account/password', { method: 'POST', body: { current: pw.cur, next: pw.a } });
      setBusy(false);
      if (!r.error) { setPwOpen(false); setPw({ cur: '', a: '', b: '' }); setPwErr({}); toast('Password changed'); return; }
      const c = r.error.code;
      if (c === 'mismatch') er.cur = 'Your current password isn’t right.';
      else if (c === 'same_password') er.a = 'Choose a password you haven’t used for this account before.';
      else if (c === 'weak_password') er.a = WEAK;
      else if (c === 'validation_failed') er.a = 'Use between 8 and 72 characters.';
      else er.cur = failed(r.error);
    }
    setPwErr(er);
    const first = ['cur', 'a', 'b'].find((k) => er[k]);
    if (first) document.getElementById(`pw-${first}`)?.focus();
  };
  const saveTrv = async (e: FormEvent) => {
    e.preventDefault();
    if (!trv || busy) return;
    const er: Record<string, string> = {};
    const today = new Date().toISOString().slice(0, 10);
    if (!trv.title) er.title = 'Choose a title.';
    if (!trv.given.trim()) er.given = 'Enter given names as they appear on the passport.';
    if (!trv.family.trim()) er.family = 'Enter a family name.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trv.bornOn) || trv.bornOn >= today || trv.bornOn < '1900-01-02') er.bornOn = 'Enter the date of birth as on the passport.';
    if (!trv.gender) er.gender = 'Choose the gender as on the passport.';
    if (!Object.keys(er).length) {
      setBusy(true);
      const body = { title: trv.title, given: trv.given.trim(), family: trv.family.trim(), bornOn: trv.bornOn, gender: trv.gender, type: typeFor(trv.bornOn) };
      const r = trv.id
        ? await api(`/api/account/travelers/${trv.id}`, { method: 'PATCH', body })
        : await api('/api/account/travelers', { method: 'POST', body });
      setBusy(false);
      if (!r.error) { const isNew = !trv.id; setTrv(null); await reload(); toast(isNew ? 'Traveler added' : 'Saved'); return; }
      if (r.error.code === 'too_many_travelers') er.given = 'You can save up to 20 travelers. Remove one to add another.';
      else if (r.error.code === 'validation_failed') er.given = 'Check the names and the date of birth.';
      else er.given = failed(r.error);
    }
    setTErr(er);
    const first = ['title', 'given', 'family', 'bornOn', 'gender'].find((k) => er[k]);
    if (first) document.getElementById(`tv-${first}`)?.focus();
  };
  const removeTrv = async () => {
    if (!removing) return;
    const r = await api(`/api/account/travelers/${removing.id}`, { method: 'DELETE' });
    setRemoving(null);
    if (r.error) { toast('We couldn’t remove that traveler. Try again.'); return; }
    await reload();
    toast('Traveler removed');
  };
  const deleteAcct = async () => {
    if (busy) return;
    if (!delPw) { setDelErr('Enter your password to confirm.'); document.getElementById('del-pw')?.focus(); return; }
    setBusy(true);
    const r = await api<{ deleted: boolean }>('/api/account', { method: 'DELETE', body: { password: delPw } });
    setBusy(false);
    if (r.error) { setDelErr(r.error.code === 'mismatch' ? 'That password isn’t right.' : failed(r.error)); document.getElementById('del-pw')?.focus(); return; }
    setDeleting(false);
    await refreshSession();
    toast('Your account is deleted');
    router.push('/');
  };
  const doSignOut = async () => { await signOut(); toast('You’ve signed out'); router.push('/'); };

  return (
    <div className="l-container bk-acct">
      <nav className="bk-acct__nav" aria-label="Account sections">
        <ul>{SECTIONS.map(([id, label]) => <li key={id}><a className="bk-acct__link" href={`#${id}`}>{label}</a></li>)}</ul>
      </nav>
    <div className="p-profile bk-acct__main">
      <h1 className="t-display t-h1">Your profile</h1>
      {/* below 1025 the section list scrolls sideways as chips (spec B10) */}
      <nav className="bk-acct__chips" aria-label="Account sections">
        <ul>{SECTIONS.map(([id, label]) => <li key={id}><a className="a-chip bk-acct__chip" href={`#${id}`}>{label}</a></li>)}</ul>
      </nav>

      <section className="m-card -pad p-card" id="personal" aria-labelledby="pf-h">
        <div className="p-card__head"><h2 id="pf-h" className="t-h3">Personal details</h2>{!edit && <Button variant="ghost" icon="edit" onClick={startEdit}>Edit</Button>}</div>
        {pending && <Notice tone="info">We sent a link to {pending} to confirm it. Your email changes once you open it.</Notice>}
        {!edit ? (
          <dl className="p-rows">
            <div><dt>Name</dt><dd>{user.firstName} {user.lastName}</dd></div>
            <div><dt>Email</dt><dd>{user.email}</dd></div>
            {user.phone && <div><dt>Phone</dt><dd className="t-num">{user.phone}</dd></div>}
          </dl>
        ) : (
          <form className="p-form" onSubmit={saveDetails} noValidate>
            {dErr._form && <Notice tone="error" focusOnMount role="alert">{dErr._form}</Notice>}
            <div className="m-field__row -two">
              <TextField id="pf-firstName" label="First name" autoComplete="given-name" value={d.firstName} onChange={(e) => setD({ ...d, firstName: e.target.value })} error={dErr.firstName} />
              <TextField id="pf-lastName" label="Last name" autoComplete="family-name" value={d.lastName} onChange={(e) => setD({ ...d, lastName: e.target.value })} error={dErr.lastName} />
            </div>
            <TextField id="pf-email" label="Email" type="email" autoComplete="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} error={dErr.email}
              hint={d.email.trim().toLowerCase() !== user.email.toLowerCase() ? 'We’ll send a link to the new address. The change takes effect once you open it.' : undefined} />
            <TextField id="pf-phone" label="Phone" type="tel" autoComplete="tel" optional hint="With the country code, for example +44 20 7946 0000." value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} error={dErr.phone} />
            <div className="p-form__actions"><Button type="submit" disabled={busy}>Save changes</Button><Button variant="ghost" onClick={() => setEdit(false)}>Cancel</Button></div>
          </form>
        )}
      </section>

      <section className="m-card -pad p-card" id="travelers" aria-labelledby="tv-h">
        <h2 id="tv-h" className="t-h3">Saved travelers</h2>
        <p className="t-muted">Save the people you travel with, so their details fill in for you when you book.</p>
        {travelerList === null ? <p className="p-empty" role="status">Loading saved travelers</p> : travelers.length ? (
          <ul className="p-list">
            {travelers.map((t) => (
              <li key={t.id}>
                <span><b>{t.given} {t.family}</b>, {t.type}</span>
                <span className="p-list__btns">
                  <Button variant="ghost" onClick={() => { setTErr({}); setTrv({ id: t.id, title: titleCase(t.title), given: t.given, family: t.family, bornOn: t.bornOn, gender: t.gender }); }} aria-label={`Edit ${t.given} ${t.family}`}>Edit</Button>
                  <Button variant="ghost" onClick={() => setRemoving(t)} aria-label={`Remove ${t.given} ${t.family}`}>Remove</Button>
                </span>
              </li>
            ))}
          </ul>
        ) : <p className="p-empty">No saved travelers yet.</p>}
        <Button variant="ghost" icon="plus" onClick={() => { setTErr({}); setTrv({ id: null, title: '', given: '', family: '', bornOn: '', gender: '' }); }}>Add a traveler</Button>
      </section>

      <section className="m-card -pad p-card" id="security" aria-labelledby="pw-h">
        <div className="p-card__head"><h2 id="pw-h" className="t-h3">Sign-in and security</h2>{!pwOpen && <Button variant="ghost" icon="lock" onClick={() => { setPwErr({}); setPwOpen(true); }}>Change password</Button>}</div>
        <dl className="p-rows">
          <div><dt>Sign-in email</dt><dd>{user.email}</dd></div>
        </dl>
        {pwOpen && (
          <form className="p-form" onSubmit={savePw} noValidate>
            <PasswordField id="pw-cur" label="Current password" autoComplete="current-password" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} error={pwErr.cur} />
            <PasswordField id="pw-a" label="New password" autoComplete="new-password" hint="At least 8 characters." value={pw.a} onChange={(e) => setPw({ ...pw, a: e.target.value })} error={pwErr.a} />
            <PasswordField id="pw-b" label="Confirm new password" autoComplete="new-password" value={pw.b} onChange={(e) => setPw({ ...pw, b: e.target.value })} error={pwErr.b} />
            <div className="p-form__actions"><Button type="submit" disabled={busy}>Save password</Button><Button variant="ghost" onClick={() => setPwOpen(false)}>Cancel</Button></div>
          </form>
        )}
      </section>

      <EmailPrefs />

      <section className="m-card -pad p-card" id="delete" aria-labelledby="del-h">
        <h2 id="del-h" className="t-h3">Delete account</h2>
        <p className="t-muted">Deleting your account removes your profile and saved travelers and signs you out. Bookings you’ve already made stay valid with the airline or hotel.</p>
        <div><Button variant="ghost" icon="trash" onClick={() => { setDelPw(''); setDelErr(undefined); setDeleting(true); }}>Delete account</Button></div>
      </section>

      <div className="p-signout"><Button variant="ghost" icon="signout" onClick={doSignOut}>Sign out</Button></div>

      <Dialog open={!!trv} onClose={() => setTrv(null)} title={trv?.id ? `${trv.given} ${trv.family}` : 'Add a traveler'} sheet>
        {trv && (
          <form className="p-form" onSubmit={saveTrv} noValidate id="tv-form">
            <SelectField id="tv-title" label="Title" value={trv.title} onChange={(e) => setTrv({ ...trv, title: e.target.value })} error={tErr.title}>
              <option value="">Choose a title</option>{TITLES.map((t) => <option key={t}>{t}</option>)}
            </SelectField>
            <TextField id="tv-given" label="Given names" hint="First and middle names, as on the passport." value={trv.given} onChange={(e) => setTrv({ ...trv, given: e.target.value })} error={tErr.given} />
            <TextField id="tv-family" label="Family name" value={trv.family} onChange={(e) => setTrv({ ...trv, family: e.target.value })} error={tErr.family} />
            <TextField id="tv-bornOn" label="Date of birth" type="date" max={new Date().toISOString().slice(0, 10)} value={trv.bornOn} onChange={(e) => setTrv({ ...trv, bornOn: e.target.value })} error={tErr.bornOn} />
            <SelectField id="tv-gender" label="Gender, as on the passport" value={trv.gender} onChange={(e) => setTrv({ ...trv, gender: e.target.value as TravelerEdit['gender'] })} error={tErr.gender}>
              <option value="">Choose</option><option value="f">Female</option><option value="m">Male</option>
            </SelectField>
            <Button type="submit" block disabled={busy}>Save changes</Button>
          </form>
        )}
      </Dialog>
      <Dialog open={!!removing} onClose={() => setRemoving(null)} title={removing ? `Remove ${removing.given} ${removing.family}?` : ''}
        footer={<><Button variant="ghost" onClick={() => setRemoving(null)}>Keep</Button><Button onClick={removeTrv}>Remove</Button></>}>
        <p>This won’t change any booking already made.</p>
      </Dialog>
      <Dialog open={deleting} onClose={() => setDeleting(false)} title="Delete your account?"
        footer={<><Button variant="ghost" onClick={() => setDeleting(false)}>Keep my account</Button><Button onClick={deleteAcct} disabled={busy}>Delete my account</Button></>}>
        <p>This can’t be undone. Your bookings stay valid, but you won’t see them here any more.</p>
        <PasswordField id="del-pw" label="Your password" autoComplete="current-password" value={delPw} onChange={(e) => setDelPw(e.target.value)} error={delErr} />
      </Dialog>
    </div>
    </div>
  );
}

const SECTIONS: [string, string][] = [['personal', 'Personal details'], ['travelers', 'Saved travelers'], ['security', 'Sign-in and security'], ['emails', 'Email preferences'], ['delete', 'Delete account']];

/* booking emails only; kept in this browser (no reminder emails are sent yet: see the backend report) */
const PREFS_KEY = 'lf.emailprefs';
const PREFS: [string, string, string][] = [
  ['reminders', 'Trip reminders', 'A reminder a few days before you travel, with your booking reference.'],
  ['checkin', 'Check-in reminders', 'When online check-in opens for your flight.']
];
function EmailPrefs() {
  const [on, setOn] = useState<Record<string, boolean>>({ reminders: true, checkin: true });
  useEffect(() => {
    try { const raw = window.localStorage.getItem(PREFS_KEY); if (raw) setOn((o) => ({ ...o, ...JSON.parse(raw) })); } catch { /* blocked: defaults stay */ }
  }, []);
  function flip(k: string) {
    const next = { ...on, [k]: !on[k] };
    setOn(next);
    try { window.localStorage.setItem(PREFS_KEY, JSON.stringify(next)); } catch { /* blocked: this visit only */ }
    toast('Saved');
  }
  return (
    <section className="m-card -pad p-card" id="emails" aria-labelledby="em-h">
      <h2 id="em-h" className="t-h3">Email preferences</h2>
      <p className="t-muted">Confirmations, receipts and changes to your bookings are always sent. You choose the rest.</p>
      <ul className="bk-prefs">
        {PREFS.map(([k, label, hint]) => (
          <li key={k}>
            <span className="bk-prefs__text"><span id={`em-${k}`} className="bk-prefs__label">{label}</span><span className="t-small t-muted">{hint}</span></span>
            <button type="button" role="switch" aria-checked={!!on[k]} aria-labelledby={`em-${k}`} className="bk-switch" onClick={() => flip(k)}><span className="bk-switch__knob" aria-hidden="true" /></button>
          </li>
        ))}
      </ul>
    </section>
  );
}

