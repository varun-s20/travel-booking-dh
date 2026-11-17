/* =====================================================================
   Landfall (working name, a placeholder): review score badge
   Round 3 shared component (round3-spec.md, shared components 1), built by
   Developer A for both parts. A 32px navy square with white tabular
   numerals, the catalogue's score word and the review count beside it.
   Words and the accessible name follow content/mock-catalogue.md, Review
   score words: "Rated 9.1 out of 10, exceptional, from 1,286 reviews".
   - compact: the badge alone, the word and count only in its name
   - size "lg": the 56px badge for a hotel page's Reviews section
   Every surface that shows a score also shows DEMO_REVIEWS_LINE once.
   ===================================================================== */


export function scoreWord(score: number): string {
  if (score >= 9) return 'Exceptional';
  if (score >= 8.5) return 'Excellent';
  if (score >= 8) return 'Very good';
  if (score >= 7) return 'Good';
  return 'Fair';
}

export function scoreName(score: number, count?: number): string {
  const base = `Rated ${score.toFixed(1)} out of 10, ${scoreWord(score).toLowerCase()}`;
  return count ? `${base}, from ${count.toLocaleString('en-US')} reviews` : base;
}

type Props = { score: number; count?: number; compact?: boolean; size?: 'md' | 'lg'; className?: string; onDark?: boolean };

export default function ScoreBadge({ score, count, compact, size = 'md', className, onDark }: Props) {
  const cls = ['m-score', compact ? '-compact' : '', size === 'lg' ? '-lg' : '', onDark ? '-dark' : '', className || ''].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      <span className="m-score__badge t-num" aria-hidden="true">{score.toFixed(1)}</span>
      {!compact && (
        <span className="m-score__text" aria-hidden="true">
          <span className="m-score__word">{scoreWord(score)}</span>
          {count ? <span className="m-score__count t-num">{count.toLocaleString('en-US')} reviews</span> : null}
        </span>
      )}
      <span className="sr-only">{scoreName(score, count)}</span>
    </span>
  );
}
