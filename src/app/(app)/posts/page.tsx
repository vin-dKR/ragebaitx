"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Post, PostOutcome } from "@/lib/types";
import { compact, signedCompact, usd } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostsTable } from "./posts-table";
import { PostDetailSheet } from "./post-detail-sheet";

type OutcomeFilter = PostOutcome | "all";

const OUTCOME_OPTIONS: { value: OutcomeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hit", label: "Hit" },
  { value: "solid", label: "Solid" },
  { value: "flop", label: "Flop" },
];

export default function PostsPage() {
  const posts = useAppStore((s) => s.posts);
  const [outcome, setOutcome] = useState<OutcomeFilter>("all");
  const [topic, setTopic] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const totals = useMemo(
    () =>
      posts.reduce(
        (acc, p) => ({
          impressions: acc.impressions + p.metrics.impressions,
          followers: acc.followers + p.metrics.followersGained,
          revenue: acc.revenue + p.estRevenue,
        }),
        { impressions: 0, followers: 0, revenue: 0 },
      ),
    [posts],
  );

  const topics = useMemo(
    () => Array.from(new Set(posts.map((p) => p.topic))).sort(),
    [posts],
  );

  const topicItems = useMemo(
    () => ({
      all: "All topics",
      ...Object.fromEntries(topics.map((t) => [t, t])),
    }),
    [topics],
  );

  const filtered = useMemo(
    () =>
      [...posts]
        .sort(
          (a, b) =>
            new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
        )
        .filter(
          (p) =>
            (outcome === "all" || p.outcome === outcome) &&
            (topic === "all" || p.topic === topic),
        ),
    [posts, outcome, topic],
  );

  const selected: Post | null = posts.find((p) => p.id === selectedId) ?? null;
  const filtersActive = outcome !== "all" || topic !== "all";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Posts"
        description="Everything published to @BharatUncut, with per-post performance."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Total posts" value={`${posts.length}`} />
        <StatTile
          label="Total impressions"
          value={compact(totals.impressions)}
        />
        <StatTile
          label="Followers gained"
          value={signedCompact(totals.followers)}
        />
        <StatTile
          label="Est. revenue"
          value={usd(totals.revenue)}
          hint="Ads rev share, all posts"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          aria-label="Filter by outcome"
          variant="outline"
          size="sm"
          spacing={0}
          value={[outcome]}
          onValueChange={(v) =>
            setOutcome((v[0] as OutcomeFilter | undefined) ?? "all")
          }
        >
          {OUTCOME_OPTIONS.map((o) => (
            <ToggleGroupItem key={o.value} value={o.value}>
              {o.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Select
          items={topicItems}
          value={topic}
          onValueChange={(v) => setTopic(v ?? "all")}
        >
          <SelectTrigger size="sm" className="min-w-36" aria-label="Filter by topic">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All topics</SelectItem>
            {topics.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="tnum ml-auto text-xs text-muted-foreground">
          {filtered.length} of {posts.length} posts
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={filtersActive ? "No posts match these filters" : "Nothing published yet"}
          description={
            filtersActive
              ? "Try a different outcome or topic."
              : "Approved drafts land here once they go out."
          }
        >
          {filtersActive ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOutcome("all");
                setTopic("all");
              }}
            >
              Reset filters
            </Button>
          ) : null}
        </EmptyState>
      ) : (
        <PostsTable posts={filtered} onSelect={setSelectedId} />
      )}

      <PostDetailSheet
        post={selected}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </div>
  );
}
