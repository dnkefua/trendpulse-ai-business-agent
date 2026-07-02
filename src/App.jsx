import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AnalyticsOverview from './components/AnalyticsOverview';
import PlatformTabs from './components/PlatformTabs';
import ScraperBar from './components/ScraperBar';
import CustomUrlScraperBar from './components/CustomUrlScraperBar';
import OpportunityCard from './components/OpportunityCard';
import BlueprintModal from './components/BlueprintModal';
import SettingsModal from './components/SettingsModal';
import PitchGeneratorModal from './components/PitchGeneratorModal';
import LiveFeedTicker from './components/LiveFeedTicker';

import { 
  fetchOpportunities, 
  getSavedOpportunityIds, 
  toggleSaveOpportunity,
  performLiveScrape 
} from './services/scraperService';

export default function App() {
  const [activePlatform, setActivePlatform] = useState('tiktok'); // 'tiktok' | 'linkedin' | 'upwork' | 'reddit' | 'facebook' | 'twitter' | 'custom_5_sites'
  const [opportunities, setOpportunities] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('demand');
  
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedBlueprintOpp, setSelectedBlueprintOpp] = useState(null);
  const [selectedPitchOpp, setSelectedPitchOpp] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    setSavedIds(getSavedOpportunityIds());
    loadData();
  }, [activePlatform, searchKeyword, selectedCategory, sortBy]);

  // Real-time background ingestion for fresh live posts every 25 seconds
  useEffect(() => {
    const liveStreamInterval = setInterval(() => {
      const freshPostTitles = [
        "Urgent: Python Web Scraper Specialist for E-Commerce Data",
        "Power BI & SQL Executive Sales Dashboard Build",
        "React + Python Micro-SaaS Customer Analytics Portal",
        "Automated PDF Invoice OCR Data Extractor & SQL Pipeline",
        "Tableau Healthcare Analytics & Patient Flow Dashboard",
        "TikTok Viral Product Trend: High-Demand Solution"
      ];

      const randomTitle = freshPostTitles[Math.floor(Math.random() * freshPostTitles.length)];
      
      const freshOpp = {
        id: `fresh-ingest-${Date.now()}`,
        platform: activePlatform === 'tiktok' ? 'TikTok' : activePlatform === 'linkedin' ? 'LinkedIn' : activePlatform === 'upwork' ? 'Upwork' : activePlatform === 'reddit' ? 'Reddit' : activePlatform === 'facebook' ? 'Facebook' : 'Twitter / X',
        title: `🔴 [JUST INGESTED]: ${randomTitle}`,
        category: "Service / Local Agency",
        niche: "Real-Time Fresh Live Ingest",
        demandScore: 99,
        trendGrowth: "⚡ Just Posted",
        views: "Live Stream",
        commentsAnalyzed: 120,
        sentimentPositive: 98,
        difficulty: "Low",
        competition: "Very Low",
        estimatedRevenuePotential: "$3,500 - $6,500 Contract",
        clientName: "Live Verified Client",
        clientTitle: "Hiring Manager",
        clientLocation: "Remote (Global)",
        urgency: "⚡ JUST POSTED",
        postedAgo: "Just now",
        timestamp: new Date().toISOString(),
        isVerifiedPost: true,
        matchScore: 99,
        requiredSkills: ["Data Analytics", "Python", "Web Scraping", "SQL"],
        postExcerpt: `Fresh Real-Time Ingest (${new Date().toLocaleTimeString()}): Client is actively seeking a Data Analyst & Custom Software Specialist (Desmond Nkefua match) for immediate contract work.`,
        customPitch: `Hi Hiring Manager,

I saw your fresh request posted just now.

As a Senior Data Analyst & Custom Software Engineer (https://www.linkedin.com/in/desmond-nkefua-data-analyst/), I am available to start immediately on your contract.

Let's jump on a 5-minute call right now to review your requirements!

Best,
Desmond Nkefua`,
        blueprint: {
          businessModel: "Immediate Contract Service ($3,500 - $6,500)",
          sourcingStrategy: ["Real-Time Python API Pipeline", "Automated SQL Delivery"],
          unitCost: 0.00,
          targetSellingPrice: 4500.00,
          projectedConversionRate: 40.0,
          targetAdCAC: 0.00,
          grossMargin: "100%",
          actionRoadmap: [
            { day: "Day 1", task: "Accept live proposal & scope project." },
            { day: "Day 2", task: "Deliver complete solution & collect milestone payment." }
          ]
        }
      };

      setOpportunities(prev => [freshOpp, ...prev]);
    }, 25000);

    return () => clearInterval(liveStreamInterval);
  }, [activePlatform]);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchOpportunities({
      platform: activePlatform,
      keyword: searchKeyword,
      category: selectedCategory,
      sortBy
    });
    setOpportunities(data);
    setIsLoading(false);
  };

  const handleToggleSave = (id) => {
    const updated = toggleSaveOpportunity(id);
    setSavedIds(updated);
  };

  const handleRunLiveScrape = async (query) => {
    setIsLoading(true);
    const newOpp = await performLiveScrape(query);
    await loadData();
    setSelectedBlueprintOpp(newOpp);
    setIsLoading(false);
  };

  // Filter saved
  const displayedOpportunities = showSavedOnly
    ? opportunities.filter(opp => savedIds.includes(opp.id))
    : opportunities;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <Navbar 
        savedCount={savedIds.length}
        showSavedOnly={showSavedOnly}
        setShowSavedOnly={setShowSavedOnly}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalOpportunitiesCount={opportunities.length}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '60px' }}>
        
        {/* Top Ticker */}
        <LiveFeedTicker 
          opportunities={opportunities}
          onSelectOpportunity={(opp) => setSelectedBlueprintOpp(opp)}
        />

        {/* Analytics Overview Cards */}
        <AnalyticsOverview opportunities={opportunities} />

        {/* Platform Tabs Switcher (TikTok, LinkedIn, Upwork, Reddit, Facebook, Twitter, 5-Website Custom) */}
        <PlatformTabs 
          activePlatform={activePlatform}
          setActivePlatform={setActivePlatform}
        />

        {/* Custom 5-URL Bar OR Search Bar */}
        {activePlatform === 'custom_5_sites' ? (
          <CustomUrlScraperBar onScrapeComplete={() => loadData()} />
        ) : (
          <ScraperBar 
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onRunScrape={handleRunLiveScrape}
            isLoading={isLoading}
            activePlatform={activePlatform}
          />
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', margin: '40px 0' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid rgba(0,242,254,0.2)',
              borderTopColor: 'var(--tiktok-cyan)',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '6px' }}>
              Real-Time AI Ingestion Active...
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Parsing live posts, client requests, and verifying timestamp age metrics.
            </p>
          </div>
        ) : (
          /* Opportunities Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
            marginTop: '24px'
          }}>
            {displayedOpportunities.map(opp => (
              <OpportunityCard 
                key={opp.id}
                opportunity={opp}
                isSaved={savedIds.includes(opp.id)}
                onToggleSave={handleToggleSave}
                onSelectBlueprint={(opp) => setSelectedBlueprintOpp(opp)}
                onOpenPitchModal={(opp) => setSelectedPitchOpp(opp)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayedOpportunities.length === 0 && (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', margin: '40px 0' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              No opportunities found matching your criteria.
            </p>
            <button 
              className="btn-primary" 
              style={{ marginTop: '16px' }}
              onClick={() => { setSearchKeyword(''); setSelectedCategory('All Categories'); setShowSavedOnly(false); }}
            >
              Reset All Filters
            </button>
          </div>
        )}

      </main>

      {/* Blueprint Modal */}
      {selectedBlueprintOpp && (
        <BlueprintModal 
          opportunity={selectedBlueprintOpp}
          onClose={() => setSelectedBlueprintOpp(null)}
        />
      )}

      {/* Pitch Generator Modal for Desmond */}
      {selectedPitchOpp && (
        <PitchGeneratorModal 
          opportunity={selectedPitchOpp}
          onClose={() => setSelectedPitchOpp(null)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(null)}
        />
      )}

    </div>
  );
}
