// Remote Jobs miner — pulls REAL, current remote job/contract listings from two
// free, legitimate public APIs (no keys required):
//   - Remotive:  https://remotive.com/api/remote-jobs?search=...
//   - RemoteOK:  https://remoteok.com/api?tag=...
// These boards carry the same kind of listings that get cross-posted to
// LinkedIn, sourced ToS-compliantly. Results are filtered to the operator's
// deliverable skills and normalized to the app's opportunity shape.

import {
  stripHtml,
  detectSkills,
  buildOpportunity,
  dedupe,
} from '../lib/normalize.js';

const UA = 'trendpulse-lead-miner/1.0';

// One search per core service line; callers can add a custom keyword.
const REMOTIVE_QUERIES = ['data analyst', 'python', 'business intelligence', 'web scraping', 'automation'];
const REMOTEOK_TAGS = ['python', 'data', 'analytics'];

const MAX_AGE_DAYS = 45;

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${new URL(url).hostname} ${res.status}`);
  return res.json();
}

function formatSalary(min, max) {
  const fmt = (n) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return null;
}

async function mineRemotive(keyword) {
  const queries = keyword ? [keyword, ...REMOTIVE_QUERIES] : REMOTIVE_QUERIES;
  const batches = await Promise.allSettled(
    queries.map((q) =>
      getJson(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(q)}&limit=20`)
    )
  );
  const jobs = [];
  for (const b of batches) {
    if (b.status === 'fulfilled') jobs.push(...(b.value.jobs || []));
  }
  return jobs.map((j) => ({
    id: `rj-remotive-${j.id}`,
    title: j.title,
    company: j.company_name,
    url: j.url,
    location: j.candidate_required_location || 'Remote',
    jobType: j.job_type || '',
    salary: (j.salary || '').trim() || null,
    description: stripHtml(j.description || '').slice(0, 500),
    category: j.category || '',
    postedAt: j.publication_date ? new Date(j.publication_date) : null,
    board: 'Remotive',
  }));
}

async function mineRemoteOK(keyword) {
  const tags = keyword ? [keyword.replace(/\s+/g, '-'), ...REMOTEOK_TAGS] : REMOTEOK_TAGS;
  const batches = await Promise.allSettled(
    tags.map((t) => getJson(`https://remoteok.com/api?tag=${encodeURIComponent(t)}`))
  );
  const jobs = [];
  for (const b of batches) {
    if (b.status === 'fulfilled' && Array.isArray(b.value)) {
      // First array element is RemoteOK's legal notice, not a job.
      jobs.push(...b.value.filter((x) => x && x.position));
    }
  }
  return jobs.map((j) => ({
    id: `rj-remoteok-${j.id || j.slug}`,
    title: j.position,
    company: j.company || 'Company',
    url: j.url && j.url.startsWith('http') ? j.url : `https://remoteok.com/remote-jobs/${j.slug || ''}`,
    location: j.location || 'Remote',
    jobType: (j.tags || []).includes('contract') ? 'contract' : '',
    salary: formatSalary(j.salary_min, j.salary_max),
    description: stripHtml(j.description || '').slice(0, 500),
    category: (j.tags || []).slice(0, 4).join(', '),
    postedAt: j.date ? new Date(j.date) : null,
    board: 'RemoteOK',
  }));
}

/**
 * Mine real remote job/contract leads from free job-board APIs.
 * @param {object} opts
 * @param {string} [opts.keyword] optional keyword to focus the search
 * @param {number} [opts.limit=24] max leads returned
 */
export async function mineRemoteJobs({ keyword = '', limit = 24 } = {}) {
  const [remotive, remoteok] = await Promise.allSettled([
    mineRemotive(keyword.trim()),
    mineRemoteOK(keyword.trim()),
  ]);

  const raw = [];
  if (remotive.status === 'fulfilled') raw.push(...remotive.value);
  if (remoteok.status === 'fulfilled') raw.push(...remoteok.value);

  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  const leads = [];
  for (const j of raw) {
    if (j.postedAt && j.postedAt.getTime() < cutoff) continue;

    // Relevance gate: the skill must appear in the TITLE or category/tags —
    // matching on the full description lets any job that merely mentions
    // "reporting" through (office assistants, sales roles, etc.).
    const headline = `${j.title} ${j.category}`;
    if (detectSkills(headline).length === 0) continue;
    // Badge skills can still draw from the full text for richer context.
    const skills = detectSkills(`${headline} ${j.description}`);

    const opp = buildOpportunity({
      id: j.id,
      platformName: 'Remote Jobs',
      sourceTag: j.board,
      title: `${j.company} — ${j.title}`.slice(0, 110),
      clientHandle: j.company,
      clientTitle: j.jobType ? `Hiring (${j.jobType.replace('_', ' ')})` : 'Hiring company',
      clientLocation: j.location.slice(0, 60),
      excerpt: j.description.slice(0, 340) || j.title,
      postUrl: j.url,
      createdAtIso: (j.postedAt || new Date()).toISOString(),
      points: 0,
      comments: 0,
      extraText: 'hiring job listing',
    });

    // Job boards state salary explicitly more often than free text — prefer it.
    if (j.salary) opp.budget = j.salary;
    leads.push(opp);
  }

  const unique = dedupe(leads);
  unique.sort((a, b) => {
    // Listings with a stated salary rank first, then newest.
    const as = a.budget !== 'Rate negotiable' ? 1 : 0;
    const bs = b.budget !== 'Rate negotiable' ? 1 : 0;
    if (as !== bs) return bs - as;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  return unique.slice(0, limit);
}
