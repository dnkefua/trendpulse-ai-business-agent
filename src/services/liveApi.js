// Thin client for the local live-lead API (server/index.js), reached through the
// Vite dev proxy at /api. Every call is defensive: on any failure it resolves to
// an empty/blank result so the caller can fall back to seeded example data and
// the UI never breaks.

const BASE = '/api';

// Short timeout so a missing backend doesn't hang the UI.
async function getJson(path, { timeoutMs = 12000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

// Is the backend up? Used to show a live/offline indicator.
export async function checkLiveApi() {
  try {
    const h = await getJson('/health', { timeoutMs: 4000 });
    return { online: true, sources: h.sources };
  } catch {
    return { online: false, sources: null };
  }
}

// Fetch real card-style leads for a source ('hackernews' | 'reddit').
// Returns { leads: [], live: bool, reason?: string }.
export async function fetchLiveLeads(source, keyword = '') {
  try {
    const q = keyword ? `&keyword=${encodeURIComponent(keyword)}` : '';
    const data = await getJson(`/leads?source=${source}${q}`);
    return {
      leads: Array.isArray(data.leads) ? data.leads : [],
      live: Boolean(data.live),
      reason: data.reason || data.error,
    };
  } catch (e) {
    return { leads: [], live: false, reason: e.message };
  }
}

// Fetch real Google Trends rows for the trends widget.
// Returns { data: [], live: bool }.
export async function fetchLiveTrends(keyword = '') {
  try {
    const q = keyword ? `?source=googletrends&keyword=${encodeURIComponent(keyword)}` : '?source=googletrends';
    const data = await getJson(`/leads${q}`);
    return { data: Array.isArray(data.data) ? data.data : [], live: Boolean(data.live) };
  } catch (e) {
    return { data: [], live: false, reason: e.message };
  }
}
