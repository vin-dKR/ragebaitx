"use client";

import { Flame } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dayNames } from "@/lib/format";
import { scheduleHeatmap } from "@/lib/mock-data";

const TOP_SLOTS = [...scheduleHeatmap]
  .sort(
    (a, b) => b.score - a.score || a.day - b.day || a.hour - b.hour,
  )
  .slice(0, 5);

function hourRange(hour: number): string {
  const fmt = (h: number) => {
    const n = h % 24;
    return `${n % 12 === 0 ? 12 : n % 12}`;
  };
  const suffix = (h: number) => (h % 24 >= 12 ? "PM" : "AM");
  const end = hour + 1;
  return suffix(hour) === suffix(end)
    ? `${fmt(hour)}–${fmt(end)} ${suffix(hour)}`
    : `${fmt(hour)} ${suffix(hour)}–${fmt(end)} ${suffix(end)}`;
}

export function BestWindowsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Best windows this week</CardTitle>
        <CardDescription>
          The five slots the scheduler grabs first when a post is held.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {TOP_SLOTS.map((slot, i) => (
          <div
            key={`${slot.day}-${slot.hour}`}
            className="flex items-center gap-3"
          >
            <span className="tnum w-6 shrink-0 text-xs text-muted-foreground">
              #{i + 1}
            </span>
            <span className="flex w-36 shrink-0 items-center gap-1.5">
              <span className="tnum text-sm">
                {dayNames[slot.day]} · {hourRange(slot.hour)}
              </span>
              {i === 0 ? (
                <Flame
                  className="h-3.5 w-3.5 shrink-0 text-brand"
                  aria-label="Top window"
                />
              ) : null}
            </span>
            <Progress
              value={slot.score}
              aria-label={`${dayNames[slot.day]} ${hourRange(slot.hour)} engagement score`}
              className="flex-1 [&_[data-slot=progress-track]]:h-1.5"
            />
            <span className="tnum w-12 shrink-0 text-right text-sm text-muted-foreground">
              {slot.score}/100
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
