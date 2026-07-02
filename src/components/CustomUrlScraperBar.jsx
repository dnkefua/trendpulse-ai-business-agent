import React, { useState } from 'react';
import { Globe, Sparkles, Loader2, Link2 } from 'lucide-react';

export default function CustomUrlScraperBar({ onRunFiveSiteScrape, isScraping }) {
  const [urls, setUrls] = useState([
    'https://www.linkedin.com/jobs',
    'https://www.upwork.com',
    'https://www.reddit.com/r/freelance',
    'https://remoteok.com',
    'https://news.ycombinator.com/jobs'
  ]);

  const handleUrlChange = (index, val) => {
    const updated = [...urls];
    updated[index] = val;
    setUrls(updated);
  };

  const handleScrape = () => {
    onRunFiveSiteScrape(urls);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Globe size={20} color="var(--accent-purple)" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
            5-Website Multi-URL Opportunity Scraper
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Paste up to 5 target URLs below (job boards, Reddit threads, LinkedIn, blogs) to extract opportunities simultaneously.
          </p>
        </div>
      </div>

      {/* 5 URL Inputs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {urls.map((url, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <Link2 size={16} color="var(--accent-purple)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(idx, e.target.value)}
              placeholder={`Target Website URL #${idx + 1}...`}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                backgroundColor: 'rgba(9, 13, 22, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>
        ))}
      </div>

      {/* Scrape Trigger Button */}
      <button 
        className="btn-primary"
        onClick={handleScrape}
        disabled={isScraping}
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '14px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #00f2fe 100%)',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
        }}
      >
        {isScraping ? (
          <>
            <Loader2 size={18} className="spin-slow" />
            <span>Parsing 5 Websites Simultaneously...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Scrape All 5 Websites for Opportunities</span>
          </>
        )}
      </button>

    </div>
  );
}
