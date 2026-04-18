import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Code, Rocket, Paintbrush, MessageSquare, Shield, CheckCircle2,
} from "lucide-react";
import { SERVICE_OFFERINGS } from "@/data/service-offerings";
import { useState } from "react";

const processSteps = [
  { step: "01", title: "Discovery",  desc: "We learn your business, goals, and audience. Every project starts with understanding what success looks like for you.",                                              icon: MessageSquare },
  { step: "02", title: "Design",     desc: "We create wireframes and visual designs that match your brand. You approve every detail before a single line of code is written.",                                   icon: Paintbrush    },
  { step: "03", title: "Build",      desc: "Custom code, not templates. We hand-build your site for speed, accessibility, and SEO — tested on every device.",                                                   icon: Code          },
  { step: "04", title: "Launch",     desc: "We handle deployment, DNS, SSL, analytics setup, and everything else. You just share the link.",                                                                    icon: Rocket        },
  { step: "05", title: "Ongoing",    desc: "Monthly plans cover maintenance, security patches, content updates, performance monitoring, and ongoing SEO.",                                                      icon: Shield        },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const active = SERVICE_OFFERINGS[activeTab];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950" />
        <div className="absolute inset-0 dot-grid-bg opacity-60" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 22 }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
              Services
            </span>
            <h1
              className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white"
              style={{ letterSpacing: "-0.03em" }}
              data-testid="text-services-title"
            >
              Our Services
            </h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              From design to deployment and beyond — everything your business needs to succeed online.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Services Panel ────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-center">

            {/* Left — stable sidebar nav */}
            <div className="relative rounded-2xl border border-slate-200/80 dark:border-white/8 bg-slate-50/80 dark:bg-zinc-900/80 p-5 sticky top-24">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 dark:via-indigo-700/40 to-transparent" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-4 px-1">
                All Services
              </h3>
              <ul className="space-y-0.5">
                {SERVICE_OFFERINGS.map((service, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setActiveTab(i)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 ${
                        activeTab === i
                          ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                          : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white"
                      }`}
                      data-testid={`tab-service-${i}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        activeTab === i
                          ? "bg-indigo-100 dark:bg-indigo-900/50"
                          : "bg-slate-100 dark:bg-zinc-800"
                      }`}>
                        <service.icon className={`w-4 h-4 ${activeTab === i ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`} />
                      </div>
                      <span className="text-sm font-medium leading-snug">{service.title}</span>
                      {activeTab === i && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — animated service detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 200, damping: 24 }}
                className="relative rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-zinc-900/80 p-8 md:p-10"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 dark:via-indigo-700/40 to-transparent" />

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                  <active.icon className="w-7 h-7 text-white" />
                </div>

                <h2
                  className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-5"
                  style={{ letterSpacing: "-0.025em" }}
                  data-testid="text-service-title"
                >
                  {active.title}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base mb-8">
                  {active.description}
                </p>

                <Link href="/contact">
                  <Button
                    className="shimmer-btn bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
                    data-testid="button-service-cta"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* ── Monthly Plans ─────────────────────────────────── */}
      <section className="py-20 bg-slate-50/70 dark:bg-zinc-900/40 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid-bg opacity-50" />
        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 90, damping: 22 }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
              Monthly Plans
            </span>
            <h2
              className="text-4xl font-extrabold text-slate-900 dark:text-white"
              style={{ letterSpacing: "-0.025em" }}
              data-testid="text-plans-title"
            >
              Always Supported
            </h2>
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              We don't just build your site and disappear. Our monthly plans keep your website secure, fast, and up to date.
            </p>
          </motion.div>

          <motion.div
            className="relative max-w-3xl mx-auto rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-zinc-900/80 p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 22 }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              Every monthly plan includes:
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Security monitoring & updates",
                "Performance optimization",
                "Regular backups",
                "Content & copy updates",
                "Bug fixes & small edits",
                "Uptime monitoring",
                "SSL certificate management",
                "SEO & analytics reports",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 pt-5 border-t border-slate-100 dark:border-white/8">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Plans are tailored to your needs.{" "}
                <Link href="/contact">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">
                    Contact us
                  </span>
                </Link>{" "}
                for a custom quote based on your site's requirements.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Process Timeline ──────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 90, damping: 22 }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
              How It Works
            </span>
            <h2
              className="text-4xl font-extrabold text-slate-900 dark:text-white"
              style={{ letterSpacing: "-0.025em" }}
              data-testid="text-process-title"
            >
              Our Process
            </h2>
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
              From first conversation to long-term support.
            </p>
          </motion.div>

          <div className="space-y-0">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                className="relative flex gap-6 pb-10 last:pb-0"
                data-testid={`item-process-${i}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 90, damping: 22 }}
              >
                {i < processSteps.length - 1 && (
                  <div className="absolute left-[22px] top-12 bottom-0 w-px bg-gradient-to-b from-indigo-300 dark:from-indigo-700 to-slate-100 dark:to-zinc-800" />
                )}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 pt-1.5">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Step {step.step}
                    </span>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cta" />
        <div className="absolute inset-0 dot-grid-bg opacity-15" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-3"
            style={{ letterSpacing: "-0.025em" }}
          >
            Let's Build Something Great
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Tell us about your project and we'll put together a plan that fits.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="shimmer-btn bg-white text-indigo-700 hover:bg-indigo-50 border-0 shadow-lg font-semibold hover:-translate-y-0.5 transition-all"
              data-testid="button-services-cta"
            >
              Start Your Project
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
