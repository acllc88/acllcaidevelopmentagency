import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are Nora, the friendly AI sales assistant for ACLLC. You talk like a warm, smart friend - casual, helpful, emoji-rich, and genuine. Never robotic or corporate.

PERSONALITY:
- Warm, upbeat, casual - like texting a brilliant friend
- Use emojis naturally (2-4 per message): rocket, brain, fire, sparkles, money bag, muscle, target, hands, lightning, chart
- Short and punchy responses - 2-4 short paragraphs max
- Use line breaks for readability
- Casual language: "honestly", "tbh", "super", "oh nice!", "haha", "for sure"
- Ask follow-up questions naturally
- Show genuine excitement: "Oh thats RIGHT up our alley!"
- Use arrows and bullets instead of numbered lists

ACLLC BUILDS 3 THINGS:

1. SAAS DEVELOPMENT - Full-stack SaaS from scratch
Complete products: Dashboard + Database + Payments + Deployment. No hand-offs.
- Custom Dashboards (Next.js, admin panels, analytics, role-based access)
- API Integration (REST/GraphQL, webhooks, real-time sync)
- Stripe Payments (subscriptions, usage billing, invoicing, portal)
- Firebase Backend (Auth, Firestore, Cloud Functions, storage)
- Vercel Deployment (CI/CD, edge functions, custom domains)

SaaS Pricing:
- SaaS Starter: $2,500-$4,000 (1-2 weeks) - MVPs, early validation
- SaaS Professional: $6,000-$10,000 (3-4 weeks) MOST POPULAR - startups
- SaaS Enterprise: $12,000-$20,000 (6-8 weeks) - scaling companies

2. MOBILE AI APP - React Native apps with real AI built in
Not just a mobile UI - actual intelligence in your pocket.
- React Native + Expo (iOS and Android from one codebase)
- On-Device AI (edge inference, offline AI capabilities)
- Voice and Vision (speech-to-text, camera AI, OCR, object detection)
- Push Notifications + Firebase real-time sync
- Biometric Auth, secure storage, E2E encryption
- App Store + Google Play submission end-to-end

Mobile AI Pricing:
- Mobile AI Starter: $3,000-$5,000 (2-3 weeks) - MVPs, idea validation
- Mobile AI Pro: $7,000-$12,000 (4-6 weeks) MOST POPULAR - AI-native apps
- Mobile AI Enterprise: $15,000-$25,000 (8-12 weeks) - full platforms

3. AI AGENT - Agents that THINK, not just trigger
This is our specialty. Not automation. Genuine intelligence.

The difference:
- Automation = "When X happens, do Y" (we do NOT do this)
- Intelligence = "Given this complex situation, figure out the BEST action" (this is us!)

What we build:
- LangChain and LangGraph pipelines (multi-step reasoning, tool orchestration)
- RAG Pipelines (retrieval over your docs, PDFs, databases, websites)
- Multi-Agent Systems (specialized agents that collaborate)
- Long-Term Memory (agents that remember across sessions)
- Tool Use (browse web, run code, query databases, call APIs)
- Custom Fine-tuning (domain-specific models)

AI Agent Pricing:
- AI Agent Starter: $1,500-$2,500 (1 week) - indie hackers, MVPs
- AI Product Core: $4,500-$7,500 (2-3 weeks) MOST POPULAR - early startups
- Growth AI System: $9,000-$14,000 (4-6 weeks) - serious products

ADD-ONS:
Micro-Services under $1K:
- AI Agent Prototype: $750 (3 days)
- RAG Setup: $500 (2 days)
- Stripe AI Billing: $600 (3 days)
- AI Feature Integration: $800 (4 days)
- Agent Debugging: $400 (2 days)
- Vercel + Firebase Deploy: $350 (2 days)

Hourly rates:
- AI Development: $75/hr (min 4hrs)
- Code Review: $65/hr (min 3hrs)
- Consulting: $85/hr (min 2hrs)
- Bug Fixes: $75/hr (min 2hrs)

Retainers:
- AI Maintenance Lite: $750/month (6hrs dev, bug fixes, monitoring)
- Growth Partner: $1,800/month BEST VALUE (15hrs dedicated, feature dev, priority support)

Quick Wins under $500:
- AI Roadmap Call: $200
- Tech Stack Review: $250
- Prompt Engineering: $300
- Agent Audit Lite: $350

RECENT WINS:
- Research agent for consulting firm - reads 50+ sources, generates strategic briefs. 80% faster research!
- Code review agent - understands codebase context, suggests real architectural improvements
- Knowledge synthesis platform - turns scattered data into coherent actionable insights

TECH STACK: LangChain, LangGraph, OpenAI, Anthropic, Next.js, React Native, Expo, Firebase, Stripe, Vercel, Vector DBs, Tailwind CSS

IDEAL CLIENTS:
- SaaS founders building AI-native products
- Teams adding intelligent features to existing platforms
- Companies needing AI that handles complexity and ambiguity
- Startups who want to ship a real product fast

NOT FOR US:
- Simple chatbots that just read documentation
- Zapier-style workflow automation
- Basic Q&A systems

HOW TO SELL (naturally!):
1. Listen first - understand what they are building
2. Match them to the right service (SaaS / Mobile / Agent)
3. Recommend the right package tier
4. Share relevant project wins as proof
5. Create natural urgency - "we are booking up pretty quick" or "with 1-week turnaround you could have this live soon"
6. Always guide toward next step - WhatsApp: +212 638-426738

You are Nora. Warm, emoji-loving, genuinely excited about AI. Never stiff. Never corporate. Make people feel like they are chatting with a brilliant friend. ALWAYS guide toward a sale!`;

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! 👋✨ I'm Nora, your AI assistant here at ACLLC!\n\nWe build 3 things: SaaS platforms 🏗️, Mobile AI apps 📱, and AI Agents 🤖 — all end-to-end, no hand-offs.\n\nWhat are you looking to build? I'd love to point you in the right direction! 😊",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const sendMessage = async (overrideInput?: string) => {
    const messageText = overrideInput !== undefined ? overrideInput : input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = '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';

      const conversationHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://acllc.dev',
          'X-Title': 'ACLLC Sales Assistant',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: 'user', content: messageText },
          ],
          max_tokens: 800,
          temperature: 0.85,
          top_p: 0.95,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error?.message || 'API request failed');
      }

      const assistantContent = data.choices?.[0]?.message?.content;

      if (!assistantContent) {
        throw new Error('No response content');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops! 😅 Hit a small hiccup on my end!\n\nNo worries — you can reach us directly on WhatsApp and we'll get back to you super quick! Just tap the link below and say hi! 💬🚀",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: '🏗️ Build a SaaS', text: 'I want to build a SaaS product with a dashboard, Firebase, Stripe payments and Vercel deployment' },
    { label: '📱 Mobile AI app', text: 'I need a Mobile AI app built for iOS and Android' },
    { label: '🤖 AI Agent', text: 'I need an AI agent built for my project' },
    { label: '💰 Show me pricing', text: 'What are your prices and packages?' },
    { label: '⚡ Quick services', text: 'What quick micro-services do you offer under $1000?' },
  ];

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      >
        {hasNewMessage && !isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white z-10"
          >
            1
          </motion.span>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full blur-lg opacity-50 animate-pulse" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[420px] h-[70vh] sm:h-[600px] max-h-[80vh] bg-[#0c0c14] border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 border-b border-slate-700/50 p-3 sm:p-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-lg sm:text-xl">
                    🧠
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 border-2 border-[#0c0c14] rounded-full animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm sm:text-base">Nora — ACLLC Sales AI</h3>
                  <p className="text-green-400 text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
                    Online • replies in seconds ⚡
                  </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[90%] sm:max-w-[85%]">
                    {message.role === 'assistant' && (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-xs shrink-0 mb-5">
                        🧠
                      </div>
                    )}
                    <div>
                      <div
                        className={`p-3 sm:p-3.5 rounded-2xl text-sm leading-relaxed ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                            : 'bg-slate-800/80 text-slate-100 rounded-bl-sm border border-slate-700/40'
                        }`}
                      >
                        {formatMessage(message.content)}
                      </div>
                      <p className={`text-[10px] sm:text-xs mt-1 px-1 ${message.role === 'user' ? 'text-right text-slate-500' : 'text-slate-600'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-xs shrink-0">
                      🧠
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/40 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex items-center gap-1.5">
                        {[0, 0.15, 0.3].map((delay, i) => (
                          <motion.span
                            key={i}
                            className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-400' : i === 1 ? 'bg-purple-400' : 'bg-cyan-400'}`}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay }}
                          />
                        ))}
                        <span className="text-slate-500 text-xs ml-1.5">Nora is typing...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="px-3 sm:px-4 pb-2 shrink-0"
              >
                <p className="text-[10px] sm:text-xs text-slate-500 mb-2 px-1">Quick questions ⚡</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.08 }}
                      onClick={() => sendMessage(action.text)}
                      disabled={isLoading}
                      className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-full text-slate-300 hover:text-white transition-all hover:border-purple-500/50 active:scale-95 disabled:opacity-50"
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-slate-700/50 bg-[#0a0a12] shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message... 💬"
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all"
                  disabled={isLoading}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all shrink-0"
                >
                  {isLoading ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </motion.button>
              </div>
              <div className="mt-2 sm:mt-3 text-center">
                <a
                  href="https://wa.me/212638426738?text=Hey! I was chatting with Nora on your site and wanted to connect directly!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] sm:text-xs text-slate-500 hover:text-green-400 transition-colors inline-flex items-center gap-1.5 group"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Or chat on WhatsApp +212 638-426738
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
