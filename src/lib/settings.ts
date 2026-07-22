import { prisma } from "./db";

export type AppSettings = {
  interests: string[];
  autoMode: boolean;
  minVirality: number;
  minSafety: number;
  perRunLimit: number;
};

// Always returns the single settings row, creating defaults on first use.
export async function getSettings(): Promise<AppSettings> {
  const row = await prisma.setting.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });
  return {
    interests: safeParseArray(row.interests),
    autoMode: row.autoMode,
    minVirality: row.minVirality,
    minSafety: row.minSafety,
    perRunLimit: row.perRunLimit,
  };
}

export async function saveSettings(patch: Partial<AppSettings>): Promise<void> {
  await prisma.setting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      interests: JSON.stringify(patch.interests ?? []),
      autoMode: patch.autoMode ?? false,
      minVirality: patch.minVirality ?? 72,
      minSafety: patch.minSafety ?? 80,
      perRunLimit: patch.perRunLimit ?? 20,
    },
    update: {
      ...(patch.interests !== undefined && {
        interests: JSON.stringify(patch.interests),
      }),
      ...(patch.autoMode !== undefined && { autoMode: patch.autoMode }),
      ...(patch.minVirality !== undefined && { minVirality: patch.minVirality }),
      ...(patch.minSafety !== undefined && { minSafety: patch.minSafety }),
      ...(patch.perRunLimit !== undefined && { perRunLimit: patch.perRunLimit }),
    },
  });
}

function safeParseArray(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}
