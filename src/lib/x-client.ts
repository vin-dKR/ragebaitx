import { TwitterApi, type TweetV2, type MediaObjectV2 } from "twitter-api-v2";

// OAuth 1.0a user context — required for BOTH reading timelines and, crucially,
// uploading media + posting tweets. A bearer token alone cannot upload media.
function makeClient(): TwitterApi {
  const { X_APP_KEY, X_APP_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } = process.env;
  if (!X_APP_KEY || !X_APP_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    throw new Error(
      "Missing X API credentials. Set X_APP_KEY, X_APP_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET.",
    );
  }
  return new TwitterApi({
    appKey: X_APP_KEY,
    appSecret: X_APP_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_SECRET,
  });
}

let _client: TwitterApi | null = null;
function client(): TwitterApi {
  if (!_client) _client = makeClient();
  return _client;
}

export type CandidateTweet = {
  id: string;
  text: string;
  handle: string;
  createdAt: Date;
  likes: number;
  reposts: number;
  replies: number;
  isRetweet: boolean;
  isReply: boolean;
  mediaType: "photo" | "video" | "gif" | null;
  mediaUrl: string | null; // best downloadable URL (mp4 for video, image for photo)
  thumbUrl: string | null; // preview image
};

// Resolve a @handle to its numeric user id (cache the result in the DB via caller).
export async function resolveUserId(handle: string): Promise<string> {
  const user = await client().v2.userByUsername(handle.replace(/^@/, ""));
  if (!user.data) throw new Error(`X user not found: @${handle}`);
  return user.data.id;
}

// Fetch recent original tweets from a monitored account, with engagement + media.
export async function fetchRecentTweets(
  userId: string,
  handle: string,
  max = 20,
): Promise<CandidateTweet[]> {
  const res = await client().v2.userTimeline(userId, {
    max_results: Math.min(Math.max(max, 5), 100),
    exclude: ["retweets", "replies"],
    "tweet.fields": ["created_at", "public_metrics", "referenced_tweets"],
    expansions: ["attachments.media_keys"],
    "media.fields": ["type", "url", "preview_image_url", "variants"],
  });

  const mediaByKey = new Map<string, MediaObjectV2>();
  for (const m of res.includes?.media ?? []) {
    if (m.media_key) mediaByKey.set(m.media_key, m);
  }

  const out: CandidateTweet[] = [];
  for (const t of res.data.data ?? []) {
    out.push(toCandidate(t, handle, mediaByKey));
  }
  return out;
}

function toCandidate(
  t: TweetV2,
  handle: string,
  mediaByKey: Map<string, MediaObjectV2>,
): CandidateTweet {
  const metrics = t.public_metrics;
  const refTypes = (t.referenced_tweets ?? []).map((r) => r.type);
  const media = (t.attachments?.media_keys ?? [])
    .map((k) => mediaByKey.get(k))
    .filter(Boolean) as MediaObjectV2[];

  const { mediaType, mediaUrl, thumbUrl } = pickMedia(media);

  return {
    id: t.id,
    text: t.text,
    handle,
    createdAt: t.created_at ? new Date(t.created_at) : new Date(),
    likes: metrics?.like_count ?? 0,
    reposts: metrics?.retweet_count ?? 0,
    replies: metrics?.reply_count ?? 0,
    isRetweet: refTypes.includes("retweeted"),
    isReply: refTypes.includes("replied_to"),
    mediaType,
    mediaUrl,
    thumbUrl,
  };
}

// Choose the single best media asset from a tweet. For video/gif we pick the
// highest-bitrate mp4 variant so it can be re-uploaded.
function pickMedia(media: MediaObjectV2[]): {
  mediaType: CandidateTweet["mediaType"];
  mediaUrl: string | null;
  thumbUrl: string | null;
} {
  if (media.length === 0) return { mediaType: null, mediaUrl: null, thumbUrl: null };
  const first = media[0];

  if (first.type === "photo") {
    return { mediaType: "photo", mediaUrl: first.url ?? null, thumbUrl: first.url ?? null };
  }

  if (first.type === "video" || first.type === "animated_gif") {
    const mp4s = (first.variants ?? [])
      .filter((v) => v.content_type === "video/mp4" && v.url)
      .sort((a, b) => (b.bit_rate ?? 0) - (a.bit_rate ?? 0));
    return {
      mediaType: first.type === "video" ? "video" : "gif",
      mediaUrl: mp4s[0]?.url ?? null,
      thumbUrl: first.preview_image_url ?? null,
    };
  }

  return { mediaType: null, mediaUrl: null, thumbUrl: null };
}

// Download media bytes so we can re-upload them under our own account.
async function downloadMedia(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Media download failed (${res.status}) for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const MIME: Record<string, string> = {
  photo: "image/jpeg",
  video: "video/mp4",
  gif: "video/mp4",
};

export type PostInput = {
  text: string;
  mediaUrl?: string | null;
  mediaType?: CandidateTweet["mediaType"];
};

// Publish a tweet, re-uploading the source media if present. Returns the new tweet id.
export async function postTweet(input: PostInput): Promise<string> {
  let mediaId: string | undefined;
  if (input.mediaUrl && input.mediaType) {
    const buf = await downloadMedia(input.mediaUrl);
    mediaId = await client().v1.uploadMedia(buf, {
      mimeType: MIME[input.mediaType] ?? "application/octet-stream",
    });
  }
  const res = await client().v2.tweet(
    input.text,
    mediaId ? { media: { media_ids: [mediaId] } } : undefined,
  );
  return res.data.id;
}

// Build the source-credit line the user wants appended, e.g. the /video/1 path.
export function sourceLink(handle: string, tweetId: string, mediaType: CandidateTweet["mediaType"]): string {
  const base = `https://x.com/${handle.replace(/^@/, "")}/status/${tweetId}`;
  return mediaType === "video" || mediaType === "gif" ? `${base}/video/1` : base;
}
