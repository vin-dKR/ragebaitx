"use client";

import { useState } from "react";
import { Check, Flame, PencilLine, X } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { HookBadge } from "@/components/shared/hook-badge";
import { MediaThumb } from "@/components/shared/media-thumb";
import { ModelChip } from "@/components/shared/model-chip";
import { ScoreRing } from "@/components/shared/score-ring";
import { TrendPill } from "@/components/shared/trend-pill";
import { compact, timeAgo } from "@/lib/format";
import { editDistancePct, useAppStore } from "@/lib/store";
import { HOOK_LABELS, MODEL_META, type Draft } from "@/lib/types";
import { cn } from "@/lib/utils";

const REASON_MIN = 10;
const CHAR_LIMIT = 280;

export function DraftDetail({
  draft,
  onResolved,
}: {
  draft: Draft;
  onResolved: () => void;
}) {
  const news = useAppStore((s) =>
    s.newsItems.find((n) => n.id === draft.newsItemId),
  );
  const autoThreshold = useAppStore((s) => s.config.autoThreshold);
  const safetyFloor = useAppStore((s) => s.config.safetyFloor);
  const editLimit = useAppStore((s) => s.benchmark.editDistanceLimit);
  const streak = useAppStore((s) => s.benchmark.streak);
  const target = useAppStore((s) => s.benchmark.target);
  const selectVariant = useAppStore((s) => s.selectVariant);
  const editDraft = useAppStore((s) => s.editDraft);
  const approveDraft = useAppStore((s) => s.approveDraft);
  const rejectDraft = useAppStore((s) => s.rejectDraft);

  const [editing, setEditing] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  const selectedVariant =
    draft.variants.find((v) => v.id === draft.selectedVariantId) ??
    draft.variants[0];
  const draftText = draft.editedText ?? selectedVariant.text;
  const dist = draft.editedText
    ? editDistancePct(selectedVariant.text, draft.editedText)
    : 0;

  const handleTabChange = (variantId: string) => {
    setEditing(false);
    selectVariant(draft.id, variantId);
  };

  const handleCancelEdit = () => {
    selectVariant(draft.id, selectedVariant.id);
    setEditing(false);
  };

  const handleApprove = () => {
    approveDraft(draft.id);
    const { benchmark: b, config: c } = useAppStore.getState();
    toast.success(
      c.timing.holdForPeak
        ? "Approved — held for tonight's peak window"
        : "Approved — posted now",
      {
        description:
          b.streak === 0
            ? `Edit over ${b.editDistanceLimit}% — benchmark streak reset`
            : `Benchmark streak ${b.streak}/${b.target}${
                b.graduated ? " — Live unlocked" : ""
              }`,
      },
    );
    onResolved();
  };

  const handleReject = () => {
    rejectDraft(draft.id, reason.trim());
    toast("Rejected — the profile learns from this", {
      description: "Benchmark streak reset to 0.",
    });
    setRejectOpen(false);
    setReason("");
    onResolved();
  };

  return (
    <div className="min-w-0 space-y-4">
      {draft.wouldAutoPost ? (
        <div className="flex items-center gap-2 rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand">
          <Flame className="h-4 w-4 shrink-0" />
          Scores clear the Live threshold — this would have auto-posted.
        </div>
      ) : null}

      {news ? (
        <Card size="sm">
          <CardContent className="flex flex-col gap-4 sm:flex-row">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  @{news.sourceHandle}
                </span>
                <Badge variant="outline">{news.topic}</Badge>
                <TrendPill state={news.trendState} delta={news.velocityDelta} />
                <span className="tnum">{compact(news.velocity)} eng/hr</span>
                <span className="tnum">{timeAgo(news.foundAt)}</span>
              </div>
              <p className="font-medium leading-snug">{news.headline}</p>
              <p className="text-sm text-muted-foreground">{news.summary}</p>
            </div>
            {news.media ? (
              <MediaThumb media={news.media} className="h-28 w-48 shrink-0" />
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent>
          <Tabs
            value={draft.selectedVariantId}
            onValueChange={(v) => handleTabChange(v as string)}
          >
            <div className="max-w-full overflow-x-auto">
              <TabsList>
                {draft.variants.map((v) => (
                  <TabsTrigger key={v.id} value={v.id}>
                    {MODEL_META[v.model].short} · {HOOK_LABELS[v.hook]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {draft.variants.map((variant) => {
              const isSelected = variant.id === selectedVariant.id;
              const text = isSelected ? draftText : variant.text;
              const over = text.length > CHAR_LIMIT;
              const distWarn = dist > editLimit;
              return (
                <TabsContent
                  key={variant.id}
                  value={variant.id}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <ModelChip model={variant.model} />
                    <HookBadge hook={variant.hook} />
                    {isSelected && draft.editedText && !editing ? (
                      <Badge variant="outline">
                        Edited · <span className="tnum">{dist}%</span> changed
                      </Badge>
                    ) : null}
                  </div>

                  {isSelected && editing ? (
                    <div className="space-y-2">
                      <Label htmlFor="variant-edit" className="sr-only">
                        Edit post text
                      </Label>
                      <Textarea
                        id="variant-edit"
                        rows={6}
                        value={draftText}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (next === variant.text)
                            selectVariant(draft.id, variant.id);
                          else editDraft(draft.id, next);
                        }}
                        className="text-[15px] leading-relaxed"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p
                          className={cn(
                            "text-xs",
                            distWarn
                              ? "text-status-warning"
                              : "text-muted-foreground",
                          )}
                        >
                          <span className="tnum">{dist}%</span> changed — counts
                          as clean approve under{" "}
                          <span className="tnum">{editLimit}%</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "tnum text-xs",
                              over
                                ? "text-status-critical"
                                : "text-muted-foreground",
                            )}
                          >
                            {text.length}/{CHAR_LIMIT}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditing(false)}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="whitespace-pre-wrap rounded-lg border border-border p-4 text-[15px] leading-relaxed">
                        {text}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={cn(
                            "tnum text-xs",
                            over
                              ? "text-status-critical"
                              : "text-muted-foreground",
                          )}
                        >
                          {text.length}/{CHAR_LIMIT}
                        </span>
                        {isSelected ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditing(true)}
                          >
                            <PencilLine />
                            Edit
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-8">
                    <ScoreRing
                      value={variant.viralityScore}
                      threshold={autoThreshold}
                      label="Virality"
                    />
                    <ScoreRing
                      value={variant.safetyScore}
                      threshold={safetyFloor}
                      label="Safety"
                    />
                    <ScoreRing
                      value={variant.styleMatchScore}
                      threshold={75}
                      label="Style match"
                    />
                  </div>

                  <div className="rounded-lg bg-muted/40 p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Why the model wrote it this way
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {variant.reasoning}
                    </p>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background p-3 lg:static">
        <Button size="lg" onClick={handleApprove}>
          <Check />
          Approve
        </Button>
        <Button
          size="lg"
          variant="destructive"
          onClick={() => setRejectOpen(true)}
        >
          <X />
          Reject
        </Button>
        <p className="ml-auto text-xs text-muted-foreground">
          Streak{" "}
          <span className="tnum">
            {streak}/{target}
          </span>
        </p>
      </div>

      <AlertDialog
        open={rejectOpen}
        onOpenChange={(open) => {
          setRejectOpen(open);
          if (!open) setReason("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this draft?</AlertDialogTitle>
            <AlertDialogDescription>
              A reason is required — it feeds the style profile and resets the
              benchmark streak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Why is this draft wrong?</Label>
            <Textarea
              id="reject-reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Weak angle, unverified claim, off-voice…"
            />
            <p className="text-xs text-muted-foreground">
              {reason.trim().length < REASON_MIN ? (
                <>
                  At least {REASON_MIN} characters —{" "}
                  <span className="tnum">
                    {reason.trim().length}/{REASON_MIN}
                  </span>
                </>
              ) : (
                "Logged to the feedback trail."
              )}
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={reason.trim().length < REASON_MIN}
              onClick={handleReject}
            >
              Reject draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
