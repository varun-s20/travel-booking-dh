/* =====================================================================
   Landfall (working name, a placeholder): notice panel
   Inline banners: fare changed (warn, or success when the fare went
   down), payment declined (error), info (mist). focusOnMount moves focus
   to it (payment failed: "focus moved to the panel"). Errors are alerts;
   the rest are polite status regions unless role is set.
   ===================================================================== */
'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import Icon from './Icon';

type Tone = 'info' | 'warn' | 'error' | 'success';
const ICON = { info: 'info', warn: 'alert', error: 'error', success: 'tick' } as const;

export default function Notice({ tone = 'info', title, children, actions, focusOnMount, className, role }: { tone?: Tone; title?: ReactNode; children?: ReactNode; actions?: ReactNode; focusOnMount?: boolean; className?: string; role?: 'alert' | 'status' }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (focusOnMount) ref.current?.focus(); }, [focusOnMount]);
  return (
    <div ref={ref} className={['m-notice', tone !== 'info' ? `-${tone}` : '', className || ''].filter(Boolean).join(' ')} role={role || (tone === 'error' ? 'alert' : 'status')} tabIndex={focusOnMount ? -1 : undefined}>
      <span className="m-notice__icon"><Icon name={ICON[tone]} /></span>
      {title && <p className="m-notice__title">{title}</p>}
      {children && <div className="m-notice__body">{children}</div>}
      {actions && <div className="m-notice__actions">{actions}</div>}
    </div>
  );
}
