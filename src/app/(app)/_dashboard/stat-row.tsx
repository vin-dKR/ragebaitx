"use client";

import { Sparkline } from "@/components/charts/sparkline";
import { StatTile } from "@/components/shared/stat-tile";
import { compact, pct, signedCompact, usd } from "@/lib/format";
import { followerSeries } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";

const last7 = followerSeries.slice(-7);
const prev7 = followerSeries.slice(-14, -7);
const followerDelta30d =
  followerSeries[followerSeries.length - 1].followers -
  followerSeries[0].followers;
const impressions7d = last7.reduce((s, p) => s + p.impressions, 0);
const impressionsPrev7d = prev7.reduce((s, p) => s + p.impressions, 0);
const impressionsWow = Math.round(
  ((impressions7d - impressionsPrev7d) / impressionsPrev7d) * 100,
);
const revenue7d = last7.reduce((s, p) => s + p.revenue, 0);
const revenuePrev7d = prev7.reduce((s, p) => s + p.revenue, 0);
const revenueWow = Math.round(
  ((revenue7d - revenuePrev7d) / revenuePrev7d) * 100,
);

export function StatRow() {
  const followers = useAppStore((s) => s.config.xAccount.followers);
  const drafts = useAppStore((s) => s.drafts);
  const pending = drafts.filter((d) => d.status === "pending").length;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatTile
        label="Followers"
        value={compact(followers)}
        delta={`${signedCompact(followerDelta30d)} 30d`}
        deltaGood={followerDelta30d >= 0}
      >
        <Sparkline data={followerSeries.map((p) => p.followers)} />
      </StatTile>
      <StatTile
        label="Impressions 7d"
        value={compact(impressions7d)}
        delta={pct(impressionsWow)}
        deltaGood={impressionsWow >= 0}
      >
        <Sparkline data={last7.map((p) => p.impressions)} />
      </StatTile>
      <StatTile
        label="Est. revenue 7d"
        value={usd(revenue7d)}
        delta={pct(revenueWow)}
        deltaGood={revenueWow >= 0}
      >
        <Sparkline data={last7.map((p) => p.revenue)} />
      </StatTile>
      <StatTile
        label="Pending drafts"
        value={String(pending)}
        hint="awaiting your review"
      />
    </div>
  );
}
