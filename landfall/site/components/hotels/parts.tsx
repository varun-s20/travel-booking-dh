/* =====================================================================
   Landfall (working name, a placeholder), group H: hotel parts
   Shared by hotel results, hotel detail and the guest form:
   - PhotoSwap: one photo at a time with Previous and Next (shown on
     hover and focus at 1025 and up, always below) and a dot line;
   - StayMap: OpenStreetMap tiles toned to the palette (Kasa's map),
     price pins as white pills that turn teal with an ink label;
   - HotelCard: Kasa's row card with the price rule (total first);
   - StayBreakdown: the price breakdown dialog for a room;
   - amenity icons, amenity groups and the "Getting around" lines
     (copy.md, Location).
   Hotels come from Duffel Stays or the simulated catalogue (lib/travel/
   hotels.ts): photos may be https URLs, and a supplier hotel may have no
   photos, no star rating or no check-in times; every part copes.
   Photos are shown as supplied, never graded.
   ===================================================================== */
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { cityById, nightsOf, type Hotel, type Room, type StayAmounts, type StaySearch } from '@/lib/travel/hotels';
import { money, plural } from '@/lib/format';
import type { IconName } from '@/components/chrome/Sprite';
import Icon from '@/components/ui/Icon';
import Photo from '@/components/ui/Photo';
import Dialog from '@/components/ui/Dialog';
import { Button, ButtonLink } from '@/components/ui/Button';
import { requestSearch } from '@/lib/client';

const AMENITY_ICON: Record<string, IconName> = {
  'Free wifi': 'wifi', 'Breakfast': 'coffee', 'Breakfast available': 'coffee', 'Roof terrace': 'glass', 'Air conditioning': 'snow',
  'Elevator': 'access', '24-hour front desk': 'clock', 'Luggage storage': 'bag', 'Non-smoking rooms': 'check', 'Courtyard': 'star',
  'Daily housekeeping': 'bed', 'Hairdryer': 'tick', 'Safe in room': 'lock', 'Gym': 'gym', 'Bar': 'glass', 'Rooftop bar': 'glass',
  'Garden': 'star', 'Shared kitchen': 'coffee', 'Kitchen': 'coffee', 'Washing machine': 'change', 'Laundry': 'change',
  'Public bath': 'spa', 'Pool': 'pool', 'Parking': 'parking'
};
/* round 3: the catalogue's amenity names fall back to a glyph by their words */
const AMENITY_WORDS: [RegExp, IconName][] = [
  [/wifi|internet|desk|workspace/i, 'wifi'], [/pool/i, 'pool'], [/parking|garage|charging/i, 'parking'], [/gym|fitness/i, 'gym'],
  [/spa|sauna|bath|massage|steam|onsen|tub/i, 'spa'], [/breakfast|coffee|kettle|kitchen|restaurant|bakery|minibar|fridge|room service/i, 'coffee'],
  [/bar|terrace|wine|lounge|rooftop/i, 'glass'], [/air con|heating|fan/i, 'snow'], [/pet|dog/i, 'paw'], [/access|elevator|lift|step-free|wheelchair/i, 'access'],
  [/24|desk|reception|concierge|check-in/i, 'clock'], [/luggage|storage/i, 'bag'], [/safe|lock|key/i, 'lock'], [/laundry|washing|ironing|dry/i, 'change'],
  [/bed|cot|crib|linen|housekeeping|towel/i, 'bed'], [/shuttle|transfer|airport|bike|car/i, 'map'], [/garden|beach|view|balcony|courtyard/i, 'star'], [/child|family|baby|kids/i, 'baby']
];
export const amenityIcon = (a: string): IconName => AMENITY_ICON[a] ?? AMENITY_WORDS.find(([re]) => re.test(a))?.[1] ?? 'check';

/* "All amenities" groups: the demo catalogue's own names first (items), then the words a
   supplier's amenity lines use (re); anything else goes under "More" */
const AMENITY_GROUPS: { group: string; items: string[]; re: RegExp }[] = [
  { group: 'Internet and work', items: ['Free wifi', 'Work desk', 'Coworking space', 'Meeting rooms'], re: /wi-?fi|internet|desk|cowork|meeting|business/i },
  { group: 'Food and drink', items: ['Breakfast available', 'Restaurant', 'Bar', 'Rooftop bar', 'Room service', 'Shared kitchen', 'Kitchen', 'Coffee machine', 'Kettle', 'Minibar'], re: /breakfast|restaurant|\bbar\b|room service|kitchen|coffee|kettle|minibar|snack|dining/i },
  { group: 'Wellness', items: ['Gym', 'Spa', 'Sauna', 'Hot tub', 'Public bath', 'Indoor pool', 'Outdoor pool', 'Plunge pool', 'Massage treatments'], re: /gym|fitness|\bspa\b|sauna|hot tub|bath|pool|massage|steam|wellness/i },
  { group: 'Outdoors', items: ['Roof terrace', 'Terrace', 'Garden', 'Courtyard', 'Balcony', 'Beach access'], re: /terrace|garden|courtyard|balcony|beach/i },
  { group: 'In the room', items: ['Air conditioning', 'Heating', 'Hairdryer', 'Safe in room', 'Flat-screen TV', 'Blackout curtains', 'Soundproofed rooms', 'Bathtub', 'Rain shower', 'Bathrobes and slippers', 'Iron and ironing board', 'Washing machine'], re: /air con|heating|hairdryer|safe|\btv\b|television|curtain|soundproof|bathtub|shower|bathrobe|iron|washing/i },
  { group: 'Services', items: ['24-hour front desk', 'Concierge', 'Luggage storage', 'Daily housekeeping', 'Laundry', 'Self check-in', 'Express check-in and check-out', 'Tour desk', 'Bicycle rental', 'Airport shuttle (paid)'], re: /front desk|24|reception|concierge|luggage|housekeeping|laundry|check-in|tour|bicycle|shuttle|transfer|cash machine|atm|lounge/i },
  { group: 'Building and access', items: ['Elevator', 'Step-free entrance', 'Accessible rooms', 'Non-smoking rooms'], re: /elevator|\blift\b|step-free|accessib|mobility|wheelchair|non-smoking/i },
  { group: 'Family and pets', items: ['Cots available', 'Family rooms', 'Kids’ club', "Kids' club", 'Pets allowed'], re: /\bcot|crib|family|kids|child|\bpets?\b/i },
  { group: 'Parking', items: ['Parking on site (paid)', 'Free parking', 'Electric vehicle charging'], re: /parking|charging|garage/i }
];
export function amenityGroups(list: string[]): { group: string; items: string[] }[] {
  const out = AMENITY_GROUPS.map((g) => ({ group: g.group, items: [] as string[] }));
  const more: string[] = [];
  for (const a of list) {
    const i = AMENITY_GROUPS.findIndex((g) => g.items.includes(a));
    const j = i >= 0 ? i : AMENITY_GROUPS.findIndex((g) => g.re.test(a));
    if (j >= 0) out[j].items.push(a); else more.push(a);
  }
  const groups = out.filter((g) => g.items.length);
  return more.length ? [...groups, { group: 'More', items: more }] : groups;
}

/* copy.md, Location: built from each hotel's own description; no fact, no H3 */
const GETTING_AROUND: Record<string, string> = {
  'casa-lanterna': 'The Baixa and the riverfront are about ten minutes’ walk downhill, and the 28 tram stops at the end of the street. The lane outside has steps, so ask the hotel about step-free arrival if you need it.',
  'cais-verde-hotel': 'Two minutes’ walk from the ferries and the train to the coast.',
  'ribeira-lofts': 'A short walk from the river and the tram.',
  'albergo-tre-finestre': 'A ten-minute walk from the Colosseum.'
};
export const gettingAround = (id: string) => GETTING_AROUND[id];

export const cityName = (id: string) => cityById(id)?.name ?? id;
export const starLine = (h: Hotel) => [h.area, cityName(h.city), h.stars ? `${h.stars}-star ${(h.type ?? 'hotel').toLowerCase()}` : h.type].filter(Boolean).join(', ');
export const hotelHref = (id: string, s: StaySearch | null, q?: string) => `/hotels/${id}${s ? `?${q}` : ''}`;
export const nightsWord = (s: StaySearch) => plural(nightsOf(s), 'night', 'nights');

/* ---- one photo at a time ---- */
export function PhotoSwap({ photos, label, sizes, className, priority }: { photos: { name: string; alt: string }[]; label: string; sizes: string; className?: string; priority?: boolean }) {
  const [i, setI] = useState(0);
  const n = photos.length;
  if (!n) return null;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const p = photos[i];
  return (
    <div className={['h-swap', className || ''].join(' ')} role="group" aria-roledescription="carousel" aria-label={label}>
      <Photo key={p.name} name={p.name} alt={p.alt} sizes={sizes} grade={false} priority={priority && i === 0} className="h-swap__photo" />
      {n > 1 && <>
        <button type="button" className="h-swap__btn -prev" aria-label="Previous photo" onClick={() => go(-1)}><Icon name="chev-l" /></button>
        <button type="button" className="h-swap__btn -next" aria-label="Next photo" onClick={() => go(1)}><Icon name="chev-r" /></button>
        <span className="h-swap__dots" aria-hidden="true">{photos.map((x, k) => <i key={x.name} className={k === i ? 'is-on' : ''} />)}</span>
      </>}
    </div>
  );
}
/* final pass (the image rule): a hotel leads with its first outside photo that shows the water, else its first outside photo */
export function leadIndex(h: Hotel): number {
  const view = h.photos.findIndex((p) => p.cat === 'Outside' && /river|water|view|harbou?r|canal|sea|bay/i.test(p.caption));
  return view >= 0 ? view : Math.max(0, h.photos.findIndex((p) => p.cat === 'Outside'));
}
export const hotelPhotos = (h: Hotel) => {
  if (!h.photos.length) return [];
  const lead = leadIndex(h);
  return [lead, ...h.photos.map((_, k) => k).filter((k) => k !== lead)].map((k, i) => ({ name: h.photos[k].name, alt: `${h.name}, photo ${i + 1} of ${h.photos.length}` }));
};
export const roomPhotos = (h: Hotel, r: Room) => r.photos.map((name) => ({ name, alt: `${r.name} at ${h.name}` }));

/* ---- the map ---- */
const TILE = 256;
function world(lat: number, lon: number, z: number): [number, number] {
  const s = TILE * 2 ** z, r = (lat * Math.PI) / 180;
  return [((lon + 180) / 360) * s, ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * s];
}
export type Pin = { id: string; lat: number; lon: number; label: string; name: string; href?: string };

/* round 3 fix: the map fits the stays' own bounding box (fractional zoom, padded
   for the pin pills), then pins that would still collide merge into a navy
   count pin; pressing it refits the map to its stays, "Show all stays" goes back */
const pinWidth = (label: string) => 26 + label.length * 8.6;
type Mark = { pins: Pin[]; x: number; y: number; w: number; edge?: 'chev-l' | 'chev-r' | 'chev-u' | 'chev-d' };
export function StayMap({ pins, centre, active, onActive, alt, className, zoom, padBottom = 0 }: { pins: Pin[]; centre: [number, number]; active?: string | null; onActive?: (id: string | null) => void; alt: string; className?: string; zoom?: number; padBottom?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<[number, number]>([0, 0]);
  const [focusRaw, setFocus] = useState<{ key: string; ids: string[] } | null>(null);
  useEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(() => setSize([el.clientWidth, el.clientHeight]));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [w, h] = size;
  /* the chip in the bottom corner only crowds a narrow map */
  if (w >= 640) padBottom = 0;
  const key = pins.map((p) => p.id).join(',');
  const focus = focusRaw && focusRaw.key === key ? focusRaw.ids : null;
  /* fit to the core of the list: a stay far out of town (Belém, say) waits at the map's edge with an arrow */
  const core = (() => {
    if (focus || pins.length < 4) return pins;
    const xy = pins.map((p) => world(p.lat, p.lon, 0));
    const med = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];
    const mx = med(xy.map((q) => q[0])), my = med(xy.map((q) => q[1]));
    const d = xy.map((q) => Math.hypot(q[0] - mx, q[1] - my));
    const lim = Math.max(3 * med(d), 1e-6);
    const keep = pins.filter((_, i) => d[i] <= lim);
    /* stays in several cities (a type link): the whole set, the world if need be */
    if (Math.max(...xy.map((q) => q[0])) - Math.min(...xy.map((q) => q[0])) > 1) return pins;
    return keep.length >= pins.length * 0.6 ? keep : pins;
  })();
  const fitTo = focus ? pins.filter((p) => focus.includes(p.id)) : core;
  const pts: { lat: number; lon: number; label: string }[] = fitTo.length ? fitTo : [{ lat: centre[0], lon: centre[1], label: '' }];
  const MAXZ = 16;
  let z = zoom ?? 14;
  if (!zoom && w && h) {
    const padX = Math.min(w / 3, Math.max(...pts.map((p) => pinWidth(p.label))) / 2 + 14), padY = Math.min(h / 3, focus ? 56 : 30);
    const at0 = pts.map((p) => world(p.lat, p.lon, 0));
    const dx = Math.max(...at0.map((x) => x[0])) - Math.min(...at0.map((x) => x[0]));
    const dy = Math.max(...at0.map((x) => x[1])) - Math.min(...at0.map((x) => x[1]));
    const fx = dx > 0 ? Math.log2((w - 2 * padX) / dx) : MAXZ, fy = dy > 0 ? Math.log2((h - 2 * padY - padBottom) / dy) : MAXZ;
    z = Math.max(0, Math.min(pts.length === 1 ? 15 : MAXZ, fx, fy));
  }
  /* tiles from the next zoom level up, drawn at or below their own size (never upscaled) */
  const zi = zoom ?? Math.max(0, Math.ceil(z - 1e-6));
  const scale = 2 ** (z - zi);
  const ws = pts.map((p) => world(p.lat, p.lon, z));
  const cx = (Math.max(...ws.map((x) => x[0])) + Math.min(...ws.map((x) => x[0]))) / 2;
  const cy = (Math.max(...ws.map((x) => x[1])) + Math.min(...ws.map((x) => x[1]))) / 2 + (zoom ? 0 : padBottom / 2);
  const T = TILE * scale, n = 2 ** zi;
  const tiles: { x: number; y: number; key: string; left: number; top: number }[] = [];
  if (w && h) {
    const x0 = Math.floor((cx - w / 2) / T), x1 = Math.floor((cx + w / 2) / T);
    const y0 = Math.max(0, Math.floor((cy - h / 2) / T)), y1 = Math.min(n - 1, Math.floor((cy + h / 2) / T));
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) tiles.push({ x: ((x % n) + n) % n, y, key: `${zi}-${x}-${y}`, left: x * T - cx + w / 2, top: y * T - cy + h / 2 });
  }
  /* pins on screen, merged while their pills would overlap */
  let marks: Mark[] = [];
  if (w > 0) {
    const sep = (a: Mark, b: Mark) => Math.abs(a.x - b.x) < (a.w + b.w) / 2 + 6 && Math.abs(a.y - b.y) < 38;
    const placed: Mark[] = pins.flatMap((p) => {
      const [px, py] = world(p.lat, p.lon, z), pw = pinWidth(p.label);
      const x = px - cx + w / 2, y = py - cy + h / 2;
      /* zoomed into a group: the stays outside the frame are left out until "Show all stays" */
      if (focus && (x < 0 || x > w || y < 0 || y > h)) return [];
      const cxm = Math.min(Math.max(x, pw / 2 + 6), w - pw / 2 - 6), cym = y < 18 ? 18 : y > h - 22 ? h - 40 : y;
      const edge = Math.abs(cxm - x) > 2 || Math.abs(cym - y) > 2 ? (Math.abs(cxm - x) >= Math.abs(cym - y) ? (x < cxm ? 'chev-l' : 'chev-r') : (y < cym ? 'chev-u' : 'chev-d')) as Mark['edge'] : undefined;
      return [{ pins: [p], x: cxm, y: cym, w: pw + (edge ? 18 : 0), edge }];
    });
    if (z >= MAXZ - 0.01 || zoom) {
      /* already as close as the map goes: stack the pins that still touch */
      for (const m of placed) { let k = 0; while (k < 6 && marks.some((o) => sep(o, m))) { m.y += 38; k++; } marks.push(m); }
    } else {
      marks = placed.filter((m) => !m.edge);
      /* first nudge touching pins apart a little (at most 36px from their place); group only what still touches */
      const home = marks.map((m) => [m.x, m.y]);
      for (let it = 0, moved = true; moved && it < 40; it++) {
        moved = false;
        for (let i = 0; i < marks.length; i++) for (let j = i + 1; j < marks.length; j++) {
          const a = marks[i], b = marks[j];
          if (!sep(a, b)) continue;
          const ox = (a.w + b.w) / 2 + 6 - Math.abs(a.x - b.x), oy = 38 - Math.abs(a.y - b.y);
          if (ox <= oy) { const d = ox / 2 + .5, g = a.x <= b.x ? -1 : 1; a.x += g * d; b.x -= g * d; }
          else { const d = oy / 2 + .5, g = a.y <= b.y ? -1 : 1; a.y += g * d; b.y -= g * d; }
          moved = true;
        }
        marks.forEach((m, k) => {
          m.x = Math.min(Math.max(m.x, home[k][0] - 36, m.w / 2 + 6), home[k][0] + 36, w - m.w / 2 - 6);
          m.y = Math.min(Math.max(m.y, home[k][1] - 24, 18), home[k][1] + 24, h - 22);
        });
      }
      for (let changed = true, guard = 0; changed && guard < 12; guard++) {
        changed = false;
        outer: for (let i = 0; i < marks.length; i++) for (let j = i + 1; j < marks.length; j++) {
          if (!sep(marks[i], marks[j])) continue;
          const a = marks[i], b = marks[j], all = [...a.pins, ...b.pins];
          const m: Mark = { pins: all, x: (a.x * a.pins.length + b.x * b.pins.length) / all.length, y: (a.y * a.pins.length + b.y * b.pins.length) / all.length, w: pinWidth(`${all.length} stays`) };
          marks = [...marks.slice(0, i), m, ...marks.slice(i + 1, j), ...marks.slice(j + 1)];
          changed = true;
          break outer;
        }
      }
      /* a stay beyond the frame never joins a group: it slides along its edge until it is clear */
      for (const e of placed.filter((m) => m.edge)) {
        const along = e.edge === 'chev-u' || e.edge === 'chev-d' ? 'x' : 'y';
        const base = e[along];
        for (let k = 1; k < 10 && marks.some((o) => sep(o, e)); k++) {
          e[along] = base + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (along === 'x' ? 40 : 38);
          e.x = Math.min(Math.max(e.x, e.w / 2 + 6), w - e.w / 2 - 6);
          e.y = Math.min(Math.max(e.y, 18), h - 40);
        }
        marks.push(e);
      }
    }
  }
  return (
    <div className={['h-map', className || ''].join(' ')} ref={box}>
      <div className="h-map__tiles" role="img" aria-label={alt}>
        {tiles.map((t) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img key={t.key} src={`https://tile.openstreetmap.org/${zi}/${t.x}/${t.y}.png`} alt="" width={TILE} height={TILE} style={{ left: t.left, top: t.top, width: T, height: T }} loading="lazy" decoding="async" referrerPolicy="strict-origin-when-cross-origin" />
        ))}
      </div>
      {marks.map((m) => {
        const style = { left: m.x, top: m.y };
        if (m.pins.length > 1) {
          const ids = m.pins.map((p) => p.id);
          const on = !!active && ids.includes(active);
          return (
            <button key={ids.join('+')} type="button" className={['h-pin -cluster', on ? 'is-active' : ''].join(' ')} style={style}
              aria-label={`${m.pins.length} stays close together: ${m.pins.map((p) => p.name).join('; ')}. Zoom in`} onClick={() => setFocus({ key, ids })}>
              <span className="t-num">{m.pins.length} stays</span>
            </button>
          );
        }
        const p = m.pins[0];
        const cls = ['h-pin', active === p.id ? 'is-active' : '', m.edge ? '-edge' : ''].join(' ');
        const inner = <>{m.edge === 'chev-l' || m.edge === 'chev-u' ? <Icon name={m.edge} /> : null}<span>{p.label}</span>{m.edge === 'chev-r' || m.edge === 'chev-d' ? <Icon name={m.edge} /> : null}</>;
        return p.href
          ? <Link key={p.id} href={p.href} prefetch={false} className={cls} style={style} aria-label={p.name} onMouseEnter={() => onActive?.(p.id)} onMouseLeave={() => onActive?.(null)} onFocus={() => onActive?.(p.id)} onBlur={() => onActive?.(null)}>{inner}</Link>
          : <span key={p.id} className={cls} style={style} aria-hidden="true">{inner}</span>;
      })}
      {focus && <button type="button" className="a-chip h-map__all" onClick={() => setFocus(null)}><Icon name="expand" />Show all stays</button>}
      <p className="h-map__credit"><a href="https://www.openstreetmap.org/copyright" className="a-link">Map data © OpenStreetMap contributors</a></p>
    </div>
  );
}

/* ---- result card (Kasa row card): also "Other hotels in Lisbon" ---- */
export function HotelCard({ hotel, total, nightly, search, query, freeCancel, onHover, active, headingLevel = 'h2' }: {
  hotel: Hotel; total: number | null; nightly: number | null; search: StaySearch | null; query: string; freeCancel?: string | null;
  onHover?: (id: string | null) => void; active?: boolean; headingLevel?: 'h2' | 'h3';
}) {
  const H = headingLevel;
  const href = `/hotels/${hotel.id}${query ? `?${query}` : ''}`;
  return (
    <article className={['m-card h-card', active ? 'is-active' : ''].join(' ')} onMouseEnter={() => onHover?.(hotel.id)} onMouseLeave={() => onHover?.(null)}>
      <PhotoSwap photos={hotelPhotos(hotel)} label={`Photos of ${hotel.name}`} sizes="(min-width: 1025px) 252px, (min-width: 641px) 40vw, 100vw" className="h-card__photo" />
      <div className="h-card__body">
        <H className="h-card__name"><Link prefetch={false} href={href} className="h-card__link">{hotel.name}</Link></H>
        <p className="h-card__area">{starLine(hotel)}</p>
        <ul className="h-card__amen" aria-label="Amenities">
          {hotel.cardAmenities.map((a) => <li key={a}><Icon name={amenityIcon(a)} />{a}</li>)}
        </ul>
        {freeCancel && <p className="h-card__free"><Icon name="tick" />{freeCancel}</p>}
        <div className="h-card__foot">
          {total !== null && nightly !== null && search
            ? <CardPrice total={total} nightly={nightly} />
            : null}
          {total !== null
            ? <ButtonLink href={href} className="h-card__go" aria-label={`View rooms at ${hotel.name}`}>View rooms</ButtonLink>
            : <Button onClick={() => requestSearch('hotels', 'dates')} aria-label={`Add dates to see prices for ${hotel.name}`}>Add dates for prices</Button>}
        </div>
      </div>
    </article>
  );
}
/* the price rule in whole dollars, as copy.md writes cards: "$744 total", "$186 per night", "taxes and fees included" */
export function CardPrice({ total, nightly, className }: { total: number; nightly: number; className?: string }) {
  return (
    <div className={['m-price -sm', className || ''].join(' ')}>
      <div className="m-price__line"><span className="m-price__total">{dollars0(total)} total</span></div>
      <span className="m-price__unit">{dollars0(nightly)} per night</span>
      <span className="m-price__note">taxes and fees included</span>
    </div>
  );
}
/* whole dollars on cards, as copy.md writes them ("$744 total", "$186 per night") */
export const dollars0 = (c: number) => `$${Math.round(c / 100).toLocaleString('en-US')}`;

/* ---- price breakdown for a room ---- */
export function StayBreakdown({ open, onClose, amounts, search }: { open: boolean; onClose: () => void; amounts: StayAmounts; search: StaySearch }) {
  return (
    <Dialog open={open} onClose={onClose} title="Price breakdown" sheet closeLabel="Close">
      <dl className="h-breakdown">
        <div><dt>Room, {nightsWord(search)}</dt><dd className="t-num">{money(amounts.room)}</dd></div>
        <div><dt>Taxes and fees</dt><dd className="t-num">{money(amounts.tax)}</dd></div>
        <div className="-total"><dt>Total</dt><dd className="t-num">{money(amounts.total)}</dd></div>
      </dl>
      <p className="t-small t-muted h-breakdown__note">Tourist tax, if the city charges one, is paid at the hotel.</p>
    </Dialog>
  );
}

/* a hairline-topped section with its H2 */
export function Section({ id, title, children, className }: { id?: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={['h-section', className || ''].join(' ')} aria-labelledby={id ? `${id}-h` : undefined}>
      <h2 id={id ? `${id}-h` : undefined} className="t-display t-h2">{title}</h2>
      {children}
    </section>
  );
}
