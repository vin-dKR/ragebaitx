"use client";

import { CalendarClock } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { shortTime } from "@/lib/format";
import { peakWindowLabel } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import type { Draft } from "@/lib/types";

function finalText(draft: Draft): string {
  const variant = draft.variants.find((v) => v.id === draft.selectedVariantId);
  return draft.editedText ?? variant?.text ?? "";
}

export function NextReleaseCard() {
  const drafts = useAppStore((s) => s.drafts);
  const scheduled = drafts
    .filter((d) => d.status === "scheduled")
    .sort((a, b) => (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next release</CardTitle>
        <CardDescription>Approved posts held for the window</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-semibold">{peakWindowLabel}</p>
        {scheduled.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nothing held yet"
            description="Approve drafts in the queue — they wait here until the window opens."
            className="px-4 py-8"
          />
        ) : (
          <ul className="space-y-3">
            {scheduled.map((d) => (
              <li key={d.id} className="flex items-start gap-2.5">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm">{finalText(d)}</p>
                  <p className="text-xs text-muted-foreground">
                    Releases at{" "}
                    <span className="tnum">
                      {d.scheduledFor ? shortTime(d.scheduledFor) : "next peak"}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
