/* =====================================================================
   The booking step bar (round 3 critic: Booking.com and Priceline show
   where you are in the funnel). Three stops on one line, no numbers
   (spec conflict 4: order is the line). Done stops link back when a
   href is given; the current stop carries aria-current="step".
   ===================================================================== */
import { AppLink as Link } from '@/components/AppLink';

export type Step = { label: string; href?: string };

export const FLIGHT_STEPS = ['Flight and fare', 'Travelers', 'Review and pay'];
export const STAY_STEPS = ['Room and rate', 'Guest details', 'Review and pay'];

export function Steps({ steps, current, hrefs = [] }: { steps: string[]; current: number; hrefs?: (string | undefined)[] }) {
  return (
    <nav className="m-steps" aria-label="Booking steps">
      <ol className="m-steps__list">
        {steps.map((label, i) => {
          const state = i < current ? 'is-done' : i === current ? 'is-current' : '';
          const href = i < current ? hrefs[i] : undefined;
          return (
            <li key={label} className={`m-steps__item ${state}`} aria-current={i === current ? 'step' : undefined}>
              <span className="m-steps__dot" aria-hidden="true" />
              {href ? <Link className="m-steps__label" href={href}>{label}</Link> : <span className="m-steps__label">{label}</span>}
              {i < current ? <span className="sr-only">, done</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
