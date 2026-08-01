"use client";

import { useState, useTransition } from "react";
import type { AppSettings } from "@/lib/settings";
import { addSource, removeSource, toggleSource, updateSettings } from "../actions";

type Source = { id: string; handle: string; active: boolean };

export function SettingsForm({ initial }: { initial: AppSettings }) {
  const [interests, setInterests] = useState(initial.interests.join(", "));
  const [autoMode, setAutoMode] = useState(initial.autoMode);
  const [minVirality, setMinVirality] = useState(initial.minVirality);
  const [minSafety, setMinSafety] = useState(initial.minSafety);
  const [perRunLimit, setPerRunLimit] = useState(initial.perRunLimit);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <section className="space-y-5 rounded-lg border border-neutral-800 bg-neutral-900 p-5">
      <label className="block">
        <span className="text-sm font-medium">Interest topics</span>
        <span className="block text-xs text-neutral-500">
          Comma-separated. The AI ranks and headlines news around these.
        </span>
        <input
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="AI, cricket, Indian politics, tech layoffs"
          className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
      </label>

      <label className="flex items-center justify-between">
        <span>
          <span className="text-sm font-medium">Auto mode</span>
          <span className="block text-xs text-neutral-500">
            ON = post without approval. OFF = everything waits in the queue.
          </span>
        </span>
        <input
          type="checkbox"
          checked={autoMode}
          onChange={(e) => setAutoMode(e.target.checked)}
          className="h-5 w-5 accent-emerald-500"
        />
      </label>

      <div className="grid grid-cols-3 gap-4">
        <NumberField label="Min virality" value={minVirality} onChange={setMinVirality} hint="auto-post floor" />
        <NumberField label="Min safety" value={minSafety} onChange={setMinSafety} hint="always enforced" />
        <NumberField label="Per-run limit" value={perRunLimit} onChange={setPerRunLimit} hint="max scored / run" />
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={pending}
          onClick={() =>
            start(async () => {
              setSaved(false);
              await updateSettings({
                interests: interests
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
                autoMode,
                minVirality,
                minSafety,
                perRunLimit,
              });
              setSaved(true);
            })
          }
          className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-xs text-emerald-400">Saved</span>}
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <span className="block text-xs text-neutral-500">{hint}</span>
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
      />
    </label>
  );
}

export function SourcesManager({ sources }: { sources: Source[] }) {
  const [handle, setHandle] = useState("");
  const [pending, start] = useTransition();

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@bbcbreaking"
          className="flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <button
          disabled={pending || !handle.trim()}
          onClick={() =>
            start(async () => {
              await addSource(handle);
              setHandle("");
            })
          }
          className="rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-white disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {sources.length === 0 ? (
        <p className="text-sm text-neutral-600">No accounts yet.</p>
      ) : (
        <ul className="divide-y divide-neutral-800 rounded-md border border-neutral-800">
          {sources.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-3 py-2 text-sm">
              <span className={s.active ? "" : "text-neutral-600 line-through"}>@{s.handle}</span>
              <div className="ml-auto flex items-center gap-3">
                <button
                  onClick={() => start(() => toggleSource(s.id, !s.active))}
                  className="text-xs text-neutral-400 hover:text-neutral-100"
                >
                  {s.active ? "pause" : "resume"}
                </button>
                <button
                  onClick={() => start(() => removeSource(s.id))}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
