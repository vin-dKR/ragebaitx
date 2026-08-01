import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { SettingsForm, SourcesManager } from "./ui";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, sources] = await Promise.all([
    getSettings(),
    prisma.source.findMany({ orderBy: { handle: "asc" } }),
  ]);

  return (
    <main className="space-y-10">
      <section>
        <h1 className="mb-1 text-lg font-semibold">Settings</h1>
        <p className="text-sm text-neutral-500">
          Tell the bot what you like and how aggressively to post.
        </p>
      </section>

      <SettingsForm initial={settings} />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Monitored accounts
        </h2>
        <SourcesManager sources={sources} />
      </section>
    </main>
  );
}
