import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { FolderOpen, Users, MessageSquare, CreditCard } from "lucide-react";
import type { Project, Lead } from "@shared/schema";

export default function AdminDashboard() {
  const { data: projects } = useQuery<Project[]>({ queryKey: ["/api/admin/projects"] });
  const { data: leads } = useQuery<Lead[]>({ queryKey: ["/api/admin/leads"] });

  const stats = [
    { label: "Total Projects", value: projects?.length || 0, icon: FolderOpen, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
    { label: "Published", value: projects?.filter(p => p.published).length || 0, icon: Users, color: "text-green-600 bg-green-50 dark:bg-green-950/30" },
    { label: "Total Leads", value: leads?.length || 0, icon: MessageSquare, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30" },
    { label: "New Leads", value: leads?.filter(l => l.status === "new").length || 0, icon: CreditCard, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your JB Websites admin portal.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-5" data-testid={`card-stat-${i}`}>
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
              <div className={`w-9 h-9 rounded-md flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Leads</h2>
          {leads && leads.length > 0 ? (
            <div className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{lead.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{lead.email}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 ${
                    lead.status === "new" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300" :
                    lead.status === "contacted" ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300" :
                    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No leads yet.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Projects</h2>
          {projects && projects.length > 0 ? (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{project.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{project.category}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded flex-shrink-0 ${
                    project.published ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {project.published ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No projects yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
