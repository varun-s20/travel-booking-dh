/* =====================================================================
   Landfall (working name, a placeholder), group F: the travelers form
   Spec 2b, Passenger form: one 680 column plus the sticky summary. One
   card per traveler (radius 16, hairline) with real labels above 56px
   fields: Title, Given names, Family name, Date of birth, Gender on
   passport; email and phone on the lead traveler (moved here from
   checkout, copy.md note 4); the passport block when the airline asks for
   it. Saved travelers as chips above the first card when signed in.
   Inline errors under each field, and an error summary at the top that
   takes focus on submit. Below 1025 the sticky price bar continues.
   The form is kept as a draft (lib/store.ts, this tab only) for checkout
   and for Edit.
   Backend (2026-11-15): the checks mirror what the server and Duffel
   accept (server/bookings/schemas.ts): names in Latin letters, 40
   characters for given and family together; a phone in international
   form (required: airlines need one for every booking); adults 12 or
   older and children 2 to 11 on the day out, infants under 2 on the last
   day of the trip; passports (when the airline asks) issued by a country
   chosen from the ISO list and valid after the trip. Saved travelers come
   from /api/account/travelers; "Save this traveler" posts there.
   Copy: landfall/content/copy.md, Passenger form (as content/copy.md).
   ===================================================================== */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fareFor, offerTotals, registerDict, travelers, type FareId, type FlightSearch, type Offer } from '@/lib/travel/flights';
import { COUNTRIES, isCountryCode } from '@/lib/data/countries';
import { dayRange, fromIso, money } from '@/lib/format';
import { paxLine, routeTitle, travelersWord } from '@/lib/text';
import { MQ_DESKTOP, toast, useMedia } from '@/lib/client';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';
import { getDraft, setDraft, useStore, type PassengerDraft } from '@/lib/store';
import Icon from '@/components/ui/Icon';
import PriceBar from '@/components/ui/PriceBar';
import { Button } from '@/components/ui/Button';
import { Checkbox, ErrorSummary, SelectField, TextField } from '@/components/ui/Field';
import { Breakdown, ExpiredDialog, ExpiryLine, TripSummary, flightBreakdown } from './parts';
import Steps from '@/components/booking/Steps';
import { checkoutUrl, detailsUrl, flightDraftKey, moveDraft, passengersUrl, perTraveler, resultsUrl, useInView } from './trip';

type Kind = 'adult' | 'child' | 'infant';
type Slot = { kind: Kind; title: string };
/* a traveler saved to the account (GET /api/account/travelers) */
type SavedTraveler = { id: string; title: string; given: string; family: string; bornOn: string; gender: 'f' | 'm'; type: Kind };
const TITLES = ['Mr', 'Ms', 'Mrs', 'Miss', 'Dr'];
/* the server stores titles in lower case ("mr"); the select shows them as written above */
const titleCase = (t: string) => TITLES.find((x) => x.toLowerCase() === t.toLowerCase()) ?? '';

/* what airlines accept in a name (Duffel): Latin letters with accents, spaces, hyphens and apostrophes */
const NAME_OK = /^[A-Za-zÀ-ÖØ-öø-ſ]+(?:[ '’-][A-Za-zÀ-ÖØ-öø-ſ]+)*$/;
/* "+1 (415) 555-0100" -> "+14155550100"; a leading 00 counts as + */
const normPhone = (s: string) => s.trim().replace(/[\s().\-]/g, '').replace(/^00/, '+');
const PHONE_OK = /^\+[1-9]\d{6,14}$/;

const empty = (type: Kind): PassengerDraft => ({ title: '', given: '', family: '', day: '', month: '', year: '', gender: '', type, passport: '', country: '', expDay: '', expMonth: '', expYear: '', save: false });

function slotsFor(s: FlightSearch): Slot[] {
  const out: Slot[] = [];
  for (let i = 1; i <= s.adults; i++) out.push({ kind: 'adult', title: i === 1 ? 'Adult 1, lead traveler' : `Adult ${i}` });
  for (let i = 1; i <= s.children; i++) out.push({ kind: 'child', title: `Child ${i}` });
  for (let i = 1; i <= s.infants; i++) out.push({ kind: 'infant', title: `Infant ${i}, on Adult ${i}'s lap`.replace("'", '’') });
  return out;
}

function realDate(d: string, m: string, y: string): Date | null {
  if (!/^\d{1,2}$/.test(d) || !/^\d{1,2}$/.test(m) || !/^\d{4}$/.test(y)) return null;
  const iso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  return fromIso(iso);
}
function ageOn(dob: Date, on: Date): number {
  let a = on.getFullYear() - dob.getFullYear();
  if (on.getMonth() < dob.getMonth() || (on.getMonth() === dob.getMonth() && on.getDate() < dob.getDate())) a--;
  return a;
}

type Errs = Record<string, string>;

export default function Passengers({ offer: initial, search, fare }: { offer: Offer; search: FlightSearch; fare: FareId }) {
  registerDict(initial.dict);
  const router = useRouter();
  const store = useStore();
  const desktop = useMedia(MQ_DESKTOP, true);
  const { user } = useSession();
  const [saved, setSaved] = useState<SavedTraveler[]>([]);
  const slots = slotsFor(search);
  const key = flightDraftKey(initial.id);
  const [offer] = useState(initial);
  const [pax, setPax] = useState<PassengerDraft[]>(() => slots.map((s) => empty(s.kind)));
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  /* a changed price accepted on the fares page (Details.tsx keeps it in the draft) */
  const [accepted, setAccepted] = useState<number | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [errs, setErrs] = useState<Errs>({});
  const [version, setVersion] = useState(0);
  const [bd, setBd] = useState(false);
  /* other travelers' contact details: the lead's by default (kept on this page only) */
  const [own, setOwn] = useState<Record<number, { on: boolean; email: string; phone: string }>>({});
  const [expired, setExpired] = useState(false);
  const inited = useRef(false);
  const onExpire = useCallback(() => setExpired(true), []);
  const asideRef = useRef<HTMLElement>(null);
  const summaryInView = useInView(asideRef);

  /* fill from the draft (back from checkout, Edit) once the store has loaded */
  useEffect(() => {
    if (!store || inited.current) return;
    inited.current = true;
    const d = getDraft(key);
    if (d.passengers?.length === slots.length) setPax(d.passengers.map((p, i) => ({ ...empty(slots[i].kind), ...p, type: slots[i].kind })));
    if (d.email) setEmail(d.email);
    if (d.phone) setPhone(d.phone);
    setAccepted(d.acceptedTotal);
  }, [store, key, slots]);

  /* signed in: the lead's contact details (when still empty) and the saved travelers */
  useEffect(() => {
    if (!user) { setSaved([]); return; }
    setEmail((e) => e || user.email);
    setPhone((p) => p || user.phone);
    let live = true;
    api<{ travelers: SavedTraveler[] }>('/api/account/travelers').then((r) => { if (live && r.data) setSaved(r.data.travelers); });
    return () => { live = false; };
  }, [user]);

  const listed = offerTotals(offer, fare);
  const amounts = accepted !== undefined ? offerTotals(offer, fare, accepted - listed.total) : listed;
  const fareInfo = fareFor(offer, fare);
  const fareName = fareInfo.name;
  /* catalogue cells read "For a fee: Checked bag": shown mid-sentence as "checked bag for a fee" */
  const bagText = (cell: string, i: number) => {
    const m = /^For a fee:\s*(.*)$/.exec(cell);
    const t = m ? `${m[1]} for a fee` : cell;
    return i === 0 ? t : t.charAt(0).toLowerCase() + t.slice(1);
  };
  const bags = (fareInfo.rows
    ? [fareInfo.rows.personal, fareInfo.rows.cabin, fareInfo.rows.checked]
    : fareInfo.included.filter((x) => /bag/i.test(x))).filter(Boolean).map(bagText).filter(Boolean);
  /* Duffel offers carry no "personal item" row (empty), so empty entries are dropped: no stray comma */
  /* the same rules as the server: adults and children by their age on the day out, infants on the last day */
  const ageRule = (k: Kind) => {
    const out = search.ret ? 'on the day you fly out' : 'on the day you fly';
    const last = search.ret ? 'on the return date' : 'on the day you fly';
    return k === 'adult' ? `Adult: 12 or older ${out}` : k === 'child' ? `Child: 2 to 11 ${out}` : `Infant: under 2 ${last}`;
  };
  const n = travelers(search);
  const per = `${money(perTraveler(amounts.total, search))} per traveler`;
  const tripEnd = fromIso(search.ret || search.depart)!;
  const tripStart = fromIso(search.depart)!;

  const set = (i: number, patch: Partial<PassengerDraft>) => setPax((list) => list.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  function fillSaved(t: SavedTraveler) {
    const i = pax.findIndex((p, j) => slots[j].kind === t.type && !p.given.trim() && !p.family.trim());
    const at = i > -1 ? i : pax.findIndex((_, j) => slots[j].kind === t.type);
    if (at < 0) return;
    const [y, m, d] = t.bornOn.split('-');
    set(at, { title: titleCase(t.title), given: t.given, family: t.family, day: String(+d), month: String(+m), year: y, gender: t.gender });
    toast(`${t.given} ${t.family}’s details added`);
  }

  function validate(): { list: { id: string; message: string; who: string }[]; map: Errs } {
    const list: { id: string; message: string; who: string }[] = [];
    let who = '';
    const add = (id: string, message: string) => list.push({ id, message, who });
    pax.forEach((p, i) => {
      who = slots[i].title.split(',')[0];
      const k = slots[i].kind;
      const id = (f: string) => `p${i}-${f}`;
      const given = p.given.trim(), family = p.family.trim();
      if (!p.title) add(id('title'), 'Choose a title.');
      if (!given) add(id('given'), 'Enter given names as they appear on the passport.');
      else if (!NAME_OK.test(given)) add(id('given'), 'Use letters as printed on the passport. Spaces, hyphens and apostrophes are fine.');
      if (!family) add(id('family'), 'Enter a family name.');
      else if (!NAME_OK.test(family)) add(id('family'), 'Use letters as printed on the passport. Spaces, hyphens and apostrophes are fine.');
      else if (given && given.length + family.length > 40) add(id('family'), 'Given names and family name can be 40 characters together at most. Leave out middle names if you need to.');
      if (!p.day || !p.month || !p.year) add(id('day'), 'Enter a full date of birth.');
      else {
        const dob = realDate(p.day, p.month, p.year);
        if (!dob || dob >= new Date()) add(id('day'), 'Enter a real date, for example 14 3 1988.');
        else {
          const age = ageOn(dob, tripStart);
          const out = search.ret ? 'on the day you fly out' : 'on the day you fly';
          if (k === 'adult' && age < 12) add(id('day'), `Adults must be 12 or older ${out}.`);
          if (k === 'child' && (age < 2 || age > 11)) add(id('day'), `Children must be 2 to 11 ${out}.`);
          if (k === 'infant' && ageOn(dob, tripEnd) >= 2) add(id('day'), `Infants must be under 2 ${search.ret ? 'on the day of the return flight' : 'on the day you fly'}.`);
          if (age > 120) add(id('day'), 'Enter a real date, for example 14 3 1988.');
        }
      }
      if (!p.gender) add(id('gender-f'), 'Choose the gender shown on the passport.');
      if (i === 0) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) add('p0-email', 'Enter an email address like name@example.com.');
        if (!PHONE_OK.test(normPhone(phone))) add('p0-phone', 'Enter a phone number with its country code, starting with +.');
      }
      if (offer.passport) {
        const num = (p.passport || '').replace(/\s/g, '');
        if (!num) add(id('passport'), 'Enter the passport number.');
        else if (!/^[A-Za-z0-9]{5,20}$/.test(num)) add(id('passport'), 'Enter the passport number with letters and digits only.');
        if (!p.country) add(id('country'), 'Choose the country that issued the passport.');
        else if (!isCountryCode(p.country)) add(id('country'), 'Choose the country that issued the passport from the list.');
        if (!p.expDay || !p.expMonth || !p.expYear) add(id('expDay'), 'Enter the passport’s expiry date.');
        else {
          const exp = realDate(p.expDay, p.expMonth, p.expYear);
          if (!exp) add(id('expDay'), 'Enter a real date, for example 14 3 1988.');
          else if (exp <= tripEnd) add(id('expDay'), 'This passport expires before your trip ends. Check the date or use another passport.');
        }
      }
    });
    return { list, map: Object.fromEntries(list.map((e) => [e.id, e.message])) };
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrs(v.map);
    if (v.list.length) { setVersion((x) => x + 1); return; }
    if (Date.now() > offer.expiresAt) { setExpired(true); return; }
    const clean = pax.map((p, i) => ({ ...p, type: slots[i].kind, given: p.given.trim(), family: p.family.trim(), passport: (p.passport || '').replace(/\s/g, '').toUpperCase() }));
    setDraft(key, { passengers: clean, email: email.trim(), phone: normPhone(phone), acceptedTotal: accepted });
    /* "Save this traveler": in the background; a failure is said, never blocks the booking */
    if (user) clean.forEach((p) => {
      if (!p.save) return;
      const bornOn = `${p.year}-${p.month.padStart(2, '0')}-${p.day.padStart(2, '0')}`;
      void api('/api/account/travelers', { method: 'POST', body: { title: p.title, given: p.given, family: p.family, bornOn, gender: p.gender, type: p.type } })
        .then((r) => { if (r.error) toast(`We couldn’t save ${p.given} ${p.family} to your account`); });
    });
    router.push(checkoutUrl(offer.id, fare));
  }

  /* the same flights from a new search (a new id), keeping what has been typed */
  async function onRefresh() {
    setRefreshing(true);
    const r = await api<{ offer: Offer }>(`/api/flights/offers/${encodeURIComponent(offer.id)}/refresh`, { method: 'POST' });
    if (!r.data) {
      setRefreshing(false);
      if (r.error.code === 'no_longer_available' || r.error.code === 'offer_expired') {
        toast('This flight is no longer available');
        router.replace(resultsUrl(search));
      }
      return;
    }
    setDraft(key, { passengers: pax, email, phone, acceptedTotal: undefined });
    moveDraft(key, flightDraftKey(r.data.offer.id));
    const nextFare = r.data.offer.fares.some((f) => f.id === fare) ? fare : r.data.offer.fares[r.data.offer.fares.length - 1].id;
    window.location.replace(passengersUrl(r.data.offer.id, nextFare));
  }

  const v = validate();
  /* the summary names the traveler each line belongs to (critic round 1: twelve lines, no names) */
  const summary = Object.keys(errs).length ? v.list.filter((x) => errs[x.id]).map((x) => ({ id: x.id, message: `${x.who}: ${x.message}` })) : [];
  const err = (id: string) => (errs[id] ? v.map[id] : undefined);

  return (
    <div className="l-container f-pax">
      <p className="f-back"><a className="a-link" href={detailsUrl(offer.id, fare)}><Icon name="arrow-l" size="sm" />Back to fares</a></p>
      <Steps current={1} steps={[{ label: 'Choose your fare', href: detailsUrl(offer.id, fare) }, { label: 'Travelers' }, { label: 'Pay' }]} />
      <div className="l-split">
        <div className="f-pax__main">
          <header className="f-pax__head">
            <h1 className="t-display t-h1">Who’s flying?</h1>
            <p className="t-body t-muted">Enter each name exactly as it appears on the passport or ID that person will travel with. The airline checks them at the airport.</p>
            {bags.length > 0 && <p className="bk-bags t-small"><Icon name="bag" size="sm" /><span><b>Bags with {fareName}:</b> {bags.join(', ')}</span></p>}
          </header>
          <form id="f-pax-form" className="f-pax__form" noValidate onSubmit={onSubmit}>
            <ErrorSummary title={`Check ${summary.length} ${summary.length === 1 ? 'detail' : 'details'} before you continue`} errors={summary} version={version} />
            {user && saved.length > 0 && (
              <div className="f-saved">
                <p className="t-small t-muted" id="f-saved-label">Saved travelers</p>
                <div className="f-saved__chips" role="group" aria-labelledby="f-saved-label">
                  {saved.map((t) => <button type="button" className="a-chip" key={t.id} onClick={() => fillSaved(t)} aria-label={`Fill in ${t.given} ${t.family}’s details`}><Icon name="user" />{t.given} {t.family}</button>)}
                </div>
              </div>
            )}
            {pax.map((p, i) => {
              const id = (f: string) => `p${i}-${f}`;
              const dobErr = err(id('day'));
              const expErr = err(id('expDay'));
              return (
                <fieldset className="m-card f-trav" key={i}>
                  <legend className="f-trav__title t-title">{slots[i].title}</legend>
                  <div className="m-field__row -two">
                    <SelectField label="Title" id={id('title')} value={p.title} onChange={(e) => set(i, { title: e.target.value })} error={err(id('title'))} autoComplete={i === 0 ? 'honorific-prefix' : 'off'}>
                      <option value="" />
                      {TITLES.map((t) => <option key={t}>{t}</option>)}
                    </SelectField>
                  </div>
                  <p className="bk-hint t-small t-muted"><Icon name="doc" size="sm" />Name as it appears on the passport</p>
                  <div className="f-names">
                    <TextField label="Given names" hint="First and middle names, as on the passport." id={id('given')} value={p.given} onChange={(e) => set(i, { given: e.target.value })} error={err(id('given'))} autoComplete={i === 0 ? 'given-name' : 'off'} />
                    <TextField label="Family name" id={id('family')} value={p.family} onChange={(e) => set(i, { family: e.target.value })} error={err(id('family'))} autoComplete={i === 0 ? 'family-name' : 'off'} className="f-trav__family" />
                  </div>
                  <fieldset className="f-date" aria-describedby={`${id('dob')}-hint${dobErr ? ` ${id('day')}-err` : ''}`}>
                    <legend className="m-field__label">Date of birth</legend>
                    <p className="m-field__hint" id={`${id('dob')}-hint`}>{ageRule(slots[i].kind)}</p>
                    <div className="f-date__row">
                      <TextField label="Day" id={id('day')} inputMode="numeric" maxLength={2} value={p.day} onChange={(e) => set(i, { day: e.target.value.replace(/\D/g, '') })} aria-invalid={dobErr ? true : undefined} />
                      <TextField label="Month" id={id('month')} inputMode="numeric" maxLength={2} value={p.month} onChange={(e) => set(i, { month: e.target.value.replace(/\D/g, '') })} aria-invalid={dobErr ? true : undefined} />
                      <TextField label="Year" id={id('year')} inputMode="numeric" maxLength={4} value={p.year} onChange={(e) => set(i, { year: e.target.value.replace(/\D/g, '') })} aria-invalid={dobErr ? true : undefined} className="-year" />
                    </div>
                    {dobErr && <p className="m-field__error" id={`${id('day')}-err`}><Icon name="error" />{dobErr}</p>}
                  </fieldset>
                  <fieldset className="f-gender" aria-describedby={`${id('gender')}-hint${err(id('gender-f')) ? ` ${id('gender')}-err` : ''}`}>
                    <legend className="m-field__label">Gender on passport</legend>
                    <p className="m-field__hint" id={`${id('gender')}-hint`}>As shown on the passport. Airlines currently accept these two options only.</p>
                    <div className="f-gender__row">
                      {(['f', 'm'] as const).map((g) => (
                        <label className={`f-choice${p.gender === g ? ' is-on' : ''}`} key={g}>
                          <input type="radio" id={id(`gender-${g}`)} name={id('gender')} checked={p.gender === g} onChange={() => set(i, { gender: g })} aria-invalid={err(id('gender-f')) ? true : undefined} />
                          <span>{g === 'f' ? 'Female' : 'Male'}</span>
                        </label>
                      ))}
                    </div>
                    {err(id('gender-f')) && <p className="m-field__error" id={`${id('gender')}-err`}><Icon name="error" />{err(id('gender-f'))}</p>}
                  </fieldset>
                  {i === 0 && (
                    <div className="m-field__row -two">
                      <TextField label="Email" type="email" id="p0-email" hint="We’ll send the confirmation and any changes to this booking here." value={email} onChange={(e) => setEmail(e.target.value)} error={err('p0-email')} autoComplete="email" />
                      <TextField label="Phone" type="tel" id="p0-phone" hint="Include the country code, for example +1." value={phone} onChange={(e) => setPhone(e.target.value)} error={err('p0-phone')} autoComplete="tel" />
                    </div>
                  )}
                  {i > 0 && slots[i].kind !== 'infant' && (
                    <div className="bk-contact">
                      <Checkbox checked={own[i]?.on !== false} onChange={(e) => setOwn((o) => ({ ...o, [i]: { ...(o[i] ?? { email: '', phone: '' }), on: e.target.checked } }))}>Same as lead contact for email and phone</Checkbox>
                      {own[i]?.on === false && (
                        <div className="m-field__row -two">
                          <TextField label="Email" optional type="email" id={id('email')} value={own[i].email} onChange={(e) => setOwn((o) => ({ ...o, [i]: { ...o[i], email: e.target.value } }))} autoComplete="off" />
                          <TextField label="Phone" optional type="tel" id={id('phone')} hint="Include the country code, for example +1." value={own[i].phone} onChange={(e) => setOwn((o) => ({ ...o, [i]: { ...o[i], phone: e.target.value } }))} autoComplete="off" />
                        </div>
                      )}
                    </div>
                  )}
                  {!offer.passport && (
                    <details className="bk-disclose" open={!!(p.passport || p.country || p.expYear) || undefined}>
                      <summary className="bk-disclose__sum"><span>Passport details</span><span className="t-small t-muted">Optional. Add them now or before you check in</span><Icon name="chev-d" size="sm" /></summary>
                      <div className="bk-disclose__body">
                        <div className="m-field__row -two">
                          <TextField label="Passport number" optional id={id('passport')} value={p.passport} onChange={(e) => set(i, { passport: e.target.value })} autoComplete="off" />
                          <SelectField label="Issuing country" optional id={id('country')} value={p.country ?? ''} onChange={(e) => set(i, { country: e.target.value })} autoComplete="off">
                            <option value="" />
                            {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                          </SelectField>
                        </div>
                        <fieldset className="f-date">
                          <legend className="m-field__label">Expiry date <span className="t-muted">(optional)</span></legend>
                          <div className="f-date__row">
                            <TextField label="Day" id={id('expDay')} inputMode="numeric" maxLength={2} value={p.expDay} onChange={(e) => set(i, { expDay: e.target.value.replace(/\D/g, '') })} />
                            <TextField label="Month" id={id('expMonth')} inputMode="numeric" maxLength={2} value={p.expMonth} onChange={(e) => set(i, { expMonth: e.target.value.replace(/\D/g, '') })} />
                            <TextField label="Year" id={id('expYear')} inputMode="numeric" maxLength={4} value={p.expYear} onChange={(e) => set(i, { expYear: e.target.value.replace(/\D/g, '') })} className="-year" />
                          </div>
                        </fieldset>
                      </div>
                    </details>
                  )}
                  {offer.passport && (
                    <div className="f-passport">
                      <p className="t-small t-muted">This airline asks for passport details when you book.</p>
                      <div className="m-field__row -two">
                        <TextField label="Passport number" id={id('passport')} value={p.passport} onChange={(e) => set(i, { passport: e.target.value })} error={err(id('passport'))} autoComplete="off" />
                        <SelectField label="Issuing country" id={id('country')} value={p.country ?? ''} onChange={(e) => set(i, { country: e.target.value })} error={err(id('country'))} autoComplete="off">
                          <option value="" />
                          {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                        </SelectField>
                      </div>
                      <fieldset className="f-date" aria-describedby={expErr ? `${id('expDay')}-err` : undefined}>
                        <legend className="m-field__label">Expiry date</legend>
                        <div className="f-date__row">
                          <TextField label="Day" id={id('expDay')} inputMode="numeric" maxLength={2} value={p.expDay} onChange={(e) => set(i, { expDay: e.target.value.replace(/\D/g, '') })} aria-invalid={expErr ? true : undefined} />
                          <TextField label="Month" id={id('expMonth')} inputMode="numeric" maxLength={2} value={p.expMonth} onChange={(e) => set(i, { expMonth: e.target.value.replace(/\D/g, '') })} aria-invalid={expErr ? true : undefined} />
                          <TextField label="Year" id={id('expYear')} inputMode="numeric" maxLength={4} value={p.expYear} onChange={(e) => set(i, { expYear: e.target.value.replace(/\D/g, '') })} aria-invalid={expErr ? true : undefined} className="-year" />
                        </div>
                        {expErr && <p className="m-field__error" id={`${id('expDay')}-err`}><Icon name="error" />{expErr}</p>}
                      </fieldset>
                    </div>
                  )}
                  {user && <Checkbox checked={!!p.save} onChange={(e) => set(i, { save: e.target.checked })}>Save this traveler to my account</Checkbox>}
                </fieldset>
              );
            })}
            <div className="f-pax__submit">
              <Button type="submit" large arrow>Continue to payment</Button>
            </div>
          </form>
        </div>
        <aside className="l-split__aside" ref={asideRef}>
          <TripSummary place={search.to}
            lines={[`${routeTitle(search.from, search.to)}, ${search.ret ? 'return' : 'one way'}`, dayRange(search.depart, search.ret), `${paxLine(search)}, ${fareName} fare`]}
            total={amounts.total} unit={per} onBreakdown={() => setBd(true)}
            expiry={<ExpiryLine expiresAt={offer.expiresAt} onExpire={onExpire} />}
          />
        </aside>
      </div>
      {!desktop && (
        <div className={`f-bar${summaryInView ? ' is-off' : ''}`} inert={summaryInView || undefined}>
          <PriceBar total={`${money(amounts.total)} total`} sub={per} note="taxes and fees included" onTotal={() => setBd(true)}
            totalLabel={`${money(amounts.total)} total for ${travelersWord(n)}. See price breakdown`}
            action={<Button type="submit" form="f-pax-form">Continue</Button>} />
        </div>
      )}
      <Breakdown open={bd} onClose={() => setBd(false)} data={flightBreakdown(amounts, search, per)} />
      <ExpiredDialog open={expired} onRefresh={onRefresh} backHref={resultsUrl(search)} busy={refreshing} />
    </div>
  );
}
