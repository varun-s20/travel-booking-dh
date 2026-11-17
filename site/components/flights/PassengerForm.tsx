'use client';
/* =====================================================================
   Passenger form (spec 2b: one 640 column beside the sticky summary):
   one fieldset per traveler, legend 24px Calibre Bold; fields 56px with
   labels above and inline errors; date of birth as three selects; the
   passport block only when the airline asks (long-haul offers in the
   mock data). Logged in, a saved traveler fills a fieldset and each one
   can be saved. Sent with errors, a summary takes focus with a link to
   each field. Round 3 (spec B3): the age band in each head, nationality
   with the passport details, a contact card with a country code, and
   the price per traveler type. Copy: content/copy.md, Passenger form.
   ===================================================================== */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { CheckField, ErrorSummary, FieldError, SelectField, TextField } from '@/components/ui/Field';
import { BottomBar, PhoneSummary, Summary } from '@/components/booking/Summary';
import { fareBreakdown, flightSummaryLines } from '@/components/flights/FlightDetails';
import { offerTotals, type FareId, type FlightSearch, type Offer } from '@/lib/mock/flights';
import { airport } from '@/lib/mock/geo';
import { AIRPORTS } from '@/lib/data/places';
import { MONTHS } from '@/lib/dates';
import { currentUser, getDraft, saveTraveler, savedTravelers, setDraft, useStore, type PassengerDraft } from '@/lib/store';
import { fromIso, money, plural } from '@/lib/format';
import { toast } from '@/lib/client';

type Kind = 'adult' | 'child' | 'infant';
const TITLES = ['Mr', 'Ms', 'Mrs', 'Miss', 'Dr'];
const COUNTRIES = [...new Set(AIRPORTS.map((a) => a.country))].sort();
/* round 3, spec B3: the age band in each traveler's head, nationality with the passport details, and a contact card */
const BANDS: Record<Kind, string> = { adult: '12 or older', child: '2 to 11', infant: 'Under 2' };
/* dialling codes for the countries in the demo's airport list, then the rest of the common ones */
const DIAL: [string, string][] = [
  ['United Kingdom', '+44'], ['United States', '+1'], ['Canada', '+1'], ['Portugal', '+351'], ['Spain', '+34'], ['France', '+33'], ['Italy', '+39'],
  ['Netherlands', '+31'], ['Germany', '+49'], ['Ireland', '+353'], ['Greece', '+30'], ['Denmark', '+45'], ['Iceland', '+354'], ['Mexico', '+52'],
  ['Brazil', '+55'], ['Argentina', '+54'], ['Japan', '+81'], ['Singapore', '+65'], ['Australia', '+61'], ['Thailand', '+66'], ['South Africa', '+27'],
  ['Morocco', '+212'], ['United Arab Emirates', '+971'], ['Kenya', '+254'], ['India', '+91']
];
type Person = PassengerDraft & { nationality?: string };
const blank = (): Person => ({ title: '', given: '', family: '', day: '', month: '', year: '', gender: '', passport: '', country: '', expDay: '', expMonth: '', expYear: '', save: false });

function slots(o: Offer): { kind: Kind; legend: string }[] {
  const p = o.passengers;
  return [
    ...Array.from({ length: p.adults }, (_, i) => ({ kind: 'adult' as Kind, legend: i === 0 ? 'Adult 1, lead traveler' : `Adult ${i + 1}` })),
    ...Array.from({ length: p.children }, (_, i) => ({ kind: 'child' as Kind, legend: `Child ${i + 1}` })),
    ...Array.from({ length: p.infants }, (_, i) => ({ kind: 'infant' as Kind, legend: `Infant ${i + 1}, on Adult ${i + 1}’s lap` }))
  ];
}

function age(dob: Date, on: Date): number {
  let a = on.getFullYear() - dob.getFullYear();
  if (on.getMonth() < dob.getMonth() || (on.getMonth() === dob.getMonth() && on.getDate() < dob.getDate())) a--;
  return a;
}
function realDate(d: string, m: string, y: string): Date | null {
  if (!d || !m || !y) return null;
  const date = new Date(+y, +m - 1, +d);
  return date.getDate() === +d && date.getMonth() === +m - 1 ? date : null;
}

type Errs = Record<string, string>;
function validate(list: PassengerDraft[], kinds: Kind[], lastDay: Date, firstDay: Date, passport: boolean): Errs {
  const e: Errs = {};
  list.forEach((p, i) => {
    const k = `p${i}`;
    if (!p.given.trim()) e[`${k}-given`] = 'Enter given names as they appear on the passport.';
    if (!p.family.trim()) e[`${k}-family`] = 'Enter a family name.';
    if (!p.day || !p.month || !p.year) e[`${k}-dob`] = 'Enter a full date of birth.';
    else {
      const dob = realDate(p.day, p.month, p.year);
      if (!dob) e[`${k}-dob`] = 'Enter a real date, for example 14 3 1988.';
      else {
        const a = age(dob, lastDay);
        if (kinds[i] === 'adult' && a < 12) e[`${k}-dob`] = 'Adults must be 12 or older on the day of the return flight.';
        if (kinds[i] === 'child' && (a < 2 || a > 11)) e[`${k}-dob`] = 'Children must be 2 to 11 on the day of the return flight.';
        if (kinds[i] === 'infant' && a >= 2) e[`${k}-dob`] = 'Infants must be under 2 on the day of the return flight.';
      }
    }
    if (!p.gender) e[`${k}-gender`] = 'Choose the gender shown on the passport.';
    if (passport) {
      if (!p.passport?.trim()) e[`${k}-passport`] = 'Enter the passport number.';
      const exp = realDate(p.expDay || '', p.expMonth || '', p.expYear || '');
      if (!exp || exp < firstDay) e[`${k}-exp`] = 'This passport expires before you travel. Check the date or use another passport.';
    }
  });
  return e;
}

function DateSelects({ id, legend, d, m, y, years, error, onChange }: { id: string; legend: string; d: string; m: string; y: string; years: number[]; error?: string; onChange: (part: 'd' | 'm' | 'y', v: string) => void }) {
  return (
    <fieldset className="m-dateField" aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="m-field__label">{legend}</legend>
      <div className="m-dateField__row">
        <SelectField id={`${id}`} label="Day" value={d} onChange={(e) => onChange('d', e.target.value)} aria-invalid={error ? true : undefined}>
          <option value="">Day</option>{Array.from({ length: 31 }, (_, i) => <option key={i} value={String(i + 1)}>{i + 1}</option>)}
        </SelectField>
        <SelectField id={`${id}-m`} label="Month" value={m} onChange={(e) => onChange('m', e.target.value)} aria-invalid={error ? true : undefined}>
          <option value="">Month</option>{MONTHS.map((n, i) => <option key={n} value={String(i + 1)}>{n}</option>)}
        </SelectField>
        <SelectField id={`${id}-y`} label="Year" value={y} onChange={(e) => onChange('y', e.target.value)} aria-invalid={error ? true : undefined}>
          <option value="">Year</option>{years.map((n) => <option key={n} value={String(n)}>{n}</option>)}
        </SelectField>
      </div>
      <FieldError id={id} error={error} />
    </fieldset>
  );
}

export function PassengerForm({ offer, search, fare }: { offer: Offer; search: FlightSearch; fare: FareId }) {
  const router = useRouter();
  const store = useStore();
  const user = currentUser(store);
  const saved = savedTravelers(store);
  const list = useMemo(() => slots(offer), [offer]);
  const [people, setPeople] = useState<Person[]>(() => list.map(blank));
  const [email, setEmail] = useState('');
  const [dial, setDial] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Errs>({});
  const [sent, setSent] = useState(false);
  const firstDay = fromIso(search.depart)!, lastDay = fromIso(search.ret || search.depart)!;
  const [adjust, setAdjust] = useState(0);

  /* returning from checkout keeps what was typed */
  useEffect(() => {
    const d = getDraft(offer.id);
    setAdjust(d.adjust || 0);
    if (d.passengers?.length === list.length) setPeople(d.passengers);
    if (d.email) setEmail(d.email);
    if (d.phone) { const m = /^(\+\d{1,3})\s*(.*)$/.exec(d.phone); if (m) { setDial(m[1]); setPhone(m[2]); } else setPhone(d.phone); }
  }, [offer.id, list.length]);
  /* logged in: the account's email and phone fill the contact card */
  useEffect(() => {
    if (!user) return;
    setEmail((e) => e || user.email);
    const m = /^(\+\d{1,3})\s*(.*)$/.exec(user.phone || '');
    if (m) { setDial((x) => x || m[1]); setPhone((x) => x || m[2]); }
  }, [user]);

  const t = offerTotals(offer, fare, adjust);
  const y0 = new Date().getFullYear();
  /* polish round, 11 Nov (critic): each list starts at the youngest year its age band can hold on the travel date, so an
     adult (12 or over) is no longer offered this year; children (2 to 11) and infants (under 2) keep a year either side */
  const dobYears = (kind: Kind) => {
    const [young, old] = kind === 'adult' ? [12, 110] : kind === 'child' ? [1, 12] : [0, 2];
    return Array.from({ length: old - young + 1 }, (_, n) => y0 - young - n);
  };
  const expYears = Array.from({ length: 16 }, (_, i) => y0 + i);
  const homeCountry = airport(search.from)?.country || '';

  const homeDial = DIAL.find(([c]) => c === homeCountry)?.[1] ?? '+44';
  const contactErrors = (): Errs => {
    const e: Errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e['c-email'] = 'Enter an email address like name@example.com.';
    if (phone.replace(/\D/g, '').length < 6) e['c-phone'] = 'Enter a phone number with its country code.';
    return e;
  };
  function set(i: number, patch: Partial<Person>) {
    setPeople((ps) => {
      const next = ps.map((p, j) => (j === i ? { ...p, ...patch } : p));
      if (sent) setErrors({ ...validate(next, list.map((s) => s.kind), lastDay, firstDay, offer.passport), ...contactErrors() });
      return next;
    });
  }

  function fill(i: number, id: string) {
    const s = saved.find((x) => x.id === id);
    if (!s) return;
    const [yy, mm, dd] = s.dob.split('-');
    set(i, { title: s.title, given: s.given, family: s.family, day: String(+dd), month: String(+mm), year: yy, gender: s.gender });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    const errs = { ...validate(people, list.map((s) => s.kind), lastDay, firstDay, offer.passport), ...contactErrors() };
    setErrors(errs);
    if (Object.keys(errs).length) { window.setTimeout(() => document.getElementById('passenger-errors')?.focus(), 0); return; }
    /* a title left empty follows the gender on the passport */
    setDraft(offer.id, { passengers: people.map((p) => (p.title ? p : { ...p, title: p.gender === 'f' ? 'Ms' : 'Mr' })), email: email.trim(), phone: `${dial || homeDial} ${phone.trim()}` });
    people.forEach((p, i) => {
      if (!user || !p.save) return;
      saveTraveler({ id: `trv_${Math.random().toString(36).slice(2, 9)}`, title: p.title, given: p.given.trim(), family: p.family.trim(), dob: `${p.year}-${p.month.padStart(2, '0')}-${p.day.padStart(2, '0')}`, gender: p.gender as 'f' | 'm', type: list[i].kind });
      toast('Traveler added');
    });
    router.push(`/checkout?offer=${offer.id}&fare=${fare}`);
  }

  /* each message says whose detail it is (critic round 1: the same four lines twice) */
  const items = Object.entries(errors).map(([field, message]) => ({ field, message: field.startsWith('c-') ? `Contact details: ${message}` : list.length > 1 ? `${list[+field.slice(1, field.indexOf('-'))]?.legend}: ${message}` : message }));
  const rows = fareBreakdown(offer, fare, adjust);
  const n = items.length;

  return (
    <div className="o-detail">
      <form className="o-detail__main o-form" id="passenger-form" noValidate onSubmit={submit}>
        <PhoneSummary total={money(t.total)}>
        <Summary title="Your trip" lines={flightSummaryLines(offer, search, fare)}
          rows={rows}
          total={money(t.total)} expiresAt={offer.expiresAt} />
        </PhoneSummary>
        <ErrorSummary id="passenger-errors" title={`Check ${plural(n, 'detail', 'details')} before you continue`} items={items} />
        {list.map((slot, i) => {
          const p = people[i], k = `p${i}`;
          return (
            <fieldset className="m-person" key={k}>
              <legend className="m-person__legend">{slot.legend}<span className="m-person__band">{BANDS[slot.kind]}</span></legend>
              {user && saved.length > 0 && (
                <SelectField id={`${k}-saved`} label="Fill in from a saved traveler" value="" onChange={(e) => fill(i, e.target.value)}>
                  <option value="">Choose a traveler</option>
                  {saved.map((s) => <option key={s.id} value={s.id}>{s.given} {s.family}</option>)}
                </SelectField>
              )}
              <div className="m-person__grid">
                <SelectField id={`${k}-title`} label="Title" className="-title" value={p.title} onChange={(e) => set(i, { title: e.target.value })}>
                  <option value="">Select</option>{TITLES.map((x) => <option key={x}>{x}</option>)}
                </SelectField>
                <TextField id={`${k}-given`} label="Given names" help="First and middle names, as on the passport." autoComplete={i === 0 ? 'given-name' : 'off'}
                  value={p.given} error={errors[`${k}-given`]} onChange={(e) => set(i, { given: e.target.value })} />
                <TextField id={`${k}-family`} label="Family name" autoComplete={i === 0 ? 'family-name' : 'off'}
                  value={p.family} error={errors[`${k}-family`]} onChange={(e) => set(i, { family: e.target.value })} />
              </div>
              <DateSelects id={`${k}-dob`} legend="Date of birth" d={p.day} m={p.month} y={p.year} years={dobYears(slot.kind)} error={errors[`${k}-dob`]}
                onChange={(part, v) => set(i, part === 'd' ? { day: v } : part === 'm' ? { month: v } : { year: v })} />
              <fieldset className="m-radios" aria-describedby={`${k}-gender-help${errors[`${k}-gender`] ? ` ${k}-gender-error` : ''}`}>
                <legend className="m-field__label">Gender on passport</legend>
                <p className="m-field__help" id={`${k}-gender-help`}>As shown on the passport. Airlines currently accept these two options only.</p>
                <div className="m-radios__row">
                  {[{ v: 'f', l: 'Female' }, { v: 'm', l: 'Male' }].map((g, gi) => (
                    <label className="a-choice" key={g.v}>
                      <input className="a-choice__input" type="radio" name={`${k}-gender`} id={gi === 0 ? `${k}-gender` : undefined} value={g.v} checked={p.gender === g.v}
                        aria-invalid={errors[`${k}-gender`] ? true : undefined} onChange={() => set(i, { gender: g.v as 'f' | 'm', ...(p.title ? {} : { title: g.v === 'f' ? 'Ms' : 'Mr' }) })} />
                      {g.l}
                    </label>
                  ))}
                </div>
                <FieldError id={`${k}-gender`} error={errors[`${k}-gender`]} />
              </fieldset>
              {offer.passport && (
                <div className="m-person__passport">
                  <p className="m-person__note"><Icon name="info" size="s" />This airline asks for passport details when you book.</p>
                  <TextField id={`${k}-passport`} label="Passport number" autoComplete="off" value={p.passport} error={errors[`${k}-passport`]} onChange={(e) => set(i, { passport: e.target.value })} />
                  <div className="m-person__pair">
                    <SelectField id={`${k}-nationality`} label="Nationality" value={p.nationality || p.country || homeCountry} onChange={(e) => set(i, { nationality: e.target.value })}>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </SelectField>
                    <SelectField id={`${k}-country`} label="Issuing country" value={p.country || homeCountry} onChange={(e) => set(i, { country: e.target.value })}>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </SelectField>
                  </div>
                  <DateSelects id={`${k}-exp`} legend="Expiry date" d={p.expDay || ''} m={p.expMonth || ''} y={p.expYear || ''} years={expYears} error={errors[`${k}-exp`]}
                    onChange={(part, v) => set(i, part === 'd' ? { expDay: v } : part === 'm' ? { expMonth: v } : { expYear: v })} />
                </div>
              )}
              {user && <CheckField id={`${k}-save`} label="Save this traveler to my account" checked={!!p.save} onChange={(e) => set(i, { save: e.target.checked })} />}
            </fieldset>
          );
        })}
        <fieldset className="m-person -contact">
          <legend className="m-person__legend">Contact details</legend>
          <div className="m-person__grid -contact">
            <TextField id="c-email" label="Email" type="email" autoComplete="email" value={email} error={errors['c-email']}
              onChange={(e) => { setEmail(e.target.value); if (sent) setErrors((x) => { const n = { ...x }; delete n['c-email']; return n; }); }} />
            <div className="m-phone">
              <SelectField id="c-dial" label="Country code" value={dial || homeDial} onChange={(e) => setDial(e.target.value)}>
                {DIAL.map(([c, d]) => <option key={c} value={d}>{`${c} ${d}`}</option>)}
              </SelectField>
              <TextField id="c-phone" label="Phone" type="tel" autoComplete="tel-national" value={phone} error={errors['c-phone']}
                onChange={(e) => { setPhone(e.target.value); if (sent) setErrors((x) => { const n = { ...x }; delete n['c-phone']; return n; }); }} />
            </div>
          </div>
        </fieldset>
        <div className="o-form__actions">
          <button className="a-button" type="submit"><span className="a-button__label">Continue to payment</span><Icon name="arrow" className="a-button__icon" /></button>
        </div>
      </form>
      <aside className="o-detail__side">
        <Summary title="Your trip" lines={flightSummaryLines(offer, search, fare)}
          rows={rows}
          total={money(t.total)} expiresAt={offer.expiresAt} />
      </aside>
      <BottomBar watch="#passenger-form .o-form__actions" price={money(t.total)} label="total"
        action={<button className="a-button -steady" type="submit" form="passenger-form"><span className="a-button__label">Continue to payment</span></button>} />
    </div>
  );
}
