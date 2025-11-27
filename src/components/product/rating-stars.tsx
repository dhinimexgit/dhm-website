type Props = {
  rating: number;
  size?: "sm" | "lg";
};

export function RatingStars({ rating, size = "sm" }: Props) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  const starSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  const stars = [
    ...Array(full).fill("full"),
    ...(hasHalf ? ["half"] : []),
    ...Array(empty).fill("empty"),
  ] as ("full" | "half" | "empty")[];

  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {stars.map((state, index) => (
        <Star key={index} state={state} className={starSize} />
      ))}
    </div>
  );
}

function Star({
  state,
  className,
}: {
  state: "full" | "half" | "empty";
  className: string;
}) {
  if (state === "half") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="half-grad">
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#D6D3D1" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-grad)"
          d="M12 2.5 14.9 9l6.6.6-5 4.5 1.5 6.5-5.9-3.5-5.9 3.5L7.5 14 2.5 9.6 9.1 9z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill={state === "full" ? "#F97316" : "#D6D3D1"}
        d="M12 2.5 14.9 9l6.6.6-5 4.5 1.5 6.5-5.9-3.5-5.9 3.5L7.5 14 2.5 9.6 9.1 9z"
      />
    </svg>
  );
}

