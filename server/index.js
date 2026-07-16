// TrendPulse live lead API — a small Express backend that mines REAL leads from
// legitimate, ToS-compliant sources and serves them to the React app. Keys stay
// server-side (never shipped to the browser). Run with: npm run server
//
// Endpoints:
//   GET /api/health
//   GET /api/leads?source=hackernews|reddit|googletrends&keyword=...
//
// Design note: every source degrades gracefully. If a miner throws or is not
// configured, the endpoint returns an empty list with a reason, and the
// frontend falls back to its seeded example data so the UI is never broken.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { mineHackerNews } from './miners/hackernews.js';
import { mineReddit } from './miners/reddit.js';
import { mineGoogleTrends } from './miners/googleTrends.js';
import { mineRemoteJobs } from './miners/remoteJobs.js';

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    sources: {
      hackernews: 'ready (no key required)',
      remotejobs: 'ready (no key required)',
      reddit: process.env.REDDIT_CLIENT_ID ? 'configured' : 'needs REDDIT_CLIENT_ID/SECRET',
      googletrends: 'ready (may be rate-limited on datacenter IPs)',
    },
    time: new Date().toISOString(),
  });
});

app.get('/api/leads', async (req, res) => {
  const source = String(req.query.source || 'hackernews').toLowerCase();
  const keyword = String(req.query.keyword || '');

  try {
    if (source === 'hackernews' || source === 'hn') {
      const leads = await mineHackerNews({ keyword });
      return res.json({ source: 'hackernews', live: true, count: leads.length, leads });
    }

    if (source === 'remotejobs' || source === 'jobs') {
      const leads = await mineRemoteJobs({ keyword });
      return res.json({ source: 'remotejobs', live: true, count: leads.length, leads });
    }

    if (source === 'reddit') {
      const { leads, configured } = await mineReddit({ keyword });
      return res.json({
        source: 'reddit',
        live: configured,
        configured,
        reason: configured ? undefined : 'Reddit API credentials not set (REDDIT_CLIENT_ID/SECRET).',
        count: leads.length,
        leads,
      });
    }

    if (source === 'googletrends' || source === 'trends') {
      const { data, live } = await mineGoogleTrends({ keyword });
      return res.json({ source: 'googletrends', live, count: data.length, data });
    }

    return res.status(400).json({ error: `Unknown source "${source}"` });
  } catch (err) {
    // Never 500 the frontend into a broken state — report and let it fall back.
    console.error(`[${source}] mining failed:`, err.message);
    return res.json({ source, live: false, error: err.message, count: 0, leads: [], data: [] });
  }
});

app.listen(PORT, () => {
  console.log(`TrendPulse live lead API listening on http://localhost:${PORT}`);
  console.log(`  Reddit: ${process.env.REDDIT_CLIENT_ID ? 'configured' : 'NOT configured (set server/.env)'}`);
});
