/* =====================================================================
   travel-booking (working name Overwing, a placeholder): Photo
   One <picture> per image, built from lib/images.manifest.json (written
   by tools/images.mjs): WebP srcset with real widths, a JPEG fallback
   with its real width and height, never typed by hand. The caller
   gives `sizes` to match its slot at each breakpoint.
   Studio and stock media wear the palette grade (spec 2c); pass
   graded={false} for Duffel's own media.
   ===================================================================== */
import manifest from '@/lib/images.manifest.json';

type Entry = {
  width: number; height: number; position: number[];
  webp: { src: string; width: number; height: number }[];
  fallback: { src: string; width: number; height: number };
};

type Props = {
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  graded?: boolean;
};

export function photoSrcSet(name: string): string {
  const m = (manifest as unknown as Record<string, Entry>)[name];
  return m.webp.map((d) => `${d.src} ${d.width}w`).join(', ');
}

export function Photo({ name, alt, sizes, className = '', priority = false, graded = true }: Props) {
  const m = (manifest as unknown as Record<string, Entry>)[name];
  if (!m) throw new Error(`Photo: "${name}" is not in lib/images.manifest.json; add it to tools/images.config.json and run npm run images`);
  const cls = [className, graded ? 'a-graded' : ''].filter(Boolean).join(' ');
  /* object-position from data (spec 2c: crop by focal point, never centre by default) */
  const objectPosition = `${m.position[0] * 100}% ${m.position[1] * 100}%`;
  return (
    <picture>
      <source type="image/webp" srcSet={photoSrcSet(name)} sizes={sizes} />
      <img
        className={cls || undefined}
        src={m.fallback.src}
        width={m.fallback.width}
        height={m.fallback.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        style={{ objectPosition }}
      />
    </picture>
  );
}
