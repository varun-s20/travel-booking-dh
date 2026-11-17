'use client';
/* =====================================================================
   Entry cards (Hipcamp promo cards): one per product, a photo with a
   deep band holding the title and one white pill that opens the hero
   search on that tab. A click anywhere on the card does the same (the
   pill stays the one keyboard stop). Copy: content/copy.md, Entry cards.
   ===================================================================== */
import { Photo } from '@/components/Photo';
import { SearchLink } from '@/components/home/SearchLink';
import { useEffect, useState } from 'react';
import { PRODUCT_EVENT, requestSearch, type SearchMode } from '@/lib/client';

const CARDS: { mode: SearchMode; title: string; button: string; image: string; alt: string }[] = [
  { mode: 'flights', title: 'Compare flights by price, time and stops', button: 'Search flights', image: 'departure-hall-walker', alt: 'A traveler with a backpack walking through a bright departure hall, seen from behind' },
  { mode: 'hotels', title: 'Pick the room, then see the total for your stay', button: 'Find a hotel', image: 'hotel-room-sheer-window', alt: 'A made bed beside a tall window in a quiet hotel room, morning light' }
];

/* 604px at 1440 (the root scales past it), half the column on tablets, the full column on phones */
const SIZES = '(min-width: 1441px) 42vw, (min-width: 1025px) 604px, (min-width: 641px) calc(50vw - 36px), calc(100vw - 32px)';

export function EntryCards({ initialMode = 'flights' }: { initialMode?: SearchMode }) {
  /* round 3 (spec A0.3, critic): the card for the mode in use comes first, in the DOM too (keys keep each card mounted) */
  const [mode, setMode] = useState<SearchMode>(initialMode);
  useEffect(() => {
    const on = (e: Event) => { const m = (e as CustomEvent<{ mode: SearchMode | null }>).detail.mode; if (m) setMode(m); };
    window.addEventListener(PRODUCT_EVENT, on);
    return () => window.removeEventListener(PRODUCT_EVENT, on);
  }, []);
  const cards = mode === 'hotels' ? [CARDS[1], CARDS[0]] : CARDS;
  return (
    <div className="o-homeEntry b-wrap">
      <ul className="o-homeEntry__grid">
        {cards.map((c) => (
          <li key={c.mode}>
            <div
              className="m-entry"
              onClick={(e) => { if (!(e.target as HTMLElement).closest('a')) requestSearch(c.mode); }}
            >
              <div className="m-entry__media">
                <Photo name={c.image} alt={c.alt} sizes={SIZES} className="m-entry__img" />
              </div>
              <div className="m-entry__band">
                <h2 className="m-entry__title">{c.title}</h2>
                <SearchLink mode={c.mode} label={c.button} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
