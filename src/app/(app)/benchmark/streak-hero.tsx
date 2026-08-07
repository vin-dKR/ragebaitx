"use client";

import { BadgeCheck, Check, Radio, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function StreakHeroCard() {
  const streak = useAppStore((s) => s.benchmark.streak);
  const graduated = useAppStore((s) => s.benchmark.graduated);
  const target = useAppStore((s) => s.config.benchmarkTarget);
  const limit = useAppStore((s) => s.config.editDistanceLimit);

  const remaining = Math.max(0, target - streak);
  const progress = graduated
    ? 100
    : Math.min(100, Math.round((streak / Math.max(target, 1)) * 100));

  return (
    <Card>
      <CardContent className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Benchmark streak
          </p>
          <p className="mt-1 text-4xl font-semibold tnum">
            {streak} / {target}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            clean approvals in a row
          </p>
          <Progress
            value={progress}
            className={cn(
              "mt-4 w-full [&_[data-slot=progress-track]]:h-2",
              graduated && "[&_[data-slot=progress-indicator]]:bg-status-good",
            )}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {graduated ? (
              "Target met — the streak keeps counting."
            ) : (
              <>
                <span className="tnum">{remaining}</span> more to unlock Live
              </>
            )}
          </p>
        </div>
        {graduated ? (
          <div className="flex items-start gap-3 rounded-xl border border-status-good/30 bg-status-good/10 p-4">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-status-good" />
            <div>
              <p className="text-sm font-medium text-status-good">
                Benchmark met — Live is unlocked
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Flip on Live autopilot below whenever ready. Training stays one
                click away.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              How graduation works
            </p>
            <div className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-status-good" />
              <p className="text-sm text-muted-foreground">
                Approve a draft untouched — or with under{" "}
                <span className="tnum">{limit}%</span> change — and the streak
                advances.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-status-critical" />
              <p className="text-sm text-muted-foreground">
                An edit over the limit, or a reject, resets it to{" "}
                <span className="tnum">0</span>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Radio className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Hit <span className="tnum">{target}</span> in a row and Live
                autopilot unlocks.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
