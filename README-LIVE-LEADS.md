# TrendPulse — Live Lead Generator

This app now generates **real, current leads** from legitimate, ToS-compliant
sources via a small backend API, instead of only showing seeded example data.

## What's real vs. sample

| Tab / feature | Source | Status |
|---|---|---|
| **HN Freelance** | Hacker News "Who is hiring?" + "Seeking freelancer?" threads (Algolia API) | ✅ Real, **no API key needed** |
| **Remote Jobs** | Remotive + RemoteOK job-board APIs (LinkedIn-equivalent listings) | ✅ Real, **no API key needed** |
| **Reddit Hiring** | Reddit official OAuth API (`r/forhire`, `r/dataengineering`, …) | ✅ Real, **needs free Reddit app creds** |
| **Google Trends** | Google Trends interest-over-time | ✅ Real on residential IPs; falls back to sample if rate-limited |
| TikTok / Facebook / Twitter | Seeded example data | ⚠️ Sample only (no free, ToS-compliant public API) |

Every real lead carries the actual post URL, author, posted date, budget (when
stated in the post), detected skills, and a demand score computed from real
engagement + hiring signals. Cards mined live show a green **“LIVE · Real
listing”** badge. If the backend is offline, each tab quietly falls back to its
seeded examples so the UI never breaks.

## Architecture

```
React app (Vite, :3000)
   │  fetch('/api/leads?source=…')     ← Vite proxies /api → :8787
   ▼
Express lead API (server/, :8787)      ← API keys live here, never in the browser
   ├─ server/miners/hackernews.js      (open Algolia API, no key)
   ├─ server/miners/reddit.js          (OAuth client_credentials)
   ├─ server/miners/googleTrends.js    (google-trends-api)
   └─ server/lib/normalize.js          (skill detection, budget parse, scoring)
```

## Run it

```bash
# 1. install (already done if node_modules exists)
npm install

# 2a. run web + lead API together
npm run dev:all

# 2b. …or run them in two terminals
npm run server   # lead API on :8787
npm run dev      # web app on :3000
```

Open http://localhost:3000 and click **HN Freelance** — real leads load with no
further setup.

## Enable real Reddit leads (free, ~2 min)

1. Go to https://www.reddit.com/prefs/apps → **create app** → type **script**.
2. Copy `server/.env.example` to `server/.env` and fill in:
   ```
   REDDIT_CLIENT_ID=your_client_id
   REDDIT_CLIENT_SECRET=your_secret
   REDDIT_USER_AGENT=web:trendpulse-lead-miner:v1.0 (by /u/your_username)
   ```
3. Restart `npm run server`. The **Reddit Hiring** tab now shows live posts.

`server/.env` is gitignored — never commit real keys.

## Endpoints (for debugging)

```bash
curl http://localhost:8787/api/health
curl "http://localhost:8787/api/leads?source=hackernews"
curl "http://localhost:8787/api/leads?source=reddit&keyword=python"
curl "http://localhost:8787/api/leads?source=googletrends"
```

## Notes on the other platforms

TikTok, LinkedIn, Facebook, and Twitter/X do **not** offer a free,
ToS-compliant public API for the kind of pain-point/hiring mining this app does.
Scraping them from the browser is blocked by CORS and violates their terms.
Those tabs remain seeded examples. To make them real you'd add a paid,
ToS-compliant path (e.g. Apify actors for TikTok, the X API v2 paid tier) as new
miners under `server/miners/` following the same pattern — the frontend already
consumes whatever the API returns.

## Deploying for real (beyond local)

The current build is Firebase Hosting (static) + a local Express API. To run the
lead API in production, deploy `server/` as a Cloud Function / Cloud Run service
(or Render/Railway), set the same env vars there, and point the frontend's `/api`
at it. The miners are plain modules with no local-only dependencies, so they port
directly.
