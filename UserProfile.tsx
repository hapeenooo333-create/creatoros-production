import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  Key, 
  Save, 
  Share2, 
  BookOpen, 
  MessageSquare,
  Clock,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  userPlan: string;
  onUpdateUser: (updatedFields: Partial<UserType>) => void;
  onShowToast: (text: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function UserProfile({ user, userPlan, onUpdateUser, onShowToast }: UserProfileProps) {
  const [name, setName] = useState(user.name || '');
  const [defaultNiche, setDefaultNiche] = useState(localStorage.getItem('creatoros_niche') || 'SaaS & Tech product creator');
  const [defaultTone, setDefaultTone] = useState(localStorage.getItem('creatoros_tone') || 'Professional & Bold');
  const [saving, setSaving] = useState(false);

  // Connection trigger switches
  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem('creatoros_connections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cached connections:", e);
      }
    }
    return {
      linkedin: true,
      whatsapp: false,
      tiktok: false,
      instagram: false
    };
  });

  // Keep connections in sync with localStorage
  React.useEffect(() => {
    localStorage.setItem('creatoros_connections', JSON.stringify(connections));
  }, [connections]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Save visual defaults to local state context
    localStorage.setItem('creatoros_niche', defaultNiche);
    localStorage.setItem('creatoros_tone', defaultTone);
    
    setTimeout(() => {
      onUpdateUser({ name });
      onShowToast("Profile parameters committed successfully to sandbox state!", "success");
      setSaving(false);
    }, 850);
  };

  const handleToggleConnection = (platform: keyof typeof connections) => {
    const nextState = !connections[platform];
    setConnections(prev => ({ ...prev, [platform]: nextState }));
    
    const displayPlatform = String(platform).toUpperCase();
    if (nextState) {
      onShowToast(`Dispatched secure OAuth popup for ${displayPlatform}. Session authenticated!`, "success");
    } else {
      onShowToast(`Severed connection token pipeline for ${displayPlatform}.`, "info");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="user-profile-view-canvas">
      
      {/* Visual Hub header banner */}
      <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-8 rounded-3xl" id="profile-heading-well">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="h-20 w-20 rounded-full bg-[#1a1917]/5 dark:bg-amber-300/10 flex items-center justify-center text-[#1a1917] dark:text-amber-300 border border-[#e2dfd9] dark:border-[#2f2e2c]">
            <span className="text-3xl font-display font-black uppercase">
              {user.name ? user.name[0] : (user.email ? user.email[0] : 'U')}
            </span>
          </div>

          <div className="space-y-1.5 flex-1 select-text">
            <h1 className="font-display font-extrabold text-[#1a1917] dark:text-white text-2xl">
              {user.name || "SaaS Content Creator"}
            </h1>
            <p className="text-xs text-[#a19c91] font-mono tracking-widest flex items-center justify-center sm:justify-start gap-1">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-2">
              <span className="bg-[#ebe7de]/70 dark:bg-zinc-800 text-[#1a1917] dark:text-[#eceae6] text-[10px] font-mono font-bold px-2.5 py-1 rounded">
                Tier level: {userPlan}
              </span>
              <span className="text-xs leading-none text-[#5c5952] dark:text-[#a19c91] font-sans">
                Initialized: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active session'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile Settings Form */}
        <form onSubmit={handleSaveProfile} className="md:col-span-7 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl space-y-5">
          <h3 className="font-display font-black text-base text-[#1a1917] dark:text-white flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" /> Edit Profile Defaults
          </h3>

          <div className="space-y-4 pt-4 border-t border-[#f2eee8] dark:border-[#2f2e2c]">
            <div>
              <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1.5">Creator Screenname</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-[#a19c91]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] text-[#1a1917] dark:text-[#f7f6f2] rounded-xl text-sm focus:outline-none focus:border-[#1a1917] dark:focus:border-amber-300"
                  placeholder="Rachel Solopreneur"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1.5">Business / Niche Default Category</label>
              <select
                value={defaultNiche}
                onChange={(e) => setDefaultNiche(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs font-semibold text-[#1a1917] dark:text-white focus:outline-none"
              >
                <option value="SaaS & Tech product creator">SaaS & Tech product creator</option>
                <option value="Agency Solopreneur / Freelancer">Agency Solopreneur / Freelancer</option>
                <option value="Lifestyle & Content Curator">Lifestyle & Content Curator</option>
                <option value="Finance & Growth Hacking">Finance & Growth Hacking</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5c5952] dark:text-[#a19c91] font-mono uppercase mb-1.5">Default Generation Tone</label>
              <select
                value={defaultTone}
                onChange={(e) => setDefaultTone(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-xs font-semibold text-[#1a1917] dark:text-white focus:outline-none"
              >
                <option value="Professional & Bold">Professional & Bold</option>
                <option value="Casual & Witty">Casual & Witty</option>
                <option value="Empathetic & Genuine">Empathetic & Genuine</option>
                <option value="Educational & Authoritative">Educational & Authoritative</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[#1a1917] dark:bg-amber-300 text-white dark:text-[#1a1917] rounded-xl text-xs font-bold font-display hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving Preferences..." : "Commit Personal Settings"}
          </button>
        </form>

        {/* Dynamic Connected integrations channels mapping */}
        <div className="md:col-span-5 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl space-y-5 h-fit">
          <h3 className="font-display font-black text-base text-[#1a1917] dark:text-white flex items-center gap-2">
            <Share2 className="h-4.5 w-4.5 text-indigo-500" /> Channel Integrations
          </h3>

          <p className="text-xs text-[#5c5952] dark:text-[#a19c91] leading-relaxed">
            Link social accounts securely with ready API proxies. Active channels trigger automated webhook queues instantly.
          </p>

          <div className="space-y-3 pt-3 border-t border-[#f2eee8] dark:border-[#2f2e2c]">
            {/* LinkedIn */}
            <div className="p-3 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#ebe7de] dark:border-[#2f2e2c] rounded-2xl flex items-center justify-between text-xs font-semibold font-mono">
              <span className="text-[#1a1917] dark:text-white">LinkedIn Hub Link</span>
              <button
                type="button"
                onClick={() => handleToggleConnection('linkedin')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold cursor-pointer transition-colors ${connections.linkedin ? 'bg-emerald-100 text-emerald-800' : 'bg-[#ebe7de] text-[#5c5952]'}`}
              >
                {connections.linkedin ? 'CONNECTED ✓' : 'CONNECT +'}
              </button>
            </div>

            {/* WhatsApp */}
            <div className="p-3 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#ebe7de] dark:border-[#2f2e2c] rounded-2xl flex items-center justify-between text-xs font-semibold font-mono">
              <span className="text-[#1a1917] dark:text-white">WhatsApp Sandbox Node</span>
              <button
                type="button"
                onClick={() => handleToggleConnection('whatsapp')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold cursor-pointer transition-colors ${connections.whatsapp ? 'bg-emerald-100 text-emerald-800' : 'bg-[#ebe7de] text-[#5c5952]'}`}
              >
                {connections.whatsapp ? 'CONNECTED ✓' : 'CONNECT +'}
              </button>
            </div>

            {/* TikTok */}
            <div className="p-3 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#ebe7de] dark:border-[#2f2e2c] rounded-2xl flex items-center justify-between text-xs font-semibold font-mono">
              <span className="text-[#1a1917] dark:text-white">TikTok Content Pipeline</span>
              <button
                type="button"
                onClick={() => handleToggleConnection('tiktok')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold cursor-pointer transition-colors ${connections.tiktok ? 'bg-emerald-100 text-emerald-800' : 'bg-[#ebe7de] text-[#5c5952]'}`}
              >
                {connections.tiktok ? 'CONNECTED ✓' : 'CONNECT +'}
              </button>
            </div>

            {/* Instagram */}
            <div className="p-3 bg-[#fcfbf9] dark:bg-[#201f1c] border border-[#ebe7de] dark:border-[#2f2e2c] rounded-2xl flex items-center justify-between text-xs font-semibold font-mono">
              <span className="text-[#1a1917] dark:text-white">Instagram Graph Stream</span>
              <button
                type="button"
                onClick={() => handleToggleConnection('instagram')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold cursor-pointer transition-colors ${connections.instagram ? 'bg-emerald-100 text-emerald-800' : 'bg-[#ebe7de] text-[#5c5952]'}`}
              >
                {connections.instagram ? 'CONNECTED ✓' : 'CONNECT +'}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
