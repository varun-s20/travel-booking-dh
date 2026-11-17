'use client';
/* Round 3 (spec A0.4): the hero lead follows the mode; the headline stays. The server renders the mode from ?mode=. */
import { useEffect, useState } from 'react';
import { PRODUCT_EVENT, type SearchMode } from '@/lib/client';

const LEAD = {
  flights: 'Search flights and see the full total before you pay',
  hotels: 'Search hotels and see the total for your stay before you pay'
};

export function HeroLead({ initialMode }: { initialMode: SearchMode }) {
  const [mode, setMode] = useState(initialMode);
  useEffect(() => {
    const on = (e: Event) => { const m = (e as CustomEvent<{ mode: SearchMode | null }>).detail.mode; if (m) setMode(m); };
    window.addEventListener(PRODUCT_EVENT, on);
    return () => window.removeEventListener(PRODUCT_EVENT, on);
  }, []);
  return <p className="o-homeHero__lead a-lead">{LEAD[mode]}</p>;
}
