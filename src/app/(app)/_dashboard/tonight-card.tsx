"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { peakWindowLabel } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";

export function TonightCard() {
  const drafts = useAppStore((s) => s.drafts);
  const holdForPeak = useAppStore((s) => s.config.timing.holdForPeak);
  const scheduled = drafts.filter((d) => d.status === "scheduled").length;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          Tonight&apos;s window
        </CardTitle>
        <CardDescription>{peakWindowLabel}</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" render={<Link href="/schedule" />}>
            Schedule
            <ArrowRight />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="tnum text-2xl font-semibold leading-none">
            {scheduled}
          </span>
          <span className="text-sm text-muted-foreground">
            {scheduled === 1 ? "post" : "posts"} held for the peak window
          </span>
        </div>
        {holdForPeak && scheduled === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Peak-hold is on — approvals queue here until the window opens.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
