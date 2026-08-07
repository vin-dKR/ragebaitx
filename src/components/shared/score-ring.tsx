import { cn } from "@/lib/utils";

// Small circular score gauge, 0-100. Color = pass/borderline/fail vs threshold.
export function ScoreRing({
  value,
  threshold = 80,
  size = 40,
  label,
  className,
}: {
  value: number;
  threshold?: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const stroke = 3.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (value / 100) * c;
  const color =
    value >= threshold
      ? "var(--status-good)"
      : value >= threshold - 15
        ? "var(--status-warning)"
        : "var(--status-critical)";
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--viz-axis)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${filled} ${c - filled}`}
            strokeLinecap="round"
          />
        </svg>
        <span
          className="tnum absolute inset-0 flex items-center justify-center font-semibold"
          style={{ fontSize: size * 0.32 }}
        >
          {value}
        </span>
      </div>
      {label ? (
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      ) : null}
    </div>
  );
}
