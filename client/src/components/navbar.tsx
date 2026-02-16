import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60" data-testid="navbar">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/">
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight cursor-pointer" data-testid="link-logo">
            JB<span className="text-blue-600">Websites</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                  location === link.href
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/contact">
            <Button data-testid="button-nav-quote">Get a Quote</Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-md text-slate-600 dark:text-slate-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-background px-6 py-4 space-y-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`block px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                  location === link.href
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-950/30"
                    : "text-slate-600 dark:text-slate-300"
                }`}
                onClick={() => setMobileOpen(false)}
                data-testid={`link-mobile-${link.label.toLowerCase()}`}
              >
                {link.label}
              </span>
            </Link>
          ))}
          <div className="pt-3">
            <Link href="/contact">
              <Button className="w-full" onClick={() => setMobileOpen(false)} data-testid="button-mobile-quote">Get a Quote</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
