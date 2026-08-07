"use client";

import { Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { useAppStore } from "@/lib/store";

import { CompetitorCard } from "./competitor-card";
import { TrackAccountDialog } from "./track-account-dialog";

export default function CompetitorsPage() {
  const competitors = useAppStore((s) => s.competitors);
  const sorted = [...competitors].sort(
    (a, b) => Number(b.tracked) - Number(a.tracked),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Competitors"
        description="Accounts the profiler studies for working patterns."
      >
        <TrackAccountDialog />
      </PageHeader>

      {sorted.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No accounts tracked"
          description="Track a competitor and the profiler starts extracting its working patterns within a day."
        >
          <TrackAccountDialog />
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((competitor) => (
            <CompetitorCard key={competitor.id} competitor={competitor} />
          ))}
        </div>
      )}
    </div>
  );
}
