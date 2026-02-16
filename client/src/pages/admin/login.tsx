import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import type { z } from "zod";

export default function AdminLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/admin");
    },
    onError: (err: Error) => {
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/10 flex items-center justify-center p-6">
      <Card className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-login-title">Admin Login</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to manage your site</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="admin@jbwebsites.com" {...field} data-testid="input-login-email" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" placeholder="Password" {...field} data-testid="input-login-password" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={mutation.isPending} data-testid="button-login">
              {mutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
