/* =====================================================================
   Landfall (working name, a placeholder): one photo
   Reads lib/images.manifest.json (written by tools/images.py) for the
   real width, height and WebP derivatives, so sizes are never typed by
   hand and nothing is offered above its own resolution.
   - name: "<topic>/<file name without width>", e.g. "promo/harbour-cafe-tables"
   - sizes: how wide the slot renders at each breakpoint (required)
   - alt: "" when decorative
   - priority: the LCP image (eager, fetchpriority high); everything else is lazy
   - fx, fy: focal point in % for object-position when the slot crops it
   - grade: the palette's photo grade (studio and stock photos only, never Duffel's)
   - box: wrap in .a-photo (fills its box); pass a className for the slot
   ===================================================================== */
import manifest from '@/lib/images.manifest.json';

type Entry = { webp: [number, number][]; fallback: { src: string; w: number; h: number } | null };
const M = manifest as unknown as Record<string, Entry>;

/* supplier photos (Duffel Stays) arrive as https URLs instead of manifest keys */
export const isRemote = (name: string) => /^https:\/\//.test(name);

export function photoSrcSet(name: string): string {
  if (isRemote(name)) return '';
  const e = M[name];
  if (!e) return '';
  return e.webp.map(([w]) => `/images/${name}-${w}.webp ${w}w`).join(', ');
}

export function hasPhoto(name: string): boolean { return isRemote(name) || !!M[name]?.fallback; }

type Props = {
  name: string; sizes: string; alt: string; priority?: boolean; fx?: number; fy?: number; grade?: boolean;
  box?: boolean; className?: string; hidden?: boolean;
};

export default function Photo({ name, sizes, alt, priority, fx, fy, grade = true, box = true, className, hidden }: Props) {
  if (isRemote(name)) {
    /* never graded: supplier photos are shown as the hotel supplied them */
    const remote = <img src={name} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : undefined} referrerPolicy="no-referrer" aria-hidden={hidden || undefined} />;
    if (!box) return remote;
    const st = fx !== undefined || fy !== undefined ? ({ ['--fx' as string]: `${fx ?? 50}%`, ['--fy' as string]: `${fy ?? 50}%` } as React.CSSProperties) : undefined;
    return <div className={['a-photo', className || ''].filter(Boolean).join(' ')} style={st}>{remote}</div>;
  }
  const e = M[name];
  if (!e || !e.fallback) throw new Error(`Photo: ${name} is not in lib/images.manifest.json (run python -I tools/images.py)`);
  const style = fx !== undefined || fy !== undefined ? ({ ['--fx' as string]: `${fx ?? 50}%`, ['--fy' as string]: `${fy ?? 50}%` } as React.CSSProperties) : undefined;
  const img = (
    <picture>
      <source type="image/webp" srcSet={photoSrcSet(name)} sizes={sizes} />
      <img src={e.fallback.src} width={e.fallback.w} height={e.fallback.h} alt={alt}
        loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : undefined} aria-hidden={hidden || undefined} />
    </picture>
  );
  if (!box) return img;
  return <div className={['a-photo', grade ? '-grade' : '', className || ''].filter(Boolean).join(' ')} style={style}>{img}</div>;
}
