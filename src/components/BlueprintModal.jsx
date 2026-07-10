import React, { useState } from 'react';
import { 
  X, CheckCircle, Copy, Download, DollarSign, Video, Calendar, 
  Layers, ExternalLink, Sparkles, Sliders, ArrowUpRight, Check, Play 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import confetti from 'canvas-confetti';

export default function BlueprintModal({ opportunity, onClose }) {
  if (!opportunity) return null;

  const [activeTab, setActiveTab] = useState('strategy'); // strategy | calculator | marketing | roadmap
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Financial Calculator State
  const bp = opportunity.blueprint || {};
  const [sellingPrice, setSellingPrice] = useState(bp.targetSellingPrice || 29.99);
  const [unitCost, setUnitCost] = useState(bp.unitCost || 4.50);
  const [adCac, setAdCac] = useState(bp.targetAdCAC || 8.50);
  const [monthlyVolume, setMonthlyVolume] = useState(500); // 500 orders or subscribers per month

  // Overhead Cost State
  const [customCosts, setCustomCosts] = useState([
    { id: '1', name: 'Software Licenses', amount: 49 },
    { id: '2', name: 'Server / API Fees', amount: 99 }
  ]);
  const [newCostName, setNewCostName] = useState('');
  const [newCostAmount, setNewCostAmount] = useState('');

  // Checklist State
  const [completedDays, setCompletedDays] = useState({});

  // Calculations
  const grossProfitPerUnit = Math.max(0, sellingPrice - unitCost);
  const netProfitPerUnit = Math.max(0, sellingPrice - unitCost - adCac);
  const monthlyRevenue = sellingPrice * monthlyVolume;
  
  // Total fixed custom costs
  const totalCustomCosts = customCosts.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  
  const monthlyExpenses = ((unitCost + adCac) * monthlyVolume) + totalCustomCosts;
  const monthlyNetProfit = Math.max(0, (netProfitPerUnit * monthlyVolume) - totalCustomCosts);
  const marginPercent = monthlyRevenue > 0 ? Math.round((monthlyNetProfit / monthlyRevenue) * 100) : 0;

  const chartData = [
    { name: 'Monthly Revenue', amount: Math.round(monthlyRevenue) },
    { name: 'Ad & COGS Expenses', amount: Math.round(monthlyExpenses) },
    { name: 'Net Profit', amount: Math.round(monthlyNetProfit) }
  ];

  const handleAddCost = () => {
    if (!newCostName.trim() || isNaN(parseFloat(newCostAmount))) return;
    const newCost = {
      id: Date.now().toString(),
      name: newCostName.trim(),
      amount: parseFloat(newCostAmount)
    };
    setCustomCosts([...customCosts, newCost]);
    setNewCostName('');
    setNewCostAmount('');
  };

  const handleDeleteCost = (id) => {
    setCustomCosts(customCosts.filter(c => c.id !== id));
  };

  const handleCopyScript = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleTask = (day) => {
    const updated = { ...completedDays, [day]: !completedDays[day] };
    setCompletedDays(updated);

    // Check if all roadmap items completed
    const totalTasks = bp.actionRoadmap ? bp.actionRoadmap.length : 0;
    const completedCount = Object.values(updated).filter(Boolean).length;
    
    if (totalTasks > 0 && completedCount === totalTasks) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleExportMarkdown = () => {
    const mdContent = `# Business Solution Blueprint: ${opportunity.title}

Category: ${opportunity.category}
Demand Score: ${opportunity.demandScore}/100
Niche: ${opportunity.niche}
Estimated Market Potential: ${opportunity.estimatedRevenuePotential}

---

## 1. Executive Strategy & Business Model
${bp.businessModel}

### Sourcing & Operations Pipeline:
${(bp.sourcingStrategy || []).map(s => `- ${s}`).join('\n')}

---

## 2. Financial Projections
- Target Selling Price: $${sellingPrice}
- Unit Cost: $${unitCost}
- Target Customer Acquisition Cost (CAC): $${adCac}
- Monthly Volume Target: ${monthlyVolume} units/subscribers
- Projected Monthly Revenue: $${monthlyRevenue.toLocaleString()}
- Projected Monthly Net Profit: $${monthlyNetProfit.toLocaleString()} (Margin: ${marginPercent}%)

---

## 3. TikTok Viral Script Hooks
${(bp.viralHooks || []).map((h, i) => `### Hook ${i+1}: ${h.hookTitle}
Script: "${h.text}"
Visual Cue: ${h.visual}
`).join('\n\n')}

---

## 4. 7-Day Execution Roadmap
${(bp.actionRoadmap || []).map(r => `- [ ] ${r.day}: ${r.task}`).join('\n')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${opportunity.title.toLowerCase().replace(/\s+/g, '-')}-blueprint.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const roadmapTasks = bp.actionRoadmap || [];
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const progressPercent = roadmapTasks.length > 0 ? Math.round((completedCount / roadmapTasks.length) * 100) : 0;

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
        maxWidth: '1000px',
        maxHeight: '90vh',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(0, 242, 254, 0.2)'
      }}>

        {/* Modal Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: 'linear-gradient(180deg, rgba(0,242,254,0.06) 0%, transparent 100%)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-cyan">{opportunity.category}</span>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 10px', borderRadius: '12px' }}>
                Demand Index: {opportunity.demandScore}/100
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
              {opportunity.title} Blueprint
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Complete Execution & Profit Strategy based on TikTok Comment Intelligence
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

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(9, 13, 22, 0.6)',
          padding: '0 32px'
        }}>
          <button 
            onClick={() => setActiveTab('strategy')}
            style={{
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'strategy' ? '2px solid var(--tiktok-cyan)' : '2px solid transparent',
              color: activeTab === 'strategy' ? 'var(--tiktok-cyan)' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Layers size={16} /> Strategy & Sourcing
          </button>

          <button 
            onClick={() => setActiveTab('calculator')}
            style={{
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'calculator' ? '2px solid var(--tiktok-pink)' : '2px solid transparent',
              color: activeTab === 'calculator' ? 'var(--tiktok-pink)' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <DollarSign size={16} /> Profit Calculator
          </button>

          <button 
            onClick={() => setActiveTab('marketing')}
            style={{
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'marketing' ? '2px solid var(--accent-purple)' : '2px solid transparent',
              color: activeTab === 'marketing' ? 'var(--accent-purple)' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Video size={16} /> TikTok Script Playbook
          </button>

          <button 
            onClick={() => setActiveTab('roadmap')}
            style={{
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'roadmap' ? '2px solid #10b981' : '2px solid transparent',
              color: activeTab === 'roadmap' ? '#10b981' : 'var(--text-secondary)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Calendar size={16} /> 7-Day Launch Checklist ({completedCount}/{roadmapTasks.length})
          </button>
        </div>

        {/* Tab Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

          {/* TAB 1: STRATEGY & SOURCING */}
          {activeTab === 'strategy' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', color: '#fff' }}>
                  🎯 Value Proposition & Solution Blueprint
                </h3>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px' }}>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '14px' }}>
                    <strong>Core Business Model:</strong> {bp.businessModel}
                  </p>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                    <strong>Customer Pain Point Solved:</strong> {opportunity.painPointSummary}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', color: '#fff' }}>
                  🛠️ Step-by-Step Sourcing & Vendor Pipeline
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(bp.sourcingStrategy || []).map((step, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(0, 242, 254, 0.04)',
                      border: '1px solid rgba(0, 242, 254, 0.15)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--tiktok-cyan)',
                        color: '#090d16',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Comment Evidence */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', color: '#fff' }}>
                  💬 Verified TikTok Customer Comments Mined
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {opportunity.topComments.map((c, i) => (
                    <div key={i} style={{
                      background: 'rgba(9, 13, 22, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '14px'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--tiktok-cyan)' }}>{c.user}</span>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '6px 0' }}>"{c.text}"</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--tiktok-pink)', fontWeight: '600' }}>❤️ {c.likes} likes</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFIT CALCULATOR */}
          {activeTab === 'calculator' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '28px' }}>
                
                {/* Sliders Control Box */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={18} color="var(--tiktok-pink)" /> Financial Parameters
                  </h3>

                  {/* Selling Price */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target Selling Price ($)</label>
                      <strong style={{ color: 'var(--tiktok-cyan)' }}>${sellingPrice}</strong>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="200" 
                      step="0.5"
                      value={sellingPrice} 
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--tiktok-cyan)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Unit Cost */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Unit Sourcing / Server Cost ($)</label>
                      <strong style={{ color: 'var(--tiktok-pink)' }}>${unitCost}</strong>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="50" 
                      step="0.1"
                      value={unitCost} 
                      onChange={(e) => setUnitCost(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--tiktok-pink)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Ad CAC */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target TikTok Ad CAC ($)</label>
                      <strong style={{ color: 'var(--accent-purple)' }}>${adCac}</strong>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="40" 
                      step="0.5"
                      value={adCac} 
                      onChange={(e) => setAdCac(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Monthly Volume */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monthly Sales Volume (Units / Subscriptions)</label>
                      <strong style={{ color: '#10b981' }}>{monthlyVolume} units/mo</strong>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="5000" 
                      step="50"
                      value={monthlyVolume} 
                      onChange={(e) => setMonthlyVolume(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                    />
                  </div>
                         {/* Live Output KPI Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>
                      Projected Monthly Net Profit
                    </span>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                      ${Math.round(monthlyNetProfit).toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ mo</span>
                    </h2>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Net Margin: <strong>{marginPercent}%</strong> | Overhead: <strong>${totalCustomCosts}/mo</strong>
                    </p>
                  </div>

                  <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--tiktok-cyan)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>
                      Annual Profit Potential
                    </span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--tiktok-cyan)', marginTop: '4px' }}>
                      ${Math.round(monthlyNetProfit * 12).toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ yr</span>
                    </h3>
                  </div>

                  <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--tiktok-pink)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>
                      Gross Revenue vs Expenses
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.9rem' }}>
                      <span>Revenue: <strong style={{ color: '#fff' }}>${Math.round(monthlyRevenue).toLocaleString()}</strong></span>
                      <span>Total Costs: <strong style={{ color: 'var(--tiktok-pink)' }}>${Math.round(monthlyExpenses).toLocaleString()}</strong></span>
                    </div>
                  </div>

                  {/* Fixed Monthly Expenses Overhead Editor */}
                  <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-purple)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', display: 'block', marginBottom: '12px' }}>
                      Fixed Monthly Expenses (Overhead)
                    </span>
                    
                    {/* Cost Lines List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', maxHeight: '100px', overflowY: 'auto' }}>
                      {customCosts.map(cost => (
                        <div key={cost.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <span style={{ fontSize: '0.82rem', color: '#fff' }}>{cost.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.82rem', color: 'var(--tiktok-pink)', fontWeight: '700' }}>${cost.amount}</span>
                            <button 
                              onClick={() => handleDeleteCost(cost.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                      {customCosts.length === 0 && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No overhead expenses added.</span>
                      )}
                    </div>

                    {/* Add Cost Form */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Cost Name (e.g. Server API)"
                        value={newCostName}
                        onChange={(e) => setNewCostName(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          backgroundColor: 'rgba(9, 13, 22, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '0.8rem',
                          outline: 'none'
                        }}
                      />
                      <input 
                        type="number" 
                        placeholder="$"
                        value={newCostAmount}
                        onChange={(e) => setNewCostAmount(e.target.value)}
                        style={{
                          width: '60px',
                          padding: '6px 10px',
                          backgroundColor: 'rgba(9, 13, 22, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '0.8rem',
                          outline: 'none'
                        }}
                      />
                      <button 
                        onClick={handleAddCost}
                        style={{
                          backgroundColor: 'var(--tiktok-cyan)',
                          border: 'none',
                          color: '#090d16',
                          fontWeight: '700',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>         </div>

              </div>

              {/* Chart Visualizer */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', color: '#fff' }}>
                  📊 Projected Monthly Revenue & Profit Breakdown
                </h4>
                <div style={{ width: '100%', height: '240px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" tickFormatter={(val) => `$${val}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        formatter={(val) => [`$${val.toLocaleString()}`, 'Amount']}
                      />
                      <Bar dataKey="amount" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00f2fe" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#ff0050" stopOpacity={0.7}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIKTOK SCRIPT PLAYBOOK */}
          {activeTab === 'marketing' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px', color: '#fff' }}>
                  🎬 Viral TikTok Video Scripts & Hooks
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Designed specifically to convert high-intent TikTok commenters into immediate buyers.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {(bp.viralHooks || []).map((hook, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="badge badge-purple">Hook #{idx + 1}: {hook.hookTitle}</span>
                      
                      <button 
                        className="btn-secondary"
                        onClick={() => handleCopyScript(`${hook.hookTitle}\nScript: ${hook.text}\nVisual: ${hook.visual}`, idx)}
                        style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check size={14} color="#10b981" />
                            <span style={{ color: '#10b981' }}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div style={{ background: 'rgba(9, 13, 22, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--tiktok-cyan)', textTransform: 'uppercase' }}>
                        🗣️ Spoken Audio Script:
                      </span>
                      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff', marginTop: '6px', lineHeight: 1.5 }}>
                        "{hook.text}"
                      </p>
                    </div>

                    <div style={{ background: 'rgba(139, 92, 246, 0.06)', borderLeft: '3px solid var(--accent-purple)', padding: '12px 16px', borderRadius: '0 10px 10px 0' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-purple)' }}>
                        🎥 Visual Direction & On-Screen Caption:
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                        {hook.visual}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 7-DAY LAUNCH ROADMAP */}
          {activeTab === 'roadmap' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
                    🚀 7-Day Execution Launch Checklist
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Check off tasks as you complete your business setup.
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#10b981' }}>{progressPercent}% Complete</span>
                  <div style={{ width: '160px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {roadmapTasks.map((item, idx) => {
                  const isDone = !!completedDays[item.day];
                  return (
                    <div 
                      key={idx} 
                      onClick={() => toggleTask(item.day)}
                      style={{
                        background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid',
                        borderColor: isDone ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          border: '2px solid',
                          borderColor: isDone ? '#10b981' : 'var(--text-muted)',
                          backgroundColor: isDone ? '#10b981' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}>
                          {isDone && <Check size={16} color="#090d16" strokeWidth={3} />}
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: isDone ? '#10b981' : 'var(--tiktok-cyan)', textTransform: 'uppercase' }}>
                            {item.day}
                          </span>
                          <p style={{ fontSize: '0.9rem', color: isDone ? 'var(--text-muted)' : '#fff', textDecoration: isDone ? 'line-through' : 'none', marginTop: '2px' }}>
                            {item.task}
                          </p>
                        </div>
                      </div>

                      <span style={{ fontSize: '0.75rem', color: isDone ? '#10b981' : 'var(--text-muted)', fontWeight: '600' }}>
                        {isDone ? 'Completed ✓' : 'Click to complete'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(9, 13, 22, 0.8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button className="btn-secondary" onClick={handleExportMarkdown}>
            <Download size={16} />
            <span>Export Full Business Plan (.MD)</span>
          </button>

          <button className="btn-primary" onClick={onClose}>
            <span>Close Blueprint</span>
          </button>
        </div>

      </div>
    </div>
  );
}
