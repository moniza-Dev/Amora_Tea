/** Renders nothing when there are no real reviews (ratingCount 0). */
export function RatingStars({ rating, count }: { rating: number; count: number }) {
  if (count <= 0) return null;
  const pct = Math.max(0, Math.min(5, rating)) * 20;
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5 from ${count} reviews`}>
      <span className="relative inline-block text-sm leading-none tracking-wider text-black/15" aria-hidden>
        ★★★★★
        <span className="absolute inset-0 overflow-hidden whitespace-nowrap text-ink" style={{ width: `${pct}%` }}>★★★★★</span>
      </span>
      <span className="text-xs text-ink-soft">({count})</span>
    </div>
  );
}
