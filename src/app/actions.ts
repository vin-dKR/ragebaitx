"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { saveSettings, type AppSettings } from "@/lib/settings";
import { publishDraft, runPipeline } from "@/lib/pipeline";

// ---- Draft queue actions ----

export async function approveDraft(id: string) {
  await publishDraft(id); // throws -> Next surfaces the error; status set to failed inside
  revalidatePath("/");
}

export async function rejectDraft(id: string) {
  await prisma.draft.update({ where: { id }, data: { status: "rejected" } });
  revalidatePath("/");
}

// ---- Manual trigger (button on the dashboard) ----

export async function triggerRun() {
  const report = await runPipeline();
  revalidatePath("/");
  return report;
}

// ---- Settings ----

export async function updateSettings(patch: Partial<AppSettings>) {
  await saveSettings(patch);
  revalidatePath("/settings");
  revalidatePath("/");
}

// ---- Sources (monitored accounts) ----

export async function addSource(handle: string) {
  const clean = handle.trim().replace(/^@/, "").toLowerCase();
  if (!clean) return;
  await prisma.source.upsert({
    where: { handle: clean },
    create: { handle: clean },
    update: { active: true },
  });
  revalidatePath("/settings");
}

export async function removeSource(id: string) {
  await prisma.source.delete({ where: { id } });
  revalidatePath("/settings");
}

export async function toggleSource(id: string, active: boolean) {
  await prisma.source.update({ where: { id }, data: { active } });
  revalidatePath("/settings");
}
