"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { ActivityFeed } from "./_dashboard/activity-feed";
import { ModeCard } from "./_dashboard/mode-card";
import { NeedsAttention } from "./_dashboard/needs-attention";
import { SafetyCard } from "./_dashboard/safety-card";
import { StatRow } from "./_dashboard/stat-row";
import { TonightCard } from "./_dashboard/tonight-card";

export default function DashboardPage() {
  const drafts = useAppStore((s) => s.drafts);
  const pending = drafts.filter((d) => d.status === "pending").length;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="What the machine is doing, and what needs you."
      >
        <Button render={<Link href="/queue" />}>
          <Inbox />
          Review queue
          {pending > 0 ? (
            <span className="tnum rounded-full bg-primary-foreground/20 px-1.5 text-xs">
              {pending}
            </span>
          ) : null}
        </Button>
      </PageHeader>
      <StatRow />
      <ModeCard />
      <div className="grid gap-4 lg:grid-cols-5">
        <NeedsAttention className="lg:col-span-3" />
        <ActivityFeed className="lg:col-span-2" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <TonightCard />
        <SafetyCard />
      </div>
    </div>
  );
}
