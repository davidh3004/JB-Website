import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Users, Zap, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    icon: ShieldCheck,
    title: "Reliability",
    desc: "We deliver on time, every time. Your business depends on your website, and we take that seriously. When we say it'll be done, it's done.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "Speed",
    desc: "Fast websites, fast communication, fast turnaround. We value your time as much as ours and build sites that load in a blink.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    desc: "No jargon, no ghosting. We keep you in the loop at every stage and explain things in plain language. You always know where your project stands.",
    color: "from-violet-500 to-indigo-600",
  },
  {
    icon: Users,
    title: "Long-Term Support",
    desc: "We're in it for the long run. Our monthly plans mean you're never left managing your own website. We handle the technical stuff so you can focus on your business.",
    color: "from-indigo-500 to-purple-600",
  },
];

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,   transition: { type: "spring" as const, stiffness: 90, damping: 20 } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

export default function About() {
  const { data: settings } = useQuery<any>({ queryKey: ["/api/settings"] });
  const customAboutText = settings?.aboutText || "";
  const paragraphs = customAboutText ? customAboutText.split("\n").filter(Boolean) : [
    "JB Websites was founded with a clear mission: give small and medium businesses access to the same quality web development that enterprise companies get — without the enterprise price tag or the corporate runaround.",
    "Too many businesses settle for cookie-cutter templates that look like everyone else. We believe your website should be as unique as your business. That's why every project we take on is custom-coded from scratch, designed specifically for your brand, and built to perform.",
    "We don't just launch and leave. Our monthly plans mean you always have a team behind your website — handling security, updates, SEO, and any changes you need. Think of us as your in-house web team, without the overhead."
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950" />
        <div className="absolute inset-0 dot-grid-bg opacity-60" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 80, damping: 22 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">About Us</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white" style={{ letterSpacing: "-0.03em" }} data-testid="text-about-title">
              About JB Websites
            </h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              We're a web agency built on one idea: businesses deserve better websites.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 22 }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4" data-testid="text-story-title">
              Our Story
            </span>

            {/* Pull quote */}
            <blockquote className="relative border-l-4 border-indigo-500 pl-6 mb-8">
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-snug" style={{ letterSpacing: "-0.015em" }}>
                "Give small businesses access to the same web quality that enterprise companies get — without the enterprise price tag."
              </p>
            </blockquote>

            <div className="space-y-5 text-slate-500 dark:text-slate-400 leading-relaxed">
              {paragraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────── */}
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Our Values</span>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white" style={{ letterSpacing: "-0.025em" }} data-testid="text-values-title">
              What Drives Us
            </h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {values.map((value, i) => (
              <motion.div
                key={i}
                variants={cardReveal}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-zinc-900/80 p-7"
                data-testid={`card-value-${i}`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/4 to-blue-500/4" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
                </div>

                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20`}>
                  <value.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── What Makes Us Different ───────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, damping: 22 }}
            >
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">What Makes Us Different</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-5" style={{ letterSpacing: "-0.025em" }} data-testid="text-different-title">
                Direct Access to the People Building Your Site
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                We're not a big agency with account managers and layers of bureaucracy. When you work with us, you work directly with the people building your site. That means faster decisions, better communication, and a final product that actually matches your vision.
              </p>
              <div className="space-y-3">
                {[
                  "No middlemen — straight to the developers",
                  "Transparent pricing and honest timelines",
                  "You own everything — code, domain, content",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="shimmer-btn bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
                    data-testid="button-about-cta"
                  >
                    Let's Work Together
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right visual */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: "spring", stiffness: 80, damping: 22 }}
              className="relative hidden lg:block"
            >
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-zinc-900 shadow-xl p-8 space-y-5">
                {[
                  { label: "Response time",   value: "< 2 hours",   bar: 90, color: "from-indigo-500 to-blue-500"  },
                  { label: "On-time delivery",value: "100%",        bar: 100, color: "from-blue-500 to-cyan-500"   },
                  { label: "Client retention",value: "95%",         bar: 95, color: "from-violet-500 to-indigo-500"},
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{stat.label}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{stat.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.bar}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 + 0.3, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
