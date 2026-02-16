import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Phone, Building2, Download } from "lucide-react";
import type { Lead } from "@shared/schema";

export default function AdminLeads() {
  const { toast } = useToast();
  const { data: leads, isLoading } = useQuery<Lead[]>({ queryKey: ["/api/admin/leads"] });

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
    const headers = ["Name", "Email", "Phone", "Business", "Industry", "Timeline", "Budget", "Message", "Status", "Date"];
    const rows = leads.map(l => [l.name, l.email, l.phone, l.businessName, l.industry, l.timeline, l.budgetRange, l.message, l.status, new Date(l.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-leads-title">Leads</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Contact form submissions.</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!leads || leads.length === 0} data-testid="button-export-csv">
          <Download className="mr-2 w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Card key={i} className="p-5 animate-pulse"><div className="h-16 bg-slate-100 dark:bg-slate-800 rounded" /></Card>)}
        </div>
      ) : leads && leads.length > 0 ? (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="p-5" data-testid={`card-lead-${lead.id}`}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{lead.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>
                    {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                    {lead.businessName && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{lead.businessName}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
                  <Select value={lead.status} onValueChange={(status) => statusMutation.mutate({ id: lead.id, status })}>
                    <SelectTrigger className="w-32" data-testid={`select-lead-status-${lead.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded p-3">
                {lead.message}
              </div>
              {(lead.industry || lead.timeline || lead.budgetRange) && (
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {lead.industry && <span>Industry: {lead.industry}</span>}
                  {lead.timeline && <span>Timeline: {lead.timeline}</span>}
                  {lead.budgetRange && <span>Budget: {lead.budgetRange}</span>}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 dark:text-slate-400">No leads yet. They'll appear here when someone submits the contact form.</p>
        </Card>
      )}
    </div>
  );
}
