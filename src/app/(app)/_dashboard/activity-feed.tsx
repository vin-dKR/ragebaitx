"use client";

import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  Check,
  PenLine,
  Radar,
  Send,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { timeAgo } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { ActivityEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<ActivityEvent["type"], LucideIcon> = {
  crawl: Radar,
  draft: PenLine,
  post: Send,
  approve: Check,
  reject: X,
  metrics: BarChart3,
  alert: AlertTriangle,
  schedule: CalendarClock,
};

export function ActivityFeed({ className }: { className?: string }) {
  const activity = useAppStore((s) => s.activity);
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Machine log, latest first</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <ul className="space-y-3 pr-3">
            {activity.map((e) => {
              const Icon = TYPE_ICONS[e.type];
              return (
                <li key={e.id} className="flex items-start gap-2.5">
                  <Icon
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 shrink-0",
                      e.type === "alert"
                        ? "text-status-warning"
                        : "text-muted-foreground",
                    )}
                  />
                  <p className="min-w-0 flex-1 text-sm leading-snug">
                    {e.text}
                  </p>
                  <span className="tnum shrink-0 text-xs text-muted-foreground">
                    {timeAgo(e.at)}
                  </span>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
