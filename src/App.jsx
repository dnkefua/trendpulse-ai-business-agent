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
import GoogleTrendsWidget from './components/GoogleTrendsWidget';

import {
  fetchOpportunities,
  getSavedOpportunityIds,
  toggleSaveOpportunity,
  performLiveScrape,
  scrapeFiveWebsites,
  syncCustomLeadsOnStartup
} from './services/scraperService';
import {
  syncSavedOpportunitiesToFirebase,
  fetchSavedOpportunitiesFromFirebase
} from './services/firebase';

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New recommendation states
  const [minBudget, setMinBudget] = useState(0);
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [syncStatus, setSyncStatus] = useState('synced'); // 'syncing' | 'synced' | 'error'

  // Initial Load with Firebase Sync
  useEffect(() => {
    const initSync = async () => {
      // 1. Instant load from local storage
      const localSaved = getSavedOpportunityIds();
      setSavedIds(localSaved);

      // 2. Fetch and sync saved opportunities from Firebase in background
      try {
        const fbSaved = await fetchSavedOpportunitiesFromFirebase();
        if (fbSaved && fbSaved.length > 0) {
          const merged = Array.from(new Set([...localSaved, ...fbSaved]));
          setSavedIds(merged);
          localStorage.setItem('trendpulse_saved_opps', JSON.stringify(merged));
        }
      } catch (err) {
        console.warn('Firebase saved list sync failed:', err);
      }

      // 3. Fetch custom scraped opportunities from Firebase in background
      try {
        const fbCustom = await syncCustomLeadsOnStartup();
        if (fbCustom) {
          if (activePlatform === 'custom_5_sites') {
            loadData();
          }
        }
      } catch (err) {
        console.warn('Firebase custom leads sync failed:', err);
      }
    };

    initSync();
    loadData();
  }, [activePlatform, searchKeyword, selectedCategory, sortBy, minBudget, urgencyFilter]);

  // Periodically re-pull REAL leads from the backend for the live platforms so
  // newly-posted opportunities surface without a manual refresh. No fabricated
  // posts — this simply re-runs the same real query on an interval.
  useEffect(() => {
    const isLivePlatform = activePlatform === 'upwork' || activePlatform === 'reddit';
    if (!isLivePlatform) return undefined;

    const refreshInterval = setInterval(() => {
      loadData();
    }, 90000);

    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlatform, searchKeyword, selectedCategory, sortBy, minBudget, urgencyFilter]);

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchOpportunities({
      platform: activePlatform,
      keyword: searchKeyword,
      category: selectedCategory,
      sortBy,
      minBudget,
      urgencyFilter
    });
    setOpportunities(data);
    setIsLoading(false);
  };

  const handleToggleSave = async (id) => {
    const updated = toggleSaveOpportunity(id);
    setSavedIds(updated);
    // Background Firebase Sync
    setSyncStatus('syncing');
    try {
      await syncSavedOpportunitiesToFirebase(updated);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  };

  const handleRunLiveScrape = async (query) => {
    setIsLoading(true);
    setSyncStatus('syncing');
    try {
      const newOpp = await performLiveScrape(query);
      await loadData();
      setSelectedBlueprintOpp(newOpp);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
    setIsLoading(false);
  };

  const handleRunFiveSiteScrape = async (urls) => {
    setIsLoading(true);
    setSyncStatus('syncing');
    try {
      await scrapeFiveWebsites(urls);
      await loadData();
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSyncStatus('syncing');
    // Simulate scraper request latency
    await new Promise(resolve => setTimeout(resolve, 1200));
    await loadData();
    setSyncStatus('synced');
    setIsRefreshing(false);
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
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        syncStatus={syncStatus}
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

        {/* Custom 5-URL Bar OR Google Trends OR Search Bar */}
        {activePlatform === 'custom_5_sites' ? (
          <CustomUrlScraperBar 
            onRunFiveSiteScrape={handleRunFiveSiteScrape} 
            isScraping={isLoading} 
          />
        ) : activePlatform === 'google_trends' ? (
          <GoogleTrendsWidget onOpenPitchModal={(opp) => setSelectedPitchOpp(opp)} />
        ) : (
          <ScraperBar 
            searchQuery={searchKeyword}
            setSearchQuery={setSearchKeyword}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onRunScrape={handleRunLiveScrape}
            isScraping={isLoading}
            activePlatform={activePlatform}
            minBudget={minBudget}
            setMinBudget={setMinBudget}
            urgencyFilter={urgencyFilter}
            setUrgencyFilter={setUrgencyFilter}
          />
        )}

        {/* Loading Spinner */}
        {activePlatform !== 'google_trends' && isLoading && (
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
        )}

        {/* Opportunities Grid */}
        {activePlatform !== 'google_trends' && !isLoading && (
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
        {activePlatform !== 'google_trends' && !isLoading && displayedOpportunities.length === 0 && (
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
