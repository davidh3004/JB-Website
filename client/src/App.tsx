import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RequireAuth } from "@/lib/auth";
import { AdminLayout } from "@/components/admin-layout";
import { CrmLayout } from "@/components/crm-layout";
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
import CrmDashboard from "@/pages/crm/dashboard";
import CrmLeads from "@/pages/crm/leads";
import LeadDetail from "@/pages/crm/lead-detail";
import CrmSearch from "@/pages/crm/search";
import CrmAdminUsers from "@/pages/crm/admin-users";
import CrmAdminAudit from "@/pages/crm/admin-audit";

function AdminPage({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AdminLayout>{children}</AdminLayout>
    </RequireAuth>
  );
}

function CrmPage({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <CrmLayout>{children}</CrmLayout>
    </RequireAuth>
  );
}

function Router() {
  return (
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
      <Route path="/app">
        <CrmPage><CrmDashboard /></CrmPage>
      </Route>
      <Route path="/app/leads">
        <CrmPage><CrmLeads /></CrmPage>
      </Route>
      <Route path="/app/leads/:id">
        {(params) => (
          <CrmPage><LeadDetail params={params} /></CrmPage>
        )}
      </Route>
      <Route path="/app/search">
        <CrmPage><CrmSearch /></CrmPage>
      </Route>
      <Route path="/app/admin/users">
        <CrmPage><CrmAdminUsers /></CrmPage>
      </Route>
      <Route path="/app/admin/audit">
        <CrmPage><CrmAdminAudit /></CrmPage>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
