import type { StyleRuleCategory } from "@/lib/types";

export const CATEGORY_ORDER: StyleRuleCategory[] = [
  "tone",
  "structure",
  "vocabulary",
  "formatting",
  "taboo",
];

export const CATEGORY_LABELS: Record<StyleRuleCategory, string> = {
  tone: "Tone",
  structure: "Structure",
  vocabulary: "Vocabulary",
  formatting: "Formatting",
  taboo: "Taboo",
};

export const STRENGTH_LABELS: Record<1 | 2 | 3, string> = {
  1: "Light",
  2: "Firm",
  3: "Hard",
};
