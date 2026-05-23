import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Star, Sparkles, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';

interface SubscriptionPlansProps {
  currentPlan: string;
  onUpgradePlan: (planName: string) => void;
}

export default function SubscriptionPlans({ currentPlan, onUpgradePlan }: SubscriptionPlansProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanToCheckout, setSelectedPlanToCheckout] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money'>('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const plans = [
    {
      name: "Free Sandbox",
      price: 0,
      description: "Default developer tier for platform diagnostic exploration and localized testing.",
      prefix: "$",
      suffix: "forever",
      features: [
        "In-process mock database fallback",
        "Secure server-side API proxy triggers",
        "Local copiers and plaintext TXT exports",
        "Estimated Word Metrics & Token indicators",
        "Core WhatsApp, TikTok scheduling guides"
      ],
      badge: "Core",
      popular: false,
      buttonText: "Current Plan Tier"
    },
    {
      name: "Freelancer Pro",
      price: billingPeriod === 'monthly' ? 19 : 14,
      description: "For solopreneurs and content writers seeking extensive scale and API stability.",
      prefix: "$",
      suffix: "/ mo",
      features: [
        "Everything in Sandbox",
        "Unrestricted Gemini AI workflow drafts",
        "Supabase cloud synchronization endpoints",
        "Secure project save/load revisions",
        "Custom print-to-PDF export layouts",
        "Future social multiplex connection tokens",
        "Premium response priority speeds"
      ],
      badge: "Professional choice",
      popular: true,
      buttonText: "Upgrade Workspace Now"
    },
    {
      name: "Agency Team",
      price: billingPeriod === 'monthly' ? 49 : 39,
      description: "The complete social media command center for scaling brand managers.",
      prefix: "$",
      suffix: "/ mo",
      features: [
        "Everything in Freelancer Pro",
        "Unlimited custom prompt tokens",
        "LemonSqueezy active webhook bindings",
        "Multi-auth workspace profiles",
        "WhatsApp Broadcast Webhook channels",
        "Priority Developer support lines",
        "Shared team revision folders"
      ],
      badge: "Scale, Unlimited",
      popular: false,
      buttonText: "Provision Agency Node"
    }
  ];

  const handleSelectUpgrade = (planName: string) => {
    if (planName === currentPlan) return;
    setSelectedPlanToCheckout(planName);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanToCheckout) return;

    setIsPaying(true);
    // Simulate interactive gateway latency
    setTimeout(() => {
      onUpgradePlan(selectedPlanToCheckout);
      setIsPaying(false);
      setSelectedPlanToCheckout(null);
      setPhoneNumber('');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10" id="pricing-plans-canvas">
      
      {/* Pricing Header */}
      <div className="text-center max-w-3xl mx-auto" id="pricing-headline-block">
        <h1 className="font-display font-extrabold text-[#1a1917] text-3xl sm:text-4xl mb-3 tracking-tight">SaaS Subscription & Commands</h1>
        <p className="text-[#5c5952] text-sm">
          Select the command center capability suited to your volume content requirements. Integrated sandbox gateway enables fast upgrade checks.
        </p>

        {/* Toggle billing option */}
        <div className="mt-6 inline-flex p-1 bg-[#ebe7de] rounded-xl border border-[#e2dfd9]" id="pricing-selector-toggle">
          <button
            type="button"
            onClick={() => setBillingPeriod('monthly')}
            className={`
              px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer font-sans transition-colors
              ${billingPeriod === 'monthly' ? 'bg-[#1a1917] text-[#f7f6f2] shadow' : 'text-[#5c5952] hover:text-[#1a1917]'}
            `}
          >
            Monthly Period
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod('yearly')}
            className={`
              px-4 py-[7px] rounded-lg text-xs font-semibold cursor-pointer font-sans transition-colors flex items-center gap-1.5
              ${billingPeriod === 'yearly' ? 'bg-[#1a1917] text-[#f7f6f2] shadow' : 'text-[#5c5952] hover:text-[#1a1917]'}
            `}
          >
            Yearly Billing <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold font-sans">Save 25%</span>
          </button>
        </div>
      </div>

      {/* Cards Display Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="pricing-cards-grid">
        {plans.map((pl) => {
          const matchedPlan = currentPlan === pl.name;

          return (
            <div
              key={pl.name}
              id={`pricing-card-item-${pl.name.replace(/\s+/g, "-").toLowerCase()}`}
              className={`
                bg-white border p-8 rounded-3xl relative flex flex-col justify-between transition-all duration-300
                ${matchedPlan 
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20' 
                  : pl.popular 
                    ? 'border-[#1a1917] shadow-lg md:scale-105 z-10' 
                    : 'border-[#e2dfd9] hover:shadow-md'}
              `}
            >
              
              {/* Popularity badges */}
              {pl.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1a1917] text-amber-200 text-[10px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-200" /> RECOMMENDED WORKSPACE
                </span>
              )}

              {matchedPlan && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> CURRENT ACTIVE LEVEL
                </span>
              )}

              {/* Box Info */}
              <div>
                <span className="text-[10px] font-mono bg-[#ebe7de] text-[#1a1917] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase inline-block mb-4">
                  {pl.badge}
                </span>

                <h3 className="font-display font-bold text-xl text-[#1a1917] mb-2 font-semibold">{pl.name}</h3>
                <p className="text-xs text-[#5c5952] leading-relaxed min-h-[48px] mb-6">{pl.description}</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-display font-extrabold text-[#1a1917]">{pl.prefix}{pl.price}</span>
                  <span className="text-[#a19c91] text-sm font-sans">{pl.suffix}</span>
                </div>

                {/* Features Loop */}
                <ul className="space-y-3.5 mb-8 border-t border-[#f2eee8] pt-6 text-sm">
                  {pl.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#1a1917]">
                      <Check className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Update Buttons */}
              <button
                type="button"
                id={`upgrade-panel-btn-${pl.name.replace(/\s+/g, "-").toLowerCase()}`}
                disabled={matchedPlan}
                onClick={() => handleSelectUpgrade(pl.name)}
                className={`
                  w-full py-3 rounded-xl font-display font-semibold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer
                  ${matchedPlan 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-inner' 
                    : pl.popular 
                      ? 'bg-[#1a1917] text-[#f7f6f2] hover:bg-[#383531]' 
                      : 'bg-[#ebe7de] text-[#1a1917] hover:bg-[#dedad0] border border-[#d8d4cb]'}
                `}
              >
                {matchedPlan ? (
                  <>✓ Active Integration</>
                ) : (
                  <>
                    {pl.buttonText} 
                    {!matchedPlan && <ArrowRight className="h-3.5 w-3.5" />}
                  </>
                )}
              </button>

            </div>
          );
        })}
      </div>

      {/* Verified Payment Channels */}
      <div className="p-6 rounded-2xl bg-[#ebe7de]/40 border border-[#e2dfd9] text-center max-w-2xl mx-auto space-y-2">
        <h4 className="font-display font-bold text-[#1a1917] text-sm flex items-center justify-center gap-1">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" /> Verified Payment Channels
        </h4>
        <p className="text-xs text-[#5c5952] leading-relaxed">
          Our LemonSqueezy integration pipelines utilize standard SHA-256 webhook signatures. No purchase parameters can be hijacked or modified inside browser variables.
        </p>
      </div>

      {/* Dynamic Interactive checkout Simulator Overlay */}
      {selectedPlanToCheckout && (
        <div className="fixed inset-0 z-50 bg-[#1a1917]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl p-6 w-full max-w-md space-y-6 shadow-2xl relative select-text text-left">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-wider bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-bold px-2 py-0.5 rounded uppercase">
                  LemonSqueezy Secure Checkout
                </span>
                <h3 className="font-display font-black text-[#1a1917] dark:text-white text-base mt-1">Upgrade: {selectedPlanToCheckout}</h3>
              </div>
              <button 
                onClick={() => setSelectedPlanToCheckout(null)}
                className="p-1 px-2.5 rounded-lg text-xs bg-[#f2eee8] dark:bg-zinc-800 text-[#5c5952] hover:text-[#1a1917] hover:bg-[#eadecc]"
              >
                Cancel
              </button>
            </div>

            {/* Toggle method */}
            <div className="grid grid-cols-2 p-1 bg-[#f7f6f2] dark:bg-[#111110] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-xl text-center">
              <button
                type="button"
                onClick={() => setPaymentMethod('mobile_money')}
                className={`py-2 text-[10px] font-mono uppercase font-black rounded-lg transition-all cursor-pointer
                  ${paymentMethod === 'mobile_money' 
                    ? 'bg-[#1a1917] text-[#f7f6f2] dark:bg-amber-300 dark:text-[#1a1917]' 
                    : 'text-[#5c5952] dark:text-zinc-400'}`}
              >
                East Africa mobile money
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 text-[10px] font-mono uppercase font-black rounded-lg transition-all cursor-pointer
                  ${paymentMethod === 'card' 
                    ? 'bg-[#1a1917] text-[#f7f6f2] dark:bg-amber-300 dark:text-[#1a1917]' 
                    : 'text-[#5c5952] dark:text-zinc-400'}`}
              >
                International Credit Card
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              
              {paymentMethod === 'mobile_money' ? (
                <div className="space-y-3">
                  <p className="text-[10px] text-[#5c5952] dark:text-[#a19c91] leading-relaxed italic">
                    Push an instant automated STK Push PIN request directly to your phone via M-Pesa, TigoPesa, AirtelMoney or HaloPesa.
                  </p>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-[#a19c91] uppercase mb-1">Mobile number (+254 / +255 / +256)</label>
                    <input 
                      type="tel"
                      required
                      placeholder="e.g. +255 744 123 456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs font-bold font-mono focus:outline-none focus:border-[#1a1917]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-[#a19c91] uppercase mb-1">Security credit card Number</label>
                    <input 
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-[#a19c91] uppercase mb-1">Expiry CVV</label>
                      <input 
                        type="text"
                        required
                        placeholder="MM/YY"
                        className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs font-mono text-center focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-[#a19c91] uppercase mb-1">CVC Code</label>
                      <input 
                        type="password"
                        required
                        maxLength={3}
                        placeholder="***"
                        className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs font-mono text-center focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#fcfbf9] dark:bg-[#151413] border border-dashed border-[#e2dfd9] dark:border-[#2f2e2c] p-3.5 rounded-2xl text-[10px] text-[#5c5952] dark:text-[#a19c91] flex justify-between font-mono">
                <span>Selected Gateway: <strong>{paymentMethod === 'mobile_money' ? 'M-PESA/TIGOPESA' : 'STRIPE/VISA'}</strong></span>
                <span>Subtotal Price: <strong>{selectedPlanToCheckout === 'Freelancer Pro' ? '$19.00' : '$49.00'}</strong></span>
              </div>

              <button
                type="submit"
                disabled={isPaying}
                className="w-full py-3 rounded-xl font-display font-bold text-xs bg-[#1a1917] hover:bg-[#383531] dark:bg-amber-300 dark:hover:bg-amber-400 dark:text-[#1a1917] text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50 transition-all"
              >
                {isPaying ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying STK parameters ...
                  </>
                ) : (
                  <>
                    Authorize Premium Sandbox License <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>

            </form>

            <p className="text-[9px] text-[#a19c91] leading-relaxed text-center font-mono">
              Demo sandbox mode simulation requires zero real funds. Click Authorize to instant update account.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}
