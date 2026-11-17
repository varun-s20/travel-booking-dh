/* =====================================================================
   State panels (spec 2b, flights: no results, fare changed, expired):
   inline in the list column, radius 16, 24 padding, a 20px Calibre Bold
   line, one sentence, one action. Cream for quiet states, the warn and
   error tints where the state needs them. The heading takes focus when
   a panel replaces what the visitor was looking at.
   ===================================================================== */
import { forwardRef, type ReactNode } from 'react';
import { Icon } from '@/components/Icon';

type Props = { tone?: 'cream' | 'warn' | 'error' | 'success'; title: ReactNode; children?: ReactNode; actions?: ReactNode; icon?: string; className?: string; id?: string; headingLevel?: 2 | 3 };

export const Notice = forwardRef<HTMLDivElement, Props>(function Notice({ tone = 'cream', title, children, actions, icon, className = '', id, headingLevel = 2 }, ref) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className={`m-notice -${tone} ${className}`} ref={ref} tabIndex={-1} id={id}>
      {icon && <span className="m-notice__icon" aria-hidden="true"><Icon name={icon} /></span>}
      <div className="m-notice__text">
        <H className="m-notice__title">{title}</H>
        {children && <div className="m-notice__body">{children}</div>}
        {actions && <div className="m-notice__actions">{actions}</div>}
      </div>
    </div>
  );
});

/* Status chips (copy.md, dashboard): Confirmed; Pending; Changed by airline; Canceled; Completed */
const STATUS: Record<string, { label: string; tone: string; icon: string }> = {
  confirmed: { label: 'Confirmed', tone: 'success', icon: 'tick' },
  pending: { label: 'Pending', tone: 'warn', icon: 'clock' },
  changed: { label: 'Changed by airline', tone: 'warn', icon: 'alert' },
  canceled: { label: 'Canceled', tone: 'muted', icon: 'close' },
  completed: { label: 'Completed', tone: 'muted', icon: 'tick' }
};
export function StatusChip({ status }: { status: string }) {
  const s = STATUS[status] || STATUS.confirmed;
  return <span className={`a-status -${s.tone}`}><Icon name={s.icon} size="s" />{s.label}</span>;
}
