import React from 'react';
import { Search, Sparkles, Filter, SlidersHorizontal, ArrowUpDown, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../data/mockOpportunities';

const SUGGESTIONS = [
  "Hydroflask car cup holder",
  "TikTok recipe grocery app",
  "Matcha frother travel case",
  "Airbnb automation",
  "Desk cable hub",
  "Pet grooming hack"
];

export default function ScraperBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  sortBy, 
  setSortBy,
  onRunScrape,
  isScraping 
}) {

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onRunScrape(searchQuery);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
      
      {/* Top Search Bar & Scrape Button */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search TikTok keywords, pain points, or user quotes (e.g. 'car cup holder', 'recipe app')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              backgroundColor: 'rgba(9, 13, 22, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>

        <button 
          className="btn-pink"
          disabled={isScraping}
          onClick={() => onRunScrape(searchQuery)}
          style={{ padding: '14px 28px', fontSize: '0.95rem' }}
        >
          {isScraping ? (
            <>
              <Loader2 size={18} className="spin-slow" />
              <span>Mining TikTok Comments...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Mine TikTok Opportunities</span>
            </>
          )}
        </button>
      </div>

      {/* Keyword Suggestion Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
          Trending Searches:
        </span>
        {SUGGESTIONS.map((sugg, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSearchQuery(sugg);
              onRunScrape(sugg);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 242, 254, 0.1)';
              e.target.style.borderColor = 'rgba(0, 242, 254, 0.3)';
              e.target.style.color = 'var(--tiktok-cyan)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.04)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.target.style.color = 'var(--text-secondary)';
            }}
          >
            🔥 {sugg}
          </button>
        ))}
      </div>

      {/* Category Pills & Sorting Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: '16px', 
        flexWrap: 'wrap',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        paddingTop: '16px'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: '600',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--tiktok-cyan)' : 'rgba(255, 255, 255, 0.08)',
                backgroundColor: selectedCategory === cat ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat ? 'var(--tiktok-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={14} color="var(--text-secondary)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              backgroundColor: 'rgba(9, 13, 22, 0.8)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="demand">Highest Demand Score</option>
            <option value="comments">Most Comments Analyzed</option>
            <option value="growth">Fastest Trend Growth</option>
          </select>
        </div>
      </div>

    </div>
  );
}
