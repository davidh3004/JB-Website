import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Code, Search, CreditCard, Calendar, Settings, Rocket, Paintbrush, MessageSquare, Shield } from "lucide-react";

const processSteps = [
  { step: "01", title: "Discovery", desc: "We learn your business, goals, and audience. Every project starts with understanding what success looks like for you.", icon: MessageSquare },
  { step: "02", title: "Design", desc: "We create wireframes and visual designs that match your brand. You approve every detail before a single line of code is written.", icon: Paintbrush },
  { step: "03", title: "Build", desc: "Custom code, not templates. We hand-build your site for speed, accessibility, and SEO — tested on every device.", icon: Code },
  { step: "04", title: "Launch", desc: "We handle deployment, DNS, SSL, analytics setup, and everything else. You just share the link.", icon: Rocket },
  { step: "05", title: "Ongoing", desc: "Monthly plans cover maintenance, security patches, content updates, performance monitoring, and ongoing SEO.", icon: Shield },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/10 dark:to-background">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white" data-testid="text-services-title">Our Services</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            From design to deployment and beyond — everything your business needs to succeed online.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-webdev-title">Web Design & Development</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                We don't use WordPress, Wix, or Squarespace. Every website we build is custom-coded from the ground up using modern technologies that load fast, look sharp, and scale with your business.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Your site is built to be responsive on every device, accessible to all users, and optimized for conversions. Whether you need a landing page or a full web application, we build it right.
              </p>
            </div>
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-card">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">What you get:</h3>
              <ul className="space-y-3">
                {["100% custom-coded — no templates", "Mobile-first, responsive design", "Fast page load times", "Cross-browser tested", "Clean, maintainable codebase", "Content management when needed"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-card order-2 lg:order-1">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">SEO includes:</h3>
              <ul className="space-y-3">
                {["Technical SEO audit & optimization", "Meta tags, schema markup, sitemaps", "Page speed optimization", "Local SEO (Google Business integration)", "Keyword research & content strategy", "Monthly reporting (on ongoing plans)"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-seo-title">SEO Foundations & Ongoing SEO</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Every site we build includes technical SEO fundamentals: proper metadata, structured data, sitemaps, fast page speeds, and mobile optimization.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Need more? Our ongoing local SEO option helps you climb search rankings, attract local customers, and stay ahead of the competition month after month.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-6">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-integrations-title">Integrations</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Your website should work with the tools you already use. We integrate payment processing through Square, booking through Vagaro or Calendly, CRM connections, email marketing, and analytics.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Need something custom? We can build API integrations and automations to connect your site with virtually any service.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: CreditCard, label: "Square Payments" },
                { icon: Calendar, label: "Booking Tools" },
                { icon: Settings, label: "CRM Integration" },
                { icon: Search, label: "Analytics" },
              ].map((item, i) => (
                <Card key={i} className="p-6 text-center hover-elevate" data-testid={`card-integration-${i}`}>
                  <item.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50/50 dark:bg-blue-950/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white" data-testid="text-plans-title">Monthly Plans</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We don't just build your site and disappear. Our monthly plans keep your website secure, fast, and up to date.
            </p>
          </div>
          <Card className="p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Every monthly plan includes:</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Security monitoring & updates",
                "Performance optimization",
                "Regular backups",
                "Content & copy updates",
                "Bug fixes & small edits",
                "Uptime monitoring",
                "SSL certificate management",
                "SEO & analytics reports",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-md bg-blue-50 dark:bg-blue-950/20">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Plans are tailored to your needs. <Link href="/contact"><span className="text-blue-600 font-medium cursor-pointer hover:underline">Contact us</span></Link> for a custom quote based on your site's requirements.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white" data-testid="text-process-title">Our Process</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">From first conversation to long-term support.</p>
          </div>
          <div className="space-y-8">
            {processSteps.map((step, i) => (
              <div key={i} className="flex gap-6 items-start" data-testid={`item-process-${i}`}>
                <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pb-8 border-b border-slate-200/60 dark:border-slate-800/60 last:border-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step {step.step}</span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Let's Build Something Great</h2>
          <p className="text-lg text-blue-100 mb-8">Tell us about your project and we'll put together a plan that fits.</p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="bg-white text-blue-700 border-white" data-testid="button-services-cta">
              Start Your Project
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
