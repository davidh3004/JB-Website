import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Phone, Search, LogOut, ExternalLink, Shield, ScrollText } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BRAND } from "@/lib/brand";
import type { User } from "@shared/schema";

const callerMenu = [
  { title: "Dashboard", href: "/app", icon: LayoutDashboard },
  { title: "My Leads", href: "/app/leads", icon: Users },
  { title: "Search", href: "/app/search", icon: Search },
];

const adminMenu = [
  { title: "Dashboard", href: "/app", icon: LayoutDashboard },
  { title: "All Leads", href: "/app/leads", icon: Users },
  { title: "Search", href: "/app/search", icon: Search },
  { title: "Users", href: "/app/admin/users", icon: Shield },
  { title: "Audit Log", href: "/app/admin/audit", icon: ScrollText },
];

export function CrmLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user } = useQuery<User>({ queryKey: ["/api/auth/me"] });

  const isAdmin = user?.role === "admin";
  const menu = isAdmin ? adminMenu : callerMenu;

  const handleLogout = async () => {
    await apiRequest("POST", "/api/auth/logout");
    queryClient.clear();
    setLocation("/admin/login");
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="px-3 py-4">
                <img src={BRAND.logoMark} alt="JB CRM" className="h-7 mix-blend-multiply dark:mix-blend-screen" style={{ objectFit: "contain" }} />
              </div>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>CRM</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menu.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={location === item.href} data-testid={`link-crm-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin">
                        <ExternalLink />
                        <span>Admin Portal</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} data-testid="button-crm-logout">
                      <LogOut />
                      <span>Sign Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 p-3 border-b border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-background">
            <SidebarTrigger data-testid="button-crm-sidebar-toggle" />
            {user && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {user.name} <span className="text-xs capitalize bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{user.role}</span>
              </span>
            )}
          </header>
          <main className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
