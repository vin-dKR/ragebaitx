"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppStore } from "@/lib/store";
import type { StyleRuleCategory } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ORDER, STRENGTH_LABELS } from "./style-meta";

export function AddRuleDialog() {
  const addRule = useAppStore((s) => s.addRule);
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState<StyleRuleCategory>("tone");
  const [text, setText] = React.useState("");
  const [strength, setStrength] = React.useState<1 | 2 | 3>(2);

  const save = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addRule({
      category,
      text: trimmed,
      source: "manual",
      strength,
      active: true,
    });
    toast.success("Rule added", {
      description: `${CATEGORY_LABELS[category]} · ${STRENGTH_LABELS[strength]} — every draft from now on is written against it.`,
    });
    setOpen(false);
    setText("");
    setCategory("tone");
    setStrength(2);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus />
        Add rule
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add style rule</DialogTitle>
          <DialogDescription>
            Manual rules sit alongside learned ones and apply to every new
            draft.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rule-category">Category</Label>
            <Select
              items={CATEGORY_LABELS}
              value={category}
              onValueChange={(v) => {
                if (v) setCategory(v);
              }}
            >
              <SelectTrigger id="rule-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ORDER.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rule-text">Rule</Label>
            <Textarea
              id="rule-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Numbers as contrast pairs on separate lines."
              className="min-h-24"
            />
          </div>
          <div className="space-y-2">
            <Label id="rule-strength-label">Strength</Label>
            <ToggleGroup
              aria-labelledby="rule-strength-label"
              variant="outline"
              spacing={0}
              className="w-full"
              value={[String(strength)]}
              onValueChange={(v) => {
                if (v.length) setStrength(Number(v[0]) as 1 | 2 | 3);
              }}
            >
              {([1, 2, 3] as const).map((n) => (
                <ToggleGroupItem
                  key={n}
                  value={String(n)}
                  className="flex-1"
                  aria-label={`Strength ${n} — ${STRENGTH_LABELS[n]}`}
                >
                  {n} · {STRENGTH_LABELS[n]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <p className="text-xs text-muted-foreground">
              How hard the drafter leans on this rule.
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={save} disabled={!text.trim()}>
            Save rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
