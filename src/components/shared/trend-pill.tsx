import { cn } from "@/lib/utils";
import { TrendingUp, Activity, TrendingDown } from "lucide-react";
import type { TrendState } from "@/lib/types";

const META: Record<
  TrendState,
  { label: string; icon: typeof TrendingUp; className: string }
> = {
  rising: {
    label: "Rising",
    icon: TrendingUp,
    className: "text-status-good border-status-good/30 bg-status-good/10",
  },
  peaking: {
    label: "Peaking",
    icon: Activity,
    className:
      "text-status-warning border-status-warning/30 bg-status-warning/10",
  },
  fading: {
    label: "Fading",
    icon: TrendingDown,
    className: "text-muted-foreground border-border bg-muted/40",
  },
};

// Trend-timing state of a story. Icon + label — never color alone.
export function TrendPill({
  state,
  delta,
  className,
}: {
  state: TrendState;
  delta?: number; // velocity % change, signed
  className?: string;
}) {
  const meta = META[state];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        meta.className,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
      {delta !== undefined ? (
        <span className="tnum">
          {delta >= 0 ? "+" : ""}
          {delta}%
        </span>
      ) : null}
    </span>
  );
}
