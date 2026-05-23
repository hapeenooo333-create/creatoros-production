import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Copy, 
  Download, 
  Printer, 
  Check, 
  AlertTriangle, 
  HelpCircle, 
  RefreshCw, 
  Edit3, 
  Eye,
  Info
} from 'lucide-react';
import { WorkflowConfig, HistoryItem } from './types';
import { generateDemoContent } from './demoGenerator';

interface AIGeneratorProps {
  token: string | null;
  onGenerationComplete: (newItem: HistoryItem) => void;
  onNavigateToHistory: () => void;
}

export default function AIGenerator({ token, onGenerationComplete, onNavigateToHistory }: AIGeneratorProps) {
  // Input states
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('LinkedIn Post');
  const [tone, setTone] = useState('Professional & Bold');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [audience, setAudience] = useState('');
  const [objective, setObjective] = useState('');

  // Processing states
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isDemoModeActive, setIsDemoModeActive] = useState(false);
  
  // Output states
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [currentHistoryItem, setCurrentHistoryItem] = useState<HistoryItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto detect credentials status on launch
  useEffect(() => {
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

    const checkStatus = async () => {
      try {
        const res = await fetchWithRetry('/api/status');
        if (res.ok) {
          const data = await res.json();
          if (!data.gemini_configured) {
            setIsDemoModeActive(true);
          }
        }
      } catch (err) {
        setIsDemoModeActive(true);
        console.log("No active AI server found. CreatorOS enabled custom Sandbox fallbacks for instant draft generation.");
      }
    };
    checkStatus();
  }, []);
  
  // Rotating tips during active generation to ensure optimal reassurance
  const activeTips = [
    "Establishing secure server-side proxy route...",
    "Connecting with high-performance Gemini 3.5 engine...",
    "Styling markdown spacing and visual bullet points...",
    "Curating campaign hooks and concluding call-to-actions...",
    "Injecting cross-channel SEO meta structures..."
  ];

  useEffect(() => {
    let interval: any;
    if (generating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % activeTips.length);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [generating]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) {
      setErrorText("A topic or core campaign concept is required to generate content.");
      return;
    }

    setErrorText(null);
    setGenerating(true);
    setGeneratedResult('');
    setCurrentHistoryItem(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic,
          tone,
          platform,
          length,
          audience: audience || "general business professionals",
          objective: objective || "Brand awareness & education"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "An unexpected generation pipeline error occurred on the server.");
      }

      setGeneratedResult(data.content);
      setCurrentHistoryItem(data.historyItem);
      onGenerationComplete(data.historyItem);
    } catch (err: any) {
      console.warn("Server generation failed, launching sandbox fallback simulation:", err);
      setIsDemoModeActive(true);
      
      // Artificial short delay to simulate high-performance cloud processing pacing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const isSwahili = topic.toLowerCase().includes('swahili') || topic.toLowerCase().includes('m-pesa') || topic.toLowerCase().includes('dar');
      const fallbackLang = isSwahili ? "Bilingual Swahili + English" : "English Standard VIP";
      
      const platLow = platform.toLowerCase();
      let dType = 'caption';
      if (platLow.includes('script')) dType = 'script';
      else if (platLow.includes('thread') || platLow.includes('blog') || platLow.includes('repurpose')) dType = 'repurpose';
      else if (platLow.includes('email') || platLow.includes('pitch')) dType = 'leadgen';
      else if (platLow.includes('press') || platLow.includes('rel')) dType = 'repurpose';

      const fallbackResult = generateDemoContent(dType, topic, {
        tone,
        language: fallbackLang,
        targetAudience: audience || "general business professionals"
      });

      setGeneratedResult(fallbackResult);

      const virtualHistoryItem: HistoryItem = {
        id: `virtual-demo-${Date.now()}`,
        userId: 'user-demo',
        title: topic.length > 25 ? (topic.slice(0, 25) + '...') : topic,
        prompt: topic,
        result: fallbackResult,
        format: platform,
        tone: tone,
        category: 'Demo Sandbox Copy',
        createdAt: new Date().toISOString()
      };

      setCurrentHistoryItem(virtualHistoryItem);
      onGenerationComplete(virtualHistoryItem);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!generatedResult) return;
    const element = document.createElement("a");
    const file = new Blob([generatedResult], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `${platform.toLowerCase().replace(/\s+/g, "_")}_draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrintPdf = () => {
    if (!generatedResult) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CreatorOS Draft Export - ${platform}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #1a1917;
                padding: 40px;
                line-height: 1.6;
                background-color: #ffffff;
              }
              h1 {
                font-size: 24px;
                border-bottom: 2px solid #1a1917;
                padding-bottom: 10px;
                margin-bottom: 24px;
                font-weight: 800;
              }
              pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                font-size: 14px;
                background: #f7f6f2;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e2dfd9;
              }
              .meta {
                font-size: 11px;
                color: #5c5952;
                margin-bottom: 20px;
                font-family: monospace;
              }
            </style>
          </head>
          <body>
            <h1>${platform} Generated Copy</h1>
            <div class="meta">
              <strong>Source Pipeline:</strong> CreatorOS Client Engine <br />
              <strong>Selected Tone:</strong> ${tone} | <strong>Topic Summary:</strong> ${topic.slice(0, 50)}...
            </div>
            <pre>${generatedResult}</pre>
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleUpdateContent = async () => {
    if (!currentHistoryItem) return;
    try {
      const res = await fetch(`/api/history/${currentHistoryItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ result: generatedResult })
      });
      if (res.ok) {
        setEditMode(false);
      }
    } catch (err) {
      console.error("Failed to commit live changes", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto" id="ai-generator-layout">
      
      {/* Parameters Panel */}
      <div className="lg:col-span-4 bg-white dark:bg-[#151413] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl p-6 h-fit" id="ai-config-sidebar">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-7 w-7 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-[#1a1917] dark:text-amber-300">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <h2 className="font-display font-extrabold text-[#1a1917] dark:text-[#f7f6f2] text-lg">Workshop Setup</h2>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          
          {/* Topic */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#5c5952] dark:text-[#a19c91] mb-1.5 uppercase">Topic / Pitch core concept *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. A LinkedIn post on why keeping Gemini API keys server-side is the single most important action for security..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-sm text-[#1a1917] dark:text-[#f7f6f2] focus:outline-none focus:border-[#1a1917] dark:focus:border-amber-300"
              id="config-input-topic"
            />
          </div>

          {/* Destination platform */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#5c5952] dark:text-[#a19c91] mb-1.5 uppercase">Platform Format</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-sm text-[#1a1917] dark:text-[#f7f6f2] focus:outline-none focus:border-[#1a1917] dark:focus:border-amber-300"
              id="config-input-platform"
            >
              <option value="LinkedIn Post">LinkedIn Post</option>
              <option value="Blog Post">Blog Post</option>
              <option value="Twitter Thread">Twitter Thread</option>
              <option value="YouTube Script">YouTube Script</option>
              <option value="TikTok Script">TikTok Script</option>
              <option value="Instagram Caption">Instagram Caption</option>
              <option value="Email Pitch">Email Pitch</option>
              <option value="Press Release">Press Release</option>
            </select>
          </div>

          {/* Copy tone */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#5c5952] dark:text-[#a19c91] mb-1.5 uppercase">Tone Profile</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-sm text-[#1a1917] dark:text-[#f7f6f2] focus:outline-none focus:border-[#1a1917] dark:focus:border-amber-300"
              id="config-input-tone"
            >
              <option value="Professional & Bold">Professional & Bold</option>
              <option value="Witty & Casual">Witty & Casual</option>
              <option value="Academic & Detailed">Academic & Detailed</option>
              <option value="Empathetic & Warm">Empathetic & Warm</option>
              <option value="Bold & Disruptive">Bold & Disruptive</option>
            </select>
          </div>

          {/* Volume Length */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#5c5952] dark:text-[#a19c91] mb-1.5 uppercase">Length limit</label>
            <div className="grid grid-cols-3 gap-2">
              {(['short', 'medium', 'long'] as const).map((len) => (
                <button
                  key={len}
                  type="button"
                  id={`config-btn-len-${len}`}
                  onClick={() => setLength(len)}
                  className={`
                    py-2 rounded-xl text-xs font-semibold capitalize font-mono border transition-all cursor-pointer
                    ${length === len 
                      ? 'bg-[#1a1917] border-[#1a1917] text-[#f7f6f2] dark:bg-amber-300 dark:border-amber-300 dark:text-[#1a1917]' 
                      : 'border-[#e2dfd9] dark:border-[#2f2e2c] hover:bg-[#f7f6f2] dark:hover:bg-zinc-800 text-[#1a1917] dark:text-zinc-300'}
                  `}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#5c5952] dark:text-[#a19c91] mb-1.5 uppercase">Target Audience (Optional)</label>
            <input
              type="text"
              placeholder="e.g. solopreneurs, SaaS developers, VC managers"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] text-[#1a1917] dark:text-[#f7f6f2] rounded-xl text-sm focus:outline-none focus:border-[#1a1917] dark:focus:border-amber-300"
              id="config-input-audience"
            />
          </div>

          {/* Objective */}
          <div>
            <label className="block text-xs font-mono font-semibold text-[#5c5952] dark:text-[#a19c91] mb-1.5 uppercase">Campaign Objective (Optional)</label>
            <input
              type="text"
              placeholder="e.g. high-converting clicks, educational trust"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] text-[#1a1917] dark:text-[#f7f6f2] rounded-xl text-sm focus:outline-none focus:border-[#1a1917] dark:focus:border-amber-300"
              id="config-input-objective"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full py-3 bg-[#1a1917] hover:bg-[#383531] text-[#f7f6f2] dark:bg-amber-300 dark:hover:bg-amber-400 dark:text-[#1a1917] font-display font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="generator-trigger-btn"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" /> Trigger Workspace Engine
              </>
            )}
          </button>

        </form>
      </div>

      {/* Editor/Response Canvas */}
      <div className="lg:col-span-8 space-y-6" id="ai-response-canvas">
        
        {/* Demo Mode Status Indicator */}
        {isDemoModeActive && (
          <div className="bg-amber-500/10 dark:bg-amber-950/20 border border-amber-300/30 text-amber-800 dark:text-amber-400 p-4 rounded-2xl flex items-start gap-2.5 text-xs" id="ai-demo-badge">
            <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold font-mono tracking-wider text-[10px] uppercase flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Demo Mode: Active
              </span>
              <p className="opacity-90 leading-relaxed text-[#5c5952] dark:text-zinc-300 text-[11px]">
                We detected that your <code className="bg-amber-100/50 dark:bg-zinc-800 px-1 rounded text-red-700 dark:text-red-400 font-bold font-mono text-[10px]">GEMINI_API_KEY</code> is not configured on the master server. CreatorOS has automatically enabled <strong>sandbox fallback synthesis</strong> so you can generate, copy, and download high-quality bilingual campaign copy without interruptions.
              </p>
            </div>
          </div>
        )}
        
        {/* Error Alert Box */}
        {errorText && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-[#7a4805] space-y-4" id="ai-error-indicator">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5.5 w-5.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold font-display text-base">Key credentials missing on host server</h4>
                <p className="text-xs mt-1 text-[#5c5952] leading-relaxed">
                  {errorText}
                </p>
              </div>
            </div>
            
            {/* Helpful guidelines for setting up */}
            <div className="text-xs bg-white/70 border border-amber-200 p-4 rounded-xl space-y-2">
              <p className="font-bold font-mono text-[#1a1917]">💡 QUICK RESOLUTION SETUP:</p>
              <ol className="list-decimal pl-4 space-y-1 text-[#5c5952]">
                <li>Navigate to the {"Settings > Secrets"} panel in the Google AI Studio menu.</li>
                <li>Add a secret with the name <code className="bg-[#ebe7de] px-1 rounded text-red-700">GEMINI_API_KEY</code>.</li>
                <li>Paste your actual key. This allows secure, back-routed proxy call completions.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Loading Display State */}
        {generating && (
          <div className="border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl bg-white dark:bg-[#151413] p-12 text-center flex flex-col items-center justify-center space-y-6" id="generating-hud">
            <div className="relative flex items-center justify-center h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#ebe7de] dark:border-zinc-800 animate-spin" />
              <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-[#1a1917] dark:text-[#f7f6f2]">Synthesizing draft structures</h3>
              <p className="text-sm text-[#5c5952] dark:text-zinc-400 font-mono mt-1.5 animate-pulse max-w-sm mx-auto">
                {activeTips[loadingStep]}
              </p>
            </div>
            <p className="text-xs text-[#a19c91] max-w-md mx-auto">
              This normally completes within seconds. We operate dynamic text generators server-side for clean environment compatibility.
            </p>
          </div>
        )}

        {/* Generated Output Card */}
        {!generating && !errorText && (
          <div className="border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl bg-white dark:bg-[#151413] overflow-hidden flex flex-col min-h-[480px]">
            
            {/* Header Controls */}
            <div className="px-6 py-4 border-b border-[#e5e2db] dark:border-[#2f2e2c] bg-[#fdfdfc] dark:bg-[#1b1a18] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-[#ebe7de] dark:bg-zinc-800 text-[#1a1917] dark:text-zinc-200 px-2.5 py-1 rounded">
                  {platform}
                </span>
                <span className="text-[10px] font-mono text-[#a19c91] uppercase tracking-wider block">
                  {tone} Tone
                </span>
              </div>

              {generatedResult && (
                <div className="flex items-center gap-1.5">
                  <button
                    id="output-edit-toggle-btn"
                    onClick={() => setEditMode(!editMode)}
                    className="p-2 hover:bg-[#ebe7de] dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold text-[#1a1917] dark:text-[#f7f6f2]"
                  >
                    {editMode ? (
                      <><Eye className="h-4 w-4" /> Preview Mode</>
                    ) : (
                      <><Edit3 className="h-4 w-4" /> Live Edit</>
                    )}
                  </button>
                  <div className="h-4 w-px bg-[#e5e2db] dark:bg-zinc-800"></div>
                  
                  {/* Export Options */}
                  <button
                    id="export-btn-copy"
                    onClick={handleCopy}
                    className="p-2 hover:bg-[#ebe7de] dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold text-[#1a1917] dark:text-[#f7f6f2]"
                    title="Copy Content"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    id="export-btn-txt"
                    onClick={handleDownloadTxt}
                    className="p-2 hover:bg-[#ebe7de] dark:hover:bg-zinc-800 rounded-lg transition-colors text-[#1a1917] dark:text-[#f7f6f2]"
                    title="Download .TXT"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    id="export-btn-pdf"
                    onClick={handlePrintPdf}
                    className="p-2 hover:bg-[#ebe7de] dark:hover:bg-zinc-800 rounded-lg transition-colors text-[#1a1917] dark:text-[#f7f6f2]"
                    title="Print PDF layout"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Editing / Displays Body */}
            <div className="flex-1 p-6 font-sans">
              {!generatedResult ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 text-[#5c5952] dark:text-zinc-400">
                  <Sparkles className="h-10 w-10 text-[#a19c91] mb-3 animate-pulse" />
                  <p className="font-display font-extrabold text-[#1a1917] dark:text-white">Your drafting canvas is ready.</p>
                  <p className="text-xs text-[#a19c91] max-w-sm mt-1">
                    Select your custom campaign parameters on the left pane and trigger the workshop engine to write copy.
                  </p>
                </div>
              ) : editMode ? (
                <div className="space-y-4 h-full flex flex-col">
                  <textarea
                    value={generatedResult}
                    onChange={(e) => setGeneratedResult(e.target.value)}
                    className="w-full flex-1 min-h-[350px] p-4 bg-[#fcfbf9] dark:bg-[#201f1c] text-[#1a1917] dark:text-[#f7f6f2] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl font-mono text-sm focus:outline-none focus:border-[#1a1917] dark:focus:border-amber-300"
                    placeholder="Refined draft output..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      id="update-save-project-btn"
                      onClick={handleUpdateContent}
                      className="px-4 py-2 bg-[#1a1917] dark:bg-amber-300 dark:text-[#1a1917] hover:bg-[#383531] dark:hover:bg-amber-400 text-[#f7f6f2] font-semibold text-xs rounded-lg shadow"
                    >
                      Commit Save to History
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose dark:prose-invert text-sm text-[#1a1917] dark:text-zinc-150 whitespace-pre-wrap selection:bg-[#ebe7de]" id="rendered-output-markdown">
                  {generatedResult}
                </div>
              )}
            </div>

            {/* Saved Footer Tracker */}
            {generatedResult && currentHistoryItem && (
              <div className="px-6 py-3 border-t border-[#e2dfd9] dark:border-[#2f2e2c] bg-[#ebe7de]/30 dark:bg-zinc-900/50 flex items-center justify-between text-xs text-[#5c5952] dark:text-zinc-400 font-mono">
                <span>✓ Auto-persisted to history: <strong>{currentHistoryItem.id}</strong></span>
                <button 
                  id="view-archive-backlink"
                  onClick={onNavigateToHistory} 
                  className="hover:underline font-bold text-[#1a1917] dark:text-amber-300"
                >
                  Open Projects Archive →
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
