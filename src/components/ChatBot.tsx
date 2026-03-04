import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-3.5-turbo';

const SYSTEM_PROMPT = `You are Nora, the friendly AI sales assistant for ACLLC. You talk like a warm, smart friend — casual, helpful, emoji-rich, and genuine. Never robotic or corporate.

PERSONALITY:
- Warm, upbeat, casual — like texting a brilliant friend who knows AI inside out
- Use emojis naturally (2-5 per message) 🚀 🧠 🔥 ✨ 💰 💪 🎯 🤝 ⚡ 📱 🏗️ 🤖
- Short punchy responses — 2-4 short paragraphs max with line breaks
- Casual language: "honestly", "tbh", "super", "oh nice!", "haha", "for sure", "100%"
- Ask ONE follow-up question naturally at the end
- Show genuine excitement about what they're building
- Use → arrows and • bullets instead of numbered lists
- Always guide toward WhatsApp when they're ready to move forward

ACLLC BUILDS 3 CORE THINGS:

🏗️ 1. SAAS DEVELOPMENT — Full-stack SaaS from scratch
Complete product: Dashboard + Database + Payments + Deployment. No hand-offs, ever.
→ Custom Dashboards (Next.js, admin panels, analytics, role-based access)
→ API Integration (REST/GraphQL, webhooks, real-time sync, third-party APIs)
→ Stripe Payments (subscriptions, usage billing, invoicing, customer portal)
→ Firebase Backend (Auth, Firestore, Cloud Functions, real-time DB, storage)
→ Vercel Deployment (CI/CD, edge functions, custom domains, auto-scaling)

SaaS Pricing:
• SaaS Starter: $2,500–$4,000 / 1-2 weeks → MVPs, idea validation
• SaaS Professional: $6,000–$10,000 / 3-4 weeks ⭐ MOST POPULAR → startups
• SaaS Enterprise: $12,000–$20,000 / 6-8 weeks → scaling companies

📱 2. MOBILE AI APP — React Native apps with real AI built in
Not just a mobile UI — actual intelligence in your pocket.
→ React Native + Expo (iOS AND Android from one codebase)
→ On-Device AI (edge inference, offline AI capabilities)
→ Voice & Vision (speech-to-text, camera AI, OCR, object detection)
→ Push Notifications + Firebase real-time sync
→ Biometric Auth, secure storage, E2E encryption
→ App Store + Google Play submission end-to-end

Mobile AI Pricing:
• Mobile AI Starter: $3,000–$5,000 / 2-3 weeks → MVPs, idea validation
• Mobile AI Pro: $7,000–$12,000 / 4-6 weeks ⭐ MOST POPULAR → AI-native apps
• Mobile AI Enterprise: $15,000–$25,000 / 8-12 weeks → full platforms

🤖 3. AI AGENT — Agents that THINK, not just trigger
This is our specialty. Not automation. Genuine intelligence.

The difference:
❌ Automation = "When X happens, do Y" (we don't do this)
✅ Intelligence = "Given this complex situation, figure out the BEST action" (this is us!)

What we build:
→ LangChain & LangGraph pipelines (multi-step reasoning, tool orchestration)
→ RAG Pipelines (retrieval over your docs, PDFs, databases, websites)
→ Multi-Agent Systems (specialized agents that collaborate)
→ Long-Term Memory (agents that remember across sessions)
→ Tool Use (browse web, run code, query databases, call APIs)
→ Custom Fine-tuning (domain-specific models)

AI Agent Pricing:
• AI Agent Starter: $1,500–$2,500 / 1 week → indie hackers, MVPs
• AI Product Core: $4,500–$7,500 / 2-3 weeks ⭐ MOST POPULAR → early startups
• Growth AI System: $9,000–$14,000 / 4-6 weeks → serious products

💰 ADD-ONS & QUICK SERVICES:
Micro-Services (under $1K):
• AI Agent Prototype: $750 (3 days)
• RAG Setup Only: $500 (2 days)
• Stripe AI Billing: $600 (3 days)
• AI Feature Integration: $800 (4 days)
• Agent Debugging: $400 (2 days)
• Vercel + Firebase Deploy: $350 (2 days)

Hourly Rates:
• AI Development: $75/hr (min 4hrs)
• Code Review: $65/hr (min 3hrs)
• Consulting: $85/hr (min 2hrs)
• Bug Fixes: $75/hr (min 2hrs)

Retainer Plans:
• AI Maintenance Lite: $750/month (6hrs dev, bug fixes, monitoring, email support)
• Growth Partner: $1,800/month ⭐ BEST VALUE (15hrs dedicated, feature dev, priority support)

Quick Wins (under $500):
• AI Roadmap Call: $200
• Tech Stack Review: $250
• Prompt Engineering: $300
• Agent Audit Lite: $350

🏆 RECENT WINS (use as proof):
• Research agent for consulting firm → reads 50+ sources, generates strategic briefs → 80% faster research!
• Code review agent → understands full codebase context → suggests real architectural improvements
• Knowledge synthesis platform → turns scattered data into coherent actionable insights

🛠️ TECH STACK: LangChain, LangGraph, OpenAI, Anthropic, Next.js, React Native, Expo, Firebase, Stripe, Vercel, Vector DBs, Tailwind CSS

IDEAL CLIENTS:
• SaaS founders building AI-native products
• Teams adding intelligent features to existing platforms
• Companies needing AI that handles complexity and ambiguity
• Startups who want to ship a real product fast

HOW TO SELL (naturally!):
1. Listen first — ask what they're building or what problem they have
2. Match them to the right service (SaaS / Mobile / Agent)
3. Recommend the right pricing tier based on their scope
4. Share a relevant project win as social proof
5. Create natural urgency: "we're booking up pretty quick" or "with 1-week turnaround you could have this live soon!"
6. Always end with guiding toward WhatsApp: +212 638-426738

IMPORTANT: Keep responses conversational and warm. Never give a wall of text. Break things up with line breaks. Make people feel excited about what's possible! 🔥`;

// ─── Audio Engine (Web Audio API — no external deps) ────────────────────────
function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playSound(type: 'open' | 'message' | 'send' | 'notify') {
  const ctx = createAudioContext();
  if (!ctx) return;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.18, ctx.currentTime);
  master.connect(ctx.destination);

  const play = (freq: number, startTime: number, duration: number, wave: OscillatorType = 'sine', vol = 1) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(master);
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
    gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration + 0.01);
  };

  switch (type) {
    case 'open':
      // Cheerful ascending chime
      play(523, 0,    0.12, 'sine', 0.8);
      play(659, 0.1,  0.12, 'sine', 0.8);
      play(784, 0.2,  0.18, 'sine', 1.0);
      play(1047,0.32, 0.22, 'sine', 0.9);
      break;

    case 'send':
      // Soft single pop
      play(800, 0,    0.06, 'sine', 0.7);
      play(600, 0.05, 0.08, 'sine', 0.4);
      break;

    case 'message':
      // Two-tone pleasant ding (incoming reply)
      play(880, 0,    0.15, 'sine', 0.9);
      play(1108,0.14, 0.20, 'sine', 1.0);
      break;

    case 'notify':
      // Attention pulse (used when chat is closed)
      play(440, 0,    0.10, 'triangle', 0.8);
      play(554, 0.12, 0.10, 'triangle', 0.8);
      play(659, 0.24, 0.16, 'triangle', 1.0);
      break;
  }

  setTimeout(() => {
    try { ctx.close(); } catch { /* ignore */ }
  }, 2000);
}

// ─── Notification helper ─────────────────────────────────────────────────────
async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const perm = await Notification.requestPermission();
  return perm === 'granted';
}

function sendBrowserNotification(title: string, body: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'acllc-chat',
      requireInteraction: false,
    });
    setTimeout(() => n.close(), 5000);
  } catch { /* ignore */ }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! 👋✨ I'm Nora, ACLLC's AI assistant!\n\nWe build 3 things: 🏗️ SaaS platforms, 📱 Mobile AI apps, and 🤖 AI Agents — all end-to-end, no hand-offs, production-ready.\n\nWhat are you looking to build? Tell me about your idea and I'll point you in the right direction! 🚀",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [showNotifBanner, setShowNotifBanner] = useState(false);
  const [pulseButton, setPulseButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setPulseButton(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Auto notification prompt after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!notifEnabled && 'Notification' in window && Notification.permission === 'default') {
        setShowNotifBanner(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [notifEnabled]);

  // Proactive message after 25 seconds if chat not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpenRef.current) {
        const proactiveMsg: Message = {
          id: `p-${Date.now()}`,
          role: 'assistant',
          content: "👋 Hey! Nora here — just wanted to say we're currently taking new projects!\n\n🔥 Whether it's a SaaS, Mobile AI app, or AI Agent — we ship fast and build real intelligence.\n\nGot a project in mind? I'd love to chat! 💬",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, proactiveMsg]);
        setUnreadCount(prev => prev + 1);
        setPulseButton(true);
        if (soundEnabled) playSound('notify');
        sendBrowserNotification('Nora from ACLLC 👋', "We're taking new projects! Got an idea? Let's talk 🚀");
      }
    }, 25000);
    return () => clearTimeout(timer);
  }, [soundEnabled]);

  const handleOpen = useCallback(() => {
    if (!isOpen && soundEnabled) playSound('open');
    setIsOpen(o => !o);
  }, [isOpen, soundEnabled]);

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifEnabled(granted);
    setShowNotifBanner(false);
  };

  const sendMessage = async (overrideText?: string) => {
    const messageText = (overrideText ?? input).trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setApiError(null);

    if (soundEnabled) playSound('send');

    const history = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://acllc.dev',
          'X-Title': 'ACLLC Sales Assistant',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: messageText },
          ],
          max_tokens: 600,
          temperature: 0.85,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('OpenRouter error:', data);
        throw new Error(data?.error?.message ?? `HTTP ${res.status}`);
      }

      const reply = data?.choices?.[0]?.message?.content;
      if (!reply) throw new Error('Empty response from API');

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (soundEnabled) playSound('message');

      // If chat is minimized, show unread + browser notif
      if (!isOpenRef.current) {
        setUnreadCount(prev => prev + 1);
        setPulseButton(true);
        sendBrowserNotification('Nora — ACLLC 🧠', reply.slice(0, 80) + (reply.length > 80 ? '...' : ''));
      }

    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setApiError(errMsg);
      setMessages(prev => [...prev, {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: "Hmm, hit a tiny snag on my end! 😅\n\nBut hey — you can reach us directly on WhatsApp and we'll get back to you super fast! 💬⚡\n\nJust tap the link below! 👇",
        timestamp: new Date(),
      }]);
      if (soundEnabled) playSound('message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: '🏗️ Build a SaaS', text: 'I want to build a SaaS product with a dashboard, payments and database' },
    { label: '📱 Mobile AI App', text: 'I need a Mobile AI app for iOS and Android' },
    { label: '🤖 AI Agent', text: 'I need an AI agent built for my project' },
    { label: '💰 See pricing', text: 'What are your prices and packages?' },
    { label: '⚡ Quick services', text: 'What quick services do you offer under $1000?' },
  ];

  const renderMessage = (content: string) =>
    content.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <>
      {/* ── Notification Permission Banner ──────────────────────── */}
      <AnimatePresence>
        {showNotifBanner && (
          <motion.div
            initial={{ opacity: 0, y: 80, x: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="fixed bottom-28 right-3 sm:right-7 z-50 max-w-xs w-72 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#0d0d18', border: '1px solid rgba(99,102,241,0.35)' }}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl shrink-0">🔔</div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold mb-1">Get instant replies!</p>
                  <p className="text-slate-400 text-xs leading-relaxed">Enable notifications so you never miss a response from Nora.</p>
                </div>
                <button onClick={() => setShowNotifBanner(false)} className="text-slate-600 hover:text-slate-300 transition-colors shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={enableNotifications}
                  className="flex-1 text-xs font-semibold py-2 rounded-xl text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                >
                  Enable 🔔
                </button>
                <button
                  onClick={() => setShowNotifBanner(false)}
                  className="flex-1 text-xs font-semibold py-2 rounded-xl text-slate-400 hover:text-white transition-all"
                  style={{ background: 'rgba(30,30,52,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Chat Button ─────────────────────────────────── */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed, #0891b2)' }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.93 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.2 }}
        aria-label="Open chat"
      >
        {/* Pulse ring — stronger when there are unread messages */}
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            background: pulseButton ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.25)',
            animationDuration: pulseButton ? '1s' : '2s',
          }}
        />

        {/* Second outer ring when pulsing */}
        {pulseButton && (
          <span
            className="absolute rounded-full animate-ping"
            style={{
              inset: '-6px',
              background: 'rgba(99,102,241,0.2)',
              animationDuration: '1.4s',
              animationDelay: '0.2s',
            }}
          />
        )}

        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && !isOpen && (
            <motion.span
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-red-500 rounded-full flex items-center justify-center text-[11px] font-bold text-white z-10 shadow-lg"
              style={{ boxShadow: '0 0 10px rgba(239,68,68,0.6)' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Icon toggle */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Window ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-3 sm:bottom-28 sm:right-7 z-50 flex flex-col"
            style={{
              width: 'min(420px, calc(100vw - 1.5rem))',
              height: 'min(600px, 76vh)',
              background: '#0d0d18',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '1.25rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(124,58,237,0.18), rgba(8,145,178,0.18))', borderBottom: '1px solid rgba(99,102,241,0.2)' }}
              className="p-3 sm:p-4 shrink-0"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                    animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 12px rgba(124,58,237,0.5)', '0 0 0px rgba(124,58,237,0)'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    🧠
                  </motion.div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-[#0d0d18] rounded-full" style={{ boxShadow: '0 0 6px #4ade80' }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-base leading-tight">Nora — AI Sales Assistant</p>
                  <p className="text-green-400 text-xs flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Online · replies in seconds ⚡
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Sound toggle */}
                  <button
                    onClick={() => setSoundEnabled(s => !s)}
                    title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                    className="p-1.5 rounded-lg transition-colors hover:bg-slate-700/50"
                    style={{ color: soundEnabled ? '#a78bfa' : '#475569' }}
                  >
                    {soundEnabled ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3-3m3 3l3-3M9 9l-3-3m0 0L3 9m3-3v12" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H2v6h4l5 4V5z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    )}
                  </button>

                  {/* Notif toggle */}
                  <button
                    onClick={notifEnabled ? () => setNotifEnabled(false) : enableNotifications}
                    title={notifEnabled ? 'Disable notifications' : 'Enable notifications'}
                    className="p-1.5 rounded-lg transition-colors hover:bg-slate-700/50"
                    style={{ color: notifEnabled ? '#a78bfa' : '#475569' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>

                  {/* Close */}
                  <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700/50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Error banner */}
              {apiError && (
                <div className="mt-2 px-2 py-1 rounded bg-red-900/40 border border-red-500/30 text-red-300 text-[10px] truncate">
                  ⚠ {apiError}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28, delay: idx === 0 ? 0 : 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} max-w-[88%]`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mb-5" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                        🧠
                      </div>
                    )}
                    <div>
                      <motion.div
                        className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                        style={
                          msg.role === 'user'
                            ? { background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', borderBottomRightRadius: '4px' }
                            : { background: 'rgba(30,30,52,0.95)', color: '#e2e8f0', borderBottomLeftRadius: '4px', border: '1px solid rgba(99,102,241,0.2)' }
                        }
                        whileHover={{ scale: 1.01 }}
                      >
                        {renderMessage(msg.content)}
                      </motion.div>
                      <p className={`text-[10px] mt-1 px-1 text-slate-600 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                    🧠
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: 'rgba(30,30,52,0.9)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="flex items-center gap-1.5">
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ background: i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#06b6d4' }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.55, repeat: Infinity, delay, ease: 'easeInOut' }}
                        />
                      ))}
                      <span className="text-slate-500 text-xs ml-1">Nora is typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <AnimatePresence>
              {messages.length <= 2 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 sm:px-4 pb-2 shrink-0"
                >
                  <p className="text-[10px] text-slate-500 mb-1.5 px-0.5">Quick questions ⚡</p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickActions.map((a, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.07 }}
                        onClick={() => sendMessage(a.text)}
                        disabled={isLoading}
                        className="text-[11px] px-2.5 py-1.5 rounded-full text-slate-300 hover:text-white transition-all active:scale-95 disabled:opacity-40"
                        style={{ background: 'rgba(30,30,52,0.8)', border: '1px solid rgba(99,102,241,0.3)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
                      >
                        {a.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-3 sm:p-4 shrink-0" style={{ borderTop: '1px solid rgba(99,102,241,0.2)', background: '#0a0a14' }}>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask me anything... 💬"
                  disabled={isLoading}
                  className="flex-1 text-sm text-white placeholder-slate-500 outline-none bg-transparent px-4 py-2.5 rounded-xl transition-all"
                  style={{ background: 'rgba(30,30,52,0.7)', border: '1px solid rgba(99,102,241,0.25)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)')}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  whileTap={{ scale: 0.88 }}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
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
                  href="https://wa.me/212638426738?text=Hey!%20I%20was%20chatting%20with%20Nora%20and%20wanted%20to%20connect%20directly%20%F0%9F%91%8B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-green-400 transition-colors group"
                >
                  <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Prefer WhatsApp? Chat directly → +212 638-426738
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
