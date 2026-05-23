import React, { useState, useEffect } from 'react';
import { Shield, Database, Sparkles, Key, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Server, Send, Github, Download } from 'lucide-react';
import { User, APIStatus } from '../types';

interface SettingsViewProps {
  user: User;
  userPlan: string;
}

export default function SettingsView({ user, userPlan }: SettingsViewProps) {
  const [checking, setChecking] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [repoUrlOrName, setRepoUrlOrName] = useState('https://github.com/hapeenooo333-create/creatoros-production');
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadZip = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (downloadingZip) return;
    setDownloadingZip(true);
    setDownloadError(null);
    try {
      const res = await fetch("/api/export-zip");
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "creatoros-project.zip");
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 150);
    } catch (err: any) {
      setDownloadError(err.message || "An unexpected error occurred during zip creation.");
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleGithubPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubToken) {
      setPushResult({ success: false, message: "Please enter a valid GitHub Personal Access Token (PAT)." });
      return;
    }
    setPushing(true);
    setPushResult(null);

    try {
      const res = await fetch("/api/push-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubToken, repoUrlOrName }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPushResult({ success: true, message: data.message, details: data.stdout || data.stderr });
      } else {
        setPushResult({ success: false, message: data.error || "GitHub push failed.", details: data.details });
      }
    } catch (err: any) {
      setPushResult({ success: false, message: "An unexpected network error occurred while pushing to GitHub: " + err.message });
    } finally {
      setPushing(false);
    }
  };

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

      {/* GitHub Export & Mobile Deployment Suite */}
      <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl p-6 md:p-8 space-y-6" id="github-vercel-deployment-panel">
        <div>
          <h2 className="font-display font-extrabold text-[#1a1917] dark:text-white text-lg flex items-center gap-2">
            <Github className="h-5 w-5 text-amber-500 animate-spin-slow" /> One-Click GitHub & Vercel Deployment Hub
          </h2>
          <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-1">
            Optimized for Android Chrome. Instantly push production-ready files to your GitHub repository or download a ZIP to deploy CreatorOS on Vercel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Push Form and ZIP handler */}
          <div className="space-y-6 border-b lg:border-b-0 lg:border-r border-[#e2dfd9] dark:border-[#2f2e2c]/65 pb-6 lg:pb-0 lg:pr-8">
            
            {/* Download Archive Option */}
            <div className="bg-amber-500/5 dark:bg-amber-300/5 border border-amber-500/15 dark:border-amber-300/10 p-5 rounded-xl space-y-3">
              <h3 className="text-xs font-mono font-bold tracking-wider text-amber-500 uppercase flex items-center gap-1.5">
                <Download className="h-4 w-4" /> Download Complete ZIP Package
              </h3>
              <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91] leading-relaxed">
                Contains full build files, <code className="font-mono text-[10px]">package.json</code>, <code className="font-mono text-[10px]">server.ts</code>, <code className="font-mono text-[10px]">vercel.json</code>, and pre-compiled bundlers.
              </p>
              <a 
                href="/api/export-zip"
                target="_blank"
                rel="noopener noreferrer"
                download="creatoros-project.zip"
                className="inline-flex items-center gap-1.5 bg-[#1a1917] dark:bg-amber-300 text-white dark:text-[#1a1917] text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-sans w-full justify-center text-center cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download ZIP Archive Now
              </a>
            </div>

            {/* Direct GitHub Push Form */}
            <form onSubmit={handleGithubPush} className="space-y-4">
              <h3 className="text-xs font-mono font-bold tracking-wider text-amber-500 uppercase flex items-center gap-1.5">
                <Github className="h-4 w-4" /> Push Workspace Direct To GitHub
              </h3>
              
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-[#5c5952] dark:text-[#a19c91]">
                  REPOSITORY TARGET URL / NAME
                </label>
                <input
                  type="text"
                  required
                  value={repoUrlOrName}
                  onChange={(e) => setRepoUrlOrName(e.target.value)}
                  placeholder="e.g. username/repo"
                  className="w-full text-xs font-mono border border-[#e2dfd9] dark:border-[#2f2e2c] bg-white dark:bg-zinc-950 px-3.5 py-2.5 rounded-xl outline-none text-[#1a1917] dark:text-zinc-100 focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-[#5c5952] dark:text-[#a19c91] flex items-center justify-between">
                  <span>GITHUB PERSONAL ACCESS TOKEN (PAT)</span>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=CreatorOS"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-amber-600 hover:underline inline-flex items-center gap-0.5"
                  >
                    Generate Token <Send className="h-2 w-2" />
                  </a>
                </label>
                <input
                  type="password"
                  required
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="Paste your ghp_... token here"
                  className="w-full text-xs font-mono border border-[#e2dfd9] dark:border-[#2f2e2c] bg-white dark:bg-zinc-950 px-3.5 py-2.5 rounded-xl outline-none text-[#1a1917] dark:text-zinc-100 focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={pushing}
                className="w-full bg-[#1a1917] dark:bg-amber-300 border border-[#2f2e2c] text-white dark:text-[#1a1917] py-3 rounded-xl text-xs font-bold font-sans cursor-pointer hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {pushing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Pushing Source Tree...
                  </>
                ) : (
                  <>
                    <Github className="h-3.5 w-3.5" /> Initialize Git & Push To Branch
                  </>
                )}
              </button>
            </form>

            {/* Push Output Log */}
            {pushResult && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${pushResult.success ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-400'}`}>
                <div className="font-bold flex items-center gap-1.5">
                  {pushResult.success ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-rose-500" />}
                  {pushResult.message}
                </div>
                {pushResult.details && (
                  <pre className="text-[10px] font-mono bg-[#fcfbf9]/60 dark:bg-zinc-950/60 p-3 rounded-lg overflow-x-auto max-h-[150px] border border-[#e2dfd9]/40 dark:border-[#2f2e2c]/40 text-[#1a1917] dark:text-zinc-200">
                    {pushResult.details}
                  </pre>
                )}
              </div>
            )}

          </div>

          {/* Vercel Mobile Setup Instructions */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-amber-500 uppercase">
              Vercel Mobile-Only Deployment Guide
            </h3>
            
            <div className="space-y-3 font-sans text-xs text-[#5c5952] dark:text-[#a19c91]">
              <div className="flex gap-2.5">
                <span className="h-5 w-5 rounded-full bg-amber-500/10 dark:bg-amber-300/10 text-amber-500 dark:text-amber-400 shrink-0 flex items-center justify-center font-bold font-mono text-[10px]">
                  1
                </span>
                <p className="leading-relaxed">
                  <strong>Create target Repository:</strong> Open <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5">github.com/new <Send className="h-2 w-2" /></a> on Android Chrome. Name it <code className="bg-[#ebe7de]/40 dark:bg-zinc-800 px-1 py-0.5 rounded text-[11px] font-semibold text-neutral-800 dark:text-neutral-100">creatoros-production</code>, leaving it completely empty (do not initialize with README/LICENSE).
                </p>
              </div>

              <div className="flex gap-2.5">
                <span className="h-5 w-5 rounded-full bg-amber-500/10 dark:bg-amber-300/10 text-amber-500 dark:text-amber-400 shrink-0 flex items-center justify-center font-bold font-mono text-[10px]">
                  2
                </span>
                <p className="leading-relaxed">
                  <strong>Generate access token (PAT):</strong> Follow the 'Generate Token' link above, keep scopes default (<code className="font-mono text-[10px] bg-[#ebe7de]/45 px-1 rounded font-semibold text-neutral-700 dark:text-zinc-300">repo</code> flag checked), copy and paste it into the form on the left.
                </p>
              </div>

              <div className="flex gap-2.5">
                <span className="h-5 w-5 rounded-full bg-amber-500/10 dark:bg-amber-300/10 text-amber-500 dark:text-amber-400 shrink-0 flex items-center justify-center font-bold font-mono text-[10px]">
                  3
                </span>
                <p className="leading-relaxed">
                  <strong>Execute Direct Push:</strong> Press <span className="font-semibold text-neutral-800 dark:text-white">Initialize Git & Push</span>. Our serverless pipeline will compile the production manifests, initialize Git tracking, pack assets, and push them directly to GitHub without requiring a computer.
                </p>
              </div>

              <div className="flex gap-2.5">
                <span className="h-5 w-5 rounded-full bg-amber-500/10 dark:bg-amber-300/10 text-amber-500 dark:text-amber-400 shrink-0 flex items-center justify-center font-bold font-mono text-[10px]">
                  4
                </span>
                <p className="leading-relaxed">
                  <strong>Deploys on Vercel:</strong> Go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold inline-flex items-center gap-0.5">vercel.com/new <Send className="h-2 w-2" /></a>. Choose the <code className="font-semibold text-neutral-800 dark:text-neutral-200">creatoros-production</code> repository.
                </p>
              </div>

              <div className="flex gap-2.5">
                <span className="h-5 w-5 rounded-full bg-amber-500/10 dark:bg-amber-300/10 text-amber-500 dark:text-amber-400 shrink-0 flex items-center justify-center font-bold font-mono text-[10px]">
                  5
                </span>
                <div className="leading-relaxed">
                  <strong>Apply Settings & Go Live:</strong> In the Vercel configuration:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Framework Preset: <strong>Vite</strong></li>
                    <li>Build Command: <strong><code className="bg-[#ebe7de]/45 px-1 py-0.5 rounded text-neutral-700 dark:text-zinc-350">npm run build</code></strong></li>
                    <li>Output Directory: <strong><code className="bg-[#ebe7de]/45 px-1 py-0.5 rounded text-neutral-700 dark:text-zinc-350">dist</code></strong></li>
                    <li>Add Environment Variables: Set <code className="font-semibold text-neutral-800 dark:text-neutral-200">GEMINI_API_KEY</code>, <code className="font-semibold text-neutral-800 dark:text-neutral-200">SUPABASE_URL</code>, and <code className="font-semibold text-neutral-800 dark:text-neutral-200">SUPABASE_ANON_KEY</code>.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#ebe7de]/25 dark:bg-zinc-900/40 p-4 rounded-xl border border-[#e2dfd9] dark:border-[#2f2e2c] text-[11px] leading-relaxed text-[#5c5952] dark:text-[#a19c91]">
              💡 <strong>Direct ZIP Deployment Alternative:</strong> If you do not wish to use GitHub tracking, you can download the generated ZIP package above, open <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">Vercel Import</a>, and upload the ZIP archive directly into the browser.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
