/* =====================================================================
   Landfall (working name, a placeholder), group H: guest form
   Spec 2b, Hotels, Guest form: one column plus the sticky summary
   (hotel photo, room, dates and nights, the total under the landfall
   line, the breakdown, the cancellation line); the lead guest's names,
   email and phone, special requests. On Continue it keeps the form in
   lib/store.ts drafts (stayDraftKey, sessionStorage) and hands over to
   checkout: /checkout?kind=stay&hotel=<id>&room=<id>&plan=<rate id>&<stayQuery>.
   390: the sticky price bar submits the form.
   Backend (2026-11-15): the room and its one rate come from the stored
   rate (app/hotels/[hotel]/guests/page.tsx), priced for the whole stay:
   the total, taxes, deadline and terms are the rate's own. The phone is
   required (the hotel booking needs one) in international form. A
   signed-in customer's names, email and phone are filled in.
   Copy: landfall/content/copy.md, Guest form (as content/copy.md).
   ===================================================================== */
'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { freeCancelUntil, nightsOf, planOf, stayDraftKey, stayQuery, stayTotals, type Hotel, type PlanId, type Room, type StaySearch } from '@/lib/travel/hotels';
import { fromMinor } from '@/lib/travel/money';
import PriceTable, { stayLabel, type PriceRow } from '@/components/booking/PriceTable';
import Dialog from '@/components/ui/Dialog';
import Steps from '@/components/booking/Steps';
import { dayMonth, dayRange } from '@/lib/format';
import { MQ_DESKTOP, useMedia } from '@/lib/client';
import { getDraft, setDraft, useStore } from '@/lib/store';
import { useSession } from '@/lib/session';
import Icon from '@/components/ui/Icon';
import Photo from '@/components/ui/Photo';
import PriceBar from '@/components/ui/PriceBar';
import { Button } from '@/components/ui/Button';
import { Checkbox, ErrorSummary, SelectField, TextArea, TextField } from '@/components/ui/Field';
import { cityName, dollars0, nightsWord, leadIndex } from './parts';

type V = { given: string; family: string; email: string; phone: string; requests: string };
type E = Partial<Record<keyof V, string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* "+44 (20) 7946-0958" -> "+442079460958"; a leading 00 becomes + */
const phoneOf = (s: string) => s.trim().replace(/[\s().\-]/g, '').replace(/^00/, '+');

function check(v: V): E {
  const e: E = {};
  if (!v.given.trim()) e.given = 'Enter the guest’s given names.';
  if (!v.family.trim()) e.family = 'Enter the guest’s family name.';
  if (!EMAIL.test(v.email.trim())) e.email = 'Enter an email address like name@example.com.';
  if (!v.phone.trim()) e.phone = 'Enter a phone number. The hotel uses it if they need to reach you.';
  else if (!/^\+[1-9]\d{6,14}$/.test(phoneOf(v.phone))) e.phone = 'Enter the phone number with its country code, starting with +, for example +1 415 555 0100.';
  if (v.requests.length > 500) e.requests = 'Keep special requests under 500 characters.';
  return e;
}

/* estimated arrival: hour slots from check-in time to midnight, folded into the requests the hotel sees */
const ARRIVE = 'Estimated arrival: ';
const SLOTS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00 to ${String((i + 1) % 24).padStart(2, '0')}:00`);
function splitRequests(raw: string): { arrival: string; rest: string } {
  const m = raw.match(/^Estimated arrival: ([0-9:]+ to [0-9:]+)\.\s*/);
  return m ? { arrival: m[1], rest: raw.slice(m[0].length) } : { arrival: '', rest: raw };
}

export default function Guests({ hotel: h, room: r, search, plan }: { hotel: Hotel; room: Room; search: StaySearch; plan: PlanId }) {
  const router = useRouter();
  const desktop = useMedia(MQ_DESKTOP, true);
  const store = useStore();
  const session = useSession();
  const user = session.user;
  const key = stayDraftKey(h.id, r.id, search);
  const t = stayTotals(r, search, plan);
  const rp = planOf(r, plan);
  const rooms = Math.max(1, search.rooms);
  const nights = Math.max(1, nightsOf(search));
  /* the rate covers every room and night: one line that adds up to the total */
  const rows: PriceRow[] = [{ label: stayLabel(nights, Math.round(t.total / rooms / nights), rooms, 'Room'), amount: t.total }];
  const atHotel = rp.payAtHotel ? `Plus ${fromMinor(rp.payAtHotel.amount, rp.payAtHotel.currency)} ${rp.payAtHotel.currency} paid at the hotel` : null;
  const [others, setOthers] = useState<{ given: string; family: string }[]>(() => Array.from({ length: rooms - 1 }, () => ({ given: '', family: '' })));
  const [arrival, setArrival] = useState('');
  const [forOther, setForOther] = useState(false);
  const [v, setV] = useState<V>({ given: '', family: '', email: '', phone: '', requests: '' });
  const [errors, setErrors] = useState<E>({});
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [breakdown, setBreakdown] = useState(false);
  const [terms, setTerms] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const loaded = useRef(false);

  /* a draft from an earlier visit (Edit from checkout), or the signed-in account's details */
  useEffect(() => {
    if (!store || session.status !== 'ready' || loaded.current) return;
    loaded.current = true;
    const d = getDraft(key);
    const req = splitRequests(d.requests ?? '');
    setArrival(req.arrival);
    if (d.guests && d.guests.length > 1) setOthers((o) => o.map((x, i) => d.guests![i + 1] ?? x));
    setV({
      given: d.guests?.[0]?.given ?? user?.firstName ?? '', family: d.guests?.[0]?.family ?? user?.lastName ?? '',
      email: d.email ?? user?.email ?? '', phone: d.phone ?? user?.phone ?? '', requests: req.rest
    });
  }, [store, session.status, key, user]);

  const set = (k: keyof V) => (e: { target: { value: string } }) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (errors[k]) setErrors((x) => ({ ...x, [k]: check(next)[k] }));
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const found = check(v);
    setErrors(found);
    if (Object.keys(found).length) { setVersion((n) => n + 1); return; }
    setBusy(true);
    const lead = { given: v.given.trim(), family: v.family.trim() };
    const guests = [lead, ...others.map((g) => (g.given.trim() || g.family.trim() ? { given: g.given.trim(), family: g.family.trim() } : lead))];
    const requests = [arrival ? `${ARRIVE}${arrival}.` : '', v.requests.trim()].filter(Boolean).join(' ');
    setDraft(key, { guests, email: v.email.trim(), phone: phoneOf(v.phone), requests: requests || undefined });
    router.push(`/checkout?kind=stay&hotel=${encodeURIComponent(h.id)}&room=${encodeURIComponent(r.id)}&plan=${encodeURIComponent(rp.id)}&${stayQuery(search)}`);
  };

  const list = (Object.keys(errors) as (keyof V)[]).filter((k) => errors[k]).map((k) => ({ id: `g-${k}`, message: errors[k]! }));
  const n = list.length;
  const thumb = r.photos[0] ?? h.photos[leadIndex(h)]?.name;
  const backHref = `/hotels/${encodeURIComponent(h.id)}?${stayQuery(search)}`;

  return (
    <div className="l-container h-guests">
      <div className="l-split">
        <div className="h-guests__main">
          <Link prefetch={false} className="a-textbtn h-detail__back" href={backHref}><Icon name="arrow-l" />Back to rooms</Link>
          <Steps current={1} steps={[{ label: 'Choose your room', href: `${backHref}#rooms` }, { label: 'Guests' }, { label: 'Pay' }]} />
          <h1 className="t-display t-h1">Who’s checking in?</h1>
          <p className="t-lead h-guests__intro">Add the guest who will check in. The hotel may ask to see ID with this name on it.</p>
          {n > 0 && <ErrorSummary title={`Check ${n} ${n === 1 ? 'detail' : 'details'} before you continue`} errors={list} version={version} />}
          <form ref={form} className="h-guests__form" onSubmit={submit} noValidate>
            <div className="bk-forother">
              <Checkbox checked={forOther} onChange={(e) => {
                const on = e.target.checked;
                setForOther(on);
                if (on && user && v.given === user.firstName && v.family === user.lastName) setV((x) => ({ ...x, given: '', family: '' }));
              }}>I’m booking for someone else</Checkbox>
            </div>
            <fieldset className="m-card -pad h-guests__card">
              <legend className="h-guests__legend">{rooms > 1 ? `Room 1, ${r.name}` : r.name}</legend>
              <p className="t-small t-muted bk-guestnote">{forOther ? 'The guest who checks in. We’ll send the confirmation to you, at the email below.' : 'Lead guest, the name the hotel checks against ID.'}</p>
              <div className="m-field__row -two">
                <TextField id="g-given" label="Given names" autoComplete="given-name" value={v.given} onChange={set('given')} error={errors.given} />
                <TextField id="g-family" label="Family name" autoComplete="family-name" value={v.family} onChange={set('family')} error={errors.family} />
              </div>
              <TextField id="g-email" label="Email" type="email" autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email}
                hint={forOther ? 'Your email. We’ll send the confirmation and any changes here.' : 'We’ll send the confirmation and any changes to this booking here.'} />
              <TextField id="g-phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" value={v.phone} onChange={set('phone')} error={errors.phone}
                hint="Include the country code, for example +1." />
            </fieldset>
            {others.map((g, i) => (
              <fieldset className="m-card -pad h-guests__card" key={i}>
                <legend className="h-guests__legend">Room {i + 2}, {r.name}</legend>
                <p className="t-small t-muted bk-guestnote">Guest name for this room. Leave it blank to use the lead guest’s name.</p>
                <div className="m-field__row -two">
                  <TextField id={`g-r${i + 2}-given`} label="Given names" optional autoComplete="off" value={g.given} onChange={(e) => setOthers((o) => o.map((x, j) => (j === i ? { ...x, given: e.target.value } : x)))} />
                  <TextField id={`g-r${i + 2}-family`} label="Family name" optional autoComplete="off" value={g.family} onChange={(e) => setOthers((o) => o.map((x, j) => (j === i ? { ...x, family: e.target.value } : x)))} />
                </div>
              </fieldset>
            ))}
            <div className="m-card -pad h-guests__card">
              <SelectField id="g-arrival" label="Estimated arrival time" optional value={arrival} onChange={(e) => setArrival(e.target.value)}
                hint={`${h.checkIn ? `Check-in from ${h.checkIn}. ` : ''}The hotel uses this to have your room ready.`}>
                <option value="">I don’t know yet</option>
                {SLOTS.map((x) => <option key={x} value={x}>{x}</option>)}
              </SelectField>
              <TextArea id="g-requests" label="Special requests" optional rows={4} maxLength={600} value={v.requests} onChange={set('requests')} error={errors.requests}
                placeholder="For example, a quiet room or a late arrival"
                hint="Requests depend on availability. We pass them to the hotel; they aren’t guaranteed." />
            </div>
            <Button type="submit" large arrow disabled={busy} className="h-guests__go">Continue to payment</Button>
          </form>
        </div>

        <aside className="l-split__aside">
          <div className="m-summary h-guests__sum" aria-label="Your stay">
            {thumb && <Photo name={thumb} alt="" grade={false} sizes="(min-width: 1025px) 392px, 100vw" className="h-guests__thumb" />}
            <div>
              <p className="m-summary__title">{h.name}</p>
              <p className="t-small t-muted">{[h.area, cityName(h.city)].filter(Boolean).join(', ')}</p>
            </div>
            <div className="h-guests__lines">
              <p>{rooms > 1 ? `${rooms} x ` : ''}{r.name}</p>
              <p className="t-small">{rp.name || rp.board}</p>
              <p className="t-num">{dayRange(search.checkin, search.checkout)}, {nightsWord(search)}</p>
            </div>
            {rp.refundable
              ? <p className="h-card__free"><Icon name="tick" />Free cancellation until {dayMonth(freeCancelUntil(search, rp))}</p>
              : !/non-refundable/i.test(rp.name) && <p className="t-small t-muted">Non-refundable</p>}
            <div className="m-total bk-sumtable">
              <PriceTable caption="Price details" rows={rows} total={t.total} taxes={t.tax} note={atHotel ?? undefined} />
              <button type="button" className="a-textbtn h-guests__bd" onClick={() => setBreakdown(true)}>See price breakdown</button>
              {rp.conditions?.length ? <button type="button" className="a-textbtn h-guests__bd" onClick={() => setTerms(true)}>Rate terms</button> : null}
            </div>
          </div>
        </aside>
      </div>

      {!desktop && (
        <PriceBar total={`${dollars0(t.total)} total`} sub={`${dollars0(t.nightly)} per night, ${nightsWord(search)}`} note="taxes and fees included" onTotal={() => setBreakdown(true)}
          action={<Button onClick={() => submit()} disabled={busy}>Continue</Button>} />
      )}
      <Dialog open={breakdown} onClose={() => setBreakdown(false)} title="Price breakdown" sheet closeLabel="Close">
        <div className="bk-sumtable">
          <PriceTable caption="Price details" rows={rows} total={t.total} taxes={t.tax}
            note={atHotel ?? 'Tourist tax, if the city charges one, is paid at the hotel.'} />
        </div>
      </Dialog>
      <Dialog open={terms} onClose={() => setTerms(false)} title="Rate terms" sheet closeLabel="Close">
        <dl className="h-rules">
          {(rp.conditions ?? []).map((c, i) => <div key={`${c.title}-${i}`}><dt><Icon name="info" />{c.title || 'Terms'}</dt><dd>{c.body}</dd></div>)}
        </dl>
      </Dialog>
    </div>
  );
}
