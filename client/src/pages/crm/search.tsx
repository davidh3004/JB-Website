import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search as SearchIcon, Eye, Clock } from "lucide-react";
import type { Lead, Search as SearchType } from "@shared/schema";

export default function CrmSearch() {
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [nicheFilter, setNicheFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: leads = [] } = useQuery<Lead[]>({ queryKey: ["/api/crm/leads"] });
  const { data: searchHistory = [] } = useQuery<SearchType[]>({ queryKey: ["/api/crm/searches"] });

  const logSearchMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/crm/searches", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/searches"] });
    },
  });

  const results = leads.filter(lead => {
    const matchesQuery = !query || [lead.name, lead.email, lead.companyName, lead.contactName, lead.phone]
      .some(f => f?.toLowerCase().includes(query.toLowerCase()));
    const matchesCity = !cityFilter || lead.city?.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesNiche = !nicheFilter || lead.niche?.toLowerCase().includes(nicheFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesQuery && matchesCity && matchesNiche && matchesStatus;
  });

  const handleSearch = () => {
    if (query || cityFilter || nicheFilter || statusFilter !== "all") {
      logSearchMutation.mutate({
        query: query,
        filtersJson: { city: cityFilter, niche: nicheFilter, status: statusFilter },
      });
    }
  };

  const uniqueCities = Array.from(new Set(leads.map(l => l.city).filter(Boolean)));
  const uniqueNiches = Array.from(new Set(leads.map(l => l.niche).filter(Boolean)));

  return (
    <div className="space-y-6" data-testid="crm-search-page">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Search Leads</h1>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, phone, company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-query"
              />
            </div>
            <Input
              placeholder="City"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-32"
              data-testid="input-search-city"
            />
            <Input
              placeholder="Niche"
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
              className="w-32"
              data-testid="input-search-niche"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36" data-testid="select-search-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {["new", "contacted", "qualified", "proposal", "won", "lost", "archived"].map(s => (
                  <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} data-testid="button-search">
              <SearchIcon className="w-4 h-4 mr-2" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Results ({results.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                      <th className="text-left p-3 font-medium text-slate-500">Name</th>
                      <th className="text-left p-3 font-medium text-slate-500 hidden md:table-cell">Company</th>
                      <th className="text-left p-3 font-medium text-slate-500 hidden md:table-cell">City</th>
                      <th className="text-left p-3 font-medium text-slate-500">Status</th>
                      <th className="text-right p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length === 0 ? (
                      <tr><td colSpan={5} className="p-6 text-center text-slate-500">No results</td></tr>
                    ) : results.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-slate-50/50" data-testid={`search-result-${lead.id}`}>
                        <td className="p-3">
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-slate-400">{lead.email}</p>
                        </td>
                        <td className="p-3 hidden md:table-cell text-slate-600">{lead.companyName || "—"}</td>
                        <td className="p-3 hidden md:table-cell text-slate-600">{lead.city || "—"}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            lead.status === "new" ? "bg-blue-100 text-blue-700" :
                            lead.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
                            lead.status === "qualified" ? "bg-green-100 text-green-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Link href={`/app/leads/${lead.id}`}>
                            <Button variant="ghost" size="sm" data-testid={`button-view-search-${lead.id}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-4 h-4" /> Search History</CardTitle>
            </CardHeader>
            <CardContent>
              {searchHistory.length === 0 ? (
                <p className="text-sm text-slate-500">No searches yet</p>
              ) : (
                <div className="space-y-2">
                  {searchHistory.slice(0, 10).map((s) => (
                    <div key={s.id} className="p-2 rounded bg-slate-50 dark:bg-slate-800/50" data-testid={`search-history-${s.id}`}>
                      <p className="text-sm font-medium">{s.query || "Filter search"}</p>
                      <p className="text-xs text-slate-400">{new Date(s.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
