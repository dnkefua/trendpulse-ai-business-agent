import React from 'react';
import { Sparkles, Bookmark, Settings, Flame, Activity, Zap, RefreshCw, Cloud, CloudOff } from 'lucide-react';

export default function Navbar({ 
  savedCount, 
  showSavedOnly, 
  setShowSavedOnly, 
  onOpenSettings,
  totalOpportunitiesCount,
  onRefresh,
  isRefreshing,
  syncStatus
}) {
  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 16px 16px', borderTop: 'none', marginBottom: '28px' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', padding: '14px 24px', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Logo & Brand with 3D Effect */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* 3D Container Box */}
          <div style={{ 
            perspective: '800px',
            cursor: 'pointer'
          }}>
            <div 
              style={{ 
                width: '54px', 
                height: '54px', 
                borderRadius: '16px', 
                overflow: 'hidden',
                border: '2px solid rgba(0, 242, 254, 0.6)',
                boxShadow: '0 10px 25px -5px rgba(0, 242, 254, 0.5), 0 0 15px rgba(255, 0, 80, 0.4), inset 0 0 10px rgba(255,255,255,0.2)',
                background: 'linear-gradient(135deg, #090d16 0%, #121827 100%)',
                transform: 'rotateY(-12deg) rotateX(10deg)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 242, 254, 0.7), 0 0 25px rgba(255, 0, 80, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotateY(-12deg) rotateX(10deg) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 242, 254, 0.5), 0 0 15px rgba(255, 0, 80, 0.4)';
              }}
            >
              <img 
                src="/logo.png" 
                alt="TrendPulse AI 3D Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: '800' }}>
                <span className="text-gradient">TrendPulse</span> <span style={{ color: '#fff' }}>AI</span>
              </h1>
              <span className="badge badge-pink" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                3D PRO EDITION
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Multi-Platform Business & Opportunity Intelligence
            </p>
          </div>
        </div>

        {/* Live System Status */}
        <div className="status-indicator-box" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          background: 'rgba(255, 255, 255, 0.03)', 
          padding: '8px 16px', 
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: '#10b981', 
              boxShadow: '0 0 10px #10b981',
              animation: 'pulseGlow 2s infinite'
            }}></span>
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Engine: <span style={{ color: '#10b981' }}>Active</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <Flame size={14} color="#ff0050" />
            <span>Found: <strong style={{ color: '#fff' }}>{totalOpportunitiesCount}</strong></span>
          </div>

          <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
            {syncStatus === 'syncing' ? (
              <>
                <Cloud size={14} color="var(--tiktok-cyan)" className="spin-slow" />
                <span style={{ color: 'var(--tiktok-cyan)', fontWeight: '600' }}>Syncing...</span>
              </>
            ) : syncStatus === 'error' ? (
              <>
                <CloudOff size={14} color="#ef4444" />
                <span style={{ color: '#ef4444', fontWeight: '600' }}>Offline Fallback</span>
              </>
            ) : (
              <>
                <Cloud size={14} color="#10b981" />
                <span style={{ color: '#10b981', fontWeight: '600' }}>Cloud Synced</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn-primary" 
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(0, 242, 254, 0.12)',
              border: '1px solid var(--tiktok-cyan)',
              color: 'var(--tiktok-cyan)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: '700'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 242, 254, 0.2)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 242, 254, 0.12)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin-slow' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
          </button>

          <button 
            className={`btn-secondary ${showSavedOnly ? 'active-saved' : ''}`}
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            style={{
              borderColor: showSavedOnly ? 'var(--tiktok-cyan)' : undefined,
              background: showSavedOnly ? 'rgba(0, 242, 254, 0.12)' : undefined,
              color: showSavedOnly ? 'var(--tiktok-cyan)' : undefined
            }}
          >
            <Bookmark size={16} fill={showSavedOnly ? 'var(--tiktok-cyan)' : 'none'} />
            <span>Saved ({savedCount})</span>
          </button>

          <button className="btn-secondary" onClick={onOpenSettings} title="Configure API Keys & Scraper Mode">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>

      </div>
    </header>
  );
}
