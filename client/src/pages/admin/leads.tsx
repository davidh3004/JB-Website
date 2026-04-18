import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Phone, Building2, Download, Search, Filter, Clock, Tag } from "lucide-react";
import { useState } from "react";
import type { Lead } from "@shared/schema";

const STATUS_OPTIONS = [
  { value: "new",         label: "New",         color: "bg-blue-100  text-blue-700  dark:bg-blue-950/40  dark:text-blue-300"      },
  { value: "contacted",   label: "Contacted",   color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300" },
  { value: "in_progress", label: "In Progress", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" },
  { value: "archived",    label: "Archived",    color: "bg-slate-100  text-slate-600  dark:bg-zinc-800     dark:text-slate-400"   },
];

function StatusBadge({ status }: { status: string }) {
  const opt = STATUS_OPTIONS.find(s => s.value === status) ?? STATUS_OPTIONS[0];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${opt.color}`}>
      {opt.label}
    </span>
  );
}

export default function AdminLeads() {
  const { toast } = useToast();
  const { data: leads, isLoading } = useQuery<Lead[]>({ queryKey: ["/api/admin/leads"] });
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/admin/leads/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      toast({ title: "Lead status updated" });
    },
  });

  const exportCsv = () => {
    if (!leads) return;
    const headers = ["Name","Email","Phone","Business","Industry","Timeline","Budget","Message","Status","Date"];
    const rows = leads.map(l => [l.name,l.email,l.phone,l.businessName,l.industry,l.timeline,l.budgetRange,l.message,l.status,new Date(l.createdAt).toLocaleDateString()]);
    const csv = [headers,...rows].map(r => r.map(c => `"${(c||"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = (leads || []).filter(l => {
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.businessName || "").toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = (leads || []).filter(l => l.status === s.value).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-leads-title">Leads</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Contact form submissions from potential clients.</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!leads || leads.length === 0} className="border-slate-200 dark:border-white/10" data-testid="button-export-csv">
          <Download className="mr-2 w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            statusFilter === "all"
              ? "bg-slate-900 dark:bg-white text-white dark:text-zinc-900 border-transparent"
              : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300"
          }`}
        >
          All ({(leads || []).length})
        </button>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              statusFilter === s.value
                ? "bg-slate-900 dark:bg-white text-white dark:text-zinc-900 border-transparent"
                : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300"
            }`}
          >
            {s.label} ({counts[s.value] || 0})
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by name, email, or business..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/60"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <Card key={i} className="p-5 animate-pulse border-slate-200/60 dark:border-white/8">
              <div className="h-16 bg-slate-100 dark:bg-zinc-800 rounded-lg" />
            </Card>
          ))}
        </div>
      )}

      {/* Lead cards */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <Card
              key={lead.id}
              className="p-5 border-slate-200/60 dark:border-white/8 bg-white dark:bg-zinc-900/60 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors"
              data-testid={`card-lead-${lead.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{lead.name}</h3>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>
                    {lead.phone      && <span className="flex items-center gap-1"><Phone    className="w-3 h-3" />{lead.phone}</span>}
                    {lead.businessName && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{lead.businessName}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                  <Select value={lead.status} onValueChange={(status) => statusMutation.mutate({ id: lead.id, status })}>
                    <SelectTrigger className="w-36 h-8 text-xs border-slate-200 dark:border-white/10" data-testid={`select-lead-status-${lead.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message */}
              <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-zinc-800/50 rounded-lg p-3 leading-relaxed">
                {lead.message}
              </div>

              {/* Meta tags */}
              {(lead.industry || lead.timeline || lead.budgetRange) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {lead.industry    && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30"><Tag className="w-2.5 h-2.5" />{lead.industry}</span>}
                  {lead.timeline    && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400"><Clock className="w-2.5 h-2.5" />{lead.timeline}</span>}
                  {lead.budgetRange && <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30">{lead.budgetRange}</span>}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <Card className="p-14 text-center border-slate-200/60 dark:border-white/8 bg-white dark:bg-zinc-900/60">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-200 dark:text-zinc-700" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {search || statusFilter !== "all" ? "No leads match your filters." : "No leads yet. They'll appear here when someone submits the contact form."}
          </p>
          {(search || statusFilter !== "all") && (
            <button
              onClick={() => { setSearch(""); setStatusFilter("all"); }}
              className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </Card>
      )}
    </div>
  );
}
