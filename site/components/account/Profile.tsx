'use client';
/* =====================================================================
   Profile (spec 2b: a 640 column; Personal details, Saved travelers,
   Password and Delete account as cards, each with an Edit pill).
   Edits save to the browser's account (lib/store.ts) and say so with a
   toast. Logged out, it sends the visitor to log in and back.
   Copy: content/copy.md, Profile.
   ===================================================================== */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { Dialog } from '@/components/ui/Dialog';
import { SelectField, TextField } from '@/components/ui/Field';
import { changePassword, currentUser, deleteAccount, removeTraveler, saveHomeAirport, saveProfile, saveTraveler, savedTravelers, useStore, type SavedTraveler } from '@/lib/store';
import { clearHistory, useHistory, type SearchEntry } from '@/lib/history';
import { AIRPORTS } from '@/lib/data/places';
import { cityById } from '@/lib/mock/hotels';
import { AppLink as Link } from '@/components/AppLink';
import { Glyph } from '@/components/booking/Glyphs';
import { dayRange, plural } from '@/lib/format';
import { toast } from '@/lib/client';
import { MONTHS } from '@/lib/dates';
import { dateLine } from '@/lib/format';
import { ROUTES } from '@/lib/site';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TITLES = ['Mr', 'Ms', 'Mrs', 'Miss', 'Dr'];
/* focus moves to where the visitor is next (critic round 1: it fell back to the page after every action) */
const focusLater = (sel: string) => window.setTimeout(() => document.querySelector<HTMLElement>(sel)?.focus(), 60);
/* adult, child or infant from the date of birth (the booking form's own age bands) */
function typeFromDob(dob: string): SavedTraveler['type'] {
  const d = new Date(dob), t = new Date();
  let a = t.getFullYear() - d.getFullYear();
  if (t.getMonth() < d.getMonth() || (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())) a--;
  return a >= 12 ? 'adult' : a >= 2 ? 'child' : 'infant';
}

function TravelerForm({ t, onDone }: { t: SavedTraveler | null; onDone: () => void }) {
  const [v, setV] = useState(() => t ? { ...t, d: String(+t.dob.slice(8)), m: String(+t.dob.slice(5, 7)), y: t.dob.slice(0, 4) } : { id: '', title: '', given: '', family: '', dob: '', gender: '' as '' | 'f' | 'm', type: 'adult' as const, d: '', m: '', y: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const y0 = new Date().getFullYear();
  function save(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!v.given.trim()) errs['tr-given'] = 'Enter given names as they appear on the passport.';
    if (!v.family.trim()) errs['tr-family'] = 'Enter a family name.';
    const date = new Date(+v.y, +v.m - 1, +v.d);
    if (!v.d || !v.m || !v.y) errs['tr-dob'] = 'Enter a full date of birth.';
    else if (date.getDate() !== +v.d) errs['tr-dob'] = 'Enter a real date, for example 14 3 1988.';
    if (!v.gender) errs['tr-gender'] = 'Choose the gender shown on the passport.';
    setErrors(errs);
    if (Object.keys(errs).length) { document.getElementById(Object.keys(errs)[0])?.focus(); return; }
    const dob = `${v.y}-${v.m.padStart(2, '0')}-${v.d.padStart(2, '0')}`;
    saveTraveler({ id: t?.id || `trv_${Math.random().toString(36).slice(2, 9)}`, title: v.title || (v.gender === 'f' ? 'Ms' : 'Mr'), given: v.given.trim(), family: v.family.trim(), dob, gender: v.gender as 'f' | 'm', type: typeFromDob(dob) });
    toast(t ? 'Saved' : 'Traveler added');
    onDone();
  }
  return (
    <form className="m-card__form" noValidate onSubmit={save}>
      <SelectField id="tr-title" label="Title" className="-title" value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })}><option value="">Select</option>{TITLES.map((x) => <option key={x}>{x}</option>)}</SelectField>
      <TextField id="tr-given" label="Given names" help="First and middle names, as on the passport." value={v.given} error={errors['tr-given']} onChange={(e) => setV({ ...v, given: e.target.value })} />
      <TextField id="tr-family" label="Family name" value={v.family} error={errors['tr-family']} onChange={(e) => setV({ ...v, family: e.target.value })} />
      <fieldset className="m-dateField">
        <legend className="m-field__label">Date of birth</legend>
        <div className="m-dateField__row">
          <SelectField id="tr-dob" label="Day" value={v.d} onChange={(e) => setV({ ...v, d: e.target.value })}><option value="">Day</option>{Array.from({ length: 31 }, (_, i) => <option key={i} value={String(i + 1)}>{i + 1}</option>)}</SelectField>
          <SelectField id="tr-dob-m" label="Month" value={v.m} onChange={(e) => setV({ ...v, m: e.target.value })}><option value="">Month</option>{MONTHS.map((n, i) => <option key={n} value={String(i + 1)}>{n}</option>)}</SelectField>
          <SelectField id="tr-dob-y" label="Year" value={v.y} onChange={(e) => setV({ ...v, y: e.target.value })}><option value="">Year</option>{Array.from({ length: 111 }, (_, i) => <option key={i} value={String(y0 - i)}>{y0 - i}</option>)}</SelectField>
        </div>
        {errors['tr-dob'] && <p className="m-field__error" id="tr-dob-error"><Icon name="alert" size="s" />{errors['tr-dob']}</p>}
      </fieldset>
      <fieldset className="m-radios" aria-describedby={errors['tr-gender'] ? 'tr-gender-error' : undefined}>
        <legend className="m-field__label">Gender on passport</legend>
        <p className="m-field__help">As shown on the passport. Airlines currently accept these two options only.</p>
        <div className="m-radios__row">
          {[{ v: 'f', l: 'Female' }, { v: 'm', l: 'Male' }].map((g) => (
            <label className="a-choice" key={g.v}><input className="a-choice__input" type="radio" name="tr-gender" id={g.v === 'f' ? 'tr-gender' : undefined} checked={v.gender === g.v} onChange={() => setV({ ...v, gender: g.v as 'f' | 'm' })} />{g.l}</label>
          ))}
        </div>
        {errors['tr-gender'] && <p className="m-field__error" id="tr-gender-error"><Icon name="alert" size="s" />{errors['tr-gender']}</p>}
      </fieldset>
      <div className="m-card__actions">
        <button className="a-button" type="submit"><span className="a-button__label">Save changes</span></button>
        <button className="a-button -soft" type="button" onClick={onDone}><span className="a-button__label">Cancel</span></button>
      </div>
    </form>
  );
}

export function Profile() {
  const router = useRouter();
  const store = useStore();
  const user = currentUser(store);
  const travelers = savedTravelers(store);
  const [editing, setEditing] = useState<'details' | 'password' | null>(null);
  const [trEdit, setTrEdit] = useState<SavedTraveler | 'new' | null>(null);
  const [remove, setRemove] = useState<SavedTraveler | null>(null);
  const [del, setDel] = useState(false);
  const [d, setD] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [pw, setPw] = useState({ current: '', next: '', again: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const history = useHistory();
  const [home, setHome] = useState('');

  useEffect(() => { if (store && !user) router.replace(`${ROUTES.login}?next=${ROUTES.account}`); }, [store, user, router]);
  if (!store || !user) return <div className="o-account -loading" aria-busy="true" />;

  function startDetails() { setD({ firstName: user!.firstName, lastName: user!.lastName, email: user!.email, phone: user!.phone }); setErrors({}); setEditing('details'); focusLater('#pd-first'); }
  function stopDetails() { setEditing(null); focusLater('#pd-edit'); }
  function stopPassword() { setEditing(null); focusLater('#pw-edit'); }
  function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!d.firstName.trim()) errs['pd-first'] = 'Enter your first name.';
    if (!d.lastName.trim()) errs['pd-last'] = 'Enter your last name.';
    if (!EMAIL.test(d.email.trim())) errs['pd-email'] = 'Enter an email address like name@example.com.';
    if (d.phone.trim() && !/^\+\d[\d\s()-]{6,}$/.test(d.phone.trim())) errs['pd-phone'] = 'Enter a phone number with its country code.';
    setErrors(errs);
    if (Object.keys(errs).length) { document.getElementById(Object.keys(errs)[0])?.focus(); return; }
    saveProfile({ firstName: d.firstName.trim(), lastName: d.lastName.trim(), email: d.email.trim(), phone: d.phone.trim() });
    stopDetails(); toast('Saved');
  }
  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (pw.next.length < 8) errs['pw-new'] = 'Use at least 8 characters.';
    else if (pw.next !== pw.again) errs['pw-again'] = 'These passwords don’t match.';
    if (!Object.keys(errs).length && !changePassword(pw.current, pw.next)) errs['pw-current'] = 'Your current password isn’t right.';
    setErrors(errs);
    if (Object.keys(errs).length) { document.getElementById(Object.keys(errs)[0])?.focus(); return; }
    setPw({ current: '', next: '', again: '' }); stopPassword(); toast('Password changed');
  }

  return (
    <div className="o-account">
      <h1 className="a-h1 o-account__title">Your profile</h1>

      <section className="m-card" aria-labelledby="pd-title">
        <div className="m-card__head">
          <h2 className="m-card__title" id="pd-title">Personal details</h2>
          {editing !== 'details' && <button className="a-button -soft -small" id="pd-edit" type="button" onClick={startDetails} aria-label="Edit personal details"><Icon name="edit" size="s" /><span className="a-button__label">Edit</span></button>}
        </div>
        {editing === 'details' ? (
          <form className="m-card__form" noValidate onSubmit={saveDetails}>
            <TextField id="pd-first" label="First name" autoComplete="given-name" value={d.firstName} error={errors['pd-first']} onChange={(e) => setD({ ...d, firstName: e.target.value })} />
            <TextField id="pd-last" label="Last name" autoComplete="family-name" value={d.lastName} error={errors['pd-last']} onChange={(e) => setD({ ...d, lastName: e.target.value })} />
            <TextField id="pd-email" label="Email" type="email" autoComplete="email" value={d.email} error={errors['pd-email']} onChange={(e) => setD({ ...d, email: e.target.value })}
              help={d.email.trim() !== user.email ? 'We’ll send booking emails to the new address from now on.' : undefined} />
            <TextField id="pd-phone" label="Phone" type="tel" autoComplete="tel" value={d.phone} error={errors['pd-phone']} onChange={(e) => setD({ ...d, phone: e.target.value })} />
            <div className="m-card__actions">
              <button className="a-button" type="submit"><span className="a-button__label">Save changes</span></button>
              <button className="a-button -soft" type="button" onClick={stopDetails}><span className="a-button__label">Cancel</span></button>
            </div>
          </form>
        ) : (
          <dl className="m-card__rows">
            <div><dt>Name</dt><dd>{user.firstName} {user.lastName}</dd></div>
            <div><dt>Email</dt><dd>{user.email}</dd></div>
            {user.phone && <div><dt>Phone</dt><dd>{user.phone}</dd></div>}
          </dl>
        )}
      </section>

      <section className="m-card" aria-labelledby="ha-title">
        <div className="m-card__head"><h2 className="m-card__title" id="ha-title">Home airport</h2></div>
        <p className="m-card__intro">Flight searches start from here.</p>
        <form className="m-card__inline" onSubmit={(e) => { e.preventDefault(); const code = home || user.homeAirport || 'LHR'; saveHomeAirport(code); toast('Saved'); }}>
          <SelectField id="ha-airport" label="Airport" value={home || user.homeAirport || 'LHR'} onChange={(e) => setHome(e.target.value)}>
            {AIRPORTS.map((a) => <option key={a.code} value={a.code}>{a.name} ({a.code})</option>)}
          </SelectField>
          <button className="a-button -soft -small" type="submit"><span className="a-button__label">Save</span></button>
        </form>
      </section>

      <section className="m-card" aria-labelledby="st-title">
        <div className="m-card__head"><h2 className="m-card__title" id="st-title">Saved travelers</h2></div>
        <p className="m-card__intro">Save the people you travel with, so their details fill in for you when you book.</p>
        {trEdit ? <TravelerForm t={trEdit === 'new' ? null : trEdit} onDone={() => { setTrEdit(null); focusLater('#tr-add'); }} /> : (
          <>
            {travelers.length ? (
              <ul className="m-card__list">
                {travelers.map((t) => (
                  <li key={t.id} className="m-card__item">
                    <span><Icon name="user" size="s" />{t.given} {t.family}, {t.type}</span>
                    <span className="m-card__itemActions">
                      <button className="a-link" type="button" aria-label={`Edit ${t.given} ${t.family}`} onClick={() => { setTrEdit(t); focusLater('#tr-given'); }}>Edit</button>
                      <button className="a-link" type="button" aria-label={`Remove ${t.given} ${t.family}`} onClick={() => setRemove(t)}>Remove</button>
                    </span>
                  </li>
                ))}
              </ul>
            ) : <p className="m-card__empty">No saved travelers yet.</p>}
            <button className="a-button -soft -small m-card__add" id="tr-add" type="button" onClick={() => { setTrEdit('new'); focusLater('#tr-title'); }}><Icon name="plus" size="s" /><span className="a-button__label">Add a traveler</span></button>
          </>
        )}
      </section>

      <section className="m-card" aria-labelledby="rs-title">
        <div className="m-card__head">
          <h2 className="m-card__title" id="rs-title">Recent searches</h2>
          {!!history?.searches.length && <button className="a-link m-card__clear" type="button" onClick={() => { clearHistory(); toast('History cleared'); }}>Clear history</button>}
        </div>
        <p className="m-card__intro">Kept in this browser only, to fill in your searches and suggestions. We never send it anywhere.</p>
        {history?.searches.length ? (
          <ul className="m-card__list">
            {history.searches.map((h) => (
              <li key={`${h.mode}-${h.at}`} className="m-card__item">
                <Link className="m-card__search" href={searchHref(h)}>
                  <Glyph name="history" size="s" />
                  <span><strong>{searchTitle(h)}</strong><span className="m-card__sub">{searchLine(h)}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="m-card__empty">No recent searches.</p>}
      </section>

      <section className="m-card" aria-labelledby="pw-title">
        <div className="m-card__head">
          <h2 className="m-card__title" id="pw-title">Password</h2>
          {editing !== 'password' && <button className="a-button -soft -small" id="pw-edit" type="button" onClick={() => { setErrors({}); setEditing('password'); focusLater('#pw-current'); }}><span className="a-button__label">Change password</span></button>}
        </div>
        {editing === 'password' ? (
          <form className="m-card__form" noValidate onSubmit={savePassword}>
            <TextField id="pw-current" label="Current password" type="password" autoComplete="current-password" value={pw.current} error={errors['pw-current']} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
            <TextField id="pw-new" label="New password" help="At least 8 characters." type="password" autoComplete="new-password" value={pw.next} error={errors['pw-new']} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            <TextField id="pw-again" label="Confirm new password" type="password" autoComplete="new-password" value={pw.again} error={errors['pw-again']} onChange={(e) => setPw({ ...pw, again: e.target.value })} />
            <div className="m-card__actions">
              <button className="a-button" type="submit"><span className="a-button__label">Save password</span></button>
              <button className="a-button -soft" type="button" onClick={stopPassword}><span className="a-button__label">Cancel</span></button>
            </div>
          </form>
        ) : <p className="m-card__intro">Last changed {dateLine(user.passwordChangedAt)}</p>}
      </section>

      <section className="m-card" aria-labelledby="da-title">
        <div className="m-card__head"><h2 className="m-card__title" id="da-title">Delete account</h2></div>
        <p className="m-card__intro">Deleting your account removes your profile and saved travelers and logs you out. Bookings you’ve already made stay valid with the airline or hotel.</p>
        <button className="a-button -outline -small m-card__add" type="button" onClick={() => setDel(true)}><span className="a-button__label">Delete account</span></button>
      </section>

      <Dialog open={!!remove} onClose={() => setRemove(null)} id="rm" size="confirm" hideClose title={`Remove ${remove?.given} ${remove?.family}?`}
        foot={<>
          <button className="a-button" type="button" onClick={() => { if (remove) removeTraveler(remove.id); setRemove(null); toast('Traveler removed'); window.setTimeout(() => document.getElementById('tr-add')?.focus(), 120); }}><span className="a-button__label">Remove</span></button>
          <button className="a-button -soft" type="button" data-dialog-close onClick={() => setRemove(null)}><span className="a-button__label">Keep</span></button>
        </>}>
        <p>This won’t change any booking already made.</p>
      </Dialog>
      <Dialog open={del} onClose={() => setDel(false)} id="del" size="confirm" hideClose title="Delete your account?"
        foot={<>
          <button className="a-button -danger" type="button" onClick={() => { deleteAccount(); setDel(false); toast('You’ve logged out'); router.push(ROUTES.home); }}><span className="a-button__label">Delete my account</span></button>
          <button className="a-button -soft" type="button" data-dialog-close onClick={() => setDel(false)}><span className="a-button__label">Keep my account</span></button>
        </>}>
        <p>This can’t be undone. Your bookings stay valid, but you won’t see them here any more.</p>
      </Dialog>
    </div>
  );
}

const airportCity = (code?: string) => AIRPORTS.find((a) => a.code === code)?.city ?? code ?? '';
function searchTitle(h: SearchEntry): string {
  return h.mode === 'flights' ? `${airportCity(h.from)} to ${airportCity(h.to)}` : cityById(h.place ?? '')?.name ?? h.place ?? '';
}
function searchLine(h: SearchEntry): string {
  const people = plural(h.adults, 'adult', 'adults') + (h.children ? `, ${plural(h.children, 'child', 'children')}` : '');
  if (h.mode === 'flights') return [h.depart ? dayRange(h.depart, h.return ?? null) : '', people].filter(Boolean).join(', ');
  return [h.checkin && h.checkout ? dayRange(h.checkin, h.checkout) : '', people, h.rooms ? plural(h.rooms, 'room', 'rooms') : ''].filter(Boolean).join(', ');
}
function searchHref(h: SearchEntry): string {
  if (h.mode === 'flights') {
    const q = new URLSearchParams({ from: h.from ?? 'LHR', to: h.to ?? '' });
    if (h.depart) q.set('depart', h.depart);
    if (h.return) q.set('return', h.return);
    q.set('adults', String(h.adults)); q.set('children', String(h.children)); q.set('infants', String(h.infants ?? 0)); q.set('cabin', h.cabin ?? 'economy');
    return `/flights?${q}`;
  }
  const q = new URLSearchParams({ place: h.place ?? '' });
  if (h.checkin) q.set('checkin', h.checkin);
  if (h.checkout) q.set('checkout', h.checkout);
  q.set('adults', String(h.adults)); q.set('children', String(h.children)); q.set('rooms', String(h.rooms ?? 1));
  return `/hotels?${q}`;
}
