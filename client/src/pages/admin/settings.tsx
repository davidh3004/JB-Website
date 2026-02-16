import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import type { SiteSettings } from "@shared/schema";

export default function AdminSettings() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<SiteSettings>({ queryKey: ["/api/admin/settings"] });

  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroSubheadline, setHeroSubheadline] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [bookingLink, setBookingLink] = useState("");
  const [quoteLink, setQuoteLink] = useState("");

  useEffect(() => {
    if (settings) {
      setHeroHeadline(settings.heroHeadline || "");
      setHeroSubheadline(settings.heroSubheadline || "");
      setAboutText(settings.aboutText || "");
      const ci = settings.contactInfo as any || {};
      setContactEmail(ci.email || "");
      setContactPhone(ci.phone || "");
      const sl = settings.socialLinks as any || {};
      setInstagram(sl.instagram || "");
      setTiktok(sl.tiktok || "");
      setYoutube(sl.youtube || "");
      setLinkedin(sl.linkedin || "");
      const cl = settings.ctaLinks as any || {};
      setBookingLink(cl.booking || "");
      setQuoteLink(cl.quote || "");
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/admin/settings", {
        heroHeadline,
        heroSubheadline,
        aboutText,
        contactInfo: { email: contactEmail, phone: contactPhone },
        socialLinks: { instagram, tiktok, youtube, linkedin },
        ctaLinks: { booking: bookingLink, quote: quoteLink },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Settings saved" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
        {[1, 2, 3].map(i => <Card key={i} className="p-6 animate-pulse"><div className="h-20 bg-slate-100 dark:bg-slate-800 rounded" /></Card>)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-settings-title">Site Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your site content and links.</p>
        </div>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} data-testid="button-save-settings">
          <Save className="mr-2 w-4 h-4" />
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">Hero Section</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Headline</label>
            <Input value={heroHeadline} onChange={e => setHeroHeadline(e.target.value)} placeholder="Main headline" data-testid="input-hero-headline" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Subheadline</label>
            <Input value={heroSubheadline} onChange={e => setHeroSubheadline(e.target.value)} placeholder="Supporting text" data-testid="input-hero-subheadline" />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">About Section</h2>
        <Textarea value={aboutText} onChange={e => setAboutText(e.target.value)} rows={5} placeholder="Your about text..." data-testid="input-about-text" />
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">Contact Info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Email</label>
            <Input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="hello@jbwebsites.com" data-testid="input-contact-email" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Phone</label>
            <Input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="(555) 123-4567" data-testid="input-contact-phone" />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">Social Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Instagram</label>
            <Input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/..." data-testid="input-social-ig" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">TikTok</label>
            <Input value={tiktok} onChange={e => setTiktok(e.target.value)} placeholder="https://tiktok.com/..." data-testid="input-social-tiktok" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">YouTube</label>
            <Input value={youtube} onChange={e => setYoutube(e.target.value)} placeholder="https://youtube.com/..." data-testid="input-social-youtube" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">LinkedIn</label>
            <Input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/..." data-testid="input-social-linkedin" />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">CTA Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Booking Link</label>
            <Input value={bookingLink} onChange={e => setBookingLink(e.target.value)} placeholder="https://calendly.com/..." data-testid="input-cta-booking" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1 block">Quote Link</label>
            <Input value={quoteLink} onChange={e => setQuoteLink(e.target.value)} placeholder="/contact" data-testid="input-cta-quote" />
          </div>
        </div>
      </Card>
    </div>
  );
}
