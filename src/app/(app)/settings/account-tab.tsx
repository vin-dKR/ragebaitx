"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compact } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type { AppConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

const PANEL_CLASS =
  "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AccountTab() {
  const xAccount = useAppStore((s) => s.config.xAccount);
  const mediaMode = useAppStore((s) => s.config.mediaMode);
  const updateConfig = useAppStore((s) => s.updateConfig);

  const reconnect = () => {
    updateConfig({ xAccount: { ...xAccount, connected: true } });
    toast.success(`Reconnected @${xAccount.handle}`, {
      description: "OAuth session refreshed — posting rights confirmed.",
    });
  };

  const replaceKey = () => {
    updateConfig({ xApiKeySet: true });
    toast.success("Key updated", {
      description: "Stored server-side, never sent to the browser.",
    });
  };

  const setMediaMode = (mode: AppConfig["mediaMode"]) => {
    if (mode === mediaMode) return;
    updateConfig({ mediaMode: mode });
    toast.success(
      mode === "attributed" ? "Attributed reuse enabled" : "Re-upload enabled",
      {
        description:
          mode === "attributed"
            ? "X keeps the From @creator credit on reused media."
            : "Files re-upload natively — watch for takedown notices.",
      },
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>X account</CardTitle>
          <CardDescription>The account this engine grows</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback className="text-sm font-semibold">
              {xAccount.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">@{xAccount.handle}</p>
            <p className="truncate text-xs text-muted-foreground">
              {xAccount.name} ·{" "}
              <span className="tnum">{compact(xAccount.followers)}</span>{" "}
              followers
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {xAccount.connected ? (
              <Badge
                variant="outline"
                className="border-status-good/30 text-status-good"
              >
                <ShieldCheck /> Connected
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-status-warning/30 text-status-warning"
              >
                <ShieldCheck /> Reconnect needed
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={reconnect}>
              Reconnect
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API access</CardTitle>
          <CardDescription>
            X API credentials the poster and metrics sweeps run on
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="x-api-key">X API key</Label>
          <div className="flex flex-wrap gap-2">
            <Input
              id="x-api-key"
              value="••••••••"
              readOnly
              className="max-w-52 font-mono tracking-widest select-none"
            />
            <Button variant="outline" onClick={replaceKey}>
              Replace key
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Keys are encrypted at rest and used only server-side — the browser
            only ever sees this mask.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media reuse</CardTitle>
          <CardDescription>
            How source photos and videos ride along on your posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            role="radiogroup"
            aria-label="Media reuse mode"
            className="grid gap-3 sm:grid-cols-2"
          >
            <button
              type="button"
              role="radio"
              aria-checked={mediaMode === "attributed"}
              onClick={() => setMediaMode("attributed")}
              className={cn(
                PANEL_CLASS,
                mediaMode === "attributed"
                  ? "border-brand bg-brand-soft"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <span className="text-sm font-medium">
                Attributed reuse{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (recommended)
                </span>
              </span>
              <span className="text-xs text-muted-foreground">
                X keeps “From @creator” credit on the media — safer
              </span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mediaMode === "reupload"}
              onClick={() => setMediaMode("reupload")}
              className={cn(
                PANEL_CLASS,
                mediaMode === "reupload"
                  ? "border-brand bg-brand-soft"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <span className="text-sm font-medium">Re-upload</span>
              <span className="text-xs text-muted-foreground">
                Full control over the file
              </span>
              <span className="flex items-center gap-1.5 text-xs text-status-serious">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Carries copyright / takedown risk
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
