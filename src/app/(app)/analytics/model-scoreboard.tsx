"use client";

import type { CSSProperties } from "react";
import { Bot } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ModelChip } from "@/components/shared/model-chip";
import { EmptyState } from "@/components/shared/empty-state";
import { compact } from "@/lib/format";
import { MODEL_META, type ModelId, type Post } from "@/lib/types";

const ROW_GRID =
  "sm:grid-cols-[9rem_5rem_7rem_minmax(8rem,1fr)] sm:gap-x-4";

export function ModelScoreboard({ posts }: { posts: Post[] }) {
  const rows = (Object.keys(MODEL_META) as ModelId[])
    .map((model) => {
      const own = posts.filter((p) => p.model === model);
      if (own.length === 0) return null;
      const hits = own.filter((p) => p.outcome === "hit").length;
      const best = own.reduce((a, b) =>
        b.metrics.impressions > a.metrics.impressions ? b : a,
      );
      return {
        model,
        count: own.length,
        avg: Math.round(
          own.reduce((s, p) => s + p.metrics.impressions, 0) / own.length,
        ),
        hitRate: Math.round((hits / own.length) * 100),
        best,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model scoreboard</CardTitle>
        <CardDescription>
          Post volume, reach and hit rate per drafting model in the selected
          range
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyState
            icon={Bot}
            title="No posts in range"
            description="Once models publish in this window, their scoreboard appears here."
          />
        ) : (
          <div className="divide-y divide-border">
            <div
              className={`hidden pb-2 text-[10px] uppercase tracking-wide text-muted-foreground sm:grid ${ROW_GRID}`}
            >
              <span>Model</span>
              <span className="text-right">Posts</span>
              <span className="text-right">Avg impressions</span>
              <span>Hit rate</span>
            </div>
            {rows.map((r) => {
              const meta = MODEL_META[r.model];
              return (
                <div key={r.model} className="space-y-1.5 py-3 last:pb-0">
                  <div
                    className={`grid grid-cols-2 items-center gap-x-4 gap-y-2 ${ROW_GRID}`}
                  >
                    <ModelChip model={r.model} className="justify-self-start" />
                    <span className="tnum text-right text-xs text-muted-foreground">
                      {r.count} posts
                    </span>
                    <span className="tnum text-sm font-medium sm:text-right">
                      {compact(r.avg)}
                    </span>
                    <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                      <Progress
                        value={r.hitRate}
                        aria-label={`${meta.label} hit rate`}
                        className="flex-1 [&_[data-slot=progress-indicator]]:bg-(--model-color)"
                        style={{ "--model-color": meta.color } as CSSProperties}
                      />
                      <span className="tnum w-9 text-right text-xs text-muted-foreground">
                        {r.hitRate}%
                      </span>
                    </div>
                  </div>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {r.best.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
