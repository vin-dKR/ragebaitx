"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ModelChip } from "@/components/shared/model-chip";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { MODEL_META, type ModelConfig, type ModelId } from "@/lib/types";

const ROLE_LABELS: Record<ModelConfig["role"], string> = {
  drafting: "Drafting",
  scoring: "Scoring",
  both: "Both",
};

const ROLE_DESCRIPTIONS: Record<ModelConfig["role"], string> = {
  drafting: "Writes variants, sits out scoring.",
  scoring: "Scores candidates, writes nothing.",
  both: "Drafts variants and scores the field.",
};

const MODEL_ORDER = Object.keys(MODEL_META) as ModelId[];

export function ModelsTab() {
  const models = useAppStore((s) => s.config.models);
  const updateConfig = useAppStore((s) => s.updateConfig);
  const [keyDrafts, setKeyDrafts] = useState<Partial<Record<ModelId, string>>>(
    {},
  );
  const [replacing, setReplacing] = useState<Partial<Record<ModelId, boolean>>>(
    {},
  );

  const patchModel = (id: ModelId, patch: Partial<ModelConfig>) => {
    updateConfig({
      models: models.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });
  };

  const setRole = (id: ModelId, role: ModelConfig["role"]) => {
    patchModel(id, { role });
    toast.success(
      `${MODEL_META[id].label} → ${ROLE_LABELS[role].toLowerCase()}`,
      { description: ROLE_DESCRIPTIONS[role] },
    );
  };

  const setEnabled = (id: ModelId, enabled: boolean) => {
    patchModel(id, { enabled });
    toast.success(
      `${MODEL_META[id].label} ${enabled ? "enabled" : "disabled"}`,
      {
        description: enabled
          ? "Back in rotation from the next draft run."
          : "Skipped on future draft runs.",
      },
    );
  };

  const saveKey = (id: ModelId) => {
    patchModel(id, { apiKeySet: true });
    setKeyDrafts((d) => ({ ...d, [id]: "" }));
    setReplacing((r) => ({ ...r, [id]: false }));
    toast.success(`${MODEL_META[id].label} key saved`, {
      description: "Stored server-side, never sent to the browser.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Model lineup</CardTitle>
          <CardDescription>
            Who drafts, who scores, and whose key is on file
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {MODEL_ORDER.map((id) => {
            const m = models.find((mm) => mm.id === id) ?? {
              id,
              enabled: false,
              apiKeySet: false,
              role: "drafting" as const,
            };
            const editingKey = !m.apiKeySet || replacing[id];
            const draft = keyDrafts[id] ?? "";
            return (
              <div
                key={id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0"
              >
                <div className="w-32 shrink-0">
                  <ModelChip model={id} />
                </div>
                <Select
                  items={ROLE_LABELS}
                  value={m.role}
                  onValueChange={(v) => {
                    if (v) setRole(id, v as ModelConfig["role"]);
                  }}
                >
                  <SelectTrigger
                    size="sm"
                    className="w-28"
                    aria-label={`${MODEL_META[id].label} role`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ROLE_LABELS) as ModelConfig["role"][]).map(
                      (role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {editingKey ? (
                    <>
                      <Input
                        value={draft}
                        onChange={(e) =>
                          setKeyDrafts((d) => ({ ...d, [id]: e.target.value }))
                        }
                        placeholder="sk-…"
                        className="h-7 w-36 font-mono text-xs md:w-44"
                        aria-label={`${MODEL_META[id].label} API key`}
                      />
                      <Button
                        size="xs"
                        disabled={!draft.trim()}
                        onClick={() => saveKey(id)}
                      >
                        Save
                      </Button>
                      {m.apiKeySet ? (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() =>
                            setReplacing((r) => ({ ...r, [id]: false }))
                          }
                        >
                          Cancel
                        </Button>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary">Key set</Badge>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() =>
                          setReplacing((r) => ({ ...r, [id]: true }))
                        }
                      >
                        Replace
                      </Button>
                    </>
                  )}
                </div>
                <Switch
                  checked={m.enabled}
                  onCheckedChange={(checked) => setEnabled(id, checked)}
                  aria-label={`${MODEL_META[id].label} enabled`}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardContent className="flex items-start gap-2.5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            All models route through one AI Gateway — every draft records which
            model wrote it, and Analytics shows who’s winning.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
