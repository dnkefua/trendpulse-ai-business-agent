// Hacker News lead miner — uses the fully open Algolia HN Search API
// (https://hn.algolia.com/api). No key, no auth, ToS-compliant. This is the
// source that works out of the box and produces genuinely current, buyer-side
// leads by reading the two recurring monthly threads:
//   - "Ask HN: Who is hiring?"                  -> companies hiring (FT/contract)
//   - "Ask HN: Freelancer? Seeking freelancer?" -> clients seeking freelancers
//
// Strategy: locate the LATEST of each thread, pull its top-level comments (each
// top-level comment is one poster's listing), keep only buyer-side posts that
// match a skill the operator can deliver, and normalize. We deliberately skip
// "Who wants to be hired" and "SEEKING WORK" posts (candidates advertising
// themselves — the wrong side of the market).

import {
  stripHtml,
  detectSkills,
  buildOpportunity,
  dedupe,
} from '../lib/normalize.js';

const SEARCH = 'https://hn.algolia.com/api/v1/search';
const SEARCH_BY_DATE = 'https://hn.algolia.com/api/v1/search_by_date';

// "SEEKING WORK" and résumé markers = candidate side; drop them.
const CANDIDATE_MARKERS = [
  /seeking\s+work/i,
  /willing to relocate/i,
  /r[ée]sum[ée]\s*\/?\s*cv\s*:/i,
];

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'trendpulse-lead-miner/1.0' } });
  if (!res.ok) throw new Error(`HN Algolia ${res.status}`);
  return res.json();
}

// Find the most recent story matching `titleRe`. The "Who is hiring" / "Who
// wants to be hired" threads are posted by the `whoishiring` bot; the freelancer
// thread is posted by assorted accounts, so we fall back to a plain date search.
async function findLatestThread(query, titleRe, byBot) {
  const url = byBot
    ? `${SEARCH_BY_DATE}?tags=story,author_whoishiring&hitsPerPage=15`
    : `${SEARCH_BY_DATE}?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=25`;
  const j = await getJson(url);
  const candidates = (j.hits || [])
    .filter((h) => titleRe.test(h.title || ''))
    .sort((a, b) => b.created_at_i - a.created_at_i);
  return candidates[0] || null;
}

// Fetch top-level comments (direct children) of a thread story.
async function fetchThreadComments(storyId, limit = 100) {
  const j = await getJson(`${SEARCH_BY_DATE}?tags=comment,story_${storyId}&hitsPerPage=${limit}`);
  return (j.hits || []).filter((c) => String(c.parent_id) === String(storyId));
}

function commentToLead(c, { sourceTag, clientTitle, storyTitle }) {
  const text = stripHtml(c.comment_text || '');
  if (text.length < 40) return null;
  if (CANDIDATE_MARKERS.some((re) => re.test(text))) return null;

  const skills = detectSkills(text);
  if (skills.length === 0) return null; // must map to a deliverable skill

  // "Who is hiring" posts follow "Company | Role | Location | ...". Use the
  // first two pipe segments as the headline; otherwise fall back to the first
  // ~80 chars so the card always shows real content, never a generic label.
  const segs = text.split('|').map((s) => s.trim()).filter(Boolean);
  let title = segs.length >= 2 ? `${segs[0]} — ${segs[1]}` : (segs[0] || text);
  title = title.replace(/\s+/g, ' ').trim().slice(0, 110);
  if (title.length < 6) title = `${skills[0]} opportunity`;

  return buildOpportunity({
    id: `hn-${c.objectID}`,
    platformName: 'Hacker News',
    sourceTag,
    title,
    clientHandle: c.author ? `@${c.author}` : '@hn_user',
    clientTitle,
    clientLocation: extractLocation(text),
    excerpt: text.slice(0, 340),
    postUrl: `https://news.ycombinator.com/item?id=${c.objectID}`,
    createdAtIso: new Date((c.created_at_i || 0) * 1000).toISOString(),
    points: c.points || 0,
    comments: 0,
    extraText: storyTitle,
  });
}

/**
 * Mine real freelance/hiring leads from Hacker News.
 * @param {object} opts
 * @param {string} [opts.keyword] optional keyword to further filter results
 * @param {number} [opts.limit=24] max leads returned
 */
export async function mineHackerNews({ keyword = '', limit = 24 } = {}) {
  const [hiringStory, freelanceStory] = await Promise.all([
    findLatestThread('Ask HN Who is hiring', /who is hiring/i, true),
    findLatestThread('Freelancer Seeking freelancer', /seeking freelancer/i, false),
  ]);

  const threadJobs = [];
  if (hiringStory) {
    threadJobs.push(
      fetchThreadComments(hiringStory.objectID).then((cs) =>
        cs
          .map((c) =>
            commentToLead(c, {
              sourceTag: 'HN · Who is Hiring',
              clientTitle: 'Hiring company',
              storyTitle: hiringStory.title,
            })
          )
          .filter(Boolean)
      )
    );
  }
  if (freelanceStory) {
    threadJobs.push(
      fetchThreadComments(freelanceStory.objectID).then((cs) =>
        cs
          // On the freelancer thread, buyers write "SEEKING FREELANCER".
          .filter((c) => /seeking freelancer/i.test(stripHtml(c.comment_text || '')))
          .map((c) =>
            commentToLead(c, {
              sourceTag: 'HN · Seeking Freelancer',
              clientTitle: 'Client seeking freelancer',
              storyTitle: freelanceStory.title,
            })
          )
          .filter(Boolean)
      )
    );
  }

  const settled = await Promise.allSettled(threadJobs);
  let leads = [];
  for (const s of settled) if (s.status === 'fulfilled') leads.push(...s.value);

  // Optional user keyword narrows the result set.
  if (keyword.trim()) {
    const q = keyword.trim().toLowerCase();
    leads = leads.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.postExcerpt || '').toLowerCase().includes(q) ||
        (l.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
    );
  }

  const unique = dedupe(leads);
  // Rank client-seeking-freelancer posts above generic job listings, then by score.
  unique.sort((a, b) => {
    const af = a.sourceTag.includes('Freelancer') ? 1 : 0;
    const bf = b.sourceTag.includes('Freelancer') ? 1 : 0;
    if (af !== bf) return bf - af;
    return (b.demandScore - a.demandScore) || (new Date(b.timestamp) - new Date(a.timestamp));
  });
  return unique.slice(0, limit);
}

// Best-effort location pull from the common "Location: X" convention.
function extractLocation(text) {
  const m = text.match(/location[:\s]+([A-Za-z .,/-]{2,40})/i);
  if (m) return m[1].trim().replace(/\s*(remote|willing).*$/i, '').trim() || 'Remote';
  if (/\bremote\b/i.test(text)) return 'Remote';
  return 'Remote / Global';
}
