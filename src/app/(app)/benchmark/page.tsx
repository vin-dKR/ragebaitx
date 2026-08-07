"use client";

import { PageHeader } from "@/components/shared/page-header";
import { GraduationSettingsCard } from "./graduation-settings";
import { ModeControlCard } from "./mode-control";
import { RecentReviewsCard } from "./recent-reviews";
import { StreakHeroCard } from "./streak-hero";

export default function BenchmarkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Benchmark & Mode"
        description="Autopilot unlocks when the drafts stop needing you."
      />
      <StreakHeroCard />
      <ModeControlCard />
      <div className="grid gap-4 lg:grid-cols-3">
        <RecentReviewsCard className="lg:col-span-2" />
        <GraduationSettingsCard />
      </div>
    </div>
  );
}
