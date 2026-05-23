import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import DashboardSidebar from './components/DashboardSidebar';
import AnalyticsOverview from './components/AnalyticsOverview';
import AIGenerator from './components/AIGenerator';
import SpecializedGenerators from './components/SpecializedGenerators';
import WorkflowAutomation from './components/WorkflowAutomation';
import UserProfile from './components/UserProfile';
import HistoryProjects from './components/HistoryProjects';
import SubscriptionPlans from './components/SubscriptionPlans';
import SettingsView from './components/SettingsView';
import OnboardingFlow from './components/OnboardingFlow';
import ToastContainer from './components/ToastContainer';
import AICommandCenter from './components/AICommandCenter';
import VideoCreatorSuite from './components/VideoCreatorSuite';
import SocialPublishingHub from './components/SocialPublishingHub';
import WhatsAppBusinessHub from './components/WhatsAppBusinessHub';
import MonetizationStore from './components/MonetizationStore';
import GrowthAnalyticsDeepdive from './components/GrowthAnalyticsDeepdive';
import { User, HistoryItem, ToastMessage } from './types';
import { 
  Sparkles, 
  Loader2, 
  BarChart3, 
  Sliders, 
  Zap, 
  User as UserIcon, 
  Layers, 
  Settings, 
  CreditCard 
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [booting, setBooting] = useState(true);

  // Global toasts notification stack
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark/Light Theme Switcher State
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('creatoros_theme');
    if (saved) return saved === 'dark';
    return true; // Soft premium visual dark preset default
  });

  // Core metrics and history states
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('creatoros_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse cached history:", err);
      }
    }
    return [];
  });
  const [userPlan, setUserPlan] = useState<string>('Free Sandbox');

  // Sync draft history state to localStorage for offline robustness
  useEffect(() => {
    localStorage.setItem('creatoros_history', JSON.stringify(history));
  }, [history]);

  // Trigger global toast
  const addToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync isDark with document element classes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('creatoros_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Boot process: check pre-existing tokens
  useEffect(() => {
    const savedToken = localStorage.getItem('creatoros_token');
    const savedUser = localStorage.getItem('creatoros_user');
    const savedPlan = localStorage.getItem('creatoros_plan');

    if (savedPlan) {
      setUserPlan(savedPlan);
    }

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        // Load histories for that user
        fetchHistory(savedToken, parsedUser.id);
      } catch (err) {
        console.error("Stale login cached. Wiping context.");
        localStorage.removeItem('creatoros_token');
        localStorage.removeItem('creatoros_user');
      }
    }
    setBooting(false);
  }, []);

  const fetchHistory = async (sessionToken: string, userId: string) => {
    try {
      const res = await fetch('/api/history', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("Failed to recover drafting history:", err);
    }
  };

  const handleLoginSuccess = (loggedInUser: User, sessionToken: string) => {
    // Inject custom default credit values to avoid visual tracker gaps
    const initializedUser: User = {
      ...loggedInUser,
      creditsUsed: loggedInUser.creditsUsed ?? 14200,
      creditsLimit: loggedInUser.creditsLimit ?? 50000,
      isOnboarded: loggedInUser.isOnboarded ?? false
    };

    setUser(initializedUser);
    setToken(sessionToken);
    setShowAuthModal(false);
    
    localStorage.setItem('creatoros_token', sessionToken);
    localStorage.setItem('creatoros_user', JSON.stringify(initializedUser));
    
    // Load fresh history logs
    fetchHistory(sessionToken, initializedUser.id);
    addToast("Login Authorized. Welcome to CreatorOS!", "success");
  };

  const handleLogOut = () => {
    setUser(null);
    setToken(null);
    setHistory([]);
    setCurrentTab('overview');
    
    localStorage.removeItem('creatoros_token');
    localStorage.removeItem('creatoros_user');
    addToast("Session closed successfully. See you soon!", "info");
  };

  const handleUpgradePlan = (planName: string) => {
    setUserPlan(planName);
    localStorage.setItem('creatoros_plan', planName);
    
    // Simulate updating credit tier limits as a premium gamified feel
    if (user) {
      const isUnlimited = planName.toLowerCase().includes('unlimited') || planName.toLowerCase().includes('pro');
      const updatedUser = { 
        ...user, 
        creditsLimit: isUnlimited ? 250000 : 50000 
      };
      setUser(updatedUser);
      localStorage.setItem('creatoros_user', JSON.stringify(updatedUser));
    }
    addToast(`Tier updated to ${planName}. Limits refreshed!`, "success");
  };

  const handleGenerationComplete = (newItem: HistoryItem) => {
    setHistory(prev => [newItem, ...prev]);
    
    // Simulate deducting credits per AI generator iteration
    if (user) {
      const updatedUser = {
        ...user,
        creditsUsed: Math.min(user.creditsLimit, user.creditsUsed + 450)
      };
      setUser(updatedUser);
      localStorage.setItem('creatoros_user', JSON.stringify(updatedUser));
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    addToast("Draft deleted fully.", "warning");
  };

  const handleUpdateHistoryItem = (id: string, updatedText: string) => {
    setHistory(prev => prev.map(h => {
      if (h.id === id) {
        return { ...h, result: updatedText, createdAt: new Date().toISOString() };
      }
      return h;
    }));
    addToast("Draft edits cached successfully.", "success");
  };

  const handleOnboardingComplete = (prefs: { niche: string; platforms: string[]; defaultTone: string }) => {
    if (user) {
      const updatedUser = {
        ...user,
        isOnboarded: true
      };
      setUser(updatedUser);
      
      // Save preferences into localStorage for reference
      localStorage.setItem('creatoros_niche', prefs.niche);
      localStorage.setItem('creatoros_tone', prefs.defaultTone);
      localStorage.setItem('creatoros_user', JSON.stringify(updatedUser));
      addToast("Aesthetic onboarding completed! Premium workspace parameters activated.", "success");
    }
  };

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  if (booting) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f7f6f2] dark:bg-zinc-950 gap-4">
        <Loader2 className="h-8 w-8 text-[#1a1917] dark:text-amber-300 animate-spin" />
        <span className="font-display font-bold text-lg text-[#1a1917] dark:text-white animate-pulse">Launching secure full-stack environment...</span>
      </div>
    );
  }

  // Render dashboard layout when user is authenticated
  if (user) {
    const showOnboardingOverlay = !user.isOnboarded;

    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-[#f7f6f2] dark:bg-[#111110] text-[#1a1917] dark:text-[#f7f6f2] overflow-hidden" id="dashboard-hud-view">
        
        {/* Dynamic Nav Sidebar component */}
        <DashboardSidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          user={user}
          onLogOut={handleLogOut}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
        />

        {/* Dynamic Display workspace panels */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 h-screen pb-24 md:pb-8" id="dashboard-main-pane">
          {currentTab === 'overview' && (
            <AnalyticsOverview
              history={history}
              onNavigateToGen={() => setCurrentTab('ai-generator')}
              onNavigateToSettings={() => setCurrentTab('settings')}
              userPlan={userPlan}
              user={user}
            />
          )}

          {currentTab === 'ai-command-center' && (
            <AICommandCenter
              token={token}
              onGenerationComplete={handleGenerationComplete}
              onShowToast={addToast}
            />
          )}

          {currentTab === 'video-creator-suite' && (
            <VideoCreatorSuite
              onShowToast={addToast}
            />
          )}

          {currentTab === 'social-publishing-queues' && (
            <SocialPublishingHub
              onShowToast={addToast}
            />
          )}

          {currentTab === 'whatsapp-business-hub' && (
            <WhatsAppBusinessHub
              onShowToast={addToast}
            />
          )}

          {currentTab === 'monetization-digital-store' && (
            <MonetizationStore
              onShowToast={addToast}
            />
          )}

          {currentTab === 'growth-analytics-deepdive' && (
            <GrowthAnalyticsDeepdive
              onShowToast={addToast}
            />
          )}

          {currentTab === 'ai-generator' && (
            <AIGenerator
              token={token}
              onGenerationComplete={handleGenerationComplete}
              onNavigateToHistory={() => setCurrentTab('projects')}
            />
          )}

          {currentTab === 'ai-specialized-generators' && (
            <SpecializedGenerators
              token={token}
              onGenerationComplete={handleGenerationComplete}
              onShowToast={addToast}
            />
          )}

          {currentTab === 'ai-workflow-automation' && (
            <WorkflowAutomation
              onShowToast={addToast}
            />
          )}

          {currentTab === 'projects' && (
            <HistoryProjects
              token={token}
              history={history}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onUpdateHistoryItem={handleUpdateHistoryItem}
              onNavigateToGen={() => setCurrentTab('ai-generator')}
            />
          )}

          {currentTab === 'profile' && (
            <UserProfile
              user={user}
              userPlan={userPlan}
              onUpdateUser={(updatedFields) => {
                const updatedUser = { ...user, ...updatedFields };
                setUser(updatedUser);
                localStorage.setItem('creatoros_user', JSON.stringify(updatedUser));
              }}
              onShowToast={addToast}
            />
          )}

          {currentTab === 'pricing' && (
            <SubscriptionPlans
              currentPlan={userPlan}
              onUpgradePlan={handleUpgradePlan}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              user={user}
              userPlan={userPlan}
            />
          )}
        </main>

        {/* Mobile Bottom Tactile Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#151413] border-t border-[#e2dfd9] dark:border-[#2a2928] py-2.5 px-3 flex items-center justify-around z-40 shadow-2xl" id="mobile-bottom-bar">
          <button 
            onClick={() => setCurrentTab('overview')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'overview' ? 'text-amber-500 font-bold dark:text-amber-300' : 'text-[#a19c91] hover:text-[#1a1917]'}`}
          >
            <BarChart3 className="h-4.5 w-4.5" />
            <span className="text-[9px] font-semibold">Stats</span>
          </button>
          <button 
            onClick={() => setCurrentTab('ai-generator')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'ai-generator' ? 'text-amber-500 font-bold dark:text-amber-300' : 'text-[#a19c91] hover:text-[#1a1917]'}`}
          >
            <Sparkles className="h-4.5 w-4.5" />
            <span className="text-[9px] font-semibold">Generator</span>
          </button>
          <button 
            onClick={() => setCurrentTab('ai-specialized-generators')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'ai-specialized-generators' ? 'text-amber-500 font-bold dark:text-amber-300' : 'text-[#a19c91] hover:text-[#1a1917]'}`}
          >
            <Sliders className="h-4.5 w-4.5" />
            <span className="text-[9px] font-semibold">Formats</span>
          </button>
          <button 
            onClick={() => setCurrentTab('ai-workflow-automation')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'ai-workflow-automation' ? 'text-amber-500 font-bold dark:text-amber-300' : 'text-[#a19c91] hover:text-[#1a1917]'}`}
          >
            <Zap className="h-4.5 w-4.5" />
            <span className="text-[9px] font-semibold">Automations</span>
          </button>
          <button 
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center gap-1 p-1 transition-colors ${currentTab === 'profile' ? 'text-amber-500 font-bold dark:text-amber-300' : 'text-[#a19c91] hover:text-[#1a1917]'}`}
          >
            <UserIcon className="h-4.5 w-4.5" />
            <span className="text-[9px] font-semibold">Profile</span>
          </button>
        </div>

        {/* Gamified Onboarding workflow popup frame */}
        {showOnboardingOverlay && (
          <div className="fixed inset-0 z-50 bg-[#1a1917]/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
              <OnboardingFlow 
                userName={user.name || 'SaaS Creator'} 
                onOnboardingComplete={handleOnboardingComplete} 
              />
            </div>
          </div>
        )}

        {/* Global Floating Toasts notification element */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  // Render marketing Landing page otherwise
  return (
    <div id="unauthenticated-app-canvas" className={isDark ? 'dark bg-zinc-950 min-h-screen' : 'bg-[#f7f6f2] min-h-screen'}>
      <LandingPage
        onGetStarted={() => setShowAuthModal(true)}
        onViewPricing={() => {
          setShowAuthModal(true);
        }}
        onExploreDemo={() => setShowAuthModal(true)}
      />

      {/* Auth SignUp / SignIn Popup Modal */}
      {showAuthModal && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowAuthModal(false)}
          isClosable={true}
        />
      )}

      {/* Global Floating Toasts on Landing page */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
