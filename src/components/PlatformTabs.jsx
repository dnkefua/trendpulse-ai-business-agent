import React from 'react';
import { Video, Linkedin, Facebook, Twitter, Briefcase, Globe, Sparkles, UserCheck, MessageSquareCode, TrendingUp } from 'lucide-react';
import { DESMOND_PROFILE } from '../data/linkedInOpportunities';

export default function PlatformTabs({ activePlatform, setActivePlatform }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      
      {/* Platform Navigation Tabs */}
      <div className="glass-panel" style={{ 
        padding: '8px', 
        display: 'flex', 
        gap: '8px', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        
        {/* TAB 1: TIKTOK TRENDS */}
        <button 
          onClick={() => setActivePlatform('tiktok')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: activePlatform === 'tiktok' ? 'var(--tiktok-pink)' : 'transparent',
            backgroundColor: activePlatform === 'tiktok' ? 'rgba(255, 0, 80, 0.15)' : 'transparent',
            color: activePlatform === 'tiktok' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Video size={15} color={activePlatform === 'tiktok' ? 'var(--tiktok-pink)' : 'var(--text-secondary)'} />
          <span>TikTok Trends</span>
        </button>

        {/* TAB 2: LINKEDIN IT FINDER */}
        <button 
          onClick={() => setActivePlatform('linkedin')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: activePlatform === 'linkedin' ? 'var(--tiktok-cyan)' : 'transparent',
            backgroundColor: activePlatform === 'linkedin' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
            color: activePlatform === 'linkedin' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Linkedin size={15} color={activePlatform === 'linkedin' ? 'var(--tiktok-cyan)' : 'var(--text-secondary)'} />
          <span>LinkedIn IT</span>
          <span className="badge badge-cyan" style={{ fontSize: '0.55rem', padding: '1px 4px' }}>Desmond</span>
        </button>

        {/* TAB 3: UPWORK & FREELANCE */}
        <button 
          onClick={() => setActivePlatform('upwork')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: activePlatform === 'upwork' ? '#14a800' : 'transparent',
            backgroundColor: activePlatform === 'upwork' ? 'rgba(20, 168, 0, 0.15)' : 'transparent',
            color: activePlatform === 'upwork' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Briefcase size={15} color={activePlatform === 'upwork' ? '#14a800' : 'var(--text-secondary)'} />
          <span>Upwork</span>
        </button>

        {/* TAB 4: REDDIT HIRING (SITE #6) */}
        <button 
          onClick={() => setActivePlatform('reddit')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: activePlatform === 'reddit' ? '#ff4500' : 'transparent',
            backgroundColor: activePlatform === 'reddit' ? 'rgba(255, 69, 0, 0.15)' : 'transparent',
            color: activePlatform === 'reddit' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <MessageSquareCode size={15} color={activePlatform === 'reddit' ? '#ff4500' : 'var(--text-secondary)'} />
          <span>Reddit Hiring</span>
          <span className="badge" style={{ fontSize: '0.55rem', padding: '1px 4px', background: 'rgba(255,69,0,0.2)', color: '#ff4500', border: '1px solid #ff4500' }}>Site #6</span>
        </button>

        {/* TAB 5: FACEBOOK GROUPS */}
        <button 
          onClick={() => setActivePlatform('facebook')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: activePlatform === 'facebook' ? '#1877f2' : 'transparent',
            backgroundColor: activePlatform === 'facebook' ? 'rgba(24, 119, 242, 0.15)' : 'transparent',
            color: activePlatform === 'facebook' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Facebook size={15} color={activePlatform === 'facebook' ? '#1877f2' : 'var(--text-secondary)'} />
          <span>Facebook</span>
        </button>

        {/* TAB 6: TWITTER / X TECH */}
        <button 
          onClick={() => setActivePlatform('twitter')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: activePlatform === 'twitter' ? '#1d9bf0' : 'transparent',
            backgroundColor: activePlatform === 'twitter' ? 'rgba(29, 155, 240, 0.15)' : 'transparent',
            color: activePlatform === 'twitter' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Twitter size={15} color={activePlatform === 'twitter' ? '#1d9bf0' : 'var(--text-secondary)'} />
          <span>Twitter / X</span>
        </button>

        {/* TAB 7: GOOGLE TRENDS */}
        <button 
          onClick={() => setActivePlatform('google_trends')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: activePlatform === 'google_trends' ? '#4285f4' : 'transparent',
            backgroundColor: activePlatform === 'google_trends' ? 'rgba(66, 133, 244, 0.15)' : 'transparent',
            color: activePlatform === 'google_trends' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <TrendingUp size={15} color={activePlatform === 'google_trends' ? '#4285f4' : 'var(--text-secondary)'} />
          <span>Google Trends</span>
        </button>

        {/* TAB 8: 5-WEBSITE CUSTOM SCRAPER */}
        <button 
          onClick={() => setActivePlatform('custom_5_sites')}
          style={{
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: activePlatform === 'custom_5_sites' ? 'var(--accent-purple)' : 'transparent',
            backgroundColor: activePlatform === 'custom_5_sites' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
            color: activePlatform === 'custom_5_sites' ? '#fff' : 'var(--text-secondary)',
            fontWeight: '700',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Globe size={15} color={activePlatform === 'custom_5_sites' ? 'var(--accent-purple)' : 'var(--text-secondary)'} />
          <span>5-Website Custom Scraper</span>
        </button>

      </div>

      {/* Profile Match Banner */}
      {(activePlatform === 'linkedin' || activePlatform === 'upwork' || activePlatform === 'reddit' || activePlatform === 'facebook' || activePlatform === 'twitter') && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(255, 69, 0, 0.08) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          borderRadius: '14px',
          padding: '16px 20px',
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--tiktok-cyan)',
              color: '#090d16',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem'
            }}>
              DN
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff' }}>
                  {DESMOND_PROFILE.name} — Skill Match Active ({activePlatform.toUpperCase()})
                </h4>
                <UserCheck size={16} color="#10b981" />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Matching posts for Data Analytics, Power BI, Web Scraping, Python Automation & Custom Software.
              </p>
            </div>
          </div>

          <a 
            href={DESMOND_PROFILE.linkedInUrl} 
            target="_blank" 
            rel="noreferrer"
            style={{
              color: 'var(--tiktok-cyan)',
              fontSize: '0.82rem',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(0, 242, 254, 0.1)',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 242, 254, 0.3)'
            }}
          >
            <span>View LinkedIn Profile</span>
            ↗
          </a>
        </div>
      )}

    </div>
  );
}
