"use client";

import type { Post } from "@/lib/types";
import { compact, timeAgo, usd } from "@/lib/format";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MediaThumb } from "@/components/shared/media-thumb";
import { ModelChip } from "@/components/shared/model-chip";
import { OutcomeBadge } from "@/components/shared/outcome-badge";

export function PostsTable({
  posts,
  onSelect,
}: {
  posts: Post[];
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="gap-0 py-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-72 pl-4">Post</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead className="text-right">Impressions</TableHead>
            <TableHead className="text-right">Engagement</TableHead>
            <TableHead className="text-right">+Followers</TableHead>
            <TableHead className="text-right">Est. $</TableHead>
            <TableHead>Via</TableHead>
            <TableHead className="pr-4 text-right">When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow
              key={post.id}
              tabIndex={0}
              aria-label={`Open post detail: ${post.text.slice(0, 60)}`}
              onClick={() => onSelect(post.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(post.id);
                }
              }}
              className="cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
            >
              <TableCell className="whitespace-normal py-3 pl-4">
                <div className="flex items-center gap-3">
                  {post.media ? (
                    <MediaThumb
                      media={post.media}
                      className="h-10 w-16 shrink-0"
                      showCredit={false}
                    />
                  ) : null}
                  <p className="line-clamp-2 max-w-md text-sm font-medium">
                    {post.text}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <OutcomeBadge outcome={post.outcome} />
              </TableCell>
              <TableCell className="tnum text-right">
                {compact(post.metrics.impressions)}
              </TableCell>
              <TableCell className="tnum text-right">
                {compact(
                  post.metrics.likes +
                    post.metrics.reposts +
                    post.metrics.replies,
                )}
              </TableCell>
              <TableCell className="tnum text-right">
                {compact(post.metrics.followersGained)}
              </TableCell>
              <TableCell className="tnum text-right">
                {usd(post.estRevenue)}
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1.5">
                  <ModelChip model={post.model} short />
                  {post.autoPosted ? (
                    <span className="rounded border border-border bg-muted/40 px-1 py-px text-[10px] font-medium tracking-wide text-muted-foreground">
                      AUTO
                    </span>
                  ) : null}
                </span>
              </TableCell>
              <TableCell className="tnum pr-4 text-right text-xs text-muted-foreground">
                {timeAgo(post.postedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
