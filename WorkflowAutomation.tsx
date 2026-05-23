import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Play, 
  Trash2, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  MessageSquare, 
  Clock, 
  Send, 
  ToggleLeft,
  ToggleRight, 
  Eye,
  Settings
} from 'lucide-react';
import { AutomationTrigger } from './types';

interface WorkflowAutomationProps {
  onShowToast: (text: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function WorkflowAutomation({ onShowToast }: WorkflowAutomationProps) {
  const [automations, setAutomations] = useState<AutomationTrigger[]>(() => {
    const saved = localStorage.getItem('creatoros_automations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse cached automations", err);
      }
    }
    return [
      { id: 'auto-1', name: 'LinkedIn Auto-Format', platform: 'LinkedIn', triggerType: 'Finalized Document', targetChannel: 'Copy to Clipboard + TXT save', isActive: true },
      { id: 'auto-2', name: 'WhatsApp Broadcast Pilot', platform: 'TikTok Script', triggerType: 'Generator Complete', targetChannel: 'WhatsApp Sandbox Node (+3000)', isActive: false },
      { id: 'auto-3', name: 'Newsletter Cross-post', platform: 'Blog Post', triggerType: 'Markdown Saved', targetChannel: 'Draft Newsletter Automation', isActive: true }
    ];
  });

  // Sync back to localstorage when modified
  useEffect(() => {
    localStorage.setItem('creatoros_automations', JSON.stringify(automations));
  }, [automations]);

  const [newName, setNewName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('LinkedIn Post');
  const [selectedTrigger, setSelectedTrigger] = useState('Generator Complete');
  const [selectedTarget, setSelectedTarget] = useState('WhatsApp Sandbox Node (+3000)');

  const triggerOptions = ['Generator Complete', 'Finalized Document', 'Revision Saved', 'Credit Level Refreshed'];
  const platformOptions = ['LinkedIn Post', 'TikTok Script', 'Instagram Caption', 'YouTube Script', 'Blog Post'];
  const targetOptions = [
    'WhatsApp Sandbox Node (+3000)', 
    'TikTok API Scheduling Stack', 
    'Supabase Cloud Sink Sync', 
    'Email Newsletter Outlet', 
    'Direct Webhook Trigger'
  ];

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      onShowToast("Please specify an automation brand/label name.", "warning");
      return;
    }

    const newItem: AutomationTrigger = {
      id: `auto-${Date.now()}`,
      name: newName,
      platform: selectedPlatform,
      triggerType: selectedTrigger,
      targetChannel: selectedTarget,
      isActive: true
    };

    setAutomations(prev => [...prev, newItem]);
    setNewName('');
    onShowToast(`Created new automation trigger: "${newItem.name}"!`, "success");
  };

  const toggleActive = (id: string) => {
    setAutomations(prev => prev.map(item => {
      if (item.id === id) {
        const updatedState = !item.isActive;
        onShowToast(`Automation "${item.name}" is now ${updatedState ? 'ENABLED & LIVE' : 'DISABLED'}`, updatedState ? "success" : "info");
        return { ...item, isActive: updatedState };
      }
      return item;
    }));
  };

  const handleDeleteNode = (id: string) => {
    setAutomations(prev => prev.filter(item => item.id !== id));
    onShowToast("Removed automation configuration block", "info");
  };

  const handleTestTrigger = (item: AutomationTrigger) => {
    onShowToast(`[Simulation Trigger]: Piping "${item.platform}" via channel "${item.targetChannel}"... Success!`, "success");
  };

  return (
    <div className="space-y-8" id="automation-builder-canvas">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl" id="automation-intro-hud">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-mono font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md mb-2">
              <Zap className="h-3 w-3 fill-amber-500" /> Webhook Multiplexer nodes
            </div>
            <h1 className="font-display font-extrabold text-[#1a1917] dark:text-[#f7f6f2] text-2xl">AI Workflow & Webhook Automation</h1>
            <p className="text-sm text-[#5c5952] dark:text-[#a19c91] mt-1">
              Automate multi-platform publication prompts. Link generation completions directly to notification Webhooks or social scheduler microservices.
            </p>
          </div>
          <span className="text-xs bg-[#ebe7de]/60 dark:bg-[#201f1c] font-mono text-[#5c5952] dark:text-[#a19c91] px-4 py-2 rounded-xl border border-dashed border-[#d8d4cb] dark:border-[#2f2e2c]">
            Active Engines: <strong>{automations.filter(a => a.isActive).length}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Create Pipeline rule */}
        <div className="md:col-span-5 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl h-fit">
          <h3 className="font-display font-black text-[#1a1917] dark:text-[#f7f6f2] text-base mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4 text-amber-500" /> Build Automation Pivot Link
          </h3>

          <form onSubmit={handleCreateNode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1.5">Rule Identifier / Label</label>
              <input
                type="text"
                placeholder="e.g. Schedule LinkedIn Draft pitch"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-sm focus:outline-none focus:border-[#1a1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1.5">WHEN Content Platform Is Generated</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs font-semibold focus:outline-none text-[#1a1917] dark:text-white"
              >
                {platformOptions.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1.5">ON Pipeline Trigger Type</label>
              <select
                value={selectedTrigger}
                onChange={(e) => setSelectedTrigger(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs font-semibold focus:outline-none text-[#1a1917] dark:text-white"
              >
                {triggerOptions.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1.5">THEN Action Channel Outlet</label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs font-semibold focus:outline-none text-[#1a1917] dark:text-white"
              >
                {targetOptions.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1a1917] dark:bg-amber-300 text-white dark:text-[#1a1917] rounded-xl text-xs font-bold font-display hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Deploy Action Hook
            </button>
          </form>
        </div>

        {/* Right Side: Active nodes flow map */}
        <div className="md:col-span-7 space-y-4" id="automation-active-map">
          
          <div className="flex justify-between items-center px-2">
            <h3 className="font-display font-extrabold text-[#1a1917] dark:text-[#f7f6f2] text-sm">Target Flow Pipeline</h3>
            <span className="text-xs font-mono text-[#a19c91]">Click Play button to test payload simulation</span>
          </div>

          <div className="space-y-4">
            {automations.map((item) => (
              <div
                key={item.id}
                id={`automation-card-${item.id}`}
                className={`
                  p-5 rounded-3xl border transition-all relative overflow-hidden bg-white dark:bg-[#1a1917]
                  ${item.isActive 
                    ? 'border-emerald-500/40 ring-1 ring-emerald-500/10' 
                    : 'border-[#e2dfd9] dark:border-[#2f2e2c] opacity-75'}
                `}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${item.isActive ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Zap className={`h-4.5 w-4.5 ${item.isActive ? 'animate-bounce' : ''}`} />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-sm text-[#1a1917] dark:text-white">{item.name}</h4>
                      <p className="text-[10px] text-[#a19c91] mt-0.5 font-mono">Platform ID: {item.id}</p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTestTrigger(item)}
                      className="p-1.5 bg-gray-50 hover:bg-emerald-50 text-[#1a1917] hover:text-emerald-700 dark:bg-zinc-800 dark:text-white rounded-lg transition-colors"
                      title="Simulate Event"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => toggleActive(item.id)}
                      className="p-1.5 text-[#5c5952] hover:text-[#1a1917] dark:text-[#a19c91] dark:hover:text-white"
                      title={item.isActive ? "Deactivate" : "Activate"}
                    >
                      {item.isActive ? <ToggleRight className="h-5.5 w-5.5 text-emerald-600" /> : <ToggleLeft className="h-5.5 w-5.5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteNode(item.id)}
                      className="p-1.5 hover:bg-red-50 text-red-700 rounded-lg"
                      title="Remove Pipeline Trigger"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pipeline visual loop */}
                <div className="grid grid-cols-12 gap-2 items-center bg-[#fcfbf9] dark:bg-[#201f1c] p-3 rounded-2xl border border-[#ebe7de]/60 dark:border-[#2f2e2c] border-dashed text-xs">
                  <div className="col-span-5 text-left font-mono">
                    <span className="text-[9px] text-[#a19c91] uppercase block leading-none font-bold">SOURCE EVENT</span>
                    <strong className="text-[#1a1917] dark:text-white">{item.platform}</strong>
                    <span className="bg-[#ebe7de] dark:bg-zinc-700 font-bold text-[9px] px-1 rounded-sm block w-fit mt-0.5">{item.triggerType}</span>
                  </div>
                  <div className="col-span-2 flex justify-center text-amber-500">
                    <ArrowRight className="h-4 w-4 animate-pulse" />
                  </div>
                  <div className="col-span-5 text-left font-mono">
                    <span className="text-[9px] text-[#a19c91] uppercase block leading-none font-bold">DESTINATION DISPATCH</span>
                    <strong className="text-emerald-700 dark:text-emerald-400">{item.targetChannel}</strong>
                    <span className="text-[9px] text-[#5c5952] dark:text-[#a19c91] block mt-0.5">Secure proxy payload</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
