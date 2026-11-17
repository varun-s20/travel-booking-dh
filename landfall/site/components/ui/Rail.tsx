/* =====================================================================
   Landfall (working name, a placeholder): rail and rail card
   Round 3 shared components (round3-spec.md, shared components 4 and 5).
   Rail: a horizontal scroll-snap list, 4 cards visible at 1440 (gap 24),
   3 at 1024, 1.15 at 390 (gap 12, the next card peeks). Round 44px arrow
   buttons sit at the right of the heading row from 1025px, disabled at
   the ends; below that, swipe. The rail is a list, so Tab moves card to
   card. Pass the heading as `head` so the arrows share its row.
   RailCard: width --w-rail-card, radius 16, hairline, --sh-card; the photo
   4:3 flush on top, zooming to 1.06 over --d-zoom on hover; body padding
   16 20 20. The whole card is one link.
   ===================================================================== */
'use client';
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Icon from '@/components/ui/Icon';
import Photo, { hasPhoto } from '@/components/ui/Photo';

type RailProps = { head?: ReactNode; label: string; children: ReactNode; className?: string; tools?: ReactNode; listClass?: string };

export function Rail({ head, label, children, className, tools, listClass }: RailProps) {
  const track = useRef<HTMLUListElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });
  const items = Children.toArray(children).filter(Boolean);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEnds({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', measure); ro.disconnect(); };
  }, [measure, items.length]);

  function move(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>(':scope > li');
    const step = first ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '24') : el.clientWidth;
    const per = Math.max(1, Math.floor((el.clientWidth + 8) / step));
    el.scrollBy({ left: dir * step * per, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  return (
    <div className={['m-rail', className || ''].filter(Boolean).join(' ')}>
      {(head || tools) && (
        <div className="m-rail__head">
          <div className="m-rail__heading">{head}</div>
          <div className="m-rail__tools">
            {tools}
            <span className="m-rail__arrows" hidden={ends.start && ends.end}>
              <button type="button" className="a-roundbtn" onClick={() => move(-1)} disabled={ends.start} aria-label={`Previous: ${label}`}><Icon name="arrow-l" /></button>
              <button type="button" className="a-roundbtn" onClick={() => move(1)} disabled={ends.end} aria-label={`Next: ${label}`}><Icon name="arrow" /></button>
            </span>
          </div>
        </div>
      )}
      <ul className={['m-rail__track', listClass || ''].filter(Boolean).join(' ')} ref={track} aria-label={label}>
        {items.map((c, i) => <li key={i} className="m-rail__item" style={{ ['--i' as string]: Math.min(i, 5) } as React.CSSProperties}>{c}</li>)}
      </ul>
    </div>
  );
}

type CardProps = {
  href: string; photo?: string; alt?: string; children: ReactNode; label?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; ratio?: '4/3' | '4/5'; sizes?: string; className?: string;
};

export function RailCard({ href, photo, alt = '', children, label, onClick, ratio = '4/3', sizes = '(min-width: 1280px) 296px, (min-width: 1025px) 33vw, (min-width: 641px) 44vw, 86vw', className }: CardProps) {
  return (
    <a className={['m-railcard', ratio === '4/5' ? '-tall' : '', className || ''].filter(Boolean).join(' ')} href={href} onClick={onClick} aria-label={label}>
      {photo && hasPhoto(photo) && (
        <span className="m-railcard__media"><Photo name={photo} sizes={sizes} alt={alt} box={false} /></span>
      )}
      <span className="m-railcard__body">{children}</span>
    </a>
  );
}
