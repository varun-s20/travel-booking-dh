/* =====================================================================
   Landfall (working name, a placeholder): how booking works, trust, FAQs
   Round 3, A8 and A10. Replaces "What happens when you book".
   - Steps: one landfall line across the container with 4 stops (the last
     is the landing dot), drawn left to right once in view (1200ms,
     --ease-reveal), the dots fading in on arrival. Reduced motion: drawn.
     At 390 the line runs down the left, the itinerary timeline's language.
   - Trust: 4 facts in one white panel divided by hairlines (shared by
     both modes).
   - FAQs: Kasa's hairline accordion in one 840 column, single open, ids
     faq-<slug> for the footer's links (Flights 3 faq-change, 7 faq-cards).
     A hash that names a flight question switches to Flights and opens it.
   Copy: round3-spec.md A8 and A10, word for word.
   ===================================================================== */
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { ModeSwap, useMode } from '@/components/home/Mode';
import { getSearch, setSearch } from '@/components/search/store';
import { prefersReducedMotion } from '@/lib/client';

type Step = { icon: React.ComponentProps<typeof Icon>['name']; title: string; text: string };
const STEPS: Record<'flights' | 'hotels', Step[]> = {
  flights: [
    { icon: 'search', title: 'Search', text: 'Pick a route and dates. Every fare shows the total for all travelers.' },
    { icon: 'ticket', title: 'Choose your fare', text: 'Compare what each fare includes: bags, changes, refunds and seats.' },
    { icon: 'card', title: 'Pay by card', text: 'Your card goes through Stripe. We check the price with the airline just before you pay.' },
    { icon: 'plane', title: 'Travel', text: 'Your e-tickets arrive by email and stay in My bookings.' }
  ],
  hotels: [
    { icon: 'search', title: 'Search', text: 'Pick a city and dates. Every rate shows the price for your whole stay.' },
    { icon: 'bed', title: 'Choose your room', text: 'Compare rate plans: breakfast, free cancellation, pay now.' },
    { icon: 'card', title: 'Pay by card', text: 'Your card goes through Stripe. We confirm the room with the hotel before you pay.' },
    { icon: 'door', title: 'Check in', text: 'Your confirmation arrives by email and stays in My bookings.' }
  ]
};

function Steps({ mode }: { mode: 'flights' | 'hotels' }) {
  return (
    <ol className="m-steps">
      {STEPS[mode].map((s, i) => (
        <li key={s.title} className="m-steps__step" style={{ ['--i' as string]: i } as React.CSSProperties}>
          <span className={`m-steps__dot${i === 3 ? ' -land' : ''}`} aria-hidden="true" />
          <Icon name={s.icon} />
          <h3 className="m-steps__title">{s.title}</h3>
          <p className="m-steps__text">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function HowBooking() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) { setDrawn(true); return; }
    const io = new IntersectionObserver((en) => { if (en.some((e) => e.isIntersecting)) { setDrawn(true); io.disconnect(); } }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="o-sec o-how" id="how-booking-works" aria-labelledby="how-title">
      <div className="l-container">
        <h2 className="t-display t-h2 o-how__title" id="how-title">How booking works</h2>
        <p className="o-sec__sub t-small o-how__sub">From the search to the ticket in your inbox</p>
        <div ref={ref} className={`o-how__line${drawn ? ' is-drawn' : ''}`}>
          <span className="o-how__rule" aria-hidden="true" />
          <ModeSwap flights={<Steps mode="flights" />} hotels={<Steps mode="hotels" />} />
        </div>
        <ul className="m-trust">
          <li><Icon name="tick" /><span><strong>Taxes and fees included</strong><span>The total you see is the total you pay.</span></span></li>
          <li><Icon name="clock" /><span><strong>Price checked before you pay</strong><span>If it changes, you see it and choose.</span></span></li>
          <li><Icon name="lock" /><span><strong>Card payments by Stripe</strong><span>We never see or store your card number.</span></span></li>
          <li><Icon name="mail" /><span><strong>Help with your booking</strong><span><Link prefetch={false} className="a-link" href="/contact">Contact us</Link> with your booking reference.</span></span></li>
        </ul>
      </div>
    </section>
  );
}

/* ---------- FAQs ---------- */
type Faq = { id: string; q: string; a: React.ReactNode };
const FAQS: Record<'flights' | 'hotels', Faq[]> = {
  flights: [
    { id: 'faq-taxes', q: 'Does the price include taxes and fees?', a: 'Yes. Every fare shows the total for all travelers with taxes and fees included. The price per traveler sits under it.' },
    { id: 'faq-bags', q: 'What can I take on board?', a: 'It depends on the fare. Each fare lists its cabin bag and checked bags before you choose it.' },
    { id: 'faq-change', q: 'Can I change or cancel my flight?', a: 'Each fare shows its change and refund rules before you pay. Booked flights can be managed in My bookings where the airline allows it.' },
    { id: 'faq-price-changed', q: 'Why did the price change before I paid?', a: 'Airlines can change a fare at any time. We check it again just before payment and show you the new total, so you can continue or go back.' },
    { id: 'faq-eticket', q: 'When do I get my e-ticket?', a: 'Usually within a few minutes of paying. It comes by email and is saved in My bookings.' },
    { id: 'faq-account', q: 'Do I need an account to book?', a: 'No. An account keeps your bookings and travelers in one place, but you can book as a guest.' },
    /* CLIENT COPY REQUIRED: the card brands the client accepts (open client question 16) */
    { id: 'faq-cards', q: 'Which cards can I pay with?', a: 'Major credit and debit cards, through Stripe.' },
    { id: 'faq-contact', q: 'How do I contact you about a booking?', a: <>Use the <Link prefetch={false} className="a-link" href="/contact">contact page</Link> with your booking reference and we&apos;ll reply by email.</> }
  ],
  hotels: [
    { id: 'faq-h-whole-stay', q: 'Is the price for the whole stay?', a: 'Yes. The total covers every night for your room and guests, with taxes and fees included. The nightly price sits under it.' },
    { id: 'faq-h-free-cancellation', q: 'What does free cancellation mean?', a: "You can cancel without a charge until the date shown on the rate. After that, the hotel's cancellation terms apply." },
    { id: 'faq-h-breakfast', q: 'Is breakfast included?', a: 'Only on rates that say so. Each room lists what its rate includes.' },
    { id: 'faq-h-check-in', q: 'When can I check in?', a: 'Check-in and check-out times are on each hotel page under House rules.' },
    { id: 'faq-h-rooms', q: 'Can I book more than one room?', a: 'Yes. Choose the number of rooms in the search, then the quantity of each room on the hotel page.' },
    /* the catalogue's house rules say a local tourist tax, if the city charges one, is paid at the hotel (mock-catalogue.md, Default house rules) */
    { id: 'faq-h-pay', q: 'Do I pay now or at the hotel?', a: 'You pay now by card through Stripe. Some hotels charge a local tax or a deposit at check-in; the hotel page says so when they do.' },
    { id: 'faq-h-change-dates', q: 'Can I change my dates?', a: 'Cancel and rebook if your rate allows free cancellation, or contact us with your booking reference.' },
    { id: 'faq-h-contact', q: 'How do I contact you about a booking?', a: <>Use the <Link prefetch={false} className="a-link" href="/contact">contact page</Link> with your booking reference and we&apos;ll reply by email.</> }
  ]
};

function FaqList({ mode, open, setOpen }: { mode: 'flights' | 'hotels'; open: string | null; setOpen: (id: string | null) => void }) {
  return (
    <ul className="m-faq">
      {FAQS[mode].map((f) => {
        const isOpen = open === f.id;
        return (
          <li key={f.id} id={f.id} className={`m-faq__item${isOpen ? ' is-open' : ''}`}>
            <h3 className="m-faq__h">
              <button type="button" className="m-faq__btn" aria-expanded={isOpen} aria-controls={`${f.id}-a`} onClick={() => setOpen(isOpen ? null : f.id)}>
                <span>{f.q}</span><Icon name={isOpen ? 'minus' : 'plus'} />
              </button>
            </h3>
            <div className="m-faq__a" id={`${f.id}-a`} role="region" aria-label={f.q} hidden={!isOpen}><p>{f.a}</p></div>
          </li>
        );
      })}
    </ul>
  );
}

export function Faqs() {
  const mode = useMode();
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const on = () => {
      const id = location.hash.slice(1);
      if (!id.startsWith('faq-')) return;
      const flights = FAQS.flights.some((f) => f.id === id);
      if (flights && getSearch().tab !== 'flights') setSearch({ tab: 'flights' });
      setOpen(id);
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'center' }), 80);
    };
    on();
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return (
    <section className="o-sec o-faqs" id="faqs" aria-labelledby="faqs-title">
      <div className="l-container">
        <div className="o-faqs__col">
          <h2 className="t-display t-h2 o-faqs__title" id="faqs-title">Questions before you book</h2>
          <ModeSwap flights={<FaqList mode="flights" open={open} setOpen={setOpen} />} hotels={<FaqList mode="hotels" open={open} setOpen={setOpen} />} />
        </div>
      </div>
    </section>
  );
}
