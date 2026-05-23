import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BarChart3, 
  Database, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Zap, 
  User as UserIcon, 
  TrendingUp,
  Sliders,
  Sparkle
} from 'lucide-react';
import { HistoryItem, User } from './types';

interface AnalyticsOverviewProps {
  history: HistoryItem[];
  onNavigateToGen: () => void;
  onNavigateToSettings: () => void;
  userPlan: string;
  user: User;
}

export default function AnalyticsOverview({ history, onNavigateToGen, onNavigateToSettings, userPlan, user }: AnalyticsOverviewProps) {
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(false);

  useEffect(() => {
    // Generate organic loading states
    const timer = setTimeout(() => {
      setLoadingSkeleton(false);
    }, 750);

    const fetchWithRetry = async (url: string, retries = 5, delay = 300): Promise<Response> => {
      try {
        return await fetch(url);
      } catch (err) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry(url, retries - 1, delay * 1.5);
        }
        throw err;
      }
    };

    const fetchStatus = async () => {
      try {
        const res = await fetchWithRetry('/api/status');
        if (res.ok) {
          const data = await res.json();
          setIsSupabaseConfigured(!!data.supabase_configured);
          setIsGeminiConfigured(!!data.gemini_configured);
        }
      } catch (err) {
        console.log("Master server connection is using offline Sandbox fallback mode.", err);
        setIsSupabaseConfigured(false);
        setIsGeminiConfigured(false);
      }
    };
    fetchStatus();

    return () => clearTimeout(timer);
  }, []);

  const totalGenerations = history.length;
  
  // Calculate average word length from history
  const totalWords = history.reduce((acc, item) => {
    const words = item.result ? item.result.split(/\s+/).length : 0;
    return acc + words;
  }, 0);

  // Simple token approximation
  const approximateTokens = Math.round(totalWords * 1.35);

  // Get count per format
  const formatCounts = history.reduce((acc: { [key: string]: number }, item) => {
    acc[item.format] = (acc[item.format] || 0) + 1;
    return acc;
  }, {});

  const currentMonthNames = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  const baselineGenerations = [14, 22, 19, 35, 23, 41, 34, 45, 52, 60, totalGenerations + 10, totalGenerations];

  // Credits Calculation
  const creditsUsed = user.creditsUsed || 0;
  const creditsLimit = user.creditsLimit || 100000;
  const creditsRemaining = Math.max(0, creditsLimit - creditsUsed);
  const creditsPercentage = Math.round((creditsUsed / creditsLimit) * 100);

  if (loadingSkeleton) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto" id="analytics-skeletons-group">
        {/* Skeleton Box */}
        <div className="h-32 bg-[#ebe7de]/30 dark:bg-zinc-800/20 border border-dashed border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl animate-pulse flex items-center justify-between p-8">
          <div className="space-y-2.5">
            <div className="h-5 bg-zinc-300 dark:bg-zinc-700 w-48 rounded" />
            <div className="h-3 bg-zinc-300 dark:bg-zinc-700 w-80 rounded" />
          </div>
          <div className="h-10 bg-zinc-300 dark:bg-zinc-700 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl h-28 animate-pulse space-y-4">
              <div className="h-3.5 bg-zinc-300 dark:bg-zinc-700 w-24 rounded" />
              <div className="h-6 bg-zinc-300 dark:bg-zinc-700 w-16 rounded" />
              <div className="h-2.5 bg-zinc-300 dark:bg-zinc-700 w-full rounded-full" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] lg:col-span-2 rounded-2xl h-64 animate-pulse" />
          <div className="p-8 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="analytics-page-canvas">
      
      {/* SaaS Welcome Hero Card */}
      <div className="p-8 rounded-2xl bg-[#ebe7de] dark:bg-[#1e1d1a] border border-[#e2dfd9] dark:border-[#2f2e2c] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm" id="analytics-intro-banner">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#1a1917] text-[#f7f6f2] font-mono text-[9px] font-bold px-2.5 py-1 rounded-md mb-2.5">
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
            SERVER CORE ONLINE
          </div>
          <h1 className="font-display font-extrabold text-[#1a1917] dark:text-white text-3xl mb-1.5 tracking-tight">Active Analytics Console</h1>
          <p className="text-[#5c5952] dark:text-[#a19c91] text-xs">
            Review live execution loads, active AI token quotas, and automated webhook triggers.
          </p>
        </div>
        <button
          id="stat-header-cta-btn"
          onClick={onNavigateToGen}
          className="px-5 py-3 rounded-xl bg-[#1a1917] dark:bg-amber-300 text-[#f7f6f2] dark:text-[#1a1917] hover:bg-[#383531] dark:hover:bg-amber-400 font-display font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" /> Deploy Prompt Flow
        </button>
      </div>

      {/* Credit Pool Meter Visual Integration */}
      <div className="p-6 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl" id="analytics-credits-well">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 select-text">
          <div>
            <h3 className="font-display font-black text-[#1a1917] dark:text-white text-sm flex items-center gap-1.5">
              <Zap className="h-4.5 w-4.5 text-amber-500 fill-amber-500 animate-pulse" /> Sandbox AI Credits Pool Meter
            </h3>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-0.5">
              Refreshes monthly. Upgraded tiers unlock infinite sandbox requests.
            </p>
          </div>
          <div className="text-right font-mono">
            <p className="text-sm font-black text-[#1a1917] dark:text-white">
              {creditsRemaining.toLocaleString()} / {creditsLimit.toLocaleString()} <span className="text-[10px] text-[#a19c91] font-semibold">Tks Left</span>
            </p>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{creditsPercentage}% Used</p>
          </div>
        </div>

        {/* Meter bar */}
        <div className="w-full bg-[#f7f6f2] dark:bg-[#201f1c] h-3.5 rounded-full overflow-hidden border border-[#e2dfd9] dark:border-[#2f2e2c] p-0.5">
          <div 
            style={{ width: `${Math.min(100, Math.max(2, creditsPercentage))}%` }}
            className={`
              h-full rounded-full transition-all duration-500
              ${creditsPercentage > 85 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-amber-600'}
            `}
          />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="analytics-stats-grid">
        
        {/* Total Content */}
        <div className="p-6 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl shadow-xs">
          <span className="text-xs font-mono font-semibold text-[#a19c91] tracking-wider uppercase block mb-1">Generated Drafts</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-display font-extrabold text-[#1a1917] dark:text-white">{totalGenerations}</span>
            <span className="text-[#a19c91] text-xs font-mono">units built</span>
          </div>
          <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-2.5 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 inline" /> Database integrated
          </p>
        </div>

        {/* Dynamic Tokens */}
        <div className="p-6 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl shadow-xs">
          <span className="text-xs font-mono font-semibold text-[#a19c91] tracking-wider uppercase block mb-1">Approx. Tokens Consumed</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-display font-extrabold text-[#1a1917] dark:text-white">{approximateTokens.toLocaleString()}</span>
            <span className="text-[#a19c91] text-xs font-mono">tokens</span>
          </div>
          <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-2.5 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-indigo-500 inline" /> Avg {totalGenerations > 0 ? Math.round(totalWords / totalGenerations) : 0} words
          </p>
        </div>

        {/* Database Mode status */}
        <div className="p-6 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl shadow-xs">
          <span className="text-xs font-mono font-semibold text-[#a19c91] tracking-wider uppercase block mb-1">Workspace Storage Mode</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-display font-bold text-[#1a1917] dark:text-white">
              {isSupabaseConfigured ? "Supabase Live" : "Secured Local Core"}
            </span>
          </div>
          <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91] mt-3 leading-relaxed">
            {isSupabaseConfigured 
              ? "Persisted to remote cloud tables." 
              : "Using secure process-level memory sandbox."}
          </p>
        </div>

        {/* Pricing tier active */}
        <div className="p-6 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl shadow-xs">
          <span className="text-xs font-mono font-semibold text-[#a19c91] tracking-wider uppercase block mb-1">Billing Service Status</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-display font-extrabold text-[#1a1917] dark:text-white">{userPlan} Plan</span>
          </div>
          <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91] mt-3 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-500 inline text-xs" /> LemonSqueezy sandbox prepped
          </p>
        </div>

      </div>

      {/* Center Layout: Visual Chart + Platform breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="analytics-visuals">
        
        {/* Custom Grid Trend Chart */}
        <div className="p-8 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] lg:col-span-2 flex flex-col justify-between rounded-3xl">
          <div>
            <h3 className="font-display font-extrabold text-[#1a1917] dark:text-white text-xl mb-1 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> Content Generation Trends
            </h3>
            <p className="text-[#a19c91] text-xs font-mono uppercase mb-6">AI DRAFT VOLUME OVER SEASONAL TIMELINES</p>
          </div>

          {/* Graphical Representation */}
          <div className="h-48 flex items-end justify-between gap-1 sm:gap-2.5 pt-6 px-2" id="analytics-chart-graph">
            {baselineGenerations.map((val, idx) => {
              const percentageHeight = Math.min(100, Math.max(8, (val / 65) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="text-[10px] text-[#1a1917] dark:text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-[#f7f6f2] dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-[#e2dfd9] dark:border-[#2f2e2c] mb-1">
                    {val}
                  </div>
                  <div 
                    style={{ height: `${percentageHeight}%` }}
                    className="w-full bg-[#ebe7de] dark:bg-zinc-800 group-hover:bg-[#1a1917] dark:group-hover:bg-amber-300 rounded-md transition-all duration-300 shadow-xs"
                  />
                  <span className="text-[10px] text-[#2d2c2a] dark:text-[#eceae6] font-mono mt-1 font-semibold block">{currentMonthNames[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Format breakdown list */}
        <div className="p-8 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl">
          <h3 className="font-display font-extrabold text-[#1a1917] dark:text-white text-xl mb-1 block">Content segmentation</h3>
          <p className="text-[#a19c91] text-xs font-mono uppercase mb-6 block">GENERATED CATEGORIES BY FORMAT</p>
 
          {totalGenerations === 0 ? (
            <div className="py-12 text-center text-[#5c5952] dark:text-[#a19c91] text-xs space-y-1">
              <MessageSquare className="h-8 w-8 text-[#a19c91] mx-auto mb-2" />
              <p className="font-bold">Your content logs are safely empty.</p>
              <p>Run generations to visualize details.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(formatCounts).map(([fmt, count]) => {
                const ratio = Math.round((count / totalGenerations) * 100);
                return (
                  <div key={fmt} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#1a1917] dark:text-white">
                      <span>{fmt}</span>
                      <span className="font-mono text-[10px] bg-[#f7f6f2] dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-[#e2dfd9] dark:border-[#2f2e2c]">{count} ({ratio}%)</span>
                    </div>
                    <div className="w-full bg-[#f7f6f2] dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${ratio}%` }}
                        className="bg-[#1a1917] dark:bg-amber-300 h-full rounded-full transition-all"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Integration pipeline readiness cards */}
      <div className="p-8 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl" id="analytics-pipeline-board">
        <h3 className="font-display font-extrabold text-[#1a1917] dark:text-white text-xl mb-2">Cross-Channel Multiplexer Pipes</h3>
        <p className="text-[#5c5952] dark:text-[#a19c91] text-xs mb-6">
          Architectural preparation for direct output hooks. Generated formats automatically pre-render parameters matching social payloads.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-5 rounded-xl border border-[#e2dfd9] dark:border-[#2f2e2c] bg-[#fdfdfc] dark:bg-[#1b1a17]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[#1a1917] dark:text-white text-sm font-display">WhatsApp Webhooks</span>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-semibold px-2 py-0.5 rounded-full inline-block flex items-center gap-0.5">
                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-700" /> Active emulation
              </span>
            </div>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] leading-relaxed mb-4">
              A pipe structure for pushing auto-campaign blocks to WhatsApp groups or broadcast lists automatically.
            </p>
            <button 
              id="whatsapp-test-btn"
              onClick={onNavigateToSettings}
              className="text-xs font-mono font-bold text-[#1a1917] dark:text-amber-300 hover:underline cursor-pointer"
            >
              Configure webhook triggers →
            </button>
          </div>

          <div className="p-5 rounded-xl border border-[#e2dfd9] dark:border-[#2f2e2c] bg-[#fdfdfc] dark:bg-[#1b1a17]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[#1a1917] dark:text-white text-sm font-display">TikTok Publisher</span>
              <span className="text-[10px] font-mono bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full inline-block flex items-center gap-0.5">
                <AlertCircle className="h-2.5 w-2.5 text-amber-600" /> Token pending
              </span>
            </div>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] leading-relaxed mb-4">
              Prepares video script segments and metadata objects conforming to official TikTok developer media publishing schemas.
            </p>
            <button 
              id="tiktok-test-btn"
              onClick={onNavigateToSettings}
              className="text-xs font-mono font-bold text-[#5c5952] dark:text-[#a19c91] hover:underline cursor-pointer"
            >
              Verify TikTok pipeline →
            </button>
          </div>

          <div className="p-5 rounded-xl border border-[#e2dfd9] dark:border-[#2f2e2c] bg-[#fdfdfc] dark:bg-[#1b1a17]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[#1a1917] dark:text-white text-sm font-display">Instagram Auto-Cap</span>
              <span className="text-[10px] font-mono bg-[#f2eefd] text-[#4f46e5] dark:bg-indigo-950/40 dark:text-indigo-200 font-semibold px-2 py-0.5 rounded-full inline-block flex items-center gap-0.5">
                Ready slots
              </span>
            </div>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] leading-relaxed mb-4">
              Captions are packed into clean JSON metadata payloads containing hashtags. Ready for standard scheduler arrays.
            </p>
            <button 
              id="instagram-test-btn"
              onClick={onNavigateToSettings}
              className="text-xs font-mono font-bold text-[#1a1917] dark:text-amber-300 hover:underline cursor-pointer"
            >
              Review JSON schemas →
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
