"use client";

import {
  AlertTriangle,
  Heart,
  Lightbulb,
  Repeat2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { compact, signedCompact } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { Competitor } from "@/lib/types";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StatCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

export function CompetitorCard({ competitor }: { competitor: Competitor }) {
  const toggleCompetitor = useAppStore((s) => s.toggleCompetitor);
  const growing = competitor.followersDelta30d >= 0;
  const DeltaIcon = growing ? TrendingUp : TrendingDown;
  const negativeExample =
    competitor.followersDelta30d < 0 && competitor.postsPerDay > 8;

  return (
    <Card className={cn(!competitor.tracked && "opacity-60")}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-xs font-medium">
              {initials(competitor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{competitor.name}</div>
            <div className="truncate text-xs text-muted-foreground">
              @{competitor.handle}
            </div>
          </div>
          <Switch
            checked={competitor.tracked}
            onCheckedChange={() => {
              toggleCompetitor(competitor.id);
              if (competitor.tracked) {
                toast(`Paused tracking @${competitor.handle}`);
              } else {
                toast.success(`Tracking @${competitor.handle}`, {
                  description: "Patterns resume feeding the style profile.",
                });
              }
            }}
            aria-label={
              competitor.tracked
                ? `Stop tracking @${competitor.handle}`
                : `Track @${competitor.handle}`
            }
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <StatCell label="Followers">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="tnum text-sm font-medium">
                {compact(competitor.followers)}
              </span>
              <span
                className={cn(
                  "tnum inline-flex items-center gap-0.5 text-xs",
                  growing ? "text-status-good" : "text-status-critical",
                )}
              >
                <DeltaIcon className="h-3 w-3" />
                {signedCompact(competitor.followersDelta30d)}
              </span>
            </div>
          </StatCell>
          <StatCell label="Avg engagement">
            <div className="tnum text-sm font-medium">
              {compact(competitor.avgEngagementPerPost)}
            </div>
          </StatCell>
          <StatCell label="Posts / day">
            <div className="tnum text-sm font-medium">
              {competitor.postsPerDay.toFixed(1)}
            </div>
          </StatCell>
        </div>

        {negativeExample ? (
          <div className="flex items-start gap-2 rounded-lg bg-status-serious/10 px-3 py-2 text-xs text-status-serious">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              Negative example — over-posting is diluting reach. The profiler
              learns what to avoid too.
            </p>
          </div>
        ) : null}

        {competitor.patterns.length > 0 ? (
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Extracted patterns
            </div>
            <ul className="space-y-1.5">
              {competitor.patterns.map((pattern) => (
                <li key={pattern} className="flex items-start gap-2 text-sm">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-viz-3" />
                  <span>{pattern}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {competitor.recentWins.length > 0 ? (
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Recent wins
            </div>
            <div className="space-y-2">
              {competitor.recentWins.map((win) => (
                <figure
                  key={win.text}
                  className="rounded-lg border border-border p-3"
                >
                  <blockquote className="line-clamp-3 whitespace-pre-wrap text-sm">
                    {win.text}
                  </blockquote>
                  <figcaption className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="tnum inline-flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {compact(win.likes)}
                    </span>
                    <span className="tnum inline-flex items-center gap-1">
                      <Repeat2 className="h-3 w-3" />
                      {compact(win.reposts)}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
