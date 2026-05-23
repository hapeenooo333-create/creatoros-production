import React, { useState } from 'react';
import { 
  Sparkles, 
  BarChart3, 
  Layers, 
  Settings, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Zap,
  Sliders,
  Sun,
  Moon,
  Video,
  Share2,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  Grid
} from 'lucide-react';
import { User } from './types';

interface DashboardSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  user: User;
  onLogOut: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function DashboardSidebar({ currentTab, onTabChange, user, onLogOut, isDark, onToggleTheme }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'ai-command-center', label: 'AI Command Center', icon: Sparkles },
    { id: 'ai-generator', label: 'AI Workflow Engine', icon: Sliders },
    { id: 'ai-specialized-generators', label: 'AI Specialized (16-Tools)', icon: Grid },
    { id: 'video-creator-suite', label: 'CapCut Video CRM', icon: Video },
    { id: 'ai-workflow-automation', label: 'Workflow Automations', icon: Zap },
    { id: 'social-publishing-queues', label: 'Social Hub Bureau', icon: Share2 },
    { id: 'whatsapp-business-hub', label: 'WhatsApp CRM Inbox', icon: MessageSquare },
    { id: 'monetization-digital-store', label: 'Store & Affiliate', icon: ShoppingBag },
    { id: 'growth-analytics-deepdive', label: 'Growth & ROI Deepdive', icon: TrendingUp },
    { id: 'projects', label: 'My Projects & History', icon: Layers },
    { id: 'pricing', label: 'Pricing & Upgrades', icon: CreditCard },
    { id: 'settings', label: 'Settings & Status', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 h-16 bg-[#f7f6f2] dark:bg-[#151413] border-b border-[#e5e2db] dark:border-[#2a2928] sticky top-0 z-30" id="mobile-sidebar-header">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#1a1917] dark:bg-amber-300 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-amber-100 dark:text-[#1a1917]" />
          </div>
          <span className="font-display font-bold text-lg text-[#1a1917] dark:text-[#f7f6f2]">CreatorOS</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#1a1917] dark:text-zinc-100 hover:bg-[#eadecc] dark:hover:bg-zinc-800 rounded-lg"
          id="mobile-hud-menu-btn"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-[#1a1917]/30 backdrop-blur-xs z-40" 
        />
      )}

      {/* Sidebar navigation */}
      <aside className={`
        fixed inset-y-0 left-0 bg-[#ebe7de] dark:bg-[#151413] border-r border-[#e5e2db] dark:border-[#2a2928] z-50 flex flex-col w-64 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `} id="sidebar-layout">
        
        {/* Sidebar Brand Logo */}
        <div className="p-6 border-b border-[#e2dfd9] dark:border-[#2f2e2c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[#1a1917] flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-amber-200" />
            </div>
            <div>
              <span className="font-display font-extrabold text-[#1a1917] dark:text-[#f7f6f2] text-lg tracking-tight block">CreatorOS</span>
              <span className="text-[9px] font-mono font-semibold tracking-widest text-[#a19c91] block uppercase">V1.2 Premium</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleTheme}
              className="p-1.5 text-[#5c5952] hover:bg-[#dedad0] rounded-lg transition-transform hover:rotate-12 cursor-pointer dark:text-zinc-300 dark:hover:bg-zinc-800"
              title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
              id="theme-toggler-btn"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400 fill-amber-300" /> : <Moon className="h-4 w-4 text-[#1a1917]" />}
            </button>
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-[#5c5952] hover:bg-[#dedad0] rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-4 py-2 text-[10px] uppercase font-mono font-bold text-[#a19c91] border-t border-[#e2dfd9]/60 dark:border-[#2f2e2c]/60 mt-3 select-none">
          Workspace Monitors
        </div>
        
        {/* Real Visual Status Monitor */}
        <div className="mx-4 mb-2 p-3 bg-white/75 dark:bg-[#1a1917]/70 border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl space-y-1.5 text-[10px] font-mono select-none" id="workspace-status-monitor">
          <div className="flex items-center justify-between">
            <span className="text-[#5c5952] dark:text-[#a19c91]">Engine Mode:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-[9px]">Sandbox Mode</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5c5952] dark:text-[#a19c91]">Content API:</span>
            <span className="font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-1.5 py-0.5 rounded text-[9px]">Simulated</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5c5952] dark:text-[#a19c91]">Remote DB:</span>
            <span className="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded text-[9px]">Live API Required</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5c5952] dark:text-[#a19c91]">Offline Cache:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded text-[9px]">Connected & Ready</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5c5952] dark:text-[#a19c91]">Webhooks API:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded text-[9px]">Experimental</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 pt-1 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? 'bg-[#1a1917] text-[#f7f6f2] dark:bg-amber-300 dark:text-[#1a1917] shadow-sm' 
                    : 'text-[#5c5952] dark:text-[#a19c91] hover:bg-[#dedad0] dark:hover:bg-zinc-800 hover:text-[#1a1917] dark:hover:text-white'}
                `}
              >
                <IconComponent className={`h-4.5 w-4.5 ${isActive ? 'text-amber-300 dark:text-[#1a1917]' : 'text-[#a19c91]'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Card & LogOut */}
        <div className="p-4 border-t border-[#e2dfd9] dark:border-[#2f2e2c] bg-[#e3ded4]/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl mb-3">
            <div className="h-9 w-9 rounded-full bg-[#1a1917]/10 dark:bg-amber-300/10 flex items-center justify-center text-[#1a1917] dark:text-amber-300">
              <UserIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1a1917] dark:text-[#f7f6f2] truncate">{user.name || "SaaS User"}</p>
              <p className="text-[10px] font-mono text-[#5c5952] dark:text-[#a19c91] truncate">{user.email}</p>
            </div>
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={onLogOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#d8d4cb] dark:border-[#2f2e2c] text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-900 text-xs font-semibold font-mono transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out Session
          </button>
        </div>

      </aside>
    </>
  );
}
