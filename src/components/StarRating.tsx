export default function StarRating({
  rating,
  reviews,
  size = "sm",
}: {
  rating: number;
  reviews?: number;
  size?: "sm" | "md";
}) {
  const full = Math.round(rating * 2) / 2;
  const starSize = size === "md" ? "text-base" : "text-xs";

  return (
    <div className={`flex items-center gap-1.5 ${starSize}`}>
      <span className="flex text-accent">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= full;
          const half = !filled && i + 0.5 === full;
          return (
            <span key={i} aria-hidden>
              {filled ? "★" : half ? "★" : "☆"}
              {half && (
                <span className="sr-only">half star</span>
              )}
            </span>
          );
        })}
      </span>
      <span className="text-muted">
        {rating.toFixed(1)}
        {typeof reviews === "number" && ` (${reviews})`}
      </span>
    </div>
  );
}
