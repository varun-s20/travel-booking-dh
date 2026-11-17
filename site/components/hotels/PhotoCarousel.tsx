'use client';
/* =====================================================================
   Photo carousel on hotel and room cards (spec 2b: Hipcamp's tapered
   dots, arrows on hover): a native scroll-snap track, so a thumb swipes
   it on phones; Previous and Next scroll one photo; the dots shrink with
   their distance from the current one. Photos stand in for Duffel's and
   are never graded. Alt pattern: "Casa Lanterna, photo 1 of 5".
   ===================================================================== */
import { useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';

type Props = { photos: string[]; name: string; sizes: string; className?: string; alts?: string[]; counter?: boolean; priority?: boolean };

export function PhotoCarousel({ photos, name, sizes, className = '', alts, counter = false, priority = false }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const n = photos.length;
  function go(d: number) {
    const t = track.current;
    if (!t) return;
    t.scrollTo({ left: Math.min(Math.max(i + d, 0), n - 1) * t.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  return (
    <div className={`m-carousel ${className}`}>
      <div className="m-carousel__track" ref={track} onScroll={(e) => { const t = e.currentTarget; setI(Math.round(t.scrollLeft / Math.max(1, t.clientWidth))); }}>
        {photos.map((p, k) => (
          <div className="m-carousel__slide" key={`${p}-${k}`} aria-hidden={k !== i || undefined}>
            <Photo name={p} alt={alts?.[k] ?? `${name}, photo ${k + 1} of ${n}`} sizes={sizes} graded={false} priority={priority && k === 0} className="m-carousel__img" />
          </div>
        ))}
      </div>
      {n > 1 && (
        <>
          <button className="m-carousel__btn -prev" type="button" aria-label="Previous photo" disabled={i === 0} onClick={() => go(-1)}><Icon name="chev-left" size="s" /></button>
          <button className="m-carousel__btn -next" type="button" aria-label="Next photo" disabled={i === n - 1} onClick={() => go(1)}><Icon name="chev-right" size="s" /></button>
          {counter && <span className="m-carousel__counter" aria-hidden="true">{i + 1} / {n}</span>}
          <span className="m-carousel__dots" aria-hidden="true">
            {photos.map((p, k) => <span key={`${p}-${k}`} className={`m-carousel__dot${k === i ? ' is-on' : Math.abs(k - i) > 1 ? ' -far' : ''}`} />)}
          </span>
        </>
      )}
    </div>
  );
}
