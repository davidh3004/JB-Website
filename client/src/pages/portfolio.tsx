import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Monitor, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Project } from "@shared/schema";

export default function Portfolio() {
  const { data: projects, isLoading } = useQuery<Project[]>({ queryKey: ["/api/projects"] });
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set((projects || []).map((p) => p.category)))];
  const filtered = activeFilter === "all" ? projects || [] : (projects || []).filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/10 dark:to-background">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white" data-testid="text-portfolio-title">Our Work</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Real projects. Real results. Browse the sites we've built for businesses like yours.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10 justify-center" data-testid="filter-categories">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeFilter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(cat)}
                  data-testid={`button-filter-${cat}`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
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
                      {project.liveUrl && (
                        <div className="mt-3 flex items-center gap-1 text-sm text-blue-600">
                          <ExternalLink className="w-3 h-3" />
                          <span>View Live Site</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">
              <Monitor className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No projects found</p>
              <p className="text-sm mt-1">Check back soon for new work.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Like What You See?</h2>
          <p className="text-lg text-blue-100 mb-8">Let's talk about building something just as great for your business.</p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="bg-white text-blue-700 border-white" data-testid="button-portfolio-cta">
              Get a Free Quote
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
