import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Share2, Layers, BarChart3, Database } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
  onExploreDemo: () => void;
}

export default function LandingPage({ onGetStarted, onViewPricing, onExploreDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#f7f6f2] selection:bg-[#1a1917] selection:text-[#f7f6f2]" id="landing-container">
      {/* Navigation Header */}
      <header className="border-b border-[#e5e2db] bg-[#f7f6f2]/80 backdrop-blur-md sticky top-0 z-40 transition-all" id="landing-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-[#1a1917] flex items-center justify-center shadow-md">
              <Sparkles className="h-5 w-5 text-amber-100" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-[#1a1917]">CreatorOS</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#5c5952] hover:text-[#1a1917] transition-all">Features</a>
            <a href="#bento" className="text-sm font-medium text-[#5c5952] hover:text-[#1a1917] transition-all">SaaS Grids</a>
            <a href="#integrations" className="text-sm font-medium text-[#5c5952] hover:text-[#1a1917] transition-all">Integrations</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              id="landing-btn-demo"
              onClick={onExploreDemo}
              className="text-sm font-semibold text-[#1a1917] hover:bg-[#eadecc] px-4 py-2 rounded-lg transition-all"
            >
              Explore Sandbox
            </button>
            <button
              id="landing-btn-auth"
              onClick={onGetStarted}
              className="text-sm font-semibold bg-[#1a1917] text-[#f7f6f2] hover:bg-[#383531] px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-24 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto" id="landing-hero">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ebe7de] border border-[#d8d4cb] rounded-full text-xs font-mono font-semibold text-[#1a1917] tracking-wider uppercase mb-6 animate-fade-in">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Server-Secured SaaS Architecture
        </div>
        
        <h1 className="font-display font-extrabold text-[#1a1917] leading-tight tracking-tight sm:text-6xl text-4xl mb-6">
          The ultimate control center <br />
          for the <span className="underline decoration-2 decoration-amber-400">modern solopreneur</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#5c5952] max-w-3xl mx-auto font-sans leading-relaxed mb-10">
          CreatorOS is a premium, developer-vetted AI workspace. Build, structure, optimize, and organize high-converting social media posts, blog items, scripts, and email funnels under strict server-side key security.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-btn-primary"
            onClick={onGetStarted}
            className="w-full sm:w-auto font-display font-semibold bg-[#1a1917] text-[#f7f6f2] hover:bg-[#383531] px-8 py-4 rounded-xl shadow-lg transition-all text-base flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            Launch Premium Workspace <ArrowRight className="h-5 w-5 text-amber-200" />
          </button>
          <button
            id="hero-btn-secondary"
            onClick={onViewPricing}
            className="w-full sm:w-auto font-display font-semibold bg-[#ebe7de] text-[#1a1917] hover:bg-[#dedad0] px-8 py-4 rounded-xl border border-[#d8d4cb] shadow-sm transition-all text-base flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            Explore Plans & Pricing
          </button>
        </div>

        {/* Feature badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-8 text-sm text-[#5c5952] font-mono border-t border-b border-[#e5e2db] py-6">
          <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> Real-time Workflows</div>
          <div className="flex items-center gap-2"><Database className="h-4 w-4 text-emerald-600" /> Secure Supabase Auth</div>
          <div className="flex items-center gap-2"><Layers className="h-4 w-4 text-indigo-500" /> Multi-tier Pipeline</div>
          <div className="flex items-center gap-2"><Share2 className="h-4 w-4 text-pink-500" /> Prepped Channel SDKs</div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 bg-white border-t border-[#e5e2db]" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1a1917] mb-4">
              Designed for professional production workflows.
            </h2>
            <p className="text-[#5c5952] font-sans">
              No UI key entry, no client leakages. Enjoy immediate response generation via secure Gemini 3.5 AI APIs routed purely backend.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="features-bento">
            {/* Box 1 */}
            <div className="p-8 rounded-2xl bg-[#f7f6f2] border border-[#e5e2db] transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-[#1a1917]" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#1a1917] mb-2 font-semibold">Gemini content drafting</h3>
              <p className="text-[#5c5952] text-sm leading-relaxed">
                Choose custom objectives, platforms, and exact audiences. The engine generates structured Markdown drafts formatted with elegant hooks and clear Call-To-Actions automatically.
              </p>
            </div>

            {/* Box 2 */}
            <div className="p-8 rounded-2xl bg-[#f7f6f2] border border-[#e5e2db] transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#1a1917] mb-2 font-semibold">Supabase sync</h3>
              <p className="text-[#5c5952] text-sm leading-relaxed">
                Persist draft revisions, workspace projects, and generated marketing histories immediately. Transition flawlessly from quick local memory to standard remote production services.
              </p>
            </div>

            {/* Box 3 */}
            <div className="p-8 rounded-2xl bg-[#f7f6f2] border border-[#e5e2db] transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-indigo-700" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#1a1917] mb-2 font-semibold font-sans">Analytical reporting</h3>
              <p className="text-[#5c5952] text-sm leading-relaxed">
                Check active workflows, draft totals, and estimated tokens consumed inside a streamlined dashboard. Features real indicators of linked integration endpoints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration readiness Section */}
      <section className="py-20 bg-[#efece4] border-t border-b border-[#e2dfd9]" id="integrations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#d8d4cb] rounded-full text-[11px] font-mono font-semibold text-[#1a1917] tracking-wider uppercase mb-4">
              Future Integrations Pipeline
            </div>
            <h2 className="font-display font-bold text-3xl text-[#1a1917] mb-4">
              Multiplex your pipeline directly to social networks
            </h2>
            <p className="text-[#5c5952] text-sm">
              CreatorOS structures JSON formats tailored for future publishing channels. Ready for seamless connection triggers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white border border-[#e5e2db] p-6 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <span className="font-display font-bold text-xl text-[#1a1917] mb-1">WhatsApp</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-mono font-medium px-2 py-0.5 rounded-full">Secure webhook API ready</span>
            </div>
            <div className="bg-white border border-[#e5e2db] p-6 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <span className="font-display font-bold text-xl text-[#1a1917] mb-1">TikTok</span>
              <span className="text-xs bg-[#e2e1dd] text-[#5c5952] font-mono font-medium px-2 py-0.5 rounded-full">Config endpoints ready</span>
            </div>
            <div className="bg-white border border-[#e5e2db] p-6 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <span className="font-display font-bold text-xl text-[#1a1917] mb-1">Instagram</span>
              <span className="text-xs bg-[#e2e1dd] text-[#5c5952] font-mono font-medium px-2 py-0.5 rounded-full">Scheduling slots ready</span>
            </div>
            <div className="bg-white border border-[#e5e2db] p-6 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <span className="font-display font-bold text-xl text-[#1a1917] mb-1">LinkedIn</span>
              <span className="text-xs bg-indigo-100 text-[#1a1917] font-mono font-medium px-2 py-0.5 rounded-full">Active local drafts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-24 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-amber-800 bg-amber-50 px-3 py-1 rounded-full text-center">
              User Stories
            </span>
            <h2 className="font-display font-extrabold text-3xl text-[#1a1917] mt-3">
              Crafted for full-time Solopreneurs
            </h2>
            <p className="text-xs text-[#5c5952] mt-1.5 leading-relaxed">
              Find out how modern content engines scale production and automate draft curation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#fcfbf9] border border-[#e2dfd9] rounded-2xl flex flex-col justify-between">
              <p className="text-xs text-[#1a1917] font-sans leading-relaxed italic">
                "Writing scripts used to consume over six hours of my Sundays. With CreatorOS Specialized Script formats, I have premium video structures ready in seconds."
              </p>
              <div className="mt-6">
                <span className="text-xs font-bold text-[#1a1917] block">Marcus Thorne</span>
                <span className="text-[10px] font-mono text-[#a19c91] uppercase">Growth Hacking Coach (24k subs)</span>
              </div>
            </div>

            <div className="p-8 bg-[#fcfbf9] border border-[#e2dfd9] rounded-2xl flex flex-col justify-between">
              <p className="text-xs text-[#1a1917] font-sans leading-relaxed italic">
                "The sandbox credit limit of 50,000 allowed me to test infinite alternatives. No credit card hooks or hidden keys requested on start."
              </p>
              <div className="mt-6">
                <span className="text-xs font-bold text-[#1a1917] block">Evelyn Rodriguez</span>
                <span className="text-[10px] font-mono text-[#a19c91] uppercase">SaaS Consultant</span>
              </div>
            </div>

            <div className="p-8 bg-[#fcfbf9] border border-[#e2dfd9] rounded-2xl flex flex-col justify-between">
              <p className="text-xs text-[#1a1917] font-sans leading-relaxed italic">
                "Using the local storage fallback works flawlessly when Supabase key limits are reached. I love having an honest offline-first core ready."
              </p>
              <div className="mt-6">
                <span className="text-xs font-bold text-[#1a1917] block">Devon Jenkins</span>
                <span className="text-[10px] font-mono text-[#a19c91] uppercase">Independent Indie Hacker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) block */}
      <section className="py-24 bg-[#ebe7de]/40 border-t border-[#e2dfd9]" id="faq">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-extrabold text-3xl text-[#1a1917]">Frequently Asked Questions</h2>
            <p className="text-xs text-[#5c5952] mt-1.5">Uncover platform specifications and API behaviors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-[#e2dfd9] rounded-2xl">
              <h4 className="font-sans font-bold text-sm text-[#1a1917] mb-2">How do credit limits behave?</h4>
              <p className="text-xs text-[#5c5952] leading-relaxed">
                Tokens and credits are local-first sandbox emulation items. Every generation process securely deducts credits in real-time, matching Gemini token logs.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#e2dfd9] rounded-2xl">
              <h4 className="font-sans font-bold text-sm text-[#1a1917] mb-2">Are my secrets secure?</h4>
              <p className="text-xs text-[#5c5952] leading-relaxed">
                Yes, absolutely. The server-core processes Gemini API keys exclusively server-side. Private secrets never cross boundary frames or browser trackers.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#e2dfd9] rounded-2xl">
              <h4 className="font-sans font-bold text-sm text-[#1a1917] mb-2">Can I migrate to a Supabase database?</h4>
              <p className="text-xs text-[#5c5952] leading-relaxed">
                CreatorOS includes automatic discovery. If Supabase keys are specified in Settings & Secrets, it instantly pivots drafts saved to your live cloud tables.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#e2dfd9] rounded-2xl">
              <h4 className="font-sans font-bold text-sm text-[#1a1917] mb-2">Are social integrations fully live?</h4>
              <p className="text-xs text-[#5c5952] leading-relaxed">
                Integrations leverage high fidelity developer sandboxes, so creators can generate clean visual output matching targeted channel parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Call To Action Section */}
      <section className="py-20 bg-[#1a1917] text-[#f7f6f2] relative overflow-hidden" id="headline-cta">
        <div className="absolute top-0 right-0 h-64 w-64 bg-radial from-amber-500/10 to-transparent rounded-full" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="text-xs font-mono tracking-widest text-amber-300 uppercase block">READY TO DOMINATE PREP STACKS</span>
          <h2 className="font-display font-extrabold text-[#f7f6f2] text-4xl leading-tight">
            Stop starting from scratch. Let CreatorOS handle copy generation.
          </h2>
          <p className="text-xs text-[#c5c2bc] max-w-md mx-auto leading-relaxed">
            Create high-performing hooks, formatted narrative transcripts, and captions ready for social schedulers instantly.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-amber-300 hover:bg-amber-400 text-[#1a1917] font-display font-bold text-sm rounded-xl transition-transform active:scale-95 cursor-pointer shadow-lg inline-flex items-center gap-2"
          >
            Launch Command Deck Free <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer banner */}
      <footer className="py-12 bg-[#0e0d0c] text-[#ebe7de] text-center border-t border-zinc-900" id="landing-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <span className="font-display font-bold tracking-tight text-white text-lg">CreatorOS</span>
          </div>
          <span className="text-sm text-[#c5c2bc] font-mono">
            © 2026 CreatorOS AI Studio App. Built securely full-stack.
          </span>
          <div className="flex gap-4">
            <button onClick={onGetStarted} className="text-xs font-semibold text-amber-200 hover:underline">Launch App</button>
            <span className="text-[#5c5952] text-xs">|</span>
            <button onClick={onViewPricing} className="text-xs font-semibold text-[#ebe7de] hover:underline">Pricing</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
