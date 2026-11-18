/* =====================================================================
   Landfall: the test-data notice on results pages
   While the site runs on Duffel's test mode or the demo catalogue, the
   results must never read as real: Duffel's test system invents flights
   for any route (a "nonstop" from Lucknow to Cancún, even under real
   airline names). Gone once the site runs on a live Duffel token.
   NEXT_PUBLIC_SUPPLY is fixed at build time (next.config.ts), so server
   and browser render the same text.
   ===================================================================== */
import Icon from '@/components/ui/Icon';

const SUPPLY = process.env.NEXT_PUBLIC_SUPPLY;
const WHAT = {
  flights: 'these flights are sample data, not real schedules or prices',
  hotels: 'these stays are sample data, not real availability or prices'
} as const;

export default function SupplyNote({ kind }: { kind: keyof typeof WHAT }) {
  if (SUPPLY === 'duffel-live') return null;
  const mode = SUPPLY === 'duffel-test' ? 'Test mode' : 'Demo mode';
  return (
    <p className="a-supplynote">
      <Icon name="info" size="sm" />
      <span><strong>{mode}:</strong> {WHAT[kind]}. Nothing you book here is real or charged.</span>
    </p>
  );
}
