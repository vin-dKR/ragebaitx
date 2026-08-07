"use client";

import { Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { timeAgo } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export function LearnedSummary() {
  const feedback = useAppStore((s) => s.feedback);
  const lessons = feedback.filter((f) => f.lesson).slice(0, 3);

  if (lessons.length === 0) return null;

  return (
    <Card className="gap-3 border-l-2 border-brand bg-brand-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Fingerprint className="h-4 w-4 text-brand" />
          What the profile learned recently
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5">
          {lessons.map((f) => (
            <li key={f.id} className="flex items-start gap-2 text-sm">
              <span
                aria-hidden
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand/60"
              />
              <span className="min-w-0">
                {f.lesson}{" "}
                <span className="text-xs text-muted-foreground">
                  · {timeAgo(f.at)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
