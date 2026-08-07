"use client";

import { Slider } from "@/components/ui/slider";

function single(value: number | readonly number[]): number {
  return Array.isArray(value) ? value[0] : (value as number);
}

export function SettingSlider({
  label,
  description,
  value,
  min,
  max,
  display,
  onChange,
  onCommit,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  display: (value: number) => string;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium">{label}</p>
        <span className="tnum text-sm font-medium">{display(value)}</span>
      </div>
      <Slider
        value={value}
        min={min}
        max={max}
        onValueChange={(v) => onChange(single(v))}
        onValueCommitted={(v) => onCommit(single(v))}
        aria-label={label}
      />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
