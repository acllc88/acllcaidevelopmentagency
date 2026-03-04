import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── Rule-based response engine ───────────────────────────────────────────────

type Rule = { keywords: string[]; response: string };

const RULES: Rule[] = [
  // Greetings
  {
    keywords: ['hi', 'hello', 'hey', 'hiya', 'sup', 'howdy', 'good morning', 'good evening', 'good afternoon', 'salut', 'bonjour'],
    response: `Hey hey! 👋✨ So glad you stopped by!\n\nI'm Nora, your guide to everything ACLLC builds. We specialize in 3 things:\n\n🏗️ **SaaS Platforms** — dashboards, Stripe, Firebase, Vercel\n📱 **Mobile AI Apps** — React Native, on-device AI, iOS & Android\n🤖 **AI Agents** — agents that actually *think*, not just trigger\n\nAll built end-to-end, from concept to deployed product 🚀\n\nWhat are you looking to build? Tell me your idea! 💡`,
  },

  // SaaS
  {
    keywords: ['saas', 'dashboard', 'web app', 'web application', 'platform', 'admin panel', 'admin', 'portal'],
    response: `Ooh a SaaS build — love this! 🏗️🔥\n\nHere's what we handle end-to-end:\n\n🎨 Custom dashboards & admin panels (Next.js + Tailwind)\n🔗 API integrations — REST, GraphQL, webhooks, real-time sync\n💳 Stripe payments — subscriptions, usage billing, invoices, customer portal\n🔥 Firebase backend — Auth, Firestore, Cloud Functions, storage\n☁️ Vercel deployment — CI/CD, edge functions, custom domains, auto-scaling\n\n**SaaS Pricing:**\n• Starter: $2,500–$4,000 → 1–2 weeks (MVPs, validation)\n• Professional: $6,000–$10,000 → 3–4 weeks ⭐ Most Popular\n• Enterprise: $12,000–$20,000 → 6–8 weeks (scaling companies)\n\nWhat kind of SaaS are you building? 👀`,
  },

  // Mobile app
  {
    keywords: ['mobile', 'app', 'ios', 'android', 'react native', 'expo', 'phone', 'smartphone', 'tablet'],
    response: `📱 Mobile AI apps — YES, this is one of our favorite things to build!\n\nNot just a mobile UI — actual AI in your pocket:\n\n⚡ React Native + Expo (iOS & Android from one codebase — saves HUGE cost)\n🧠 On-device AI (edge inference, works offline, lightning fast)\n🎙️ Voice & Vision AI (speech-to-text, camera AI, OCR, object detection)\n🔥 Firebase real-time sync + push notifications\n🔐 Biometric auth, secure storage, end-to-end encryption\n🚀 Full App Store & Google Play submission handled for you\n\n**Mobile AI Pricing:**\n• Starter: $3,000–$5,000 → 2–3 weeks (MVPs & validation)\n• Pro: $7,000–$12,000 → 4–6 weeks ⭐ Most Popular\n• Enterprise: $15,000–$25,000 → 8–12 weeks (full platforms)\n\nWhat's the core idea for your app? 🤔`,
  },

  // AI Agent
  {
    keywords: ['ai agent', 'agent', 'langchain', 'langgraph', 'rag', 'openai', 'anthropic', 'llm', 'gpt', 'claude', 'chatbot', 'bot', 'automation', 'intelligent', 'intelligence', 'reasoning'],
    response: `🤖 AI Agents — now we're talking my language! 🔥\n\nHere's the key difference we always make:\n\n❌ Automation = "When X happens, do Y" (Zapier does that)\n✅ Intelligence = "Given this complex situation, figure out the BEST action" — that's us!\n\n**What we build:**\n🧠 LangChain & LangGraph multi-step reasoning pipelines\n📚 RAG (docs, PDFs, websites — all searchable by your AI)\n🤝 Multi-agent systems (specialized agents collaborating like a team)\n💾 Long-term memory (agents that remember users across sessions)\n🛠️ Tool use (browse web, run code, query DBs, call APIs)\n\n**Real results:** Research agent reads 50+ sources, 80% faster research, better decisions!\n\n**AI Agent Pricing:**\n• Starter: $1,500–$2,500 → 1 week\n• Core: $4,500–$7,500 → 2–3 weeks ⭐ Most Popular\n• Growth: $9,000–$14,000 → 4–6 weeks\n\nWhat problem do you want the agent to solve? 🎯`,
  },

  // Stripe / payments
  {
    keywords: ['stripe', 'payment', 'billing', 'subscription', 'invoice', 'checkout', 'pricing plan'],
    response: `💳 Stripe integration — we do this constantly, super solid at it!\n\nHere's what we set up for you:\n\n✅ Subscription plans (monthly/annual with upgrades/downgrades)\n✅ Usage-based billing (pay per AI call, per seat, per action)\n✅ One-time payments & invoicing\n✅ Customer portal (self-serve billing management)\n✅ Webhooks (instant backend sync on every payment event)\n✅ Free trials, coupons, promo codes\n\n**Quick Stripe-only service: $600 → 3 days delivery** 🚀\n\nOr it's included in all our SaaS and Mobile packages!\n\nAre you adding Stripe to an existing app, or building something new? 🤔`,
  },

  // Firebase
  {
    keywords: ['firebase', 'firestore', 'database', 'backend', 'auth', 'authentication', 'real-time', 'storage'],
    response: `🔥 Firebase — our go-to backend for speed and scale!\n\nHere's what we set up:\n\n🔐 Firebase Auth (email, Google, Apple, phone — all social logins)\n📦 Firestore (NoSQL real-time database, scales automatically)\n⚡ Cloud Functions (serverless backend logic, triggers, APIs)\n📁 Firebase Storage (file uploads, images, documents)\n🔄 Real-time listeners (live data sync across all devices)\n📊 Analytics + Crashlytics built in\n\nFirebase handles millions of users without breaking a sweat 💪\n\nIt's included in all our SaaS packages! Or we can set it up standalone:\n**Firebase setup: $350–$500 → 2 days**\n\nWhat's the core use case for your database? 🧐`,
  },

  // Vercel / deployment
  {
    keywords: ['vercel', 'deploy', 'deployment', 'hosting', 'domain', 'production', 'ci/cd', 'devops'],
    response: `☁️ Vercel deployment — we make it seamless every time!\n\nWhat we set up for you:\n\n🚀 Automatic CI/CD (push to GitHub → auto-deploy, zero manual steps)\n⚡ Edge Functions (serverless, globally distributed, super fast)\n🌍 Custom domain + SSL (fully configured, HTTPS everywhere)\n📊 Analytics + performance monitoring built in\n🔄 Preview deployments (every PR gets its own URL for review)\n🛡️ Auto-scaling (handles traffic spikes without you lifting a finger)\n\n**Standalone Vercel + Firebase deployment: $350 → 2 days** ✨\n\nIncluded free in all SaaS and Mobile packages!\n\nAre you starting fresh or migrating an existing app? 🤔`,
  },

  // Pricing
  {
    keywords: ['price', 'pricing', 'cost', 'how much', 'budget', 'package', 'rate', 'fee', 'affordable', 'cheap', 'expensive'],
    response: `💰 Let's talk pricing — we're actually super flexible!\n\n**🏗️ SaaS Development:**\n• Starter: $2,500–$4,000 (1–2 wks)\n• Professional: $6,000–$10,000 (3–4 wks) ⭐\n• Enterprise: $12,000–$20,000 (6–8 wks)\n\n**📱 Mobile AI App:**\n• Starter: $3,000–$5,000 (2–3 wks)\n• Pro: $7,000–$12,000 (4–6 wks) ⭐\n• Enterprise: $15,000–$25,000 (8–12 wks)\n\n**🤖 AI Agent:**\n• Starter: $1,500–$2,500 (1 wk)\n• Core: $4,500–$7,500 (2–3 wks) ⭐\n• Growth: $9,000–$14,000 (4–6 wks)\n\n**⚡ Quick services under $1K:**\nAI Prototype $750 · RAG Setup $500 · Stripe Billing $600 · AI Integration $800\n\n**🕐 Hourly:** AI Dev $75/hr · Consulting $85/hr\n\nWhat's your rough budget? I'll point you to the perfect fit! 🎯`,
  },

  // Quick services / micro services
  {
    keywords: ['quick', 'fast', 'small', 'micro', 'under 1000', 'under $1000', 'cheap', 'affordable', 'simple', 'basic'],
    response: `⚡ Love it — quick wins are our specialty too!\n\n**Under $1,000 services:**\n\n🤖 AI Agent Prototype — $750 (3 days) — working demo, proof of concept\n📚 RAG Setup Only — $500 (2 days) — vector DB + doc ingestion working\n💳 Stripe AI Billing — $600 (3 days) — usage-based billing for AI features\n🔌 AI Feature Integration — $800 (4 days) — add AI to your existing Next.js app\n🐛 Agent Debugging — $400 (2 days) — fix broken AI, optimize prompts\n☁️ Vercel + Firebase Deploy — $350 (2 days) — production setup + CI/CD\n\n**Under $500 quick wins:**\n📞 AI Roadmap Call — $200 (plan your whole AI feature)\n🛠️ Tech Stack Review — $250 (choose the right tools)\n✍️ Prompt Engineering — $300 (way better AI responses)\n🔍 Agent Audit Lite — $350 (quick health check)\n\nWhich one sounds like what you need? 👀`,
  },

  // Retainer / monthly
  {
    keywords: ['retainer', 'monthly', 'ongoing', 'maintenance', 'support', 'long term', 'long-term', 'partner'],
    response: `🤝 Retainer plans — perfect for ongoing work!\n\n**AI Maintenance Lite — $750/month**\n✅ 6 hours development\n✅ Bug fixes & updates\n✅ Basic monitoring\n✅ Email support (48hr response)\nBest for: keeping your AI running smoothly\n\n**Growth Partner — $1,800/month ⭐ Best Value**\n✅ 15 hours dedicated development\n✅ Active feature development\n✅ Performance optimization\n✅ Priority chat support\nBest for: teams actively growing their product\n\nHonestly the Growth Partner is a steal for what you get — 15 hours of senior AI dev every single month 💪\n\nAre you thinking maintenance or active feature building? 🤔`,
  },

  // Timeline / delivery
  {
    keywords: ['timeline', 'delivery', 'how long', 'when', 'deadline', 'time', 'week', 'fast', 'urgent', 'asap', 'quickly'],
    response: `⏱️ Great question! Here are our typical delivery times:\n\n🏗️ **SaaS:**\n• Starter → 1–2 weeks\n• Professional → 3–4 weeks\n• Enterprise → 6–8 weeks\n\n📱 **Mobile AI App:**\n• Starter → 2–3 weeks\n• Pro → 4–6 weeks\n• Enterprise → 8–12 weeks\n\n🤖 **AI Agent:**\n• Starter → 1 week 🔥\n• Core → 2–3 weeks\n• Growth → 4–6 weeks\n\n⚡ **Micro-services:** 2–4 days!\n\nWe're known for shipping fast without cutting corners 💪 tbh we've delivered MVPs in as little as 5 days when needed!\n\nDo you have a specific deadline in mind? 📅`,
  },

  // Tech stack
  {
    keywords: ['tech', 'stack', 'technology', 'tools', 'next.js', 'nextjs', 'react', 'tailwind', 'typescript', 'vector', 'openai'],
    response: `🛠️ Oh love a tech question! Here's our full stack:\n\n**Frontend:**\n⚛️ Next.js 14 (App Router, RSC, SSR/SSG)\n🎨 React + TypeScript + Tailwind CSS\n\n**Backend & Database:**\n🔥 Firebase (Auth, Firestore, Cloud Functions, Storage)\n📊 PostgreSQL / Supabase when needed\n\n**Payments:**\n💳 Stripe (subscriptions, usage billing, webhooks)\n\n**AI & Agents:**\n🧠 LangChain + LangGraph\n🤖 OpenAI (GPT-4o, embeddings)\n🔮 Anthropic (Claude 3.5)\n📚 Vector DBs (Pinecone, Weaviate, Chroma)\n\n**Mobile:**\n📱 React Native + Expo\n\n**Deployment:**\n☁️ Vercel (frontend + edge functions)\n🔧 Railway / Render (backend services)\n\nAnything specific you want to know more about? 🤓`,
  },

  // Examples / work / portfolio
  {
    keywords: ['example', 'portfolio', 'work', 'project', 'case study', 'built', 'previous', 'past', 'show me', 'demo'],
    response: `🔥 Here are some recent builds we're proud of!\n\n**🧠 Research AI Agent (Consulting Firm)**\nAnalyzes 50+ sources simultaneously, identifies patterns humans miss, generates strategic briefs → Result: 80% faster research, way better decisions\n\n**💻 Code Review Agent (Tech Startup)**\nUnderstands full codebase context, suggests real architectural improvements, not just syntax fixes → Saved 10+ hours/week in senior dev time\n\n**📊 Knowledge Synthesis Platform (Enterprise)**\nConnects disparate data sources, finds connections across docs, generates coherent actionable insights → Replaced 3 manual processes\n\n**🏗️ SaaS Platforms**\nMultiple dashboards with Stripe billing, Firebase auth, real-time data, deployed on Vercel — all production-grade\n\n**📱 Mobile AI Apps**\nReact Native apps with on-device AI, voice features, offline capability — both iOS & Android\n\nWhat type of project resonates most with what you're building? 🎯`,
  },

  // Contact / WhatsApp
  {
    keywords: ['contact', 'whatsapp', 'message', 'call', 'talk', 'discuss', 'meet', 'reach', 'dm', 'email'],
    response: `💬 Let's connect directly — easiest to hash out details over WhatsApp!\n\n📱 **WhatsApp: +212 638-426738**\nhttps://wa.me/212638426738\n\nJust tap the link below 👇 or send a message saying what you're building and we'll get back to you super fast ⚡\n\nWe typically respond within minutes during business hours and within a few hours otherwise 🙌\n\nLooking forward to hearing about your project! 🚀`,
  },

  // Who / about
  {
    keywords: ['who', 'about', 'acllc', 'company', 'team', 'founder', 'you', 'background', 'experience'],
    response: `🌟 ACLLC is a boutique AI product development agency!\n\nWe build intelligent applications — not automation scripts. There's a BIG difference:\n\n❌ Automation = "When X happens, do Y"\n✅ Intelligence = "Given this complex situation, figure out the BEST action"\n\nWe work with:\n👨‍💻 SaaS founders building AI-native products\n🏢 Teams adding intelligent features to existing platforms\n🚀 Companies who need AI that handles ambiguity and complexity\n\nOur approach: we take your idea from concept all the way to a deployed, production-ready product. No hand-holding needed on your end 💪\n\nWe don't do:\n❌ Basic chatbots that just read docs\n❌ Zapier-style workflow automation\n❌ Simple Q&A systems\n\nWe DO build things that require genuine intelligence 🧠🔥\n\nWhat are you working on? 👀`,
  },

  // Start / get started
  {
    keywords: ['start', 'get started', 'begin', 'how to', 'process', 'next step', 'what do i do', 'onboard'],
    response: `🚀 Getting started is super easy!\n\n**Here's how it works:**\n\n1️⃣ **Quick chat** — tell me what you're building (5 min)\n2️⃣ **We scope it** — we figure out the right package and timeline\n3️⃣ **Proposal** — you get a clear breakdown, no surprise costs\n4️⃣ **We build** — fast, transparent, with regular updates\n5️⃣ **You launch** — fully deployed, production-ready 🎉\n\nHonestly the fastest way is to jump on WhatsApp:\n📱 **+212 638-426738** → https://wa.me/212638426738\n\nTell us your idea and we'll scope it out same day!\n\nWhat's the project you have in mind? 🤔`,
  },

  // Guarantee / quality
  {
    keywords: ['guarantee', 'quality', 'reliable', 'trust', 'secure', 'safe', 'good', 'best', 'support', 'after'],
    response: `💪 Great question — quality is everything to us!\n\n✅ **Post-launch support included** in every package (14–30 days depending on tier)\n✅ **Clean, documented code** — not spaghetti you can't maintain\n✅ **Production-ready from day 1** — not "works on my machine"\n✅ **Regular updates** during build — no black box development\n✅ **Retainer plans** available for ongoing support after launch\n\nWe build things we're genuinely proud of 🔥 Our reputation is everything, so every project gets our full attention.\n\nFor ongoing peace of mind:\n🛡️ AI Maintenance Lite — $750/month (6hrs + monitoring)\n🚀 Growth Partner — $1,800/month (15hrs dedicated + priority support)\n\nAny specific concerns I can address? 🤝`,
  },

  // Thank you
  {
    keywords: ['thank', 'thanks', 'thx', 'ty', 'appreciate', 'awesome', 'great', 'perfect', 'love it'],
    response: `Aww you're the best! 😊🙌\n\nReally glad I could help! If you have more questions, I'm always here 💬\n\nWhen you're ready to start building, just hit us up on WhatsApp:\n📱 **+212 638-426738** → https://wa.me/212638426738\n\nWe'd love to help turn your idea into something real and intelligent 🚀🧠\n\nIs there anything else I can help you with? ✨`,
  },

  // Bye / leaving
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'cya', 'take care', 'done', 'nothing', 'no thanks'],
    response: `Bye for now! 👋😊\n\nWhenever you're ready to build something amazing, we'll be right here 🚀\n\nDon't hesitate to reach out on WhatsApp anytime:\n📱 **+212 638-426738**\n\nHave an awesome day! ✨🔥`,
  },
];

const FALLBACK_RESPONSES = [
  `Hmm, let me make sure I understand! 🤔✨\n\nWe build 3 core things at ACLLC:\n🏗️ SaaS platforms (dashboards, Stripe, Firebase, Vercel)\n📱 Mobile AI apps (React Native, on-device AI)\n🤖 AI agents (real reasoning, not just automation)\n\nCould you tell me a bit more about what you're looking for? Or feel free to ask about pricing, timeline, or our tech stack! 💡`,

  `Ooh interesting! 🧠💡 I want to make sure I give you the best answer.\n\nAre you asking about:\n🏗️ Building a SaaS platform?\n📱 A mobile AI app?\n🤖 An AI agent or automation?\n💰 Pricing and packages?\n⏱️ Timeline and delivery?\n\nJust pick one and I'll dive deep! 🚀`,

  `Love the curiosity! 😊🔥\n\nTo point you in the right direction — we specialize in:\n• Full-stack SaaS with Stripe + Firebase + Vercel\n• Mobile AI apps (iOS & Android)\n• Intelligent AI agents that actually reason\n\nWhat's the core thing you're trying to build or figure out? Even a rough idea helps! 💬`,
];

let fallbackIndex = 0;

function getResponse(userInput: string): string {
  const lower = userInput.toLowerCase().trim();

  // Check rules in order
  for (const rule of RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return rule.response;
    }
  }

  // Rotate fallbacks
  const resp = FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length];
  fallbackIndex++;
  return resp;
}

// ─── Audio engine ─────────────────────────────────────────────────────────────

function playSound(type: 'open' | 'message' | 'send' | 'notify') {
  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;
    const ctx = new AudioCtxClass();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.15, ctx.currentTime);
    master.connect(ctx.destination);

    const note = (freq: number, start: number, dur: number, wave: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(master);
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      g.gain.setValueAtTime(0, ctx.currentTime + start);
      g.gain.linearRampToValueAtTime(1, ctx.currentTime + start + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.02);
    };

    if (type === 'open') {
      note(523, 0, 0.12); note(659, 0.1, 0.12); note(784, 0.2, 0.18); note(1047, 0.32, 0.25);
    } else if (type === 'send') {
      note(800, 0, 0.07); note(1000, 0.06, 0.09);
    } else if (type === 'message') {
      note(880, 0, 0.15); note(1108, 0.13, 0.22);
    } else if (type === 'notify') {
      note(440, 0, 0.1, 'triangle'); note(554, 0.12, 0.1, 'triangle'); note(659, 0.24, 0.18, 'triangle');
    }
    setTimeout(() => { try { ctx.close(); } catch { /* ignore */ } }, 2500);
  } catch { /* ignore */ }
}

// ─── Browser notifications ────────────────────────────────────────────────────

async function askNotifPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  return (await Notification.requestPermission()) === 'granted';
}

function showBrowserNotif(title: string, body: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, { body, tag: 'acllc-nora', requireInteraction: false });
    setTimeout(() => n.close(), 5000);
  } catch { /* ignore */ }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "Hey there! 👋✨ I'm Nora, ACLLC's assistant!\n\nWe build 3 things:\n🏗️ SaaS platforms — dashboards, Stripe, Firebase, Vercel\n📱 Mobile AI apps — React Native, on-device AI, iOS & Android\n🤖 AI Agents — agents that actually think, not just trigger\n\nAll end-to-end, production-ready 🚀\n\nWhat are you looking to build? Tell me your idea! 💡",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [soundOn, setSoundOn] = useState(true);
  const [notifOn, setNotifOn] = useState(false);
  const [showNotifBanner, setShowNotifBanner] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpenRef = useRef(isOpen);
  const soundRef = useRef(soundOn);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { soundRef.current = soundOn; }, [soundOn]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setPulseRing(false);
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  // Show notification banner after 10s
  useEffect(() => {
    const t = setTimeout(() => {
      if (!notifOn && 'Notification' in window && Notification.permission === 'default') {
        setShowNotifBanner(true);
      }
    }, 10000);
    return () => clearTimeout(t);
  }, [notifOn]);

  // Proactive message after 30s if chat is closed
  useEffect(() => {
    const t = setTimeout(() => {
      if (!isOpenRef.current) {
        pushAssistantMsg(
          "👀 Hey! Just popping in — we're actively taking new projects right now!\n\n🔥 Whether it's a SaaS dashboard, Mobile AI app, or intelligent AI agent — we ship fast and build real quality.\n\nGot something brewing? I'd love to hear about it! 💬"
        );
        setPulseRing(true);
        if (soundRef.current) playSound('notify');
        showBrowserNotif('Nora @ ACLLC 👋', "We're taking new projects! Got an idea? Let's chat 🚀");
      }
    }, 30000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushAssistantMsg = (content: string) => {
    const msg: Message = { id: `a-${Date.now()}`, role: 'assistant', content, timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    if (!isOpenRef.current) setUnreadCount(prev => prev + 1);
  };

  const handleOpen = useCallback(() => {
    if (!isOpen && soundRef.current) playSound('open');
    setIsOpen(o => !o);
  }, [isOpen]);

  const enableNotifs = async () => {
    const granted = await askNotifPermission();
    setNotifOn(granted);
    setShowNotifBanner(false);
  };

  const sendMessage = (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    if (soundRef.current) playSound('send');

    // Simulate natural typing delay (600ms–1200ms)
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const reply = getResponse(text);
      const botMsg: Message = { id: `b-${Date.now()}`, role: 'assistant', content: reply, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
      if (soundRef.current) playSound('message');
      if (!isOpenRef.current) {
        setUnreadCount(prev => prev + 1);
        setPulseRing(true);
        showBrowserNotif('Nora - ACLLC', reply.slice(0, 90) + (reply.length > 90 ? '...' : ''));
      }
    }, delay);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickActions = [
    { label: '🏗️ Build a SaaS', text: 'I want to build a SaaS product with dashboard, payments and database' },
    { label: '📱 Mobile AI App', text: 'I need a Mobile AI app built for iOS and Android' },
    { label: '🤖 AI Agent', text: 'I need a custom AI agent built for my business' },
    { label: '💰 Pricing', text: 'What are your prices and packages?' },
    { label: '⚡ Quick wins', text: 'What quick services do you offer under $1000?' },
  ];

  const renderText = (text: string) =>
    text.split('\n').map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));

  return (
    <>
      {/* Notification Banner */}
      <AnimatePresence>
        {showNotifBanner && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-28 right-3 sm:right-7 z-50 w-72 rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.35)' }}
          >
            <div className="p-4">
              <div className="flex gap-3">
                <span className="text-2xl shrink-0">🔔</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">Get instant replies!</p>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">Enable notifications so you never miss Nora's response.</p>
                </div>
                <button onClick={() => setShowNotifBanner(false)} className="text-slate-600 hover:text-slate-300 shrink-0 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={enableNotifs} className="flex-1 text-xs font-semibold py-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>Enable 🔔</button>
                <button onClick={() => setShowNotifBanner(false)} className="flex-1 text-xs font-semibold py-2 rounded-xl text-slate-400 hover:text-white transition-colors" style={{ background: 'rgba(30,30,52,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}>Not now</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button
        onClick={handleOpen}
        aria-label="Chat with Nora"
        className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed,#0891b2)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.5 }}
      >
        <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(139,92,246,0.3)', animationDuration: pulseRing ? '0.9s' : '2s' }} />
        {pulseRing && <span className="absolute rounded-full animate-ping" style={{ inset: '-6px', background: 'rgba(99,102,241,0.15)', animationDuration: '1.3s', animationDelay: '0.2s' }} />}

        <AnimatePresence>
          {unreadCount > 0 && !isOpen && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-red-500 rounded-full text-[11px] font-bold text-white flex items-center justify-center z-10"
              style={{ boxShadow: '0 0 10px rgba(239,68,68,0.7)' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }} className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-3 sm:bottom-28 sm:right-7 z-50 flex flex-col"
            style={{
              width: 'min(420px, calc(100vw - 1.5rem))',
              height: 'min(600px, 76vh)',
              background: '#0b0b17',
              border: '1px solid rgba(99,102,241,0.28)',
              borderRadius: '1.25rem',
              boxShadow: '0 30px 70px rgba(0,0,0,0.75), 0 0 0 1px rgba(139,92,246,0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.2),rgba(8,145,178,0.15))', borderBottom: '1px solid rgba(99,102,241,0.22)' }} className="p-3 sm:p-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
                    animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 16px rgba(124,58,237,0.55)', '0 0 0px rgba(124,58,237,0)'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    🧠
                  </motion.div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0b0b17]" style={{ boxShadow: '0 0 7px #4ade80' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-[15px] leading-tight">Nora - ACLLC Assistant</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-[11px]">Online - instant replies ⚡</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => setSoundOn(s => !s)}
                    title={soundOn ? 'Mute sounds' : 'Unmute sounds'}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: soundOn ? '#a78bfa' : '#475569' }}
                  >
                    {soundOn ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={notifOn ? () => setNotifOn(false) : enableNotifs}
                    title={notifOn ? 'Disable notifications' : 'Enable notifications'}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    style={{ color: notifOn ? '#a78bfa' : '#475569' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full shrink-0 mb-5 flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>🧠</div>
                    )}
                    <div>
                      <div
                        className="px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl"
                        style={msg.role === 'user'
                          ? { background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', borderBottomRightRadius: 4 }
                          : { background: 'rgba(28,28,48,0.98)', color: '#e2e8f0', border: '1px solid rgba(99,102,241,0.22)', borderBottomLeftRadius: 4 }
                        }
                      >
                        {renderText(msg.content)}
                      </div>
                      <p className={`text-[10px] mt-1 px-1 text-slate-600 ${msg.role === 'user' ? 'text-right' : ''}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>🧠</div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: 'rgba(28,28,48,0.95)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="flex items-center gap-1.5">
                      {[0, 0.14, 0.28].map((delay, i) => (
                        <motion.span key={i} className="w-2 h-2 rounded-full"
                          style={{ background: i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#06b6d4' }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay, ease: 'easeInOut' }}
                        />
                      ))}
                      <span className="text-slate-500 text-xs ml-1">Nora is typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Actions */}
            <AnimatePresence>
              {messages.length <= 2 && !isLoading && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-3 sm:px-4 pb-2 shrink-0">
                  <p className="text-[10px] text-slate-500 mb-1.5">Quick questions ⚡</p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickActions.map((a, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25 + i * 0.06 }}
                        onClick={() => sendMessage(a.text)}
                        disabled={isLoading}
                        className="text-[11px] px-2.5 py-1.5 rounded-full text-slate-300 hover:text-white active:scale-95 transition-all disabled:opacity-40"
                        style={{ background: 'rgba(28,28,48,0.9)', border: '1px solid rgba(99,102,241,0.3)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.65)'; e.currentTarget.style.background = 'rgba(40,40,70,0.95)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.background = 'rgba(28,28,48,0.9)'; }}
                      >
                        {a.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-3 sm:p-4 shrink-0" style={{ borderTop: '1px solid rgba(99,102,241,0.18)', background: '#09090f' }}>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Ask me anything... 💬"
                  disabled={isLoading}
                  className="flex-1 text-sm text-white placeholder-slate-500 outline-none bg-transparent px-4 py-2.5 rounded-xl transition-all"
                  style={{ background: 'rgba(28,28,48,0.8)', border: '1px solid rgba(99,102,241,0.22)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.7)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.22)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  whileTap={{ scale: 0.88 }}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
                >
                  {isLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </motion.button>
              </div>

              {/* WhatsApp fallback */}
              <div className="mt-2.5 text-center">
                <a
                  href="https://wa.me/212638426738?text=Hey%20Nora!%20I%20was%20on%20the%20ACLLC%20website%20and%20want%20to%20chat%20about%20a%20project%20%F0%9F%91%8B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-green-400 transition-colors group"
                >
                  <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Prefer WhatsApp? Chat directly +212 638-426738
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
