import React from 'react';
import { TrendingUp, MessageSquare, DollarSign, Target, Sparkles } from 'lucide-react';

export default function AnalyticsOverview({ opportunities }) {
  const totalComments = opportunities.reduce((acc, curr) => acc + (curr.commentsAnalyzed || 0), 0);
  const avgDemandScore = opportunities.length 
    ? Math.round(opportunities.reduce((acc, curr) => acc + curr.demandScore, 0) / opportunities.length) 
    : 92;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
      
      {/* Metric 1 */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'rgba(0, 242, 254, 0.1)', 
          border: '1px solid rgba(0, 242, 254, 0.3)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <MessageSquare size={22} color="var(--tiktok-cyan)" />
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
            Comments Mined
          </p>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '2px' }}>
            {totalComments.toLocaleString()}
          </h3>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600' }}>
            ↑ Mined across viral TikTok clips
          </span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'rgba(255, 0, 80, 0.1)', 
          border: '1px solid rgba(255, 0, 80, 0.3)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Target size={22} color="var(--tiktok-pink)" />
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
            Avg Demand Index
          </p>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '2px', color: 'var(--tiktok-pink)' }}>
            {avgDemandScore} / 100
          </h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            High consumer buying intent
          </span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <DollarSign size={22} color="#10b981" />
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
            Est. Monthly Market
          </p>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '2px', color: '#10b981' }}>
            $145K+ Pool
          </h3>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600' }}>
            High profit margin niches
          </span>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'rgba(139, 92, 246, 0.1)', 
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <TrendingUp size={22} color="var(--accent-purple)" />
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>
            Avg Profit Margin
          </p>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '2px', color: 'var(--accent-purple)' }}>
            86.4%
          </h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Low competition gap
          </span>
        </div>
      </div>

    </div>
  );
}
