import React, { useState } from 'react';
import { Flame, Bookmark, MessageSquare, Eye, DollarSign, ArrowRight, User, MapPin, Send, ExternalLink, Clock, ShieldCheck, CheckCircle2, Facebook, Twitter, Briefcase, Search, Copy, Check, MessageSquareCode, Radio } from 'lucide-react';
import { getRelativePostAge } from '../utils/timeUtils';

export default function OpportunityCard({ 
  opportunity, 
  isSaved, 
  onToggleSave, 
  onSelectBlueprint,
  onOpenPitchModal 
}) {
  const isReddit = opportunity.platform === 'Reddit';
  const isUpwork = opportunity.platform === 'Upwork & Freelance';
  const isTwitter = opportunity.platform === 'Twitter / X';
  const isFacebook = opportunity.platform === 'Facebook';
  const isHackerNews = opportunity.platform === 'Hacker News';
  const isRemoteJobs = opportunity.platform === 'Remote Jobs';
  const isLinkedIn = opportunity.platform === 'LinkedIn' || (opportunity.customPitch && !isTwitter && !isFacebook && !isUpwork && !isReddit && !isHackerNews && !isRemoteJobs);
  const isB2B = isLinkedIn || isFacebook || isTwitter || isUpwork || isReddit || isHackerNews || isRemoteJobs || opportunity.customPitch;

  const [copiedQuote, setCopiedQuote] = useState(false);

  const topQuote = opportunity.topComments && opportunity.topComments.length > 0 
    ? opportunity.topComments[0] 
    : { user: opportunity.clientName || "@user", text: opportunity.postExcerpt || "Need developer ASAP!", likes: "Verified" };

  const quoteText = opportunity.postExcerpt || topQuote.text;

  // Compute exact dynamic post age matching live external site timestamp
  const displayPostAge = getRelativePostAge(opportunity.timestamp);

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(quoteText);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const getLinkedInJobsUrl = () => {
    const searchTerms = `${(opportunity.requiredSkills || []).slice(0, 2).join(' ')} ${(opportunity.title || '').replace(/[^a-zA-Z0-9\s]/g, '')}`.trim();
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerms)}`;
  };

  const getLinkedInPostsUrl = () => {
    const searchTerms = `${(opportunity.requiredSkills || []).slice(0, 2).join(' ')} ${(opportunity.title || '').replace(/[^a-zA-Z0-9\s]/g, '')}`.trim();
    return `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(searchTerms)}`;
  };

  const getPrimarySearchUrl = () => {
    // Real leads carry the actual permalink — always prefer it so the button
    // opens the genuine post rather than a generic search.
    if (opportunity.postUrl) return opportunity.postUrl;
    if (isReddit) return opportunity.redditPostUrl || `https://www.reddit.com/r/forhire/search/?q=${encodeURIComponent(opportunity.title)}`;
    if (isUpwork) return `https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(opportunity.title)}`;
    if (isTwitter) return `https://x.com/search?q=${encodeURIComponent(opportunity.title)}`;
    if (isFacebook) return `https://www.facebook.com/search/posts/?q=${encodeURIComponent(opportunity.title)}`;
    return getLinkedInJobsUrl();
  };

  const getCategoryBadge = () => {
    if (isHackerNews) {
      return <span className="badge" style={{ background: 'rgba(255,102,0,0.15)', color: '#ff6600', border: '1px solid rgba(255,102,0,0.35)' }}>🟠 {opportunity.sourceTag || 'Hacker News'}</span>;
    }
    if (isRemoteJobs) {
      return <span className="badge badge-cyan">💼 {opportunity.sourceTag || 'Remote Jobs'}</span>;
    }
    if (isReddit) {
      return <span className="badge" style={{ background: 'rgba(255,69,0,0.15)', color: '#ff4500', border: '1px solid rgba(255,69,0,0.3)' }}>🔴 Reddit {opportunity.subreddit || 'r/forhire'}</span>;
    }
    if (isUpwork) {
      return <span className="badge" style={{ background: 'rgba(20,168,0,0.15)', color: '#14a800', border: '1px solid rgba(20,168,0,0.3)' }}>🟢 Upwork / Freelance</span>;
    }
    if (isTwitter) {
      return <span className="badge" style={{ background: 'rgba(29,155,240,0.15)', color: '#1d9bf0', border: '1px solid rgba(29,155,240,0.3)' }}>🐦 Twitter / X Tech</span>;
    }
    if (isFacebook) {
      return <span className="badge" style={{ background: 'rgba(24,119,242,0.15)', color: '#1877f2', border: '1px solid rgba(24,119,242,0.3)' }}>📘 Facebook Group</span>;
    }
    if (isLinkedIn) {
      return <span className="badge badge-cyan">💼 LinkedIn IT</span>;
    }
    switch (opportunity.category) {
      case 'Physical E-Commerce':
        return <span className="badge badge-cyan">📦 {opportunity.category}</span>;
      case 'Micro-SaaS / Digital App':
        return <span className="badge badge-purple">⚡ {opportunity.category}</span>;
      case 'Service / Local Agency':
        return <span className="badge badge-amber">🛠️ {opportunity.category}</span>;
      default:
        return <span className="badge badge-emerald">💎 {opportunity.category}</span>;
    }
  };

  return (
    <div className="glass-panel glass-panel-hover" style={{ 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      borderColor: isReddit ? 'rgba(255, 69, 0, 0.35)' : isUpwork ? 'rgba(20, 168, 0, 0.35)' : isTwitter ? 'rgba(29, 155, 240, 0.35)' : isFacebook ? 'rgba(24, 119, 242, 0.3)' : isLinkedIn ? 'rgba(0, 242, 254, 0.25)' : undefined
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '120px',
        height: '120px',
        background: isReddit
          ? 'radial-gradient(circle, rgba(255, 69, 0, 0.25) 0%, transparent 70%)'
          : isUpwork
          ? 'radial-gradient(circle, rgba(20, 168, 0, 0.25) 0%, transparent 70%)'
          : isTwitter
          ? 'radial-gradient(circle, rgba(29, 155, 240, 0.25) 0%, transparent 70%)'
          : isFacebook
          ? 'radial-gradient(circle, rgba(24, 119, 242, 0.2) 0%, transparent 70%)'
          : isLinkedIn 
          ? 'radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(255, 0, 80, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      <div>
        {/* Top Header: Badges & Bookmark */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
          {getCategoryBadge()}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontSize: '0.72rem', 
              color: isB2B ? 'var(--tiktok-pink)' : '#10b981', 
              fontWeight: '700', 
              backgroundColor: isB2B ? 'rgba(255, 0, 80, 0.12)' : 'rgba(16, 185, 129, 0.1)', 
              padding: '2px 8px', 
              borderRadius: '12px' 
            }}>
              {opportunity.urgency || opportunity.trendGrowth}
            </span>

            <button 
              onClick={() => onToggleSave(opportunity.id)}
              style={{
                background: 'none',
                border: 'none',
                color: isSaved ? 'var(--tiktok-cyan)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
              title={isSaved ? "Saved" : "Save Opportunity"}
            >
              <Bookmark size={18} fill={isSaved ? 'var(--tiktok-cyan)' : 'none'} />
            </button>
          </div>
        </div>

        {/* Dynamic Verified Timestamp Bar (Exact External Site Match) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={12} color="#10b981" style={{ animation: 'pulseGlow 2s infinite' }} />
            <span style={{ fontWeight: '600' }}>Site Age: <strong style={{ color: '#fff' }}>{displayPostAge}</strong></span>
          </div>

          <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} color="#10b981" /> {opportunity.isReal ? 'LIVE · Real listing' : 'Verified Live Match'}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px', color: '#fff', lineHeight: 1.3 }}>
          {opportunity.title}
        </h3>

        {/* Client Info / Handle */}
        {isB2B ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={13} color="var(--tiktok-cyan)" />
              <span style={{ color: '#fff', fontWeight: '600' }}>{opportunity.clientName}</span>
              <span style={{ color: 'var(--text-muted)' }}>({opportunity.clientTitle})</span>
            </div>
            {opportunity.clientLocation && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <MapPin size={13} />
                <span>{opportunity.clientLocation}</span>
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Niche: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{opportunity.niche}</span>
          </p>
        )}

        {/* Desmond Skill Badges */}
        {opportunity.requiredSkills && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {opportunity.requiredSkills.map((sk, idx) => (
              <span key={idx} style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                backgroundColor: isReddit ? 'rgba(255,69,0,0.1)' : isUpwork ? 'rgba(20,168,0,0.1)' : isTwitter ? 'rgba(29,155,240,0.1)' : isFacebook ? 'rgba(24,119,242,0.1)' : 'rgba(0, 242, 254, 0.08)',
                color: isReddit ? '#ff4500' : isUpwork ? '#14a800' : isTwitter ? '#1d9bf0' : isFacebook ? '#1877f2' : 'var(--tiktok-cyan)',
                border: '1px solid',
                borderColor: isReddit ? 'rgba(255,69,0,0.3)' : isUpwork ? 'rgba(20,168,0,0.3)' : isTwitter ? 'rgba(29,155,240,0.3)' : isFacebook ? 'rgba(24,119,242,0.3)' : 'rgba(0, 242, 254, 0.2)',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                ✓ {sk}
              </span>
            ))}
          </div>
        )}

        {/* Verified Quote / Excerpt Box with Copy */}
        <div style={{ 
          background: isReddit ? 'rgba(255, 69, 0, 0.05)' : isUpwork ? 'rgba(20, 168, 0, 0.05)' : isTwitter ? 'rgba(29, 155, 240, 0.05)' : isFacebook ? 'rgba(24, 119, 242, 0.05)' : isLinkedIn ? 'rgba(0, 242, 254, 0.04)' : 'rgba(255, 0, 80, 0.05)', 
          borderLeft: `3px solid ${isReddit ? '#ff4500' : isUpwork ? '#14a800' : isTwitter ? '#1d9bf0' : isFacebook ? '#1877f2' : isLinkedIn ? 'var(--tiktok-cyan)' : 'var(--tiktok-pink)'}`, 
          padding: '12px 14px', 
          borderRadius: '0 10px 10px 0', 
          marginBottom: '16px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: isReddit ? '#ff4500' : isUpwork ? '#14a800' : isTwitter ? '#1d9bf0' : isFacebook ? '#1877f2' : isLinkedIn ? 'var(--tiktok-cyan)' : 'var(--tiktok-pink)' }}>
              💬 Verified Client Request Quote:
            </span>

            <button
              onClick={handleCopyQuote}
              style={{
                background: 'none',
                border: 'none',
                color: copiedQuote ? '#10b981' : 'var(--text-muted)',
                fontSize: '0.7rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {copiedQuote ? (
                <>
                  <Check size={12} color="#10b981" />
                  <span>Copied Quote!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy Quote</span>
                </>
              )}
            </button>
          </div>

          <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.4 }}>
            "{quoteText}"
          </p>
        </div>

        {/* Budget & Revenue Potential */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Budget / Rev:</span>
          <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>
            {opportunity.budget || opportunity.estimatedRevenuePotential}
          </strong>
        </div>
      </div>

      {/* Direct Verified Search Links */}
      {isB2B && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          <a 
            href={getPrimarySearchUrl()} 
            target="_blank" 
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#fff',
              backgroundColor: isReddit ? '#ff4500' : isUpwork ? '#14a800' : isTwitter ? '#1d9bf0' : isFacebook ? '#1877f2' : 'var(--tiktok-cyan)',
              fontSize: '0.78rem',
              fontWeight: '800',
              textDecoration: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: isReddit ? '0 2px 10px rgba(255, 69, 0, 0.4)' : isUpwork ? '0 2px 10px rgba(20, 168, 0, 0.4)' : isTwitter ? '0 2px 10px rgba(29, 155, 240, 0.4)' : isFacebook ? '0 2px 10px rgba(24, 119, 242, 0.4)' : '0 2px 10px rgba(0, 242, 254, 0.3)'
            }}
          >
            <Search size={13} />
            <span>Open Live {opportunity.platform || 'LinkedIn'} Feed ↗</span>
          </a>

          {isLinkedIn && (
            <a 
              href={getLinkedInPostsUrl()} 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: 'var(--tiktok-cyan)',
                backgroundColor: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                fontSize: '0.74rem',
                fontWeight: '700',
                textDecoration: 'none',
                borderRadius: '8px',
                padding: '6px 10px'
              }}
            >
              <span>Search LinkedIn Posts Feed 🔎</span>
            </a>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {isB2B && (
          <button 
            className="btn-pink" 
            style={{ flex: 1, justifyContent: 'center', padding: '10px 14px', fontSize: '0.82rem' }}
            onClick={() => onOpenPitchModal(opportunity)}
          >
            <Send size={14} />
            <span>Desmond Pitch</span>
          </button>
        )}

        <button 
          className="btn-primary" 
          style={{ flex: 1, justifyContent: 'center', padding: '10px 14px', fontSize: '0.82rem' }}
          onClick={() => onSelectBlueprint(opportunity)}
        >
          <span>Blueprint</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
