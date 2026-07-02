import React, { useState } from 'react';
import { X, Send, Copy, Check, Linkedin, Sparkles, UserCheck, Briefcase, ExternalLink, Clock } from 'lucide-react';
import { DESMOND_PROFILE } from '../data/linkedInOpportunities';

export default function PitchGeneratorModal({ opportunity, onClose }) {
  if (!opportunity) return null;

  const [pitchText, setPitchText] = useState(opportunity.customPitch || '');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-modal" style={{
        width: '100%',
        maxWidth: '750px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(0, 242, 254, 0.3)'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: 'linear-gradient(180deg, rgba(0,242,254,0.08) 0%, transparent 100%)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-cyan">💼 {opportunity.platform || 'LinkedIn'} Client Request</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--tiktok-pink)', backgroundColor: 'rgba(255, 0, 80, 0.12)', padding: '2px 8px', borderRadius: '12px' }}>
                {opportunity.urgency || '⚡ ASAP'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} color="var(--tiktok-cyan)" /> {opportunity.postedAgo || 'Recent'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
              Custom Client Proposal for Desmond
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Targeting: <strong>{opportunity.clientName || 'Hiring Manager'}</strong> ({opportunity.clientTitle || 'Client'}) • Budget: <strong style={{ color: '#10b981' }}>{opportunity.budget || '$3,000+'}</strong>
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          
          {/* Direct LinkedIn Post Button Banner */}
          {opportunity.linkedInPostUrl && (
            <div style={{
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              borderRadius: '12px',
              padding: '12px 18px',
              marginBottom: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                🔗 Direct Post Link: <strong>{opportunity.linkedInPostUrl}</strong>
              </span>

              <a 
                href={opportunity.linkedInPostUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#090d16',
                  backgroundColor: 'var(--tiktok-cyan)',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>View Direct Post on LinkedIn</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Client Excerpt Box */}
          <div style={{
            background: 'rgba(9, 13, 22, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              📌 Original Client Post Excerpt:
            </span>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
              "{opportunity.postExcerpt}"
            </p>
          </div>

          {/* Proposal Editor */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--tiktok-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Tailored Pitch Message (Includes Desmond's LinkedIn Profile):
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Edit text as needed</span>
            </div>

            <textarea 
              rows={11}
              value={pitchText}
              onChange={(e) => setPitchText(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'rgba(9, 13, 22, 0.9)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                borderRadius: '14px',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(9, 13, 22, 0.8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a 
            href={DESMOND_PROFILE.linkedInUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ textDecoration: 'none', fontSize: '0.85rem' }}
          >
            <Linkedin size={16} color="var(--tiktok-cyan)" />
            <span>Open Desmond's Profile</span>
          </a>

          <button className="btn-primary" onClick={handleCopy} style={{ padding: '12px 24px' }}>
            {copied ? (
              <>
                <Check size={18} color="#040d1a" strokeWidth={3} />
                <span>Copied Pitch to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy Pitch Proposal</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
