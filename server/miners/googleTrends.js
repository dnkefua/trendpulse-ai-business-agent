// Google Trends miner — pulls REAL "interest over time" for the operator's
// core service keywords via the google-trends-api package, and shapes each into
// the object the GoogleTrendsWidget renders (keyword, growth, sparkline,
// monthlyHistory, etc.).
//
// Note: Google's trends endpoint rate-limits datacenter IPs aggressively
// (HTTP 429). From a normal residential IP or a deployed function it works
// fine. On any failure this miner returns { data: [], live: false } and the
// frontend falls back to its seeded GOOGLE_TRENDS_DATA so the tab never breaks.

import googleTrends from 'google-trends-api';
import { detectSkills } from '../lib/normalize.js';

// The service niches the operator sells into. Each becomes a real Trends query.
const CORE_KEYWORDS = [
  { keyword: 'AI workflow automation', category: 'IT / Custom Software' },
  { keyword: 'web scraping service', category: 'Data Extraction' },
  { keyword: 'power bi dashboard', category: 'Data Analytics' },
  { keyword: 'python automation', category: 'Automation' },
  { keyword: 'data pipeline', category: 'Data Engineering' },
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

async function interestOverTime(keyword) {
  const startTime = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const raw = await googleTrends.interestOverTime({ keyword, startTime, geo: 'US' });
  const parsed = JSON.parse(raw);
  const timeline = parsed?.default?.timelineData || [];
  if (!timeline.length) throw new Error('no timeline');
  // Reduce ~52 weekly points to 12 monthly buckets for the widget.
  const points = timeline.map((t) => ({
    date: new Date(Number(t.time) * 1000),
    value: Array.isArray(t.value) ? t.value[0] : 0,
  }));
  const byMonth = new Map();
  for (const p of points) {
    const key = `${p.date.getFullYear()}-${p.date.getMonth()}`;
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key).push(p.value);
  }
  const monthly = Array.from(byMonth.entries())
    .slice(-12)
    .map(([key, vals]) => {
      const monthIdx = Number(key.split('-')[1]);
      const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      return { month: MONTH_LABELS[monthIdx], interest: avg };
    });
  return monthly;
}

function growthLabel(monthly) {
  if (monthly.length < 2) return 'Trending';
  const first = monthly[0].interest || 1;
  const last = monthly[monthly.length - 1].interest || 0;
  const pct = Math.round(((last - first) / Math.max(first, 1)) * 100);
  return `${pct >= 0 ? '+' : ''}${pct}% YOY`;
}

/**
 * Mine real Google Trends interest for the operator's service keywords.
 * @returns {Promise<{data: object[], live: boolean}>}
 */
export async function mineGoogleTrends({ keyword = '' } = {}) {
  const targets = keyword.trim()
    ? [{ keyword: keyword.trim(), category: 'Custom Search' }, ...CORE_KEYWORDS]
    : CORE_KEYWORDS;

  const results = await Promise.allSettled(
    targets.map(async (t, idx) => {
      const monthly = await interestOverTime(t.keyword);
      const sparkline = monthly.map((m) => m.interest);
      const peak = Math.max(...sparkline, 1);
      const currentInterest = sparkline[sparkline.length - 1] || 0;
      return {
        id: `gt-live-${idx}`,
        keyword: t.keyword.replace(/\b\w/g, (c) => c.toUpperCase()),
        growth: growthLabel(monthly),
        category: t.category,
        searchVolume: `Interest index ${currentInterest}/100 (peak ${peak})`,
        description: `Live Google Trends interest over the last 12 months for "${t.keyword}" in the US. Rising demand indicates active buyers searching for this solution.`,
        skills: detectSkills(t.keyword).length ? detectSkills(t.keyword) : ['Python', 'Data Analytics'],
        sparkline,
        monthlyHistory: monthly,
        isReal: true,
        nicheIdeas: [
          {
            title: `${t.keyword} productized service`,
            desc: `Package a fixed-scope ${t.keyword} offer for businesses searching this term right now.`,
            estVal: '$3,500 - $7,500 Contract',
          },
        ],
        recommendedLeads: [], // real trends data carries no client posts; kept empty rather than fabricated
      };
    })
  );

  const data = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
  return { data, live: data.length > 0 };
}
