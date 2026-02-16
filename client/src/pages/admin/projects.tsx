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
import { Plus, Pencil, Trash2, ExternalLink, Monitor, Upload } from "lucide-react";
import { useState, useRef } from "react";
import type { Project } from "@shared/schema";

interface ProjectFormData {
  title: string;
  slug: string;
  category: string;
  description: string;
  tags: string;
  liveUrl: string;
  published: boolean;
}

export default function AdminProjects() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    form.reset({
      title: project.title,
      slug: project.slug,
      category: project.category,
      description: project.description,
      tags: (project.tags || []).join(", "),
      liveUrl: project.liveUrl || "",
      published: project.published,
    });
    setDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const payload = {
        ...data,
        tags: data.tags.split(",").map(t => t.trim()).filter(Boolean),
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      };
      if (editingProject) {
        await apiRequest("PATCH", `/api/admin/projects/${editingProject.id}`, payload);
      } else {
        await apiRequest("POST", "/api/admin/projects", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setDialogOpen(false);
      toast({ title: editingProject ? "Project updated" : "Project created" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted" });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`/api/admin/projects/${id}/cover`, { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error("Upload failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Cover image uploaded" });
    },
  });

  const handleUpload = (project: Project) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) uploadMutation.mutate({ id: project.id, file });
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-projects-title">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openCreate} data-testid="button-create-project">
          <Plus className="mr-2 w-4 h-4" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-16 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project) => (
            <Card key={project.id} className="p-4" data-testid={`card-admin-project-${project.id}`}>
              <div className="flex items-center gap-4">
                <div className="w-20 h-14 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => handleUpload(project)}>
                  {project.coverImageUrl ? (
                    <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Upload className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{project.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      project.published ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {project.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{project.description || "No description"}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost"><ExternalLink className="w-4 h-4" /></Button>
                    </a>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => openEdit(project)} data-testid={`button-edit-project-${project.id}`}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this project?")) deleteMutation.mutate(project.id); }} data-testid={`button-delete-project-${project.id}`}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Monitor className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 dark:text-slate-400">No projects yet. Create your first one.</p>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input placeholder="Project title" {...field} data-testid="input-project-title" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (auto-generated if empty)</FormLabel>
                  <FormControl><Input placeholder="project-slug" {...field} data-testid="input-project-slug" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-project-category"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["website", "e-commerce", "landing-page", "web-app", "redesign"].map(c => (
                        <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea rows={3} placeholder="Brief description..." {...field} data-testid="input-project-description" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl><Input placeholder="React, SEO, E-commerce" {...field} data-testid="input-project-tags" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="liveUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl><Input placeholder="https://example.com" {...field} data-testid="input-project-url" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="published" render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4 rounded-md border p-4">
                  <div>
                    <FormLabel className="mb-0">Published</FormLabel>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Make this project visible on the public site.</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-project-published" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending} data-testid="button-save-project">
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
