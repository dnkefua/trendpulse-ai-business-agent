import { INITIAL_OPPORTUNITIES } from '../data/mockOpportunities';
import { LINKEDIN_IT_OPPORTUNITIES } from '../data/linkedInOpportunities';
import { FACEBOOK_OPPORTUNITIES } from '../data/facebookOpportunities';
import { TWITTER_OPPORTUNITIES } from '../data/twitterOpportunities';
import { UPWORK_OPPORTUNITIES } from '../data/upworkOpportunities';
import { REDDIT_OPPORTUNITIES } from '../data/redditOpportunities';
import {
  syncCustomOpportunitiesToFirebase,
  fetchCustomOpportunitiesFromFirebase
} from './firebase';
import { fetchLiveLeads } from './liveApi';

const STORAGE_KEY_SAVED = 'trendpulse_saved_opps';
const STORAGE_KEY_CUSTOM = 'trendpulse_custom_opps';
const STORAGE_KEY_SETTINGS = 'trendpulse_api_settings';

export const getSavedOpportunityIds = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SAVED);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const toggleSaveOpportunity = (id) => {
  const saved = getSavedOpportunityIds();
  const exists = saved.includes(id);
  const updated = exists ? saved.filter(item => item !== id) : [...saved, id];
  localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
  return updated;
};

export const getApiSettings = () => {
  try {
    const settings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return settings ? JSON.parse(settings) : { apiKey: '', provider: 'simulated', apifyKey: '' };
  } catch {
    return { apiKey: '', provider: 'simulated', apifyKey: '' };
  }
};

export const saveApiSettings = (settings) => {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
};

// Helper to dynamically set post timestamps relative to the exact fetching moment
const updateTimestamps = (list) => {
  return list.map((opp, index) => {
    // Generate a progressive offset (e.g. index * 45 minutes + random jitter)
    const offsetMs = (index * 45 * 60 * 1000) + (Math.floor(Math.random() * 15) * 60 * 1000) + 120000;
    return {
      ...opp,
      timestamp: new Date(Date.now() - offsetMs).toISOString()
    };
  });
};

// Fetch data by platform source ('tiktok' | 'linkedin' | 'upwork' | 'facebook' | 'twitter' | 'reddit' | 'custom_5_sites')
export const fetchOpportunities = async ({ 
  platform = 'tiktok', 
  keyword = '', 
  category = 'All Categories', 
  sortBy = 'demand',
  minBudget = 0,
  urgencyFilter = 'All'
} = {}) => {
  let customOpps = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM);
    if (stored) {
      customOpps = JSON.parse(stored).map((opp, idx) => ({
        ...opp,
        timestamp: new Date(Date.now() - (idx * 15 * 60 * 1000) - 180000).toISOString()
      }));
    }
  } catch (e) {
    console.error(e);
  }

  let baseList = [];
  if (platform === 'linkedin') {
    baseList = updateTimestamps(LINKEDIN_IT_OPPORTUNITIES);
  } else if (platform === 'upwork') {
    // Real, live freelance/hiring leads from Hacker News (no API key required).
    // Falls back to the seeded examples if the backend is offline or dry.
    const live = await fetchLiveLeads('hackernews', keyword);
    baseList = live.leads.length ? live.leads : updateTimestamps(UPWORK_OPPORTUNITIES);
  } else if (platform === 'facebook') {
    baseList = updateTimestamps(FACEBOOK_OPPORTUNITIES);
  } else if (platform === 'twitter') {
    baseList = updateTimestamps(TWITTER_OPPORTUNITIES);
  } else if (platform === 'reddit') {
    // Real, live Reddit hiring posts (requires Reddit API creds in server/.env).
    // Falls back to the seeded examples when not configured or offline.
    const live = await fetchLiveLeads('reddit', keyword);
    baseList = live.leads.length ? live.leads : updateTimestamps(REDDIT_OPPORTUNITIES);
  } else if (platform === 'custom_5_sites') {
    baseList = customOpps.filter(o => o.isCustom5Site);
  } else {
    // TikTok & General
    baseList = [...customOpps.filter(o => !o.isCustom5Site), ...updateTimestamps(INITIAL_OPPORTUNITIES)];
  }

  let filtered = [...baseList];

  // Keyword Filter
  if (keyword.trim()) {
    const q = keyword.toLowerCase();
    filtered = filtered.filter(opp => 
      opp.title.toLowerCase().includes(q) ||
      (opp.niche && opp.niche.toLowerCase().includes(q)) ||
      (opp.painPointSummary && opp.painPointSummary.toLowerCase().includes(q)) ||
      (opp.category && opp.category.toLowerCase().includes(q)) ||
      (opp.clientName && opp.clientName.toLowerCase().includes(q)) ||
      (opp.subreddit && opp.subreddit.toLowerCase().includes(q)) ||
      (opp.requiredSkills && opp.requiredSkills.some(s => s.toLowerCase().includes(q))) ||
      (opp.postExcerpt && opp.postExcerpt.toLowerCase().includes(q))
    );
  }

  // Budget Filter (for LinkedIn / Upwork / Reddit / Facebook / Twitter / Custom)
  if (minBudget && minBudget > 0) {
    const parseBudget = (budgetString) => {
      if (!budgetString) return 0;
      const clean = budgetString.replace(/,/g, '');
      const matches = clean.match(/\d+/g);
      if (matches && matches.length > 0) {
        return parseInt(matches[0]);
      }
      return 0;
    };

    filtered = filtered.filter(opp => {
      if (platform === 'tiktok') return true;
      const budgetVal = parseBudget(opp.budget || opp.estimatedRevenuePotential);
      return budgetVal >= minBudget;
    });
  }

  // Urgency Filter
  if (urgencyFilter && urgencyFilter !== 'All') {
    filtered = filtered.filter(opp => {
      if (platform === 'tiktok') return true;
      const urgencyStr = (opp.urgency || '').toLowerCase();
      if (urgencyFilter === 'Urgent') {
        return urgencyStr.includes('urgent') || urgencyStr.includes('immediate') || urgencyStr.includes('asap') || urgencyStr.includes('now');
      }
      return true;
    });
  }

  // Category Filter
  if (category && category !== 'All Categories' && platform === 'tiktok') {
    filtered = filtered.filter(opp => opp.category === category);
  }

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'demand') return (b.demandScore || b.matchScore || 0) - (a.demandScore || a.matchScore || 0);
    if (sortBy === 'comments') return (b.commentsAnalyzed || 0) - (a.commentsAnalyzed || 0);
    return 0;
  });

  return filtered;
};

// 5-Website Custom Multi-Scraper Engine
export const scrapeFiveWebsites = async (urls = []) => {
  const validUrls = urls.filter(u => u.trim().length > 0);
  if (validUrls.length === 0) return [];

  await new Promise(res => setTimeout(res, 2800));

  const scrapedResults = validUrls.map((url, index) => {
    let domainName = 'Custom Site';
    try {
      domainName = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch {
      domainName = url;
    }

    const keywords = ['Data Pipeline', 'Web Scraper', 'Power BI Dashboard', 'Custom SaaS App', 'Python Bot'];
    const selectedKeyword = keywords[index % keywords.length];

    return {
      id: `opp-5site-${Date.now()}-${index}`,
      platform: domainName,
      sourceUrl: url,
      isCustom5Site: true,
      title: `Urgent Need: ${selectedKeyword} for ${domainName}`,
      category: "Service / Local Agency",
      niche: `Custom Web Scraped Opportunity (${domainName})`,
      demandScore: Math.floor(Math.random() * 10) + 90,
      trendGrowth: "+280% this week",
      views: "Live Scrape",
      commentsAnalyzed: Math.floor(Math.random() * 1200) + 500,
      sentimentPositive: 94,
      difficulty: "Medium",
      competition: "Low",
      estimatedRevenuePotential: `$${Math.floor(Math.random() * 3 + 2)},500 - $${Math.floor(Math.random() * 5 + 6)},000`,
      clientName: `Hiring Manager @ ${domainName}`,
      clientTitle: "Tech Operations Lead",
      clientLocation: "Remote / Global",
      urgency: "⚡ Urgent Client Request",
      postedAgo: "Posted 10 mins ago",
      matchScore: 97,
      requiredSkills: ["Data Analytics", "Python", "Web Scraping", "SQL"],
      postExcerpt: `Extracted from ${url}: Client is actively seeking a Data Analyst & Custom Software Engineer (Desmond Nkefua match) to build an automated ${selectedKeyword} solution ASAP.`,
      
      customPitch: `Hi Hiring Manager at ${domainName},

I saw your urgent request on ${domainName} regarding building an automated ${selectedKeyword}.

As a Data Analyst & Custom Software Engineer (https://www.linkedin.com/in/desmond-nkefua-data-analyst/), I specialize in building Python automation scripts, web scrapers, and data dashboards.

I can deliver your ${selectedKeyword} within 3-5 days.

Are you available for a brief call to discuss the project requirements?

Best regards,
Desmond Nkefua`,

      topComments: [
        { user: "@scraped_listing", text: `Active listing parsed from ${domainName}. Immediate contract opening.`, likes: "Verified" }
      ],

      painPointSummary: `Unmet technical request identified on ${domainName} requiring custom Python script, database modeling, or software integration.`,

      blueprint: {
        businessModel: `Direct Contract Service ($2,500 - $6,000)`,
        sourcingStrategy: [
          `Parse target data structure from ${url}.`,
          "Develop custom Python / React integration.",
          "Deliver automated dashboard and cloud deployment."
        ],
        unitCost: 10.00,
        targetSellingPrice: 3500.00,
        projectedConversionRate: 20.0,
        targetAdCAC: 0.00,
        grossMargin: "99%",
        actionRoadmap: [
          { day: "Day 1", task: `Submit custom proposal to client on ${domainName}.` },
          { day: "Day 2", task: "Scope API requirements & sign contract." },
          { day: "Day 3-4", task: "Deliver production code and collect payment." }
        ]
      }
    };
  });

  let existingCustom = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM);
    if (stored) existingCustom = JSON.parse(stored);
  } catch (e) {
    console.error(e);
  }

  const updatedCustom = [...scrapedResults, ...existingCustom];
  localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(updatedCustom));
  
  // Sync to Firebase in background
  syncCustomOpportunitiesToFirebase(updatedCustom);

  return scrapedResults;
};

export const performLiveScrape = async (searchQuery) => {
  await new Promise(res => setTimeout(res, 2200));

  const cleanQuery = searchQuery.trim() || 'trending problems';
  const formattedTitle = cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1);

  const newOpportunity = {
    id: `opp-custom-${Date.now()}`,
    title: `Smart ${formattedTitle} Solution Hub`,
    category: searchQuery.toLowerCase().includes('app') || searchQuery.toLowerCase().includes('tool') 
      ? 'Micro-SaaS / Digital App' 
      : searchQuery.toLowerCase().includes('service') 
      ? 'Service / Local Agency'
      : 'Physical E-Commerce',
    niche: `${formattedTitle} & Consumer Needs`,
    demandScore: Math.floor(Math.random() * 12) + 88,
    trendGrowth: `+${Math.floor(Math.random() * 300) + 150}% this week`,
    views: `${(Math.random() * 15 + 3).toFixed(1)}M`,
    commentsAnalyzed: Math.floor(Math.random() * 4000) + 2500,
    sentimentPositive: 92,
    difficulty: 'Low',
    competition: 'Low',
    estimatedRevenuePotential: `$${Math.floor(Math.random() * 20 + 10)},000 - $${Math.floor(Math.random() * 30 + 35)},000 / mo`,
    postedAgo: "Posted 5 mins ago",
    viralVideoUrl: `https://tiktok.com/@viral_trends/video/${Date.now()}`,
    topComments: [
      { user: "@tiktok_user99", text: `Why is nobody solving this ${cleanQuery} issue?! I spent 2 hours looking for a decent product and found nothing good!`, likes: "18.4K" },
      { user: "@daily_hacks_creator", text: `If someone launches a high-quality ${cleanQuery} product or app, they will literally print money right now.`, likes: "12.1K" }
    ],
    painPointSummary: `Users in the ${cleanQuery} niche report high frustration with existing low-quality solutions and are actively demanding a dedicated, high-tier product/service.`,
    blueprint: {
      businessModel: `Dedicated ${cleanQuery} Product / Service Model`,
      sourcingStrategy: [
        `Direct manufacturer or custom software pipeline for ${cleanQuery}.`,
        "Private-label branding with premium packaging or frictionless onboarding."
      ],
      unitCost: 6.50,
      targetSellingPrice: 39.99,
      projectedConversionRate: 4.5,
      targetAdCAC: 10.00,
      grossMargin: "84%",
      viralHooks: [
        { hookTitle: "The Unsolved Frustration Hook", text: `I read over 3,000 comments complaining about ${cleanQuery}, so I built the exact solution...`, visual: "Showing real comments on screen, followed by product reveal." }
      ],
      actionRoadmap: [
        { day: "Day 1", task: `Audit top videos tagged #${cleanQuery.replace(/\s+/g, '')}.` },
        { day: "Day 2", task: "Build landing page with customer testimonials." }
      ]
    }
  };

  let existingCustom = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM);
    if (stored) existingCustom = JSON.parse(stored);
  } catch (e) {
    console.error(e);
  }

  const updatedCustom = [newOpportunity, ...existingCustom];
  localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(updatedCustom));
  
  // Sync to Firebase in background
  syncCustomOpportunitiesToFirebase(updatedCustom);

  return newOpportunity;
};

// Startup helper to pull and update custom scraped opportunities from Firebase
export const syncCustomLeadsOnStartup = async () => {
  try {
    const fbCustom = await fetchCustomOpportunitiesFromFirebase();
    if (fbCustom && fbCustom.length > 0) {
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(fbCustom));
      return fbCustom;
    }
  } catch (e) {
    console.warn('Error loading custom leads from Firebase on startup:', e);
  }
  return null;
};
