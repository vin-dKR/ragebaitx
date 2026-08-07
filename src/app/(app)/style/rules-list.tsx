"use client";

import { BookOpenCheck, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppStore } from "@/lib/store";
import type { StyleRule } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "./style-meta";

function StrengthDots({ strength }: { strength: 1 | 2 | 3 }) {
  return (
    <span
      role="img"
      aria-label={`Strength ${strength} of 3`}
      className="flex items-center gap-1"
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "size-1.5 rounded-full",
            i <= strength ? "bg-brand" : "bg-muted-foreground/25",
          )}
        />
      ))}
    </span>
  );
}

function SourceBadge({ rule }: { rule: StyleRule }) {
  if (rule.source === "manual") {
    return <Badge variant="outline">manual</Badge>;
  }
  return (
    <Tooltip>
      <TooltipTrigger render={<Badge variant="secondary" />}>
        learned
      </TooltipTrigger>
      <TooltipContent>
        Learned from {rule.learnedFrom ?? "review feedback"}
      </TooltipContent>
    </Tooltip>
  );
}

function RuleRow({ rule }: { rule: StyleRule }) {
  const toggleRule = useAppStore((s) => s.toggleRule);
  const removeRule = useAppStore((s) => s.removeRule);

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div
        className={cn(
          "min-w-0 flex-1 space-y-1.5",
          !rule.active && "opacity-50",
        )}
      >
        <p className="text-sm leading-snug">{rule.text}</p>
        <div className="flex items-center gap-2.5">
          <StrengthDots strength={rule.strength} />
          <SourceBadge rule={rule} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        <Switch
          size="sm"
          checked={rule.active}
          onCheckedChange={() => toggleRule(rule.id)}
          aria-label={rule.active ? "Deactivate rule" : "Activate rule"}
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="Rule actions" />
            }
          >
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-32">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                removeRule(rule.id);
                toast.success("Rule deleted", {
                  description: rule.text.slice(0, 80),
                });
              }}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function RulesList() {
  const styleRules = useAppStore((s) => s.styleRules);

  if (styleRules.length === 0) {
    return (
      <EmptyState
        icon={BookOpenCheck}
        title="No rules yet"
        description="Add a rule manually — or review drafts and let corrections become rules."
      />
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {CATEGORY_ORDER.map((cat) => {
          const rules = styleRules.filter((r) => r.category === cat);
          if (rules.length === 0) return null;
          return (
            <section key={cat} className="space-y-2">
              <h2 className="px-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                {CATEGORY_LABELS[cat]}
                <span className="ml-1.5 tnum">{rules.length}</span>
              </h2>
              <Card className="gap-0 py-0">
                <div className="divide-y">
                  {rules.map((rule) => (
                    <RuleRow key={rule.id} rule={rule} />
                  ))}
                </div>
              </Card>
            </section>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
