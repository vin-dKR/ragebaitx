"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { useAppStore } from "@/lib/store";
import { DraftDetail } from "./draft-detail";
import { QueueList, ReviewedSection } from "./queue-list";

export default function QueuePage() {
  const drafts = useAppStore((s) => s.drafts);
  const streak = useAppStore((s) => s.benchmark.streak);
  const target = useAppStore((s) => s.benchmark.target);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pending = useMemo(
    () =>
      drafts
        .filter((d) => d.status === "pending")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [drafts],
  );
  const reviewed = useMemo(
    () =>
      drafts
        .filter((d) => d.status !== "pending")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [drafts],
  );

  const selected =
    pending.find((d) => d.id === selectedId) ?? pending[0] ?? null;

  const advancePast = (id: string) => {
    const idx = pending.findIndex((d) => d.id === id);
    const rest = pending.filter((d) => d.id !== id);
    setSelectedId(
      rest[Math.min(Math.max(idx, 0), rest.length - 1)]?.id ?? null,
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Draft queue"
        description="Review, edit and approve model drafts — every decision trains the profile."
      >
        <span className="text-xs text-muted-foreground">
          Benchmark streak{" "}
          <span className="tnum font-medium text-foreground">
            {streak}/{target}
          </span>
        </span>
      </PageHeader>

      {pending.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            icon={Inbox}
            title="Queue clear"
            description="New drafts land here as stories break"
          >
            <Button render={<Link href="/sources" />}>Browse sources</Button>
          </EmptyState>
          <ReviewedSection reviewed={reviewed} defaultOpen />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr] lg:items-start">
          <QueueList
            pending={pending}
            reviewed={reviewed}
            selectedId={selected?.id ?? null}
            onSelect={setSelectedId}
          />
          {selected ? (
            <DraftDetail
              key={selected.id}
              draft={selected}
              onResolved={() => advancePast(selected.id)}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
