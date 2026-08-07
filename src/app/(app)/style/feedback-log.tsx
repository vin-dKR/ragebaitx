"use client";

import {
  ArrowRight,
  Check,
  MessagesSquare,
  PenLine,
  X,
  type LucideIcon,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { timeAgo } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { FeedbackEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const ACTION_META: Record<
  FeedbackEvent["action"],
  { icon: LucideIcon; className: string; label: string }
> = {
  approved: { icon: Check, className: "text-status-good", label: "Approved" },
  edited: { icon: PenLine, className: "text-status-warning", label: "Edited" },
  rejected: { icon: X, className: "text-status-critical", label: "Rejected" },
};

export function FeedbackLog() {
  const feedback = useAppStore((s) => s.feedback);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback log</CardTitle>
        <CardDescription>
          Every review decision — and what the profile took from it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {feedback.length === 0 ? (
          <EmptyState
            icon={MessagesSquare}
            title="No feedback yet"
            description="Approve, edit or reject drafts in the queue to start training the profile."
          />
        ) : (
          <ScrollArea className="h-96">
            <div className="divide-y pr-3">
              {feedback.map((f) => {
                const meta = ACTION_META[f.action];
                const Icon = meta.icon;
                return (
                  <div key={f.id} className="flex items-start gap-3 py-3 first:pt-0">
                    <Icon
                      aria-hidden
                      className={cn("mt-0.5 h-4 w-4 shrink-0", meta.className)}
                    />
                    <span className="sr-only">{meta.label}</span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate text-xs text-muted-foreground">
                        {f.draftText}
                      </p>
                      <p className="text-sm leading-snug">{f.detail}</p>
                      {f.lesson ? (
                        <p className="flex items-start gap-1 text-xs text-brand">
                          <ArrowRight
                            aria-hidden
                            className="mt-0.5 h-3 w-3 shrink-0"
                          />
                          <span>{f.lesson}</span>
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground tnum">
                      {timeAgo(f.at)}
                    </span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
