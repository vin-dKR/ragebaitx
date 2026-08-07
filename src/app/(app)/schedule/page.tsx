"use client";

import { Heatmap } from "@/components/charts/heatmap";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { scheduleHeatmap } from "@/lib/mock-data";
import { BestWindowsCard } from "./best-windows";
import { NextReleaseCard } from "./next-release";
import { TimingRulesCard } from "./timing-rules";

// Thursday 20:00–22:00 — matches peakWindowLabel ("Tonight 8:00–10:30 PM IST").
const PEAK_KEYS = ["3-20", "3-21", "3-22"];

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description="Posts wait for the window where they'll hit hardest."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>When this audience is awake</CardTitle>
            <CardDescription>
              Engagement strength per slot, learned from 30 days of post
              performance. Ringed cells are tonight&apos;s peak window.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Heatmap slots={scheduleHeatmap} highlightKeys={PEAK_KEYS} />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <NextReleaseCard />
          <TimingRulesCard />
        </div>
      </div>
      <BestWindowsCard />
    </div>
  );
}
