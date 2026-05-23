import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Compass, Radio, UserCheck, ShieldCheck } from 'lucide-react';

interface OnboardingFlowProps {
  userName: string;
  onOnboardingComplete: (preferences: {
    niche: string;
    platforms: string[];
    defaultTone: string;
  }) => void;
}

export default function OnboardingFlow({ userName, onOnboardingComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [tone, setTone] = useState('Professional & Bold');

  const niches = [
    { id: 'saas', name: 'SaaS & Tech product creator', desc: 'Indie hacking, developers, software brands' },
    { id: 'solopreneur', name: 'Agency Solopreneur / Freelancer', desc: 'Consulting, services, personal branding' },
    { id: 'lifestyle', name: 'Lifestyle & Content Curator', desc: 'Travel, design, digital nomad, wellness' },
    { id: 'finance', name: 'Finance & Growth Hacking', desc: 'Investments, crypto, scale metrics, business' }
  ];

  const platforms = ['LinkedIn Post', 'TikTok Script', 'Instagram Caption', 'YouTube Script', 'Newsletter Post'];

  const tones = ['Professional & Bold', 'Casual & Witty', 'Empathetic & Genuine', 'Educational & Authoritative'];

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      onOnboardingComplete({
        niche: niche || niches[0].name,
        platforms: selectedPlatforms.length > 0 ? selectedPlatforms : [platforms[0]],
        defaultTone: tone
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#fcfbf9] dark:bg-[#0f0e0c]" id="onboarding-lightbox">
      <div className="max-w-xl w-full bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl shadow-2xl p-8 relative overflow-hidden" id="onboarding-modal-card">
        
        {/* Background gradient element */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-radial from-amber-100/20 to-transparent dark:from-amber-500/5 rounded-full pointer-events-none" />

        {/* Dynamic header step indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
            <span className="font-display font-black text-sm tracking-tight text-[#1a1917] dark:text-[#f7f6f2]">CreatorOS Workbench Launch</span>
          </div>
          <div className="flex gap-1.5" id="step-dots-holder">
            {[1, 2, 3, 4].map((s) => (
              <span 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-6 bg-[#1a1917] dark:bg-amber-300' : 'w-1.5 bg-[#ebe7de] dark:bg-[#2f2e2c]'}`} 
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6" id="onboarding-step-1">
            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-[#1a1917] dark:text-[#f7f6f2] text-2xl">
                Hey {userName || "Creator"}, let's customize your command deck.
              </h2>
              <p className="text-sm text-[#5c5952] dark:text-[#a19c91]">
                Choose your primary content curation niche to setup specialized workspace parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {niches.map((n) => {
                const isSelected = niche === n.name;
                return (
                  <button
                    key={n.id}
                    onClick={() => setNiche(n.name)}
                    className={`
                      p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer w-full
                      ${isSelected 
                        ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300/30 dark:bg-amber-950/20 dark:border-amber-800' 
                        : 'bg-white dark:bg-[#1a1917] border-[#e2dfd9] hover:bg-[#fcfbf9] dark:border-[#2f2e2c] dark:hover:bg-[#201f1c]'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#1a1917] dark:text-[#f7f6f2]">{n.name}</span>
                      {isSelected && <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-0.5">{n.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6" id="onboarding-step-2">
            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-[#1a1917] dark:text-[#f7f6f2] text-2xl">
                Which platforms do you target?
              </h2>
              <p className="text-sm text-[#5c5952] dark:text-[#a19c91]">
                Select the workspace default channels you publish on repeatedly.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {platforms.map((p) => {
                const isSelected = selectedPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`
                      px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer
                      ${isSelected 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200' 
                        : 'bg-[#fcfbf9] text-[#1a1917] hover:bg-[#ebe7de]/70 dark:bg-[#1f1e1a] dark:text-[#eceae6] border-[#e2dfd9] dark:border-[#2f2e2c]'}
                    `}
                  >
                    {p} {isSelected ? "✓" : "+"}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6" id="onboarding-step-3">
            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-[#1a1917] dark:text-[#f7f6f2] text-2xl">
                Define your voice character.
              </h2>
              <p className="text-sm text-[#5c5952] dark:text-[#a19c91]">
                Set the default copy formulation tone. You can adjust this for any task later.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {tones.map((t) => {
                const isSelected = tone === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`
                      p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer
                      ${isSelected
                        ? 'bg-[#1a1917] text-[#f7f6f2] border-[#1a1917] dark:bg-amber-300 dark:text-[#1a1917] dark:border-amber-300'
                        : 'bg-white dark:bg-[#1a1917] hover:bg-[#fcfbf9] dark:hover:bg-[#252420] text-[#1a1917] dark:text-white border-[#e2dfd9] dark:border-[#2f2e2c]'}
                    `}
                  >
                    <span className="text-xs font-mono tracking-widest uppercase block mb-1">Preset</span>
                    <span className="text-xs font-bold font-sans">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center" id="onboarding-step-4">
            <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto dark:bg-emerald-950/40">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-extrabold text-[#1a1917] dark:text-[#f7f6f2] text-2xl">
                SaaS Workbench Ready!
              </h2>
              <p className="text-sm text-[#5c5952] dark:text-[#a19c91] max-w-sm mx-auto leading-relaxed">
                We've provisioned local emulator resources securely and topped off your sandbox tokens!
              </p>
            </div>

            <div className="bg-[#ebe7de]/30 dark:bg-zinc-800/20 border border-[#e2dfd9] dark:border-[#2f2e2c] p-4 rounded-2xl max-w-sm mx-auto text-center">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#5c5952] dark:text-[#a19c91]">Starting Credit Pool</span>
              <p className="text-2xl font-black text-[#1a1917] dark:text-amber-300 mt-1">50,000 Credits</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold font-mono mt-0.5">UNLIMITED sandbox calls allowed</p>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-8 border-t border-[#f2eee8] dark:border-[#2f2e2c] pt-5 flex justify-between items-center">
          <span className="text-xs font-mono text-[#a19c91]">
            {step === 4 ? "Finished Setup" : `Progress: ${(step / 4) * 100}%`}
          </span>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-[#1a1917] dark:bg-amber-300 hover:bg-[#383531] dark:hover:bg-amber-400 text-white dark:text-[#1a1917] rounded-xl font-display font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {step === 4 ? "Access Workspace Dashboard" : "Next Parameter"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
