"use client";

import { useState, useTransition } from "react";
import { approveDraft, rejectDraft, triggerRun } from "./actions";

export function RunButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      {msg && <span className="text-xs text-neutral-400">{msg}</span>}
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            setMsg(null);
            try {
              const r = await triggerRun();
              setMsg(`fetched ${r.fetched} · scored ${r.scored} · queued ${r.queued} · posted ${r.autoPosted}`);
            } catch (e) {
              setMsg(e instanceof Error ? e.message : "run failed");
            }
          })
        }
        className="rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-50"
      >
        {pending ? "Running…" : "Run now"}
      </button>
    </div>
  );
}

export function DraftActions({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mt-4 flex items-center gap-2">
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            setErr(null);
            try {
              await approveDraft(id);
            } catch (e) {
              setErr(e instanceof Error ? e.message : "post failed");
            }
          })
        }
        className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50"
      >
        Approve & post
      </button>
      <button
        disabled={pending}
        onClick={() => start(() => rejectDraft(id))}
        className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800 disabled:opacity-50"
      >
        Reject
      </button>
      {err && <span className="text-xs text-red-400">{err}</span>}
    </div>
  );
}
