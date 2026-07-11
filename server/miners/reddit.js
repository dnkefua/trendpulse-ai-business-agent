// Reddit lead miner — uses Reddit's official OAuth API (application-only /
// "client_credentials" grant), which is the ToS-compliant way to read Reddit
// data server-side. Requires a free Reddit "script" app:
//   https://www.reddit.com/prefs/apps  -> create app -> type "script"
// Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in server/.env
//
// Without credentials this miner returns [] (the frontend then falls back to
// its seeded Reddit examples) rather than crashing.

import {
  stripHtml,
  detectSkills,
  buildOpportunity,
  dedupe,
} from '../lib/normalize.js';

const TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';
const OAUTH_BASE = 'https://oauth.reddit.com';
const USER_AGENT = process.env.REDDIT_USER_AGENT || 'web:trendpulse-lead-miner:v1.0 (by /u/trendpulse)';

// Subreddits where clients actively post paid work relevant to the operator.
const HIRING_SUBS = ['forhire', 'freelance_forhire', 'jobbit', 'DataAnalysis', 'dataengineering', 'analytics'];

let cachedToken = null;
let tokenExpiry = 0;

function hasCredentials() {
  return Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
}

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const basic = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Reddit token ${res.status}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

async function searchSub(sub, query, token, sinceUnix) {
  const url = `${OAUTH_BASE}/r/${sub}/search?q=${encodeURIComponent(query)}&restrict_sr=1&sort=new&limit=25&t=month&raw_json=1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw new Error(`Reddit search ${sub} ${res.status}`);
  const data = await res.json();
  return (data?.data?.children || [])
    .map((c) => c.data)
    .filter((p) => (p.created_utc || 0) >= sinceUnix);
}

/**
 * Mine real hiring leads from Reddit.
 * @param {object} opts
 * @param {string} [opts.keyword] focus keyword (defaults to the operator's stack)
 * @param {number} [opts.days=30]
 * @param {number} [opts.limit=24]
 * @returns {Promise<{leads: object[], configured: boolean}>}
 */
export async function mineReddit({ keyword = '', days = 30, limit = 24 } = {}) {
  if (!hasCredentials()) {
    return { leads: [], configured: false };
  }

  const token = await getToken();
  const sinceUnix = Math.floor(Date.now() / 1000 - days * 24 * 60 * 60);
  const query = keyword.trim() || 'python OR "data analyst" OR scraping OR "power bi" OR dashboard';

  const batches = await Promise.allSettled(
    HIRING_SUBS.map((sub) => searchSub(sub, query, token, sinceUnix))
  );

  const posts = [];
  for (const b of batches) {
    if (b.status === 'fulfilled') posts.push(...b.value);
  }

  const leads = [];
  for (const p of posts) {
    const body = stripHtml(p.selftext || '');
    const combined = `${p.title} ${body}`;
    const skills = detectSkills(combined);
    if (skills.length === 0) continue;
    // Prefer posts where the OP is offering work (title convention on r/forhire).
    const isHiring = /\[hiring\]/i.test(p.title) || /hiring|looking for|need (a|an|someone)/i.test(combined);
    if (!isHiring) continue;

    leads.push(
      buildOpportunity({
        id: `rd-${p.id}`,
        platformName: 'Reddit',
        sourceTag: `r/${p.subreddit}`,
        title: stripHtml(p.title),
        clientHandle: `u/${p.author}`,
        clientTitle: 'Reddit poster',
        clientLocation: 'Remote',
        excerpt: (body || stripHtml(p.title)).slice(0, 320),
        postUrl: `https://www.reddit.com${p.permalink}`,
        createdAtIso: new Date((p.created_utc || 0) * 1000).toISOString(),
        points: p.score || p.ups || 0,
        comments: p.num_comments || 0,
      })
    );
  }

  const unique = dedupe(leads);
  unique.sort((a, b) => (b.demandScore - a.demandScore) || (new Date(b.timestamp) - new Date(a.timestamp)));
  return { leads: unique.slice(0, limit), configured: true };
}
