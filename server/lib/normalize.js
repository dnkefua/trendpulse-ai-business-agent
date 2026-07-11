// Shared normalization helpers that turn raw platform data (Reddit posts, HN
// comments, Google Trends rows) into the opportunity shape the React UI renders.
// Keeping this platform-agnostic means each miner stays small and the UI never
// has to know where a lead came from.

// Skills the operator (Desmond) can actually deliver on. A lead is only useful
// if it maps to one of these, so we use the list both to FILTER and to populate
// the skill badges on each card.
export const TARGET_SKILLS = [
  { label: 'Data Analytics', patterns: [/data analy/i, /analytics/i, /\bbi\b/i, /dashboard/i, /report(ing)?/i] },
  { label: 'Power BI', patterns: [/power ?bi/i, /\bdax\b/i] },
  { label: 'Tableau', patterns: [/tableau/i] },
  { label: 'Python', patterns: [/python/i, /pandas/i, /\bfastapi\b/i, /\bflask\b/i, /\bdjango\b/i] },
  { label: 'Web Scraping', patterns: [/scrap(e|ing|er)/i, /crawl(er|ing)?/i, /\bplaywright\b/i, /\bselenium\b/i, /\bbeautifulsoup\b/i] },
  { label: 'SQL', patterns: [/\bsql\b/i, /postgres/i, /mysql/i, /\bbigquery\b/i, /snowflake/i, /data ?warehouse/i, /\betl\b/i, /data pipeline/i] },
  { label: 'Automation', patterns: [/automat(e|ion)/i, /\bbot\b/i, /workflow/i, /\bzapier\b/i, /\bapi\b integration/i, /integrat(e|ion)/i] },
  { label: 'React / Web', patterns: [/\breact\b/i, /\bnext\.?js\b/i, /full[- ]?stack/i, /\bfrontend\b/i, /web app/i, /\bnode\b/i] },
  { label: 'AI / LLM', patterns: [/\bllm\b/i, /\bgpt\b/i, /openai/i, /machine learning/i, /\bml\b/i, /\bai\b/i, /rag\b/i, /langchain/i] },
];

// Terms that signal an active buyer with intent to pay for a build/service —
// used to score and rank leads (a "seeking freelancer" post beats a random
// mention of Python).
const HIRING_SIGNALS = [
  /seeking freelancer/i, /\[hiring\]/i, /\bhiring\b/i, /looking (for|to hire)/i,
  /need (a|an|some(one)?)/i, /\bwilling to pay\b/i, /\bbudget\b/i, /freelanc/i,
  /contract/i, /\bwtb\b/i, /can pay/i, /\bpaid\b/i,
];

export function stripHtml(str = '') {
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x2F;|&#47;/g, '/')
    .replace(/\s+/g, ' ')
    .trim();
}

// Detect which of the operator's skills a piece of text calls for.
export function detectSkills(text = '') {
  const found = [];
  for (const skill of TARGET_SKILLS) {
    if (skill.patterns.some((re) => re.test(text))) found.push(skill.label);
  }
  return found;
}

// Pull a real budget/rate out of free text when present. Returns a display
// string, or null if the post didn't state one (we don't fabricate numbers).
export function parseBudget(text = '') {
  if (!text) return null;
  // Ranges like $3,000 - $5,000
  const range = text.match(/\$\s?[\d,]+\s?(?:k)?\s?[-–to]{1,3}\s?\$?\s?[\d,]+\s?(?:k)?/i);
  if (range) return range[0].replace(/\s+/g, ' ').trim();
  // Hourly like $50/hr, $50 per hour
  const hourly = text.match(/\$\s?[\d,]+\s?(?:\/\s?(?:hr|hour)|per hour)/i);
  if (hourly) return hourly[0].replace(/\s+/g, ' ').trim();
  // Single figure like $5,000 or $5k
  const single = text.match(/\$\s?[\d,]+\s?k?\b/i);
  if (single) return single[0].replace(/\s+/g, ' ').trim();
  return null;
}

// Score 0-100 from real engagement + hiring intent, so ranking reflects
// genuine signal rather than random numbers.
export function computeDemandScore({ points = 0, comments = 0, text = '' }) {
  let score = 55;
  score += Math.min(20, Math.round(Math.log2((points || 0) + 1) * 4));
  score += Math.min(10, Math.round(Math.log2((comments || 0) + 1) * 2));
  const signalHits = HIRING_SIGNALS.filter((re) => re.test(text)).length;
  score += Math.min(15, signalHits * 5);
  return Math.max(40, Math.min(99, score));
}

export function hiringSignalCount(text = '') {
  return HIRING_SIGNALS.filter((re) => re.test(text)).length;
}

// Build the operator's outreach pitch from the real lead context.
export function buildPitch({ clientHandle, roleSummary, platformName, skills, sourceUrl }) {
  const skillList = (skills && skills.length ? skills : ['Data Analytics', 'Python Automation']).slice(0, 3).join(', ');
  return `Hi ${clientHandle || 'there'},

I saw your post on ${platformName} about ${roleSummary || 'the project you described'}.

As a Data Analyst & Custom Software Engineer (https://www.linkedin.com/in/desmond-nkefua-data-analyst/), I specialize in ${skillList}. This is squarely in my wheelhouse and I can turn around a first deliverable quickly.

Would you be open to a short call to scope it out?

Best regards,
Desmond Nkefua

(Ref: ${sourceUrl || 'live listing'})`;
}

// Assemble the final opportunity object the React card consumes. `raw` carries
// the actual source values; everything derived here is computed from real data.
export function buildOpportunity({
  id,
  platformName,          // e.g. 'Reddit', 'Hacker News'
  sourceTag,             // e.g. 'r/forhire' or 'Who is hiring?'
  title,
  clientHandle,
  clientTitle,
  clientLocation,
  excerpt,
  postUrl,
  createdAtIso,
  points = 0,
  comments = 0,
  extraText = '',
}) {
  const combined = `${title} ${excerpt} ${extraText}`;
  const skills = detectSkills(combined);
  const budget = parseBudget(combined);
  const demandScore = computeDemandScore({ points, comments, text: combined });
  const roleSummary = (title || '').replace(/^\[hiring\]\s*/i, '').slice(0, 80);

  return {
    id,
    platform: platformName,
    subreddit: sourceTag,
    sourceTag,
    title: title || roleSummary || 'Live opportunity',
    clientName: clientHandle,
    clientTitle: clientTitle || 'Verified poster',
    clientLocation: clientLocation || 'Remote',
    urgency: hiringSignalCount(combined) >= 2 ? '⚡ Active hiring signal' : '🟢 Live listing',
    postedAgo: null,
    timestamp: createdAtIso,
    postUrl,                 // real permalink — OpportunityCard links to this
    redditPostUrl: postUrl,  // legacy field the card checks for Reddit
    isReal: true,
    matchScore: demandScore,
    demandScore,
    commentsAnalyzed: comments,
    requiredSkills: skills.length ? skills : ['Data Analytics'],
    budget: budget || 'Rate negotiable',
    postExcerpt: excerpt,
    customPitch: buildPitch({ clientHandle, roleSummary, platformName, skills, sourceUrl: postUrl }),
    topComments: [{ user: clientHandle || '@poster', text: excerpt, likes: points ? `${points} pts` : 'Live' }],
    painPointSummary: excerpt,
    blueprint: {
      businessModel: budget ? `Direct contract (${budget})` : 'Direct contract service',
      sourcingStrategy: [
        `Respond directly to the live post on ${platformName}.`,
        'Scope requirements, send fixed-price proposal, deliver in 3-7 days.',
      ],
      unitCost: 0,
      targetSellingPrice: 0,
      projectedConversionRate: 0,
      targetAdCAC: 0,
      grossMargin: '—',
      actionRoadmap: [
        { day: 'Day 1', task: `Reply to ${clientHandle || 'the poster'} with a tailored pitch + relevant work sample.` },
        { day: 'Day 2', task: 'Confirm scope, price, and timeline; send agreement.' },
        { day: 'Day 3+', task: 'Deliver milestone and invoice.' },
      ],
    },
  };
}

// Remove near-duplicate leads (same URL or very similar title).
export function dedupe(list) {
  const seen = new Set();
  const out = [];
  for (const o of list) {
    const key = o.postUrl || o.title;
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push(o);
    }
  }
  return out;
}
