"use client";

import { useState } from "react";
import Link from "next/link";
import { PenLine, Search, SearchX } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { MediaThumb } from "@/components/shared/media-thumb";
import { TrendPill } from "@/components/shared/trend-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { compact, timeAgo } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { NewsItem, TrendState } from "@/lib/types";

type TrendFilter = "all" | TrendState;

const TREND_FILTERS: { value: TrendFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "rising", label: "Rising" },
  { value: "peaking", label: "Peaking" },
  { value: "fading", label: "Fading" },
];

export function SourceFeed() {
  const newsItems = useAppStore((s) => s.newsItems);
  const topics = useAppStore((s) => s.config.topics);
  const [topic, setTopic] = useState("all");
  const [trend, setTrend] = useState<TrendFilter>("all");

  const topicItems: Record<string, string> = {
    all: "All topics",
    ...Object.fromEntries(topics.map((t) => [t, t])),
  };

  const items = newsItems
    .filter(
      (n) =>
        (topic === "all" || n.topic === topic) &&
        (trend === "all" || n.trendState === trend),
    )
    .sort(
      (a, b) =>
        Number(b.trendState === "rising") - Number(a.trendState === "rising") ||
        b.velocity - a.velocity,
    );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          items={topicItems}
          value={topic}
          onValueChange={(v) => setTopic(v as string)}
        >
          <SelectTrigger size="sm" className="w-40" aria-label="Filter by topic">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(topicItems).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ToggleGroup
          variant="outline"
          size="sm"
          value={[trend]}
          onValueChange={(v) => setTrend((v[0] as TrendFilter) ?? "all")}
          aria-label="Filter by trend state"
        >
          {TREND_FILTERS.map((f) => (
            <ToggleGroupItem key={f.value} value={f.value}>
              {f.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="tnum ml-auto text-xs text-muted-foreground">
          {items.length} of {newsItems.length} stories
        </p>
      </div>
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((n) => (
            <FeedRow key={n.id} item={n} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No stories match these filters"
          description="Widen the topic or trend filter, or run a keyword sweep to pull in fresh candidates."
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTopic("all");
              setTrend("all");
            }}
          >
            Clear filters
          </Button>
        </EmptyState>
      )}
    </div>
  );
}

function FeedRow({ item }: { item: NewsItem }) {
  const requestDraft = useAppStore((s) => s.requestDraft);

  const draft = () => {
    requestDraft(item.id);
    toast.success("Drafting 2 variants…", {
      description: "They will land in the review queue in a moment.",
    });
  };

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              @{item.sourceHandle}
            </span>
            <Badge variant="outline">{item.topic}</Badge>
            <TrendPill state={item.trendState} delta={item.velocityDelta} />
            {item.via === "keyword" && item.keywordUsed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">
                <Search className="h-3 w-3" />
                {item.keywordUsed}
              </span>
            ) : null}
          </div>
          <p className="text-sm leading-snug font-medium">{item.headline}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.summary}
          </p>
          <p className="tnum text-xs text-muted-foreground">
            {compact(item.velocity)} eng/hr · {compact(item.likes)} likes ·{" "}
            {compact(item.reposts)} reposts · {timeAgo(item.foundAt)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
          {item.media ? (
            <MediaThumb media={item.media} className="h-20 w-32" />
          ) : null}
          {item.drafted ? (
            <Link
              href="/queue"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Drafted ✓
            </Link>
          ) : (
            <Button size="sm" variant="outline" onClick={draft}>
              <PenLine />
              Draft this
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
