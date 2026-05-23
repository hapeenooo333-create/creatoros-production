import React, { useState } from 'react';
import { 
  Share2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Calendar, 
  Plus, 
  Trash2, 
  MessageSquare, 
  ThumbsUp, 
  Bookmark, 
  ChevronRight, 
  Sliders,
  Send,
  Sparkles
} from 'lucide-react';

interface QueueItem {
  id: string;
  platform: 'TikTok' | 'Instagram' | 'LinkedIn' | 'Twitter/X' | 'YouTube' | 'Facebook';
  text: string;
  category: string;
  scheduledTime: string;
  status: 'published' | 'scheduled' | 'failed' | 'draft';
  retryCount: number;
}

export default function SocialPublishingHub({ onShowToast }: { onShowToast: (text: string, type: 'success' | 'info' | 'warning' | 'error') => void }) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'scheduled' | 'failed'>('all');
  
  // Schedule queues data state representing interactive Buffer style timeline
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: 'q-1', platform: 'LinkedIn', text: "Just deployed our secure API gateway failover router! 🚀 Proud of Tanzania tech startups.", category: "Promo", scheduledTime: "2026-05-23T09:00:00Z", status: "scheduled", retryCount: 0 },
    { id: 'q-2', platform: 'TikTok', text: "Dar Cargo logistics cashflow simulator. Click bio for M-Pesa sandbox payouts!", category: "Video Clip", scheduledTime: "2026-05-22T12:30:00Z", status: "published", retryCount: 0 },
    { id: 'q-3', platform: 'Instagram', text: "Affordable Zanzibar flight travel agency codes available today.", category: "Affiliate Promo", scheduledTime: "2026-05-21T18:00:00Z", status: "failed", retryCount: 2 },
    { id: 'q-4', platform: 'Twitter/X', text: "Stop doing manual administrative shop invoices. Upgrade Workspace licenses.", category: "Education", scheduledTime: "2026-05-24T15:00:00Z", status: "draft", retryCount: 0 }
  ]);

  const [newPostText, setNewPostText] = useState('');
  const [newPlatform, setNewPlatform] = useState<'TikTok' | 'Instagram' | 'LinkedIn' | 'Twitter/X' | 'YouTube' | 'Facebook'>('LinkedIn');
  const [newScheduledDate, setNewScheduledDate] = useState('2026-05-23');
  const [newScheduledTime, setNewScheduledTime] = useState('10:00');

  // Handle schedule trigger
  const handleAddToQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) {
      onShowToast("Post text context cannot be left empty.", "warning");
      return;
    }
    const scheduledTime = `${newScheduledDate}T${newScheduledTime}:00Z`;
    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      platform: newPlatform,
      text: newPostText,
      category: "My Campaign",
      scheduledTime,
      status: "scheduled",
      retryCount: 0
    };

    setQueue(prev => [newItem, ...prev]);
    setNewPostText('');
    onShowToast(`Enqueued post for ${newPlatform} on standard scheduler queue!`, "success");
  };

  const handleRetryPublish = (id: string) => {
    setQueue(prev => prev.map(item => {
      if (item.id === id) {
        onShowToast(`Simulating instant API handshake fallback override for ${item.platform}... SUCCESS!`, "success");
        return { ...item, status: 'published', retryCount: item.retryCount + 1 };
      }
      return item;
    }));
  };

  const handleDeleteQueueItem = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    onShowToast("Publication draft withdrawn fully from pipeline logs.", "info");
  };

  // Filter display
  const filteredQueue = queue.filter(item => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  return (
    <div className="space-y-8" id="publishing-hub-canvas">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl" id="publishing-hub-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-text">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-mono font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md mb-2">
              <Share2 className="h-3 w-3 fill-amber-500 text-amber-500 animate-spin" /> Omni-platform publishing hub
            </div>
            <h1 className="font-display font-black text-[#1a1917] dark:text-white text-2xl tracking-tight">Social Media Scheduling Bureau</h1>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-1 pr-4">
              Schedule campaign formats across cross-platform channels. Review interactive publish pipelines, inspect draft codes, and resolve failed triggers.
            </p>
          </div>

          <div className="bg-[#ebe7de]/60 dark:bg-[#201f1c] px-4 py-2 rounded-2xl border border-dashed border-[#d8d4cb] text-xs font-mono font-bold text-[#1a1917] dark:text-amber-200 select-none">
            Enqueued: <strong>{queue.filter(q => q.status === 'scheduled').length}</strong> | Failed: <strong className="text-red-500">{queue.filter(q => q.status === 'failed').length}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Create Draft Scheduling form */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl h-fit">
          <h3 className="font-display font-black text-[#1a1917] dark:text-white text-sm mb-4 flex items-center gap-1.5 select-none">
            <Calendar className="h-4 w-4 text-amber-500" /> Dispatch Post Calendar Block
          </h3>

          <form onSubmit={handleAddToQueue} className="space-y-4">
            
            <div>
              <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Target Media Channel Gateway</label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as any)}
                className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 text-xs font-bold rounded-xl focus:outline-none"
              >
                <option value="LinkedIn">LinkedIn Professional Network</option>
                <option value="TikTok">TikTok Vertical Video Drafts</option>
                <option value="Instagram">Instagram Media Feed</option>
                <option value="Twitter/X">Twitter/X Broadcast Feed</option>
                <option value="YouTube">YouTube Secondary Reels channel</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Copy text context *</label>
              <textarea
                rows={4}
                required
                placeholder="Compose or paste your generated platform copy here..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full p-3 bg-[#fcfbf9] dark:bg-[#151413] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Release Date</label>
                <input 
                  type="date"
                  required
                  value={newScheduledDate}
                  onChange={(e) => setNewScheduledDate(e.target.value)}
                  className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Time (UTC)</label>
                <input 
                  type="time"
                  required
                  value={newScheduledTime}
                  onChange={(e) => setNewScheduledTime(e.target.value)}
                  className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1a1917] hover:bg-[#383531] dark:bg-amber-300 dark:hover:bg-amber-400 dark:text-[#1a1917] text-white font-bold text-xs rounded-xl transition-all shadow cursor-pointer"
            >
              Enqueue Scheduled Publish
            </button>

          </form>
        </div>

        {/* Live scheduler pipeline listings column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Filter Selectors state */}
          <div className="flex items-center justify-between px-1 flex-wrap gap-2 select-none">
            <h3 className="font-display font-black text-[#1a1917] dark:text-white text-xs uppercase tracking-wider text-[#a19c91]">Publication Queue</h3>

            <div className="flex bg-[#ebe7de]/40 dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] p-0.5 rounded-lg text-[9px] font-mono font-bold uppercase">
              {(['all', 'published', 'scheduled', 'failed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-2 py-1 rounded cursor-pointer transition-colors ${activeFilter === f ? 'bg-white dark:bg-zinc-800 text-[#1a1917] dark:text-white font-black' : 'text-[#a19c91]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 select-text">
            {filteredQueue.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#1a1917] border border-[#e2dfd9] border-dashed dark:border-[#2f2e2c] rounded-3xl text-xs text-[#a19c91]">
                No publication slots matching selected filter state.
              </div>
            ) : (
              filteredQueue.map((item) => (
                <div 
                  key={item.id}
                  className={`p-5 rounded-3xl border bg-white dark:bg-[#1a1917] transition-all relative overflow-hidden
                    ${item.status === 'failed' ? 'border-red-500/30' : 'border-[#e2dfd9] dark:border-[#2f2e2c]'}`}
                >
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded
                        ${item.platform === 'LinkedIn' ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400' : ''}
                        ${item.platform === 'TikTok' ? 'bg-zinc-950 text-zinc-100 dark:bg-zinc-800' : ''}
                        ${item.platform === 'Instagram' ? 'bg-pink-50 text-pink-800 dark:bg-pink-950/20' : ''}
                        ${item.platform === 'Twitter/X' ? 'bg-zinc-950 text-zinc-300' : ''}
                      `}>
                        {item.platform}
                      </span>
                      <span className="text-[10px] font-mono text-[#a19c91]">ID: {item.id}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {item.status === 'published' && (
                        <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 font-bold px-2 py-0.5 rounded flex items-center gap-0.5"><CheckCircle2 className="h-3 w-3" /> PUBLISHED</span>
                      )}
                      {item.status === 'scheduled' && (
                        <span className="text-[9px] font-mono text-amber-600 bg-amber-50 dark:bg-amber-950/20 font-bold px-2 py-0.5 rounded flex items-center gap-0.5"><Clock className="h-3 w-3 animate-spin" /> SCHEDULED</span>
                      )}
                      {item.status === 'failed' && (
                        <span className="text-[9px] font-mono text-red-600 bg-red-50 dark:bg-red-950/20 font-bold px-2 py-0.5 rounded flex items-center gap-0.5"><AlertTriangle className="h-3 w-3" /> ERROR</span>
                      )}
                      {item.status === 'draft' && (
                        <span className="text-[9px] font-mono text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">DRAFT</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#1a1917] dark:text-white font-medium mt-3 leading-relaxed">
                    {item.text}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-[#a19c91] font-mono mt-4 pt-3 border-t border-[#ebe7de]/60 dark:border-[#2f2e2c]">
                    <span>Pub Date: {new Date(item.scheduledTime).toLocaleString()}</span>
                    
                    <div className="flex gap-2">
                      {item.status === 'failed' && (
                        <button
                          onClick={() => handleRetryPublish(item.id)}
                          className="text-amber-500 hover:text-amber-600 font-bold uppercase text-[9px] flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Retry Manual Sync
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteQueueItem(item.id)}
                        className="text-red-500 hover:text-red-600 font-bold uppercase text-[9px] flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
