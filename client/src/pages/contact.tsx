import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Send, CheckCircle2, Clock, MessageSquare, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { z } from "zod";

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const { data: settings } = useQuery<any>({ queryKey: ["/api/settings"] });
  const ci = settings?.contactInfo || {};
  const contactEmail = ci.email || "hello@jbwebsites.com";
  const contactPhone = ci.phone || "(555) 123-4567";

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "", email: "", phone: "", businessName: "",
      industry: "", timeline: "", budgetRange: "", message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof contactFormSchema>) => {
      await apiRequest("POST", "/api/leads", data);
    },
    onSuccess: () => { setSubmitted(true); },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3" style={{ letterSpacing: "-0.025em" }} data-testid="text-thankyou-title">
              Thank You!
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              We've received your message and will get back to you within one business day. Looking forward to learning about your project.
            </p>
            <Button
              variant="outline"
              className="border-slate-200 dark:border-white/12 hover:border-indigo-300"
              onClick={() => { setSubmitted(false); form.reset(); }}
              data-testid="button-send-another"
            >
              Send Another Message
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-20 pb-14 md:pt-28 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950" />
        <div className="absolute inset-0 dot-grid-bg opacity-60" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 80, damping: 22 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Get In Touch</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white" style={{ letterSpacing: "-0.03em" }} data-testid="text-contact-title">
              Get a Free Quote
            </h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Tell us about your project. We'll respond within one business day with a clear plan and honest estimate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Form + Info ───────────────────────────────────── */}
      <section className="pb-24 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 80, damping: 22 }}
                className="relative rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-zinc-900/80 p-7 md:p-9 shadow-sm"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 dark:via-indigo-700/40 to-transparent" />

                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-medium">Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className="border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800/60 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                              {...field}
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-medium">Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800/60 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                              {...field}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-medium">Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder={contactPhone}
                              className="border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800/60 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                              {...field}
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="businessName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-medium">Business Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your company"
                              className="border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800/60 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                              {...field}
                              data-testid="input-business"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="industry" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-medium">Industry</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800/60" data-testid="select-industry">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["Restaurant / Food","Beauty / Salon","Health / Fitness","Real Estate","Retail / E-commerce","Professional Services","Construction / Trades","Technology","Other"].map((ind) => (
                                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="timeline" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-medium">Timeline</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800/60" data-testid="select-timeline">
                                <SelectValue placeholder="When do you need it?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["ASAP","1-2 weeks","1 month","2-3 months","No rush"].map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="budgetRange" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-medium">Budget Range</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800/60" data-testid="select-budget">
                              <SelectValue placeholder="Select range (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Under $1,000","$1,000 - $3,000","$3,000 - $5,000","$5,000 - $10,000","$10,000+","Not sure yet"].map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 text-sm font-medium">Tell us about your project *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What do you need? What are your goals? Any specific features or integrations?"
                            rows={5}
                            className="border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800/60 focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                            {...field}
                            data-testid="input-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button
                      type="submit"
                      size="lg"
                      className="shimmer-btn w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-0 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all font-semibold"
                      disabled={mutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {mutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <>
                          <Send className="mr-2 w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </div>

            {/* Info sidebar */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 80, damping: 22 }}
                className="relative rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-zinc-900/80 p-6"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 dark:via-indigo-700/40 to-transparent" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Email</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white" data-testid="text-email">{contactEmail}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Phone</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white" data-testid="text-phone">{contactPhone}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 80, damping: 22 }}
                className="relative rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-indigo-950/20 p-6"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  What happens next?
                </h3>
                <ol className="space-y-3">
                  {[
                    "We review your message within 24 hours",
                    "We schedule a quick discovery call",
                    "You receive a custom proposal",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold shadow-md shadow-indigo-500/20">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 22 }}
                className="rounded-2xl border border-slate-200/80 dark:border-white/8 bg-white dark:bg-zinc-900/80 p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Prefer to chat?</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  You can also reach us directly by email or phone. We typically reply within a few hours.
                </p>
                <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                  Email us directly <ArrowRight className="w-3 h-3" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
