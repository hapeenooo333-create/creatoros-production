import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  FileText, 
  Video, 
  Hash, 
  ArrowRight, 
  Loader2, 
  HelpCircle, 
  Bookmark, 
  Copy, 
  Check, 
  Download,
  Brain,
  Volume2,
  Repeat,
  ShoppingCart,
  Percent,
  CheckCircle,
  Briefcase,
  Play,
  Calendar,
  Layers,
  UserCheck,
  Plus,
  Trash2,
  ChevronRight,
  Eye,
  Sliders,
  Sparkle
} from 'lucide-react';
import { HistoryItem } from './types';
import { generateDemoContent, BrandVoice } from './demoGenerator';

interface SpecializedGeneratorsProps {
  token: string | null;
  onGenerationComplete: (newItem: HistoryItem) => void;
  onShowToast: (text: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

// All available 16 specialized tools categorized
type ToolType = 
  | 'hooks'             // Swahili-English Hook Generator
  | 'script'            // Script Studio
  | 'caption'           // Caption Factory
  | 'hashtags'          // Hashtag Generator
  | 'trends'            // Idea & Trend Hub
  | 'planning'          // Video Clip Planner (B-roll, CapCut instructions)
  | 'voiceover'         // AI Voice-over Studio UI
  | 'repurpose'         // Content Repurposing Studio
  | 'ecommerce'         // Ecommerce Ad Studio
  | 'affiliate'         // Affiliate Marketing Lab
  | 'leadgen'           // Lead Generation Center
  | 'closer'            // Deal Closer (sales script, objection counters)
  | 'coach'             // AI Business Coach (monetizing plans, first 100 users)
  | 'brandvoice'        // Brand Voice Builder (niche, brand colors, CTA phrases)
  | 'calendar'          // Inside-the-app Content Calendar
  | 'growthkit';        // Social Media Growth Toolkit (bios, about sections, replies)

interface ToolItem {
  id: ToolType;
  label: string;
  category: 'concepts' | 'writing' | 'production' | 'sales' | 'growth';
  desc: string;
  icon: any;
  flavor: string;
}

export default function SpecializedGenerators({ token, onGenerationComplete, onShowToast }: SpecializedGeneratorsProps) {
  const [activeTool, setActiveTool] = useState<ToolType>('hooks');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Custom inputs for specialized states
  const [selectedLanguage, setSelectedLanguage] = useState('Bilingual (Swahili + English)');
  const [selectedHookStyle, setSelectedHookStyle] = useState('Counter-Intuitive');
  const [selectedVideoStyle, setSelectedVideoStyle] = useState('Problem-Agitate-Solve');
  const [selectedVoiceProfile, setSelectedVoiceProfile] = useState('Professional Male (Fenrir)');
  const [selectedVoiceSwahili, setSelectedVoiceSwahili] = useState('Yes (Accented Kiswahili)');
  
  // Voice Simulator Audio Playing state (Emulated in the UI!)
  const [voPlaying, setVoPlaying] = useState(false);
  const [voProgress, setVoProgress] = useState(0);

  // Brand Voice state synced with local storage
  const [brandNiche, setBrandNiche] = useState(() => localStorage.getItem('creatoros_niche') || 'E-commerce & Digital Tools');
  const [brandAudience, setBrandAudience] = useState('Aspiring Online Shop Owners');
  const [brandTone, setBrandTone] = useState('Bold, Energetic & Trustworthy');
  const [brandOffer, setBrandOffer] = useState('Modern Cargo Shipping & Air Freight Deliveries');
  const [brandColor, setBrandColor] = useState('Amber Gold & Slate Black');
  const [brandCta, setBrandCta] = useState('Click now to unlock DSM door delivery within 24 hours!');

  // Calendar active items list state (Interactive database simulator)
  const [calendarItems, setCalendarItems] = useState([
    { id: 'cal-1', date: 'Monday', title: 'Myth-busting short form video plan', outlet: 'TikTok', tone: 'Disruptive', status: 'ready' },
    { id: 'cal-2', date: 'Wednesday', title: 'Why cargo delays occur inside DSM port', outlet: 'Instagram Caption', tone: 'Educational', status: 'script' },
    { id: 'cal-3', date: 'Friday', title: 'Weekend discount bonus announcement', outlet: 'WhatsApp Broadcast', tone: 'Energetic', status: 'idea' },
  ]);
  const [newCalDate, setNewCalDate] = useState('Monday');
  const [newCalTitle, setNewCalTitle] = useState('');
  const [newCalOutlet, setNewCalOutlet] = useState('TikTok');
  const [newCalStatus, setNewCalStatus] = useState('idea');

  // Voiceover Simulator Progress Tracker
  useEffect(() => {
    let timer: any;
    if (voPlaying) {
      timer = setInterval(() => {
        setVoProgress((prev) => {
          if (prev >= 100) {
            setVoPlaying(false);
            onShowToast("Voice-over audio simulation completed!", "success");
            return 0;
          }
          return prev + 5;
        });
      }, 300);
    } else {
      setVoProgress(0);
    }
    return () => clearInterval(timer);
  }, [voPlaying]);

  const tools: ToolItem[] = [
    // CONCEPT GROUP
    { id: 'trends', label: 'Idea & Trend Hub', category: 'concepts', icon: Brain, desc: 'TikTok, Reels, product angles & newsjacking topics.', flavor: 'Trends & Discovery' },
    { id: 'coach', label: 'AI Business Coach', category: 'concepts', icon: Briefcase, desc: 'Growth strategies, monetization & daily founder tasks.', flavor: 'Startup Strategic Blueprints' },
    { id: 'brandvoice', label: 'Brand Voice Builder', category: 'concepts', icon: Sparkles, desc: 'Lock corporate tones, target demographics & niches.', flavor: 'Corporate Persona Locked' },
    
    // WRITING GROUP
    { id: 'hooks', label: 'Scroll-Stopping Hooks', category: 'writing', icon: Sparkle, desc: 'English + Swahili hooks formatted with attention scoring.', flavor: 'Viral Hooks Formulae' },
    { id: 'script', label: 'Script Studio Copywriter', category: 'writing', icon: Video, desc: 'TikTok drafts, YouTube longs, UGC pitches & webinars.', flavor: 'Ready Presentation Scripts' },
    { id: 'caption', label: 'Caption Factory', category: 'writing', icon: FileText, desc: 'Clean, formatted, spaced socials & Swahili CTAs.', flavor: 'Instagram, LinkedIn & FB Captions' },
    { id: 'hashtags', label: 'Viral Tags & SEO Keys', category: 'writing', icon: Hash, desc: 'Local Tanzania, AI, ecommerce & broad search keys.', flavor: 'SEO Metadata Engine' },

    // PRODUCTION GROUP
    { id: 'planning', label: 'Video Clip Planner', category: 'production', icon: Video, desc: 'CapCut advice, scene visuals, 9:16 frame guides.', flavor: 'Scene-by-scene editing instructions' },
    { id: 'voiceover', label: 'AI Voice-over Studio UI', category: 'production', icon: Volume2, desc: 'Interactive voice actor preview & voiceover generator.', flavor: 'Tonal Speech Synthesis Previewer' },
    { id: 'repurpose', label: 'Content Repourposer', category: 'production', icon: Repeat, desc: 'Split one core concept into 5 formatted channels.', flavor: 'Multiplex Content Spacing' },

    // SALES GROUP
    { id: 'ecommerce', label: 'Ecommerce Ad Lab', category: 'sales', icon: ShoppingCart, desc: 'UGC product angles, Problem PAS ads & price stacks.', flavor: 'Direct Conversion Facebook/TikTok Ads' },
    { id: 'affiliate', label: 'Affiliate Marketing Lab', category: 'sales', icon: Percent, desc: 'Offer pitches, reviews & WhatsApp closing responses.', flavor: 'Affiliate Pipeline Accelerators' },
    { id: 'leadgen', label: 'Lead Gen & Outreach', category: 'sales', icon: UserCheck, desc: 'Unpacking cold DM drafts, outreach sheets & emails.', flavor: 'Inbound Customer Pipelines' },
    { id: 'closer', label: 'The Deal Closer', category: 'sales', icon: CheckCircle, desc: 'Sales scripts, price objection & upsell patterns.', flavor: 'High-Ticket CRM Objection Solvers' },

    // AUDIENCE GROUP
    { id: 'growthkit', label: 'Social Growth Toolkit', category: 'growth', icon: Sparkles, desc: 'AIGenerated profile bios, about pages & reply tags.', flavor: 'Authority Brand Amplifiers' },
    { id: 'calendar', label: 'Content Calendar', category: 'growth', icon: Calendar, desc: 'Map posting schedule, tracker states, and backlog.', flavor: 'Publish Campaign Pipeline Planner' }
  ];

  const handleSaveBrandVoice = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('creatoros_niche', brandNiche);
    onShowToast("Brand Core Identity cached inside sandbox local storage!", "success");
    setResult(generateDemoContent('brandvoice', topic, {
      brandVoice: {
        niche: brandNiche,
        targetAudience: brandAudience,
        tone: brandTone,
        offer: brandOffer,
        contentStyle: 'Educational, Professional, Bold',
        language: selectedLanguage,
        brandColors: brandColor,
        ctaPhrase: brandCta
      }
    }));
  };

  const handleAddCalendarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCalTitle.trim()) {
      onShowToast("Please specify the title of your campaign project.", "warning");
      return;
    }
    const newItem = {
      id: `cal-${Date.now()}`,
      date: newCalDate,
      title: newCalTitle,
      outlet: newCalOutlet,
      tone: 'Corporate Brand Standard',
      status: newCalStatus
    };
    setCalendarItems(prev => [newItem, ...prev]);
    setNewCalTitle('');
    onShowToast(`Dispatched project idea into Content Calendar: "${newCalTitle}"`, "success");
  };

  const handleDeleteCalendarItem = (id: string) => {
    setCalendarItems(prev => prev.filter(c => c.id !== id));
    onShowToast("Removed draft row from scheduler grid.", "info");
  };

  const handleToggleCalendarStatus = (id: string) => {
    setCalendarItems(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'idea' ? 'script' : c.status === 'script' ? 'ready' : c.status === 'ready' ? 'posted' : 'idea';
        onShowToast(`Upgraded project draft to [${nextStatus.toUpperCase()}] stage`, "info");
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    
    // Simulated billing context
    onShowToast("Connecting security gateway & packing metadata formats...", "info");

    const activeVoice: BrandVoice = {
      niche: brandNiche,
      targetAudience: brandAudience,
      tone: brandTone,
      offer: brandOffer,
      contentStyle: 'Persuasive & Insightful',
      language: selectedLanguage,
      brandColors: brandColor,
      ctaPhrase: brandCta
    };

    // Attempt Server Live Generation (Routes via API endpoint)
    let extraInputParam = '';
    if (activeTool === 'hooks') extraInputParam = selectedHookStyle;
    if (activeTool === 'script') extraInputParam = selectedVideoStyle;
    if (activeTool === 'voiceover') extraInputParam = selectedVoiceProfile;

    // To prevent total interruption if API secrets are absent on start, 
    // we fetch from backend. If backend returns an error/503 status,
    // we seamlessly fall back to our high-fidelity, high-completeness Offline mock generator.
    try {
      // Craft realistic prompt for servers
      let serverPrompt = `Specialized Category: ${activeTool}. Context Topic: ${topic || 'CreatorOS system'}. Custom Preferences: ${JSON.stringify(activeVoice)}. Extra Settings Style: ${extraInputParam}`;
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: serverPrompt,
          tone: brandTone,
          platform: 'ViralForge Specialized: ' + activeTool,
          length: 'medium',
          audience: brandAudience,
          objective: 'Funnels & Brand Trust'
        })
      });

      const data = await res.json();
      if (res.ok && data.content) {
        setResult(data.content);
        onGenerationComplete(data.historyItem);
        onShowToast("Successfully processed draft using server-side Gemini 3.5-flash!", "success");
      } else {
        // Fall back to high-integrity client generator
        const fallbackValue = generateDemoContent(activeTool, topic, {
          tone: brandTone,
          brandVoice: activeVoice,
          extraParam: extraInputParam,
          language: selectedLanguage,
          volume: 'medium'
        });
        setResult(fallbackValue);
        
        // Emulate saved project item locally for continuous history display
        const virtualHistoryItem: HistoryItem = {
          id: `hist-offline-${Date.now()}`,
          userId: 'user-demo',
          title: topic ? (topic.slice(0, 30) + "...") : `${activeTool} Sandbox Template`,
          prompt: topic || 'Custom brand pitch',
          result: fallbackValue,
          format: tools.find(t => t.id === activeTool)?.label || 'Specialized Format',
          tone: brandTone,
          category: activeTool,
          createdAt: new Date().toISOString()
        };
        onGenerationComplete(virtualHistoryItem);
        onShowToast(`Sandbox fallback completed. Generated realistic offline demo draft.`, "info");
      }
    } catch (err) {
      // Seamless offline fallback
      const fallbackValue = generateDemoContent(activeTool, topic, {
        tone: brandTone,
        brandVoice: activeVoice,
        extraParam: extraInputParam,
        language: selectedLanguage,
        volume: 'medium'
      });
      setResult(fallbackValue);
      onShowToast("Sandbox active. Displaying high-fidelity copy template.", "info");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    onShowToast("Copied draft Markdown fully to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `viralforge_${activeTool}_draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast("Draft exported as generic .txt file securely.", "success");
  };

  return (
    <div className="space-y-8" id="specialized-generators-hud">
      
      {/* Platform Title Box */}
      <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl" id="specialized-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-text">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-mono font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md mb-2">
              <Sliders className="h-3 w-3 text-amber-500" /> ViralForge Toolkit Matrix
            </div>
            <h1 className="font-display font-black text-[#1a1917] dark:text-[#f7f6f2] text-2xl tracking-tight">Specialized Creators & Business Engines</h1>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-1 italic">
              Empower startups, agency builders, local ecommerce shops, and influencers across East Africa with 16 professional automation layouts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 dark:bg-amber-900/10 dark:text-amber-300 px-3 py-1.5 rounded-full">
              ⚡ LIVE DEMO PERSISTED
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand Margin Column: 16 tool selectors categorized nested grouping */}
        <aside className="lg:col-span-4 space-y-6" id="specialized-tools-sidebar">
          
          {/* Group: Concepts & Strategy */}
          <div className="bg-white dark:bg-[#151413] p-4 border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl space-y-2">
            <h4 className="text-[10px] font-mono tracking-widest uppercase font-black text-[#a19c91] px-2 mb-2">💡 Concepts & Strategy</h4>
            <div className="space-y-1">
              {tools.filter(t => t.category === 'concepts').map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    id={`specialized-btn-${tool.id}`}
                    onClick={() => { setActiveTool(tool.id); setResult(''); }}
                    className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl transition-all cursor-pointer text-xs
                      ${isActive 
                        ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' 
                        : 'hover:bg-[#f6f5f2] dark:hover:bg-zinc-800 text-[#5c5952] dark:text-zinc-300'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      <div>
                        <span className="font-bold block">{tool.label}</span>
                        <span className="text-[9px] opacity-75">{tool.desc.slice(0, 40)}...</span>
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group: Copy & Writing */}
          <div className="bg-white dark:bg-[#151413] p-4 border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl space-y-2">
            <h4 className="text-[10px] font-mono tracking-widest uppercase font-black text-[#a19c91] px-2 mb-2">✍️ Conversion Writing</h4>
            <div className="space-y-1">
              {tools.filter(t => t.category === 'writing').map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    id={`specialized-btn-${tool.id}`}
                    onClick={() => { setActiveTool(tool.id); setResult(''); }}
                    className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl transition-all cursor-pointer text-xs
                      ${isActive 
                        ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' 
                        : 'hover:bg-[#f6f5f2] dark:hover:bg-zinc-800 text-[#5c5952] dark:text-zinc-300'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      <div>
                        <span className="font-bold block">{tool.label}</span>
                        <span className="text-[9px] opacity-75">{tool.desc.slice(0, 40)}...</span>
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group: Film & Audio Production */}
          <div className="bg-white dark:bg-[#151413] p-4 border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl space-y-2">
            <h4 className="text-[10px] font-mono tracking-widest uppercase font-black text-[#a19c91] px-2 mb-2">🎬 Media Production</h4>
            <div className="space-y-1">
              {tools.filter(t => t.category === 'production').map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    id={`specialized-btn-${tool.id}`}
                    onClick={() => { setActiveTool(tool.id); setResult(''); }}
                    className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl transition-all cursor-pointer text-xs
                      ${isActive 
                        ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' 
                        : 'hover:bg-[#f6f5f2] dark:hover:bg-zinc-800 text-[#5c5952] dark:text-zinc-300'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      <div>
                        <span className="font-bold block">{tool.label}</span>
                        <span className="text-[9px] opacity-75">{tool.desc.slice(0, 40)}...</span>
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group: Commerce & Sales */}
          <div className="bg-white dark:bg-[#151413] p-4 border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl space-y-2">
            <h4 className="text-[10px] font-mono tracking-widest uppercase font-black text-[#a19c91] px-2 mb-2">💰 Funnels & monetization</h4>
            <div className="space-y-1">
              {tools.filter(t => t.category === 'sales').map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    id={`specialized-btn-${tool.id}`}
                    onClick={() => { setActiveTool(tool.id); setResult(''); }}
                    className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl transition-all cursor-pointer text-xs
                      ${isActive 
                        ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' 
                        : 'hover:bg-[#f6f5f2] dark:hover:bg-zinc-800 text-[#5c5952] dark:text-zinc-300'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      <div>
                        <span className="font-bold block">{tool.label}</span>
                        <span className="text-[9px] opacity-75">{tool.desc.slice(0, 40)}...</span>
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group: Growth & Calendar */}
          <div className="bg-white dark:bg-[#151413] p-4 border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl space-y-2">
            <h4 className="text-[10px] font-mono tracking-widest uppercase font-black text-[#a19c91] px-2 mb-2">📈 Growth & Schedule Operations</h4>
            <div className="space-y-1">
              {tools.filter(t => t.category === 'growth').map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    id={`specialized-btn-${tool.id}`}
                    onClick={() => { setActiveTool(tool.id); setResult(''); }}
                    className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl transition-all cursor-pointer text-xs
                      ${isActive 
                        ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' 
                        : 'hover:bg-[#f6f5f2] dark:hover:bg-zinc-800 text-[#5c5952] dark:text-zinc-300'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      <div>
                        <span className="font-bold block">{tool.label}</span>
                        <span className="text-[9px] opacity-75">{tool.desc.slice(0, 40)}...</span>
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

        </aside>

        {/* Right Hand: Dynamic Form & Result Screen Area */}
        <div className="lg:col-span-8 space-y-6" id="specialized-workbench">
          
          {/* PART A: Dynamic parameter inputs per tool */}
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl" id="tool-setting-card">
            
            <div className="mb-4">
              <span className="text-[10px] font-mono bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-bold px-2 py-0.5 rounded">
                {tools.find(t => t.id === activeTool)?.flavor} Active
              </span>
              <h2 className="font-display font-black text-lg text-[#1a1917] dark:text-white mt-1">
                {tools.find(t => t.id === activeTool)?.label}
              </h2>
              <p className="text-xs text-[#5c5952] dark:text-[#a19c91]">
                {tools.find(t => t.id === activeTool)?.desc}
              </p>
            </div>

            {/* Render 1: Brand Voice Builder Tool (Prebuilt Interactive panel) */}
            {activeTool === 'brandvoice' ? (
              <form onSubmit={handleSaveBrandVoice} className="space-y-4 pt-4 border-t border-[#f2eee8] dark:border-[#2f2e2c]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-black text-[#5c5952] dark:text-[#a19c91] mb-1">Brand Niche / Business Pillar</label>
                    <input 
                      type="text" 
                      required
                      value={brandNiche}
                      onChange={(e) => setBrandNiche(e.target.value)}
                      className="w-full p-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs"
                      placeholder="e.g. Tanzanian Safari Tours & Air Cargo Logistics"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-black text-[#5c5952] dark:text-[#a19c91] mb-1">Target Persona / Customer demographic</label>
                    <input 
                      type="text" 
                      required
                      value={brandAudience}
                      onChange={(e) => setBrandAudience(e.target.value)}
                      className="w-full p-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs"
                      placeholder="e.g. Kenya and TZ travel agents"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-black text-[#5c5952] dark:text-[#a19c91] mb-1">Adjectives Tone Profile</label>
                    <input 
                      type="text" 
                      required
                      value={brandTone}
                      onChange={(e) => setBrandTone(e.target.value)}
                      className="w-full p-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs"
                      placeholder="e.g. Professional yet street-wise trustworthy Swahili Vibe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-black text-[#5c5952] dark:text-[#a19c91] mb-1">The Core Offer Slogan</label>
                    <input 
                      type="text" 
                      required
                      value={brandOffer}
                      onChange={(e) => setBrandOffer(e.target.value)}
                      className="w-full p-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs"
                      placeholder="e.g. 10% off safari booking code TZ2026"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-black text-[#5c5952] dark:text-[#a19c91] mb-1">Core Theme Colors</label>
                    <input 
                      type="text" 
                      required
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-full p-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs"
                      placeholder="e.g. Gold Sun, Dark Night"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-black text-[#5c5952] dark:text-[#a19c91] mb-1">Default Call-To-Action (CTA)</label>
                    <input 
                      type="text" 
                      required
                      value={brandCta}
                      onChange={(e) => setBrandCta(e.target.value)}
                      className="w-full p-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs"
                      placeholder="e.g. WhatsApp 'BOOK' to +255 700 0000"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-[#1a1917] font-semibold text-xs rounded-xl shadow cursor-pointer transition-colors"
                >
                  Save Identity Profile & Generate Draft Matrix
                </button>
              </form>
            ) : activeTool === 'calendar' ? (
              /* Render 2: Content Calendar Interactive Pipeline Scheduler */
              <div className="space-y-4 pt-4 border-t border-[#f2eee8] dark:border-[#2f2e2c]">
                
                <form onSubmit={handleAddCalendarItem} className="bg-[#fcfbf9] dark:bg-[#151413] p-4 border border-dashed border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block text-[9px] font-mono uppercase font-black text-[#5c5952] dark:text-[#a19c91] mb-1">Day of Campaign</label>
                    <select 
                      value={newCalDate}
                      onChange={(e) => setNewCalDate(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-mono uppercase font-black text-[#5c5952] dark:text-[#a19c91] mb-1">Project Idea Title</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Swahili TikTok Hook explaining air freight"
                      value={newCalTitle}
                      onChange={(e) => setNewCalTitle(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-[#1a1917] hover:bg-[#383531] dark:bg-amber-300 dark:hover:bg-amber-400 dark:text-[#1a1917] text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Book Day
                    </button>
                  </div>
                </form>

                {/* Grid schedule items list */}
                <div className="space-y-2 select-text">
                  {calendarItems.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 bg-white dark:bg-[#151413] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl flex items-center justify-between gap-4 flex-wrap text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-black font-mono w-20 text-[#a19c91]">{item.date}</span>
                        <div className="h-4 w-px bg-[#e2dfd9] hidden sm:block" />
                        <div>
                          <strong className="text-[#1a1917] dark:text-white">{item.title}</strong>
                          <span className="block text-[10px] text-[#5c5952] dark:text-[#a19c91] font-mono">
                            Target Platform: <code className="bg-amber-50 dark:bg-amber-950/20 px-1 rounded text-red-700 dark:text-amber-300">{item.outlet}</code>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Toggle Badge */}
                        <button
                          onClick={() => handleToggleCalendarStatus(item.id)}
                          className={`px-2 py-0.5 font-mono text-[9px] font-bold rounded cursor-pointer leading-tight uppercase
                            ${item.status === 'idea' ? 'bg-[#ebe7de] text-[#1a1917]' : 
                              item.status === 'script' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400' :
                              item.status === 'ready' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400' :
                              'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/20 dark:text-indigo-400'}`}
                        >
                          Status: {item.status}
                        </button>
                        <button
                          onClick={() => handleDeleteCalendarItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Delete Project Entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              /* Render 3: Standard Tool Settings and Parameters Options */
              <form onSubmit={handleGenerate} className="space-y-4 pt-4 border-t border-[#f2eee8] dark:border-[#2f2e2c]">
                
                {/* Core general topic textbox */}
                <div>
                  <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1.5">
                    What is the topic / brand / concept / product for this generation? *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe what you want to write or strategically blueprint in detail..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3 bg-[#fcfbf9] dark:bg-[#151413] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs focus:outline-none focus:border-[#1a1917] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option: Language Pref */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1">Target Language Style</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full p-2 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs focus:outline-none text-[#1a1917] dark:text-white font-bold"
                    >
                      <option value="Bilingual (Swahili + English)">Bilingual (Swahili + English)</option>
                      <option value="English Standard">English Standard</option>
                      <option value="Swahili-Accented East African Vibe">Swahili Standard Only</option>
                    </select>
                  </div>

                  {/* Context Sensitive selectors */}
                  {activeTool === 'hooks' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1">Scroll Hook Paradigm</label>
                      <select
                        value={selectedHookStyle}
                        onChange={(e) => setSelectedHookStyle(e.target.value)}
                        className="w-full p-2 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs focus:outline-none text-[#1a1917] dark:text-white font-bold"
                      >
                        <option value="Counter-Intuitive">Counter-Intuitive (Myths Defied)</option>
                        <option value="Immediate Financial Loss">Anxiety Gap (Financial Loss)</option>
                        <option value="The Secret VIP Loop">Secret Access (Closed VIP Vault)</option>
                        <option value="Problem Outrage">Problem Hook (Aggressive friction)</option>
                      </select>
                    </div>
                  )}

                  {activeTool === 'script' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1">Dramatic Video Blueprint</label>
                      <select
                        value={selectedVideoStyle}
                        onChange={(e) => setSelectedVideoStyle(e.target.value)}
                        className="w-full p-2 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs focus:outline-none text-[#1a1917] dark:text-white font-bold"
                      >
                        <option value="Problem-Agitate-Solve">PAS (Problem-Agitate-Solve)</option>
                        <option value="The Underdog Comeback story">Underdog Comeback Story</option>
                        <option value="Fast 3 Step Tutorial">Step explanation (Quick Tutorial)</option>
                        <option value="Viral TikTok UGC Loop">UGC Unboxing Review Vibe</option>
                      </select>
                    </div>
                  )}

                  {activeTool === 'voiceover' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1">Voice Actor Profile Speaker</label>
                        <select
                          value={selectedVoiceProfile}
                          onChange={(e) => setSelectedVoiceProfile(e.target.value)}
                          className="w-full p-2 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs focus:outline-none text-[#1a1917] dark:text-white font-bold"
                        >
                          <option value="Professional Male (Fenrir)">Professional Male (Fenrir - Deep)</option>
                          <option value="Empathetic Female (Kore)">Empathetic Female (Kore - Warm)</option>
                          <option value="Disruptive Enthusiastic (Zephyr)">Disruptive Enthusiastic (Zephyr - Fast)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-[#f2eee8] dark:border-[#2f2e2c] pt-4">
                  <span className="text-[10px] font-mono text-[#a19c91]">
                    Utilizes: <strong>Gemini 3.5-flash fallback engine</strong>
                  </span>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-3 bg-[#1a1917] hover:bg-[#383531] dark:bg-amber-300 dark:hover:bg-amber-400 dark:text-[#1a1917] text-white font-bold font-display text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        Trigger Automated Asset Workshop <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* AI Voice-over visual player component (Module 8 specific sandbox integration widget) */}
          {activeTool === 'voiceover' && (
            <div className="bg-[#1a1917] text-[#f7f6f2] p-6 rounded-3xl space-y-4 relative overflow-hidden" id="simulation-vo-studio-hud">
              <div className="absolute top-0 right-0 h-48 w-48 bg-amber-500/10 blur-3xl rounded-full" />
              
              <div className="flex items-center justify-between flex-wrap gap-4 relative z-10 select-text">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-400 flex items-center justify-center text-[#1a1917]">
                    <Volume2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm text-white">AI Voice-over Studio Playback Simulator</h4>
                    <p className="text-[10px] text-[#a19c91] font-mono">Speaker: {selectedVoiceProfile} | Audio Rate: 24000 PCM</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (voPlaying) {
                        setVoPlaying(false);
                      } else {
                        setVoPlaying(true);
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-[#1a1917] font-bold text-xs rounded-lg transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    <Play className={`h-3.5 w-3.5 ${voPlaying ? 'animate-spin' : 'fill-current'}`} />
                    {voPlaying ? 'Stop Audition' : 'Play Audition'}
                  </button>
                  <button
                    onClick={() => onShowToast("Mock voice memo audio binary file compiled!", "success")}
                    className="px-3 py-1.5 border border-zinc-700 hover:bg-zinc-800 text-white font-mono text-[10px] rounded-lg cursor-pointer"
                  >
                    Export Audio WAV
                  </button>
                </div>
              </div>

              {/* Dynamic waveform visualizer boxes */}
              <div className="h-10 flex items-end justify-center gap-1 bg-zinc-950/60 p-4 rounded-xl relative overflow-hidden">
                {[1, 2, 4, 3, 5, 2, 4, 2, 6, 4, 2, 3, 4, 5, 2, 3, 5, 2, 6, 2, 3, 5, 2, 4, 6, 2, 3, 2, 5, 2, 6, 2, 3].map((val, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      height: voPlaying ? `${Math.min(100, Math.max(10, val * Math.random() * 16))}%` : '15%' 
                    }}
                    className="w-1.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full transition-all duration-100"
                  />
                ))}
              </div>

              {/* Audio progress bar */}
              <div className="space-y-1 relative z-10">
                <div className="flex justify-between text-[9px] text-[#a19c91] font-mono">
                  <span>Progress: {voProgress}%</span>
                  <span>Audio Latency: 42ms</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${voProgress}%` }}
                    className="h-full bg-amber-400 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PART B: Generated Output Card Inspector with Markdown Displays */}
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl min-h-[420px] flex flex-col justify-between">
            <div>
              
              <div className="px-6 py-4 border-b border-[#f2eee8] dark:border-[#2f2e2c] bg-[#fdfdfc] dark:bg-[#1b1a18] flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="font-display font-black text-sm text-[#1a1917] dark:text-white">Active Asset Script Output</h4>
                  <p className="text-[10px] text-[#a19c91] mt-0.5">Custom template ready for copywriting schedulers</p>
                </div>

                {result && (
                  <div className="flex items-center gap-1.5">
                    <button
                      id="export-copy-detail-btn"
                      onClick={handleCopy}
                      className="px-2.5 py-1.5 hover:bg-[#ebe7de]/60 dark:hover:bg-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1 text-[#1a1917] dark:text-white cursor-pointer transition-colors"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy to Clipboard"}
                    </button>
                    <button
                      id="export-txt-download-btn"
                      onClick={handleDownloadTxt}
                      className="p-2 hover:bg-[#ebe7de]/60 dark:hover:bg-zinc-800 rounded-xl text-[#1a1917] dark:text-white cursor-pointer"
                      title="Download TXT Document"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="py-24 text-center text-[#5c5952] dark:text-[#a19c91] space-y-3 animate-pulse">
                    <Loader2 className="h-8 w-8 text-amber-500 animate-spin mx-auto" />
                    <p className="text-xs font-semibold font-mono">Compiling localized prompt layouts for the model...</p>
                  </div>
                ) : result ? (
                  <div className="prose prose-sm dark:prose-invert text-xs leading-relaxed max-w-none text-[#1a1917] dark:text-[#f7f6f2] whitespace-pre-wrap select-text" id="specialized-rendered-content">
                    {result}
                  </div>
                ) : (
                  <div className="py-20 text-center text-[#5c5952] dark:text-[#a19c91] max-w-sm mx-auto space-y-2">
                    <HelpCircle className="h-8 w-8 text-[#a19c91] mx-auto animate-bounce" />
                    <p className="font-display font-extrabold text-sm text-[#1a1917] dark:text-white">Awaiting workbench activation</p>
                    <p className="text-[11px] leading-relaxed">
                      Fill in your topic query above and trigger the workshop parameters to output realistic copy templates instant and save them to history.
                    </p>
                  </div>
                )}
              </div>

            </div>

            <div className="p-6 border-t border-[#f2eee8] dark:border-[#2f2e2c] flex items-center justify-between text-[10px] font-mono text-[#a19c91]">
              <span>Active Workflow Node: <strong>ViralForge V1.2 Core</strong></span>
              <span>Estimation words: <strong>{result ? result.split(/\s+/).length : 0} tags</strong></span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
