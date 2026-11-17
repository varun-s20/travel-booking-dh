/* =====================================================================
   Landfall (working name, a placeholder): accordion
   Kasa's hairline rows (75px, topic icon, plus and minus), single open,
   200ms ease-out height. Used for fare conditions (F) and Good to know
   policies (H).
   <Accordion items={[{ id: 'changes', title: 'Changes', icon: 'change', content: <p>...</p> }]} />
   ===================================================================== */
'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import Icon from './Icon';
import type { IconName } from '@/components/chrome/Sprite';

export type AccordionItem = { id: string; title: ReactNode; icon?: IconName; content: ReactNode };

function Panel({ open, id, labelledBy, children }: { open: boolean; id: string; labelledBy: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.firstElementChild as HTMLElement;
    if (open) {
      el.style.height = `${inner.offsetHeight}px`;
      const t = window.setTimeout(() => { el.style.height = 'auto'; }, 220);
      return () => window.clearTimeout(t);
    }
    el.style.height = `${inner.offsetHeight}px`;
    requestAnimationFrame(() => { el.style.height = '0px'; });
  }, [open]);
  return (
    <div ref={ref} className="m-acc__panel" id={id} role="region" aria-labelledby={labelledBy} hidden={false} inert={!open}>
      <div className="m-acc__inner">{children}</div>
    </div>
  );
}

export default function Accordion({ items, defaultOpen = null }: { items: AccordionItem[]; defaultOpen?: string | null }) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  const base = useId();
  return (
    <div className="m-acc">
      {items.map((it) => {
        const isOpen = open === it.id;
        const bid = `${base}-${it.id}-b`, pid = `${base}-${it.id}-p`;
        return (
          <div className="m-acc__item" key={it.id}>
            <h3>
              <button type="button" id={bid} className="m-acc__btn" aria-expanded={isOpen} aria-controls={pid} onClick={() => setOpen(isOpen ? null : it.id)}>
                {it.icon && <Icon name={it.icon} />}
                <span className="m-acc__title">{it.title}</span>
                <span className="m-acc__sign" aria-hidden="true" />
              </button>
            </h3>
            <Panel open={isOpen} id={pid} labelledBy={bid}>{it.content}</Panel>
          </div>
        );
      })}
    </div>
  );
}
