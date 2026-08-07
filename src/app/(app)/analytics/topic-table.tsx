"use client";

import { Flame, Newspaper } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { compact } from "@/lib/format";
import type { Post } from "@/lib/types";

export function TopicTable({ posts }: { posts: Post[] }) {
  const byTopic = new Map<string, Post[]>();
  for (const p of posts) {
    const arr = byTopic.get(p.topic) ?? [];
    arr.push(p);
    byTopic.set(p.topic, arr);
  }
  const rows = [...byTopic.entries()]
    .map(([topic, own]) => {
      const hits = own.filter((p) => p.outcome === "hit").length;
      return {
        topic,
        count: own.length,
        avg: Math.round(
          own.reduce((s, p) => s + p.metrics.impressions, 0) / own.length,
        ),
        hitRate: Math.round((hits / own.length) * 100),
      };
    })
    .sort((a, b) => b.avg - a.avg);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic performance</CardTitle>
        <CardDescription>
          Where the reach is coming from in the selected range
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No posts in range"
            description="Topic performance appears once posts land in this window."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead className="text-right">Posts</TableHead>
                <TableHead className="text-right">Avg impressions</TableHead>
                <TableHead className="text-right">Hit rate</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={r.topic}>
                  <TableCell className="font-medium">{r.topic}</TableCell>
                  <TableCell className="tnum text-right text-muted-foreground">
                    {r.count}
                  </TableCell>
                  <TableCell className="tnum text-right">
                    {compact(r.avg)}
                  </TableCell>
                  <TableCell className="tnum text-right">
                    {r.hitRate}%
                  </TableCell>
                  <TableCell className="text-right">
                    {i === 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-status-good">
                        <Flame className="h-3.5 w-3.5" />
                        leaning in
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {r.hitRate === 0 ? "cooling" : "steady"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
