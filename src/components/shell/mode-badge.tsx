"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

// The single most important status in the app: Training (learning, human in
// the loop) vs Live (autopilot). Always visible in the topbar; links to the
// Benchmark screen where the mode is controlled.
export function ModeBadge({ className }: { className?: string }) {
  const mode = useAppStore((s) => s.config.mode);
  const live = mode === "live";
  return (
    <Link
      href="/benchmark"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
        live
          ? "border-mode-live/40 bg-mode-live/10 text-mode-live hover:bg-mode-live/20"
          : "border-mode-training/40 bg-mode-training/10 text-mode-training hover:bg-mode-training/20",
        className,
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          live ? "bg-mode-live animate-live-pulse" : "bg-mode-training",
        )}
      />
      {live ? "Live" : "Training"}
    </Link>
  );
}
