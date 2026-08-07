"use client";

import { useState } from "react";
import {
  CalendarClock,
  GraduationCap,
  Lock,
  MoonStar,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function hourLabel(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${h >= 12 ? "PM" : "AM"}`;
}

const panelBase =
  "rounded-xl border p-4 text-left transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ModeControlCard() {
  const mode = useAppStore((s) => s.config.mode);
  const autoThreshold = useAppStore((s) => s.config.autoThreshold);
  const safetyFloor = useAppStore((s) => s.config.safetyFloor);
  const timing = useAppStore((s) => s.config.timing);
  const target = useAppStore((s) => s.config.benchmarkTarget);
  const streak = useAppStore((s) => s.benchmark.streak);
  const unlocked = useAppStore((s) => s.canGoLive());
  const setMode = useAppStore((s) => s.setMode);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const training = mode === "training";
  const live = mode === "live";
  const locked = !unlocked && !live;

  const selectTraining = () => {
    if (training) return;
    setMode("training");
    toast.success("Back in Training", {
      description: "Every draft waits for your review again.",
    });
  };

  const selectLive = () => {
    if (live) return;
    if (!unlocked) {
      toast("Live is locked", {
        description: `Reach ${target}/${target} clean approvals in a row to unlock autopilot — the streak is at ${streak}.`,
      });
      return;
    }
    setConfirmOpen(true);
  };

  const confirmLive = () => {
    setMode("live");
    setConfirmOpen(false);
    toast.success("Live autopilot on", {
      description: `Drafts scoring ≥${autoThreshold} now post themselves in peak windows.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operating mode</CardTitle>
        <CardDescription>Where drafts go after scoring</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={selectTraining}
          aria-pressed={training}
          className={cn(
            panelBase,
            training
              ? "border-mode-training bg-mode-training/10"
              : "border-border hover:bg-muted/50",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="flex items-center gap-2">
              <GraduationCap
                className={cn(
                  "h-4 w-4",
                  training ? "text-mode-training" : "text-muted-foreground",
                )}
              />
              <span className="text-sm font-medium">Training</span>
            </span>
            {training ? (
              <Badge
                variant="outline"
                className="border-mode-training/30 bg-mode-training/10 text-mode-training"
              >
                Active
              </Badge>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Every draft waits for your review. The profile learns from each
            decision.
          </p>
        </button>

        <button
          type="button"
          onClick={selectLive}
          aria-pressed={live}
          aria-disabled={locked}
          className={cn(
            panelBase,
            live
              ? "border-mode-live bg-mode-live/10"
              : "border-border hover:bg-muted/50",
            locked && "opacity-60 hover:bg-transparent",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="flex items-center gap-2">
              <Radio
                className={cn(
                  "h-4 w-4",
                  live ? "text-mode-live" : "text-muted-foreground",
                )}
              />
              <span className="text-sm font-medium">Live autopilot</span>
              {live ? (
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-mode-live animate-live-pulse"
                />
              ) : null}
            </span>
            {live ? (
              <Badge
                variant="outline"
                className="border-mode-live/30 bg-mode-live/10 text-mode-live"
              >
                Active
              </Badge>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Drafts scoring ≥<span className="tnum">{autoThreshold}</span> post
            themselves in peak windows. Weaker drafts still queue for you.
          </p>
          {locked ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              <span className="tnum">
                Reach {target}/{target} to unlock
              </span>
            </p>
          ) : null}
        </button>
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-mode-live/10 text-mode-live">
              <Radio />
            </AlertDialogMedia>
            <AlertDialogTitle>Go live?</AlertDialogTitle>
            <AlertDialogDescription>
              Autopilot starts posting without waiting for you. Exactly what
              happens:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5">
              <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>
                Drafts scoring ≥<span className="tnum">{autoThreshold}</span>{" "}
                post automatically. Weaker drafts still queue for review.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>
                Nothing posts below safety score{" "}
                <span className="tnum">{safetyFloor}</span>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>
                {timing.holdForPeak
                  ? "Posts hold for the day's peak engagement windows."
                  : "Posts go out as soon as they clear the bar."}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <MoonStar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>
                Quiet hours{" "}
                <span className="tnum">
                  {hourLabel(timing.quietStart)} – {hourLabel(timing.quietEnd)}
                </span>{" "}
                — nothing ever posts.
              </span>
            </li>
          </ul>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay in Training</AlertDialogCancel>
            <AlertDialogAction
              className="bg-mode-live text-white hover:bg-mode-live/80"
              onClick={confirmLive}
            >
              Go live
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
