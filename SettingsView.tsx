import React, { useState, useEffect } from 'react';
import { Shield, Database, Sparkles, Key, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Server, Send } from 'lucide-react';
import { User, APIStatus } from '../types';

interface SettingsViewProps {
  user: User;
  userPlan: string;
}

export default function SettingsView({ user, userPlan }: SettingsViewProps) {
  const [checking, setChecking] = useState(false);
  const [statuses, setStatuses] = useState<{
    supabase: boolean;
    gemini: boolean;
    whatsapp: string;
    tiktok: string;
    instagram: string;
  }>({
    supabase: false,
    gemini: false,
    whatsapp: 'offline',
    tiktok: 'offline',
    instagram: 'offline',
  });

  const checkAPIs = async () => {
    setChecking(true);
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

    try {
      const res = await fetchWithRetry('/api/status');
      const data = await res.json();
      setStatuses({
        supabase: data.supabase_configured,
        gemini: data.gemini_configured,
        whatsapp: data.active_connections?.whatsapp || 'offline',
        tiktok: data.active_connections?.tiktok || 'offline',
        instagram: data.active_connections?.instagram || 'offline',
      });
    } catch (err) {
      console.log("Running in isolated Sandbox Mode. Core keys are handled locally.", err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkAPIs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="settings-view-canvas">
      
      {/* Settings Title */}
      <div id="settings-headline">
        <h1 className="font-display font-extrabold text-[#1a1917] dark:text-white text-2xl">Workspace Settings & Diagnostics</h1>
        <p className="text-sm text-[#5c5952] dark:text-[#a19c91]">Inspect credential active keys, profile detail summaries, and backend indicator logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile Card */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-2xl text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-[#1a1917]/5 dark:bg-amber-300/10 flex items-center justify-center text-[#1a1917] dark:text-amber-300 border border-[#e2dfd9] dark:border-[#2f2e2c]">
              <Server className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#1a1917] dark:text-white">{user.name || "SaaS Creator"}</h3>
              <p className="text-xs text-[#a19c91] font-mono mt-1">{user.email}</p>
            </div>
            <div className="bg-[#ebe7de]/50 dark:bg-zinc-800/60 py-2.5 rounded-xl border border-[#e2dfd9] dark:border-[#2f2e2c] text-xs font-mono font-bold text-[#1a1917] dark:text-white">
              Plan: {userPlan}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-2xl">
            <h4 className="font-display font-bold text-sm text-[#1a1917] dark:text-white mb-3 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Security Statement
            </h4>
            <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91] leading-relaxed">
              All credentials are held in your private environments. Client apps querying the content workshop have all API keys strictly concealed. No keys are ever exposed inside browser memory or HTML assets.
            </p>
          </div>
        </div>

        {/* API Status Table */}
        <div className="md:col-span-8 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl p-6 space-y-6" id="api-diagnostics-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-[#1a1917] dark:text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-500" /> Host Secret Injections Checks
            </h3>
            <button
              id="refresh-diagnostics-btn"
              onClick={checkAPIs}
              disabled={checking}
              className="p-1.5 hover:bg-[#ebe7de] dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold text-[#1a1917] dark:text-zinc-200 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
              Query Status
            </button>
          </div>

          <div className="space-y-4" id="api-indicators-list">
            
            {/* Gemini Check */}
            <div className="p-4 rounded-xl border border-[#e2dfd9] dark:border-[#2f2e2c] flex items-center justify-between">
              <div className="flex gap-3">
                <div className="h-10 w-10 bg-amber-50 dark:bg-amber-955/20 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1a1917] dark:text-white font-display">Gemini content generator API</h4>
                  <p className="text-[11px] mt-0.5 text-[#5c5952] dark:text-[#a19c91]">Checked variable: <code className="bg-[#fcfbf9] dark:bg-zinc-950 px-1 font-mono text-red-700 dark:text-red-400">GEMINI_API_KEY</code></p>
                </div>
              </div>

              <div>
                {statuses.gemini ? (
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-3 py-1 rounded-full flex items-center gap-1 font-mono text-[10px]">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> ONLINE
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 px-3 py-1 rounded-full flex items-center gap-1 font-mono text-[10px]">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> MISSING KEY
                  </span>
                )}
              </div>
            </div>

            {/* Supabase Check */}
            <div className="p-4 rounded-xl border border-[#e2dfd9] dark:border-[#2f2e2c] flex items-center justify-between">
              <div className="flex gap-3">
                <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-955/20 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1a1917] dark:text-white font-display">Supabase Cloud Sync DB</h4>
                  <p className="text-[11px] mt-0.5 text-[#5c5952] dark:text-[#a19c91]">Checked variable: <code className="bg-[#fcfbf9] dark:bg-zinc-950 px-1 font-mono text-red-700 dark:text-red-400">SUPABASE_URL</code></p>
                </div>
              </div>

              <div>
                {statuses.supabase ? (
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-3 py-1 rounded-full flex items-center gap-1 font-mono text-[10px]">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> ACTIVE
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-[#5c5952] dark:text-zinc-400 bg-[#f7f6f2] dark:bg-zinc-800/40 border border-[#e2dfd9] dark:border-[#2f2e2c] px-3 py-1 rounded-full flex items-center gap-1 font-mono text-[10px]">
                    <AlertCircle className="h-3.5 w-3.5 text-[#a19c91] dark:text-zinc-500" /> EMULATED FALLBACK
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Database Info guidelines block */}
          <div className="bg-[#ebe7de]/30 dark:bg-zinc-900/40 border border-[#e2dfd9] dark:border-[#2f2e2c] p-5 rounded-2xl space-y-3">
            <h4 className="font-display font-extrabold text-sm text-[#1a1917] dark:text-white flex items-center gap-1.5">
              <Server className="h-4 w-4 text-amber-500" /> Go Live: Supabase Tables Setup Guidelines
            </h4>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] leading-relaxed">
              If you want to plug in a remote persistent Supabase instance, ensure your database has a <code className="bg-white/85 dark:bg-zinc-800 px-1 py-0.5 rounded text-neutral-800 dark:text-zinc-200">content_history</code> table styled with the following schema:
            </p>
            <pre className="text-[10px] font-mono bg-[#fcfbf9] dark:bg-zinc-950 border border-[#e2dfd9] dark:border-[#2f2e2c] p-4 rounded-xl overflow-x-auto text-[#1a1917] dark:text-zinc-200">
{`CREATE TABLE content_history (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  title TEXT,
  prompt TEXT,
  result TEXT,
  format TEXT,
  tone TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91]">
              Set variables <code className="text-red-700 dark:text-red-400 bg-white/85 dark:bg-zinc-800 px-1 rounded font-semibold">SUPABASE_URL</code> and <code className="text-red-700 dark:text-red-400 bg-white/85 dark:bg-zinc-800 px-1 rounded font-semibold">SUPABASE_ANON_KEY</code> inside the workspace {"Settings > Secrets"} panel to trigger direct routing instantly!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
