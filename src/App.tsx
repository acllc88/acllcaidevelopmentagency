import { useState, useEffect, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import {
  Download,
  Bot,
  Cpu,
  Smartphone,
  Globe,
  MessageSquare,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  Star,
  ArrowRight,
  Sparkles,
  BrainCircuit,
  Layers,
  Code2,
  Rocket,
  Shield,
  Clock,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  Workflow,
  FileText,
  Loader2,
  Monitor,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

/* ─── Constants ───────────────────────────────────── */
const UPWORK_URL = 'https://www.upwork.com/freelancers/~01b65569d4f5b6a0b2';
const NAME = 'Youssef E.';
const PROFILE_IMG = 'https://i.ibb.co/pDSMXFW/Create-linkdin-profile-202602181535.jpg';
const PLATFORM_URL = 'https://actlikeyouknowplatform.vercel.app/';

const USER_DASHBOARD_IMGS = [
  'https://i.ibb.co/23Txc6Ld/Screen-Shot-2026-03-04-at-1-09-53-AM.png',
  'https://i.ibb.co/m5rSzbZY/Screen-Shot-2026-03-04-at-1-10-07-AM.png',
  'https://i.ibb.co/RkpdqMqH/Screen-Shot-2026-03-04-at-1-10-19-AM.png',
  'https://i.ibb.co/N2S9mVBx/Screen-Shot-2026-03-04-at-1-10-30-AM.png',
  'https://i.ibb.co/pvK905tY/Screen-Shot-2026-03-04-at-1-10-43-AM.png',
  'https://i.ibb.co/rR1C9XnN/Screen-Shot-2026-03-04-at-1-11-03-AM.png',
];

const ADMIN_DASHBOARD_IMGS = [
  'https://i.ibb.co/DHgRj1NY/Screen-Shot-2026-03-04-at-1-11-26-AM.png',
  'https://i.ibb.co/4HCYy1V/Screen-Shot-2026-03-04-at-1-11-42-AM.png',
  'https://i.ibb.co/GQsTYB1K/Screen-Shot-2026-03-04-at-1-11-54-AM.png',
  'https://i.ibb.co/Myym57QS/Screen-Shot-2026-03-04-at-1-12-05-AM.png',
  'https://i.ibb.co/qL00zPzb/Screen-Shot-2026-03-04-at-1-12-17-AM.png',
  'https://i.ibb.co/d0L2HVPX/Screen-Shot-2026-03-04-at-1-12-32-AM.png',
  'https://i.ibb.co/HTR0k5RQ/Screen-Shot-2026-03-04-at-1-12-43-AM.png',
  'https://i.ibb.co/Q3cBtQcm/Screen-Shot-2026-03-04-at-1-12-55-AM.png',
];

/* FiverrGigImage removed — design moved to OG image SVG */

/* ─── Animated Counter ────────────────────────────── */
function AnimatedStat({ value, suffix = '', prefix = '' }: { value: string; suffix?: string; prefix?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
      <span className="text-4xl md:text-5xl font-extrabold gradient-text">{prefix}{value}{suffix}</span>
    </div>
  );
}

/* ─── Section Wrapper ─────────────────────────────── */
function Section({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={ref} id={id} className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </section>
  );
}

/* ─── Screenshot Gallery (Website) ─────────────────── */
function ScreenshotGallery({ images, label }: { images: string[]; label: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  const prev = () => setActiveIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx(i => (i + 1) % images.length);

  return (
    <div>
      {/* Main image — full view, no crop */}
      <div className="relative rounded-xl overflow-hidden border border-slate-700/50 bg-black mb-4 group" style={{ minHeight: 400 }}>
        {imgErrors.has(activeIdx) ? (
          <div className="w-full flex items-center justify-center bg-slate-800/50" style={{ minHeight: 400 }}>
            <div className="text-center">
              <Monitor className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">{label} — Screen {activeIdx + 1}</p>
            </div>
          </div>
        ) : (
          <img
            src={images[activeIdx]}
            alt={`${label} screenshot ${activeIdx + 1}`}
            className="w-full h-auto max-h-[600px] object-contain mx-auto block transition-all duration-500"
            style={{ backgroundColor: '#0a0a0a' }}
            onError={() => setImgErrors(prev => new Set(prev).add(activeIdx))}
          />
        )}
        {/* Nav arrows */}
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 cursor-pointer z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 cursor-pointer z-10">
          <ChevronRight className="w-5 h-5" />
        </button>
        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-black/70 rounded-full px-3 py-1 text-xs text-white/80 font-medium z-10">
          {activeIdx + 1} / {images.length}
        </div>
      </div>
      {/* Thumbnails — bigger, clearer */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-black ${
              i === activeIdx ? 'border-brand-500 shadow-lg shadow-brand-500/30 scale-105' : 'border-slate-700/50 opacity-50 hover:opacity-90'
            }`}
          >
            {imgErrors.has(i) ? (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <span className="text-[10px] text-slate-500">{i + 1}</span>
              </div>
            ) : (
              <img
                src={img}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-contain bg-black"
                onError={() => setImgErrors(prev => new Set(prev).add(i))}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════
   PDF TEMPLATE — 100% inline styles for html2canvas
   ══════════════════════════════════════════════════════ */
function PdfTemplate() {
  const bg = '#0b1120';
  const cardBg = '#151d2e';
  const cardBorder = '#1e2d45';
  const textWhite = '#f1f5f9';
  const textGray = '#94a3b8';
  const textMuted = '#64748b';
  const brand = '#818cf8';
  const brandDark = '#4f46e5';
  const cyan = '#22d3ee';
  const emerald = '#34d399';
  const rose = '#fb7185';
  const amber = '#fbbf24';

  const sectionTitle = (color: string, label: string, title: string, subtitle?: string) => (
    <div style={{ textAlign: 'center', marginBottom: 40 }}>
      <div style={{ color, fontSize: 12, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 8 }}>{label}</div>
      <div style={{ color: textWhite, fontSize: 36, fontWeight: 900, lineHeight: 1.2 }}>{title}</div>
      {subtitle && <div style={{ color: textGray, fontSize: 15, marginTop: 10, maxWidth: 550, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>{subtitle}</div>}
    </div>
  );

  const serviceCard = (emoji: string, title: string, desc: string, accentColor: string) => (
    <div style={{
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: 16,
      padding: '24px 20px',
      borderTop: `3px solid ${accentColor}`,
    }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>{emoji}</div>
      <div style={{ color: textWhite, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ color: textGray, fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );

  const resultCard = (emoji: string, title: string, metric: string, metricLabel: string, detail: string, accentColor: string) => (
    <div style={{
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: 16,
      padding: 24,
      borderLeft: `4px solid ${accentColor}`,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
    }}>
      <div style={{ fontSize: 32, flexShrink: 0, lineHeight: 1 }}>{emoji}</div>
      <div>
        <div style={{ color: textGray, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ color: accentColor, fontSize: 30, fontWeight: 900 }}>{metric}</span>
          <span style={{ color: textGray, fontSize: 13, fontWeight: 600 }}>{metricLabel}</span>
        </div>
        <div style={{ color: textMuted, fontSize: 12 }}>{detail}</div>
      </div>
    </div>
  );

  /* Screenshot grid for PDF — uses object-contain, no crop */
  const screenshotGrid = (images: string[], label: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {images.map((img, i) => (
        <div key={i} style={{
          borderRadius: 12,
          overflow: 'hidden',
          border: `1px solid ${cardBorder}`,
          background: '#000',
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src={img}
            alt={`${label} ${i + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              backgroundColor: '#000',
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div style={{
      width: 1200,
      background: bg,
      color: textWhite,
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      overflow: 'hidden',
    }}>
      {/* ─── HERO ─── */}
      <div style={{
        background: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)`,
        padding: '60px 60px 50px 60px',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
          {/* Left text */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 30,
              padding: '6px 16px',
              fontSize: 13,
              color: brand,
              fontWeight: 600,
              marginBottom: 20,
            }}>
              ✨ Top Rated · AI & Full-Stack Developer
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, marginBottom: 14, color: textWhite }}>
              I Build <span style={{ color: brand }}>AI Products</span>
              <br />That Actually Work
            </div>
            <div style={{ fontSize: 17, color: brand, fontWeight: 600, marginBottom: 10 }}>
              {NAME} — AI Engineer & Full-Stack Developer
            </div>
            <div style={{ fontSize: 16, color: textGray, lineHeight: 1.7, maxWidth: 520, marginBottom: 20 }}>
              Fast, clean, and built to scale. From GPT-4 powered SaaS platforms to autonomous AI agents — I turn your AI ideas into production-ready products.
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 30,
              padding: '8px 20px',
              fontSize: 13,
              color: '#c7d2fe',
            }}>
              🌐 {UPWORK_URL}
            </div>
          </div>
          {/* Right avatar with photo */}
          <div style={{ flexShrink: 0, position: 'relative' }}>
            <div style={{
              width: 220,
              height: 260,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${brandDark}, ${cyan}, ${emerald})`,
              padding: 3,
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: 22,
                overflow: 'hidden',
                background: '#0f172a',
                boxSizing: 'border-box',
              }}>
                <img
                  src={PROFILE_IMG}
                  alt={NAME}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
            {/* Badges */}
            <div style={{
              position: 'absolute',
              top: -8,
              right: -8,
              background: 'rgba(16,185,129,0.2)',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: 10,
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 700,
              color: emerald,
            }}>✅ Available Now</div>
            <div style={{
              position: 'absolute',
              bottom: -8,
              left: -8,
              background: 'rgba(251,191,36,0.2)',
              border: '1px solid rgba(251,191,36,0.4)',
              borderRadius: 10,
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 700,
              color: amber,
            }}>⭐ 5.0 Rating</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 50 }}>
          {[
            { val: '5+', label: 'Years Experience', emoji: '⏱', color: brand },
            { val: '200+', label: 'Projects Delivered', emoji: '🏆', color: cyan },
            { val: '30+', label: 'Countries Served', emoji: '🌍', color: emerald },
            { val: '100%', label: 'Job Success', emoji: '🛡', color: amber },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(30,41,59,0.8)',
              border: `1px solid rgba(99,102,241,0.2)`,
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.emoji}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 13, color: textGray, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── WHAT I BUILD ─── */}
      <div style={{ padding: '50px 60px' }}>
        {sectionTitle(brand, 'SERVICES', 'What I Build', 'End-to-end AI solutions — from concept to production. Every project is built for performance, scalability, and real business impact.')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {serviceCard('🌐', 'AI Web Apps & SaaS', 'Next.js, React, GPT-4, Claude, Stripe billing — full-stack AI-powered platforms built for scale.', brand)}
          {serviceCard('💬', 'Custom AI Chatbots', 'Web, WhatsApp, Telegram, Slack, CRM. RAG-powered bots that actually understand your business.', cyan)}
          {serviceCard('⚡', 'AI Agents & Automation', 'LangChain, CrewAI, multi-step autonomous workflows that replace entire manual processes.', emerald)}
          {serviceCard('📱', 'Mobile Apps with AI', 'React Native & Flutter — cross-platform mobile apps with embedded AI capabilities.', rose)}
          {serviceCard('🔗', 'AI Integrations', 'Connect any product to OpenAI, Claude, or Gemini. Seamless API integration & orchestration.', amber)}
          {serviceCard('🧠', 'Fine-tuning & Prompt Eng.', 'Custom model fine-tuning and advanced prompt engineering for domain-specific AI performance.', brand)}
        </div>
      </div>

      {/* ─── RESULTS ─── */}
      <div style={{ padding: '50px 60px' }}>
        {sectionTitle(emerald, 'PROVEN IMPACT', 'Recent Results', "Numbers don't lie. Here's the real-world impact my AI solutions have delivered for clients.")}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {resultCard('🤖', 'E-Commerce Chatbot', '70%', 'Support Ticket Reduction', '800+ queries/day fully automated', cyan)}
          {resultCard('🚀', 'AI SaaS Platform', '2,000', 'Users in Week 1', 'Signed up within the first week of launch', brand)}
          {resultCard('📊', 'Investment Research Agent', '25hrs', 'Saved Per Week', 'For a 6-person research team', emerald)}
          {resultCard('📈', 'Mobile AI App', '50K', 'Downloads in 3 Months', 'Post-launch growth trajectory', rose)}
        </div>
      </div>

      {/* ─── FEATURED CREATION ─── */}
      <div style={{ padding: '50px 60px' }}>
        {sectionTitle(rose, 'FEATURED CREATION', 'ActLikeYouKnow Platform', 'A full-stack AI-powered SaaS platform — designed, built, and deployed from scratch.')}

        {/* Platform link */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(251,113,133,0.1)',
            border: '1px solid rgba(251,113,133,0.3)',
            borderRadius: 30,
            padding: '8px 22px',
            fontSize: 14,
            color: rose,
            fontWeight: 600,
          }}>
            🔗 {PLATFORM_URL}
          </div>
        </div>

        {/* User Dashboard */}
        <div style={{ marginBottom: 30 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(99,102,241,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>👤</div>
            <div>
              <div style={{ color: textWhite, fontSize: 18, fontWeight: 700 }}>User Dashboard</div>
              <div style={{ color: textMuted, fontSize: 12 }}>Clean, intuitive interface for end users</div>
            </div>
          </div>
          {screenshotGrid(USER_DASHBOARD_IMGS, 'User Dashboard')}
        </div>

        {/* Admin Dashboard */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(251,191,36,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>🛡</div>
            <div>
              <div style={{ color: textWhite, fontSize: 18, fontWeight: 700 }}>Admin Dashboard</div>
              <div style={{ color: textMuted, fontSize: 12 }}>Powerful management & analytics panel</div>
            </div>
          </div>
          {screenshotGrid(ADMIN_DASHBOARD_IMGS, 'Admin Dashboard')}
        </div>
      </div>

      {/* ─── TECH STACK ─── */}
      <div style={{ padding: '50px 60px' }}>
        {sectionTitle(cyan, 'TECH STACK', 'Tools & Technologies')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { category: 'AI / LLM', items: ['GPT-4 / GPT-4o', 'Claude 3.5', 'Gemini Pro', 'LangChain', 'CrewAI', 'RAG Systems', 'Fine-tuning', 'Prompt Engineering'] },
            { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'React Native', 'Flutter'] },
            { category: 'Backend', items: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Supabase', 'Firebase'] },
            { category: 'Infra & Tools', items: ['AWS', 'Vercel', 'Docker', 'Stripe', 'Pinecone', 'Weaviate', 'GitHub Actions'] },
          ].map((group, i) => (
            <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 20 }}>
              <div style={{ color: brand, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 2, marginBottom: 14 }}>{group.category}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {group.items.map((item, j) => (
                  <span key={j} style={{
                    fontSize: 11,
                    fontWeight: 500,
                    background: '#1e293b',
                    color: '#cbd5e1',
                    border: '1px solid #334155',
                    padding: '4px 10px',
                    borderRadius: 8,
                  }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── HOW I WORK ─── */}
      <div style={{ padding: '50px 60px' }}>
        {sectionTitle(amber, 'PROCESS', 'How I Work', 'A streamlined, transparent process designed to move fast and deliver results — all async, no calls needed.')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { num: '01', title: 'Share Your Brief', desc: 'Send me your project details — goals, users, and requirements. I respond within hours.', emoji: '📋' },
            { num: '02', title: 'Architecture & Plan', desc: 'I design the system, choose the right AI models, and define clear milestones.', emoji: '📐' },
            { num: '03', title: 'Build & Iterate', desc: 'Rapid development with weekly demos and async feedback loops.', emoji: '💻' },
            { num: '04', title: 'Launch & Support', desc: 'Deploy to production with monitoring, docs, and ongoing support.', emoji: '🚀' },
          ].map((step, i) => (
            <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#1e293b', marginBottom: 12 }}>{step.num}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{step.emoji}</span>
                <span style={{ color: textWhite, fontSize: 16, fontWeight: 700 }}>{step.title}</span>
              </div>
              <div style={{ color: textGray, fontSize: 13, lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── WHY CHOOSE ME ─── */}
      <div style={{ padding: '50px 60px' }}>
        {sectionTitle(rose, 'WHY CHOOSE ME', 'The Difference')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { emoji: '⚡', title: 'Ship Fast', desc: 'I move at startup speed. Most MVPs are ready in 2–4 weeks. You get weekly demos and constant communication.', color: amber },
            { emoji: '🛡', title: 'Production-Grade', desc: 'No throwaway code. Everything is built with clean architecture, proper error handling, testing, and documentation.', color: emerald },
            { emoji: '📈', title: 'Business-First Thinking', desc: "I don't just write code — I understand your business goals and engineer solutions that drive measurable ROI.", color: brand },
          ].map((item, i) => (
            <div key={i} style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: 16,
              padding: 28,
              textAlign: 'center',
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 28,
              }}>{item.emoji}</div>
              <div style={{ color: textWhite, fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{item.title}</div>
              <div style={{ color: textGray, fontSize: 13, lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TESTIMONIAL ─── */}
      <div style={{ padding: '30px 60px' }}>
        <div style={{
          background: `linear-gradient(135deg, #1e1b4b, #0f172a, #1e1b4b)`,
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 24,
          padding: '40px 50px',
          textAlign: 'center',
        }}>
          <div style={{ marginBottom: 16, fontSize: 22, letterSpacing: 2 }}>⭐⭐⭐⭐⭐</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: '#e2e8f0', lineHeight: 1.7, fontStyle: 'italic', maxWidth: 650, margin: '0 auto 16px' }}>
            "Exceptional AI developer. Delivered a complex GPT-4 integrated platform ahead of schedule with impeccable code quality. Already planning our next project together."
          </div>
          <div style={{ color: textMuted, fontSize: 13, fontWeight: 600 }}>— Startup Founder, USA</div>
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div style={{ padding: '40px 60px 30px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${brandDark}, #3730a3, ${brandDark})`,
          borderRadius: 24,
          padding: '50px 40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>✨</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: textWhite, marginBottom: 12 }}>Ready to Build Something Amazing?</div>
          <div style={{ fontSize: 16, color: '#c7d2fe', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 24px' }}>
            Send me your project brief on Upwork. I typically respond within 2 hours and can start within the week.
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#fff',
            color: brandDark,
            padding: '12px 32px',
            borderRadius: 30,
            fontSize: 16,
            fontWeight: 800,
          }}>
            🔗 Hire Me on Upwork
          </div>
          <div style={{
            marginTop: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 30,
            padding: '8px 20px',
            fontSize: 13,
            color: '#c7d2fe',
          }}>
            🌐 {UPWORK_URL}
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 30, color: 'rgba(199,210,254,0.7)', fontSize: 13 }}>
            <span>✉ Quick Response</span>
            <span>⏱ Flexible Hours</span>
            <span>📍 Remote Worldwide</span>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div style={{ padding: '20px 60px 40px', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
        <div style={{ color: textMuted, fontSize: 13 }}>
          🧠 {NAME} · AI Developer Portfolio · Built with passion for intelligent software
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN APP — Website + PDF Download
   ══════════════════════════════════════════════════════ */
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload images (no crossOrigin to avoid CORS issues)
  useEffect(() => {
    const allImages = [PROFILE_IMG, ...USER_DASHBOARD_IMGS, ...ADMIN_DASHBOARD_IMGS];
    allImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    if (!pdfRef.current || isGeneratingPDF) return;
    setIsGeneratingPDF(true);

    try {
      // Longer wait for all images to fully load
      await new Promise(r => setTimeout(r, 3000));

      const el = pdfRef.current;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0b1120',
        logging: false,
        width: 1200,
        windowWidth: 1200,
        imageTimeout: 60000,
        removeContainer: false,
        onclone: (doc) => {
          const pdfEl = doc.querySelector('[data-pdf-template]') as HTMLElement;
          if (pdfEl) {
            pdfEl.style.position = 'static';
            pdfEl.style.left = '0';
            pdfEl.style.top = '0';
            pdfEl.style.zIndex = '1';
          }
        },
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdfPageWidth = 210; // A4 mm
      const pdfPageHeight = 297;
      const ratio = pdfPageWidth / imgWidth;
      const totalScaledHeight = imgHeight * ratio;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let page = 0;

      while (page * pdfPageHeight < totalScaledHeight) {
        if (page > 0) pdf.addPage();

        const sourceY = (page * pdfPageHeight) / ratio;
        const sourceH = Math.min(pdfPageHeight / ratio, imgHeight - sourceY);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = Math.ceil(sourceH);
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0b1120';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, sourceY, imgWidth, sourceH, 0, 0, imgWidth, sourceH);
        }

        const pageImg = pageCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(pageImg, 'JPEG', 0, 0, pdfPageWidth, sourceH * ratio);
        page++;
      }

      pdf.save(`Youssef_E_AI_Developer_Portfolio.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      // Fallback: open print dialog
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [isGeneratingPDF]);

  /* ── Service Data ── */
  const services = [
    { icon: <Globe className="w-7 h-7" />, title: 'AI Web Apps & SaaS', desc: 'Next.js, React, GPT-4, Claude, Stripe billing — full-stack AI-powered platforms built for scale.', color: 'from-brand-500 to-brand-700', border: 'border-brand-500/30', glow: 'hover:shadow-brand-500/20' },
    { icon: <MessageSquare className="w-7 h-7" />, title: 'Custom AI Chatbots', desc: 'Web, WhatsApp, Telegram, Slack, CRM. RAG-powered bots that actually understand your business.', color: 'from-cyan-400 to-cyan-500', border: 'border-cyan-500/30', glow: 'hover:shadow-cyan-500/20' },
    { icon: <Workflow className="w-7 h-7" />, title: 'AI Agents & Automation', desc: 'LangChain, CrewAI, multi-step autonomous workflows that replace entire manual processes.', color: 'from-emerald-400 to-emerald-600', border: 'border-emerald-500/30', glow: 'hover:shadow-emerald-500/20' },
    { icon: <Smartphone className="w-7 h-7" />, title: 'Mobile Apps with AI', desc: 'React Native & Flutter — cross-platform mobile apps with embedded AI capabilities.', color: 'from-rose-400 to-rose-500', border: 'border-rose-500/30', glow: 'hover:shadow-rose-500/20' },
    { icon: <Cpu className="w-7 h-7" />, title: 'AI Integrations', desc: 'Connect any product to OpenAI, Claude, or Gemini. Seamless API integration & orchestration.', color: 'from-amber-400 to-amber-500', border: 'border-amber-500/30', glow: 'hover:shadow-amber-500/20' },
    { icon: <BrainCircuit className="w-7 h-7" />, title: 'Fine-tuning & Prompt Eng.', desc: 'Custom model fine-tuning and advanced prompt engineering for domain-specific AI performance.', color: 'from-brand-400 to-cyan-400', border: 'border-brand-400/30', glow: 'hover:shadow-brand-400/20' },
  ];

  const results = [
    { icon: <Bot className="w-8 h-8 text-cyan-400" />, title: 'E-Commerce Chatbot', metric: '70%', metricLabel: 'Support Ticket Reduction', detail: '800+ queries/day fully automated', color: 'cyan' },
    { icon: <Rocket className="w-8 h-8 text-brand-400" />, title: 'AI SaaS Platform', metric: '2,000', metricLabel: 'Users in Week 1', detail: 'Signed up within the first week of launch', color: 'brand' },
    { icon: <BarChart3 className="w-8 h-8 text-emerald-400" />, title: 'Investment Research Agent', metric: '25hrs', metricLabel: 'Saved Per Week', detail: 'For a 6-person research team', color: 'emerald' },
    { icon: <TrendingUp className="w-8 h-8 text-rose-400" />, title: 'Mobile AI App', metric: '50K', metricLabel: 'Downloads in 3 Months', detail: 'Post-launch growth trajectory', color: 'rose' },
  ];

  const techStack = [
    { category: 'AI / LLM', items: ['GPT-4 / GPT-4o', 'Claude 3.5', 'Gemini Pro', 'LangChain', 'CrewAI', 'RAG Systems', 'Fine-tuning', 'Prompt Engineering'] },
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'React Native', 'Flutter'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Supabase', 'Firebase'] },
    { category: 'Infra & Tools', items: ['AWS', 'Vercel', 'Docker', 'Stripe', 'Pinecone', 'Weaviate', 'GitHub Actions'] },
  ];

  const processSteps = [
    { num: '01', title: 'Share Your Brief', desc: 'Send me your project details — goals, users, and requirements. I respond within hours.', icon: <FileText className="w-6 h-6" /> },
    { num: '02', title: 'Architecture & Plan', desc: 'I design the system, choose the right AI models, and define clear milestones.', icon: <Layers className="w-6 h-6" /> },
    { num: '03', title: 'Build & Iterate', desc: 'Rapid development with weekly demos and async feedback loops.', icon: <Code2 className="w-6 h-6" /> },
    { num: '04', title: 'Launch & Support', desc: 'Deploy to production with monitoring, docs, and ongoing support.', icon: <Rocket className="w-6 h-6" /> },
  ];

  return (
    <>
      {/* ═══ Hidden PDF Template (off-screen, always rendered) ═══ */}
      <div
        ref={pdfRef}
        data-pdf-template
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          width: 1200,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <PdfTemplate />
      </div>

      {/* ═══ WEBSITE ═══ */}
      <div className="bg-mesh min-h-screen text-white relative overflow-hidden">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-[0.03]"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)', top: `${-100 + scrollY * 0.05}px`, right: '-200px' }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', bottom: `${-50 + scrollY * 0.03}px`, left: '-100px' }}
          />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 text-white px-5 py-3 rounded-full shadow-lg shadow-brand-600/30 transition-all hover:scale-105 disabled:scale-100 cursor-pointer disabled:cursor-wait font-semibold text-sm"
        >
          {isGeneratingPDF ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</>
          ) : (
            <><Download className="w-4 h-4" /> Download PDF</>
          )}
        </button>

        {/* Loading overlay */}
        {isGeneratingPDF && (
          <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-slate-900 border border-brand-500/30 rounded-2xl p-8 text-center max-w-sm mx-4">
              <Loader2 className="w-12 h-12 text-brand-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Generating PDF</h3>
              <p className="text-slate-400 text-sm">Creating your portfolio PDF with all screenshots. This may take a moment...</p>
            </div>
          </div>
        )}

        {/* ═══════════════ HERO ═══════════════ */}
        <header className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-brand-950/60 border border-brand-500/30 rounded-full px-4 py-1.5 text-sm text-brand-300 mb-6">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Top Rated · AI & Full-Stack Developer
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight mb-4">
                I Build <span className="gradient-text">AI Products</span><br />That Actually Work
              </h1>
              <p className="text-base md:text-lg text-brand-300 font-semibold mb-3">{NAME} — AI Engineer & Full-Stack Developer</p>
              <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed mb-8">
                Fast, clean, and built to scale. From GPT-4 powered SaaS platforms to autonomous AI agents — I turn your AI ideas into production-ready products.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href={UPWORK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-brand-600/25">
                  <ExternalLink className="w-4 h-4" /> Hire Me on Upwork
                </a>
                <a href="#results" className="inline-flex items-center gap-2 border border-slate-700 hover:border-brand-500/50 text-slate-300 hover:text-white px-7 py-3.5 rounded-full font-semibold transition-all">
                  See My Results <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-56 h-68 md:w-64 md:h-80 rounded-3xl bg-gradient-to-br from-brand-600 via-cyan-500 to-emerald-500 p-[3px] animate-float">
                  <div className="w-full h-full rounded-3xl overflow-hidden bg-slate-950">
                    <img
                      src={PROFILE_IMG}
                      alt={NAME}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Available Now
                </div>
                <div className="absolute -bottom-3 -left-3 bg-amber-500/20 border border-amber-500/40 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> 5.0 Rating
                </div>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { val: '5+', label: 'Years Experience', icon: <Clock className="w-5 h-5 text-brand-400" /> },
              { val: '200+', label: 'Projects Delivered', icon: <Award className="w-5 h-5 text-cyan-400" /> },
              { val: '30+', label: 'Countries Served', icon: <Globe className="w-5 h-5 text-emerald-400" /> },
              { val: '100%', label: 'Job Success', icon: <Shield className="w-5 h-5 text-amber-400" /> },
            ].map((s, i) => (
              <div key={i} className="stat-card rounded-2xl p-5 text-center card-hover">
                <div className="flex justify-center mb-3">{s.icon}</div>
                <AnimatedStat value={s.val} />
                <p className="text-slate-400 text-sm mt-2 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </header>

        {/* ═══════════════ WHAT I BUILD ═══════════════ */}
        <Section id="services" className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-brand-400 text-sm font-bold tracking-widest uppercase">Services</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">What I Build</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">End-to-end AI solutions — from concept to production. Every project is built for performance, scalability, and real business impact.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={i} className={`group relative bg-slate-900/60 backdrop-blur border ${s.border} rounded-2xl p-6 card-hover hover:shadow-xl ${s.glow}`}>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} mb-5`}>{s.icon}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                <ChevronRight className="absolute top-6 right-6 w-5 h-5 text-slate-700 group-hover:text-brand-400 transition-colors" />
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════════ RESULTS ═══════════════ */}
        <Section id="results" className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-400 text-sm font-bold tracking-widest uppercase">Proven Impact</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">Recent Results</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Numbers don't lie. Here's the real-world impact my AI solutions have delivered for clients.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((r, i) => (
              <div key={i} className="group relative overflow-hidden bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-7 card-hover">
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  r.color === 'cyan' ? 'from-cyan-500/5 to-transparent' :
                  r.color === 'brand' ? 'from-brand-500/5 to-transparent' :
                  r.color === 'emerald' ? 'from-emerald-500/5 to-transparent' :
                  'from-rose-500/5 to-transparent'
                } opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-slate-800/80 flex items-center justify-center">{r.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-200 mb-1">{r.title}</h3>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-3xl font-black ${
                        r.color === 'cyan' ? 'text-cyan-400' :
                        r.color === 'brand' ? 'text-brand-400' :
                        r.color === 'emerald' ? 'text-emerald-400' :
                        'text-rose-400'
                      }`}>{r.metric}</span>
                      <span className="text-slate-400 text-sm font-semibold">{r.metricLabel}</span>
                    </div>
                    <p className="text-slate-500 text-sm">{r.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════════ FEATURED CREATION ═══════════════ */}
        <Section id="featured" className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-rose-400 text-sm font-bold tracking-widest uppercase">Featured Creation</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">ActLikeYouKnow Platform</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">A full-stack AI-powered SaaS platform — designed, built, and deployed from scratch.</p>
            <a
              href={PLATFORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-full px-6 py-2.5 text-rose-400 hover:text-rose-300 text-sm font-semibold transition-all hover:bg-rose-500/20"
            >
              <ExternalLink className="w-4 h-4" /> Visit Live Platform
            </a>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-slate-900/80 border border-slate-700/50 rounded-xl p-1.5">
              <button
                onClick={() => setActiveTab('user')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'user'
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" /> User Dashboard
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard
              </button>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-slate-900/40 backdrop-blur border border-slate-700/30 rounded-2xl p-6 md:p-8">
            {activeTab === 'user' ? (
              <ScreenshotGallery images={USER_DASHBOARD_IMGS} label="User Dashboard" />
            ) : (
              <ScreenshotGallery images={ADMIN_DASHBOARD_IMGS} label="Admin Dashboard" />
            )}
          </div>

          {/* Platform features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: '🤖', label: 'AI-Powered' },
              { icon: '💳', label: 'Stripe Billing' },
              { icon: '📊', label: 'Analytics Dashboard' },
              { icon: '🔐', label: 'Auth & Roles' },
            ].map((f, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center card-hover">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="text-sm font-semibold text-slate-300">{f.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════════ TECH STACK ═══════════════ */}
        <Section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Tech Stack</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">Tools & Technologies</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {techStack.map((group, i) => (
              <div key={i} className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6 card-hover">
                <h3 className="text-sm font-bold text-brand-400 uppercase tracking-wider mb-4">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, j) => (
                    <span key={j} className="text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50 px-3 py-1.5 rounded-lg">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════════ HOW I WORK ═══════════════ */}
        <Section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-bold tracking-widest uppercase">Process</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">How I Work</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">A streamlined, transparent process designed to move fast and deliver results — all async, no calls needed.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {processSteps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6 card-hover h-full">
                  <div className="text-5xl font-black text-slate-800 group-hover:text-brand-900 transition-colors mb-4">{step.num}</div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-brand-400">{step.icon}</div>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 && <ArrowRight className="hidden md:block absolute top-1/2 -right-4 w-5 h-5 text-slate-700 -translate-y-1/2 z-10" />}
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════════ WHY ME ═══════════════ */}
        <Section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-rose-400 text-sm font-bold tracking-widest uppercase">Why Choose Me</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4">The Difference</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <Zap className="w-7 h-7 text-amber-400" />, title: 'Ship Fast', desc: 'I move at startup speed. Most MVPs are ready in 2–4 weeks. You get weekly demos and constant communication.' },
              { icon: <Shield className="w-7 h-7 text-emerald-400" />, title: 'Production-Grade', desc: 'No throwaway code. Everything is built with clean architecture, proper error handling, testing, and documentation.' },
              { icon: <TrendingUp className="w-7 h-7 text-brand-400" />, title: 'Business-First Thinking', desc: "I don't just write code — I understand your business goals and engineer solutions that drive measurable ROI." },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-7 card-hover text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-5">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══════════════ TESTIMONIAL ═══════════════ */}
        <Section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-brand-950 via-slate-900 to-brand-950 border border-brand-500/20 rounded-3xl p-8 md:p-12">
            <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl" />
            <div className="relative text-center max-w-3xl mx-auto">
              <div className="flex justify-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />)}
              </div>
              <blockquote className="text-xl md:text-2xl font-medium text-slate-200 leading-relaxed mb-6 italic">
                "Exceptional AI developer. Delivered a complex GPT-4 integrated platform ahead of schedule with impeccable code quality. Already planning our next project together."
              </blockquote>
              <div className="text-slate-400 text-sm font-semibold">— Startup Founder, USA</div>
            </div>
          </div>
        </Section>

        {/* ═══════════════ CTA ═══════════════ */}
        <Section id="contact" className="px-6 py-20 max-w-6xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-3xl p-10 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
            <div className="relative">
              <Sparkles className="w-10 h-10 text-brand-200 mx-auto mb-5" />
              <h2 className="text-3xl md:text-5xl font-black mb-4">Ready to Build Something Amazing?</h2>
              <p className="text-brand-200 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Send me your project brief on Upwork. I typically respond within 2 hours and can start within the week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href={UPWORK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-brand-700 hover:text-brand-800 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all">
                  <ExternalLink className="w-5 h-5" /> Hire Me on Upwork
                </a>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2.5">
                <Globe className="w-4 h-4 text-brand-200" />
                <span className="text-brand-100 text-sm font-medium">{UPWORK_URL}</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 justify-center text-brand-200/80 text-sm">
                <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Quick Response</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Flexible Hours</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Remote Worldwide</span>
              </div>
            </div>
          </div>
        </Section>



        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer className="px-6 py-10 max-w-6xl mx-auto text-center border-t border-slate-800/50">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <BrainCircuit className="w-4 h-4 text-brand-500" />
            <span>{NAME} · AI Developer Portfolio · Built with passion for intelligent software</span>
          </div>
        </footer>
      </div>
    </>
  );
}
