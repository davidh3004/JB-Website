import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Phone, Save } from "lucide-react";
import type { Lead, Call } from "@shared/schema";

const statusOptions = ["new", "contacted", "qualified", "proposal", "won", "lost", "archived"] as const;
const outcomeOptions = ["connected", "no_answer", "voicemail", "callback", "not_interested"] as const;

export default function LeadDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [callDialogOpen, setCallDialogOpen] = useState(false);

  const { data, isLoading } = useQuery<Lead & { calls: Call[] }>({
    queryKey: ["/api/crm/leads", id],
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: any) => {
      const res = await apiRequest("PATCH", `/api/crm/leads/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads"] });
      toast({ title: "Lead updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const callMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/crm/calls", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/calls"] });
      setCallDialogOpen(false);
      toast({ title: "Call logged" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    updateMutation.mutate({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      companyName: fd.get("companyName"),
      city: fd.get("city"),
      niche: fd.get("niche"),
      status: fd.get("status"),
      notes: fd.get("notes"),
      nextFollowUpAt: fd.get("nextFollowUpAt") || undefined,
    });
  };

  const handleLogCall = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    callMutation.mutate({
      leadId: id,
      outcome: fd.get("outcome"),
      durationSec: parseInt(fd.get("durationSec") as string) || 0,
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

  if (!data) {
    return <p className="text-slate-500">Lead not found</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl" data-testid="crm-lead-detail">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/app/leads")} data-testid="button-back-leads">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{data.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={data.name} data-testid="input-detail-name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" defaultValue={data.email} data-testid="input-detail-email" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" defaultValue={data.phone || ""} data-testid="input-detail-phone" />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company</Label>
                    <Input id="companyName" name="companyName" defaultValue={data.companyName || ""} data-testid="input-detail-company" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" defaultValue={data.city || ""} data-testid="input-detail-city" />
                  </div>
                  <div>
                    <Label htmlFor="niche">Niche</Label>
                    <Input id="niche" name="niche" defaultValue={data.niche || ""} data-testid="input-detail-niche" />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={data.status}>
                      <SelectTrigger data-testid="select-detail-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="nextFollowUpAt">Next Follow-Up</Label>
                  <Input
                    id="nextFollowUpAt"
                    name="nextFollowUpAt"
                    type="datetime-local"
                    defaultValue={data.nextFollowUpAt ? new Date(data.nextFollowUpAt).toISOString().slice(0, 16) : ""}
                    data-testid="input-detail-followup"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" rows={4} defaultValue={data.notes || ""} data-testid="input-detail-notes" />
                </div>
                <Button type="submit" disabled={updateMutation.isPending} data-testid="button-save-lead">
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Call Log</CardTitle>
              <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" data-testid="button-log-call">
                    <Phone className="w-4 h-4 mr-1" /> Log Call
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log a Call</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogCall} className="space-y-4">
                    <div>
                      <Label htmlFor="outcome">Outcome</Label>
                      <Select name="outcome" defaultValue="no_answer">
                        <SelectTrigger data-testid="select-call-outcome">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {outcomeOptions.map((o) => (
                            <SelectItem key={o} value={o}>{o.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="durationSec">Duration (seconds)</Label>
                      <Input id="durationSec" name="durationSec" type="number" min="0" defaultValue="0" data-testid="input-call-duration" />
                    </div>
                    <div>
                      <Label htmlFor="callNotes">Notes</Label>
                      <Textarea id="callNotes" name="notes" rows={3} data-testid="input-call-notes" />
                    </div>
                    <Button type="submit" disabled={callMutation.isPending} className="w-full" data-testid="button-submit-call">
                      {callMutation.isPending ? "Logging..." : "Log Call"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {(!data.calls || data.calls.length === 0) ? (
                <p className="text-sm text-slate-500">No calls logged</p>
              ) : (
                <div className="space-y-3">
                  {data.calls.map((call) => (
                    <div key={call.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50" data-testid={`call-entry-${call.id}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          call.outcome === "connected" ? "bg-green-100 text-green-700" :
                          call.outcome === "callback" ? "bg-yellow-100 text-yellow-700" :
                          call.outcome === "not_interested" ? "bg-red-100 text-red-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {call.outcome.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-400">{new Date(call.createdAt).toLocaleString()}</span>
                      </div>
                      {call.durationSec ? (
                        <p className="text-xs text-slate-500">{Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s</p>
                      ) : null}
                      {call.notes && <p className="text-sm mt-1">{call.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <p className="text-xs text-slate-400">Last Contacted</p>
              <p className="text-sm font-medium">{data.lastContactedAt ? new Date(data.lastContactedAt).toLocaleString() : "Never"}</p>
              <p className="text-xs text-slate-400 pt-2">Created</p>
              <p className="text-sm font-medium">{new Date(data.createdAt).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
