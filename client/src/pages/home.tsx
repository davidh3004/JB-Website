import { Link } from "wouter";
import { ArrowRight, Code, Search, Zap, Shield, Clock, Headphones, CheckCircle2, Monitor, Palette, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Project, SiteSettings } from "@shared/schema";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  const { data: settings } = useQuery<SiteSettings>({ queryKey: ["/api/settings"] });
  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/projects/featured"] });

  const headline = settings?.heroHeadline || "Websites That Actually Work for Your Business";
  const subheadline = settings?.heroSubheadline || "Custom-coded, SEO-ready websites built to convert visitors into customers. No templates. No shortcuts.";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-50/60 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300" data-testid="text-hero-badge">Now accepting new projects</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight max-w-4xl mx-auto" data-testid="text-hero-headline">
            {headline}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-subheadline">
            {subheadline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link href="/contact">
              <Button size="lg" data-testid="button-hero-quote">
                Get a Free Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="outline" size="lg" data-testid="button-hero-work">
                View Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white" data-testid="text-whatwedo-title">What We Do</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need to establish a powerful online presence.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Code,
                title: "Custom Web Development",
                description: "Hand-coded websites built from scratch. No templates, no page builders — just clean, fast, custom code tailored to your brand and goals.",
              },
              {
                icon: Search,
                title: "SEO Foundations",
                description: "Every site ships with technical SEO best practices built in. Need ongoing local SEO? We offer that too — so your customers can actually find you.",
              },
              {
                icon: Zap,
                title: "Integrations & Tools",
                description: "Square payments, Vagaro or Calendly booking, CRMs, analytics — we connect the tools that keep your business running smoothly.",
              },
            ].map((item, i) => (
              <Card key={i} className="p-8 hover-elevate transition-all duration-300 group" data-testid={`card-service-${i}`}>
                <div className="w-12 h-12 rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-blue-50/50 dark:bg-blue-950/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white" data-testid="text-included-title">What's Included</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Every project comes with our full support package — no hidden fees, no surprises.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Monitor, text: "Responsive, mobile-first design" },
              { icon: Zap, text: "Performance-optimized code" },
              { icon: Search, text: "SEO foundations built in" },
              { icon: Shield, text: "Security & SSL setup" },
              { icon: Clock, text: "Ongoing maintenance plans" },
              { icon: Palette, text: "Brand-aligned custom design" },
              { icon: BarChart3, text: "Analytics integration" },
              { icon: Headphones, text: "Dedicated support" },
              { icon: CheckCircle2, text: "Monthly updates & backups" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-md bg-white dark:bg-card" data-testid={`item-included-${i}`}>
                <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-slate-700 dark:text-slate-200 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white" data-testid="text-featured-title">Featured Work</h2>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">A selection of projects we're proud of.</p>
            </div>
            <Link href="/portfolio">
              <Button variant="outline" data-testid="button-view-all">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(projects || []).slice(0, 6).map((project) => (
              <Link key={project.id} href={`/portfolio/${project.slug}`}>
                <Card className="overflow-visible hover-elevate transition-all duration-300 cursor-pointer group" data-testid={`card-project-${project.id}`}>
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-t-md overflow-hidden">
                    {project.coverImageUrl ? (
                      <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Monitor className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(project.tags || []).slice(0, 3).map((tag, ti) => (
                        <span key={ti} className="text-xs font-medium px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{project.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{project.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          {(!projects || projects.length === 0) && (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400">
              <Monitor className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Projects coming soon</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-blue-50/50 dark:bg-blue-950/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white" data-testid="text-why-title">Why JB Websites</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We're not another agency. We're your long-term web partner.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { title: "No Templates", desc: "Every line of code is written for you. Your site won't look like anyone else's." },
              { title: "Built for Speed", desc: "Fast-loading pages that keep visitors engaged and rank higher on Google." },
              { title: "Always Supported", desc: "Monthly plans cover maintenance, security, backups, and content updates." },
              { title: "Growth-Ready", desc: "As your business evolves, your website evolves with it. We scale with you." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4" data-testid={`item-why-${i}`}>
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="text-cta-title">Ready to Upgrade Your Online Presence?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's talk about your project. Get a free, no-obligation quote and see what a custom-coded website can do for your business.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="bg-white text-blue-700 border-white" data-testid="button-cta-quote">
              Get Your Free Quote
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
