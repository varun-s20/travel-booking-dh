/* =====================================================================
   Landfall (working name, a placeholder): the booking step line
   Round 3, Developer B (round3-spec.md B3, B4, B8). Three steps drawn
   as the landfall line (styles: .b-steps). Done steps link back where a
   URL exists; the current step carries aria-current="step".
   Flights: Choose your fare, Travelers, Pay. Stays: Choose your room,
   Guests, Pay.
   ===================================================================== */
import Link from 'next/link';

export type BookingStep = { label: string; href?: string };

export default function Steps({ steps, current }: { steps: BookingStep[]; current: number }) {
  return (
    <ol className="b-steps" aria-label="Booking steps">
      {steps.map((s, i) => {
        if (i < current) return <li key={s.label} className="is-done">{s.href ? <Link prefetch={false} href={s.href}>{s.label}</Link> : <span>{s.label}</span>}</li>;
        if (i === current) return <li key={s.label} className="is-current" aria-current="step"><span>{s.label}</span></li>;
        return <li key={s.label}><span>{s.label}</span></li>;
      })}
    </ol>
  );
}
