"use client";

import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pct, timeAgo } from "@/lib/format";
import { safety } from "@/lib/mock-data";
import type { SafetyStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const LEVEL_META: Record<
  SafetyStatus["level"],
  { icon: LucideIcon; label: string; className: string }
> = {
  healthy: {
    icon: ShieldCheck,
    label: "Healthy",
    className: "border-status-good/30 bg-status-good/10 text-status-good",
  },
  caution: {
    icon: ShieldAlert,
    label: "Caution",
    className:
      "border-status-warning/30 bg-status-warning/10 text-status-warning",
  },
  risk: {
    icon: ShieldX,
    label: "At risk",
    className:
      "border-status-critical/30 bg-status-critical/10 text-status-critical",
  },
};

export function SafetyCard() {
  const meta = LEVEL_META[safety.level];
  const Icon = meta.icon;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account safety</CardTitle>
        <CardDescription>
          Checked {timeAgo(safety.lastChecked)} ago
        </CardDescription>
        <CardAction>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
              meta.className,
            )}
          >
            <Icon className="h-3 w-3" />
            {meta.label}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Reach trend (WoW)</span>
          <span
            className={cn(
              "tnum font-medium",
              safety.reachTrendPct >= 0
                ? "text-status-good"
                : "text-status-critical",
            )}
          >
            {pct(safety.reachTrendPct)}
          </span>
        </div>
        <ul className="space-y-1.5">
          {safety.notes.map((n) => (
            <li key={n} className="flex gap-2 text-xs text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
              {n}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
