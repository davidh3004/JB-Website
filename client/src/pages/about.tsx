import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Users, Zap, MessageSquare, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/10 dark:to-background">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white" data-testid="text-about-title">About JB Websites</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            We're a web agency built on one idea: businesses deserve better websites.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" data-testid="text-story-title">Our Story</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6">
              JB Websites was founded with a clear mission: give small and medium businesses access to the same quality web development that enterprise companies get — without the enterprise price tag or the corporate runaround.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6">
              Too many businesses settle for cookie-cutter templates that look like everyone else. We believe your website should be as unique as your business. That's why every project we take on is custom-coded from scratch, designed specifically for your brand, and built to perform.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              We don't just launch and leave. Our monthly plans mean you always have a team behind your website — handling security, updates, SEO, and any changes you need. Think of us as your in-house web team, without the overhead.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-50/50 dark:bg-blue-950/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white" data-testid="text-values-title">What Drives Us</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: ShieldCheck, title: "Reliability", desc: "We deliver on time, every time. Your business depends on your website, and we take that seriously. When we say it'll be done, it's done." },
              { icon: Zap, title: "Speed", desc: "Fast websites, fast communication, fast turnaround. We value your time as much as ours and build sites that load in a blink." },
              { icon: MessageSquare, title: "Communication", desc: "No jargon, no ghosting. We keep you in the loop at every stage and explain things in plain language. You always know where your project stands." },
              { icon: Users, title: "Long-Term Support", desc: "We're in it for the long run. Our monthly plans mean you're never left managing your own website. We handle the technical stuff so you can focus on your business." },
            ].map((value, i) => (
              <Card key={i} className="p-8" data-testid={`card-value-${i}`}>
                <div className="w-12 h-12 rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-5">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-different-title">What Makes Us Different</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            We're not a big agency with account managers and layers of bureaucracy. When you work with us, you work directly with the people building your site. That means faster decisions, better communication, and a final product that actually matches your vision.
          </p>
          <Link href="/contact">
            <Button size="lg" data-testid="button-about-cta">
              Let's Work Together
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
