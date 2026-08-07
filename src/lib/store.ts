"use client";

// Client-side app state for Part A. All mutations are local; Part B swaps the
// action bodies for server calls while keeping the same interface.

import { create } from "zustand";
import {
  activity as seedActivity,
  appConfig as seedConfig,
  benchmark as seedBenchmark,
  competitors as seedCompetitors,
  drafts as seedDrafts,
  feedbackEvents as seedFeedback,
  keywords as seedKeywords,
  newsItems as seedNews,
  posts as seedPosts,
  styleExamples as seedExamples,
  styleRules as seedRules,
} from "./mock-data";
import type {
  ActivityEvent,
  AppConfig,
  BenchmarkState,
  Competitor,
  Draft,
  FeedbackEvent,
  Keyword,
  NewsItem,
  Post,
  StyleExample,
  StyleRule,
} from "./types";

let idCounter = 100;
const nextId = (prefix: string) => `${prefix}${idCounter++}`;

// Rough word-level edit distance as a percentage of the original.
export function editDistancePct(original: string, edited: string): number {
  const a = original.trim().split(/\s+/);
  const b = edited.trim().split(/\s+/);
  const setA = new Set(a);
  const setB = new Set(b);
  let common = 0;
  for (const w of setB) if (setA.has(w)) common++;
  const changed = Math.max(a.length, b.length) - common;
  return Math.min(100, Math.round((changed / Math.max(a.length, 1)) * 100));
}

interface AppState {
  config: AppConfig;
  newsItems: NewsItem[];
  drafts: Draft[];
  posts: Post[];
  styleRules: StyleRule[];
  styleExamples: StyleExample[];
  feedback: FeedbackEvent[];
  competitors: Competitor[];
  keywords: Keyword[];
  benchmark: BenchmarkState;
  activity: ActivityEvent[];
  keywordRunning: string | null;

  // derived helpers
  pendingDrafts: () => Draft[];
  newsById: (id: string) => NewsItem | undefined;
  canGoLive: () => boolean;

  // draft review flow
  selectVariant: (draftId: string, variantId: string) => void;
  editDraft: (draftId: string, text: string) => void;
  approveDraft: (draftId: string) => void;
  rejectDraft: (draftId: string, reason: string) => void;

  // mode + settings
  setMode: (mode: AppConfig["mode"]) => void;
  updateConfig: (patch: Partial<AppConfig>) => void;

  // sourcing
  runKeyword: (term: string) => void;
  addKeyword: (term: string) => void;
  toggleKeyword: (id: string) => void;
  removeKeyword: (id: string) => void;
  requestDraft: (newsItemId: string) => void;

  // style profile
  toggleRule: (id: string) => void;
  addRule: (rule: Omit<StyleRule, "id">) => void;
  removeRule: (id: string) => void;
  removeExample: (id: string) => void;

  // competitors
  toggleCompetitor: (id: string) => void;
  addCompetitor: (handle: string) => void;
}

function activityEvent(
  type: ActivityEvent["type"],
  text: string,
): ActivityEvent {
  return { id: nextId("a"), at: new Date().toISOString(), type, text };
}

export const useAppStore = create<AppState>()((set, get) => ({
  config: seedConfig,
  newsItems: seedNews,
  drafts: seedDrafts,
  posts: seedPosts,
  styleRules: seedRules,
  styleExamples: seedExamples,
  feedback: seedFeedback,
  competitors: seedCompetitors,
  keywords: seedKeywords,
  benchmark: seedBenchmark,
  activity: seedActivity,
  keywordRunning: null,

  pendingDrafts: () => get().drafts.filter((d) => d.status === "pending"),
  newsById: (id) => get().newsItems.find((n) => n.id === id),
  canGoLive: () => get().benchmark.graduated,

  selectVariant: (draftId, variantId) =>
    set((s) => ({
      drafts: s.drafts.map((d) =>
        d.id === draftId
          ? { ...d, selectedVariantId: variantId, editedText: undefined }
          : d,
      ),
    })),

  editDraft: (draftId, text) =>
    set((s) => ({
      drafts: s.drafts.map((d) =>
        d.id === draftId ? { ...d, editedText: text } : d,
      ),
    })),

  approveDraft: (draftId) => {
    const s = get();
    const draft = s.drafts.find((d) => d.id === draftId);
    if (!draft) return;
    const variant = draft.variants.find(
      (v) => v.id === draft.selectedVariantId,
    )!;
    const finalText = draft.editedText ?? variant.text;
    const dist = draft.editedText
      ? editDistancePct(variant.text, draft.editedText)
      : 0;
    const clean = dist <= s.benchmark.editDistanceLimit;
    const newStreak = clean ? s.benchmark.streak + 1 : 0;
    const graduated = newStreak >= s.benchmark.target;
    const holdForPeak = s.config.timing.holdForPeak;
    const news = s.newsItems.find((n) => n.id === draft.newsItemId);

    set({
      drafts: s.drafts.map((d) =>
        d.id === draftId
          ? {
              ...d,
              status: holdForPeak ? "scheduled" : "posted",
              scheduledFor: holdForPeak
                ? new Date(Date.now() + 4 * 3600_000).toISOString()
                : undefined,
            }
          : d,
      ),
      benchmark: {
        ...s.benchmark,
        streak: newStreak,
        graduated: graduated || s.benchmark.graduated,
        recent: [
          {
            draftId,
            headline: (news?.headline ?? finalText).slice(0, 60),
            approved: true,
            editDistancePct: dist,
            at: new Date().toISOString(),
          },
          ...s.benchmark.recent,
        ].slice(0, 12),
      },
      feedback: [
        {
          id: nextId("f"),
          draftId,
          draftText: finalText.slice(0, 120),
          action: draft.editedText ? "edited" : "approved",
          detail: draft.editedText
            ? `Edited before approval (${dist}% change).`
            : "Approved untouched.",
          lesson:
            draft.editedText && dist > 15
              ? "Significant edit — style profile flagged for review."
              : undefined,
          at: new Date().toISOString(),
        },
        ...s.feedback,
      ],
      activity: [
        activityEvent(
          holdForPeak ? "schedule" : "post",
          holdForPeak
            ? `Approved & held for peak window — benchmark streak ${newStreak}/${s.benchmark.target}`
            : `Approved & posted — benchmark streak ${newStreak}/${s.benchmark.target}`,
        ),
        ...s.activity,
      ],
    });
  },

  rejectDraft: (draftId, reason) => {
    const s = get();
    const draft = s.drafts.find((d) => d.id === draftId);
    if (!draft) return;
    const variant = draft.variants.find(
      (v) => v.id === draft.selectedVariantId,
    )!;
    set({
      drafts: s.drafts.map((d) =>
        d.id === draftId ? { ...d, status: "rejected", rejectReason: reason } : d,
      ),
      benchmark: { ...s.benchmark, streak: 0 },
      feedback: [
        {
          id: nextId("f"),
          draftId,
          draftText: variant.text.slice(0, 120),
          action: "rejected",
          detail: reason,
          lesson: "Streak reset — reason logged for style profile.",
          at: new Date().toISOString(),
        },
        ...s.feedback,
      ],
      activity: [
        activityEvent("reject", `Draft rejected: ${reason.slice(0, 80)}`),
        ...s.activity,
      ],
    });
  },

  setMode: (mode) =>
    set((s) => ({
      config: { ...s.config, mode },
      activity: [
        activityEvent(
          "alert",
          mode === "live"
            ? "LIVE mode enabled — autopilot active above threshold"
            : "Training mode enabled — all drafts route to review",
        ),
        ...s.activity,
      ],
    })),

  updateConfig: (patch) =>
    set((s) => ({ config: { ...s.config, ...patch } })),

  runKeyword: (term) => {
    const s = get();
    set({ keywordRunning: term });
    // Simulated crawl: resolves after a short delay with a plausible result.
    setTimeout(() => {
      const st = get();
      const item: NewsItem = {
        id: nextId("n"),
        headline: `Keyword sweep '${term}': procurement filings flag unusual single-bidder pattern`,
        summary: `Simulated result for '${term}' — Part B replaces this with a real X search. Two documents matched; one crossed the velocity threshold.`,
        sourceHandle: "TenderTracker",
        topic: "Infrastructure",
        trendState: "rising",
        velocity: 640,
        velocityDelta: 22,
        likes: 1200,
        reposts: 480,
        replies: 210,
        foundAt: new Date().toISOString(),
        via: "keyword",
        keywordUsed: term,
        drafted: false,
      };
      set({
        keywordRunning: null,
        newsItems: [item, ...st.newsItems],
        keywords: st.keywords.map((k) =>
          k.term === term
            ? {
                ...k,
                lastRunAt: new Date().toISOString(),
                resultsFound: k.resultsFound + 1,
              }
            : k,
        ),
        activity: [
          activityEvent("crawl", `Keyword run '${term}': 1 new candidate found`),
          ...st.activity,
        ],
      });
    }, 1400);
  },

  addKeyword: (term) =>
    set((s) => ({
      keywords: [
        {
          id: nextId("k"),
          term,
          active: true,
          addedAt: new Date().toISOString(),
          resultsFound: 0,
        },
        ...s.keywords,
      ],
    })),

  toggleKeyword: (id) =>
    set((s) => ({
      keywords: s.keywords.map((k) =>
        k.id === id ? { ...k, active: !k.active } : k,
      ),
    })),

  removeKeyword: (id) =>
    set((s) => ({ keywords: s.keywords.filter((k) => k.id !== id) })),

  requestDraft: (newsItemId) => {
    const s = get();
    const news = s.newsItems.find((n) => n.id === newsItemId);
    if (!news || news.drafted) return;
    const draft: Draft = {
      id: nextId("d"),
      newsItemId,
      selectedVariantId: "sim1",
      status: "pending",
      createdAt: new Date().toISOString(),
      wouldAutoPost: false,
      variants: [
        {
          id: "sim1",
          model: "claude",
          hook: "statistic",
          text: `${news.headline}\n\nThe documents say more than the press release does. Receipts in the source.`,
          viralityScore: 74,
          safetyScore: 88,
          styleMatchScore: 80,
          reasoning:
            "Simulated on-demand draft — Part B generates real variants from the configured models.",
        },
        {
          id: "sim2",
          model: "grok",
          hook: "question",
          text: `Everyone repeated the press release. Nobody read the annexure.\n\n${news.headline} — so who signed off?`,
          viralityScore: 78,
          safetyScore: 84,
          styleMatchScore: 76,
          reasoning: "Simulated variant for the review flow demo.",
        },
      ],
    };
    set({
      drafts: [draft, ...s.drafts],
      newsItems: s.newsItems.map((n) =>
        n.id === newsItemId ? { ...n, drafted: true } : n,
      ),
      activity: [
        activityEvent("draft", `2 variants drafted on demand: ${news.headline.slice(0, 60)}…`),
        ...s.activity,
      ],
    });
  },

  toggleRule: (id) =>
    set((s) => ({
      styleRules: s.styleRules.map((r) =>
        r.id === id ? { ...r, active: !r.active } : r,
      ),
    })),

  addRule: (rule) =>
    set((s) => ({
      styleRules: [{ ...rule, id: nextId("r") }, ...s.styleRules],
    })),

  removeRule: (id) =>
    set((s) => ({ styleRules: s.styleRules.filter((r) => r.id !== id) })),

  removeExample: (id) =>
    set((s) => ({
      styleExamples: s.styleExamples.filter((e) => e.id !== id),
    })),

  toggleCompetitor: (id) =>
    set((s) => ({
      competitors: s.competitors.map((c) =>
        c.id === id ? { ...c, tracked: !c.tracked } : c,
      ),
    })),

  addCompetitor: (handle) =>
    set((s) => ({
      competitors: [
        {
          id: nextId("c"),
          handle: handle.replace(/^@/, ""),
          name: handle.replace(/^@/, ""),
          followers: 0,
          followersDelta30d: 0,
          avgEngagementPerPost: 0,
          postsPerDay: 0,
          patterns: ["Analyzing… first pattern report in ~24h (simulated)"],
          recentWins: [],
          tracked: true,
        },
        ...s.competitors,
      ],
    })),
}));
