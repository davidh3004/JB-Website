import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import type { SquareSettings } from "@shared/schema";

export default function AdminSquare() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<SquareSettings>({ queryKey: ["/api/admin/square-settings"] });

  const [mode, setMode] = useState("sandbox");
  const [locationId, setLocationId] = useState("");
  const [defaultCheckoutUrl, setDefaultCheckoutUrl] = useState("");
  const [depositUrl, setDepositUrl] = useState("");
  const [monthlyUrl, setMonthlyUrl] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState("");

  useEffect(() => {
    if (settings) {
      setMode(settings.mode || "sandbox");
      setLocationId(settings.locationId || "");
      setDefaultCheckoutUrl(settings.defaultCheckoutUrl || "");
      const extra = settings.extraCheckoutUrls as any || {};
      setDepositUrl(extra.deposit || "");
      setMonthlyUrl(extra.monthly || "");
      setInvoiceUrl(extra.invoice || "");
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/admin/square-settings", {
        mode,
        locationId,
        defaultCheckoutUrl,
        extraCheckoutUrls: { deposit: depositUrl, monthly: monthlyUrl, invoice: invoiceUrl },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/square-settings"] });
      toast({ title: "Square settings saved" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
        <Card className="p-6 animate-pulse"><div className="h-40 bg-slate-100 dark:bg-slate-800 rounded" /></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-square-title">Square Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure Square payment integration.</p>
        </div>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} data-testid="button-save-square">
          <Save className="mr-2 w-4 h-4" />
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Configuration</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Mode</label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger data-testid="select-square-mode"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Location ID</label>
            <Input value={locationId} onChange={e => setLocationId(e.target.value)} placeholder="Square Location ID" data-testid="input-square-location" />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-slate-900 dark:text-white">Checkout Links</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Set up Square Checkout Links for payments. These URLs will power the "Pay Now" buttons on your site.</p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Default Checkout URL</label>
            <Input value={defaultCheckoutUrl} onChange={e => setDefaultCheckoutUrl(e.target.value)} placeholder="https://checkout.square.site/..." data-testid="input-square-checkout" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Deposit Payment URL</label>
            <Input value={depositUrl} onChange={e => setDepositUrl(e.target.value)} placeholder="https://checkout.square.site/..." data-testid="input-square-deposit" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Monthly Payment URL</label>
            <Input value={monthlyUrl} onChange={e => setMonthlyUrl(e.target.value)} placeholder="https://checkout.square.site/..." data-testid="input-square-monthly" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Invoice Payment URL</label>
            <Input value={invoiceUrl} onChange={e => setInvoiceUrl(e.target.value)} placeholder="https://checkout.square.site/..." data-testid="input-square-invoice" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How it works</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Create checkout links in your <a href="https://squareup.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Square Dashboard</a>, then paste the URLs here. When a client clicks "Pay Now" on your site, they'll be taken to the Square checkout page to complete payment securely.
        </p>
      </Card>
    </div>
  );
}
