import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  Link2, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Plus, 
  Trash2, 
  DollarSign, 
  Users, 
  FileText, 
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ProductItem {
  id: string;
  title: string;
  priceTZS: number;
  type: 'ebook' | 'template' | 'preset' | 'course' | 'subscription';
  sales: number;
  revenueTZS: number;
  fileSize: string;
}

interface AffiliateCampaign {
  id: string;
  name: string;
  clicks: number;
  conversions: number;
  payoutTZS: number;
  referralLink: string;
}

export default function MonetizationStore({ onShowToast }: { onShowToast: (text: string, type: 'success' | 'info' | 'warning' | 'error') => void }) {
  const [activeTab, setActiveTab] = useState<'store' | 'affiliate'>('store');
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Products listings state
  const [products, setProducts] = useState<ProductItem[]>(
    [
      { id: 'prod-1', title: 'Kariakoo Shopify Speedster Guides', priceTZS: 49000, type: 'ebook', sales: 142, revenueTZS: 6958000, fileSize: '12.4 MB' },
      { id: 'prod-2', title: 'Bilingual Swahili TikTok Pacing presets', priceTZS: 29000, type: 'preset', sales: 310, revenueTZS: 8990000, fileSize: '4.8 MB' },
      { id: 'prod-3', title: 'Zanzibar Hospitality Instagram strategy', priceTZS: 120000, type: 'course', sales: 48, revenueTZS: 5760000, fileSize: '1.2 GB' }
    ]
  );

  // Affiliate Campaigns listings state
  const [campaigns, setCampaigns] = useState<AffiliateCampaign[]>([
    { id: 'aff-1', name: 'Zanzibar Beach Tour Flight Partner', clicks: 1200, conversions: 54, payoutTZS: 2700000, referralLink: 'https://ais.pre/aff/beach-zanzibar?code=hapeenooo333' },
    { id: 'aff-2', name: 'Dar es Salaam Dedicated Premium Server Hosting', clicks: 840, conversions: 24, payoutTZS: 1440000, referralLink: 'https://ais.pre/aff/server-dar?code=hapeenooo333' }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(25000);
  const [newType, setNewType] = useState<'ebook' | 'template' | 'preset' | 'course' | 'subscription'>('ebook');

  const handleCopyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLinkId(id);
    onShowToast("Affiliate campaign link copied to clipboard!", "success");
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onShowToast("Product details title cannot be blank.", "warning");
      return;
    }
    const newItem: ProductItem = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      priceTZS: Number(newPrice),
      type: newType,
      sales: 0,
      revenueTZS: 0,
      fileSize: "8.5 MB"
    };

    setProducts(prev => [newItem, ...prev]);
    setNewTitle('');
    onShowToast(`Product: "${newItem.title}" deployed onto digital storefront catalog!`, "success");
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    onShowToast("Product removed from storefront inventory.", "info");
  };

  // Aggregated totals
  const totalSalesCount = products.reduce((acc, p) => acc + p.sales, 0);
  const totalStoreRevenue = products.reduce((acc, p) => acc + p.revenueTZS, 0);
  const totalAffEarnings = campaigns.reduce((acc, c) => acc + c.payoutTZS, 0);

  return (
    <div className="space-y-8" id="monetization-storefront-wrapper">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl" id="store-intro">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-text">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 font-mono font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md mb-2">
              <ShoppingBag className="h-4 w-4 text-emerald-500 animate-bounce" /> Creator digital product commerce
            </div>
            <h1 className="font-display font-black text-[#1a1917] dark:text-white text-2xl tracking-tight">Monetization Bureau & Affiliate Empire</h1>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-1 pr-4">
              Upload templates, eBooks, or presets, and configure automated payment checkout gateways. Monitor your secondary affiliate marketing conversions.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#ebe7de]/60 dark:bg-[#201f1c] px-4 py-2.5 rounded-2xl border border-dashed border-[#d8d4cb] text-xs font-mono font-bold text-[#1a1917] dark:text-amber-200 select-none">
            Digital Gross: <strong>{(totalStoreRevenue + totalAffEarnings).toLocaleString()} TZS</strong>
          </div>
        </div>
      </div>

      {/* Main totals dashboards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="monetization-telem-grid">
        <div className="p-5 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl text-center select-text">
          <span className="text-[10px] font-mono text-[#a19c91] block uppercase">Direct Storefront Sales</span>
          <strong className="text-2xl font-display font-bold text-amber-500 mt-1 block">{totalSalesCount} units</strong>
          <span className="text-[10px] text-[#a19c91] font-mono block mt-1">across {products.length} catalog items</span>
        </div>
        <div className="p-5 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl text-center select-text">
          <span className="text-[10px] font-mono text-[#a19c91] block uppercase">Digital Storefront Revenue</span>
          <strong className="text-2xl font-display font-bold text-emerald-500 mt-1 block">{totalStoreRevenue.toLocaleString()} TZS</strong>
          <span className="text-[10px] text-emerald-700 font-mono font-bold block mt-1">Payout Sandbox Standard</span>
        </div>
        <div className="p-5 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl text-center select-text">
          <span className="text-[10px] font-mono text-[#a19c91] block uppercase">Affiliate Campaign Earnings</span>
          <strong className="text-2xl font-display font-bold text-indigo-500 mt-1 block">{totalAffEarnings.toLocaleString()} TZS</strong>
          <span className="text-[10px] text-[#a19c91] font-mono block mt-1">from {campaigns.reduce((acc, c) => acc + c.clicks, 0)} customer clicks</span>
        </div>
      </div>

      {/* Tab select HUD */}
      <div className="flex items-center gap-1 bg-[#ebe7de]/50 dark:bg-zinc-950 p-1 border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-2xl max-w-xs select-none">
        <button
          onClick={() => setActiveTab('store')}
          className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all flex-1
            ${activeTab === 'store' ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' : 'text-[#5c5952] hover:text-[#1a1917]'}`}
        >
          🛍️ digital products Catalog
        </button>
        <button
          onClick={() => setActiveTab('affiliate')}
          className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all flex-1
            ${activeTab === 'affiliate' ? 'bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917]' : 'text-[#5c5952] hover:text-[#1a1917]'}`}
        >
          🔗 affiliate campaigns
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {activeTab === 'store' ? (
          <>
            {/* Deploy new digital product catalog */}
            <div className="lg:col-span-5 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl h-fit select-text">
              <h3 className="font-display font-black text-sm mb-4 text-[#1a1917] dark:text-white flex items-center gap-1.5 select-none">
                <Plus className="h-4 w-4 text-amber-500" /> Catalog New Digital Asset
              </h3>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Product Title</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Zanzibar Lightroom Presets Pack"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Target Price (TZS)</label>
                    <input 
                      type="number"
                      required
                      min={1000}
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-black text-[#a19c91] mb-1">Asset Category</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 text-xs font-bold rounded-xl"
                    >
                      <option value="ebook">e-Book PDF Blueprint</option>
                      <option value="preset">Lightroom / Video Presets</option>
                      <option value="course">Video Course bundle</option>
                      <option value="template">Notion / Workspace Templates</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1a1917] hover:bg-[#383531] dark:bg-amber-300 dark:hover:bg-amber-400 dark:text-[#1a1917] text-white font-bold text-xs rounded-xl transition-all shadow cursor-pointer"
                >
                  Deploy onto live Storefront
                </button>
              </form>
            </div>

            {/* Direct Digital catalog lists */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#a19c91] px-1 select-none">Live Store Storefront Catalog</h3>
              
              <div className="space-y-4">
                {products.map((p) => (
                  <div 
                    key={p.id}
                    className="p-5 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl flex justify-between items-start gap-4 select-text relative"
                  >
                    <div>
                      <span className="text-[9px] font-mono uppercase font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded mr-2">
                        {p.type}
                      </span>
                      <strong className="text-sm text-[#1a1917] dark:text-white block mt-2">{p.title}</strong>
                      <p className="text-[10px] text-[#a19c91] font-mono mt-1">Price: {p.priceTZS.toLocaleString()} TZS | Size: {p.fileSize}</p>
                    </div>

                    <div className="text-right space-y-2">
                      <div>
                        <strong className="block text-xs font-bold text-[#1a1917] dark:text-white">{(p.sales).toLocaleString()} Units sold</strong>
                        <span className="text-[10px] text-emerald-600 font-mono font-bold">{p.revenueTZS.toLocaleString()} TZS</span>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-500 hover:text-red-700 font-bold uppercase text-[9px] flex items-center justify-end gap-1 w-full cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          
          /* Affiliate Campaign log panels */
          <div className="lg:col-span-12 space-y-4">
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#a19c91] px-1 select-none">Affiliate refer networks</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((c) => (
                <div 
                  key={c.id}
                  className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl space-y-4 select-text"
                >
                  <div className="flex justify-between items-start border-b border-dashed border-[#ebe7de] dark:border-[#2f2e2c] pb-3">
                    <div>
                      <strong className="text-sm text-[#1a1917] dark:text-white block">{c.name}</strong>
                      <span className="text-[9px] font-mono text-[#a19c91] block mt-0.5">Campaign Identifier ID: {c.id}</span>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#1a1917] dark:text-amber-300">
                      Payout: {c.payoutTZS.toLocaleString()} TZS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#fcfbf9] dark:bg-zinc-800/40 p-3 rounded-xl text-center border">
                      <span className="text-[9px] font-mono text-[#a19c91] block">clicks</span>
                      <strong className="text-base font-bold text-[#1a1917] dark:text-white">{c.clicks} clicks</strong>
                    </div>
                    <div className="bg-[#fcfbf9] dark:bg-zinc-800/40 p-3 rounded-xl text-center border">
                      <span className="text-[9px] font-mono text-[#a19c91] block">conversions</span>
                      <strong className="text-base font-bold text-amber-500">{c.conversions}</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[9px] font-mono text-[#a19c91] block uppercase font-bold">Referral link</span>
                    <div className="flex bg-gray-50 dark:bg-zinc-950 border p-2 rounded-xl items-center justify-between font-mono text-[10px] text-[#5c5952] dark:text-zinc-300">
                      <span className="truncate flex-1 mr-2">{c.referralLink}</span>
                      <button
                        onClick={() => handleCopyLink(c.id, c.referralLink)}
                        className="p-1 px-2.5 bg-white dark:bg-[#1a1917] border rounded hover:bg-gray-150 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {copiedLinkId === c.id ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Link2 className="h-3 w-3" />
                        )}
                        {copiedLinkId === c.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Affiliate ranks guidelines */}
            <div className="p-6 bg-gradient-to-br from-amber-500/10 to-transparent border rounded-3xl select-text leading-relaxed">
              <h4 className="text-xs font-bold text-[#1a1917] dark:text-amber-200 mb-1 leading-none uppercase tracking-wider">🌟 Top Earner program rules</h4>
              <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91] font-normal leading-normal">
                Share campaigns references via your customized TikTok, YouTube or Zanzibar blog script posts. Monitor clicks, map automated checkout payouts directly, and track sandbox rewards instantly.
              </p>
            </div>

          </div>
        )
        }

      </div>

    </div>
  );
}
