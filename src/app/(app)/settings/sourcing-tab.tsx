"use client";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { SettingSlider } from "./setting-slider";
import { TopicListCard } from "./topic-list-card";

export function SourcingTab() {
  const topics = useAppStore((s) => s.config.topics);
  const excludedTopics = useAppStore((s) => s.config.excludedTopics);
  const pollIntervalMin = useAppStore((s) => s.config.pollIntervalMin);
  const perRunLimit = useAppStore((s) => s.config.perRunLimit);
  const updateConfig = useAppStore((s) => s.updateConfig);

  const addTopic = (value: string) => {
    if (topics.some((t) => t.toLowerCase() === value.toLowerCase())) {
      toast.info(`Already tracking “${value}”`);
      return;
    }
    updateConfig({ topics: [...topics, value] });
    toast.success(`Tracking “${value}”`, {
      description: "The next crawl cycle includes it.",
    });
  };

  const removeTopic = (value: string) => {
    updateConfig({ topics: topics.filter((t) => t !== value) });
    toast.success(`Stopped tracking “${value}”`);
  };

  const addExcluded = (value: string) => {
    if (excludedTopics.some((t) => t.toLowerCase() === value.toLowerCase())) {
      toast.info(`“${value}” is already excluded`);
      return;
    }
    updateConfig({ excludedTopics: [...excludedTopics, value] });
    toast.success(`Excluding “${value}”`, {
      description: "Stories matching it never enter the pipeline.",
    });
  };

  const removeExcluded = (value: string) => {
    updateConfig({
      excludedTopics: excludedTopics.filter((t) => t !== value),
    });
    toast.success(`Removed “${value}” from exclusions`);
  };

  return (
    <>
      <TopicListCard
        title="Topics"
        description="The lanes the crawler chases stories in"
        values={topics}
        placeholder="Add a topic…"
        emptyTitle="No topics tracked"
        emptyDescription="Add at least one lane or the crawler has nothing to chase."
        onAdd={addTopic}
        onRemove={removeTopic}
      />
      <TopicListCard
        title="Excluded"
        description="Hard limits the crawler never crosses"
        values={excludedTopics}
        placeholder="Add an exclusion…"
        helper="Stories matching these never enter the pipeline."
        emptyTitle="No exclusions"
        emptyDescription="Everything the crawler finds is fair game right now."
        destructive
        onAdd={addExcluded}
        onRemove={removeExcluded}
      />
      <Card>
        <CardHeader>
          <CardTitle>Crawl cadence</CardTitle>
          <CardDescription>
            How hard the crawler works between your reviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SettingSlider
            label="Crawl interval"
            description="How often the crawler sweeps X for fresh candidates."
            value={pollIntervalMin}
            min={5}
            max={60}
            display={(v) => `Every ${v} min`}
            onChange={(v) => updateConfig({ pollIntervalMin: v })}
            onCommit={(v) => toast.success(`Crawling every ${v} min`)}
          />
          <SettingSlider
            label="Per-run limit"
            description="Score the top N candidates per run — the rest wait for the next sweep."
            value={perRunLimit}
            min={5}
            max={50}
            display={(v) => `Top ${v}`}
            onChange={(v) => updateConfig({ perRunLimit: v })}
            onCommit={(v) =>
              toast.success(`Scoring top ${v} candidates per run`)
            }
          />
        </CardContent>
      </Card>
    </>
  );
}
