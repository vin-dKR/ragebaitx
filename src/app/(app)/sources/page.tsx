"use client";

import { PageHeader } from "@/components/shared/page-header";
import { useAppStore } from "@/lib/store";
import { KeywordSweep } from "./keyword-sweep";
import { SourceFeed } from "./source-feed";

export default function SourcesPage() {
  const pollIntervalMin = useAppStore((s) => s.config.pollIntervalMin);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sources"
        description={`The crawler scans X every ${pollIntervalMin} min for stories gaining velocity in your topics. Run a keyword sweep to chase something specific right now.`}
      />
      <KeywordSweep />
      <SourceFeed />
    </div>
  );
}
