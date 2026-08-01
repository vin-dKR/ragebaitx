import Anthropic from "@anthropic-ai/sdk";
import type { CandidateTweet } from "./x-client";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

let _client: Anthropic | null = null;
function anthropic(): Anthropic {
  if (!_client) _client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
  return _client;
}

export type ScoreResult = {
  viralityScore: number; // 0-100 likelihood this ranks / gets engagement
  safetyScore: number; // 0-100 brand safety (100 = safe, low = risky/offensive/illegal)
  faithful: boolean; // does the heading stay factually true to the source?
  heading: string; // the punchy headline to post, in the user's voice
  reasoning: string; // one-line why
};

// Structured output via a forced tool call — supported across all SDK versions.
const SUBMIT_TOOL: Anthropic.Tool = {
  name: "submit_judgement",
  description: "Record the editorial judgement for the source tweet.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      viralityScore: {
        type: "integer",
        description: "0-100 likelihood of strong engagement given the operator's interests",
      },
      safetyScore: {
        type: "integer",
        description: "0-100 brand safety; 100 = clearly safe, low = risky/offensive/would get suspended",
      },
      faithful: {
        type: "boolean",
        description: "true only if the heading makes no claim the source does not support",
      },
      heading: { type: "string", description: "the headline to post, no hashtags, no source link" },
      reasoning: { type: "string", description: "one short sentence explaining the scores" },
    },
    required: ["viralityScore", "safetyScore", "faithful", "heading", "reasoning"],
  },
};

const SYSTEM = `You are an editorial assistant for a single news account on X (Twitter).
Your job: judge whether a source tweet is worth reposting, and if so write a
scroll-stopping but FACTUALLY FAITHFUL headline in the operator's voice.

Rules for the heading you write:
- It must stay true to the source tweet. Do NOT invent facts, numbers, quotes, or
  outcomes that are not in the source. No fabricated outrage.
- Make it punchy and curiosity-driving, but not misleading clickbait.
- No hashtags. Keep it under ~200 characters. Do not add a source link (added later).

Scoring:
- viralityScore (0-100): how likely this is to get strong engagement, given the
  operator's interest topics and how novel/timely/emotionally resonant it is.
- safetyScore (0-100): 100 = clearly safe to post; lower it for hate, harassment,
  graphic violence, explicit content, unverified defamation, medical/financial
  misinformation, or content that would get the account suspended.
- faithful: true only if your heading makes no claim the source doesn't support.

Always answer by calling the submit_judgement tool.`;

export async function scoreTweet(
  tweet: CandidateTweet,
  interests: string[],
): Promise<ScoreResult> {
  const user = [
    `Operator interest topics: ${interests.length ? interests.join(", ") : "(none specified — judge general newsworthiness)"}`,
    "",
    `Source account: @${tweet.handle}`,
    `Engagement so far: ${tweet.likes} likes, ${tweet.reposts} reposts, ${tweet.replies} replies`,
    `Has media: ${tweet.mediaType ?? "no"}`,
    "",
    "Source tweet text:",
    `"""${tweet.text}"""`,
  ].join("\n");

  const res = await anthropic().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM,
    tools: [SUBMIT_TOOL],
    tool_choice: { type: "tool", name: SUBMIT_TOOL.name },
    messages: [{ role: "user", content: user }],
  });

  const toolUse = res.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Scorer did not return a tool call");
  }
  const parsed = toolUse.input as Partial<ScoreResult>;

  return {
    viralityScore: clamp(Number(parsed.viralityScore)),
    safetyScore: clamp(Number(parsed.safetyScore)),
    faithful: Boolean(parsed.faithful),
    heading: String(parsed.heading ?? "").slice(0, 260),
    reasoning: String(parsed.reasoning ?? ""),
  };
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}
