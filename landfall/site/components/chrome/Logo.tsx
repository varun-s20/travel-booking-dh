/* =====================================================================
   Landfall logo: the mark plus the wordmark, as one home link.
   Varun, 11 Nov: "landfall needs a better logo, one that looks really good
   next to it and makes a creative impact too". Chosen from four sketches
   (design/screens/logo/sketches.html): the Crook L. A solid monogram L made
   of the concept: the stem is the headland, its top cut at 45 degrees like
   the icon set's corners; the foot is the landfall line, laid down as a
   solid bar that runs out to sea and ends in the landing dot, as the
   landfall line does everywhere else. Solid shapes, no hairlines, so it
   holds at 16px. The foot sits on the word's baseline. (Critic, 17:33: a
   dot floating in the crook read as letter-plus-dot, a common formula
   that edges toward a known travel brand's app icon; landing it on the
   foot puts the concept in the shape.)
   Colour: the L is currentColor (navy on light, white on the photo and the
   dark band); the dot takes --wm-land (teal on light, aqua on the photo and
   dark), so it follows whichever palette is live. One-colour fallback: add
   the -mono class (or forced colours), and the dot takes currentColor too.
   No raw colours here.
   The word is real text in Newsreader; the SVG is decorative. The link
   carries the accessible name.
   ===================================================================== */
import Link from 'next/link';

export function LogoMark({ className = 'a-logo__mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
      <path className="a-logo__land" d="M3 29V9l6-6h3v19h12v7z" />
      <circle className="a-logo__dot" cx="24" cy="25.5" r="5.5" />
    </svg>
  );
}

export default function Logo({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link prefetch={false} className={`a-logo${className ? ` ${className}` : ''}`} href="/" aria-label="Landfall, home" onClick={onClick}>
      <LogoMark />
      <span className="a-logo__word">landfall</span>
    </Link>
  );
}
