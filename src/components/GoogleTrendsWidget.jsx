import React, { useState } from 'react';
import { GOOGLE_TRENDS_DATA } from '../data/googleTrendsData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles, Cpu, ArrowUpRight, Check } from 'lucide-react';

export default function GoogleTrendsWidget({ onOpenPitchModal }) {
  const [selectedTrend, setSelectedTrend] = useState(GOOGLE_TRENDS_DATA[0]);

  const handleOpenPitch = (idea) => {
    // Transform custom idea into the opportunity format expected by PitchGeneratorModal
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '28px', flexWrap: 'wrap', marginTop: '24px' }}>
      
      {/* LEFT COLUMN: Trends List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: '16px 20px', backgroundColor: 'rgba(66, 133, 244, 0.05)', border: '1px solid rgba(66, 133, 244, 0.25)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#4285f4" />
            <span>Google Search Interest Indices</span>
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Keywords experiencing massive search spikes over the last 12 months.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {GOOGLE_TRENDS_DATA.map((trend) => {
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
          <h3 style={{ fontSize: '#1rem', fontWeight: '800', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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

      </div>

    </div>
  );
}
