import { Link } from "wouter";
import {
  ArrowRight, Search, Zap, Shield, Clock, Headphones,
  CheckCircle2, Monitor, Palette, BarChart3, Sparkles,
  Star, TrendingUp, Code2, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Project, SiteSettings } from "@shared/schema";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { SERVICE_OFFERINGS } from "@/data/service-offerings";

/* ─── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { type: "spring", stiffness: 80, damping: 22 } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,   transition: { type: "spring", stiffness: 90, damping: 20 } },
};

/* ─── Animated counter ───────────────────────────────────── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1400;
    const step = 16;
    const increment = (target / (duration / step));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Bento service card ─────────────────────────────────── */
function BentoCard({
  item, span, delay = 0,
}: {
  item: typeof SERVICE_OFFERINGS[0];
  span?: "wide" | "tall" | "normal";
  delay?: number;
}) {
  return (
    <motion.div
      variants={cardReveal}
      custom={delay}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-zinc-900/80 p-6 cursor-pointer ${
        span === "wide" ? "sm:col-span-2" : span === "tall" ? "sm:row-span-2" : ""
      }`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
      </div>

      <motion.div
        className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25"
        whileHover={{ scale: 1.1, rotate: -6 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      >
        <item.icon className="w-5 h-5 text-white" />
      </motion.div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 leading-snug">{item.title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{item.description}</p>

      <Link href="/services">
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200">
          Learn more <ArrowRight className="w-3 h-3" />
        </span>
      </Link>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function Home() {
  const { data: settings } = useQuery<SiteSettings>({ queryKey: ["/api/settings"] });
  const { data: projects }  = useQuery<Project[]>({ queryKey: ["/api/projects/featured"] });

  const headline    = settings?.heroHeadline    || "Websites That Actually Work for Your Business";
  const subheadline = settings?.heroSubheadline || "Custom-coded, SEO-ready websites built to convert visitors into customers. No templates. No shortcuts.";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <Navbar />
      <div className="flex-1 min-w-0 overflow-x-clip">

        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-16 pb-20">

          {/* Background gradient mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950/20" />

          {/* Dot grid */}
          <div className="absolute inset-0 dot-grid-bg opacity-100" />

          {/* Floating orbs */}
          <motion.div
            className="glow-orb absolute top-1/4 right-[-5%] w-[480px] h-[480px] rounded-full bg-indigo-500/20 dark:bg-indigo-500/15"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="glow-orb absolute bottom-0 left-[-5%] w-[360px] h-[360px] rounded-full bg-blue-500/15 dark:bg-blue-600/12"
            animate={{ scale: [1.05, 1, 1.05], y: [0, 20, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="glow-orb absolute top-1/3 left-1/3 w-[240px] h-[240px] rounded-full bg-cyan-400/10 dark:bg-cyan-500/8"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative max-w-6xl mx-auto px-6 text-center w-full">
            {/* Badge */}
            {/* <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 mb-8"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 tracking-wide" data-testid="text-hero-badge">
                Now accepting new projects
              </span>
            </motion.div> */}

            {/* Headline */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-white max-w-4xl mx-auto mt-8 mb-6"
              style={{ letterSpacing: "-0.03em" }}
              data-testid="text-hero-headline"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, type: "spring", stiffness: 80, damping: 22 }}
            >
              {headline.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="gradient-text-hero">
                {headline.split(" ").slice(-2).join(" ")}
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              className="mt-2 text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
              data-testid="text-hero-subheadline"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, type: "spring", stiffness: 80, damping: 22 }}
            >
              {subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-3 mt-10"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, type: "spring", stiffness: 100, damping: 22 }}
            >
              <Link href="/contact">
                <Button
                  size="lg"
                  className="shimmer-btn h-12 px-7 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 text-sm font-semibold"
                  data-testid="button-hero-quote"
                >
                  Get a Free Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-7 border-slate-200 dark:border-white/12 bg-white/60 dark:bg-white/5 backdrop-blur-sm hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 shadow-sm hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium"
                  data-testid="button-hero-work"
                >
                  View Our Work
                </Button>
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div
              className="flex items-center justify-center gap-6 mt-12 text-slate-400 dark:text-slate-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {["No templates", "Custom-coded", "Built to convert"].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── STATS STRIP ───────────────────────────────────── */}
        <section className="py-12 bg-slate-950 dark:bg-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/50 via-slate-950 to-blue-950/50 dark:from-indigo-950/30 dark:via-zinc-900 dark:to-blue-950/30" />
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                { value: 50, suffix: "+",  label: "Projects Delivered",    icon: TrendingUp },
                { value: 100, suffix: "%", label: "Custom-Coded, Always",  icon: Code2      },
                { value: 5,  suffix: "★",  label: "Client Satisfaction",   icon: Star       },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 90, damping: 22 }}
                >
                  <stat.icon className="w-5 h-5 text-indigo-400 mb-2" />
                  <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight" style={{ letterSpacing: "-0.03em" }}>
                    <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-sm text-slate-400 mt-1">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES BENTO GRID ───────────────────────────── */}
        <section className="py-20 md:py-28 bg-slate-50/50 dark:bg-zinc-950 relative">
          <div className="absolute inset-0 dot-grid-bg opacity-40 dark:opacity-100" />
          <div className="relative max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 90, damping: 22 }}
            >
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
                What We Offer
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white" style={{ letterSpacing: "-0.025em" }} data-testid="text-whatwedo-title">
                Full-Funnel Digital Services
              </h2>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                From social media to AI automation — everything your business needs to grow online.
              </p>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              {SERVICE_OFFERINGS.map((item, i) => (
                <BentoCard key={item.title} item={item} span={i === 0 ? "wide" : "normal"} delay={i} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ───────────────────────────────── */}
        <section className="py-20 md:py-28 bg-white dark:bg-zinc-900/50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-800/40 to-transparent" />
          <div className="max-w-6xl mx-auto px-6 relative">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 90, damping: 22 }}
            >
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
                Every Project
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white" style={{ letterSpacing: "-0.025em" }} data-testid="text-included-title">
                What's Included
              </h2>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                No hidden fees, no surprises. Every project ships with our complete support package.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: Monitor,      text: "Responsive, mobile-first design"  },
                { icon: Zap,          text: "Performance-optimized code"        },
                { icon: Search,       text: "SEO foundations built in"          },
                { icon: Shield,       text: "Security & SSL setup"              },
                { icon: Clock,        text: "Ongoing maintenance plans"         },
                { icon: Palette,      text: "Brand-aligned custom design"       },
                { icon: BarChart3,    text: "Analytics integration"             },
                { icon: Headphones,   text: "Dedicated support"                 },
                { icon: CheckCircle2, text: "Monthly updates & backups"         },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-700/60 hover:bg-indigo-50/50 dark:hover:bg-zinc-800 transition-all duration-200 group"
                  data-testid={`item-included-${i}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.05, type: "spring", stiffness: 100, damping: 22 }}
                  whileHover={{ x: 3 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                    <item.icon className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED WORK ─────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-slate-50/50 dark:bg-zinc-950 relative">
          <div className="absolute inset-0 dot-grid-bg opacity-40 dark:opacity-100" />
          <div className="relative max-w-6xl mx-auto px-6">
            <motion.div
              className="flex flex-wrap items-end justify-between gap-4 mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 90, damping: 22 }}
            >
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
                  Portfolio
                </span>
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white" style={{ letterSpacing: "-0.025em" }} data-testid="text-featured-title">
                  Featured Work
                </h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">A selection of projects we're proud of.</p>
              </div>
              <Link href="/portfolio">
                <Button
                  variant="outline"
                  className="border-slate-200 dark:border-white/12 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                  data-testid="button-view-all"
                >
                  View All Projects
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(projects || []).slice(0, 6).map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 90, damping: 22 }}
                  whileHover={{ y: -6 }}
                >
                  <Link href={`/portfolio/${project.slug}`}>
                    <div
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-zinc-900 cursor-pointer h-full shadow-sm hover:shadow-card-hover dark:hover:shadow-card-dark transition-all duration-300"
                      data-testid={`card-project-${project.id}`}
                    >
                      {/* Cover image */}
                      <div className="aspect-video bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                        {project.coverImageUrl ? (
                          <img
                            src={project.coverImageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-950/40 dark:to-blue-950/40">
                            <Globe className="w-10 h-10 text-indigo-400" />
                          </div>
                        )}
                        {/* Hover reveal overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-sm text-white font-medium flex items-center gap-1.5">
                            View Project <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(project.tags || []).slice(0, 3).map((tag, ti) => (
                            <span key={ti} className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-semibold text-base text-slate-900 dark:text-white">{project.title}</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{project.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {(!projects || projects.length === 0) && (
              <div className="text-center py-16 text-slate-400">
                <Globe className="w-16 h-16 mx-auto mb-4 opacity-25" />
                <p className="text-lg font-medium">Projects coming soon</p>
              </div>
            )}
          </div>
        </section>

        {/* ── WHY JB WEBSITES ───────────────────────────────── */}
        <section className="py-20 md:py-28 bg-white dark:bg-zinc-900/50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-800/40 to-transparent" />
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: feature list */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 80, damping: 22 }}
              >
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
                  Why Choose Us
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8" style={{ letterSpacing: "-0.025em" }} data-testid="text-why-title">
                  Why JB Websites
                </h2>
                <div className="space-y-5">
                  {[
                    { title: "No Templates",       desc: "Every line of code is written specifically for you. Your site won't look like anyone else's."              },
                    { title: "Built for Speed",    desc: "Fast-loading pages that keep visitors engaged and rank higher on Google — no fluff, pure performance."  },
                    { title: "Always Supported",   desc: "Monthly plans cover maintenance, security, backups, and content updates. We're your long-term partner." },
                    { title: "Growth-Ready",       desc: "As your business evolves, your website scales with it. We build for the long run from day one."          },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-4"
                      data-testid={`item-why-${i}`}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, type: "spring", stiffness: 100, damping: 22 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-indigo-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5">{item.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right: browser window mock */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, type: "spring", stiffness: 80, damping: 22 }}
                className="relative"
              >
                <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-zinc-800/50">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="flex-1 mx-3 h-5 rounded bg-slate-200 dark:bg-zinc-700 flex items-center px-3">
                      <span className="text-[9px] text-slate-400 dark:text-slate-500">yourbusiness.com</span>
                    </div>
                  </div>
                  {/* Mock content */}
                  <div className="p-6 space-y-4">
                    <div className="h-6 w-2/3 rounded-md bg-gradient-to-r from-indigo-200 to-blue-200 dark:from-indigo-900/60 dark:to-blue-900/60" />
                    <div className="h-3 w-full rounded bg-slate-100 dark:bg-zinc-800" />
                    <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-zinc-800" />
                    <div className="h-3 w-3/5 rounded bg-slate-100 dark:bg-zinc-800" />
                    <div className="grid grid-cols-3 gap-2 mt-6">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-950/40 dark:to-blue-950/40" />
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 w-28 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500" />
                      <div className="h-8 w-28 rounded-lg bg-slate-100 dark:bg-zinc-800" />
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-xl p-3 shadow-lg flex items-center gap-2"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">+240%</p>
                    <p className="text-[10px] text-slate-400">Organic traffic</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA SECTION ───────────────────────────────────── */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-cta" />
          <div className="absolute inset-0 dot-grid-bg opacity-15" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_60%)]"
            animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-200 mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Let's Work Together
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ letterSpacing: "-0.025em" }} data-testid="text-cta-title">
                Ready to Upgrade Your Online Presence?
              </h2>
              <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Let's talk about your project. Get a free, no-obligation quote and see what a custom-coded website can do for your business.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="shimmer-btn h-12 px-8 bg-white text-indigo-700 hover:bg-indigo-50 border-0 shadow-lg font-semibold hover:-translate-y-0.5 transition-all duration-200"
                    data-testid="button-cta-quote"
                  >
                    Get Your Free Quote
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 border-white/30 text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    See Our Work
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
