"use client";

import { BarChart3 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  VIZ,
  axisProps,
  gridProps,
  tooltipContentStyle,
  tooltipCursor,
  tooltipLabelStyle,
} from "@/components/charts/chart-theme";
import { compact, shortDate, usd } from "@/lib/format";
import {
  HOOK_LABELS,
  type FollowerPoint,
  type HookAngle,
  type Post,
} from "@/lib/types";

// Bar-chart cursor is a band rectangle; keep its fill on the recessive grid token.
const barCursor = { ...tooltipCursor, fill: "var(--viz-grid)" } as const;

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-64">{children}</CardContent>
    </Card>
  );
}

export function FollowerGrowthChart({ series }: { series: FollowerPoint[] }) {
  return (
    <ChartCard
      title="Follower growth"
      description="Daily follower count over the selected range"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="follower-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--viz-1)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--viz-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="date"
            {...axisProps}
            tickFormatter={shortDate}
            minTickGap={32}
          />
          <YAxis
            {...axisProps}
            width={44}
            tickFormatter={compact}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            cursor={tooltipCursor}
            formatter={(v) => compact(Number(v))}
            labelFormatter={(l) => shortDate(String(l))}
          />
          <Area
            type="monotone"
            dataKey="followers"
            name="Followers"
            stroke="var(--viz-1)"
            strokeWidth={2}
            fill="url(#follower-fill)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DailyImpressionsChart({ series }: { series: FollowerPoint[] }) {
  return (
    <ChartCard
      title="Daily impressions"
      description="Account-wide impressions per day"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={series} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="date"
            {...axisProps}
            tickFormatter={shortDate}
            minTickGap={32}
          />
          <YAxis {...axisProps} width={44} tickFormatter={compact} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            cursor={barCursor}
            formatter={(v) => compact(Number(v))}
            labelFormatter={(l) => shortDate(String(l))}
          />
          <Bar
            dataKey="impressions"
            name="Impressions"
            fill="var(--viz-1)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RevenueCumulativeChart({ series }: { series: FollowerPoint[] }) {
  let running = 0;
  const data = series.map((p) => {
    running += p.revenue;
    return { date: p.date, revenue: Math.round(running * 100) / 100 };
  });
  return (
    <ChartCard
      title="Revenue (cumulative)"
      description="Est. ad revenue share, running total"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey="date"
            {...axisProps}
            tickFormatter={shortDate}
            minTickGap={32}
          />
          <YAxis
            {...axisProps}
            width={52}
            tickFormatter={(v) => usd(Number(v))}
          />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            cursor={tooltipCursor}
            formatter={(v) => usd(Number(v))}
            labelFormatter={(l) => shortDate(String(l))}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="var(--viz-2)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function HookAngleChart({ posts }: { posts: Post[] }) {
  const byHook = new Map<HookAngle, number[]>();
  for (const p of posts) {
    const arr = byHook.get(p.hook) ?? [];
    arr.push(p.metrics.impressions);
    byHook.set(p.hook, arr);
  }
  const data = [...byHook.entries()]
    .map(([hook, vals]) => ({
      hook,
      label: HOOK_LABELS[hook],
      avg: Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
    }))
    .sort((a, b) => b.avg - a.avg);

  return (
    <ChartCard
      title="Impressions by hook angle"
      description="Average impressions per post by hook"
    >
      {data.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No posts in range"
          description="Hook performance appears once posts land in this window."
          className="h-full py-0"
        />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 44, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="label" {...axisProps} width={80} />
            <Tooltip
              contentStyle={tooltipContentStyle}
              labelStyle={tooltipLabelStyle}
              cursor={barCursor}
              formatter={(v) => compact(Number(v))}
            />
            <Bar
              dataKey="avg"
              name="Avg impressions"
              fill="var(--viz-1)"
              radius={[0, 4, 4, 0]}
              maxBarSize={20}
            >
              <LabelList
                dataKey="avg"
                position="right"
                formatter={(v) => compact(Number(v))}
                fill={VIZ.inkSecondary}
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
