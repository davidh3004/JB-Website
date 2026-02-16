import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
import { LayoutDashboard, FolderOpen, Settings, MessageSquare, CreditCard, LogOut, ExternalLink } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User } from "@shared/schema";

const menuItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Projects", href: "/admin/projects", icon: FolderOpen },
  { title: "Site Settings", href: "/admin/settings", icon: Settings },
  { title: "Leads", href: "/admin/leads", icon: MessageSquare },
  { title: "Square", href: "/admin/square", icon: CreditCard },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user } = useQuery<User>({ queryKey: ["/api/auth/me"] });

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
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  JB<span className="text-blue-600">Admin</span>
                </span>
              </div>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={location === item.href} data-testid={`link-admin-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
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
                      <a href="/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink />
                        <span>View Site</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} data-testid="button-logout">
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
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            {user && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {user.name} <span className="text-xs capitalize">({user.role})</span>
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
