'use client';
/* =====================================================================
   Segmented toggle (Hipcamp's sliding thumb, 220ms spring): Flights /
   Hotels and the trip type. Buttons with aria-pressed inside a labelled
   group; the white thumb is measured from the pressed button. Until it
   is measured (and without JS) the pressed button carries its own white
   (base.css, .a-toggle:not(.is-ready)).
   ===================================================================== */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';

/* icon: revision 2026-11-11, item 13 (Flights and Hotels carry a plane and a bed on the hero) */
type Option<T extends string> = { value: T; label: string; controls?: string; icon?: string };

type Props<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  small?: boolean;
};

export function Toggle<T extends string>({ label, options, value, onChange, small }: Props<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);
  const [ready, setReady] = useState(false);

  const place = useCallback(() => {
    const group = ref.current, thumb = thumbRef.current;
    if (!group || !thumb) return;
    const on = group.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!on || !on.offsetWidth) return;
    /* the first placement jumps into place: only a change of choice slides */
    if (!placed.current) thumb.style.transition = 'none';
    thumb.style.left = `${on.offsetLeft}px`;
    thumb.style.width = `${on.offsetWidth}px`;
    thumb.style.height = `${on.offsetHeight}px`;
    if (!placed.current) {
      void thumb.offsetWidth;
      thumb.style.transition = '';
      placed.current = true;
      setReady(true);
    }
  }, []);

  useLayoutEffect(place, [value, place]);

  useEffect(() => {
    const group = ref.current;
    if (!group) return;
    /* catches the phone sheet opening, a resize, and the web font arriving */
    const ro = new ResizeObserver(() => place());
    ro.observe(group);
    document.fonts?.ready.then(place).catch(() => {});
    return () => ro.disconnect();
  }, [place]);

  return (
    <div ref={ref} className={`a-toggle${small ? ' -small' : ''}${ready ? ' is-ready' : ''}`} role="group" aria-label={label}>
      <span ref={thumbRef} className="a-toggle__thumb" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.value}
          className="a-toggle__btn"
          type="button"
          aria-pressed={o.value === value}
          aria-controls={o.controls}
          onClick={() => { if (o.value !== value) onChange(o.value); }}
        >
          {o.icon && <Icon name={o.icon} />}{o.label}
        </button>
      ))}
    </div>
  );
}
