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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";

export function TrackAccountDialog() {
  const addCompetitor = useAppStore((s) => s.addCompetitor);
  const [open, setOpen] = React.useState(false);
  const [handle, setHandle] = React.useState("");
  const clean = handle.trim().replace(/^@+/, "");

  const submit = () => {
    if (!clean) return;
    addCompetitor(clean);
    toast.success(`Tracking @${clean}`, {
      description: "First pattern report in ~24h.",
    });
    setHandle("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="h-4 w-4" />
        Track account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Track account</DialogTitle>
          <DialogDescription>
            The profiler studies its posting patterns and feeds what works into
            the style profile.
          </DialogDescription>
        </DialogHeader>
        <form
          id="track-account-form"
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Label htmlFor="track-account-handle">X handle</Label>
          <Input
            id="track-account-handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@handle"
            autoComplete="off"
          />
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button type="submit" form="track-account-form" disabled={!clean}>
            Start tracking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
