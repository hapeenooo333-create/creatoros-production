export interface BrandVoice {
  niche?: string;
  targetAudience?: string;
  tone?: string;
  offer?: string;
  contentStyle?: string;
  language?: string;
  brandColors?: string;
  ctaPhrase?: string;
  brandVoice?: any;
  extraParam?: string;
  volume?: string;
}

export function generateDemoContent(
  type: string, 
  topic: string, 
  voice: BrandVoice
): string {
  // Resolve language and settings safely
  const activeLanguage = voice.language || "Bilingual Swahili + English";
  const activeTone = voice.tone || "Professional & Bold";
  const isSwahili = activeLanguage.toLowerCase().includes('swahili');
  const safeTopic = topic || "SaaS operations";

  // BrandVoice profile prompt generator tool handler
  if (type === 'brandvoice' || type === 'brand') {
    return `💎 CORE BRAND IDENTITY SYSTEM SUMMARY:
────────────────────────────────────────
Niche: ${voice.brandVoice?.niche || "SaaS digital platform developer"}
Target Customers: ${voice.brandVoice?.targetAudience || "Business owners in Tanzania"}
Brand Tone Rules: ${voice.brandVoice?.tone || "Professional, authoritative & witty"}
Recurring offer: ${voice.brandVoice?.offer || "SaaS Creator Sandbox platform licensing"}
Theme colors: ${voice.brandVoice?.brandColors || "Black, Amber & Slate Gray"}
Call-To-Action Phrase: ${voice.brandVoice?.ctaPhrase || "Authorize your pro license now!"}

📌 SYSTEM STATUS RECOMMENDATION:
You have synchronized this core persona. The AI workspace will prioritize using these guidelines when deploying multi-platform posts automatically.`;
  }

  if (type === 'hooks') {
    if (isSwahili) {
      return `🪝 HOOK #1 (Curiosity Gap):
Habari Kiongozi! Did you know Juma Mwakalindile saves 5 hours daily in Kariakoo?
Here is how our custom webhook pipeline automates manual shop entries...

🪝 HOOK #2 (Painless Urgency):
Acha kufanya kazi kama mtumwa wa spreadsheet! 
This single campaign setup triggers automated M-Pesa sandbox updates in seconds.

🪝 HOOK #3 (Local Authority):
Dar es Salaam is shifting to automated social commerce fast. Did your store get left behind Juma’s?`;
    } else {
      return `🪝 HOOK #1 (The Pattern Interrupt):
Most shop owners lose 14 hours every single week in repetitive spreadsheets.
Here is the exact framework to automate everything with one tap.

🪝 HOOK #2 (Pain vs Reward):
Manual invoices are a silent killer for scaling startups. Let this AI agent handle all CRM logging.

🪝 HOOK #3 (Strategic Authority):
I scaled my digital product agency with zero employees. Let me show you the unified command cockpit.`;
    }
  }

  if (type === 'script') {
    if (isSwahili) {
      return `🎬 VERTICAL SCRIPT (Bilingually optimized for TikTok / Reels 9:16):
[SCENE 1 - 0:00 - Fast Cut]
(Visual: Close up Juma Juma typing frantically on keyboard, sweat pouring in Kariakoo shop)
Audio: "Acha kufanya kazi kwa mikono! Biashara yako inahitaji multi-user automation."

[SCENE 2 - 0:04 - Slider Transition]
(Visual: Clean dashboard interface showing M-pesa invoice push simulator complete)
Audio: "Sasa hivi we can generate campaign posts across TikTok, Instagram, and LinkedIn in one click bilingually."

[SCENE 3 - 0:10 - Call to Action]
(Visual: Text overlay 'UPGRADE WORKSPACE NOW' with gold border)
Audio: "Authorize your Sandbox license right now inside the billing dashboard. Simple as that!"`;
    } else {
      return `🎬 VERTICAL SCRIPT (9:16 Ultra Hook Edition):
[SCENE 1 - 0:00 - Visual pattern interrupt]
(Visual: Fast hand click overlay showing 'STK Payment Simulator Approved')
Audio: "Stop manually copying and pasting your brand copies across five channels."

[SCENE 2 - 0:03 - Zoom In]
(Visual: Split panel screen displaying Claude, Gemini and Groq side by side running simultaneously)
Audio: "This multi-model AI command cockpit auto failovers if your primary gateway goes down."

[SCENE 3 - 0:08 - Call to Action]
(Visual: High contrast button with QR code)
Audio: "Click below to secure your pro sandbox license today!"`;
    }
  }

  if (type === 'caption') {
    if (isSwahili) {
      return `✍️ HIGH ENGAGEMENT SOCIAL CAPTION:
Habari Kariakoo & Zanzibar! 🌍✨

We just deployed the ultimate creator operating system built directly for local shop owners. Acha kupoteza muda kwenye spreadsheet wakati webhooks zetu zinaweza kufanya kazi zote!

Hapa kuna faida unazopata leo:
✅ Multi-Model processing (Gemini & Groq failovers)
✅ WhatsApp Lead Inbox CRM + AI suggested quick responses
✅ Easy mobile money payment gateways simulated safely

Tuma neno "TANZANIA" kwenye inbox yetu kupata free onboarding! 🚀👇`;
    } else {
      return `✍️ PRODUCT LAUNCH SOCIAL CAPTION:
Stop wasting hours on manual administrative tasks. 🚀

Our unified workspace brings Canva, Notion, CapCut, Hootsuite and Jasper directly into one high-performance dashboard.

What is unlocked in V1.2 Premium:
⭐ Multi-Model Router (Switch between Gemini, OpenAI, Claude instantly)
⭐ Built-in CapCut vertical video timelines & storyboard generators
⭐ WhatsApp lead integration loops
⭐ Instant affiliate referral tracking dashboard

Click the link in bio to start your trial today! 👇`;
    }
  }

  if (type === 'hashtags') {
    return `#viralcreator #microSaaS #darEsSalaam #Kariakoo #zanzibarTravel #contentOS #Automations #TanzaniaTech #socialCommerce #CreatorBusiness`;
  }

  if (type === 'trends') {
    return `🔥 LOCAL VIRAL TREND REPORT (${activeLanguage.toUpperCase()}):
────────────────────────────────────────
1. "The M-Pesa STK Push Sandbox" -> Break the myth of complicated payment integration processes.
2. "Bilingual Pacing on TikTok" -> Why speaking half-Swahili half-English boosts Dar es Salaam retention times by 40%.
3. "The No-Code Shop Assistant" -> Show automated webhooks linking orders straight to shipping cargo lists.`;
  }

  if (type === 'planning') {
    return `🎬 SCENE TIMELINE PLANNER & CAPCUT DIRECTION:
────────────────────────────────────────
- Scene #1 (0-3s): High zoom image of a cargo dispatch warehouse in Dar.
- Scene #2 (3-7s): Split panel showcasing original tedious sheets vs modern automatic lists.
- Scene #3 (7-12s): Show direct visual confirmation message. Text overlay: "Deploy automatically!"`;
  }

  if (type === 'voiceover') {
    return `🔊 AI TONAL SPEECH SYNTHESIS SPECTRUM PREVIEW:
────────────────────────────────────────
Voice profile loaded: [Standard African Bilingual Male Node]
Pitch setting: Custom Deep
Speed setting: 1.1x

Draft speech copy ready for render:
"Habari! Karibu kwenye mustakabali wa biashara ya kidijitali Tanzanite. Click link yetu kuanza!"`;
  }

  if (type === 'repurpose') {
    return `🔄 MULTIPLEX PLATFORM DEMO:
────────────────────────────────────────
- TikTok Video: 9:16 high visual b-roll direction.
- Twitter/X Thread: 4-part concise punchy statements.
- LinkedIn Post: Structured B2B professional value list.
- Instagram: Visual aesthetic banner with a bio question wrapper.`;
  }

  if (type === 'ecommerce') {
    return `🛒 ECOMMERCE UGC WINNING CONVERSIONS ADS:
────────────────────────────────────────
- Style: PAS (Problem, Agitate, Solve)
- Problem: Dar es Salaam sellers losing track of inventories manually.
- Agitation: Stale stock sits for weeks, eating cashflow resources.
- Solution: Instant Automated Webhook Catalog sync modules in one tap.`;
  }

  if (type === 'affiliate') {
    return `🔗 AFFILIATE HIGHLIGHTS TRACKER TEMPLATE:
────────────────────────────────────────
Pitch theme: Travel zanzibar partner conversions tracker.
Promotional copy format:
"Need a break from Dar heat? 🍹 Zanzibar flight deals just dropped. Book inside 48hrs with code shapeenooo333!"`;
  }

  if (type === 'leadgen') {
    return `✉️ COLD OUTREACH DIRECT MESSAGES TEMPLATES:
────────────────────────────────────────
"Habari! Did you notice your cargo tracking sheets are completely exposed?
We can set up a unified dashboard linking your store straight to M-Pesa automated webhooks."`;
  }

  if (type === 'closer') {
    return `🤝 HIGH-TICKET SALES CLOSING ARGUMENTS RULES:
────────────────────────────────────────
Objection: "It is too expensive."
AI response suggestion: "Compare 19,000 TZS per month with paying a manual typist 300,000 TZS monthly. You save 90% other costs immediately."`;
  }

  if (type === 'growthkit') {
    return `📈 SOCIAL PROFILE GROWTH BOOSTER CAPTION:
────────────────────────────────────────
Optimized Bio draft:
"Helping East African retailers save 15+ hours weekly with automated custom workflow nodes. Dar es Salaam. 🌍✨"`;
  }

  if (type === 'calendar') {
    return `📅 GENERAL PROJECT OUTLINE DRAFT:
────────────────────────────────────────
Title: Tanzania Cargo Launchcampaign
Scheduled Date: Week #1
Platform: Dual Swahili TikTok Script
Status: Scheduled (Failover Ready)`;
  }

  return `🎉 SECURE SANDBOX DRAFT COMPLETE:
────────────────────────────────────────
Topic parameters: ${safeTopic}
Tone style: ${activeTone}
Language preference: ${activeLanguage}

This content slot was compiled successfully. Click 'Copy' to use instantly.`;
}
