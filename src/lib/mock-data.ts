// Deterministic mock data for Part A (UI-first build).
// Everything here is FICTIONAL placeholder content — invented people, outlets
// and events. Deterministic (fixed base date + seeded PRNG) so SSR and client
// render identically.

import type {
  ActivityEvent,
  AppConfig,
  BenchmarkState,
  Competitor,
  Draft,
  FeedbackEvent,
  FollowerPoint,
  Keyword,
  NewsItem,
  Post,
  SafetyStatus,
  ScheduleSlot,
  StyleExample,
  StyleRule,
} from "./types";

// Fixed "now" so every render agrees. Part B replaces this with real data.
export const NOW = new Date("2026-08-07T14:30:00+05:30");

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(NOW.getTime() - ms).toISOString();
}
export function ahead(ms: number): string {
  return new Date(NOW.getTime() + ms).toISOString();
}

// mulberry32 — tiny seeded PRNG, deterministic across runs.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ─── News items (crawl + keyword results) ─────────────────────────── */

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    headline:
      "Highway ministry audit finds ₹840 Cr paid to contractor with zero completed kilometres",
    summary:
      "A leaked CAG-style audit shows Trident Infra received full payment on the Nagpur ring-road package despite no certified progress. Opposition demanding a JPC probe.",
    sourceHandle: "NationFirstWire",
    topic: "Politics",
    trendState: "rising",
    velocity: 4820,
    velocityDelta: 62,
    likes: 12400,
    reposts: 4100,
    replies: 2350,
    foundAt: ago(38 * MIN),
    via: "crawl",
    media: { type: "photo", thumbUrl: "g1", credit: "NationFirstWire" },
    drafted: true,
  },
  {
    id: "n2",
    headline:
      "Star batsman Ravi Malhotra caught on hot mic calling selection committee 'a circus of uncles'",
    summary:
      "Audio from a charity match broadcast picked up Malhotra's comments minutes after his omission from the Asia Cup squad was announced.",
    sourceHandle: "PitchsideDaily",
    topic: "Cricket",
    trendState: "rising",
    velocity: 7100,
    velocityDelta: 118,
    likes: 28900,
    reposts: 9800,
    replies: 6100,
    foundAt: ago(22 * MIN),
    via: "crawl",
    media: {
      type: "video",
      thumbUrl: "g2",
      duration: "0:21",
      credit: "PitchsideDaily",
    },
    drafted: true,
  },
  {
    id: "n3",
    headline:
      "Film star Arjun Rawal walks out of live interview after question on stalled dam project he endorsed",
    summary:
      "Rawal, brand ambassador for the Vindhya irrigation scheme, removed his mic on air when pressed about displaced villagers still awaiting compensation.",
    sourceHandle: "ScreenAndState",
    topic: "Entertainment",
    trendState: "peaking",
    velocity: 5200,
    velocityDelta: 8,
    likes: 41200,
    reposts: 11800,
    replies: 8900,
    foundAt: ago(2 * HOUR + 10 * MIN),
    via: "crawl",
    media: {
      type: "video",
      thumbUrl: "g3",
      duration: "0:34",
      credit: "ScreenAndState",
    },
    drafted: true,
  },
  {
    id: "n4",
    headline:
      "RBI deputy governor's dissent note leaks: 'retail inflation math being window-dressed'",
    summary:
      "An internal note attributed to deputy governor S. Krishnamoorthy questions the base-revision used in July's CPI release. RBI has not denied authenticity.",
    sourceHandle: "MacroBharat",
    topic: "Economy",
    trendState: "rising",
    velocity: 2900,
    velocityDelta: 45,
    likes: 8300,
    reposts: 3900,
    replies: 1500,
    foundAt: ago(55 * MIN),
    via: "crawl",
    media: { type: "photo", thumbUrl: "g4", credit: "MacroBharat" },
    drafted: false,
  },
  {
    id: "n5",
    headline:
      "MLA Sarita Bhosle's degree row: university says records for her batch 'destroyed in 2019 flood'",
    summary:
      "The varsity's RTI reply contradicts its own 2022 statement that all records were digitised in 2017. Bhosle calls the row 'manufactured'.",
    sourceHandle: "RTIWatchdog",
    topic: "Politics",
    trendState: "peaking",
    velocity: 3600,
    velocityDelta: -4,
    likes: 19800,
    reposts: 7200,
    replies: 5400,
    foundAt: ago(3 * HOUR + 40 * MIN),
    via: "crawl",
    media: { type: "photo", thumbUrl: "g5", credit: "RTIWatchdog" },
    drafted: true,
  },
  {
    id: "n6",
    headline:
      "EdTech unicorn LearnSprint locks 4,000 students out of paid courses over 'server migration'",
    summary:
      "Parents report courses inaccessible for 11 days while the company continued charging EMIs. Former employees allege the firm is quietly winding down.",
    sourceHandle: "StartupSentinel",
    topic: "Tech",
    trendState: "rising",
    velocity: 1850,
    velocityDelta: 31,
    likes: 6200,
    reposts: 2800,
    replies: 1900,
    foundAt: ago(1 * HOUR + 25 * MIN),
    via: "crawl",
    drafted: false,
  },
  {
    id: "n7",
    headline:
      "High court judge recuses from telecom case hours after old consultancy invoice surfaces online",
    summary:
      "Justice M. Chandrachud-Rao stepped back from the spectrum-refund hearing after a 2016 invoice linking him to a litigant's parent firm circulated.",
    sourceHandle: "BarAndBenchmark",
    topic: "Judiciary",
    trendState: "fading",
    velocity: 900,
    velocityDelta: -38,
    likes: 15600,
    reposts: 5100,
    replies: 2600,
    foundAt: ago(9 * HOUR),
    via: "crawl",
    drafted: false,
  },
  {
    id: "n8",
    headline:
      "Exclusive: metro rail phase-3 tender re-issued third time, each time narrower spec matching one bidder",
    summary:
      "Procurement documents show successive spec revisions eliminating all but Kaveri Consortium. Urban development ministry says process was 'routine'.",
    sourceHandle: "TenderTracker",
    topic: "Infrastructure",
    trendState: "rising",
    velocity: 1200,
    velocityDelta: 54,
    likes: 3400,
    reposts: 1700,
    replies: 800,
    foundAt: ago(48 * MIN),
    via: "keyword",
    keywordUsed: "metro tender",
    drafted: true,
  },
  {
    id: "n9",
    headline:
      "Cricket board's new kit sponsor is 3-month-old firm registered at a Gurugram co-working desk",
    summary:
      "Corporate filings show ApexEleven Sportswear incorporated in May with ₹1 lakh capital, weeks before winning the ₹380 Cr sponsorship.",
    sourceHandle: "PitchsideDaily",
    topic: "Cricket",
    trendState: "rising",
    velocity: 2100,
    velocityDelta: 72,
    likes: 5900,
    reposts: 2600,
    replies: 1400,
    foundAt: ago(1 * HOUR + 5 * MIN),
    via: "keyword",
    keywordUsed: "BCCI sponsor",
    drafted: false,
  },
  {
    id: "n10",
    headline:
      "Minister Devraj Khanna's 'farmers are eating better than ever' remark clipped against onion price footage",
    summary:
      "A 9-second clip from Khanna's Vidarbha rally is being shared against mandi footage of onions at ₹96/kg. Full speech shows added context; clip is outrunning it 40:1.",
    sourceHandle: "NationFirstWire",
    topic: "Politics",
    trendState: "peaking",
    velocity: 6400,
    velocityDelta: 12,
    likes: 52300,
    reposts: 18800,
    replies: 14200,
    foundAt: ago(4 * HOUR + 15 * MIN),
    via: "crawl",
    media: {
      type: "video",
      thumbUrl: "g6",
      duration: "0:09",
      credit: "NationFirstWire",
    },
    drafted: false,
  },
];

/* ─── Drafts awaiting review ───────────────────────────────────────── */

export const drafts: Draft[] = [
  {
    id: "d1",
    newsItemId: "n2",
    selectedVariantId: "d1v1",
    status: "pending",
    createdAt: ago(14 * MIN),
    wouldAutoPost: true,
    variants: [
      {
        id: "d1v1",
        model: "grok",
        hook: "outrage",
        text: "🚨 HOT MIC DISASTER: Ravi Malhotra calls the selection committee 'a circus of uncles' — MINUTES after they dropped him from the Asia Cup squad.\n\nThe board demanded an apology. His reply? 'For what, the truth?'\n\nIndian cricket's civil war just went public.",
        viralityScore: 91,
        safetyScore: 84,
        styleMatchScore: 88,
        reasoning:
          "Direct quote is the payload; 'civil war' frames an ongoing story readers will follow. Rising trend, video attached, quote verified on broadcast audio.",
      },
      {
        id: "d1v2",
        model: "claude",
        hook: "question",
        text: "Ravi Malhotra just said what every fan whispers: the selection committee is 'a circus of uncles.'\n\nDropped from the Asia Cup squad. Hot mic picks up everything.\n\nQuestion is — was he wrong?",
        viralityScore: 84,
        safetyScore: 92,
        styleMatchScore: 90,
        reasoning:
          "Closing question drives reply volume; softer framing raises safety. Slightly lower ceiling than the outrage cut.",
      },
      {
        id: "d1v3",
        model: "gpt",
        hook: "cliffhanger",
        text: "A hot mic. A dropped star. Three words that just set Indian cricket on fire.\n\nRavi Malhotra didn't know the broadcast feed was live. What he said about the selectors will follow him for years. 🧵",
        viralityScore: 79,
        safetyScore: 90,
        styleMatchScore: 74,
        reasoning:
          "Withholds the quote to force the click-through — but thread promise ('🧵') without a thread planned lowers style match.",
      },
    ],
  },
  {
    id: "d2",
    newsItemId: "n1",
    selectedVariantId: "d2v2",
    status: "pending",
    createdAt: ago(31 * MIN),
    wouldAutoPost: true,
    variants: [
      {
        id: "d2v1",
        model: "gpt",
        hook: "statistic",
        text: "₹840,00,00,000 paid.\n0 kilometres built.\n\nThe leaked highway audit on the Nagpur ring-road package is the most brazen thing you'll read this year. Trident Infra got FULL payment on uncertified work.\n\nWho signed this off?",
        viralityScore: 88,
        safetyScore: 86,
        styleMatchScore: 91,
        reasoning:
          "Number-contrast opener is proven format in this account's example bank (3 prior hits). Closing question targets quote-repost behaviour.",
      },
      {
        id: "d2v2",
        model: "claude",
        hook: "outrage",
        text: "₹840 CRORE for a highway that does not exist.\n\nLeaked audit: Trident Infra received full payment on the Nagpur ring-road — zero certified kilometres. Ministry response? 'Procedural review underway.'\n\nYour toll money. Their procedure.",
        viralityScore: 90,
        safetyScore: 85,
        styleMatchScore: 93,
        reasoning:
          "'Your money' close personalises the outrage — the account's strongest learned pattern. All claims trace to the audit doc itself.",
      },
      {
        id: "d2v3",
        model: "gemini",
        hook: "question",
        text: "How does a contractor collect ₹840 Cr for a road with zero completed kilometres?\n\nThe leaked Nagpur ring-road audit says exactly that — and the ministry isn't denying the document.",
        viralityScore: 81,
        safetyScore: 91,
        styleMatchScore: 82,
        reasoning:
          "Clean and safe, but opens with the question rather than the number — historically ~15% lower CTR for this account.",
      },
    ],
  },
  {
    id: "d3",
    newsItemId: "n3",
    selectedVariantId: "d3v1",
    status: "pending",
    createdAt: ago(1 * HOUR + 48 * MIN),
    wouldAutoPost: false,
    variants: [
      {
        id: "d3v1",
        model: "grok",
        hook: "cliffhanger",
        text: "One question ended Arjun Rawal's interview in 40 seconds.\n\nNot about his film. About the dam he's paid to promote — and the 1,200 families still waiting for compensation.\n\nHe took the mic off on live TV. The clip speaks for itself. 🎥",
        viralityScore: 86,
        safetyScore: 78,
        styleMatchScore: 85,
        reasoning:
          "Walk-out video does the heavy lifting. Safety below floor (80) because compensation figure is from the interviewer's claim, not verified records — routed to review.",
      },
      {
        id: "d3v2",
        model: "claude",
        hook: "quote",
        text: "'We'll talk about my film, or we won't talk.'\n\nArjun Rawal, live on air, when asked about the stalled dam project he endorses — and the villagers still waiting on compensation.\n\nThe mic came off 40 seconds later.",
        viralityScore: 82,
        safetyScore: 88,
        styleMatchScore: 86,
        reasoning:
          "Leads with his own words — attribution-safe and cold enough to let the audience supply the anger.",
      },
    ],
  },
  {
    id: "d4",
    newsItemId: "n5",
    selectedVariantId: "d4v1",
    status: "pending",
    createdAt: ago(2 * HOUR + 20 * MIN),
    wouldAutoPost: false,
    variants: [
      {
        id: "d4v1",
        model: "claude",
        hook: "outrage",
        text: "2022: 'All records digitised in 2017.' ✅\n2026: 'Records destroyed in the 2019 flood.' 🌊\n\nSame university. Same registrar's office. Same MLA's degree in question.\n\nPick a story, professors.",
        viralityScore: 87,
        safetyScore: 82,
        styleMatchScore: 89,
        reasoning:
          "Timeline-contradiction format — both statements are on RTI record, so the receipts carry the post. 'Pick a story' close matches account voice.",
      },
      {
        id: "d4v2",
        model: "gemini",
        hook: "statistic",
        text: "One university. Two RTI replies. Zero consistency.\n\n2022: records digitised. 2026: records destroyed in a flood — three years before the digitisation claim.\n\nMLA Bhosle's degree row now has a paperwork problem of its own.",
        viralityScore: 80,
        safetyScore: 89,
        styleMatchScore: 81,
        reasoning:
          "Counting structure is tidy but buries the flood/digitisation contradiction in line 3; weaker first-second hook.",
      },
    ],
  },
  {
    id: "d5",
    newsItemId: "n8",
    selectedVariantId: "d5v2",
    status: "pending",
    createdAt: ago(26 * MIN),
    wouldAutoPost: false,
    variants: [
      {
        id: "d5v1",
        model: "gpt",
        hook: "cliffhanger",
        text: "Three tenders. Three revisions. Each one narrower than the last — until exactly one company could qualify.\n\nThe metro phase-3 paper trail is a masterclass in how procurement gets steered. And it's all public record. 🧾",
        viralityScore: 78,
        safetyScore: 87,
        styleMatchScore: 83,
        reasoning:
          "Procurement stories underperform on raw virality but overperform on bookmarks/reposts from journalist accounts — solid follower-quality play.",
      },
      {
        id: "d5v2",
        model: "claude",
        hook: "statistic",
        text: "Tender issued: 14 bidders eligible.\nRevision 1: 6 bidders.\nRevision 2: 3 bidders.\nRevision 3: exactly ONE — Kaveri Consortium.\n\nThe ministry calls this 'routine'. The documents call it something else.",
        viralityScore: 83,
        safetyScore: 88,
        styleMatchScore: 90,
        reasoning:
          "Descending-count structure creates the narrative arithmetic for the reader — receipts format, account's signature.",
      },
    ],
  },
  {
    id: "d6",
    newsItemId: "n2",
    selectedVariantId: "d6v1",
    status: "rejected",
    createdAt: ago(5 * HOUR),
    rejectReason: "Too speculative — 'rigged selection' isn't in any source.",
    wouldAutoPost: false,
    variants: [
      {
        id: "d6v1",
        model: "grok",
        hook: "outrage",
        text: "RIGGED? Malhotra's hot mic rant hints selection was decided before trials even began. The 'circus of uncles' runs deeper than you think…",
        viralityScore: 89,
        safetyScore: 58,
        styleMatchScore: 61,
        reasoning:
          "High engagement ceiling but introduces an unsourced rigging claim — fails the faithfulness rule.",
      },
    ],
  },
];

/* ─── Published posts (30-day history) ─────────────────────────────── */

const postSeeds: Array<{
  text: string;
  topic: string;
  model: Post["model"];
  hook: Post["hook"];
  daysAgo: number;
  hourOfDay: number;
  outcome: Post["outcome"];
  impressions: number;
  auto?: boolean;
  media?: Post["media"];
}> = [
  {
    text: "₹2,300 Cr farm-loan waiver announced. ₹190 Cr disbursed. 8% in 14 months.\n\nThe assembly reply is one page long and it ends every speech given on this scheme.",
    topic: "Politics",
    model: "claude",
    hook: "statistic",
    daysAgo: 1,
    hourOfDay: 20,
    outcome: "hit",
    impressions: 842000,
    media: { type: "photo", thumbUrl: "g7", credit: "AssemblyRecords" },
  },
  {
    text: "'The pitch was fine. The batting wasn't.'\n\nCurator Ramesh Pillai breaks silence after 3 days of being blamed for the Kanpur collapse — and brings soil-test receipts.",
    topic: "Cricket",
    model: "grok",
    hook: "quote",
    daysAgo: 2,
    hourOfDay: 21,
    outcome: "hit",
    impressions: 617000,
    auto: false,
    media: { type: "photo", thumbUrl: "g8", credit: "PitchsideDaily" },
  },
  {
    text: "A ₹4.7 Cr 'consultancy fee' to a firm that shares a wall, a pin code, and a chartered accountant with the minister's family trust.\n\nCoincidence has an address now.",
    topic: "Politics",
    model: "claude",
    hook: "outrage",
    daysAgo: 3,
    hourOfDay: 19,
    outcome: "hit",
    impressions: 731000,
  },
  {
    text: "Why did the airline's on-time rating jump 11 points the same month the aviation regulator changed how 'delay' is defined?\n\nSchedule padding, explained in one chart. 📊",
    topic: "Economy",
    model: "gpt",
    hook: "question",
    daysAgo: 4,
    hourOfDay: 13,
    outcome: "solid",
    impressions: 296000,
  },
  {
    text: "The 'sold out in 60 seconds' concert had 40% of seats blocked for 'partners'.\n\nTicketing platform's own dashboard screenshots are doing the rounds. Scalpers didn't beat you — the system did.",
    topic: "Entertainment",
    model: "grok",
    hook: "outrage",
    daysAgo: 5,
    hourOfDay: 22,
    outcome: "hit",
    impressions: 903000,
    auto: false,
  },
  {
    text: "Budget hotel chain's 'sanitised' badge: awarded by an agency it owns.\n\nSelf-certification is the new certification.",
    topic: "Tech",
    model: "gemini",
    hook: "statistic",
    daysAgo: 6,
    hourOfDay: 12,
    outcome: "flop",
    impressions: 41000,
  },
  {
    text: "18 months. 4 committees. 0 reports.\n\nThe stadium roof that collapsed in March has now outlasted every deadline set to explain why it collapsed.",
    topic: "Infrastructure",
    model: "claude",
    hook: "statistic",
    daysAgo: 8,
    hourOfDay: 20,
    outcome: "hit",
    impressions: 556000,
  },
  {
    text: "'Technical glitch' is doing a lot of work in this press release.\n\nBank's UPI outage hit exactly — exactly — the 48 hours EMIs auto-debit. Refund timeline: 'in due course'.",
    topic: "Economy",
    model: "grok",
    hook: "outrage",
    daysAgo: 9,
    hourOfDay: 19,
    outcome: "solid",
    impressions: 387000,
  },
  {
    text: "The anti-piracy cell's training video used a pirated font.\n\nInvoice for the font license: not found. Irony: found.",
    topic: "Tech",
    model: "gpt",
    hook: "cliffhanger",
    daysAgo: 11,
    hourOfDay: 21,
    outcome: "solid",
    impressions: 254000,
  },
  {
    text: "Sports quota list: 34 names.\nState-level certificates verified: 11.\n\nThe other 23 are 'under process' — after admissions closed.",
    topic: "Politics",
    model: "claude",
    hook: "statistic",
    daysAgo: 13,
    hourOfDay: 20,
    outcome: "solid",
    impressions: 312000,
  },
  {
    text: "Film city's ₹600 Cr 'international studio' has hosted 2 shoots in 3 years.\n\nBoth were government ads. About the film city.",
    topic: "Entertainment",
    model: "claude",
    hook: "outrage",
    daysAgo: 15,
    hourOfDay: 18,
    outcome: "hit",
    impressions: 689000,
  },
  {
    text: "Toll plaza collected ₹27 Cr AFTER its contract expired. NHAI says software wasn't updated.\n\nThe software knew how to charge. Just not how to stop.",
    topic: "Infrastructure",
    model: "grok",
    hook: "outrage",
    daysAgo: 17,
    hourOfDay: 20,
    outcome: "hit",
    impressions: 794000,
  },
  {
    text: "Who audits the exit poll that's wrong by 90 seats?\n\nNobody. That's the business model.",
    topic: "Politics",
    model: "gpt",
    hook: "question",
    daysAgo: 19,
    hourOfDay: 21,
    outcome: "flop",
    impressions: 67000,
  },
  {
    text: "'Record procurement' press note vs mandi arrival data: a 2.4 lakh tonne gap.\n\nEither the grain is invisible or the press note is. 🌾",
    topic: "Economy",
    model: "gemini",
    hook: "statistic",
    daysAgo: 21,
    hourOfDay: 13,
    outcome: "solid",
    impressions: 228000,
  },
  {
    text: "The committee investigating the leak has leaked.\n\nIts draft report — marked STRICTLY CONFIDENTIAL — is on three Telegram channels. Meta-scandal unlocked.",
    topic: "Judiciary",
    model: "grok",
    hook: "cliffhanger",
    daysAgo: 23,
    hourOfDay: 22,
    outcome: "hit",
    impressions: 651000,
  },
  {
    text: "University tops 'clean campus' rankings. Also university: 11 pending harassment inquiries, oldest from 2021.\n\nThe ranking counted dustbins.",
    topic: "Politics",
    model: "claude",
    hook: "outrage",
    daysAgo: 25,
    hourOfDay: 19,
    outcome: "solid",
    impressions: 341000,
  },
  {
    text: "New expressway's 'AI traffic management' is a WhatsApp group.\n\nRTI reply attaches the screenshots. Group name: 'Traffic Bros 🚦'.",
    topic: "Infrastructure",
    model: "gpt",
    hook: "cliffhanger",
    daysAgo: 27,
    hourOfDay: 20,
    outcome: "hit",
    impressions: 1120000,
  },
  {
    text: "Broadcaster's 'exclusive' sting operation: filmed in 2019, aired as breaking news in 2026.\n\nThe anchor's hairstyle gave it away. Viewers did the forensics.",
    topic: "Entertainment",
    model: "grok",
    hook: "outrage",
    daysAgo: 29,
    hourOfDay: 21,
    outcome: "solid",
    impressions: 402000,
  },
];

function buildPost(seed: (typeof postSeeds)[number], i: number): Post {
  const r = rng(1000 + i);
  const postedAtMs =
    NOW.getTime() - seed.daysAgo * DAY - (14 - seed.hourOfDay) * HOUR;
  const engRate = seed.outcome === "hit" ? 0.062 : seed.outcome === "solid" ? 0.041 : 0.018;
  const engagements = Math.round(seed.impressions * engRate);
  const likes = Math.round(engagements * 0.62);
  const reposts = Math.round(engagements * 0.21);
  const replies = Math.round(engagements * 0.11);
  const bookmarks = engagements - likes - reposts - replies;
  // 12-point first-48h curve: sharp rise, long tail.
  const history = Array.from({ length: 12 }, (_, k) => {
    const frac = 1 - Math.exp(-(k + 1) / 3.2);
    const jitter = 0.94 + r() * 0.12;
    return {
      t: new Date(postedAtMs + k * 4 * HOUR).toISOString(),
      impressions: Math.round(seed.impressions * frac * jitter),
      engagements: Math.round(engagements * frac * jitter),
    };
  });
  return {
    id: `p${i + 1}`,
    text: seed.text,
    postedAt: new Date(postedAtMs).toISOString(),
    topic: seed.topic,
    model: seed.model,
    hook: seed.hook,
    media: seed.media,
    autoPosted: seed.auto ?? seed.daysAgo > 14,
    metrics: {
      impressions: seed.impressions,
      likes,
      reposts,
      replies,
      bookmarks,
      profileVisits: Math.round(seed.impressions * 0.011),
      followersGained: Math.round(
        seed.impressions * (seed.outcome === "hit" ? 0.0021 : 0.0009),
      ),
    },
    metricsHistory: history,
    outcome: seed.outcome,
    estRevenue: Math.round(seed.impressions * 0.000082 * 100) / 100,
  };
}

export const posts: Post[] = postSeeds.map(buildPost);

/* ─── 30-day account growth series ─────────────────────────────────── */

export const followerSeries: FollowerPoint[] = (() => {
  const r = rng(42);
  const out: FollowerPoint[] = [];
  let followers = 18400;
  for (let d = 30; d >= 0; d--) {
    const dayPosts = posts.filter(
      (p) =>
        Math.floor((NOW.getTime() - new Date(p.postedAt).getTime()) / DAY) === d,
    );
    const dayImpr =
      dayPosts.reduce((s, p) => s + p.metrics.impressions, 0) * 0.55 +
      60000 +
      r() * 90000;
    const gained =
      dayPosts.reduce((s, p) => s + p.metrics.followersGained, 0) +
      Math.round(20 + r() * 60);
    followers += gained;
    out.push({
      date: new Date(NOW.getTime() - d * DAY).toISOString().slice(0, 10),
      followers,
      impressions: Math.round(dayImpr),
      revenue: Math.round(dayImpr * 0.000082 * 100) / 100,
    });
  }
  return out;
})();

/* ─── Style profile ────────────────────────────────────────────────── */

export const styleRules: StyleRule[] = [
  {
    id: "r1",
    category: "structure",
    text: "Open with the hardest number or the contradiction — never with background.",
    source: "learned",
    learnedFrom: "4 edits, wk of Jul 20",
    strength: 3,
    active: true,
  },
  {
    id: "r2",
    category: "tone",
    text: "Cold anger over exclamation marks. Let the facts be the outrage; max one emoji.",
    source: "manual",
    strength: 3,
    active: true,
  },
  {
    id: "r3",
    category: "structure",
    text: "Close with a short personalising line ('Your toll money. Their procedure.') or a question that invites quote-posts.",
    source: "learned",
    learnedFrom: "hit-pattern analysis, Jul 28",
    strength: 2,
    active: true,
  },
  {
    id: "r4",
    category: "taboo",
    text: "Never state a claim that isn't in the source document/clip. Allegations must be attributed ('audit says', 'per the RTI reply').",
    source: "manual",
    strength: 3,
    active: true,
  },
  {
    id: "r5",
    category: "formatting",
    text: "Numbers as contrast pairs on separate lines (paid vs built, promised vs delivered).",
    source: "learned",
    learnedFrom: "3 hits using this format",
    strength: 2,
    active: true,
  },
  {
    id: "r6",
    category: "vocabulary",
    text: "Ban words: 'shocking', 'unbelievable', 'you won't believe'. They read as spam and cap reach.",
    source: "manual",
    strength: 3,
    active: true,
  },
  {
    id: "r7",
    category: "taboo",
    text: "No religion-vs-religion framing. Institutions and money trails only.",
    source: "manual",
    strength: 3,
    active: true,
  },
  {
    id: "r8",
    category: "structure",
    text: "If the media (clip/photo) carries the story, keep text under 200 chars and point at the media.",
    source: "learned",
    learnedFrom: "video posts outperform 2.3x with short text",
    strength: 2,
    active: true,
  },
  {
    id: "r9",
    category: "formatting",
    text: "No thread emoji (🧵) unless a thread is actually queued.",
    source: "learned",
    learnedFrom: "reject reason, Aug 2",
    strength: 1,
    active: true,
  },
  {
    id: "r10",
    category: "tone",
    text: "Sarcasm only in the closing line, never in the fact lines.",
    source: "manual",
    strength: 2,
    active: false,
  },
];

export const styleExamples: StyleExample[] = [
  {
    id: "e1",
    text: "₹2,300 Cr farm-loan waiver announced. ₹190 Cr disbursed. 8% in 14 months.\n\nThe assembly reply is one page long and it ends every speech given on this scheme.",
    note: "Signature format: number contrast → receipt → dry close. 842K impressions.",
    addedAt: ago(1 * DAY),
    impressions: 842000,
  },
  {
    id: "e2",
    text: "New expressway's 'AI traffic management' is a WhatsApp group.\n\nRTI reply attaches the screenshots. Group name: 'Traffic Bros 🚦'.",
    note: "Absurdity format — the detail ('Traffic Bros') does the work. Best post of the month.",
    addedAt: ago(27 * DAY),
    impressions: 1120000,
  },
  {
    id: "e3",
    text: "Toll plaza collected ₹27 Cr AFTER its contract expired. NHAI says software wasn't updated.\n\nThe software knew how to charge. Just not how to stop.",
    note: "Personification close. High repost-to-like ratio (0.34).",
    addedAt: ago(17 * DAY),
    impressions: 794000,
  },
  {
    id: "e4",
    text: "The committee investigating the leak has leaked.\n\nIts draft report — marked STRICTLY CONFIDENTIAL — is on three Telegram channels. Meta-scandal unlocked.",
    note: "Irony-first works when the story IS the irony. Don't force it elsewhere.",
    addedAt: ago(23 * DAY),
    impressions: 651000,
  },
  {
    id: "e5",
    text: "'The pitch was fine. The batting wasn't.'\n\nCurator Ramesh Pillai breaks silence after 3 days of being blamed for the Kanpur collapse — and brings soil-test receipts.",
    note: "Quote-led sports template: let the wronged party speak first.",
    addedAt: ago(2 * DAY),
    impressions: 617000,
  },
];

/* ─── Feedback log ─────────────────────────────────────────────────── */

export const feedbackEvents: FeedbackEvent[] = [
  {
    id: "f1",
    draftId: "d6",
    draftText: "RIGGED? Malhotra's hot mic rant hints selection was decided before trials even began…",
    action: "rejected",
    detail: "Too speculative — 'rigged selection' isn't in any source.",
    lesson: "Strengthened rule r4 (attribution required) to strength 3.",
    at: ago(5 * HOUR),
  },
  {
    id: "f2",
    draftId: "hist-21",
    draftText: "SHOCKING: exit polls off by 90 seats and nobody will say why…",
    action: "edited",
    detail: "Removed 'SHOCKING', restructured to open with the 90-seat number.",
    lesson: "Added ban-word rule r6.",
    at: ago(2 * DAY + 3 * HOUR),
  },
  {
    id: "f3",
    draftId: "hist-20",
    draftText: "₹2,300 Cr farm-loan waiver announced. ₹190 Cr disbursed…",
    action: "approved",
    detail: "Approved untouched.",
    at: ago(1 * DAY + 6 * HOUR),
  },
  {
    id: "f4",
    draftId: "hist-19",
    draftText: "'The pitch was fine. The batting wasn't.' Curator Ramesh Pillai breaks silence…",
    action: "approved",
    detail: "Approved untouched.",
    at: ago(2 * DAY + 5 * HOUR),
  },
  {
    id: "f5",
    draftId: "hist-18",
    draftText: "A ₹4.7 Cr 'consultancy fee' to a firm that shares a wall…",
    action: "edited",
    detail: "Tightened close from two sentences to 'Coincidence has an address now.' (−9% length)",
    lesson: "Reinforced r3: short personalising close.",
    at: ago(3 * DAY + 2 * HOUR),
  },
  {
    id: "f6",
    draftId: "hist-17",
    draftText: "Thread 🧵 on the airline delay definition change…",
    action: "edited",
    detail: "Removed thread emoji — no thread was queued. Converted to single post with chart.",
    lesson: "Added rule r9.",
    at: ago(4 * DAY + 4 * HOUR),
  },
  {
    id: "f7",
    draftId: "hist-16",
    draftText: "Concert 'sold out in 60 seconds' — but 40% of seats were blocked…",
    action: "approved",
    detail: "Approved untouched.",
    at: ago(5 * DAY + 1 * HOUR),
  },
  {
    id: "f8",
    draftId: "hist-15",
    draftText: "Hotel chain's hygiene badge scandal — every 'certified' property…",
    action: "edited",
    detail: "Cut from 480 to 190 chars; flopped anyway (41K). Marked topic 'consumer-certification' as weak.",
    lesson: "Topic weighting: certification stories −20% priority.",
    at: ago(6 * DAY + 2 * HOUR),
  },
];

/* ─── Competitors ──────────────────────────────────────────────────── */

export const competitors: Competitor[] = [
  {
    id: "c1",
    handle: "DeshKaSach",
    name: "Desh Ka Sach",
    followers: 486000,
    followersDelta30d: 38200,
    avgEngagementPerPost: 21400,
    postsPerDay: 6.2,
    patterns: [
      "Posts within 20 min of a story breaking — speed over polish",
      "Number-first openers on 70% of hits",
      "Quote-posts its own viral posts 6h later with an update line",
    ],
    recentWins: [
      {
        text: "₹340 Cr 'smart classroom' tender: laptops billed at 3x retail. The vendor? Registered last month.",
        likes: 48200,
        reposts: 16800,
      },
      {
        text: "Minister's convoy: 22 vehicles. District's working ambulances: 9. One photo, whole story.",
        likes: 61300,
        reposts: 24100,
      },
    ],
    tracked: true,
  },
  {
    id: "c2",
    handle: "ScamAlertIN",
    name: "Scam Alert India",
    followers: 312000,
    followersDelta30d: 21500,
    avgEngagementPerPost: 15800,
    postsPerDay: 3.8,
    patterns: [
      "Document screenshots with red-circle annotations in every post",
      "Weekly 'scam recap' thread every Sunday 8pm — reliable engagement floor",
    ],
    recentWins: [
      {
        text: "The 'organic' certification stamp on 6 brands traces to one rubber-stamp shop in Karol Bagh. Receipts attached.",
        likes: 33900,
        reposts: 12700,
      },
    ],
    tracked: true,
  },
  {
    id: "c3",
    handle: "NyayaWatch",
    name: "Nyaya Watch",
    followers: 198000,
    followersDelta30d: 9400,
    avgEngagementPerPost: 8900,
    postsPerDay: 2.1,
    patterns: [
      "Long-form quote cards from court transcripts — high bookmark ratio",
      "Never posts before 7pm; audience is post-work readers",
    ],
    recentWins: [
      {
        text: "'Where is the file?' — the judge asked 11 times in one hearing. The registry's answer changed 4 times. Transcript inside.",
        likes: 18700,
        reposts: 7300,
      },
    ],
    tracked: true,
  },
  {
    id: "c4",
    handle: "MetroMirror",
    name: "Metro Mirror",
    followers: 154000,
    followersDelta30d: 17800,
    avgEngagementPerPost: 11200,
    postsPerDay: 4.5,
    patterns: [
      "Before/after infrastructure photos — visual contradiction format",
      "Tags the responsible department handle in a reply, not the post (avoids reach penalty)",
    ],
    recentWins: [
      {
        text: "Inauguration photo vs today, same angle, 14 months apart. The 'world-class' bus terminal grew only weeds.",
        likes: 27600,
        reposts: 10900,
      },
    ],
    tracked: true,
  },
  {
    id: "c5",
    handle: "PrimeTimeLies",
    name: "Prime Time Lies",
    followers: 89000,
    followersDelta30d: -2100,
    avgEngagementPerPost: 3100,
    postsPerDay: 8.9,
    patterns: [
      "Over-posting (9/day) diluting reach — negative example",
      "All-caps openers correlating with follower decline",
    ],
    recentWins: [],
    tracked: false,
  },
];

/* ─── Keywords ─────────────────────────────────────────────────────── */

export const keywords: Keyword[] = [
  {
    id: "k1",
    term: "metro tender",
    active: true,
    addedAt: ago(6 * DAY),
    lastRunAt: ago(48 * MIN),
    resultsFound: 3,
  },
  {
    id: "k2",
    term: "BCCI sponsor",
    active: true,
    addedAt: ago(2 * DAY),
    lastRunAt: ago(65 * MIN),
    resultsFound: 2,
  },
  {
    id: "k3",
    term: "loan waiver",
    active: true,
    addedAt: ago(12 * DAY),
    lastRunAt: ago(3 * HOUR),
    resultsFound: 5,
  },
  {
    id: "k4",
    term: "toll collection",
    active: false,
    addedAt: ago(20 * DAY),
    lastRunAt: ago(4 * DAY),
    resultsFound: 8,
  },
];

/* ─── Posting-time heatmap (7 days × 24 hours) ─────────────────────── */

export const scheduleHeatmap: ScheduleSlot[] = (() => {
  const r = rng(7);
  const out: ScheduleSlot[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Peaks: 7-9am commute, 12-1pm lunch, 7-11pm prime time; weekends shift later.
      const weekend = day >= 5;
      let base = 8;
      if (hour >= 7 && hour <= 9) base = weekend ? 30 : 55;
      else if (hour >= 12 && hour <= 13) base = 48;
      else if (hour >= 19 && hour <= 23) base = weekend ? 88 : 78;
      else if (hour >= 14 && hour <= 18) base = 32;
      else if (hour >= 10 && hour <= 11) base = 26;
      else if (hour >= 0 && hour <= 1) base = weekend ? 34 : 14;
      const score = Math.min(100, Math.round(base * (0.85 + r() * 0.3)));
      out.push({ day, hour, score });
    }
  }
  return out;
})();

export const peakWindowLabel = "Tonight 8:00–10:30 PM IST";

/* ─── Benchmark ────────────────────────────────────────────────────── */

export const benchmark: BenchmarkState = {
  streak: 7,
  target: 10,
  editDistanceLimit: 10,
  graduated: false,
  recent: [
    {
      draftId: "hist-20",
      headline: "Farm-loan waiver: 8% disbursed in 14 months",
      approved: true,
      editDistancePct: 0,
      at: ago(1 * DAY + 6 * HOUR),
    },
    {
      draftId: "hist-19",
      headline: "Curator breaks silence with soil-test receipts",
      approved: true,
      editDistancePct: 0,
      at: ago(2 * DAY + 5 * HOUR),
    },
    {
      draftId: "hist-18",
      headline: "₹4.7 Cr consultancy fee next door",
      approved: true,
      editDistancePct: 4,
      at: ago(3 * DAY + 2 * HOUR),
    },
    {
      draftId: "hist-17",
      headline: "Airline on-time rating vs delay redefinition",
      approved: true,
      editDistancePct: 7,
      at: ago(4 * DAY + 4 * HOUR),
    },
    {
      draftId: "hist-16",
      headline: "Concert seats blocked for 'partners'",
      approved: true,
      editDistancePct: 0,
      at: ago(5 * DAY + 1 * HOUR),
    },
    {
      draftId: "hist-15",
      headline: "Hotel hygiene badge self-certification",
      approved: true,
      editDistancePct: 9,
      at: ago(6 * DAY + 2 * HOUR),
    },
    {
      draftId: "hist-14",
      headline: "Stadium roof: 4 committees, 0 reports",
      approved: true,
      editDistancePct: 0,
      at: ago(8 * DAY),
    },
    {
      draftId: "hist-13",
      headline: "Exit poll accountability question",
      approved: false,
      editDistancePct: 100,
      at: ago(9 * DAY),
    },
  ],
};

/* ─── Config / settings ────────────────────────────────────────────── */

export const appConfig: AppConfig = {
  mode: "training",
  autoThreshold: 85,
  safetyFloor: 80,
  benchmarkTarget: 10,
  editDistanceLimit: 10,
  pollIntervalMin: 20,
  perRunLimit: 20,
  topics: ["Politics", "Cricket", "Economy", "Infrastructure", "Entertainment", "Judiciary", "Tech"],
  excludedTopics: ["Communal", "Personal lives / families", "Unverified deaths"],
  models: [
    { id: "claude", enabled: true, apiKeySet: true, role: "both" },
    { id: "grok", enabled: true, apiKeySet: true, role: "drafting" },
    { id: "gpt", enabled: true, apiKeySet: false, role: "drafting" },
    { id: "gemini", enabled: false, apiKeySet: false, role: "drafting" },
  ],
  mediaMode: "attributed",
  timing: { holdForPeak: true, quietStart: 1, quietEnd: 7 },
  xAccount: {
    handle: "BharatUncut",
    name: "Bharat Uncut",
    connected: true,
    followers: 24180,
  },
  xApiKeySet: true,
};

/* ─── Activity feed ────────────────────────────────────────────────── */

export const activity: ActivityEvent[] = [
  { id: "a1", at: ago(8 * MIN), type: "crawl", text: "Crawl cycle #412: 34 candidates scanned, 3 above threshold" },
  { id: "a2", at: ago(14 * MIN), type: "draft", text: "3 variants drafted for hot-mic story (Grok, Claude, GPT)" },
  { id: "a3", at: ago(26 * MIN), type: "draft", text: "2 variants drafted for metro tender story" },
  { id: "a4", at: ago(48 * MIN), type: "crawl", text: "Keyword run 'metro tender': 3 results, 1 drafted" },
  { id: "a5", at: ago(1 * HOUR + 2 * MIN), type: "metrics", text: "Farm-loan post crossed 800K impressions (+₹64 est.)" },
  { id: "a6", at: ago(2 * HOUR), type: "alert", text: "Draft d3 held: safety 78 below floor 80 (unverified figure)" },
  { id: "a7", at: ago(3 * HOUR + 10 * MIN), type: "metrics", text: "Metrics sweep: 5 posts updated, no anomalies" },
  { id: "a8", at: ago(5 * HOUR), type: "reject", text: "Draft rejected: speculative 'rigged' claim (rule r4 reinforced)" },
  { id: "a9", at: ago(6 * HOUR), type: "schedule", text: "2 approved posts held for tonight's 8–10:30 PM peak window" },
  { id: "a10", at: ago(1 * DAY + 6 * HOUR), type: "approve", text: "Farm-loan draft approved untouched — benchmark streak 7/10" },
  { id: "a11", at: ago(1 * DAY + 7 * HOUR), type: "post", text: "Posted: farm-loan waiver receipts (Claude draft, peak window)" },
  { id: "a12", at: ago(2 * DAY), type: "metrics", text: "Weekly report: +4,120 followers, est. revenue ₹9,840" },
];

/* ─── Safety monitor ───────────────────────────────────────────────── */

export const safety: SafetyStatus = {
  level: "healthy",
  reachTrendPct: 12,
  shadowbanSignal: false,
  lastChecked: ago(18 * MIN),
  notes: [
    "Reply-reach ratio normal (0.9–1.1 band) for 14 days",
    "No ToS-risk flags in last 40 drafts",
    "1 draft auto-held below safety floor this week",
  ],
};
