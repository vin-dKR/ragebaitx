import { cn } from "@/lib/utils";
import { MODEL_META, type ModelId } from "@/lib/types";

// Which AI model produced a draft. Colored dot + name — identity, not status.
export function ModelChip({
  model,
  className,
  short = false,
}: {
  model: ModelId;
  className?: string;
  short?: boolean;
}) {
  const meta = MODEL_META[model];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground/80",
        className,
      )}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {short ? meta.short : meta.label}
    </span>
  );
}
