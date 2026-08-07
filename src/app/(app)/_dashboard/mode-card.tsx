"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NOW, posts } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";

export function ModeCard() {
  const mode = useAppStore((s) => s.config.mode);
  return mode === "training" ? <TrainingCard /> : <LiveCard />;
}

function TrainingCard() {
  const benchmark = useAppStore((s) => s.benchmark);
  const remaining = Math.max(benchmark.target - benchmark.streak, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-mode-training" />
          Training mode — benchmark streak
        </CardTitle>
        <CardDescription>
          {benchmark.graduated
            ? "Target reached — you can flip to Live from the Benchmark screen."
            : `Approvals without edits (≤${benchmark.editDistanceLimit}% change) advance the streak; an edit or reject resets it.`}
        </CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/benchmark" />}
          >
            Open benchmark
            <ArrowRight />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between gap-4">
          <span className="tnum text-2xl font-semibold leading-none">
            {benchmark.streak}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / {benchmark.target} clean approvals
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            {benchmark.graduated ? "benchmark cleared" : `${remaining} to go`}
          </span>
        </div>
        <Progress
          value={Math.min(
            Math.round((benchmark.streak / benchmark.target) * 100),
            100,
          )}
          className="mt-3"
          aria-label="Benchmark streak progress"
        />
      </CardContent>
    </Card>
  );
}

const startOfToday = (() => {
  const d = new Date(NOW);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
})();

function LiveCard() {
  const autoThreshold = useAppStore((s) => s.config.autoThreshold);
  const safetyFloor = useAppStore((s) => s.config.safetyFloor);
  const postsToday = posts.filter(
    (p) => new Date(p.postedAt).getTime() >= startOfToday,
  ).length;
  return (
    <Card className="ring-mode-live/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-mode-live">
          <span className="animate-live-pulse h-2 w-2 rounded-full bg-mode-live" />
          Live — autopilot active
        </CardTitle>
        <CardDescription>
          Drafts at or above the auto threshold post themselves; everything else
          still waits for your review.
        </CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/benchmark" />}
          >
            Mode controls
            <ArrowRight />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Auto threshold
          </p>
          <p className="tnum mt-1 text-lg font-semibold leading-none">
            ≥{autoThreshold}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Posts today
          </p>
          <p className="tnum mt-1 text-lg font-semibold leading-none">
            {postsToday}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Safety floor
          </p>
          <p className="tnum mt-1 text-lg font-semibold leading-none">
            {safetyFloor}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
