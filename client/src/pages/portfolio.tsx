import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Globe, ExternalLink, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@shared/schema";

const cardReveal = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0,   transition: { type: "spring" as const, stiffness: 90, damping: 22 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function Portfolio() {
  const { data: projects, isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set((projects || []).map((p) => p.category)))];
  const filtered   = activeFilter === "all" ? projects || [] : (projects || []).filter((p) => p.category === activeFilter);

  const catLabel = (cat: string) =>
    cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950" />
        <div className="absolute inset-0 dot-grid-bg opacity-60" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 80, damping: 22 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Portfolio</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white" style={{ letterSpacing: "-0.03em" }} data-testid="text-portfolio-title">
              Our Work
            </h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Real projects. Real results. Browse the sites we've built for businesses like yours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Projects Grid ─────────────────────────────────── */}
      <section className="py-12 pb-24 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">

          {/* Filter pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10 justify-center" data-testid="filter-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    activeFilter === cat
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25"
                      : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                  data-testid={`button-filter-${cat}`}
                >
                  {catLabel(cat)}
                </button>
              ))}
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-200/80 dark:border-white/8 overflow-hidden bg-white dark:bg-zinc-900 animate-pulse">
                  <div className="aspect-video bg-slate-100 dark:bg-zinc-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full w-full" />
                    <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Populated grid */}
          {!isLoading && filtered.length > 0 && (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {filtered.map((project) => (
                <motion.div key={project.id} variants={cardReveal} whileHover={{ y: -6 }}>
                  <Link href={`/portfolio/${project.slug}`}>
                    <div
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-zinc-900 cursor-pointer shadow-sm hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-300"
                      data-testid={`card-project-${project.id}`}
                    >
                      {/* Cover */}
                      <div className="aspect-video bg-slate-100 dark:bg-zinc-800 overflow-hidden relative">
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
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-sm text-white font-semibold flex items-center gap-1.5">
                            View Project <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      {/* Info */}
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
                        {project.liveUrl && (
                          <div className="mt-3 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            <ExternalLink className="w-3 h-3" />
                            View Live Site
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-24">
              <Globe className="w-16 h-16 mx-auto mb-4 text-slate-200 dark:text-zinc-700" />
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400">No projects found</p>
              <p className="text-sm mt-1 text-slate-400 dark:text-slate-500">Check back soon for new work.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cta" />
        <div className="absolute inset-0 dot-grid-bg opacity-15" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ letterSpacing: "-0.025em" }}>Like What You See?</h2>
          <p className="text-lg text-indigo-100 mb-8">Let's talk about building something just as great for your business.</p>
          <Link href="/contact">
            <Button size="lg" className="shimmer-btn bg-white text-indigo-700 hover:bg-indigo-50 border-0 shadow-lg font-semibold hover:-translate-y-0.5 transition-all" data-testid="button-portfolio-cta">
              Get a Free Quote
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
