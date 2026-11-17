/* =====================================================================
   a-score (round 3 spec 0.4): the guest score in a small cabin window,
   with the catalogue's word and the review count beside it. Shared by
   the home page and the hotel pages. Scores and reviews come from
   the catalogue (lib/mock/hotels.ts).
   ===================================================================== */
type Props = { score: number; word: string; count: number; size?: 's' | 'm' | 'l'; className?: string };

export function Score({ score, word, count, size = 'm', className = '' }: Props) {
  const n = score.toFixed(1);
  const reviews = `${count.toLocaleString('en-US')} ${count === 1 ? 'review' : 'reviews'}`;
  return (
    <span className={`a-score -${size} ${className}`.trim()} role="img" aria-label={`Rated ${n} out of 10, ${word.toLowerCase()}, from ${reviews}`}>
      <span className="a-score__badge" aria-hidden="true">{n}</span>
      <span className="a-score__text" aria-hidden="true">
        <span className="a-score__word">{word}</span>
        <span className="a-score__count">{reviews}</span>
      </span>
    </span>
  );
}
