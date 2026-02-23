import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Phone, TrendingUp, Clock } from "lucide-react";
import type { Lead, Call } from "@shared/schema";

export default function CrmDashboard() {
  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({ queryKey: ["/api/crm/leads"] });
  const { data: calls = [], isLoading: callsLoading } = useQuery<Call[]>({ queryKey: ["/api/crm/calls"] });

  const stats = [
    {
      title: "Total Leads",
      value: leads.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Calls",
      value: calls.length,
      icon: Phone,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Active Leads",
      value: leads.filter(l => !["won", "lost", "archived"].includes(l.status)).length,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Follow-ups Due",
      value: leads.filter(l => l.nextFollowUpAt && new Date(l.nextFollowUpAt) <= new Date()).length,
      icon: Clock,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  const recentLeads = leads.slice(0, 5);
  const recentCalls = calls.slice(0, 5);

  if (leadsLoading || callsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="crm-dashboard">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-crm-title">CRM Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s/g, "-")}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-slate-500">No leads yet</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50" data-testid={`row-lead-${lead.id}`}>
                    <div>
                      <p className="font-medium text-sm">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.companyName || lead.businessName || lead.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      lead.status === "new" ? "bg-blue-100 text-blue-700" :
                      lead.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
                      lead.status === "qualified" ? "bg-green-100 text-green-700" :
                      lead.status === "won" ? "bg-emerald-100 text-emerald-700" :
                      lead.status === "lost" ? "bg-red-100 text-red-700" :
                      "bg-slate-100 text-slate-700"
                    }`} data-testid={`badge-status-${lead.id}`}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCalls.length === 0 ? (
              <p className="text-sm text-slate-500">No calls logged yet</p>
            ) : (
              <div className="space-y-3">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50" data-testid={`row-call-${call.id}`}>
                    <div>
                      <p className="font-medium text-sm capitalize">{call.outcome.replace("_", " ")}</p>
                      <p className="text-xs text-slate-500">{call.notes || "No notes"}</p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(call.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
