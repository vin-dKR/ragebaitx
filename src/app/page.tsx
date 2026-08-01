import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { RunButton, DraftActions } from "./ui";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [settings, pending, recent] = await Promise.all([
    getSettings(),
    prisma.draft.findMany({
      where: { status: "pending" },
      orderBy: { viralityScore: "desc" },
    }),
    prisma.draft.findMany({
      where: { status: { in: ["posted", "rejected", "failed"] } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <main className="space-y-8">
      <section className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
        <div className="text-sm">
          <span className="text-neutral-400">Mode: </span>
          {settings.autoMode ? (
            <span className="font-semibold text-emerald-400">AUTO — posting without approval</span>
          ) : (
            <span className="font-semibold text-amber-400">MANUAL — approve to post</span>
          )}
        </div>
        <RunButton />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Pending queue ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
            Nothing waiting. Add source accounts in Settings, then hit “Run now”.
          </p>
        ) : (
          <div className="space-y-4">
            {pending.map((d) => (
              <article
                key={d.id}
                className="rounded-lg border border-neutral-800 bg-neutral-900 p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                  <span>from @{d.sourceHandle}</span>
                  <Badge label={`viral ${d.viralityScore}`} tone={tone(d.viralityScore)} />
                  <Badge label={`safe ${d.safetyScore}`} tone={tone(d.safetyScore)} />
                  {!d.faithful && <Badge label="unfaithful" tone="red" />}
                  {d.mediaType && <Badge label={d.mediaType} tone="neutral" />}
                </div>

                <p className="text-base font-medium leading-snug">{d.heading}</p>
                <p className="mt-1 text-xs italic text-neutral-500">{d.reasoning}</p>

                {d.thumbUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={d.thumbUrl}
                    alt=""
                    className="mt-3 max-h-56 rounded-md border border-neutral-800 object-cover"
                  />
                )}

                <details className="mt-3 text-xs text-neutral-500">
                  <summary className="cursor-pointer">source tweet</summary>
                  <p className="mt-1 whitespace-pre-wrap">{d.sourceText}</p>
                </details>

                <DraftActions id={d.id} />
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Recent activity
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-neutral-600">No history yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {recent.map((d) => (
              <li key={d.id} className="flex items-center gap-2 text-neutral-400">
                <StatusDot status={d.status} />
                <span className="truncate">{d.heading}</span>
                {d.status === "posted" && d.postedTweetId && (
                  <a
                    className="ml-auto shrink-0 text-sky-400 hover:underline"
                    href={`https://x.com/i/status/${d.postedTweetId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    view
                  </a>
                )}
                {d.status === "failed" && (
                  <span className="ml-auto shrink-0 text-red-400">{d.error}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function tone(score: number): "green" | "amber" | "red" {
  if (score >= 75) return "green";
  if (score >= 50) return "amber";
  return "red";
}

function Badge({ label, tone }: { label: string; tone: "green" | "amber" | "red" | "neutral" }) {
  const cls = {
    green: "bg-emerald-500/15 text-emerald-300",
    amber: "bg-amber-500/15 text-amber-300",
    red: "bg-red-500/15 text-red-300",
    neutral: "bg-neutral-700/40 text-neutral-300",
  }[tone];
  return <span className={`rounded px-1.5 py-0.5 ${cls}`}>{label}</span>;
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "posted" ? "bg-emerald-400" : status === "failed" ? "bg-red-400" : "bg-neutral-500";
  return <span className={`h-2 w-2 shrink-0 rounded-full ${color}`} />;
}
