"use client";

import { useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { BookmarkPlus } from "lucide-react";
import type { Post } from "@/lib/types";
import { compact, shortDate, shortTime, usd } from "@/lib/format";
import {
  axisProps,
  gridProps,
  tooltipContentStyle,
  tooltipCursor,
  tooltipLabelStyle,
} from "@/components/charts/chart-theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HookBadge } from "@/components/shared/hook-badge";
import { MediaThumb } from "@/components/shared/media-thumb";
import { ModelChip } from "@/components/shared/model-chip";
import { OutcomeBadge } from "@/components/shared/outcome-badge";

const METRIC_CELLS: { key: keyof Post["metrics"]; label: string }[] = [
  { key: "impressions", label: "Impressions" },
  { key: "likes", label: "Likes" },
  { key: "reposts", label: "Reposts" },
  { key: "replies", label: "Replies" },
  { key: "bookmarks", label: "Bookmarks" },
  { key: "profileVisits", label: "Profile visits" },
];

export function PostDetailSheet({
  post,
  onOpenChange,
}: {
  post: Post | null;
  onOpenChange: (open: boolean) => void;
}) {
  // Keeps the last post rendered through the close animation.
  const lastPost = useRef<Post | null>(null);
  if (post) lastPost.current = post;
  const view = post ?? lastPost.current;

  return (
    <Sheet open={post !== null} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-xl data-[side=right]:sm:max-w-xl"
      >
        {view ? (
          <>
            <SheetHeader className="border-b pr-12">
              <SheetTitle>Post detail</SheetTitle>
              <SheetDescription>
                Posted {shortDate(view.postedAt)} · {shortTime(view.postedAt)}
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-4">
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                {view.text}
              </p>
              {view.media ? (
                <MediaThumb media={view.media} className="h-40 w-full" />
              ) : null}
              <div className="flex flex-wrap items-center gap-1.5">
                <HookBadge hook={view.hook} />
                <ModelChip model={view.model} />
                <Badge variant="outline">{view.topic}</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {METRIC_CELLS.map(({ key, label }) => (
                  <div key={key}>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="tnum mt-0.5 text-base font-semibold">
                      {compact(view.metrics[key])}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Impressions — first 48h
                </p>
                <div className="mt-2 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={view.metricsHistory}
                      margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="post-impressions-fill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="var(--viz-1)"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="100%"
                            stopColor="var(--viz-1)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid {...gridProps} />
                      <XAxis
                        dataKey="t"
                        {...axisProps}
                        tickFormatter={(t: string) => shortTime(t)}
                        minTickGap={32}
                      />
                      <YAxis
                        {...axisProps}
                        width={44}
                        tickFormatter={(v: number) => compact(v)}
                      />
                      <Tooltip
                        contentStyle={tooltipContentStyle}
                        labelStyle={tooltipLabelStyle}
                        cursor={tooltipCursor}
                        formatter={(value) => [
                          compact(Number(value)),
                          "Impressions",
                        ]}
                        labelFormatter={(label) => shortTime(String(label))}
                      />
                      <Area
                        type="monotone"
                        dataKey="impressions"
                        stroke="var(--viz-1)"
                        strokeWidth={2}
                        fill="url(#post-impressions-fill)"
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <OutcomeBadge outcome={view.outcome} />
                <p className="text-sm text-muted-foreground">
                  Est. revenue{" "}
                  <span className="tnum font-medium text-foreground">
                    {usd(view.estRevenue)}
                  </span>
                </p>
              </div>
            </div>
            <SheetFooter className="border-t">
              <Button
                variant="outline"
                onClick={() => toast.success("Added to the example bank")}
              >
                <BookmarkPlus className="h-4 w-4" />
                Save as style example
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
