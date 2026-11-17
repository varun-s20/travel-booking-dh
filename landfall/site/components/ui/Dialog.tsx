/* =====================================================================
   Landfall (working name, a placeholder): dialogs and sheets
   Kasa's dialog: centred, radius 16, ink 40% backdrop with blur, a
   Newsreader title and a 44px round close. sheet: full-screen below
   1025 with a fixed footer (filters, sort, price breakdown at 390).
   The conventions' dialog pattern: rendered into <body>, the app wrapper
   goes inert, focus moves to the close button (or initialFocus), Tab
   stays inside, Escape and the backdrop close it, focus returns to the
   element that opened it.
   Usage:
     const [open, setOpen] = useState(false);
     <Dialog open={open} onClose={() => setOpen(false)} title="Price breakdown" sheet
       footer={<Button onClick={...}>Show 86 flights</Button>}>...</Dialog>
   ===================================================================== */
'use client';
import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { prefersReducedMotion, setAppInert, trapTab } from '@/lib/client';
import Icon from './Icon';

type Props = {
  open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode;
  sheet?: boolean; wide?: boolean; initialFocus?: RefObject<HTMLElement | null>; closeLabel?: string; dismissable?: boolean;
};

export default function Dialog({ open, onClose, title, children, footer, sheet, wide, initialFocus, closeLabel = 'Close', dismissable = true }: Props) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (open) {
      opener.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      setAppInert(true);
      document.body.classList.add('is-locked');
      return;
    }
    if (!mounted) return;
    setShown(false);
    setAppInert(false);
    document.body.classList.remove('is-locked');
    const back = opener.current;
    const t = window.setTimeout(() => { setMounted(false); if (back && document.contains(back)) back.focus(); }, prefersReducedMotion() ? 0 : 220);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* once the portal is in the page: fade it in and move focus inside (refs exist only after this commit) */
  useEffect(() => {
    if (!mounted || !open) return;
    const raf = requestAnimationFrame(() => {
      setShown(true);
      (initialFocus?.current || closeRef.current)?.focus();
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, open]);

  useEffect(() => () => { setAppInert(false); document.body.classList.remove('is-locked'); }, []);

  if (!mounted) return null;
  const cls = ['m-dialog', sheet ? '-sheet' : '', wide ? '-wide' : '', shown ? 'is-open' : ''].filter(Boolean).join(' ');
  return createPortal(
    <div className={cls} onKeyDown={(e) => { if (e.key === 'Escape' && dismissable) { e.stopPropagation(); onClose(); } else trapTab(e); }}>
      <div className="m-dialog__backdrop" onClick={dismissable ? onClose : undefined} aria-hidden="true" />
      <div className="m-dialog__panel" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="m-dialog__head">
          <h2 className="m-dialog__title" id={titleId}>{title}</h2>
          {dismissable && <button ref={closeRef} type="button" className="a-roundx" onClick={onClose} aria-label={closeLabel}><Icon name="close" /></button>}
        </div>
        <div className="m-dialog__body">{children}</div>
        {footer && <div className="m-dialog__foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
