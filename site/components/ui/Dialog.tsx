'use client';
/* =====================================================================
   Dialog (conventions.md): rendered into <body>, the page behind goes
   inert, focus moves to the close button (or the first control), Tab
   stays inside, Escape and the scrim close it, focus goes back to the
   opener. Sizes: a 480 confirm card, a 640 reading panel, a full-screen
   gallery. Sheets on the phone open instantly (Hipcamp).
   ===================================================================== */
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/Icon';
import { setAppInert, trapTab, visibleFocusables } from '@/lib/client';

type Props = {
  open: boolean; onClose: () => void; title: ReactNode; id: string; children: ReactNode;
  size?: 'confirm' | 'read' | 'full' | 'sheet'; closeLabel?: string; hideClose?: boolean; foot?: ReactNode; className?: string;
};

export function Dialog({ open, onClose, title, id, children, size = 'read', closeLabel = 'Close', hideClose, foot, className = '' }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    setAppInert(true);
    document.documentElement.classList.add('is-locked');
    requestAnimationFrame(() => {
      const p = panel.current;
      if (!p) return;
      const close = p.querySelector<HTMLElement>('[data-dialog-close]');
      (close || visibleFocusables(p)[0] || p).focus();
    });
    return () => {
      setAppInert(false);
      document.documentElement.classList.remove('is-locked');
      opener.current?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div className={`m-dialog -${size} ${className}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}
      onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } trapTab(e); }}>
      <div className="m-dialog__scrim" onClick={onClose} />
      <div className="m-dialog__panel" ref={panel} tabIndex={-1}>
        <div className="m-dialog__head">
          <h2 className="m-dialog__title" id={`${id}-title`}>{title}</h2>
          {!hideClose && <button className="a-round" type="button" aria-label={closeLabel} data-dialog-close onClick={onClose}><Icon name="close" /></button>}
        </div>
        <div className="m-dialog__body">{children}</div>
        {foot && <div className="m-dialog__foot">{foot}</div>}
      </div>
    </div>,
    document.body
  );
}
