import { Link, useLocation } from "wouter";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
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
import {
  LayoutDashboard, FolderOpen, Settings, MessageSquare,
  CreditCard, LogOut, ExternalLink, FileEdit,
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { BRAND } from "@/lib/brand";

const menuItems = [
  { title: "Dashboard",    href: "/admin",          icon: LayoutDashboard },
  { title: "Leads",        href: "/admin/leads",    icon: MessageSquare   },
  { title: "Projects",     href: "/admin/projects", icon: FolderOpen      },
  { title: "Content",      href: "/admin/content",  icon: FileEdit        },
  { title: "Site Settings",href: "/admin/settings", icon: Settings        },
  { title: "Square",       href: "/admin/square",   icon: CreditCard      },
];

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("jb-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("jb-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("jb-theme", "light");
    }
  }, [dark]);

  return [dark, setDark] as const;
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [dark, setDark] = useDarkMode();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    setLocation("/admin/login");
  };

  const style = {
    "--sidebar-width":      "15rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-slate-50/80 dark:bg-zinc-950">
        <Sidebar className="border-r border-slate-200/60 dark:border-white/8">
          <SidebarContent className="bg-white dark:bg-zinc-900 h-full">
            {/* Logo */}
            <SidebarGroup>
              <div className="px-4 py-6 border-b border-slate-100 dark:border-white/6">
                <img
                  src={BRAND.logoMark}
                  alt="JB Websites Admin"
                  className="h-40 w-auto mix-blend-multiply dark:mix-blend-screen my-[-50px]"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </SidebarGroup>

            {/* Navigation */}
            <SidebarGroup className="pt-3">
              <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 px-4 mb-1">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={`mx-2 rounded-lg transition-all duration-150 ${
                            isActive
                              ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                          }`}
                          data-testid={`link-admin-${item.title.toLowerCase().replace(/\s/g, "-")}`}
                        >
                          <Link href={item.href} className="flex items-center gap-3 px-3 py-2.5">
                            <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                            <span className="text-sm">{item.title}</span>
                            {isActive && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Bottom actions */}
            <SidebarGroup className="mt-auto border-t border-slate-100 dark:border-white/6 pt-3 pb-3">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="mx-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5">
                      <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5">
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">View Site</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className="mx-2 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-3 px-3 py-2.5 w-full"
                      data-testid="button-logout"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 px-5 py-3 border-b border-slate-200/60 dark:border-white/8 bg-white dark:bg-zinc-900 h-14 flex-shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" className="text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white" />
            {user && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDark(!dark)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-colors"
                  aria-label="Toggle theme"
                >
                  {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-medium text-slate-900 dark:text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 capitalize mt-0.5">{user.role}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </header>
          <main className="flex-1 overflow-auto p-6 bg-slate-50/80 dark:bg-zinc-950">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
