"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { Sparkline } from "@/components/charts/sparkline";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppStore } from "@/lib/store";
import { followerSeries, NOW } from "@/lib/mock-data";
import { compact, signedCompact, usd } from "@/lib/format";
import {
  DailyImpressionsChart,
  FollowerGrowthChart,
  HookAngleChart,
  RevenueCumulativeChart,
} from "./analytics-charts";
import { ModelScoreboard } from "./model-scoreboard";
import { TopicTable } from "./topic-table";

const DAY = 86_400_000;
const RANGES = { "7d": 7, "30d": 30 } as const;
type Range = keyof typeof RANGES;

export default function AnalyticsPage() {
  const posts = useAppStore((s) => s.posts);
  const [range, setRange] = useState<Range>("30d");
  const days = RANGES[range];

  const series = useMemo(
    () => (range === "7d" ? followerSeries.slice(-7) : followerSeries),
    [range],
  );
  const rangePosts = useMemo(
    () =>
      posts.filter(
        (p) => NOW.getTime() - new Date(p.postedAt).getTime() <= days * DAY,
      ),
    [posts, days],
  );

  const growth =
    series[series.length - 1].followers - series[0].followers;
  const impressions = series.reduce((s, p) => s + p.impressions, 0);
  const revenue = series.reduce((s, p) => s + p.revenue, 0);
  const hits = rangePosts.filter((p) => p.outcome === "hit").length;
  const hitRate = rangePosts.length
    ? Math.round((hits / rangePosts.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="What is working — growth, reach and revenue across the account."
      >
        <ToggleGroup
          variant="outline"
          size="sm"
          spacing={0}
          value={[range]}
          onValueChange={(value) => {
            const next = value[0] as Range | undefined;
            if (next) setRange(next);
          }}
          aria-label="Time range"
        >
          <ToggleGroupItem value="7d">7d</ToggleGroupItem>
          <ToggleGroupItem value="30d">30d</ToggleGroupItem>
        </ToggleGroup>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Follower growth" value={signedCompact(growth)}>
          <Sparkline data={series.map((p) => p.followers)} />
        </StatTile>
        <StatTile label="Impressions" value={compact(impressions)} />
        <StatTile label="Est. revenue" value={usd(revenue)} />
        <StatTile
          label="Hit rate"
          value={`${hitRate}%`}
          hint="posts that beat 500K impressions"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FollowerGrowthChart series={series} />
        <DailyImpressionsChart series={series} />
        <RevenueCumulativeChart series={series} />
        <HookAngleChart posts={rangePosts} />
      </div>

      <ModelScoreboard posts={rangePosts} />
      <TopicTable posts={rangePosts} />
    </div>
  );
}
