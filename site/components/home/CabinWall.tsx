'use client';
/* =====================================================================
   The cabin wall (Overwing): four windows, one continuous view (2 at
   390, 3 from 641, 4 from 1025). The blinds rise once on load (the one
   load moment: released when the view has loaded, 1.2s cap), then the
   view drifts sideways a little slower than the page, paused when the
   hero is off screen. Both off under reduced motion (CSS starts the
   blinds raised and stops the drift).
   ===================================================================== */
import { useEffect, useRef, useState } from 'react';
import { Photo } from '@/components/Photo';
import { addScrollJob, MQ_REDUCE } from '@/lib/client';
import { HERO_VIEW } from '@/lib/site';

/* fitted to the window row: 89vw past 1440 (the root scales), the rail-less width at 1025 to 1440 with the drift margin, 107cqw of the row on phones */
const SIZES = '(min-width: 1441px) 89vw, (min-width: 1025px) calc((100vw - 88px) * 1.02), 107vw';
/* revision 2026-11-11, item 16 and the Chief Officer's condition: a harbour town on the coast at first light, from high up
   (the wing over clouds retired from the hero). Alt written to the sourced photo, for the Copywriter */
const ALT = 'A harbour town on the coast at first light, seen from high above';

export function CabinWall() {
  const wallRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  /* the blinds: wait for the first paint with them down, then release */
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const reduce = window.matchMedia(MQ_REDUCE);
    if (reduce.matches) { setShown(true); return; }
    const img = wall.querySelector<HTMLImageElement>('img');
    let done = false;
    const go = () => { if (done) return; done = true; requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); };
    if (img && !img.complete) {
      img.addEventListener('load', go, { once: true });
      img.addEventListener('error', go, { once: true });
    } else go();
    /* never hold the view behind the blinds for long */
    const cap = window.setTimeout(go, 1200);
    return () => window.clearTimeout(cap);
  }, []);

  /* the drift: 0.12px sideways per px scrolled, at most 6% of the view's width (tokens.css) */
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const css = getComputedStyle(document.documentElement);
    const DRIFT = parseFloat(css.getPropertyValue('--drift')) || 6;
    const RATE = parseFloat(css.getPropertyValue('--drift-rate')) || 0.12;
    const reduce = window.matchMedia(MQ_REDUCE);
    const view = wall.querySelector<HTMLElement>('.m-window__view');
    let inView = true;
    const io = new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; });
    io.observe(wall.closest('section') || wall);
    const stop = addScrollJob((y) => {
      if (reduce.matches) { wall.style.removeProperty('--drift-x'); return; }
      if (!inView) return;
      const w = view ? view.offsetWidth : 0;
      const x = Math.min(Math.max(y, 0) * RATE, (DRIFT / 100) * w);
      wall.style.setProperty('--drift-x', `${(-x).toFixed(1)}px`);
    });
    return () => { stop(); io.disconnect(); };
  }, []);

  return (
    <div className={`o-homeHero__cabin b-wrap${shown ? ' is-shown' : ''}`} ref={wallRef}>
      <div className="o-homeHero__windows">
        {[0, 1, 2, 3].map((i) => (
          <div className="m-window" key={i} aria-hidden={i > 0 || undefined}>
            <Photo name={HERO_VIEW} alt={i === 0 ? ALT : ''} sizes={SIZES} className="m-window__view" priority={i === 0} />
            <span className="m-window__blind" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
