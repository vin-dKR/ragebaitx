import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HOOK_LABELS, type HookAngle } from "@/lib/types";

// The hook angle of a draft variant (outrage / question / cliffhanger / …).
export function HookBadge({
  hook,
  className,
}: {
  hook: HookAngle;
  className?: string;
}) {
  return (
    <Badge variant="secondary" className={cn("font-normal", className)}>
      {HOOK_LABELS[hook]}
    </Badge>
  );
}
