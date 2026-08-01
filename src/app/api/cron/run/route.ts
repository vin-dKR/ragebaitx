import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/lib/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // allow long runs (seconds)

// The 24/7 heartbeat. Point a cron scheduler at:
//   GET /api/cron/run?key=$CRON_SECRET
// (Vercel Cron, GitHub Actions, cron-job.org, or a local `while true` loop.)
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided =
    req.nextUrl.searchParams.get("key") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const report = await runPipeline();
    return NextResponse.json({ ok: true, ...report });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
