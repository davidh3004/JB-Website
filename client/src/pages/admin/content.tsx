import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Save, Plus, Pencil, Trash2, ExternalLink, Globe, Upload,
  Layout, Briefcase, Settings, MonitorSpeaker,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { Project, SiteSettings } from "@shared/schema";

/* ─── Tabs ───────────────────────────────────────────────── */
const tabs = [
  { id: "hero",     label: "Hero & Home",  icon: Layout        },
  { id: "projects", label: "Projects",     icon: Briefcase     },
  { id: "general",  label: "General Info", icon: Settings      },
];

/* ─── Hero tab ───────────────────────────────────────────── */
function HeroTab() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<SiteSettings>({ queryKey: ["/api/admin/settings"] });

  const [heroHeadline,    setHeroHeadline]    = useState("");
  const [heroSubheadline, setHeroSubheadline] = useState("");
  const [aboutText,       setAboutText]       = useState("");

  useEffect(() => {
    if (settings) {
      setHeroHeadline(settings.heroHeadline || "");
      setHeroSubheadline(settings.heroSubheadline || "");
      setAboutText(settings.aboutText || "");
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/admin/settings", { heroHeadline, heroSubheadline, aboutText });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Hero content saved ✓" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}</div>;

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Hero Section</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Edit the main headline text on your home page.</p>
        </div>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0">
          <Save className="mr-2 w-4 h-4" />
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card className="p-6 border-slate-200/60 dark:border-white/8 bg-white dark:bg-zinc-900/60 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5 block">Hero Headline</label>
          <Input
            value={heroHeadline}
            onChange={e => setHeroHeadline(e.target.value)}
            placeholder="Websites That Actually Work for Your Business"
            className="border-slate-200 dark:border-white/10"
            data-testid="input-hero-headline"
          />
          <p className="text-xs text-slate-400 mt-1">The last 2 words will be highlighted with a gradient.</p>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5 block">Hero Subheadline</label>
          <Textarea
            value={heroSubheadline}
            onChange={e => setHeroSubheadline(e.target.value)}
            placeholder="Custom-coded, SEO-ready websites built to convert visitors into customers."
            rows={3}
            className="border-slate-200 dark:border-white/10 resize-none"
            data-testid="input-hero-subheadline"
          />
        </div>
      </Card>

      <Card className="p-6 border-slate-200/60 dark:border-white/8 bg-white dark:bg-zinc-900/60">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5 block">About Section Text</label>
        <Textarea
          value={aboutText}
          onChange={e => setAboutText(e.target.value)}
          rows={5}
          placeholder="Your about text..."
          className="border-slate-200 dark:border-white/10 resize-none"
          data-testid="input-about-text"
        />
      </Card>

      {/* Preview */}
      <Card className="p-6 border-slate-200/60 dark:border-white/8 bg-slate-50/80 dark:bg-zinc-800/40">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <MonitorSpeaker className="w-3.5 h-3.5" /> Preview
        </p>
        <div className="font-extrabold text-2xl text-slate-900 dark:text-white leading-tight">
          {heroHeadline.split(" ").slice(0, -2).join(" ")}{" "}
          <span className="gradient-text">{heroHeadline.split(" ").slice(-2).join(" ") || "Your Business"}</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{heroSubheadline}</p>
      </Card>
    </div>
  );
}

/* ─── Projects tab ───────────────────────────────────────── */
interface ProjectFormData {
  title: string; slug: string; category: string;
  description: string; tags: string; liveUrl: string; published: boolean;
}

function ProjectsTab() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen]       = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { data: projects, isLoading } = useQuery<Project[]>({ queryKey: ["/api/admin/projects"] });

  const form = useForm<ProjectFormData>({
    defaultValues: { title: "", slug: "", category: "website", description: "", tags: "", liveUrl: "", published: false },
  });

  const openCreate = () => {
    setEditingProject(null);
    form.reset({ title: "", slug: "", category: "website", description: "", tags: "", liveUrl: "", published: false });
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    form.reset({ title: project.title, slug: project.slug, category: project.category, description: project.description, tags: (project.tags || []).join(", "), liveUrl: project.liveUrl || "", published: project.published });
    setDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const payload = { ...data, tags: data.tags.split(",").map(t => t.trim()).filter(Boolean), slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") };
      if (editingProject) await apiRequest("PATCH", `/api/admin/projects/${editingProject.id}`, payload);
      else await apiRequest("POST", "/api/admin/projects", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/featured"] });
      setDialogOpen(false);
      toast({ title: editingProject ? "Project updated ✓" : "Project created ✓" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/admin/projects/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects/featured"] });
      toast({ title: "Project deleted" });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData(); formData.append("image", file);
      const res = await apiRequest("POST", `/api/admin/projects/${id}/cover`, formData);
      if (!res.ok) throw new Error("Upload failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Cover image uploaded ✓" });
    },
  });

  const handleUpload = (project: Project) => {
    const input = document.createElement("input"); input.type = "file"; input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) uploadMutation.mutate({ id: project.id, file }); };
    input.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Portfolio Projects</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your portfolio projects visible on the public site.</p>
        </div>
        <Button onClick={openCreate} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0" data-testid="button-create-project">
          <Plus className="mr-2 w-4 h-4" /> New Project
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">{[1,2,3].map(i => <Card key={i} className="p-4 animate-pulse border-slate-200/60 dark:border-white/8"><div className="h-12 bg-slate-100 dark:bg-zinc-800 rounded-lg" /></Card>)}</div>
      )}

      {!isLoading && projects && projects.length > 0 && (
        <div className="space-y-2.5">
          {projects.map((project) => (
            <Card key={project.id} className="p-4 border-slate-200/60 dark:border-white/8 bg-white dark:bg-zinc-900/60 hover:border-indigo-200 dark:hover:border-indigo-900/40 transition-colors" data-testid={`card-admin-project-${project.id}`}>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-12 rounded-lg bg-slate-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleUpload(project)}
                  title="Click to upload cover image"
                >
                  {project.coverImageUrl ? (
                    <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-zinc-600">
                      <Upload className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="font-medium text-slate-900 dark:text-white text-sm truncate">{project.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${project.published ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300" : "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-slate-400"}`}>
                      {project.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-zinc-500 capitalize">{project.category}</span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 truncate">{project.description || "No description"}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost" className="w-8 h-8"><ExternalLink className="w-3.5 h-3.5" /></Button>
                    </a>
                  )}
                  <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => openEdit(project)} data-testid={`button-edit-project-${project.id}`}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="w-8 h-8 hover:text-red-500" onClick={() => { if (confirm("Delete this project?")) deleteMutation.mutate(project.id); }} data-testid={`button-delete-project-${project.id}`}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && (!projects || projects.length === 0) && (
        <Card className="p-12 text-center border-slate-200/60 dark:border-white/8 bg-white dark:bg-zinc-900/60">
          <Globe className="w-10 h-10 mx-auto mb-3 text-slate-200 dark:text-zinc-700" />
          <p className="text-slate-500 dark:text-slate-400">No projects yet. Create your first one.</p>
        </Card>
      )}

      {/* Project dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Project title" {...field} data-testid="input-project-title" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug (auto-generated if empty)</FormLabel><FormControl><Input placeholder="project-slug" {...field} data-testid="input-project-slug" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger data-testid="select-project-category"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {["website","e-commerce","landing-page","web-app","redesign"].map(c => (
                      <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g," ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} placeholder="Brief description..." {...field} data-testid="input-project-description" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem><FormLabel>Tags (comma-separated)</FormLabel><FormControl><Input placeholder="React, SEO, E-commerce" {...field} data-testid="input-project-tags" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="liveUrl" render={({ field }) => (
                <FormItem><FormLabel>Live URL</FormLabel><FormControl><Input placeholder="https://example.com" {...field} data-testid="input-project-url" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="published" render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 dark:border-white/8 p-4">
                  <div><FormLabel className="mb-0">Published</FormLabel><p className="text-xs text-slate-500 mt-0.5">Make this project visible on the public site.</p></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-project-published" /></FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0" data-testid="button-save-project">
                  {saveMutation.isPending ? "Saving..." : "Save Project"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── General tab ────────────────────────────────────────── */
function GeneralTab() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<SiteSettings>({ queryKey: ["/api/admin/settings"] });
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [instagram, setInstagram]       = useState("");
  const [tiktok, setTiktok]             = useState("");
  const [youtube, setYoutube]           = useState("");
  const [linkedin, setLinkedin]         = useState("");
  const [bookingLink, setBookingLink]   = useState("");
  const [quoteLink, setQuoteLink]       = useState("");

  useEffect(() => {
    if (settings) {
      const ci = settings.contactInfo as any || {};
      setContactEmail(ci.email || ""); setContactPhone(ci.phone || "");
      const sl = settings.socialLinks as any || {};
      setInstagram(sl.instagram || ""); setTiktok(sl.tiktok || ""); setYoutube(sl.youtube || ""); setLinkedin(sl.linkedin || "");
      const cl = settings.ctaLinks as any || {};
      setBookingLink(cl.booking || ""); setQuoteLink(cl.quote || "");
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/admin/settings", {
        contactInfo: { email: contactEmail, phone: contactPhone },
        socialLinks: { instagram, tiktok, youtube, linkedin },
        ctaLinks: { booking: bookingLink, quote: quoteLink },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Settings saved ✓" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (isLoading) return <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}</div>;

  const field = (label: string, value: string, setter: (v: string) => void, placeholder: string, testId?: string) => (
    <div key={label}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5 block">{label}</label>
      <Input value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} className="border-slate-200 dark:border-white/10" data-testid={testId} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">General Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Contact info, social links, and CTA configuration.</p>
        </div>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0" data-testid="button-save-settings">
          <Save className="mr-2 w-4 h-4" />
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card className="p-6 border-slate-200/60 dark:border-white/8 bg-white dark:bg-zinc-900/60 space-y-4">
        <h3 className="font-medium text-slate-900 dark:text-white text-sm">Contact Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {field("Email", contactEmail, setContactEmail, "hello@jbwebsites.com", "input-contact-email")}
          {field("Phone", contactPhone, setContactPhone, "(555) 123-4567", "input-contact-phone")}
        </div>
      </Card>

      <Card className="p-6 border-slate-200/60 dark:border-white/8 bg-white dark:bg-zinc-900/60 space-y-4">
        <h3 className="font-medium text-slate-900 dark:text-white text-sm">Social Links</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {field("Instagram", instagram, setInstagram, "https://instagram.com/...", "input-social-ig")}
          {field("TikTok",    tiktok,    setTiktok,    "https://tiktok.com/...",    "input-social-tiktok")}
          {field("YouTube",   youtube,   setYoutube,   "https://youtube.com/...",   "input-social-youtube")}
          {field("LinkedIn",  linkedin,  setLinkedin,  "https://linkedin.com/...",  "input-social-linkedin")}
        </div>
      </Card>

      <Card className="p-6 border-slate-200/60 dark:border-white/8 bg-white dark:bg-zinc-900/60 space-y-4">
        <h3 className="font-medium text-slate-900 dark:text-white text-sm">CTA Links</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {field("Booking Link", bookingLink, setBookingLink, "https://calendly.com/...", "input-cta-booking")}
          {field("Quote Link",   quoteLink,   setQuoteLink,   "/contact",                 "input-cta-quote")}
        </div>
      </Card>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function AdminContent() {
  const [activeTab, setActiveTab] = useState("hero");
  const tabIcons = { hero: Layout, projects: Briefcase, general: Settings };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Website Content</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Edit your public website content, projects, and settings.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/60 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === tab.id
                ? "bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "hero"     && <HeroTab />}
      {activeTab === "projects" && <ProjectsTab />}
      {activeTab === "general"  && <GeneralTab />}
    </div>
  );
}
