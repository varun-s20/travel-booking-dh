/* =====================================================================
   Landfall, group H: hotel FAQs (round3-spec.md B7, item 8)
   Kasa's hairline accordion: one answer open at a time, a plus that turns
   to a minus, 200ms open and close (none under reduced motion). The
   questions and answers come only from the hotel's own data (hotelFaqs).
   ===================================================================== */
'use client';
import { useState } from 'react';
import type { HotelFaq } from '@/lib/travel/hotels';
import Icon from '@/components/ui/Icon';

export default function Faqs({ items }: { items: HotelFaq[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="h-faqs">
      {items.map((f) => {
        const on = open === f.id;
        return (
          <li key={f.id} id={`faq-${f.id}`} className={['h-faq', on ? 'is-open' : ''].join(' ')}>
            <h3 className="h-faq__q">
              <button type="button" className="h-faq__btn" aria-expanded={on} aria-controls={`faq-${f.id}-a`} id={`faq-${f.id}-q`} onClick={() => setOpen(on ? null : f.id)}>
                <span>{f.q}</span>
                <Icon name={on ? 'minus' : 'plus'} />
              </button>
            </h3>
            <div className="h-faq__a" id={`faq-${f.id}-a`} role="region" aria-labelledby={`faq-${f.id}-q`} aria-hidden={!on}>
              <div><p>{f.a}</p></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
