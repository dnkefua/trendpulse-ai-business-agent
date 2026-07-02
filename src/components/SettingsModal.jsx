import React, { useState } from 'react';
import { X, Key, Cpu, Check, ShieldCheck, Info } from 'lucide-react';
import { getApiSettings, saveApiSettings } from '../services/scraperService';

export default function SettingsModal({ onClose }) {
  const currentSettings = getApiSettings();
  const [provider, setProvider] = useState(currentSettings.provider || 'simulated');
  const [apiKey, setApiKey] = useState(currentSettings.apiKey || '');
  const [apifyKey, setApifyKey] = useState(currentSettings.apifyKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    saveApiSettings({ provider, apiKey, apifyKey });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
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
        maxWidth: '560px',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid rgba(0, 242, 254, 0.2)'
      }}>
        
        {/* Modal Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={22} color="var(--tiktok-cyan)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
              Scraper & AI Engine Settings
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div style={{ 
          background: 'rgba(0, 242, 254, 0.06)', 
          border: '1px solid rgba(0, 242, 254, 0.2)', 
          borderRadius: '12px', 
          padding: '12px 16px', 
          marginBottom: '24px',
          display: 'flex',
          gap: '10px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.4
        }}>
          <Info size={18} color="var(--tiktok-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            By default, TrendPulse AI uses the <strong>Built-in Trend Intelligence Scraper</strong>. You can optionally connect custom OpenAI, Gemini, or Apify keys for live scraping.
          </span>
        </div>

        {/* Provider Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            AI Mining Provider Mode
          </label>
          <select 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'rgba(9, 13, 22, 0.8)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '0.9rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="simulated">Built-in AI Scraper & Real-time Synthesizer (Recommended)</option>
            <option value="gemini">Google Gemini AI API</option>
            <option value="openai">OpenAI GPT-4o API</option>
            <option value="apify">Apify TikTok Scraper API</option>
          </select>
        </div>

        {/* Custom API Key Input */}
        {provider !== 'simulated' && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              {provider.toUpperCase()} API Key
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password"
                placeholder={`Enter your ${provider} API Key...`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  backgroundColor: 'rgba(9, 13, 22, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={handleSave}>
            {savedSuccess ? (
              <>
                <Check size={16} color="#040d1a" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
