import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Copy, 
  Download, 
  Check, 
  HelpCircle, 
  RefreshCw, 
  Edit3, 
  Eye, 
  Cpu, 
  HardDrive, 
  Trash2, 
  Star, 
  Share2, 
  Bookmark, 
  AlertCircle,
  Menu,
  ChevronRight,
  Database,
  ArrowRight,
  Sliders,
  CheckCircle,
  Activity
} from 'lucide-react';
import { HistoryItem } from './types';
import { generateDemoContent, BrandVoice } from './demoGenerator';

interface AICommandCenterProps {
  token: string | null;
  onGenerationComplete: (newItem: HistoryItem) => void;
  onShowToast: (text: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

interface AIPreset {
  id: string;
  title: string;
  prompt: string;
  platform: string;
  tone: string;
  lang: string;
}

export default function AICommandCenter({ token, onGenerationComplete, onShowToast }: AICommandCenterProps) {
  const [topic, setTopic] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'openai' | 'claude' | 'groq'>('gemini');
  const [selectedModel, setSelectedModel] = useState('Gemini 1.5 Pro Ultra');
  const [selectedLanguage, setSelectedLanguage] = useState('Bilingual Swahili + English');
  const [selectedTone, setSelectedTone] = useState('Professional & Bold');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputs, setOutputs] = useState<{ id: string; type: string; title: string; text: string }[]>([]);
  const [activeOutputId, setActiveOutputId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom states for failover demonstration
  const [enableFailoverSim, setEnableFailoverSim] = useState(true);
  const [failoverSteps, setFailoverSteps] = useState<string[]>([]);
  const [tokenUsageEst, setTokenUsageEst] = useState(0);

  // Creative scoring states (Module 3: Viral Content Engine)
  const [scoringResults, setScoringResults] = useState<{
    heatScore: number;
    engagement: number;
    ctr: number;
    watchTime: number;
    triggers: string[];
    rewriteAdvice: string;
  } | null>(null);

  // Reusable Prompt Preset State (Memory Cache)
  const [promptPresets, setPromptPresets] = useState<AIPreset[]>([
    { id: 'p-1', title: 'Tanzania Cargo Delivery', prompt: 'Dar-focused 24hr delivery cargo logistics door drops with M-Pesa cash flows', platform: 'TikTok Script', tone: 'Bold', lang: 'Bilingual Swahili + English' },
    { id: 'p-2', title: 'Affiliate Travel Agency', prompt: 'Review of affordable direct flights to Zanzibar with booking codes', platform: 'Instagram Caption', tone: 'Witty', lang: 'English Standard' },
    { id: 'p-3', title: 'SaaS Multi-User Pitch', prompt: 'Eliminating manual spreadsheets for shop owners with a joint team license', platform: 'LinkedIn Post', tone: 'Professional', lang: 'Bilingual Swahili + English' }
  ]);

  const [pinnedPresets, setPinnedPresets] = useState<string[]>(['p-1']);
  const [newPresetTitle, setNewPresetTitle] = useState('');
  const [newPresetPrompt, setNewPresetPrompt] = useState('');

  // Provider metadata with status checks
  const providers = {
    gemini: { 
      name: 'Google GenAI (Gemini)', 
      status: 'active', 
      latency: '240ms', 
      desc: 'Native multimodel processing standard',
      models: ['Gemini 1.5 Pro Ultra', 'Gemini 3.5-flash Turbo', 'Gemini 1.5 Flash']
    },
    openai: { 
      name: 'OpenAI Enterprise GPT-4', 
      status: 'active', 
      latency: '410ms', 
      desc: 'Highly structured formatting benchmark',
      models: ['GPT-4o Omniverse', 'GPT-4-turbo Custom', 'o1-preview Reasoning']
    },
    claude: { 
      name: 'Anthropic Claude 3.5 Sonnet', 
      status: 'active', 
      latency: '390ms', 
      desc: 'Rich longform creative descriptions',
      models: ['Claude 3.5 Sonnet v2', 'Claude 3 Haiku Speedster']
    },
    groq: { 
      name: 'Groq LLaMA-3 Stack', 
      status: 'active', 
      latency: '45ms', 
      desc: 'High refresh rate caching and sub-second output',
      models: ['Llama 3.1 70B Instant', 'Mixtral 8x7B Fast-Response']
    }
  };

  useEffect(() => {
    // Dynamically estimate character and token density based on topic length
    const wordsCount = topic.trim() ? topic.trim().split(/\s+/).length : 0;
    setTokenUsageEst(Math.round(wordsCount * 1.45 + 320));
  }, [topic]);

  const handleApplyPreset = (preset: AIPreset) => {
    setTopic(preset.prompt);
    setSelectedTone(preset.tone);
    setSelectedLanguage(preset.lang);
    onShowToast(`Loaded custom workspace draft memory: "${preset.title}"`, "info");
  };

  const handleTogglePin = (id: string) => {
    setPinnedPresets(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    onShowToast("Updated pinned template memory rules.", "success");
  };

  const handleAddPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetTitle.trim() || !newPresetPrompt.trim()) {
      onShowToast("Please specify both title and concept for the preset.", "warning");
      return;
    }
    const newId = `p-${Date.now()}`;
    const newPrs: AIPreset = {
      id: newId,
      title: newPresetTitle,
      prompt: newPresetPrompt,
      platform: 'Custom Generation Preset',
      tone: selectedTone,
      lang: selectedLanguage
    };
    setPromptPresets(prev => [...prev, newPrs]);
    setPinnedPresets(prev => [...prev, newId]);
    setNewPresetTitle('');
    setNewPresetPrompt('');
    onShowToast(`Cached custom template bookmark: "${newPrs.title}"!`, "success");
  };

  const executeCommandMatrix = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      onShowToast("Please enter a concept or select a ready workflow template preset.", "warning");
      return;
    }

    setIsGenerating(true);
    setOutputs([]);
    setFailoverSteps([]);
    setScoringResults(null);

    // Simulate failover mechanism logging if enabled
    if (enableFailoverSim) {
      setFailoverSteps(prev => [...prev, `[0ms] Dispatching primary socket request to ${providers[selectedProvider].name}...`]);
      await new Promise(r => setTimeout(r, 600));
      setFailoverSteps(prev => [...prev, `[600ms] NOTICE: Primary pipeline timed out or busy. Triggering AI Failover Router...`]);
      await new Promise(r => setTimeout(r, 450));
      setFailoverSteps(prev => [...prev, `[1050ms] Failover successful! Rerouting query dynamically to backup sandbox socket.`]);
    } else {
      setFailoverSteps([`[0ms] Accessing secure pipeline via ${providers[selectedProvider].name} ... OK.`]);
    }

    // Generate multiple synchronized outputs at once as requested: Hook, Script, Caption!
    const hookAsset = generateDemoContent('hooks', topic, { language: selectedLanguage, tone: selectedTone });
    const scriptAsset = generateDemoContent('script', topic, { language: selectedLanguage, tone: selectedTone });
    const captionAsset = generateDemoContent('caption', topic, { language: selectedLanguage, tone: selectedTone });
    const hashtagAsset = generateDemoContent('hashtags', topic, { language: selectedLanguage, tone: selectedTone });

    await new Promise(r => setTimeout(r, 1200));

    const generatedSet = [
      { id: 'out-1', type: 'hooks', title: '🪝 Viral Hook Deck', text: hookAsset },
      { id: 'out-2', type: 'script', title: '🎬 Scene Script Studio', text: scriptAsset },
      { id: 'out-3', type: 'caption', title: '✍️ Caption Factory Copy', text: captionAsset },
      { id: 'out-4', type: 'hashtags', title: '🏷️ SEO Hashtag Pool', text: hashtagAsset }
    ];

    setOutputs(generatedSet);
    setActiveOutputId('out-1');

    // Predict scores dynamically based on the length and presence of Swahili/English language optimization
    const lengthBoost = topic.length > 50 ? 5 : 0;
    const languageBonus = selectedLanguage.toLowerCase().includes('swahili') ? 8 : 2;
    
    // Viral scoring engine rules calculations
    const predictedHeat = Math.min(99, 78 + lengthBoost + languageBonus);
    const predictedEngagement = Math.min(98, 72 + Math.round(Math.random() * 8) + languageBonus);
    const predictedCtr = 4.2 + (predictedHeat / 20);

    setScoringResults({
      heatScore: predictedHeat,
      engagement: predictedEngagement,
      ctr: parseFloat(predictedCtr.toFixed(1)),
      watchTime: 18.5,
      triggers: [
        'Curiosity Gap (High)', 
        selectedLanguage.toLowerCase().includes('swahili') ? 'East African Cultural Anchors (Bilingual Trust)' : 'Professional standard authority text',
        'Direct Urgency urgency phrasing (PAS formula)'
      ],
      rewriteAdvice: `Increase retention rates by trimming the first 4 words. Insert a Swahili greeting ('Habari!') to build stronger local connections immediately.`
    });

    // Mirror historical save
    const demoHist: HistoryItem = {
      id: `virtual-cmd-${Date.now()}`,
      userId: 'user-demo',
      title: `${topic.slice(0, 24)}... (${selectedProvider.toUpperCase()})`,
      prompt: topic,
      result: `${hookAsset}\n\n===\n\n${scriptAsset}`,
      format: 'Multi-Channel Campaign pack',
      tone: selectedTone,
      category: 'Command Center Deck',
      createdAt: new Date().toISOString()
    };
    onGenerationComplete(demoHist);
    onShowToast("Command deck compiled 4 assets simultaneously!", "success");
    setIsGenerating(false);
  };

  const handleCopySingle = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast("Asset Markdown copied!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8" id="ai-command-center-workspace">
      
      {/* Visual Title Banner representing dynamic AI power */}
      <div className="bg-gradient-to-br from-amber-400/20 via-[#f7f6f2] to-[#ebe7de]/30 dark:from-amber-950/20 dark:via-[#1a1917] dark:to-zinc-900 border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl" id="command-center-hero">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 select-text">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-400 font-mono font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md mb-2">
              <Cpu className="h-3.5 w-3.5 text-amber-500 animate-spin" /> Live Synchronized Multi-Model Cockpit
            </div>
            <h1 className="font-display font-black text-2xl text-[#1a1917] dark:text-white">AI Creator Command Center & Router</h1>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-1 pr-4">
              Switch multi-model processors, evaluate token capacities, check fallback queues, and trigger four campaign output formats instantly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-[#a19c91]">
              Gateway: <strong className="text-[#1a1917] dark:text-amber-200">22,000 Sandbox tokens ready</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Dynamic Left workbench margin col */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Preset memory bookmarks drawer */}
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-4 rounded-3xl space-y-4">
            <h4 className="text-[10px] font-mono font-black uppercase text-[#a19c91] tracking-wider flex items-center justify-between px-1">
              <span>📌 Custom Saved Memory Presets</span>
              <span className="text-[9px] text-[#5c5952]">({promptPresets.length} items)</span>
            </h4>

            {/* Presets listing */}
            <div className="space-y-1.5 select-none">
              {promptPresets.map((prs) => {
                const isPinned = pinnedPresets.includes(prs.id);
                return (
                  <div 
                    key={prs.id}
                    className="p-2.5 bg-[#fcfbf9] dark:bg-[#151413] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl flex items-center justify-between text-left transition-all hover:border-[#1a1917]"
                  >
                    <button 
                      onClick={() => handleApplyPreset(prs)}
                      className="flex-1 text-left cursor-pointer"
                    >
                      <strong className="text-[11px] block text-[#1a1917] dark:text-white font-bold">{prs.title}</strong>
                      <span className="text-[9px] text-[#a19c91] block truncate max-w-[200px]">{prs.prompt}</span>
                    </button>
                    <button 
                      onClick={() => handleTogglePin(prs.id)}
                      className="p-1 text-[#a19c91] hover:text-amber-500 rounded"
                    >
                      <Star className={`h-3.5 w-3.5 ${isPinned ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick add template preset form */}
            <form onSubmit={handleAddPreset} className="space-y-2.5 pt-3 border-t border-dashed border-[#f2eee8] dark:border-[#2f2e2c]">
              <input 
                type="text"
                placeholder="Naming memory trigger..."
                value={newPresetTitle}
                onChange={(e) => setNewPresetTitle(e.target.value)}
                className="w-full p-2 bg-[#fdfdfc] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-lg text-[11px] focus:outline-none"
              />
              <textarea 
                rows={2}
                placeholder="Write preset prompt rules..."
                value={newPresetPrompt}
                onChange={(e) => setNewPresetPrompt(e.target.value)}
                className="w-full p-2 bg-[#fdfdfc] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-lg text-[11px] focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#1a1917] dark:text-white font-mono text-[9px] font-black uppercase rounded-lg cursor-pointer"
              >
                + Save Active Preset Memory
              </button>
            </form>
          </div>

          {/* Provider Selection Status Card */}
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-4 rounded-3xl space-y-4">
            <h4 className="text-[10px] font-mono font-black uppercase text-[#a19c91] tracking-wider">
              🤖 Multi-Model Provider Configuration
            </h4>

            <div className="space-y-1.5 select-none">
              {(Object.keys(providers) as Array<keyof typeof providers>).map((key) => {
                const prov = providers[key];
                const isSelected = selectedProvider === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedProvider(key);
                      setSelectedModel(prov.models[0]);
                      onShowToast(`Switched active prompt router to: ${prov.name}`, "info");
                    }}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer
                      ${isSelected 
                        ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917] border-[#1a1917]' 
                        : 'bg-[#fcfbf9] dark:bg-[#151413] border-[#e2dfd9] dark:border-[#2f2e2c] hover:bg-[#ebe7de]/30 text-zinc-700 dark:text-zinc-300'}`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs flex items-center gap-1">
                        {prov.name}
                        {prov.status === 'active' && (
                          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block" />
                        )}
                      </span>
                      <p className="text-[9px] opacity-80 leading-tight">{prov.desc}</p>
                    </div>
                    <span className="text-[9px] font-mono opacity-70 block">{prov.latency}</span>
                  </button>
                );
              })}
            </div>

            {/* Nested Model list select drops */}
            <div className="pt-2">
              <label className="block text-[9px] font-mono uppercase font-black text-[#a19c91] mb-1">Target Sub-Model Selection</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2.5 bg-[#fdfdfc] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 text-xs font-bold rounded-xl focus:outline-none"
              >
                {providers[selectedProvider].models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Dynamic Interactive Failover Simulation config */}
            <div className="pt-2 border-t border-dashed border-[#ebe7de] dark:border-[#2f2e2c] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-black text-[10px] font-mono uppercase text-[#5c5952] dark:text-[#a19c91]">Intelligent Auto-Failover Router</span>
                <p className="text-[9px] leading-tight text-[#a19c91]">Reroute automatically if primary drops</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEnableFailoverSim(!enableFailoverSim);
                  onShowToast(`Auto-failover router toggled: ${!enableFailoverSim ? 'ENABLED' : 'DISABLED'}`, "info");
                }}
                className={`px-2.5 py-1 text-[9px] font-mono uppercase font-black rounded-lg
                  ${enableFailoverSim ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-zinc-100 text-[#5c5952] dark:bg-zinc-800'}`}
              >
                {enableFailoverSim ? 'On' : 'Off'}
              </button>
            </div>

          </div>

        </div>

        {/* Workspace interactive input and output splits */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Master Form Workspace container */}
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl shadow-sm" id="command-center-prompt-form">
            <form onSubmit={executeCommandMatrix} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1.5 flex justify-between">
                  <span>Enter Concept Topic or Niche Parameters *</span>
                  <span className="text-[10px] italic">Est. Tokens: {tokenUsageEst}</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Tanzanian Safari Tours or a digital product agency drop booking model."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3 bg-[#fcfbf9] dark:bg-[#151413] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl text-xs dark:text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1">Target Language Preference</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 text-xs font-bold rounded-xl focus:outline-none"
                  >
                    <option value="Bilingual Swahili + English">Bilingual Swahili + English</option>
                    <option value="English Standard VIP">English Standard VIP</option>
                    <option value="Swahili-Accented East African style">Swahili Only Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1">Default Persona Tone</label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 text-xs font-bold rounded-xl focus:outline-none"
                  >
                    <option value="Professional & Bold">Professional & Bold</option>
                    <option value="Energetic Storyteller Vibe">Energetic Storyteller Vibe</option>
                    <option value="Witty & Controversial">Witty & Controversial</option>
                    <option value="Empathetic & Warm">Empathetic & Warm</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[#f2eee8] dark:border-[#2f2e2c] pt-4">
                <span className="text-[10px] font-mono text-[#a19c91]">
                  Current Cockpit Processor: <strong>{selectedModel}</strong>
                </span>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-3 bg-[#1a1917] hover:bg-[#383531] dark:bg-amber-300 dark:hover:bg-amber-400 dark:text-[#1a1917] text-white font-bold font-display text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Splitting Outputs...
                    </>
                  ) : (
                    <>
                      Compile Multi-Channel Assets <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Display active execution route parameters & failover simulation logs */}
          {failoverSteps.length > 0 && (
            <div className="bg-[#111110] text-[#ebe7de] p-3.5 rounded-2xl font-mono text-[10px] border border-[#2f2e2c] space-y-1">
              <div className="flex items-center justify-between text-[#a19c91] text-[9px] uppercase tracking-wider mb-1 font-bold">
                <span>🔐 Failover Router live operations log</span>
                <span className="text-emerald-500 animate-pulse">Running live</span>
              </div>
              {failoverSteps.map((step, index) => (
                <div key={index} className="text-[#a19c91]">
                  <span className="text-amber-400 font-bold">&gt;</span> {step}
                </div>
              ))}
            </div>
          )}

          {/* Tabbed multi-generation outputs split frame */}
          {outputs.length > 0 && (
            <div className="space-y-4" id="synchronized-outputs-panel">
              
              {/* Output select tabs */}
              <div className="flex items-center gap-1 bg-[#ebe7de]/50 dark:bg-zinc-950 p-1 border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl overflow-x-auto select-none">
                {outputs.map((out) => (
                  <button
                    key={out.id}
                    onClick={() => setActiveOutputId(out.id)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg whitespace-nowrap cursor-pointer transition-all
                      ${activeOutputId === out.id 
                        ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' 
                        : 'text-[#5c5952] hover:text-[#1a1917]'}`}
                  >
                    {out.type === 'hooks' && '🪝 Viral Hooks'}
                    {out.type === 'script' && '🎬 Vertical Script'}
                    {out.type === 'caption' && '✍️ Caption copy'}
                    {out.type === 'hashtags' && '🏷️ SEO Hashtags'}
                  </button>
                ))}
              </div>

              {/* Selected Output Renderer display */}
              <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl">
                {outputs.map((out) => {
                  if (out.id !== activeOutputId) return null;
                  return (
                    <div key={out.id} className="relative">
                      
                      <div className="px-6 py-4.5 border-b border-[#f2eee8] dark:border-[#2f2e2c] bg-[#fcfdfa] dark:bg-[#1c1b19] flex items-center justify-between">
                        <div>
                          <h4 className="font-display font-semibold text-xs tracking-tight uppercase text-zinc-400">Selected Segment Details</h4>
                          <span className="text-xs font-bold text-[#1a1917] dark:text-white mt-1 block">{out.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopySingle(out.id, out.text)}
                            className="px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === out.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copiedId === out.id ? "Copied" : "Copy"}
                          </button>
                          <button
                            onClick={() => {
                              onShowToast("Draft exported to global calendar", "success");
                            }}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                            title="Pin to Content Calendar"
                          >
                            <Bookmark className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-6 select-text">
                        <pre className="text-xs leading-relaxed font-sans text-[#1a1917] dark:text-[#f7f6f2] whitespace-pre-wrap">
                          {out.text}
                        </pre>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Rendering Module 3: Deep visual content scores dashboard */}
              {scoringResults && (
                <div className="p-6 bg-gradient-to-br from-amber-500/10 to-[#fdfcf9] dark:to-[#151413] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl space-y-4 select-text max-w-4xl">
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-800 dark:text-amber-400 font-bold px-2 py-0.5 rounded">
                        📈 ViralForge Analytics Engine score predictions
                      </span>
                      <h4 className="font-display font-black text-sm text-[#1a1917] dark:text-white mt-1">Scroll-Stop Heat & Visual Predictions</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-3 rounded-2xl text-center">
                      <span className="text-[9px] font-mono text-[#a19c91] block">VIRAL HEAT INDEX</span>
                      <strong className="text-xl font-display font-bold text-amber-500">{scoringResults.heatScore}%</strong>
                    </div>
                    <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-3 rounded-2xl text-center">
                      <span className="text-[9px] font-mono text-[#a19c91] block">predicted ENGAGEMENT</span>
                      <strong className="text-xl font-display font-bold text-rose-500">{scoringResults.engagement}/100</strong>
                    </div>
                    <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-3 rounded-2xl text-center">
                      <span className="text-[9px] font-mono text-[#a19c91] block">EXPECTED CTR SCORE</span>
                      <strong className="text-xl font-display font-bold text-emerald-500">{scoringResults.ctr}%</strong>
                    </div>
                    <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-3 rounded-2xl text-center">
                      <span className="text-[9px] font-mono text-[#a19c91] block">WATCH-TIME RETENTION</span>
                      <strong className="text-xl font-display font-bold text-indigo-500">{scoringResults.watchTime}s</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-zinc-950 rounded-2xl border border-dashed border-[#ebe7de]/80 text-[11px] leading-relaxed">
                    <span className="font-mono text-[9px] font-black uppercase text-rose-500 block">🤖 Critical Improvement Recommendation</span>
                    <p className="text-[#5c5952] dark:text-[#a19c91] mt-0.5">{scoringResults.rewriteAdvice}</p>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
