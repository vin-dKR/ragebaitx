import { cn } from "@/lib/utils";
import { Flame, Minus, ThumbsDown } from "lucide-react";
import type { PostOutcome } from "@/lib/types";

const META: Record<
  PostOutcome,
  { label: string; icon: typeof Flame; className: string }
> = {
  hit: {
    label: "Hit",
    icon: Flame,
    className: "text-status-good border-status-good/30 bg-status-good/10",
  },
  solid: {
    label: "Solid",
    icon: Minus,
    className: "text-muted-foreground border-border bg-muted/40",
  },
  flop: {
    label: "Flop",
    icon: ThumbsDown,
    className:
      "text-status-serious border-status-serious/30 bg-status-serious/10",
  },
};

// Performance verdict on a published post. Icon + label, never color alone.
export function OutcomeBadge({
  outcome,
  className,
}: {
  outcome: PostOutcome;
  className?: string;
}) {
  const meta = META[outcome];
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
    </span>
  );
}
