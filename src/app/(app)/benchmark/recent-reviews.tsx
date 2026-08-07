"use client";

import { Check, History, PenLine, X } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
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
import { timeAgo } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { BenchmarkReview } from "@/lib/types";
import { cn } from "@/lib/utils";

function Verdict({ review }: { review: BenchmarkReview }) {
  if (!review.approved) {
    return (
      <span className="inline-flex items-center gap-1.5 text-status-critical">
        <X className="h-3.5 w-3.5" />
        Rejected
      </span>
    );
  }
  if (review.editDistancePct === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-status-good">
        <Check className="h-3.5 w-3.5" />
        Clean
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-status-warning">
      <PenLine className="h-3.5 w-3.5" />
      <span>
        Edited <span className="tnum">{review.editDistancePct}%</span>
      </span>
    </span>
  );
}

export function RecentReviewsCard({ className }: { className?: string }) {
  const recent = useAppStore((s) => s.benchmark.recent);
  const limit = useAppStore((s) => s.config.editDistanceLimit);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent reviews</CardTitle>
        <CardDescription>
          The decisions that moved — or reset — the streak
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <EmptyState
            icon={History}
            title="No reviews yet"
            description="Approve or reject drafts in the queue and they will show up here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Draft</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead className="text-center">Streak</TableHead>
                <TableHead className="text-right">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((r) => {
                const counts = r.approved && r.editDistancePct <= limit;
                return (
                  <TableRow key={`${r.draftId}-${r.at}`}>
                    <TableCell className="max-w-[320px]">
                      <span className="block truncate">{r.headline}</span>
                    </TableCell>
                    <TableCell>
                      <Verdict review={r} />
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          "inline-block h-1.5 w-1.5 rounded-full",
                          counts ? "bg-status-good" : "bg-border",
                        )}
                      />
                      <span className="sr-only">
                        {counts
                          ? "Counts toward streak"
                          : "Does not count toward streak"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tnum">
                      {timeAgo(r.at)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
