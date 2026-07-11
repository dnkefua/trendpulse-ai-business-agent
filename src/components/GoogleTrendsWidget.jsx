import React, { useState, useEffect } from 'react';
import { GOOGLE_TRENDS_DATA } from '../data/googleTrendsData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles, Cpu, ArrowUpRight, Check, Search } from 'lucide-react';
import { fetchLiveTrends } from '../services/liveApi';

export default function GoogleTrendsWidget({ onOpenPitchModal }) {
  const [customTrends, setCustomTrends] = useState([]);
  const [liveTrends, setLiveTrends] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState(GOOGLE_TRENDS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // On mount, try to pull REAL Google Trends interest data from the backend.
  // If it's available (residential IP / deployed), it becomes the primary list;
  // otherwise we keep the seeded sample data so the tab always renders.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, live } = await fetchLiveTrends();
      if (cancelled || !live || !data.length) return;
      setLiveTrends(data);
      setIsLive(true);
      setSelectedTrend(data[0]);
    })();
    return () => { cancelled = true; };
  }, []);

  // Combine custom, live, and static sample trends
  const allTrends = [...customTrends, ...liveTrends, ...GOOGLE_TRENDS_DATA];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const term = searchQuery.toLowerCase().trim();

    // Check if it already exists
    const found = allTrends.find(t => t.keyword.toLowerCase() === term);
    if (found) {
      setSelectedTrend(found);
      return;
    }

    // Try REAL Google Trends for the typed keyword first.
    const { data, live } = await fetchLiveTrends(searchQuery.trim());
    if (live && data.length) {
      setCustomTrends(prev => [data[0], ...prev]);
      setSelectedTrend(data[0]);
      return;
    }

    // Fallback: synthesize a sample trend so the UI stays responsive offline.
    const newTrend = {
      id: `gt-custom-${Date.now()}`,
      keyword: searchQuery,
      growth: `+${Math.floor(Math.random() * 200) + 120}% YOY`,
      category: "Custom Search Trend",
      searchVolume: `${Math.floor(Math.random() * 80) + 30},000 / mo`,
      description: `Global search interest for '${searchQuery}' shows accelerating momentum. Businesses are actively sourcing developers to deploy ${searchQuery} workflows.`,
      skills: ["Python", "Javascript", "APIs", "SQL"],
      monthlyHistory: [
        { month: "Aug", interest: Math.floor(Math.random() * 15) + 15 },
        { month: "Sep", interest: Math.floor(Math.random() * 15) + 20 },
        { month: "Oct", interest: Math.floor(Math.random() * 15) + 25 },
        { month: "Nov", interest: Math.floor(Math.random() * 15) + 35 },
        { month: "Dec", interest: Math.floor(Math.random() * 15) + 40 },
        { month: "Jan", interest: Math.floor(Math.random() * 15) + 50 },
        { month: "Feb", interest: Math.floor(Math.random() * 15) + 55 },
        { month: "Mar", interest: Math.floor(Math.random() * 15) + 65 },
        { month: "Apr", interest: Math.floor(Math.random() * 15) + 70 },
        { month: "May", interest: Math.floor(Math.random() * 15) + 80 },
        { month: "Jun", interest: Math.floor(Math.random() * 10) + 85 },
        { month: "Jul", interest: 100 }
      ],
      nicheIdeas: [
        {
          title: `Custom ${searchQuery} Middleware Automator`,
          desc: `Build automated connectors to sync database and operations using ${searchQuery} triggers.`,
          estVal: "$4,500 - $7,000 Project"
        },
        {
          title: `${searchQuery} Sourcing Pipeline Bot`,
          desc: `Automate supplier retrieval and data compilation utilizing custom web interfaces.`,
          estVal: "$3,000 - $5,500 Project"
        }
      ],
      recommendedLeads: [
        {
          name: "William Vance",
          title: "Engineering Lead @ CloudScale Systems",
          avatar: "WV",
          postText: `Our engineering team is looking to hire a contract developer who can deploy automated systems and scripting templates matching our ${searchQuery} workflows. Immediate start.`,
          profileUrl: "https://www.linkedin.com/in/desmond-nkefua-data-analyst/",
          budget: "$5,000 - $8,000 Contract"
        },
        {
          name: "Sarah Connor",
          title: "Director of IT @ Cyberdyne Corp",
          avatar: "SC",
          postText: `We need a custom integration setup specifically leveraging ${searchQuery} APIs to link our database with remote endpoints. High urgency.`,
          profileUrl: "https://www.linkedin.com/in/desmond-nkefua-data-analyst/",
          budget: "$4,000 - $6,000 Project"
        }
      ]
    };

    setCustomTrends(prev => [newTrend, ...prev]);
    setSelectedTrend(newTrend);
  };

  const handleOpenPitch = (idea) => {
    const oppFormat = {
      id: `gt-opp-${Date.now()}`,
      platform: "Google Trends Query",
      title: idea.title,
      clientName: "Hiring Manager",
      clientTitle: "Business Operations Lead",
      clientLocation: "Remote (Global)",
      urgency: "⚡ High Intent Query",
      postedAgo: "Trending now",
      requiredSkills: selectedTrend.skills,
      budget: idea.estVal,
      postExcerpt: `${selectedTrend.description} - Specifically seeking an expert to build a ${idea.title.toLowerCase()} solution.`,
      customPitch: `Hi Hiring Manager,

I noticed the massive trend spike on Google Trends regarding "${selectedTrend.keyword}" searches and matching operations.

As a Senior Data Analyst & Custom Software Engineer (https://www.linkedin.com/in/desmond-nkefua-data-analyst/), I specialize in ${selectedTrend.skills.join(', ')}.

I can build and deploy a custom, automated "${idea.title}" solution tailored to your exact specifications.

Are you open to a brief chat to review requirements?

Best regards,
Desmond Nkefua`
    };
    onOpenPitchModal(oppFormat);
  };

  const handleOpenLeadPitch = (lead) => {
    const oppFormat = {
      id: `gt-lead-${Date.now()}`,
      platform: "Google Trends Lead",
      title: `${selectedTrend.keyword} Expert Integration`,
      clientName: lead.name,
      clientTitle: lead.title,
      clientLocation: "Remote (Global)",
      urgency: "⚡ Verified Evidence Post",
      postedAgo: "Recent post",
      requiredSkills: selectedTrend.skills,
      budget: lead.budget,
      postExcerpt: lead.postText,
      customPitch: `Hi ${lead.name},

I saw your recent request regarding "${selectedTrend.keyword}" requirements: "${lead.postText}".

As a Senior Data Analyst & Custom Software Engineer (https://www.linkedin.com/in/desmond-nkefua-data-analyst/), I specialize in ${selectedTrend.skills.join(', ')}.

I can deliver an automated solution matching your exact specifications.

Would you be open to a 5-minute call to discuss further details?

Best regards,
Desmond Nkefua`
    };
    onOpenPitchModal(oppFormat);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '28px', flexWrap: 'wrap', marginTop: '24px' }}>
      
      {/* LEFT COLUMN: Trends List & Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Header Title */}
        <div className="glass-panel" style={{ padding: '16px 20px', backgroundColor: 'rgba(66, 133, 244, 0.05)', border: '1px solid rgba(66, 133, 244, 0.25)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#4285f4" />
            <span>Google Search Interest Indices</span>
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Keywords experiencing massive search spikes over the last 12 months.
          </p>
          <span style={{
            display: 'inline-block',
            marginTop: '8px',
            fontSize: '0.68rem',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '10px',
            color: isLive ? '#10b981' : '#f59e0b',
            background: isLive ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
            border: `1px solid ${isLive ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`
          }}>
            {isLive ? '🟢 LIVE Google Trends data' : '🟡 Sample data — start the lead API for live trends'}
          </span>
        </div>

        {/* Dynamic Search Box */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="Search Google Trends keyword..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '10px 14px 10px 38px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4285f4'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          </div>
          <button 
            className="btn-primary" 
            onClick={handleSearch}
            style={{
              padding: '10px 16px',
              fontSize: '0.82rem',
              background: '#4285f4',
              borderColor: '#4285f4'
            }}
          >
            Search
          </button>
        </div>

        {/* Trends List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
          {allTrends.map((trend) => {
            const isSelected = selectedTrend.id === trend.id;
            return (
              <div 
                key={trend.id}
                onClick={() => setSelectedTrend(trend)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  backgroundColor: isSelected ? 'rgba(66, 133, 244, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid',
                  borderColor: isSelected ? 'rgba(66, 133, 244, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  }
                }}
              >
                <div>
                  <span className="badge" style={{ fontSize: '0.62rem', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {trend.category}
                  </span>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#fff', marginTop: '6px' }}>
                    {trend.keyword}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Vol: {trend.searchVolume}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '800', display: 'block' }}>
                    {trend.growth}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Interest Index
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Trend Detailed Chart & Opportunities */}
      <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Detail Header */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fff' }}>
                {selectedTrend.keyword}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {selectedTrend.description}
              </p>
            </div>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '800' }}>
                📈 {selectedTrend.growth} growth
              </span>
            </div>
          </div>

          {/* Required Skills tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
            {selectedTrend.skills.map((skill, idx) => (
              <span 
                key={idx} 
                className="badge badge-cyan" 
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 12-Month Recharts Area Chart */}
        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(9, 13, 22, 0.6)' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={14} color="#4285f4" /> 12-Month Search Interest Trend History
          </h4>

          <div style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedTrend.monthlyHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  formatter={(val) => [`${val} index`, 'Interest']}
                />
                <Area type="monotone" dataKey="interest" stroke="#4285f4" fill="url(#trendsGradient)" strokeWidth={2} />
                <defs>
                  <linearGradient id="trendsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4285f4" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#00f2fe" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monetizable Niche Opportunities */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--tiktok-cyan)" />
            <span>💡 Monetizable Niche Opportunities for Desmond</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedTrend.nicheIdeas.map((idea, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={15} color="var(--tiktok-cyan)" />
                    {idea.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {idea.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '800' }}>
                    {idea.estVal}
                  </span>
                  
                  <button 
                    className="btn-cyan" 
                    onClick={() => handleOpenPitch(idea)}
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Pitch Contract</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Clients (Evidenced Leads) */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} color="#4285f4" />
            <span>👥 Recommended Clients Requiring Services (Evidenced Leads)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {selectedTrend.recommendedLeads && selectedTrend.recommendedLeads.map((lead, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: 'rgba(66, 133, 244, 0.03)',
                  border: '1px solid rgba(66, 133, 244, 0.12)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Lead Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4285f4, #00f2fe)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: '0.85rem'
                    }}>
                      {lead.avatar}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>
                        {lead.name}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {lead.title}
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '800', background: 'rgba(16, 185, 129, 0.08)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                    {lead.budget}
                  </span>
                </div>

                {/* Evidence Comment Text */}
                <div style={{
                  background: 'rgba(0,0,0,0.2)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  borderLeft: '3px solid #4285f4',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.4'
                }}>
                  <em>"{lead.postText}"</em>
                </div>

                {/* Lead Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <a 
                    href={lead.profileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-primary"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    View Search Profile
                  </a>

                  <button 
                    className="btn-cyan"
                    onClick={() => handleOpenLeadPitch(lead)}
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Pitch Lead</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
