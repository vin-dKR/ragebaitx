# ragebaitx

An AI news assistant for **one** X account you own. It watches news accounts you
follow, detects which posts are gaining traction, uses Claude to filter for the
topics you care about and write your own **accurate** headline, reattaches the
source image/video (with a source-credit link), and either queues the post for
your approval or auto-posts it — your toggle.

> Scope: single account, human-in-the-loop by default, headlines stay factually
> faithful to the source. It is **not** built for multi-account/coordinated
> operation or for optimizing outrage/misinformation.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- Prisma + SQLite (local file, zero setup)
- `twitter-api-v2` for reading timelines, uploading media, posting
- `@anthropic-ai/sdk` (Claude) for scoring + headline writing

## How it works

```
monitored @accounts ──► fetch recent tweets (+ likes/reposts + media)
        │
        ▼  rank by engagement velocity, take top N
   Claude scorer ──► { viralityScore, safetyScore, faithful, heading, reasoning }
        │
        ├─ AUTO on  & scores pass ─► download media ─► re-upload ─► post + source link
        └─ otherwise ─────────────► approval queue (dashboard)
```

## Setup

1. **Install deps**
   ```bash
   npm install
   ```

2. **Configure env** — copy `.env.example` to `.env` and fill in:
   - `ANTHROPIC_API_KEY` — from https://console.anthropic.com
   - `X_APP_KEY` / `X_APP_SECRET` / `X_ACCESS_TOKEN` / `X_ACCESS_SECRET` — from your
     X app (Basic tier or higher; OAuth 1.0a user tokens are required for media
     upload + posting)
   - `CRON_SECRET` — any long random string

3. **Create the database**
   ```bash
   npm run db:push
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 → **Settings** to add your interest topics and the
   accounts to monitor, then hit **Run now** on the Queue page.

## 24/7 operation

The pipeline runs on demand via a protected endpoint:

```
GET /api/cron/run?key=YOUR_CRON_SECRET
```

Point any scheduler at it every 15–30 min:

- **Vercel Cron** (`vercel.json` → `crons`)
- **cron-job.org** / **GitHub Actions** hitting the deployed URL
- Locally: `watch -n 900 'curl "http://localhost:3000/api/cron/run?key=YOUR_CRON_SECRET"'`

## The auto/manual toggle

Settings → **Auto mode**:
- **OFF** — every candidate lands in the approval queue; you tap _Approve & post_.
- **ON** — a candidate auto-posts only when `viralityScore ≥ Min virality`
  **and** `safetyScore ≥ Min safety` **and** the AI marked the heading faithful.
  Everything else still goes to the queue.

`Min safety` is always enforced, even in auto mode.

## Cost note

Scoring calls Claude once per candidate tweet. `ANTHROPIC_MODEL` defaults to
`claude-opus-4-8` (best judgment). For high volume, set it to `claude-sonnet-5`
or `claude-haiku-4-5` in `.env`, and keep `Per-run limit` modest.

## Notes / limits

- X API **Basic tier (~$200/mo)** is required for reliable timeline reads.
- Reposting others' media is your editorial/legal call; the source is always
  linked in the post.
- SQLite is fine for one account. Swap `datasource` to Postgres in
  `prisma/schema.prisma` if you outgrow it.
