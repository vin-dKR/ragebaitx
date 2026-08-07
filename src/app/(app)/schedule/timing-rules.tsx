"use client";

import { MoonStar, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";

function hourLabel(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${h >= 12 ? "PM" : "AM"}`;
}

export function TimingRulesCard() {
  const timing = useAppStore((s) => s.config.timing);
  const pollIntervalMin = useAppStore((s) => s.config.pollIntervalMin);
  const updateConfig = useAppStore((s) => s.updateConfig);

  const setHoldForPeak = (holdForPeak: boolean) => {
    updateConfig({ timing: { ...timing, holdForPeak } });
    toast.success(
      holdForPeak
        ? "Holding approved posts for peak windows"
        : "Posting immediately on approval",
      {
        description: holdForPeak
          ? "Approved drafts queue until the audience is awake."
          : "Approved drafts go out as soon as you clear them.",
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timing rules</CardTitle>
        <CardDescription>How the engine decides when to fire</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="hold-for-peak" className="font-normal">
            Hold approved posts for peak windows
          </Label>
          <Switch
            id="hold-for-peak"
            checked={timing.holdForPeak}
            onCheckedChange={setHoldForPeak}
          />
        </div>
        <Separator />
        <div className="flex items-start gap-2.5">
          <MoonStar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm">Quiet hours</p>
            <p className="text-xs text-muted-foreground">
              <span className="tnum">
                {hourLabel(timing.quietStart)} – {hourLabel(timing.quietEnd)}
              </span>{" "}
              · never posts
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm">Crawl interval</p>
            <p className="text-xs text-muted-foreground">
              Sweeps X every{" "}
              <span className="tnum">{pollIntervalMin} min</span> for new
              candidates
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
