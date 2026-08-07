"use client";

import Link from "next/link";
import { ChevronRight, Inbox, Zap } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ModelChip } from "@/components/shared/model-chip";
import { ScoreRing } from "@/components/shared/score-ring";
import { TrendPill } from "@/components/shared/trend-pill";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import type { Draft } from "@/lib/types";

function bestVirality(d: Draft): number {
  return Math.max(...d.variants.map((v) => v.viralityScore));
}

export function NeedsAttention({ className }: { className?: string }) {
  const drafts = useAppStore((s) => s.drafts);
  const newsById = useAppStore((s) => s.newsById);
  const autoThreshold = useAppStore((s) => s.config.autoThreshold);
  const pending = drafts.filter((d) => d.status === "pending");
  const top = [...pending]
    .sort((a, b) => bestVirality(b) - bestVirality(a))
    .slice(0, 3);
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Needs attention</CardTitle>
        <CardDescription>
          {pending.length > 0
            ? `Top of ${pending.length} pending — highest virality first`
            : "Nothing waiting on you"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {top.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Queue is clear"
            description="New drafts land here as the crawler finds stories worth posting."
          />
        ) : (
          <ul className="space-y-1">
            {top.map((d) => {
              const news = newsById(d.newsItemId);
              const models = [...new Set(d.variants.map((v) => v.model))];
              return (
                <li key={d.id}>
                  <Link
                    href="/queue"
                    className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <ScoreRing
                      value={bestVirality(d)}
                      threshold={autoThreshold}
                      size={36}
                    />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <p className="truncate text-sm font-medium">
                        {news?.headline ?? "Source story removed"}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {news ? <TrendPill state={news.trendState} /> : null}
                        {models.map((m) => (
                          <ModelChip key={m} model={m} short />
                        ))}
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          {d.wouldAutoPost ? (
                            <>
                              <Zap className="h-3 w-3" />
                              Would auto-post in Live
                            </>
                          ) : (
                            "Below auto threshold"
                          )}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
