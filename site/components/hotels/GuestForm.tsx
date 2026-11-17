'use client';
/* =====================================================================
   Guest form, round 3 (spec B8): the lead guest with email and phone,
   "I'm booking for someone else" with the guest's name, the estimated
   arrival time in hour slots from the hotel's check-in time, special
   requests that the hotel may not be able to meet; beside it the stay
   summary with the room, rate plan, cancellation terms, nights and
   total. Phones: the summary folds away and the bar carries the total.
   Copy: content/copy.md (Guest form, Checkout contact details).
   ===================================================================== */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { CheckField, ErrorSummary, SelectField, TextArea, TextField } from '@/components/ui/Field';
import { BottomBar, PhoneSummary, Summary } from '@/components/booking/Summary';
import { stayDraftKey, type RatePlanId, type StaySearch } from '@/lib/mock/hotels';
import { currentUser, getDraft, setDraft, useStore } from '@/lib/store';
import { dayMonth, dayRange, money, plural } from '@/lib/format';
import { guestsLine } from '@/lib/text';

type Props = {
  hotel: string; room: string; search: StaySearch; nights: number; query: string;
  names: { hotel: string; area: string; city: string; room: string };
  amounts: { room: number; tax: number; total: number };
  plan: { id: RatePlanId; name: string; refundable: boolean; breakfast: boolean };
  cancelUntil: string; checkIn: string; checkOut: string;
};
type Name = { given: string; family: string };

export function GuestForm({ hotel, room, search, nights, query, names, amounts, plan, cancelUntil, checkIn, checkOut }: Props) {
  const router = useRouter();
  const user = currentUser(useStore());
  const key = stayDraftKey(hotel, room, search);
  const [guests, setGuests] = useState<Name[]>(() => Array.from({ length: search.rooms }, () => ({ given: '', family: '' })));
  const [booker, setBooker] = useState<Name>({ given: '', family: '' });
  const [forOther, setForOther] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [arrival, setArrival] = useState('');
  const [requests, setRequests] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  /* hour slots from the hotel's check-in time to midnight */
  const startHour = Math.max(0, Math.min(23, parseInt(checkIn, 10) || 15));
  const slots = Array.from({ length: 24 - startHour }, (_, i) => { const h = startHour + i; return `${String(h).padStart(2, '0')}:00 to ${String((h + 1) % 24).padStart(2, '0')}:00`; });

  useEffect(() => {
    const d = getDraft(key);
    if (d.guests?.length === search.rooms) setGuests(d.guests);
    if (d.requests) setRequests(d.requests);
    if (d.email) setEmail(d.email);
    if (d.phone) setPhone(d.phone);
    if (d.arrival) setArrival(d.arrival);
  }, [key, search.rooms]);
  /* logged in, the account holder fills the lead guest and the contact details */
  useEffect(() => {
    if (!user) return;
    setGuests((g) => (g[0].given || g[0].family ? g : [{ given: user.firstName, family: user.lastName }, ...g.slice(1)]));
    setBooker((b) => (b.given || b.family ? b : { given: user.firstName, family: user.lastName }));
    setEmail((e) => e || user.email);
    setPhone((p) => p || user.phone || '');
  }, [user]);

  function check(g = guests, r = requests, b = booker, other = forOther, em = email, ph = phone) {
    const e: Record<string, string> = {};
    if (other) {
      if (!b.given.trim()) e['b-given'] = 'Enter your given names.';
      if (!b.family.trim()) e['b-family'] = 'Enter your family name.';
    }
    g.forEach((x, i) => {
      if (!x.given.trim()) e[`g${i}-given`] = 'Enter the guest’s given names.';
      if (!x.family.trim()) e[`g${i}-family`] = 'Enter the guest’s family name.';
    });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.trim())) e['g-email'] = 'Enter an email address like name@example.com.';
    if (!/^\+\d[\d\s()-]{6,}$/.test(ph.trim())) e['g-phone'] = 'Enter a phone number with its country code.';
    if (r.length > 500) e['g-requests'] = 'Keep special requests under 500 characters.';
    return e;
  }
  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setSent(true);
    const e = check();
    setErrors(e);
    if (Object.keys(e).length) { window.setTimeout(() => document.getElementById('guest-errors')?.focus(), 0); return; }
    setDraft(key, {
      guests: guests.map((g) => ({ given: g.given.trim(), family: g.family.trim() })), requests: requests.trim() || undefined,
      email: email.trim(), phone: phone.trim(), arrival: arrival || undefined
    });
    router.push(`/checkout?hotel=${hotel}&room=${room}&plan=${plan.id}&${query}`);
  }
  const set = (i: number, patch: Partial<Name>) => {
    const next = guests.map((g, j) => (j === i ? { ...g, ...patch } : g));
    setGuests(next);
    if (sent) setErrors(check(next));
  };
  const items = Object.entries(errors).map(([field, message]) => ({ field, message }));
  const terms = plan.refundable ? `Free cancellation until 23:59 hotel time on ${dayMonth(cancelUntil)}` : 'Non-refundable from the moment you book';
  const summary = (
    <Summary title="Your stay"
      lines={[`${names.hotel}, ${names.area}, ${names.city}`, `${names.room}, ${plan.name.toLowerCase()}`, `${dayRange(search.checkin, search.checkout)}, ${plural(nights, 'night', 'nights')}`, guestsLine(search), `Check-in from ${checkIn}, check-out until ${checkOut}`]}
      rows={[{ label: `Room, ${plural(nights, 'night', 'nights')}`, value: money(amounts.room) }, { label: 'Taxes and fees', value: money(amounts.tax) }]}
      total={money(amounts.total)} note="Tourist tax, if the city charges one, is paid at the hotel.">
      <ul className="o-guestTerms">
        <li className={plan.refundable ? '-yes' : '-warn'}><Icon name={plan.refundable ? 'tick' : 'info'} size="s" />{terms}</li>
        <li className={plan.breakfast ? '-yes' : ''}><Icon name={plan.breakfast ? 'tick' : 'cup'} size="s" />{plan.breakfast ? 'Breakfast included' : 'Room only'}</li>
        <li><Icon name="card" size="s" />Pay now by card</li>
      </ul>
    </Summary>
  );

  return (
    <div className="o-detail">
      <form className="o-detail__main o-form" id="guest-form" noValidate onSubmit={submit}>
        <PhoneSummary total={money(amounts.total)}>{summary}</PhoneSummary>
        <ErrorSummary id="guest-errors" title={`Check ${plural(items.length, 'detail', 'details')} before you continue`} items={items} />

        <div className="m-person">
          <CheckField id="g-other" label="I’m booking for someone else" checked={forOther} onChange={(e) => { setForOther(e.target.checked); if (sent) setErrors(check(guests, requests, booker, e.target.checked)); }} />
        </div>

        {forOther && (
          <fieldset className="m-person">
            <legend className="m-person__legend">Your details</legend>
            <TextField id="b-given" label="Given names" autoComplete="given-name" value={booker.given} error={errors['b-given']} onChange={(e) => { const b = { ...booker, given: e.target.value }; setBooker(b); if (sent) setErrors(check(guests, requests, b)); }} />
            <TextField id="b-family" label="Family name" autoComplete="family-name" value={booker.family} error={errors['b-family']} onChange={(e) => { const b = { ...booker, family: e.target.value }; setBooker(b); if (sent) setErrors(check(guests, requests, b)); }} />
          </fieldset>
        )}

        {guests.map((g, i) => (
          <fieldset className="m-person" key={i}>
            <legend className="m-person__legend">{search.rooms > 1 ? `Guest for room ${i + 1}` : forOther ? 'Guest checking in' : 'Lead guest'}</legend>
            <TextField id={`g${i}-given`} label="Given names" autoComplete={i === 0 && !forOther ? 'given-name' : 'off'} value={g.given} error={errors[`g${i}-given`]} onChange={(e) => set(i, { given: e.target.value })} />
            <TextField id={`g${i}-family`} label="Family name" autoComplete={i === 0 && !forOther ? 'family-name' : 'off'} value={g.family} error={errors[`g${i}-family`]} onChange={(e) => set(i, { family: e.target.value })} />
          </fieldset>
        ))}

        <fieldset className="m-person">
          <legend className="m-person__legend">Contact details</legend>
          <p className="m-person__intro">We’ll send the confirmation and any changes to this booking here.</p>
          <TextField id="g-email" label="Email" type="email" autoComplete="email" value={email} error={errors['g-email']} onChange={(e) => { setEmail(e.target.value); if (sent) setErrors(check(guests, requests, booker, forOther, e.target.value)); }} />
          <TextField id="g-phone" label="Phone" type="tel" autoComplete="tel" help="Include the country code, for example +1." value={phone} error={errors['g-phone']} onChange={(e) => { setPhone(e.target.value); if (sent) setErrors(check(guests, requests, booker, forOther, email, e.target.value)); }} />
        </fieldset>

        <div className="m-person">
          <SelectField id="g-arrival" label="Estimated arrival time (optional)" help={`Check-in at ${names.hotel} is from ${checkIn}. We pass your time to the hotel.`} value={arrival} onChange={(e) => setArrival(e.target.value)}>
            <option value="">I don’t know yet</option>
            {slots.map((s) => <option key={s} value={s}>{s}</option>)}
          </SelectField>
          <TextArea id="g-requests" label="Special requests (optional)" help="We pass these to the hotel. They depend on what’s available on the day and aren’t guaranteed."
            placeholder="For example, a quiet room or a late arrival" value={requests} error={errors['g-requests']} maxLength={600}
            onChange={(e) => { setRequests(e.target.value); if (sent) setErrors(check(guests, e.target.value)); }} />
        </div>
        <div className="o-form__actions">
          <button className="a-button" type="submit"><span className="a-button__label">Continue to payment</span><Icon name="arrow" className="a-button__icon" /></button>
        </div>
      </form>
      <aside className="o-detail__side">{summary}</aside>
      <BottomBar watch="#guest-form .o-form__actions" price={money(amounts.total)} label="total" action={<button className="a-button -steady" type="submit" form="guest-form"><span className="a-button__label">Continue to payment</span></button>} />
    </div>
  );
}
