"use client";

import { useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { timeAgo } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function KeywordSweep() {
  const keywords = useAppStore((s) => s.keywords);
  const keywordRunning = useAppStore((s) => s.keywordRunning);
  const addKeyword = useAppStore((s) => s.addKeyword);
  const runKeyword = useAppStore((s) => s.runKeyword);
  const toggleKeyword = useAppStore((s) => s.toggleKeyword);
  const removeKeyword = useAppStore((s) => s.removeKeyword);
  const [term, setTerm] = useState("");

  const sweep = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = term.trim();
    if (!trimmed || keywordRunning) return;
    const existing = keywords.find(
      (k) => k.term.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!existing) addKeyword(trimmed);
    const runTerm = existing?.term ?? trimmed;
    runKeyword(runTerm);
    toast.success("Sweep started", {
      description: `Scanning X for '${runTerm}' — results land in the feed below.`,
    });
    setTerm("");
  };

  return (
    <Card size="sm">
      <CardContent className="space-y-3">
        <form onSubmit={sweep} className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Sweep X for a keyword — e.g. 'metro tender'"
            aria-label="Keyword to sweep"
            className="sm:max-w-md"
          />
          <Button
            type="submit"
            disabled={!term.trim() || keywordRunning !== null}
          >
            {keywordRunning ? <Loader2 className="animate-spin" /> : <Search />}
            Run sweep
          </Button>
        </form>
        {keywordRunning ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {`Sweeping X for '${keywordRunning}'…`}
          </p>
        ) : null}
        {keywords.length > 0 ? (
          <TooltipProvider>
            <div className="flex flex-wrap gap-2">
              {keywords.map((k) => (
                <span
                  key={k.id}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 py-1 pr-1 pl-3 text-xs",
                    !k.active && "opacity-60",
                  )}
                >
                  <span className="font-medium">{k.term}</span>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <span className="tnum text-muted-foreground" tabIndex={0} />
                      }
                    >
                      {k.resultsFound} found
                    </TooltipTrigger>
                    <TooltipContent>
                      {k.lastRunAt
                        ? `Last swept ${timeAgo(k.lastRunAt)} ago`
                        : "Not swept yet"}
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    size="sm"
                    checked={k.active}
                    onCheckedChange={() => toggleKeyword(k.id)}
                    aria-label={`Auto-sweep for '${k.term}'`}
                  />
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove keyword '${k.term}'`}
                    onClick={() => removeKeyword(k.id)}
                  >
                    <X />
                  </Button>
                </span>
              ))}
            </div>
          </TooltipProvider>
        ) : null}
      </CardContent>
    </Card>
  );
}
