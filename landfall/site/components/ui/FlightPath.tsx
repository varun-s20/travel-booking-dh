/* =====================================================================
   Landfall: a plane flying along a dotted route
   - loop: the flight search's wait (7 to 15 seconds against Duffel) and
     checkout while the airline confirms. It says "working" without a
     spinner.
   - once: rare moments (an empty My bookings, a confirmed booking). The
     plane crosses once and rests at the far end: it has landed.
   CSS only, so it stays smooth while results load (runs off the main
   thread): the plane follows the arc with offset-path, turning with it
   (offset-rotate auto; the icon faces right). The dotted line is static.
   Reduced motion: no flight, the plane rests on the route.
   Decorative: the text next to it says what is happening.
   ===================================================================== */
import Icon from '@/components/ui/Icon';

type Props = { from?: string; to?: string; mode?: 'loop' | 'once'; className?: string };

export default function FlightPath({ from, to, mode = 'loop', className = '' }: Props) {
  return (
    <div className={`a-route -${mode}${className ? ` ${className}` : ''}`} aria-hidden="true">
      {from && <span className="a-route__code t-num">{from}</span>}
      <span className="a-route__track">
        <svg className="a-route__svg" viewBox="0 0 180 40" width="180" height="40" focusable="false">
          {/* the same arc as the plane's offset-path in global.css (.a-route__plane) */}
          <path className="a-route__line" d="M 6 34 Q 90 -10 174 34" />
          <circle className="a-route__end" cx="6" cy="34" r="3" />
          <circle className="a-route__end -to" cx="174" cy="34" r="3" />
        </svg>
        <span className="a-route__plane"><Icon name="plane" /></span>
      </span>
      {to && <span className="a-route__code t-num">{to}</span>}
    </div>
  );
}
