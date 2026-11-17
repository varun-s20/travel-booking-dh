/* =====================================================================
   Hotel score on the hotel pages: the shared a-score (components/ui/
   Score.tsx, round 3 spec 0.4: the score in a small cabin window, the
   catalogue's word and the review count) plus, where the hotel has
   category scores, its best one ("Location 9.4"). Demo reviews
   (content/mock-catalogue.md).
   ===================================================================== */
import { Score } from '@/components/ui/Score';
import type { Hotel } from '@/lib/mock/hotels';

type Props = { score: number; word: string; reviews: number; size?: 's' | 'm' | 'l'; extra?: string; className?: string };

export function HotelScore({ score, word, reviews, size = 'm', extra, className = '' }: Props) {
  return (
    <span className={`o-hscore -${size} ${className}`.trim()}>
      <Score score={score} word={word} count={reviews} size={size} />
      {extra ? <span className="o-hscore__extra">{extra}</span> : null}
    </span>
  );
}

/* "4-star boutique hotel" (catalogue: stars, then the type in lower case) */
export function typeLine(h: Pick<Hotel, 'stars' | 'type'>): string {
  return `${h.stars}-star ${h.type.toLowerCase()}`;
}

/* the best of the hotel's category scores ("Location 9.4") */
export function topCategory(h: Pick<Hotel, 'categoryScores'>): string | null {
  const c = h.categoryScores;
  if (!c?.length) return null;
  const best = [...c].sort((a, b) => b.score - a.score)[0];
  return `${best.label} ${best.score.toFixed(1)}`;
}
