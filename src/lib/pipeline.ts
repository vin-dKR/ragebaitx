import { prisma } from "./db";
import { getSettings } from "./settings";
import {
  fetchRecentTweets,
  resolveUserId,
  postTweet,
  sourceLink,
  type CandidateTweet,
} from "./x-client";
import { scoreTweet } from "./scorer";

export type RunReport = {
  sourcesChecked: number;
  fetched: number;
  scored: number;
  queued: number;
  autoPosted: number;
  errors: string[];
};

// One tick of the 24/7 loop: pull recent tweets from every monitored account,
// score the freshest/highest-velocity ones with Claude, then queue or auto-post.
export async function runPipeline(): Promise<RunReport> {
  const settings = await getSettings();
  const report: RunReport = {
    sourcesChecked: 0,
    fetched: 0,
    scored: 0,
    queued: 0,
    autoPosted: 0,
    errors: [],
  };

  const sources = await prisma.source.findMany({ where: { active: true } });

  // 1. Gather candidates across all sources.
  const candidates: CandidateTweet[] = [];
  for (const source of sources) {
    report.sourcesChecked++;
    try {
      let xUserId = source.xUserId;
      if (!xUserId) {
        xUserId = await resolveUserId(source.handle);
        await prisma.source.update({ where: { id: source.id }, data: { xUserId } });
      }
      const tweets = await fetchRecentTweets(xUserId, source.handle, 20);
      candidates.push(...tweets.filter((t) => !t.isRetweet && !t.isReply));
    } catch (e) {
      report.errors.push(`@${source.handle}: ${errMsg(e)}`);
    }
  }
  report.fetched = candidates.length;

  // 2. Skip anything we've already seen, then rank by engagement velocity so we
  //    spend Claude calls on the most promising posts first.
  const seen = new Set(
    (
      await prisma.draft.findMany({
        where: { sourceTweetId: { in: candidates.map((c) => c.id) } },
        select: { sourceTweetId: true },
      })
    ).map((d) => d.sourceTweetId),
  );

  const fresh = candidates
    .filter((c) => !seen.has(c.id))
    .map((c) => ({ c, velocity: velocityPerHour(c) }))
    .sort((a, b) => b.velocity - a.velocity)
    .slice(0, settings.perRunLimit);

  // 3. Score, store, and (optionally) auto-post.
  for (const { c, velocity } of fresh) {
    try {
      const score = await scoreTweet(c, settings.interests);
      report.scored++;

      const passesSafety = score.safetyScore >= settings.minSafety && score.faithful;
      const shouldAutoPost =
        settings.autoMode && passesSafety && score.viralityScore >= settings.minVirality;

      const draft = await prisma.draft.create({
        data: {
          sourceTweetId: c.id,
          sourceHandle: c.handle,
          sourceText: c.text,
          heading: score.heading,
          mediaType: c.mediaType,
          mediaUrl: c.mediaUrl,
          thumbUrl: c.thumbUrl,
          viralityScore: score.viralityScore,
          safetyScore: score.safetyScore,
          faithful: score.faithful,
          reasoning: score.reasoning,
          velocity,
          status: "pending",
        },
      });
      report.queued++;

      if (shouldAutoPost) {
        await publishDraft(draft.id);
        report.autoPosted++;
      }
    } catch (e) {
      report.errors.push(`score ${c.id}: ${errMsg(e)}`);
    }
  }

  return report;
}

// Publish a single draft (used by auto-post and by the manual "approve" action).
export async function publishDraft(draftId: string): Promise<string> {
  const draft = await prisma.draft.findUniqueOrThrow({ where: { id: draftId } });
  const text = `${draft.heading}\n\n${sourceLink(draft.sourceHandle, draft.sourceTweetId, draft.mediaType as CandidateTweet["mediaType"])}`;

  try {
    const postedId = await postTweet({
      text,
      mediaUrl: draft.mediaUrl,
      mediaType: draft.mediaType as CandidateTweet["mediaType"],
    });
    await prisma.draft.update({
      where: { id: draftId },
      data: { status: "posted", postedTweetId: postedId, error: null },
    });
    return postedId;
  } catch (e) {
    await prisma.draft.update({
      where: { id: draftId },
      data: { status: "failed", error: errMsg(e) },
    });
    throw e;
  }
}

function velocityPerHour(c: CandidateTweet): number {
  const ageHours = Math.max((Date.now() - c.createdAt.getTime()) / 3_600_000, 0.1);
  return (c.likes + c.reposts) / ageHours;
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
