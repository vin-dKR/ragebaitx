"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { dayNames } from "@/lib/format";
import type { ScheduleSlot } from "@/lib/types";

// 7×24 posting-time heatmap. Sequential ramp (one hue, light→dark = low→high),
// per-cell hover tooltip, quiet chrome.
const RAMP = [
  "var(--viz-seq-1)",
  "var(--viz-seq-2)",
  "var(--viz-seq-3)",
  "var(--viz-seq-4)",
  "var(--viz-seq-5)",
];

function cellColor(score: number): string {
  if (score < 12) return "var(--muted)";
  const idx = Math.min(RAMP.length - 1, Math.floor((score / 100) * RAMP.length));
  return RAMP[idx];
}

export function Heatmap({
  slots,
  highlightKeys,
  className,
}: {
  slots: ScheduleSlot[];
  highlightKeys?: string[]; // "day-hour" keys to ring, e.g. tonight's peak window
  className?: string;
}) {
  const highlighted = new Set(highlightKeys ?? []);
  const [hover, setHover] = useState<ScheduleSlot | null>(null);
  const byKey = new Map(slots.map((s) => [`${s.day}-${s.hour}`, s]));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          {/* hour labels */}
          <div className="ml-10 grid grid-cols-[repeat(24,1fr)] gap-[3px] pb-1">
            {Array.from({ length: 24 }, (_, h) => (
              <span
                key={h}
                className="tnum text-center text-[9px] text-muted-foreground"
              >
                {h % 6 === 0 ? h : ""}
              </span>
            ))}
          </div>
          {Array.from({ length: 7 }, (_, day) => (
            <div key={day} className="flex items-center gap-[3px] pb-[3px]">
              <span className="w-10 shrink-0 text-[10px] font-medium text-muted-foreground">
                {dayNames[day]}
              </span>
              <div className="grid flex-1 grid-cols-[repeat(24,1fr)] gap-[3px]">
                {Array.from({ length: 24 }, (_, hour) => {
                  const slot = byKey.get(`${day}-${hour}`)!;
                  const hot = highlighted.has(`${day}-${hour}`);
                  return (
                    <button
                      key={hour}
                      type="button"
                      onMouseEnter={() => setHover(slot)}
                      onMouseLeave={() => setHover(null)}
                      className={cn(
                        "aspect-square min-w-[14px] rounded-[3px] transition-transform hover:scale-125 hover:ring-2 hover:ring-ring",
                        hot && "ring-2 ring-brand",
                      )}
                      style={{ backgroundColor: cellColor(slot.score) }}
                      aria-label={`${dayNames[day]} ${hour}:00 — score ${slot.score}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="tnum h-4">
          {hover
            ? `${dayNames[hover.day]} ${hover.hour}:00–${hover.hour + 1}:00 · engagement score ${hover.score}/100`
            : "Hover a cell for slot detail"}
        </span>
        <span className="flex items-center gap-1">
          Low
          {RAMP.map((c) => (
            <span
              key={c}
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ backgroundColor: c }}
            />
          ))}
          High
        </span>
      </div>
    </div>
  );
}
