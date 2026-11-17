/* =====================================================================
   Landfall (working name, a placeholder): Kasa's word reveal for headings
   Splits the text into words (each aria-hidden, the heading keeps the
   whole text as its accessible name) and adds is-inview once the heading
   enters the viewport; global.css does the moving, gated by the js class.
   Reduced motion: words show at once (CSS) and no observer runs.
   <SplitText as="h2" className="t-display t-h2" id="dest-title">Return fares from London</SplitText>
   ===================================================================== */
'use client';
import { createElement, useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/client';

type Tag = 'h1' | 'h2' | 'h3' | 'p';

export default function SplitText({ as = 'h2', children, className, id, observe = true }: { as?: Tag; children: string; className?: string; id?: string; observe?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !observe) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) { el.classList.add('is-inview'); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { el.classList.add('is-inview'); io.disconnect(); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [observe]);
  const words = children.trim().split(/\s+/);
  return createElement(as, { ref, className, id, 'aria-label': children, 'data-split': '' },
    words.map((w, i) => (
      <span key={i}>
        <span className="w" aria-hidden="true" style={{ ['--i' as string]: i } as React.CSSProperties}>{w}</span>
        {i < words.length - 1 ? ' ' : ''}
      </span>
    )));
}
