import { useEffect, useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ChatBot from "./components/ChatBot";

/* ─── Particles ─── */
function ParticleField() {
  const particles = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent/20"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Grid ─── */
function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

/* ─── Section ─── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      className={`relative z-10 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── GlowCard ─── */
function GlowCard({ children, className = "", glowColor = "accent" }: { children: React.ReactNode; className?: string; glowColor?: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const glowColors: Record<string, string> = {
    accent: "99, 102, 241",
    green: "34, 197, 94",
    amber: "245, 158, 11",
    red: "239, 68, 68",
    purple: "168, 85, 247",
    blue: "59, 130, 246",
    cyan: "6, 182, 212",
  };
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative group rounded-xl border border-border bg-surface-card overflow-hidden transition-all duration-300 hover:border-accent/30 ${className}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${glowColors[glowColor] || glowColors.accent}, 0.07), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}

/* ─── WhatsApp SVG ─── */
const WaSvg = ({ cls = "w-5 h-5" }: { cls?: string }) => (
  <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ─── Nav ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const links = [
    { href: "#services", label: "Services" },
    { href: "#saas", label: "SaaS" },
    { href: "#mobile", label: "Mobile AI" },
    { href: "#agent", label: "AI Agent" },
    { href: "#pricing", label: "Pricing" },
    { href: "#stack", label: "Stack" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-surface/80 backdrop-blur-xl border-b border-border" : "bg-transparent"}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
              AC
            </div>
            <span className="font-bold text-lg tracking-tight text-text-primary">ACLLC</span>
          </a>

          <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm text-text-secondary">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-accent transition-colors font-medium">
                {l.label}
              </a>
            ))}
            <a
              href="https://wa.me/212638426738"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-semibold"
            >
              <WaSvg cls="w-4 h-4" />
              Get in Touch
            </a>
          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-light transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-text-primary rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 bg-text-primary rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-text-primary rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-surface/95 backdrop-blur-xl flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-6">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className="text-text-secondary hover:text-accent transition-colors text-xl font-medium"
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="https://wa.me/212638426738"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-8 py-3 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent-dark transition-all flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.05, duration: 0.3 }}
              >
                <WaSvg cls="w-5 h-5" />
                Get in Touch
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Hero ─── */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  const services = [
    { icon: "🏗️", label: "SaaS Development" },
    { icon: "📱", label: "Mobile AI App" },
    { icon: "🤖", label: "AI Agent" },
  ];

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-[100px] sm:blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-[100px] sm:blur-[128px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />

      <motion.div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-0" style={{ opacity, y }}>
        {/* Badge */}
        <motion.div
          className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs sm:text-sm font-medium mb-6 sm:mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI Product Engineer
          </span>
          <span className="hidden sm:inline text-accent/40">|</span>
          <span className="text-accent/70">From Concept to Intelligent Application</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="text-text-primary">I build </span>
          <span className="bg-gradient-to-r from-accent via-purple-400 to-pink-400 bg-clip-text text-transparent">
            intelligent
          </span>
          <br />
          <span className="text-text-primary">applications.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          SaaS platforms, Mobile AI apps & AI Agents — built end-to-end.{" "}
          <span className="text-text-primary font-medium">From concept to deployed product.</span>
        </motion.p>

        {/* 3 Service Badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          {services.map((s) => (
            <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-border text-sm font-semibold text-text-primary">
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Stack pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
        >
          {["Firebase", "Stripe", "Vercel", "LangChain", "OpenAI", "Anthropic", "Next.js"].map((tech) => (
            <span key={tech} className="px-3 py-1 rounded-full bg-surface-light/80 text-text-secondary text-xs font-mono border border-border">
              {tech}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <a
            href="https://wa.me/212638426738"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-accent text-white font-semibold text-base sm:text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
          >
            <WaSvg cls="relative z-10 w-5 h-5" />
            <span className="relative z-10">Let's Build Together</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-dark to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="#services"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-border text-text-secondary font-medium text-base sm:text-lg hover:border-accent/30 hover:text-text-primary transition-all text-center"
          >
            See Services ↓
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Services Overview ─── */
function ServicesOverview() {
  const services = [
    {
      id: "saas",
      icon: "🏗️",
      title: "SaaS Development",
      tagline: "Full-stack SaaS platforms built to scale",
      desc: "Custom dashboards, API integrations, Stripe payments, Firebase backend, and Vercel deployment — everything you need to ship a production-ready SaaS product.",
      color: "from-blue-500 to-cyan-500",
      glow: "blue",
      features: ["Custom Dashboards", "API Integration", "Stripe Payments", "Firebase Backend", "Vercel Deploy", "Admin Panels"],
      cta: "Explore SaaS →",
      href: "#saas",
    },
    {
      id: "mobile",
      icon: "📱",
      title: "Mobile AI App",
      tagline: "Intelligent mobile apps powered by AI",
      desc: "React Native & Expo apps with AI capabilities built in — real-time inference, voice, computer vision, on-device intelligence, and seamless cloud sync.",
      color: "from-purple-500 to-pink-500",
      glow: "purple",
      features: ["React Native", "AI Features", "Voice & Vision", "Push Notifications", "Offline-First", "App Store Ready"],
      cta: "Explore Mobile →",
      href: "#mobile",
    },
    {
      id: "agent",
      icon: "🤖",
      title: "AI Agent",
      tagline: "Agents that reason, not just respond",
      desc: "LangChain & LangGraph agents that synthesize multi-source information, handle complex reasoning chains, and take autonomous actions to solve real problems.",
      color: "from-amber-500 to-orange-500",
      glow: "amber",
      features: ["Multi-Agent Systems", "RAG Pipelines", "Tool Use", "Long-Term Memory", "Reasoning Chains", "Custom LLMs"],
      cta: "Explore Agents →",
      href: "#agent",
    },
  ];

  return (
    <Section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-16 text-center">
          <span className="text-accent font-mono text-xs sm:text-sm font-medium tracking-wider uppercase">
            // What I build
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 text-text-primary tracking-tight">
            Three services. One expert.
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mt-3 sm:mt-4 max-w-2xl mx-auto">
            End-to-end ownership from design to deployment — no hand-offs, no gaps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <GlowCard className="p-6 sm:p-8 h-full flex flex-col" glowColor={s.glow}>
                {/* Icon */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl sm:text-3xl mb-5 shadow-lg`}>
                  {s.icon}
                </div>
                {/* Title */}
                <h3 className={`text-xl sm:text-2xl font-bold mb-1 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                  {s.title}
                </h3>
                <p className="text-text-secondary text-xs sm:text-sm font-medium mb-4">{s.tagline}</p>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6 flex-1">{s.desc}</p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {s.features.map((f) => (
                    <span key={f} className="px-2.5 py-1 rounded-full bg-surface-light text-text-secondary text-[10px] sm:text-xs font-mono border border-border">
                      {f}
                    </span>
                  ))}
                </div>

                <a
                  href={s.href}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${s.color} text-white text-sm font-semibold hover:scale-105 transition-all w-fit`}
                >
                  {s.cta}
                </a>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── SaaS Development Detail ─── */
function SaasSection() {
  const features = [
    { icon: "🎨", title: "Custom Dashboards", desc: "Admin panels, analytics, data viz, role-based access, real-time data — pixel-perfect UI on Next.js + Tailwind.", tags: ["Next.js", "Tailwind", "Recharts", "RBAC"] },
    { icon: "🔗", title: "API Integration", desc: "REST & GraphQL APIs, third-party integrations, webhooks, real-time sync, error handling — production-grade.", tags: ["REST", "GraphQL", "Webhooks", "Real-time"] },
    { icon: "💳", title: "Stripe Payments", desc: "Subscriptions, usage-based billing, one-time payments, invoicing, customer portal, metered billing.", tags: ["Subscriptions", "Usage Billing", "Invoicing", "Portal"] },
    { icon: "🔥", title: "Firebase Backend", desc: "Auth (OAuth, email, phone), Firestore, Cloud Functions, real-time listeners, storage, and security rules.", tags: ["Auth", "Firestore", "Functions", "Storage"] },
    { icon: "☁️", title: "Vercel Deployment", desc: "CI/CD pipelines, preview environments, edge functions, custom domains, environment management, monitoring.", tags: ["CI/CD", "Edge Functions", "Domains", "Monitoring"] },
    { icon: "📊", title: "Analytics & Admin", desc: "Custom admin panels, user management, analytics dashboards, audit logs, and business intelligence views.", tags: ["Admin Panel", "User Mgmt", "Analytics", "Audit Logs"] },
  ];

  const packages = [
    {
      name: "SaaS Starter",
      price: "$2,500",
      priceTo: "$4,000",
      delivery: "1–2 weeks",
      bestFor: "MVPs, early validation, founders building fast",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Next.js dashboard (template-based)",
        "Firebase Auth + Firestore",
        "Stripe checkout (one-time)",
        "3 core pages",
        "Vercel deployment",
        "Mobile responsive",
        "Basic admin view",
      ],
    },
    {
      name: "SaaS Professional",
      price: "$6,000",
      priceTo: "$10,000",
      delivery: "3–4 weeks",
      bestFor: "Early-stage startups, SaaS teams shipping fast",
      color: "from-purple-500 to-indigo-500",
      popular: true,
      features: [
        "Custom dashboard + analytics",
        "Full API integration layer",
        "Stripe subscriptions + webhooks",
        "Firebase full backend",
        "8+ custom pages",
        "Admin panel + user dashboard",
        "Role-based access control",
        "14 days post-launch support",
      ],
    },
    {
      name: "SaaS Enterprise",
      price: "$12,000",
      priceTo: "$20,000",
      delivery: "6–8 weeks",
      bestFor: "Scaling companies, complex product requirements",
      color: "from-amber-500 to-orange-500",
      features: [
        "Complete SaaS platform",
        "AI-powered features built-in",
        "Advanced Stripe billing (metered, seats)",
        "Multi-tenant architecture",
        "Custom API integrations",
        "Advanced admin + analytics",
        "Performance optimization",
        "30 days dedicated support",
      ],
    },
  ];

  return (
    <Section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" id="saas">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl">🏗️</div>
            <span className="text-accent font-mono text-xs sm:text-sm font-medium tracking-wider uppercase">// SaaS Development</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
            Full-stack SaaS,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">start to finish</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
            Dashboard, database, payments, deployment — owned entirely. No hand-offs, no gaps, no excuses.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}>
              <GlowCard className="p-5 sm:p-6 h-full" glowColor="blue">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl border border-blue-500/20">{f.icon}</div>
                  <h3 className="font-bold text-text-primary text-sm sm:text-base">{f.title}</h3>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-surface-light text-text-secondary text-[10px] font-mono border border-border">{t}</span>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Architecture */}
        <motion.div className="mb-16 sm:mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="rounded-2xl border border-border bg-surface-card/60 p-6 sm:p-10 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-8 text-center">Full-Stack Architecture</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 min-w-max mx-auto">
              {[
                { label: "FRONTEND", icon: "🎨", color: "blue", items: ["Next.js", "React", "Tailwind"] },
                { label: "API LAYER", icon: "🔗", color: "purple", items: ["REST APIs", "Webhooks", "Real-time"] },
                { label: "BACKEND", icon: "🔥", color: "orange", items: ["Firebase", "Stripe", "Auth"] },
                { label: "DEPLOYMENT", icon: "☁️", color: "green", items: ["Vercel", "CI/CD", "Monitoring"] },
              ].map((block, i, arr) => (
                <div key={block.label} className="flex sm:flex-row flex-col items-center gap-2 sm:gap-2">
                  <div className={`rounded-xl border border-${block.color}-500/30 bg-${block.color}-500/5 p-4 text-center min-w-[130px]`}>
                    <div className="text-2xl mb-2">{block.icon}</div>
                    <div className={`text-xs font-bold text-${block.color}-400 mb-2`}>{block.label}</div>
                    <div className="space-y-1">
                      {block.items.map((item) => (
                        <div key={item} className="text-[10px] text-text-secondary font-mono bg-surface-light/50 rounded px-2 py-0.5">{item}</div>
                      ))}
                    </div>
                  </div>
                  {i < arr.length - 1 && <span className="text-accent text-lg rotate-90 sm:rotate-0">→</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* SaaS Pricing */}
        <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">💰 SaaS Pricing</h3>
        <p className="text-text-secondary text-sm sm:text-base mb-8">Everything included. No hidden fees.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10">
          {packages.map((pkg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="relative">
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-accent to-purple-500 text-white text-xs font-bold z-10 whitespace-nowrap">
                  ⭐ MOST POPULAR
                </div>
              )}
              <GlowCard className={`p-6 sm:p-7 h-full flex flex-col ${pkg.popular ? "border-accent/40 ring-1 ring-accent/20" : ""}`}>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${pkg.color} text-white text-xs font-semibold w-fit mb-4`}>{pkg.name}</div>
                <div className="mb-2">
                  <span className="text-2xl sm:text-3xl font-black text-text-primary">{pkg.price}</span>
                  <span className="text-text-secondary text-sm"> – {pkg.priceTo}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-5">
                  <span className="text-green-400">⏱</span>{pkg.delivery} delivery
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-text-secondary"><span className="text-accent font-semibold">Best for:</span> {pkg.bestFor}</p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <a
            href="https://wa.me/212638426738?text=Hi!%20I'm%20interested%20in%20building%20a%20SaaS%20product."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-base sm:text-lg hover:scale-105 transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
          >
            <WaSvg /> Start Your SaaS Project →
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ─── Mobile AI App Section ─── */
function MobileSection() {
  const features = [
    { icon: "⚛️", title: "React Native & Expo", desc: "Cross-platform iOS & Android apps with a single codebase. Native performance, native feel, web fallback.", tags: ["React Native", "Expo", "iOS", "Android"] },
    { icon: "🧠", title: "On-Device AI", desc: "Edge inference, on-device models, offline AI capabilities — smart apps that work without internet.", tags: ["Edge AI", "Offline", "On-Device", "TensorFlow Lite"] },
    { icon: "🎙️", title: "Voice & Vision", desc: "Speech-to-text, text-to-speech, camera AI, object detection, OCR, and computer vision features.", tags: ["STT", "TTS", "Vision AI", "OCR"] },
    { icon: "🔔", title: "Push & Real-time", desc: "Firebase push notifications, real-time Firestore sync, background tasks, and live data updates.", tags: ["Push Notifications", "Firebase", "Real-time", "Background Sync"] },
    { icon: "🔐", title: "Auth & Security", desc: "Biometrics, OAuth, email/phone auth, secure storage, certificate pinning, and end-to-end encryption.", tags: ["Biometrics", "OAuth", "Secure Storage", "E2E Encryption"] },
    { icon: "🚀", title: "App Store Deploy", desc: "End-to-end publishing to Apple App Store & Google Play — certificates, metadata, screenshots, review.", tags: ["App Store", "Google Play", "ASO", "CI/CD"] },
  ];

  const packages = [
    {
      name: "Mobile AI Starter",
      price: "$3,000",
      priceTo: "$5,000",
      delivery: "2–3 weeks",
      bestFor: "MVPs, early traction, idea validation",
      color: "from-purple-500 to-pink-500",
      features: [
        "React Native + Expo",
        "1 AI feature (voice or vision)",
        "Firebase Auth + Firestore",
        "Push notifications",
        "5 core screens",
        "iOS + Android build",
        "App Store submission guidance",
      ],
    },
    {
      name: "Mobile AI Pro",
      price: "$7,000",
      priceTo: "$12,000",
      delivery: "4–6 weeks",
      bestFor: "Startups, AI-native mobile products",
      color: "from-indigo-500 to-purple-500",
      popular: true,
      features: [
        "Full React Native app",
        "Multiple AI features",
        "On-device + cloud inference",
        "Firebase full backend",
        "Stripe in-app purchases",
        "Offline-first architecture",
        "15+ screens",
        "14 days post-launch support",
      ],
    },
    {
      name: "Mobile AI Enterprise",
      price: "$15,000",
      priceTo: "$25,000",
      delivery: "8–12 weeks",
      bestFor: "Companies building AI-native mobile platforms",
      color: "from-pink-500 to-rose-500",
      features: [
        "Complete AI mobile platform",
        "Custom ML model integration",
        "Advanced on-device intelligence",
        "Multi-platform (iOS, Android, Web)",
        "Complex Stripe billing",
        "Admin web dashboard",
        "Analytics + crash reporting",
        "30 days dedicated support",
      ],
    },
  ];

  return (
    <Section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" id="mobile">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">📱</div>
            <span className="text-accent font-mono text-xs sm:text-sm font-medium tracking-wider uppercase">// Mobile AI App</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
            AI in your pocket,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">built to ship</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
            React Native apps with real AI capabilities — voice, vision, on-device intelligence, and seamless cloud sync.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}>
              <GlowCard className="p-5 sm:p-6 h-full" glowColor="purple">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-xl border border-purple-500/20">{f.icon}</div>
                  <h3 className="font-bold text-text-primary text-sm sm:text-base">{f.title}</h3>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-surface-light text-text-secondary text-[10px] font-mono border border-border">{t}</span>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* What makes it intelligent */}
        <motion.div
          className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-6 sm:p-10 mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-6 text-center">What makes it an AI app — not just a mobile app</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🧠", label: "Understands context", sub: "Not just commands" },
              { icon: "👁️", label: "Sees & interprets", sub: "Camera, vision, OCR" },
              { icon: "🎙️", label: "Listens & speaks", sub: "Natural voice UX" },
              { icon: "📈", label: "Learns from use", sub: "Gets smarter over time" },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-surface-card border border-border">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-text-primary font-semibold text-sm">{item.label}</p>
                <p className="text-text-secondary text-xs mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile Pricing */}
        <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">💰 Mobile AI Pricing</h3>
        <p className="text-text-secondary text-sm sm:text-base mb-8">iOS + Android. AI included. Ready to ship.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10">
          {packages.map((pkg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="relative">
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold z-10 whitespace-nowrap">
                  ⭐ MOST POPULAR
                </div>
              )}
              <GlowCard className={`p-6 sm:p-7 h-full flex flex-col ${pkg.popular ? "border-purple-500/40 ring-1 ring-purple-500/20" : ""}`} glowColor="purple">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${pkg.color} text-white text-xs font-semibold w-fit mb-4`}>{pkg.name}</div>
                <div className="mb-2">
                  <span className="text-2xl sm:text-3xl font-black text-text-primary">{pkg.price}</span>
                  <span className="text-text-secondary text-sm"> – {pkg.priceTo}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-5">
                  <span className="text-green-400">⏱</span>{pkg.delivery} delivery
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-text-secondary"><span className="text-purple-400 font-semibold">Best for:</span> {pkg.bestFor}</p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <a
            href="https://wa.me/212638426738?text=Hi!%20I'm%20interested%20in%20building%20a%20Mobile%20AI%20app."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-base sm:text-lg hover:scale-105 transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
          >
            <WaSvg /> Start Your Mobile App →
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ─── AI Agent Section ─── */
function AgentSection() {
  const features = [
    { icon: "🔗", title: "LangChain & LangGraph", desc: "Production-grade agent pipelines with multi-step reasoning, tool orchestration, and complex workflow management.", tags: ["LangChain", "LangGraph", "Tool Use", "Pipelines"] },
    { icon: "📚", title: "RAG Pipelines", desc: "Retrieval-Augmented Generation over your own data — documents, PDFs, databases, APIs, websites.", tags: ["Vector DB", "Embeddings", "Retrieval", "Pinecone"] },
    { icon: "🧠", title: "Multi-Agent Systems", desc: "Orchestrated networks of specialized agents that collaborate, delegate, and verify each other's work.", tags: ["Multi-Agent", "Orchestration", "Delegation", "Verification"] },
    { icon: "💾", title: "Long-Term Memory", desc: "Agents that remember context across sessions — user preferences, past interactions, domain knowledge.", tags: ["Memory", "Context", "Personalization", "Redis"] },
    { icon: "🛠️", title: "Tool & API Use", desc: "Agents that call APIs, browse the web, write and run code, query databases, and take real actions.", tags: ["Web Browse", "Code Exec", "DB Queries", "API Calls"] },
    { icon: "🎯", title: "Custom Fine-tuning", desc: "Domain-specific models fine-tuned on your data for specialized tasks that general LLMs can't handle.", tags: ["Fine-tuning", "OpenAI", "Anthropic", "Custom Models"] },
  ];

  const packages = [
    {
      name: "AI Agent Starter",
      price: "$1,500",
      priceTo: "$2,500",
      delivery: "1 week",
      bestFor: "Indie hackers, MVPs, validating AI ideas",
      color: "from-amber-500 to-yellow-500",
      features: [
        "Single-purpose AI agent",
        "Basic LangChain setup",
        "Simple vector database (1K docs)",
        "Next.js frontend (template)",
        "Firebase Auth + Firestore",
        "Stripe checkout",
        "Vercel deployment",
      ],
    },
    {
      name: "AI Product Core",
      price: "$4,500",
      priceTo: "$7,500",
      delivery: "2–3 weeks",
      bestFor: "Early-stage startups, small SaaS teams",
      color: "from-orange-500 to-amber-500",
      popular: true,
      features: [
        "2 connected AI agents",
        "RAG with multiple document types",
        "Custom Next.js UI",
        "Firebase full backend",
        "Stripe subscriptions + webhooks",
        "Basic user dashboard",
        "14 days post-launch support",
      ],
    },
    {
      name: "Growth AI System",
      price: "$9,000",
      priceTo: "$14,000",
      delivery: "4–6 weeks",
      bestFor: "Seed-stage startups, proven products adding AI",
      color: "from-red-500 to-orange-500",
      features: [
        "Multi-agent system (3–4 agents)",
        "Advanced reasoning workflows",
        "Scalable vector architecture",
        "Complete custom application",
        "Complex Stripe billing",
        "Admin panel + analytics",
        "30 days support",
      ],
    },
  ];

  const comparisons = [
    {
      bad: "Email goes out when form is submitted",
      good: "Agent analyzes request, checks 5 data sources, drafts personalized response, flags if human review needed",
    },
    {
      bad: "Zap data from A to B",
      good: "Synthesize conflicting information and generate novel insights",
    },
    {
      bad: "Chatbot reads your docs and replies",
      good: "Agent reasons about your problem, searches sources, plans, acts, and delivers results",
    },
  ];

  return (
    <Section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" id="agent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl">🤖</div>
            <span className="text-accent font-mono text-xs sm:text-sm font-medium tracking-wider uppercase">// AI Agent</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
            Agents that{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">think, not trigger</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
            I don't do automation. I build intelligence. There's a difference — and it matters enormously.
          </p>
        </div>

        {/* Automation vs Intelligence */}
        <motion.div
          className="mb-16 sm:mb-20 rounded-2xl border border-border bg-surface-card/60 p-6 sm:p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-border p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-text-secondary/10 flex items-center justify-center text-xl">⚙️</div>
                <h3 className="text-lg font-bold text-text-secondary">Automation</h3>
              </div>
              <div className="rounded-lg bg-surface-light/50 border border-border p-4">
                <p className="text-text-secondary font-mono text-sm">"When <span className="text-amber-400">X</span> happens, do <span className="text-amber-400">Y</span>"</p>
              </div>
            </div>
            <div className="rounded-xl border border-accent/30 bg-accent/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-xl">🧠</div>
                <h3 className="text-lg font-bold text-accent">Intelligence</h3>
              </div>
              <div className="rounded-lg bg-accent/5 border border-accent/20 p-4">
                <p className="text-text-primary font-mono text-sm">"Given this <span className="text-accent">complex situation</span>, what's the <span className="text-accent">best action</span>?"</p>
              </div>
            </div>
          </div>

          <h4 className="text-base sm:text-lg font-bold text-text-primary mb-4">Real examples:</h4>
          <div className="space-y-3">
            {comparisons.map((c, i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-4 flex items-start gap-3">
                  <span className="text-red-400 font-bold text-base shrink-0 mt-0.5">✕</span>
                  <p className="text-text-secondary text-sm leading-relaxed">{c.bad}</p>
                </div>
                <div className="rounded-xl border border-green-500/20 bg-green-500/[0.03] p-4 flex items-start gap-3">
                  <span className="text-green-400 font-bold text-base shrink-0 mt-0.5">✓</span>
                  <p className="text-text-primary text-sm leading-relaxed">{c.good}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <span className="text-green-400 font-bold text-xl">80%</span>
              </div>
              <div>
                <p className="text-text-primary font-semibold text-sm">Faster research</p>
                <p className="text-text-secondary text-xs">Time to insight</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl">📊</div>
              <div>
                <p className="text-text-primary font-semibold text-sm">Better decisions</p>
                <p className="text-text-secondary text-xs">Quality of output</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}>
              <GlowCard className="p-5 sm:p-6 h-full" glowColor="amber">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl border border-amber-500/20">{f.icon}</div>
                  <h3 className="font-bold text-text-primary text-sm sm:text-base">{f.title}</h3>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4">{f.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-surface-light text-text-secondary text-[10px] font-mono border border-border">{t}</span>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* AI Agent Pricing */}
        <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">💰 AI Agent Pricing</h3>
        <p className="text-text-secondary text-sm sm:text-base mb-8">Intelligence that scales with your ambition.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10">
          {packages.map((pkg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="relative">
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold z-10 whitespace-nowrap">
                  ⭐ MOST POPULAR
                </div>
              )}
              <GlowCard className={`p-6 sm:p-7 h-full flex flex-col ${pkg.popular ? "border-amber-500/40 ring-1 ring-amber-500/20" : ""}`} glowColor="amber">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${pkg.color} text-white text-xs font-semibold w-fit mb-4`}>{pkg.name}</div>
                <div className="mb-2">
                  <span className="text-2xl sm:text-3xl font-black text-text-primary">{pkg.price}</span>
                  <span className="text-text-secondary text-sm"> – {pkg.priceTo}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-5">
                  <span className="text-green-400">⏱</span>{pkg.delivery} delivery
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-text-secondary"><span className="text-amber-400 font-semibold">Best for:</span> {pkg.bestFor}</p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <a
            href="https://wa.me/212638426738?text=Hi!%20I'm%20interested%20in%20building%20an%20AI%20Agent."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-base sm:text-lg hover:scale-105 transition-all hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]"
          >
            <WaSvg /> Build My AI Agent →
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ─── Combined Pricing Overview ─── */
function PricingOverview() {
  const microServices = [
    { service: "AI Agent Prototype", price: "$750", delivery: "3 days", desc: "Working demo, 1 agent, local setup" },
    { service: "RAG Setup Only", price: "$500", delivery: "2 days", desc: "Vector DB, document ingestion, retrieval" },
    { service: "Stripe AI Billing", price: "$600", delivery: "3 days", desc: "Usage-based billing for AI features" },
    { service: "AI Feature Integration", price: "$800", delivery: "4 days", desc: "Add AI to existing Next.js app" },
    { service: "Agent Debugging", price: "$400", delivery: "2 days", desc: "Fix broken AI, optimize prompts" },
    { service: "Vercel + Firebase Deploy", price: "$350", delivery: "2 days", desc: "Production setup, CI/CD, monitoring" },
  ];

  const hourlyRates = [
    { service: "AI Development", rate: "$75/hr", minimum: "4 hours ($300)" },
    { service: "Code Review", rate: "$65/hr", minimum: "3 hours ($195)" },
    { service: "Consulting", rate: "$85/hr", minimum: "2 hours ($170)" },
    { service: "Bug Fixes", rate: "$75/hr", minimum: "2 hours ($150)" },
  ];

  const retainers = [
    { name: "AI Maintenance Lite", price: "$750", period: "/month", features: ["6 hours development", "Bug fixes & updates", "Basic monitoring", "Email support (48hr)"] },
    { name: "Growth Partner", price: "$1,800", period: "/month", popular: true, features: ["15 hours dedicated", "Feature development", "Performance optimization", "Priority chat support"] },
  ];

  const quickWins = [
    { service: "AI Roadmap Call", price: "$200", desc: "Planning your AI feature" },
    { service: "Tech Stack Review", price: "$250", desc: "Choosing right tools" },
    { service: "Prompt Engineering", price: "$300", desc: "Better AI responses" },
    { service: "Agent Audit Lite", price: "$350", desc: "Quick health check" },
  ];

  return (
    <Section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" id="pricing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 sm:mb-16 text-center">
          <span className="text-accent font-mono text-xs sm:text-sm font-medium tracking-wider uppercase">// Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 text-text-primary tracking-tight">
            Transparent pricing for every stage
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mt-3 sm:mt-4 max-w-2xl mx-auto">
            All services have detailed pricing above. Here are add-ons, micro-services & support options.
          </p>
        </div>

        {/* Service Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16">
          {[
            { icon: "🏗️", title: "SaaS Development", range: "$2,500 – $20,000", href: "#saas", color: "from-blue-500 to-cyan-500" },
            { icon: "📱", title: "Mobile AI App", range: "$3,000 – $25,000", href: "#mobile", color: "from-purple-500 to-pink-500" },
            { icon: "🤖", title: "AI Agent", range: "$1,500 – $14,000", href: "#agent", color: "from-amber-500 to-orange-500" },
          ].map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              className="block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <GlowCard className="p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mx-auto mb-4`}>{s.icon}</div>
                <h3 className="font-bold text-text-primary mb-1">{s.title}</h3>
                <p className={`text-sm font-mono font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.range}</p>
                <p className="text-text-secondary text-xs mt-2">View full details →</p>
              </GlowCard>
            </motion.a>
          ))}
        </div>

        {/* Micro-Services */}
        <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
            🎯 <span>Micro-Services</span>
            <span className="text-sm font-normal text-accent bg-accent/10 px-3 py-1 rounded-full">Under $1,000</span>
          </h3>
          <p className="text-text-secondary text-sm mb-6">Quick wins, fast delivery, fixed price.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {microServices.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                <GlowCard className="p-5 sm:p-6 h-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-semibold text-text-primary text-sm sm:text-base">{item.service}</h4>
                    <span className="text-accent font-bold text-sm sm:text-base whitespace-nowrap">{item.price}</span>
                  </div>
                  <p className="text-text-secondary text-xs sm:text-sm mb-3">{item.desc}</p>
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <span className="text-green-400">⚡</span>{item.delivery}
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hourly Rates */}
        <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">🔧 Hourly Rates</h3>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="hidden sm:grid grid-cols-3 bg-surface-light/50 border-b border-border text-xs font-semibold text-text-secondary uppercase tracking-wider">
              <div className="px-5 py-3">Service</div>
              <div className="px-5 py-3">Rate</div>
              <div className="px-5 py-3">Minimum</div>
            </div>
            {hourlyRates.map((item, i) => (
              <div key={i} className={`grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-0 px-5 py-4 ${i !== hourlyRates.length - 1 ? "border-b border-border" : ""}`}>
                <div className="font-medium text-text-primary text-sm sm:text-base">{item.service}</div>
                <div className="text-accent font-semibold text-sm sm:text-base">{item.rate}</div>
                <div className="text-text-secondary text-sm">{item.minimum}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Retainer Plans */}
        <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">📦 Retainer Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {retainers.map((plan, i) => (
              <motion.div key={i} className="relative" initial={{ opacity: 0, x: i === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-accent to-purple-500 text-white text-xs font-bold z-10">BEST VALUE</div>
                )}
                <GlowCard className={`p-6 sm:p-8 h-full ${plan.popular ? "border-accent/40 ring-1 ring-accent/20" : ""}`}>
                  <h4 className="text-lg sm:text-xl font-bold text-text-primary mb-2">{plan.name}</h4>
                  <div className="mb-5">
                    <span className="text-3xl sm:text-4xl font-black text-accent">{plan.price}</span>
                    <span className="text-text-secondary text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-green-400 mt-0.5 shrink-0">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Wins */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">
            🎁 <span>Quick Wins</span>
            <span className="text-sm font-normal text-green-400 bg-green-400/10 px-3 py-1 rounded-full">Under $500</span>
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickWins.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                <GlowCard className="p-4 sm:p-5 h-full text-center hover:border-green-500/30 transition-colors">
                  <div className="text-xl sm:text-2xl font-black text-green-400 mb-2">{item.price}</div>
                  <h4 className="font-semibold text-text-primary text-sm sm:text-base mb-1">{item.service}</h4>
                  <p className="text-text-secondary text-xs">{item.desc}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div className="mt-12 sm:mt-16 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-text-secondary text-base sm:text-lg mb-6">
            Not sure which fits? <span className="text-text-primary font-semibold">Let's figure it out together.</span>
          </p>
          <a
            href="https://wa.me/212638426738?text=Hi!%20I'm%20interested%20in%20getting%20a%20custom%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold text-base sm:text-lg hover:bg-accent-dark transition-all hover:scale-105"
          >
            <WaSvg /> Get a Custom Quote →
          </a>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─── Tech Stack ─── */
function TechStack() {
  const categories = [
    { label: "AI & LLMs", color: "text-purple-400", tools: [{ name: "LangChain", cat: "AI Framework" }, { name: "LangGraph", cat: "Agent Orchestration" }, { name: "OpenAI", cat: "LLM Provider" }, { name: "Anthropic", cat: "LLM Provider" }, { name: "Vector DBs", cat: "Data Layer" }] },
    { label: "Frontend", color: "text-blue-400", tools: [{ name: "Next.js", cat: "Framework" }, { name: "React Native", cat: "Mobile" }, { name: "Expo", cat: "Mobile Platform" }, { name: "Tailwind CSS", cat: "Styling" }] },
    { label: "Backend & Infra", color: "text-orange-400", tools: [{ name: "Firebase", cat: "Backend" }, { name: "Stripe", cat: "Payments" }, { name: "Vercel", cat: "Deployment" }, { name: "Node.js", cat: "Runtime" }] },
  ];

  return (
    <Section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" id="stack">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-16">
          <span className="text-accent font-mono text-xs sm:text-sm font-medium tracking-wider uppercase">// My stack</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 text-text-primary tracking-tight">Purpose-built toolkit</h2>
          <p className="text-text-secondary text-base sm:text-lg mt-3 sm:mt-4 max-w-xl">Every tool chosen for production, not demos.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, ci) => (
            <motion.div key={ci} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.1, duration: 0.5 }}>
              <div className={`text-xs font-bold uppercase tracking-wider mb-4 ${cat.color}`}>{cat.label}</div>
              <div className="space-y-2">
                {cat.tools.map((tool, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.03, x: 4 }} transition={{ duration: 0.2 }}>
                    <div className="group px-4 py-3 rounded-xl bg-surface-card border border-border hover:border-accent/30 transition-all flex items-center justify-between">
                      <span className="text-text-primary font-semibold text-sm group-hover:text-accent transition-colors">{tool.name}</span>
                      <span className="text-text-secondary text-[10px] font-mono">{tool.cat}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Contact ─── */
function Contact() {
  return (
    <Section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" id="contact">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div className="relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-xl" />
          <div className="relative rounded-2xl sm:rounded-3xl border border-border bg-surface-card/50 backdrop-blur-sm p-8 sm:p-12 lg:p-16">
            <div className="text-4xl sm:text-5xl mb-5 sm:mb-6">⚡</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight mb-4 sm:mb-6 leading-tight">
              Ready to build something{" "}
              <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">intelligent?</span>
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              DM me if you're building a SaaS, Mobile AI app, or AI Agent that needs real cognition — not just triggers.
            </p>
            <a
              href="https://wa.me/212638426738?text=Hi!%20I'm%20interested%20in%20building%20something%20intelligent."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-accent text-white font-bold text-base sm:text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(99,102,241,0.35)]"
            >
              <WaSvg cls="relative z-10 w-5 h-5 sm:w-6 sm:h-6" />
              <span className="relative z-10">Get in Touch →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-dark via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-border py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white font-bold text-[10px]">AC</div>
          <span className="font-semibold text-text-primary text-sm">ACLLC</span>
          <span className="text-text-secondary text-xs ml-2">AI Product Engineer</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          {["#saas", "#mobile", "#agent", "#pricing"].map((href) => (
            <a key={href} href={href} className="hover:text-accent transition-colors capitalize">{href.replace("#", "")}</a>
          ))}
        </div>
        <p className="text-text-secondary text-xs sm:text-sm text-center sm:text-right">
          © {new Date().getFullYear()} ACLLC. Building intelligence.
        </p>
      </div>
    </footer>
  );
}

/* ─── App ─── */
export default function App() {
  return (
    <div className="relative min-h-screen bg-surface overflow-x-hidden">
      <GridBackground />
      <ParticleField />
      <Nav />
      <Hero />
      <ServicesOverview />
      <SaasSection />
      <MobileSection />
      <AgentSection />
      <PricingOverview />
      <TechStack />
      <Contact />
      <Footer />
      <ChatBot />
    </div>
  );
}
