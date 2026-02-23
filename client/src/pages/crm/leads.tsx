import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Search, Eye } from "lucide-react";
import type { Lead } from "@shared/schema";

const statusOptions = ["all", "new", "contacted", "qualified", "proposal", "won", "lost", "archived"] as const;

export default function CrmLeads() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  const { data: leads = [], isLoading } = useQuery<Lead[]>({ queryKey: ["/api/crm/leads"] });

  const filtered = leads.filter(lead => {
    const matchesSearch = !search || [lead.name, lead.email, lead.companyName, lead.contactName, lead.city, lead.niche]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/crm/leads", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads"] });
      setCreateOpen(false);
      toast({ title: "Lead created" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMutation.mutate({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      companyName: fd.get("companyName"),
      city: fd.get("city"),
      niche: fd.get("niche"),
      status: "new",
      message: fd.get("notes") || "",
      notes: fd.get("notes"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="crm-leads-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-lead"><Plus className="w-4 h-4 mr-2" />New Lead</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Lead</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" required data-testid="input-lead-name" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required data-testid="input-lead-email" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" data-testid="input-lead-phone" />
                </div>
                <div>
                  <Label htmlFor="companyName">Company</Label>
                  <Input id="companyName" name="companyName" data-testid="input-lead-company" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" data-testid="input-lead-city" />
                </div>
                <div>
                  <Label htmlFor="niche">Niche</Label>
                  <Input id="niche" name="niche" data-testid="input-lead-niche" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={3} data-testid="input-lead-notes" />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="w-full" data-testid="button-submit-lead">
                {createMutation.isPending ? "Creating..." : "Create Lead"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search-leads"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left p-3 font-medium text-slate-500">Name</th>
                  <th className="text-left p-3 font-medium text-slate-500 hidden md:table-cell">Company</th>
                  <th className="text-left p-3 font-medium text-slate-500 hidden lg:table-cell">City</th>
                  <th className="text-left p-3 font-medium text-slate-500 hidden lg:table-cell">Niche</th>
                  <th className="text-left p-3 font-medium text-slate-500">Status</th>
                  <th className="text-left p-3 font-medium text-slate-500 hidden md:table-cell">Created</th>
                  <th className="text-right p-3 font-medium text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500">No leads found</td>
                  </tr>
                ) : (
                  filtered.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-800/30" data-testid={`row-lead-${lead.id}`}>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-slate-400">{lead.email}</p>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell text-slate-600">{lead.companyName || lead.businessName || "—"}</td>
                      <td className="p-3 hidden lg:table-cell text-slate-600">{lead.city || "—"}</td>
                      <td className="p-3 hidden lg:table-cell text-slate-600">{lead.niche || "—"}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          lead.status === "new" ? "bg-blue-100 text-blue-700" :
                          lead.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
                          lead.status === "qualified" ? "bg-green-100 text-green-700" :
                          lead.status === "proposal" ? "bg-purple-100 text-purple-700" :
                          lead.status === "won" ? "bg-emerald-100 text-emerald-700" :
                          lead.status === "lost" ? "bg-red-100 text-red-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3 hidden md:table-cell text-slate-500 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <Link href={`/app/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm" data-testid={`button-view-lead-${lead.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
