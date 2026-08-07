// Shared UI types for the Ragebaitx dashboard.
// These mirror the planned DB schema (see BUILD_PLAN) so Part B wiring is a drop-in.

export type OperatingMode = "training" | "live";

export type ModelId = "claude" | "gpt" | "grok" | "gemini";

export const MODEL_META: Record<
  ModelId,
  { label: string; short: string; color: string }
> = {
  claude: { label: "Claude Sonnet", short: "CL", color: "var(--viz-8)" },
  gpt: { label: "GPT-5", short: "GP", color: "var(--viz-2)" },
  grok: { label: "Grok", short: "GK", color: "var(--viz-1)" },
  gemini: { label: "Gemini Flash", short: "GM", color: "var(--viz-5)" },
};

export type HookAngle =
  | "outrage"
  | "question"
  | "cliffhanger"
  | "statistic"
  | "quote";

export const HOOK_LABELS: Record<HookAngle, string> = {
  outrage: "Outrage",
  question: "Question",
  cliffhanger: "Cliffhanger",
  statistic: "Statistic",
  quote: "Quote",
};

export type TrendState = "rising" | "peaking" | "fading";

export interface SourceMedia {
  type: "photo" | "video";
  thumbUrl: string; // mock: local gradient placeholder id, e.g. "m1"
  duration?: string; // "0:15" for video
  credit: string; // original creator handle for attributed reuse
}

// A candidate news item found by the crawler or a keyword run.
export interface NewsItem {
  id: string;
  headline: string; // original source headline / tweet text (condensed)
  summary: string;
  sourceHandle: string; // where it was found
  topic: string;
  trendState: TrendState;
  velocity: number; // engagements per hour
  velocityDelta: number; // % change last hour, signed
  likes: number;
  reposts: number;
  replies: number;
  foundAt: string; // ISO
  via: "crawl" | "keyword";
  keywordUsed?: string;
  media?: SourceMedia;
  drafted: boolean;
}

export interface DraftVariant {
  id: string;
  model: ModelId;
  hook: HookAngle;
  text: string;
  viralityScore: number; // 0-100
  safetyScore: number; // 0-100
  styleMatchScore: number; // 0-100
  reasoning: string;
}

export type DraftStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "scheduled"
  | "posted";

export interface Draft {
  id: string;
  newsItemId: string;
  variants: DraftVariant[];
  selectedVariantId: string;
  status: DraftStatus;
  createdAt: string;
  editedText?: string; // user's edit of the selected variant
  rejectReason?: string;
  scheduledFor?: string;
  wouldAutoPost: boolean; // scores clear the auto threshold (relevant in Live mode)
}

export type PostOutcome = "hit" | "solid" | "flop";

export interface MetricPoint {
  t: string; // ISO
  impressions: number;
  engagements: number;
}

export interface Post {
  id: string;
  text: string;
  postedAt: string;
  topic: string;
  model: ModelId;
  hook: HookAngle;
  media?: SourceMedia;
  autoPosted: boolean;
  metrics: {
    impressions: number;
    likes: number;
    reposts: number;
    replies: number;
    bookmarks: number;
    profileVisits: number;
    followersGained: number;
  };
  metricsHistory: MetricPoint[]; // first 48h curve
  outcome: PostOutcome;
  estRevenue: number; // USD from ads rev share
}

export type StyleRuleCategory =
  | "tone"
  | "structure"
  | "vocabulary"
  | "formatting"
  | "taboo";

export interface StyleRule {
  id: string;
  category: StyleRuleCategory;
  text: string;
  source: "manual" | "learned";
  learnedFrom?: string; // e.g. "3 edits in July"
  strength: 1 | 2 | 3; // how hard the drafter leans on it
  active: boolean;
}

export interface StyleExample {
  id: string;
  text: string;
  note: string; // why this is a reference example
  addedAt: string;
  impressions?: number;
}

export interface FeedbackEvent {
  id: string;
  draftId: string;
  draftText: string; // snapshot for display
  action: "approved" | "edited" | "rejected";
  detail: string; // the edit made or the reject reason
  lesson?: string; // what the profile learned from it
  at: string;
}

export interface Competitor {
  id: string;
  handle: string;
  name: string;
  followers: number;
  followersDelta30d: number; // signed
  avgEngagementPerPost: number;
  postsPerDay: number;
  patterns: string[]; // extracted patterns feeding the style profile
  recentWins: { text: string; likes: number; reposts: number }[];
  tracked: boolean;
}

export interface Keyword {
  id: string;
  term: string;
  active: boolean;
  addedAt: string;
  lastRunAt?: string;
  resultsFound: number;
}

// 7x24 grid; score 0-100 = historical engagement strength of that slot.
export interface ScheduleSlot {
  day: number; // 0 = Mon
  hour: number; // 0-23
  score: number;
}

export interface BenchmarkReview {
  draftId: string;
  headline: string;
  approved: boolean;
  editDistancePct: number; // 0 = approved untouched
  at: string;
}

export interface BenchmarkState {
  streak: number; // consecutive clean approvals
  target: number; // required streak to graduate
  editDistanceLimit: number; // % edits allowed to still count as "clean"
  recent: BenchmarkReview[];
  graduated: boolean;
}

export interface ModelConfig {
  id: ModelId;
  enabled: boolean;
  apiKeySet: boolean;
  role: "drafting" | "scoring" | "both";
}

export interface AppConfig {
  mode: OperatingMode;
  autoThreshold: number; // virality score needed to auto-post in Live
  safetyFloor: number; // min safety score for ANY post
  benchmarkTarget: number;
  editDistanceLimit: number;
  pollIntervalMin: number;
  perRunLimit: number;
  topics: string[];
  excludedTopics: string[];
  models: ModelConfig[];
  mediaMode: "attributed" | "reupload";
  timing: { holdForPeak: boolean; quietStart: number; quietEnd: number };
  xAccount: {
    handle: string;
    name: string;
    connected: boolean;
    followers: number;
  };
  xApiKeySet: boolean;
}

export interface ActivityEvent {
  id: string;
  at: string;
  type:
    | "crawl"
    | "draft"
    | "post"
    | "approve"
    | "reject"
    | "metrics"
    | "alert"
    | "schedule";
  text: string;
}

export interface SafetyStatus {
  level: "healthy" | "caution" | "risk";
  reachTrendPct: number; // signed, week over week
  shadowbanSignal: boolean;
  lastChecked: string;
  notes: string[];
}

export interface FollowerPoint {
  date: string; // ISO day
  followers: number;
  impressions: number;
  revenue: number; // est USD that day
}
