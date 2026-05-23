import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Percent, 
  HelpCircle, 
  Sliders, 
  Badge, 
  Activity, 
  Award, 
  ArrowUpRight, 
  Sparkles, 
  DollarSign,
  Briefcase
} from 'lucide-react';

export default function GrowthAnalyticsDeepdive({ onShowToast }: { onShowToast: (text: string, type: 'success' | 'info' | 'warning' | 'error') => void }) {
  const [clientCount, setClientCount] = useState(6);
  const [averagePrice, setAveragePrice] = useState(250000); // in TZS
  const [conversionRate, setConversionRate] = useState(3.4); // in %

  // Simulated metrics
  const estimatedEarn = clientCount * averagePrice;
  const growthMultiplier = (conversionRate * 1.8).toFixed(1);

  // Top conversion hooks logs
  const topHooks = [
    { text: "Kariakoo shop owners drop manual logs starting today.", ctr: "12.4%", engagement: "94%" },
    { text: "M-Pesa cash flows synchronized 24hr automated deliveries.", ctr: "9.8%", engagement: "88%" },
    { text: "Zanzibar absolute travel deals with exclusive promotional codes.", ctr: "8.5%", engagement: "81%" }
  ];

  return (
    <div className="space-y-8" id="growth-deepdive-canvas">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl" id="growth-deepdive-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-text">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-mono font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md mb-2">
              <TrendingUp className="h-4 w-4 text-amber-500 animate-pulse" /> Analytics & Growth deep-dive Bureau
            </div>
            <h1 className="font-display font-black text-[#1a1917] dark:text-white text-2xl tracking-tight">Analytics & ROI Growth Center</h1>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-1 pr-4">
              Map follower growth progress, calculate creator campaigns revenue potential, evaluate Top hooks CTRs, and read localized East Africa marketplace insights.
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2.5 border border-dashed border-emerald-500/30 rounded-2xl text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 select-none">
            Creator Score: <strong>A+ Ultra Premium</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Growth visual SVG Charts deep-dive */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl space-y-6 select-text">
            
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-display font-black text-sm text-[#1a1917] dark:text-white">Follower and conversion Trends</h3>
                <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91] mt-0.5">Custom visual SVG timelines representing click-through rate growth curves</p>
              </div>

              <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 font-mono font-bold px-2 py-1 rounded">Last 6 Months view</span>
            </div>

            {/* Premium custom high-contrast SVG chart */}
            <div className="w-full h-48 bg-[#fcfbf9] dark:bg-zinc-950 rounded-2xl border border-dashed p-4 flex flex-col justify-end relative overflow-hidden" id="svg-chart-vessel">
              
              {/* Background horizontal dashed lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none opacity-30 select-none">
                <div className="border-b border-[#ebe7de]" />
                <div className="border-b border-[#ebe7de]" />
                <div className="border-b border-[#ebe7de]" />
              </div>

              {/* Real SVG chart */}
              <svg className="w-full h-full" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Area path */}
                <path
                  d="M10,130 C80,110 140,75 220,105 C300,135 380,45 490,20 L490,150 L10,150 Z"
                  fill="url(#chartGradient)"
                />

                {/* Main line path */}
                <path
                  d="M10,130 C80,110 140,75 220,105 C300,135 380,45 490,20"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Circle trackers */}
                <circle cx="10" cy="130" r="4.5" fill="#1a1917" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="220" cy="105" r="4.5" fill="#1a1917" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="490" cy="20" r="5" fill="#1a1917" stroke="#f59e0b" strokeWidth="2.5" />
              </svg>

              {/* Month markings */}
              <div className="flex justify-between items-center text-[9px] font-mono text-[#a19c91] pt-2 select-none border-t border-[#f2eee8]">
                <span>Dar (Kariakoo) launch</span>
                <span>Zanzibar Partner code release</span>
                <span>Today (Peak CTR: {conversionRate}%)</span>
              </div>
            </div>

            {/* Performance analysis summation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border rounded-xl">
                <strong className="text-xs text-[#1a1917] dark:text-white block">Engagement Velocity tracker</strong>
                <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91] mt-1 leading-normal">
                  Conversion metrics climbed {growthMultiplier}x above average standard records since deploying local Swahili localized hooks in ad drafts.
                </p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border rounded-xl">
                <strong className="text-xs text-[#1a1917] dark:text-white block">Top performing Campaign formats</strong>
                <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91] mt-1 leading-normal">
                  TikTok Storyboards with visual sound transition prompts score 24% higher average watch-time multipliers inside Nairobi & Tanzania.
                </p>
              </div>
            </div>

          </div>

          {/* Interactive ROI Calculator */}
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl space-y-4">
            <h3 className="font-display font-black text-sm text-[#1a1917] dark:text-white flex items-center gap-1.5 select-none">
              <DollarSign className="h-4 w-4 text-emerald-500" /> Creator ROI Profit Calculator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono text-[#a19c91] uppercase font-bold mb-1">Contracted Clients count</label>
                <input 
                  type="number"
                  min={1}
                  value={clientCount}
                  onChange={(e) => setClientCount(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border rounded-xl text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#a19c91] uppercase font-bold mb-1">Price per Campaign (TZS)</label>
                <input 
                  type="number"
                  step={10000}
                  value={averagePrice}
                  onChange={(e) => setAveragePrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border rounded-xl text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#a19c91] uppercase font-bold mb-1">Client target CTR (%)</label>
                <input 
                  type="number"
                  step={0.1}
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border rounded-xl text-center font-bold"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-dashed border-emerald-500/30 rounded-2xl flex justify-between items-center text-xs select-text">
              <div>
                <span className="text-[9px] font-mono font-black uppercase text-emerald-800 dark:text-emerald-400">Projected Monthly net earnings</span>
                <strong className="block text-lg text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">{estimatedEarn.toLocaleString()} TZS / Month</strong>
              </div>
              <button
                onClick={() => {
                  onShowToast("Net earnings calculations cached onto spreadsheet pipeline logs", "success");
                }}
                className="px-3.5 py-1.5 bg-zinc-950 text-white rounded-lg font-bold font-mono text-[9px] uppercase tracking-wider"
              >
                Output data logs
              </button>
            </div>

          </div>

        </div>

        {/* Right side: Top performance lists */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-5 rounded-3xl space-y-4">
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#a19c91]">Conversion-Rate Hook Leaderboard</h3>
            
            <div className="space-y-3.5 select-text">
              {topHooks.map((th, idx) => (
                <div key={idx} className="p-3 bg-[#fcfbf9] dark:bg-[#151413] rounded-2xl border text-xs">
                  <p className="font-bold text-[#1a1917] dark:text-white leading-relaxed">&ldquo;{th.text}&rdquo;</p>
                  
                  <div className="flex justify-between font-mono text-[10px] text-[#a19c91] pt-2 border-t border-[#f2eee8] dark:border-[#2f2e2c] mt-2.5">
                    <span>CTR: <strong className="text-emerald-500">{th.ctr}</strong></span>
                    <span>Engagement: <strong className="text-amber-500">{th.engagement}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-[#1a1917] text-white rounded-3xl space-y-2 select-text">
            <span className="text-[9px] font-mono font-black uppercase text-yellow-300">East African Localization advisory</span>
            <strong className="text-sm block">Kariakoo & Zanzibar target traffic optimization</strong>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-normal">
              Always pair dual English Swahili language filters inside digital campaigns. M-Pesa sandbox integrations capture micro-transactions effortlessly.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
