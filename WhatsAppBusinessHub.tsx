import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  Tag, 
  Clock, 
  CheckCheck, 
  Zap, 
  PhoneCall, 
  Plus, 
  Settings2,
  ThumbsUp,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface ContactItem {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: { sender: 'customer' | 'agent' | 'system'; text: string; time: string }[];
}

export default function WhatsAppBusinessHub({ onShowToast }: { onShowToast: (text: string, type: 'success' | 'info' | 'warning' | 'error') => void }) {
  const [contacts, setContacts] = useState<ContactItem[]>([
    { 
      id: 'c-1', 
      name: 'Salma Joseph (Kariakoo Shop)', 
      phone: '+255 744 112 098', 
      tags: ['Hot Lead', 'Pending M-Pesa'], 
      lastMessage: "Is there a custom cargo tracking template ready?", 
      time: "14:20", 
      unread: true,
      messages: [
        { sender: 'customer', text: "Habari! I want to set up the Tanzanian Cargo delivery preset.", time: "14:15" },
        { sender: 'agent', text: "Habari Salma! Yes, we have a custom dual Swahili cargo template built in.", time: "14:16" },
        { sender: 'customer', text: "Perfect. Is there a custom cargo tracking template ready?", time: "14:20" }
      ]
    },
    { 
      id: 'c-2', 
      name: 'Juma Mwakalindile', 
      phone: '+255 655 450 112', 
      tags: ['Zanzibar Affiliate', 'Aviation client'], 
      lastMessage: "Simulate Zanzibar affiliate code checkout tracking", 
      time: "Yesterday", 
      unread: false,
      messages: [
        { sender: 'customer', text: "Can I track Zanzibar travel codes via Whatsapp automations?", time: "Yesterday" },
        { sender: 'agent', text: "Absolutely, Juma! Set up your webhook node to trigger instant replies.", time: "Yesterday" }
      ]
    }
  ]);

  const [activeContactId, setActiveContactId] = useState<string>('c-1');
  const [typedMessage, setTypedMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Auto Reply Trigger rule state
  const [autoReplies, setAutoReplies] = useState<{ id: string; trigger: string; reply: string; active: boolean }[]>([
    { id: 'ar-1', trigger: 'price', reply: 'Habari yetu! Premium active licenses start at 19,000 TZS monthly. Select upgrade dashboard to authorize sandbox mode instantly.', active: true },
    { id: 'ar-2', trigger: 'cargo', reply: 'Dar es Salaam 24hr Cargo automated delivery slots are open. Check tracking catalog rules.', active: false }
  ]);

  const [newTrigger, setNewTrigger] = useState('');
  const [newReply, setNewReply] = useState('');

  const handleSendMessage = (contactId: string) => {
    if (!typedMessage.trim()) return;
    setContacts(prev => prev.map(c => {
      if (c.id === contactId) {
        return {
          ...c,
          lastMessage: typedMessage,
          unread: false,
          messages: [
            ...c.messages,
            { sender: 'agent' as const, text: typedMessage, time: "Now" }
          ]
        };
      }
      return c;
    }));
    setTypedMessage('');
    onShowToast("Message dispatched in live CRM sandbox queue", "success");
  };

  const handleCreateAutoReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrigger.trim() || !newReply.trim()) return;
    setAutoReplies(prev => [
      ...prev,
      { id: `ar-${Date.now()}`, trigger: newTrigger.toLowerCase(), reply: newReply, active: true }
    ]);
    setNewTrigger('');
    setNewReply('');
    onShowToast(`Configured Whatsapp keyword auto-responder for: "${newTrigger}"`, "success");
  };

  const toggleAutoReply = (id: string) => {
    setAutoReplies(prev => prev.map(ar => {
      if (ar.id === id) {
        const nextState = !ar.active;
        onShowToast(`responder rule is now ${nextState ? 'ENABLED / ACTIVE' : 'DISABLED'}`, "info");
        return { ...ar, active: nextState };
      }
      return ar;
    }));
  };

  // Determine current active contact
  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];

  return (
    <div className="space-y-8" id="whatsapp-crm-panel">
      
      {/* Intro Header */}
      <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-6 rounded-3xl" id="whatsapp-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-text">
          <div>
            <div className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 font-mono font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md mb-2">
              <MessageSquare className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500 animate-pulse" /> whatsapp lead integration bureau
            </div>
            <h1 className="font-display font-black text-[#1a1917] dark:text-white text-2xl tracking-tight">CRM Inbox & Live Responder</h1>
            <p className="text-xs text-[#5c5952] dark:text-[#a19c91] mt-1 pr-4">
              Capture digital funnel leads from social media clicks. Build auto-reply triggers, assign pipeline badges, and compose messages with your AI sales companion.
            </p>
          </div>
          
          <div className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border p-2 rounded-xl text-center">
            Webhook Port status: <strong className="text-emerald-500">Listening on :3000/api/whatsapp</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Leads CRM Inbox */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] rounded-3xl overflow-hidden flex flex-col md:flex-row h-[550px]" id="whatsapp-leads-inbox">
          
          {/* Contacts Directory sidebar */}
          <div className="md:w-80 border-r border-[#e2dfd9] dark:border-[#2f2e2c] flex flex-col bg-[#fcfbf9] dark:bg-[#151413] h-full overflow-y-auto">
            <div className="p-4 border-b border-[#e2dfd9] dark:border-[#2f2e2c]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#a19c91]" />
                <input
                  type="text"
                  placeholder="Query customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex-1 divide-y divide-[#ebe7de]/60 dark:divide-[#2f2e2c] overflow-y-auto select-none">
              {contacts.map((contact) => {
                const isActive = contact.id === activeContactId;
                return (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setActiveContactId(contact.id);
                      contact.unread = false;
                    }}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-all cursor-pointer
                      ${isActive ? 'bg-[#ebe7de]/50 dark:bg-zinc-800/40' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/20'}`}
                  >
                    <div className="h-9 w-9 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold font-mono text-sm shrink-0">
                      {contact.name.split(' ')[0][0]}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-center">
                        <strong className="text-xs font-bold text-[#1a1917] dark:text-white truncate block">{contact.name}</strong>
                        <span className="text-[9px] font-mono text-[#a19c91]">{contact.time}</span>
                      </div>
                      <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91] truncate">{contact.lastMessage}</p>
                      
                      <div className="flex gap-1 flex-wrap pt-1">
                        {contact.tags.map((t, idx) => (
                          <span key={idx} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#ebe7de] text-[#5c5952] leading-none">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {contact.unread && (
                      <span className="h-2 w-2 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                    )}

                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation window */}
          <div className="flex-1 flex flex-col h-full bg-[#fdfcf9] dark:bg-[#1a1917]" id="chat-window-pane">
            
            {/* Header info */}
            <div className="p-4 border-b border-[#e2dfd9] dark:border-[#2f2e2c] flex items-center justify-between bg-white dark:bg-[#1e1d1a] select-text">
              <div>
                <strong className="text-sm font-bold text-[#1a1917] dark:text-white block">{activeContact.name}</strong>
                <span className="text-[10px] font-mono text-[#a19c91] block">{activeContact.phone}</span>
              </div>

              <div className="flex gap-1">
                <button 
                  onClick={() => onShowToast("Mocking voice-call initiation fallback", "info")}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-emerald-600"
                  title="Trigger Phone call CRM logging"
                >
                  <PhoneCall className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bubble list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 select-text">
              {activeContact.messages.map((m, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col max-w-[80%]
                    ${m.sender === 'agent' 
                      ? 'ml-auto items-end bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917] p-3 rounded-2xl rounded-tr-none' 
                      : 'items-start bg-white dark:bg-zinc-850 border border-[#e2dfd9] dark:border-zinc-700 p-3 rounded-2xl rounded-tl-none text-zinc-800 dark:text-zinc-200'}
                  `}
                >
                  <p className="text-xs leading-relaxed">{m.text}</p>
                  <span className="text-[8px] font-mono opacity-70 block mt-1.5">{m.time}</span>
                </div>
              ))}
            </div>

            {/* AI Suggest reply box */}
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/10 border-t border-b border-dashed border-[#ebe7de] dark:border-[#2f2e2c] text-[11px] leading-relaxed select-text flex justify-between items-center">
              <div className="pr-4">
                <span className="font-mono text-[8.5px] font-black text-rose-500 uppercase block">🤖 AI Sales Response Suggestion</span>
                <p className="text-[#a19c91]">"Habari {activeContact.name.split(' ')[0]}! Yes, our custom templates are 100% ready for Kariakoo retail delivery..."</p>
              </div>
              <button
                onClick={() => {
                  setTypedMessage(`Habari ${activeContact.name.split(' ')[0]}! Yes, our custom templates are 100% ready for Kariakoo retail delivery. Let's configure your webhook.`);
                  onShowToast("Loaded AI suggested closing argument", "success");
                }}
                className="px-2.5 py-1 bg-[#1a1917] text-white dark:bg-amber-300 dark:text-[#1a1917] rounded text-[9px] font-bold font-mono whitespace-nowrap"
              >
                Insert draft
              </button>
            </div>

            {/* Text input area */}
            <div className="p-4 border-t border-[#e2dfd9] dark:border-[#2f2e2c] flex items-center gap-2 bg-white dark:bg-[#1e1d1a]">
              <input
                type="text"
                placeholder="Type response dispatch message..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(activeContact.id);
                }}
                className="flex-1 p-2.5 bg-[#fcfbf9] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 rounded-xl text-xs focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage(activeContact.id)}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer shadow"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Right column: Auto Responder rules Setup */}
        <div className="lg:col-span-4 space-y-6" id="whatsapp-rules-panel">
          
          <div className="bg-white dark:bg-[#1a1917] border border-[#e2dfd9] dark:border-[#2f2e2c] p-5 rounded-3xl space-y-4">
            <h3 className="font-display font-black text-sm text-[#1a1917] dark:text-white flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" /> WhatsApp Auto-Reply triggers
            </h3>

            <div className="space-y-2.5 select-none text-xs">
              {autoReplies.map((ar) => (
                <div 
                  key={ar.id}
                  className="p-3.5 bg-[#fcfbf9] dark:bg-zinc-900 border border-[#ebe7de]/80 dark:border-zinc-800 rounded-2xl flex flex-col gap-2 relative overflow-hidden"
                >
                  <div className="flex justify-between items-center border-b border-dashed border-[#ebe7de] dark:border-[#2f2e2c] pb-1.5">
                    <span className="font-mono text-[9px] font-black uppercase text-[#a19c91]">
                      Keyword: &ldquo;<strong className="text-[#1a1917] dark:text-amber-200">{ar.trigger}</strong>&rdquo;
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleAutoReply(ar.id)}
                      className={`px-2 py-0.5 text-[8px] font-mono uppercase font-black rounded
                        ${ar.active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20' : 'bg-zinc-100 text-[#a19c91]'}`}
                    >
                      {ar.active ? 'Armed' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-[10.5px] italic text-[#5c5952] dark:text-[#a19c91] leading-relaxed">
                    {ar.reply}
                  </p>
                </div>
              ))}
            </div>

            {/* Setup autoreply */}
            <form onSubmit={handleCreateAutoReply} className="space-y-2 pt-3 border-t border-dashed border-[#ebe7de] dark:border-[#2f2e2c]">
              <input 
                type="text"
                required
                placeholder="Message contains keyword (e.g. details)"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                className="w-full p-2 bg-[#fdfdfc] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 text-[10px] rounded-lg focus:outline-none"
              />
              <textarea 
                rows={2}
                required
                placeholder="Type absolute auto-reply text template..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="w-full p-2 bg-[#fdfdfc] dark:bg-zinc-800 border border-[#e2dfd9] dark:border-zinc-700 text-[10px] rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#1a1917] dark:bg-zinc-800 hover:bg-[#383531] text-white rounded-lg text-[9px] font-mono font-black uppercase tracking-wider cursor-pointer"
              >
                + Deploy Keyword Responder
              </button>
            </form>
          </div>

          {/* Quick reply rules template support */}
          <div className="p-5 bg-gradient-to-br from-emerald-600/10 to-transparent border border-emerald-500/10 rounded-3xl select-text leading-relaxed">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1 leading-none">⚡ Kariakoo & East Africa Localized presets</h4>
            <p className="text-[11px] text-[#5c5952] dark:text-[#a19c91] font-normal leading-normal">
              Activate automated webhook responses answering shipping, flight rates, Zanzibar travel guides, or M-Pesa automated pins to capture hot leads instantly.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
