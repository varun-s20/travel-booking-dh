/* =====================================================================
   A static map with price pins (choices.md, checkpoint 2b answer 4: no
   new packages): OpenStreetMap's standard tiles, loaded live from the
   tile server with the attribution its policy asks for (nothing is
   downloaded or stored), toned to the palette with a CSS filter. Tiles
   and pins are placed by Web Mercator maths around the centre, so the
   map fills any box without script. The real map provider is a later
   decision (spec 10, question 4).
   ===================================================================== */
import { AppLink as Link } from '@/components/AppLink';

const TILE = 256;
function world(lat: number, lon: number, z: number): [number, number] {
  const n = TILE * 2 ** z;
  const s = Math.sin((lat * Math.PI) / 180);
  return [((lon + 180) / 360) * n, (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n];
}

/* card: round 3 (spec B6.4), the selected pin opens a mini card above it (the pin's link carries the same facts for screen readers) */
export type Pin = { id: string; lat: number; lon: number; label: string; name: string; href?: string; card?: { photo?: string; kicker: string; score: string; line: string } };

type Props = {
  center: [number, number]; zoom: number; pins: Pin[]; active?: string | null; label: string;
  onActive?: (id: string | null) => void; className?: string; span?: [number, number];
  /* the land side's bearing (lib/mock/hotels.ts landBearing): collisions push pins that way */
  toward?: number;
};

/* Pins are 32px pills, about 8.4px a character plus 24px of padding. A greedy pass in screen space moves a pin that
   would overlap one already placed to the nearest free spot (down, up, then sideways), so no price hides another. */
const PIN_H = 32, GAP = 4;
const pinW = (label: string) => Math.round(label.length * 8.4 + 24);
function spread(points: { id: string; x: number; y: number; w: number }[], toward?: number): Map<string, [number, number]> {
  const placed: { x: number; y: number; w: number }[] = [];
  const out = new Map<string, [number, number]>();
  const hits = (x: number, y: number, w: number) => placed.some((p) => Math.abs(p.x - x) < (p.w + w) / 2 + GAP && Math.abs(p.y - y) < PIN_H + GAP);
  const order = [...points].sort((a, b) => a.y - b.y || a.x - b.x);
  for (const pt of order) {
    const step = PIN_H + GAP;
    const tries: [number, number][] = [[0, 0]];
    for (let k = 1; k <= 4; k++) tries.push([0, step * k], [0, -step * k], [(pt.w + GAP) * k * 0.6, 0], [-(pt.w + GAP) * k * 0.6, 0], [(pt.w + GAP) * 0.6 * k, step * k], [-(pt.w + GAP) * 0.6 * k, step * k]);
    /* round 3: on a coastal map, try the moves toward the land side first (smallest first), so a pushed pin never goes out to the water */
    if (toward !== undefined) {
      const ux = Math.sin((toward * Math.PI) / 180), uy = -Math.cos((toward * Math.PI) / 180);
      const rank = ([dx, dy]: [number, number]) => { const len = Math.hypot(dx, dy); return len === 0 ? -1e9 : (dx * ux + dy * uy < -0.1 * len ? 1e6 : 0) + len - 0.5 * (dx * ux + dy * uy); };
      tries.sort((a, b) => rank(a) - rank(b));
    }
    const free = tries.find(([dx, dy]) => !hits(pt.x + dx, pt.y + dy, pt.w)) ?? [0, 0];
    const x = pt.x + free[0], y = pt.y + free[1];
    placed.push({ x, y, w: pt.w });
    out.set(pt.id, [x, y]);
  }
  return out;
}

export function StayMap({ center, zoom, pins, active, label, onActive, className = '', span = [4, 3], toward }: Props) {
  const [cx, cy] = world(center[0], center[1], zoom);
  const spots = spread(pins.map((p) => { const [px, py] = world(p.lat, p.lon, zoom); return { id: p.id, x: Math.round(px - cx), y: Math.round(py - cy), w: pinW(p.label) }; }), toward);
  const tx = Math.floor(cx / TILE), ty = Math.floor(cy / TILE);
  const tiles: { x: number; y: number }[] = [];
  for (let dy = -span[1]; dy <= span[1]; dy++) for (let dx = -span[0]; dx <= span[0]; dx++) tiles.push({ x: tx + dx, y: ty + dy });
  const interactive = pins.some((p) => p.href);
  return (
    <div className={`m-map ${className}`} {...(interactive ? { role: 'group', 'aria-label': label } : { role: 'img', 'aria-label': label })}>
      <div className="m-map__layer">
        <div className="m-map__tiles" aria-hidden="true">
          {tiles.map((t) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${t.x}-${t.y}`} className="m-map__tile" src={`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`} alt="" width={TILE} height={TILE} loading="lazy" decoding="async"
              style={{ left: `${Math.round(t.x * TILE - cx)}px`, top: `${Math.round(t.y * TILE - cy)}px` }} />
          ))}
        </div>
        {pins.map((p) => {
          /* whole pixels, as the tiles (final pass, 11 Nov: tiles at fractional offsets left hairlines in the water) */
          const [sx, sy] = spots.get(p.id) ?? [0, 0];
          const pos = { left: `${sx}px`, top: `${sy}px` };
          const cls = `m-map__pin${active === p.id ? ' is-active' : ''}`;
          const card = active === p.id && p.card ? (
            <span key={`${p.id}-card`} className="m-map__card" style={pos} aria-hidden="true">
              <span className="m-map__cardKicker">{p.card.kicker}</span>
              <strong>{p.name}</strong>
              <span>{p.card.score}</span>
              <span className="m-map__cardPrice">{p.card.line}</span>
            </span>
          ) : null;
          return p.href ? (
            <span key={p.id} className="m-map__pinWrap">{card}<Link className={cls} style={pos} href={p.href} aria-label={`${p.name}, ${p.label} total`}
              onMouseEnter={() => onActive?.(p.id)} onMouseLeave={() => onActive?.(null)} onFocus={() => onActive?.(p.id)} onBlur={() => onActive?.(null)}>
              {p.label}
            </Link></span>
          ) : (
            <span key={p.id} className={`${cls} -mark`} style={pos} aria-hidden="true">{p.label}</span>
          );
        })}
      </div>
      <p className="m-map__credit">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors<span className="sr-only"> (opens in a new tab)</span></a></p>
    </div>
  );
}
