'use client';
/* =====================================================================
   The booking summary (Hipcamp's booking card, spec 2b): radius 16,
   card shadow, 24 padding, title, short lines, every line item, the
   total in 28px Calibre Bold, the offer expiry line, one deep pill.
   Sticky beside the content at 1440; on phones the page passes a
   bottom bar (price left, action right) and the tab bar hides.
   The expiry line counts down from Duffel's expires_at: warn colour
   under 5 minutes, announced once at 5 (copy.md, expiry line).
   ===================================================================== */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';

export function useExpiry(expiresAt?: number) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!expiresAt) return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 5000);
    return () => window.clearInterval(t);
  }, [expiresAt]);
  if (!expiresAt || now === null) return { ready: false, left: Infinity, expired: false };
  const left = expiresAt - now;
  return { ready: true, left, expired: left <= 0 };
}

export function expiryText(left: number): string {
  if (left < 60000) return 'Price valid for less than a minute';
  const m = Math.floor(left / 60000);
  return `Price valid for ${m} more ${m === 1 ? 'minute' : 'minutes'}`;
}

export function ExpiryLine({ expiresAt }: { expiresAt: number }) {
  const { ready, left, expired } = useExpiry(expiresAt);
  const said = useRef(false);
  const [announce, setAnnounce] = useState('');
  useEffect(() => {
    if (ready && !said.current && left <= 5 * 60000 && left > 4 * 60000) { said.current = true; setAnnounce('Your price is valid for 5 more minutes.'); }
  }, [ready, left]);
  /* round 3 (spec B2.6): the hold as a ticking chip, "Fare held for 24:13"; the minutes line stays for screen readers */
  const [tick, setTick] = useState<number | null>(null);
  useEffect(() => {
    setTick(Date.now());
    const t = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (!ready || expired || tick === null) return <span className="sr-only" aria-live="polite">{announce}</span>;
  const secs = Math.max(0, Math.floor((expiresAt - tick) / 1000));
  const mmss = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  return (
    <>
      <p className={`m-summary__hold${left < 5 * 60000 ? ' is-warn' : ''}`}>
        <Icon name="clock" size="s" />
        <span aria-hidden="true">Fare held for <strong className="m-summary__holdTime">{mmss}</strong></span>
        <span className="sr-only">{expiryText(left)}</span>
      </p>
      <span className="sr-only" aria-live="polite">{announce}</span>
    </>
  );
}

type Row = { label: string; value: string };
type Props = {
  title: string; lines: string[]; rows: Row[]; total: string; expiresAt?: number; note?: string;
  action?: ReactNode; change?: string; id?: string; children?: ReactNode;
};

export function Summary({ title, lines, rows, total, expiresAt, note, action, change, id, children }: Props) {
  /* a page shows the summary twice (beside the form, and in the phone disclosure), so each copy gets its own id */
  const auto = useId();
  const hid = `${id || auto}-title`;
  return (
    <section className="m-summary" aria-labelledby={hid}>
      <div className="m-summary__head">
        <h2 className="m-summary__title" id={hid}>{title}</h2>
        {change && <Link className="a-link" href={change} aria-label={`Change ${title.toLowerCase()}`}>Change</Link>}
      </div>
      <ul className="m-summary__lines">
        {lines.map((l, i) => <li key={`${i}-${l}`}>{l}</li>)}
      </ul>
      {children}
      <dl className="m-summary__rows">
        {rows.map((r, i) => (
          <div className="m-summary__row" key={`${i}-${r.label}`}><dt>{r.label}</dt><dd>{r.value}</dd></div>
        ))}
        <div className="m-summary__row -total"><dt>Total</dt><dd>{total}</dd></div>
      </dl>
      {/* revision 2026-11-11, item 24 (client: "clear pricing"): what the total covers, said once under it.
          No "no booking fee" claim: the client has not said so (Chief Officer, 11 Nov) */}
      <p className="m-summary__incl">Includes taxes and fees.</p>
      {note && <p className="m-summary__note">{note}</p>}
      {expiresAt && <ExpiryLine expiresAt={expiresAt} />}
      {action && <div className="m-summary__action">{action}</div>}
    </section>
  );
}

/* phones: the summary folds into a disclosure at the top of a form page, as on checkout (critic round 1) */
export function PhoneSummary({ total, children }: { total: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="o-checkout__phoneSum">
      <button className="o-checkout__sumToggle" type="button" aria-expanded={open} aria-controls="phone-summary" onClick={() => setOpen((o) => !o)}>
        <span>{open ? 'Hide details' : <>Total <strong>{total}</strong>, show details</>}</span><Icon name="chev-down" size="s" />
      </button>
      <div id="phone-summary" hidden={!open}>{children}</div>
    </div>
  );
}

/* phones: the summary as a fixed bar; data-bottom-bar hides the floating tab bar (chrome.css) */
/* stacked: the price over its note on two set lines (Chief Officer, 11 Nov: the hotel bar wrapped "night" onto its own line) */
export function BottomBar({ price, label, action, watch, stacked = false }: { price: string; label: string; action: ReactNode; watch?: string; stacked?: boolean }) {
  /* watch: the form's own submit row; while it is on screen the bar steps aside, so two buttons never show (critic round 1) */
  const [away, setAway] = useState(false);
  useEffect(() => {
    const el = watch ? document.querySelector(watch) : null;
    if (!el) return;
    const io = new IntersectionObserver((e) => setAway(e[0].isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [watch]);
  return (
    <div className={`m-bottomBar${away ? ' is-away' : ''}`} data-bottom-bar>
      <p className={`m-bottomBar__price${stacked ? ' -stacked' : ''}`}><strong>{price}</strong> <span>{label}</span></p>
      {action}
    </div>
  );
}
