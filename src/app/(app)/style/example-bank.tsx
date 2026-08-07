"use client";

import { Eye, Quote, X } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { compact } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export function ExampleBank() {
  const styleExamples = useAppStore((s) => s.styleExamples);
  const removeExample = useAppStore((s) => s.removeExample);

  return (
    <div className="space-y-2">
      <h2 className="px-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        Example bank
        <span className="ml-1.5 tnum">{styleExamples.length}</span>
      </h2>
      {styleExamples.length === 0 ? (
        <EmptyState
          icon={Quote}
          title="No reference examples"
          description="Approve great posts from History to grow the bank."
        />
      ) : (
        <div className="space-y-3">
          {styleExamples.map((ex) => (
            <Card key={ex.id} size="sm" className="relative">
              <CardContent className="space-y-2 pr-9">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {ex.text}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  {ex.note}
                </p>
                {ex.impressions ? (
                  <Badge variant="secondary" className="tnum">
                    <Eye />
                    {compact(ex.impressions)}
                  </Badge>
                ) : null}
              </CardContent>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Remove example"
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  removeExample(ex.id);
                  toast.success("Example removed", {
                    description: "The drafter will stop referencing it.",
                  });
                }}
              >
                <X />
              </Button>
            </Card>
          ))}
          <p className="px-1 text-xs text-muted-foreground">
            Approve great posts from History to grow the bank.
          </p>
        </div>
      )}
    </div>
  );
}
