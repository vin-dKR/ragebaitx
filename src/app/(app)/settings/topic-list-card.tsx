"use client";

import { useState } from "react";
import { Tags, X } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function TopicListCard({
  title,
  description,
  values,
  placeholder,
  helper,
  emptyTitle,
  emptyDescription,
  destructive = false,
  onAdd,
  onRemove,
}: {
  title: string;
  description: string;
  values: string[];
  placeholder: string;
  helper?: string;
  emptyTitle: string;
  emptyDescription?: string;
  destructive?: boolean;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [draft, setDraft] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = draft.trim();
    if (!value) return;
    onAdd(value);
    setDraft("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {values.length === 0 ? (
          <EmptyState
            icon={Tags}
            title={emptyTitle}
            description={emptyDescription}
            className="py-8"
          />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {values.map((value) => (
              <span
                key={value}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border py-0.5 pr-1 pl-2.5 text-xs font-medium",
                  destructive
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : "border-border bg-muted/40 text-foreground/80",
                )}
              >
                {value}
                <button
                  type="button"
                  aria-label={`Remove ${value}`}
                  onClick={() => onRemove(value)}
                  className={cn(
                    "rounded-full p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    destructive
                      ? "hover:bg-destructive/20"
                      : "hover:bg-muted hover:text-foreground",
                  )}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <form onSubmit={submit} className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className="max-w-60"
            aria-label={`Add to ${title.toLowerCase()}`}
          />
          <Button type="submit" variant="outline" disabled={!draft.trim()}>
            Add
          </Button>
        </form>
        {helper ? (
          <p className="text-xs text-muted-foreground">{helper}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
