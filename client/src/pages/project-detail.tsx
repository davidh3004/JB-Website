import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, ExternalLink, Monitor } from "lucide-react";
import type { Project, ProjectImage } from "@shared/schema";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useQuery<Project & { images: ProjectImage[] }>({ queryKey: ["/api/projects", slug] });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <Monitor className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Project Not Found</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">This project doesn't exist or has been removed.</p>
          <Link href="/portfolio">
            <Button variant="outline">Back to Portfolio</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href="/portfolio">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back-portfolio">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Portfolio
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
              {project.coverImageUrl ? (
                <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Monitor className="w-16 h-16" />
                </div>
              )}
            </div>

            {project.images && project.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {project.images.map((img) => (
                  <div key={img.id} className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                    <img src={img.url} alt={img.altText || project.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(project.tags || []).map((tag, i) => (
                  <span key={i} className="text-xs font-medium px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3" data-testid="text-project-title">{project.title}</h1>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed" data-testid="text-project-description">{project.description}</p>
            </div>

            <Card className="p-5 dark:border-white/15">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Project Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Category</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{project.category}</span>
                </div>
                {project.liveUrl && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Live Site</span>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 flex items-center gap-1 hover:underline" data-testid="link-live-site">
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </Card>

            <Link href="/contact">
              <Button className="w-full mt-5" data-testid="button-project-quote">
                Start a Similar Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
