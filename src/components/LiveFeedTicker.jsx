import React, { useState, useEffect } from 'react';
import { Radio, Zap, ArrowRight } from 'lucide-react';
import { getRelativePostAge } from '../utils/timeUtils';

export default function LiveFeedTicker({ opportunities = [], onSelectOpportunity }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (opportunities.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % opportunities.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [opportunities.length]);

  if (!opportunities || opportunities.length === 0) return null;

  // Clamp with modulo: when the list shrinks (e.g. switching from 24 live leads
  // to a smaller fallback set), a stale currentIndex could otherwise point past
  // the end and crash on an undefined item.
  const currentOpp = opportunities[currentIndex % opportunities.length];
  if (!currentOpp) return null;
  const postAgeDisplay = getRelativePostAge(currentOpp.timestamp);

  return (
    <div style={{
      backgroundColor: 'rgba(9, 13, 22, 0.85)',
      border: '1px solid rgba(0, 242, 254, 0.3)',
      backdropFilter: 'blur(12px)',
      padding: '8px 20px',
      borderRadius: '12px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      boxShadow: '0 4px 20px rgba(0, 242, 254, 0.12)'
    }}>
      {/* Left Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(255, 0, 80, 0.15)',
          color: 'var(--tiktok-pink)',
          border: '1px solid rgba(255, 0, 80, 0.4)',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.74rem',
          fontWeight: '800',
          textTransform: 'uppercase'
        }}>
          <Radio size={12} color="var(--tiktok-pink)" style={{ animation: 'pulseGlow 1.5s infinite' }} />
          <span>LIVE INGESTION STREAM</span>
        </span>
      </div>

      {/* Center Ticker Text */}
      <div style={{ 
        flex: 1, 
        overflow: 'hidden', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        fontSize: '0.84rem'
      }}>
        <span className="badge badge-cyan" style={{ fontSize: '0.68rem', flexShrink: 0 }}>
          {currentOpp.platform || 'TikTok'}
        </span>

        <span style={{ fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {currentOpp.title}
        </span>

        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', flexShrink: 0 }}>
          • {postAgeDisplay}
        </span>

        <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.8rem', flexShrink: 0 }}>
          ({currentOpp.budget || currentOpp.estimatedRevenuePotential})
        </span>
      </div>

      {/* Right Action */}
      <button 
        onClick={() => onSelectOpportunity(currentOpp)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--tiktok-cyan)',
          fontSize: '0.78rem',
          fontWeight: '800',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0
        }}
      >
        <span>View Opportunity</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
