import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// KPI tile: label, big value, optional delta + sparkline slot.
// Values render in mono/tabular so rows of tiles align.
export function StatTile({
  label,
  value,
  delta,
  deltaGood,
  hint,
  children,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaGood?: boolean; // colors the delta; omit for neutral
  hint?: string;
  children?: React.ReactNode; // e.g. a Sparkline
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {delta ? (
          <span
            className={cn(
              "tnum text-xs font-medium",
              deltaGood === undefined
                ? "text-muted-foreground"
                : deltaGood
                  ? "text-status-good"
                  : "text-status-critical",
            )}
          >
            {delta}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <span className="tnum text-2xl font-semibold leading-none">
          {value}
        </span>
        {children}
      </div>
      {hint ? (
        <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </Card>
  );
}
