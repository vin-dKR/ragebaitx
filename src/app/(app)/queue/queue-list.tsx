"use client";

import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Flame,
  Send,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModelChip } from "@/components/shared/model-chip";
import { ScoreRing } from "@/components/shared/score-ring";
import { timeAgo } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { Draft, DraftStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const REVIEWED_META: Record<
  Exclude<DraftStatus, "pending">,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "text-status-good",
  },
  scheduled: {
    label: "Scheduled",
    icon: CalendarClock,
    className: "text-status-good",
  },
  posted: { label: "Posted", icon: Send, className: "text-status-good" },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "text-status-critical",
  },
};

export function QueueList({
  pending,
  reviewed,
  selectedId,
  onSelect,
}: {
  pending: Draft[];
  reviewed: Draft[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const newsItems = useAppStore((s) => s.newsItems);
  const autoThreshold = useAppStore((s) => s.config.autoThreshold);

  const headlineFor = (d: Draft) =>
    newsItems.find((n) => n.id === d.newsItemId)?.headline ??
    d.variants[0].text;

  return (
    <div className="min-w-0 space-y-4">
      <Card className="gap-0 py-0">
        <p className="border-b border-border px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Pending review · <span className="tnum">{pending.length}</span>
        </p>
        <TooltipProvider>
          <ul className="divide-y divide-border">
            {pending.map((draft) => {
              const isSelected = draft.id === selectedId;
              const models = [...new Set(draft.variants.map((v) => v.model))];
              const best = Math.max(
                ...draft.variants.map((v) => v.viralityScore),
              );
              return (
                <li key={draft.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(draft.id)}
                    className={cn(
                      "relative flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                      isSelected && "bg-accent hover:bg-accent",
                    )}
                  >
                    {isSelected ? (
                      <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-brand" />
                    ) : null}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <p className="line-clamp-2 text-sm font-medium leading-snug">
                        {headlineFor(draft)}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="tnum text-xs text-muted-foreground">
                          {draft.variants.length}{" "}
                          {draft.variants.length === 1 ? "variant" : "variants"}
                        </span>
                        {models.map((m) => (
                          <ModelChip key={m} model={m} short />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="tnum">{timeAgo(draft.createdAt)}</span>
                        {draft.wouldAutoPost ? (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <span className="inline-flex items-center gap-0.5 text-brand" />
                              }
                            >
                              <Flame className="h-3 w-3" />
                              auto
                            </TooltipTrigger>
                            <TooltipContent>
                              Would auto-post in Live mode
                            </TooltipContent>
                          </Tooltip>
                        ) : null}
                      </div>
                    </div>
                    <ScoreRing
                      value={best}
                      threshold={autoThreshold}
                      size={32}
                      className="shrink-0"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </Card>
      <ReviewedSection reviewed={reviewed} />
    </div>
  );
}

export function ReviewedSection({
  reviewed,
  defaultOpen = false,
}: {
  reviewed: Draft[];
  defaultOpen?: boolean;
}) {
  const newsItems = useAppStore((s) => s.newsItems);
  const [open, setOpen] = useState(defaultOpen);

  if (reviewed.length === 0) return null;

  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>
          Recently reviewed · <span className="tnum">{reviewed.length}</span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <ul className="divide-y divide-border border-t border-border">
          {reviewed.map((draft) => {
            const meta =
              REVIEWED_META[draft.status as Exclude<DraftStatus, "pending">];
            const Icon = meta.icon;
            const headline =
              newsItems.find((n) => n.id === draft.newsItemId)?.headline ??
              draft.variants[0].text;
            return (
              <li key={draft.id} className="flex items-start gap-2.5 px-4 py-2.5">
                <Icon
                  className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", meta.className)}
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs">{headline}</p>
                  <p className="text-xs text-muted-foreground">
                    {meta.label} ·{" "}
                    <span className="tnum">{timeAgo(draft.createdAt)}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
