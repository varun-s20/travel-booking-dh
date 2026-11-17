/* =====================================================================
   travel-booking (working name Overwing, a placeholder): image builder
   Reads tools/images.config.json. For each image it crops the source to
   the slot ratio around its focal point, then writes WebP width
   derivatives (<name>-<width>.webp) and one JPEG fallback (<name>.jpg)
   into public/images/<topic>/, never upscaling, and records the real
   sizes in lib/images.manifest.json for components/Photo.tsx.
   It also writes the palette icons (SVG and the 180px touch PNG) into
   public/icons/, one pair per palette.
   Uses sharp, which Next.js already installs for its own image work.
   Run from site/:  node tools/images.mjs   (rerunning rewrites the same files)
   ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(readFileSync(join(ROOT, 'tools/images.config.json'), 'utf8'));
const WEBP_QUALITY = 80;
const JPEG_QUALITY = 82;

/* ---- crop box for a target ratio, centred on the focal point and kept inside the source ---- */
function cropBox(w, h, ratio, focus) {
  if (!ratio) return { left: 0, top: 0, width: w, height: h };
  const target = ratio[0] / ratio[1];
  let cw = w, ch = Math.round(w / target);
  if (ch > h) { ch = h; cw = Math.round(h * target); }
  const left = Math.min(Math.max(Math.round(focus[0] * w - cw / 2), 0), w - cw);
  const top = Math.min(Math.max(Math.round(focus[1] * h - ch / 2), 0), h - ch);
  return { left, top, width: cw, height: ch };
}

async function build(entry) {
  let base = sharp(join(ROOT, entry.src)).rotate();
  if (entry.precrop) {
    const [left, top, width, height] = entry.precrop;
    base = sharp(await base.extract({ left, top, width, height }).toBuffer());
  }
  const meta = await base.metadata();
  const box = cropBox(meta.width, meta.height, entry.ratio, entry.focus);
  const cropped = await base.extract(box).toBuffer();
  const outDir = join(ROOT, 'public/images', entry.topic);
  mkdirSync(outDir, { recursive: true });
  const url = (file) => `/images/${entry.topic}/${file}`;
  /* the focal point inside the published crop, for object-position when a slot crops again (cover) */
  const position = [
    +((entry.focus[0] * meta.width - box.left) / box.width).toFixed(3),
    +((entry.focus[1] * meta.height - box.top) / box.height).toFixed(3)
  ].map((v) => Math.min(Math.max(v, 0), 1));
  const record = { topic: entry.topic, width: box.width, height: box.height, position, webp: [], fallback: null };
  for (const w of entry.widths) {
    if (w > box.width) continue; /* never upscale */
    const h = Math.round(box.height * w / box.width);
    const file = `${entry.name}-${w}.webp`;
    await sharp(cropped).resize(w, h, { kernel: 'lanczos3' }).webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(join(outDir, file));
    record.webp.push({ src: url(file), width: w, height: h });
  }
  const fw = Math.min(entry.fallback, box.width);
  const fh = Math.round(box.height * fw / box.width);
  await sharp(cropped).resize(fw, fh, { kernel: 'lanczos3' }).jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true }).toFile(join(outDir, `${entry.name}.jpg`));
  record.fallback = { src: url(`${entry.name}.jpg`), width: fw, height: fh };
  return record;
}

/* ---- palette icons: the cabin window with its blind half down on the deep tile ---- */
const ICON_COLOURS = {
  navy: { deep: '#0D2B4C', soft: '#6FD6CE', cream: '#E6F0F2', blind: '#FFFFFF' },
  cabin: { deep: '#1F3B41', soft: '#A9D3DA', cream: '#EED7D5', blind: '#FFFFFF' }
};
function iconSvg(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Placeholder brand mark (working name Overwing): the cabin window with its blind half down -->
  <defs>
    <linearGradient id="pane" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.soft}"/><stop offset="1" stop-color="${c.cream}"/></linearGradient>
    <clipPath id="win"><rect x="21" y="12" width="22" height="40" rx="10" ry="11"/></clipPath>
  </defs>
  <rect width="64" height="64" rx="16" fill="${c.deep}"/>
  <g clip-path="url(#win)"><rect x="21" y="12" width="22" height="40" fill="url(#pane)"/><rect x="21" y="12" width="22" height="20" fill="${c.blind}"/></g>
  <rect x="22.6" y="13.6" width="18.8" height="36.8" rx="9" ry="10" fill="none" stroke="${c.blind}" stroke-width="3.2"/>
</svg>
`;
}

async function icons() {
  const dir = join(ROOT, 'public/icons');
  mkdirSync(dir, { recursive: true });
  for (const [palette, c] of Object.entries(ICON_COLOURS)) {
    const svg = iconSvg(c);
    writeFileSync(join(dir, `overwing-icon-${palette}.svg`), svg);
    /* the touch icon is a full square: iOS rounds its own corners */
    const square = svg.replace('rx="16" fill', 'rx="0" fill');
    await sharp(Buffer.from(square), { density: 300 }).resize(180, 180).png().toFile(join(dir, `overwing-touch-${palette}-180.png`));
  }
}

const manifest = { _generated: 'Generated by tools/images.mjs from tools/images.config.json. Edit that file and rerun, not this one.' };
for (const entry of config.images) {
  manifest[entry.name] = await build(entry);
  const r = manifest[entry.name];
  console.log(`${entry.topic}/${entry.name}: ${r.width}x${r.height}, ${r.webp.map((d) => d.width).join(' ')}`);
}
writeFileSync(join(ROOT, 'lib/images.manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
await icons();
console.log('icons: navy, cabin');
