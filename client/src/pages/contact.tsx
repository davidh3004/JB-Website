import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { z } from "zod";

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      businessName: "",
      industry: "",
      timeline: "",
      budgetRange: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof contactFormSchema>) => {
      await apiRequest("POST", "/api/leads", data);
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3" data-testid="text-thankyou-title">Thank You!</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            We've received your message and will get back to you within one business day. Looking forward to learning about your project.
          </p>
          <Button variant="outline" onClick={() => { setSubmitted(false); form.reset(); }} data-testid="button-send-another">
            Send Another Message
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/10 dark:to-background">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white" data-testid="text-contact-title">Get a Free Quote</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Tell us about your project. We'll respond within one business day with a clear plan and honest estimate.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl><Input placeholder="Your name" {...field} data-testid="input-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl><Input type="email" placeholder="you@example.com" {...field} data-testid="input-email" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl><Input type="tel" placeholder="(555) 123-4567" {...field} data-testid="input-phone" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="businessName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl><Input placeholder="Your company" {...field} data-testid="input-business" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField control={form.control} name="industry" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-industry">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["Restaurant / Food", "Beauty / Salon", "Health / Fitness", "Real Estate", "Retail / E-commerce", "Professional Services", "Construction / Trades", "Technology", "Other"].map((ind) => (
                                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="timeline" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timeline</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-timeline">
                                <SelectValue placeholder="When do you need it?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["ASAP", "1-2 weeks", "1 month", "2-3 months", "No rush"].map((t) => (
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
                        <FormLabel>Budget Range</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-budget">
                              <SelectValue placeholder="Select range (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["Under $1,000", "$1,000 - $3,000", "$3,000 - $5,000", "$5,000 - $10,000", "$10,000+", "Not sure yet"].map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us about your project *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What do you need? What are your goals? Any specific features or integrations?"
                            rows={5}
                            {...field}
                            data-testid="input-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending} data-testid="button-submit-contact">
                      {mutation.isPending ? "Sending..." : (
                        <>
                          <Send className="mr-2 w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 block">Email</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white" data-testid="text-email">hello@jbwebsites.com</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 block">Phone</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white" data-testid="text-phone">(555) 123-4567</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What happens next?</h3>
                <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">1</span>
                    <span>We review your message within 24 hours</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">2</span>
                    <span>We schedule a quick discovery call</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">3</span>
                    <span>You receive a custom proposal</span>
                  </li>
                </ol>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
