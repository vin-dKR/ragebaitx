"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";

function firstValue(v: number | readonly number[]): number {
  return typeof v === "number" ? v : v[0];
}

function SettingSlider({
  label,
  helper,
  min,
  max,
  step,
  value,
  display,
  onCommit,
}: {
  label: string;
  helper: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: (v: number) => string;
  onCommit: (v: number) => void;
}) {
  const [draft, setDraft] = useState<number | null>(null);
  const shown = draft ?? value;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="font-normal">{label}</Label>
        <span className="text-sm font-medium tnum">{display(shown)}</span>
      </div>
      <Slider
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={[shown]}
        onValueChange={(v) => setDraft(firstValue(v))}
        onValueCommitted={(v) => {
          setDraft(null);
          onCommit(firstValue(v));
        }}
      />
      <p className="text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}

export function GraduationSettingsCard({ className }: { className?: string }) {
  const benchmarkTarget = useAppStore((s) => s.config.benchmarkTarget);
  const editDistanceLimit = useAppStore((s) => s.config.editDistanceLimit);
  const updateConfig = useAppStore((s) => s.updateConfig);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Graduation settings</CardTitle>
        <CardDescription>How strict the benchmark is</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SettingSlider
          label="Benchmark target"
          helper="Clean approvals in a row before Live unlocks."
          min={5}
          max={20}
          step={1}
          value={benchmarkTarget}
          display={(v) => `${v} approvals`}
          onCommit={(v) => {
            updateConfig({ benchmarkTarget: v });
            toast.success(`Benchmark target: ${v} clean approvals`, {
              description:
                "Raising the bar resets nothing — the streak carries over.",
            });
          }}
        />
        <Separator />
        <SettingSlider
          label="Clean-approval edit limit"
          helper="Edits under this level still count as clean."
          min={0}
          max={25}
          step={1}
          value={editDistanceLimit}
          display={(v) => `${v}%`}
          onCommit={(v) => {
            updateConfig({ editDistanceLimit: v });
            toast.success(`Edit limit: ${v}% change`, {
              description:
                "Applies from the next review — the streak persists.",
            });
          }}
        />
      </CardContent>
    </Card>
  );
}
