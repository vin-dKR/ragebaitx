"use client";

import { MoonStar } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { SettingSlider } from "./setting-slider";

function hourLabel(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${h >= 12 ? "PM" : "AM"}`;
}

const HOUR_ITEMS: Record<string, string> = Object.fromEntries(
  Array.from({ length: 24 }, (_, h) => [String(h), hourLabel(h)]),
);

export function AutomationTab() {
  const autoThreshold = useAppStore((s) => s.config.autoThreshold);
  const safetyFloor = useAppStore((s) => s.config.safetyFloor);
  const timing = useAppStore((s) => s.config.timing);
  const updateConfig = useAppStore((s) => s.updateConfig);

  const setQuiet = (key: "quietStart" | "quietEnd", hour: number) => {
    const next = { ...timing, [key]: hour };
    updateConfig({ timing: next });
    toast.success("Quiet hours updated", {
      description: `No posts between ${hourLabel(next.quietStart)} and ${hourLabel(next.quietEnd)}.`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Live-mode thresholds</CardTitle>
          <CardDescription>
            The gates a draft clears before autopilot fires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SettingSlider
            label="Auto-post threshold"
            description="Auto-post at or above this virality score."
            value={autoThreshold}
            min={50}
            max={100}
            display={(v) => String(v)}
            onChange={(v) => updateConfig({ autoThreshold: v })}
            onCommit={(v) =>
              toast.success(`Auto-post threshold set to ${v}`, {
                description:
                  "Applies the next time Live mode evaluates a draft.",
              })
            }
          />
          <SettingSlider
            label="Safety floor"
            description="Nothing below this safety score ever posts — Live or Training."
            value={safetyFloor}
            min={50}
            max={100}
            display={(v) => String(v)}
            onChange={(v) => updateConfig({ safetyFloor: v })}
            onCommit={(v) =>
              toast.success(`Safety floor set to ${v}`, {
                description: "Blocks every post below it, in both modes.",
              })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quiet hours</CardTitle>
          <CardDescription>
            The engine never posts inside this window
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <MoonStar className="h-4 w-4 shrink-0" />
            <span>From</span>
            <Select
              items={HOUR_ITEMS}
              value={String(timing.quietStart)}
              onValueChange={(v) => {
                if (v != null) setQuiet("quietStart", Number(v));
              }}
            >
              <SelectTrigger
                size="sm"
                className="w-22 tnum"
                aria-label="Quiet hours start"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(HOUR_ITEMS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>until</span>
            <Select
              items={HOUR_ITEMS}
              value={String(timing.quietEnd)}
              onValueChange={(v) => {
                if (v != null) setQuiet("quietEnd", Number(v));
              }}
            >
              <SelectTrigger
                size="sm"
                className="w-22 tnum"
                aria-label="Quiet hours end"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(HOUR_ITEMS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Posts approved inside the window queue until it ends.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
