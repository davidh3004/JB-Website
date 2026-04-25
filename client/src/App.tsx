import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RequireAuth } from "@/lib/auth";
import { AdminLayout } from "@/components/admin-layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Portfolio from "@/pages/portfolio";
import ProjectDetail from "@/pages/project-detail";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProjects from "@/pages/admin/projects";
import AdminSettings from "@/pages/admin/settings";
import AdminLeads from "@/pages/admin/leads";
import AdminSquare from "@/pages/admin/square";
import AdminContent from "@/pages/admin/content";
import { WhatsAppButton } from "@/components/whatsapp-button";

function AdminPage({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AdminLayout>{children}</AdminLayout>
    </RequireAuth>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/portfolio/:slug" component={ProjectDetail} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <AdminPage><AdminDashboard /></AdminPage>
      </Route>
      <Route path="/admin/projects">
        <AdminPage><AdminProjects /></AdminPage>
      </Route>
      <Route path="/admin/settings">
        <AdminPage><AdminSettings /></AdminPage>
      </Route>
      <Route path="/admin/leads">
        <AdminPage><AdminLeads /></AdminPage>
      </Route>
      <Route path="/admin/square">
        <AdminPage><AdminSquare /></AdminPage>
      </Route>
      <Route path="/admin/content">
        <AdminPage><AdminContent /></AdminPage>
      </Route>
      <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <WhatsAppButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
