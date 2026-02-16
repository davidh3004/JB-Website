import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { BRAND } from "@/lib/brand";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white/90 dark:bg-background/90 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60 transition-all duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
      data-testid="navbar"
    >
      <div className={`max-w-6xl mx-auto px-6 flex items-center justify-between gap-4 transition-all duration-200 ${
        scrolled ? "h-14" : "h-16"
      }`}>
        <Link href="/">
          <span className="relative flex items-center gap-2.5 cursor-pointer group" data-testid="link-logo">
            <span
              className="absolute inset-0 -m-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 40% 40%, rgba(37,99,235,0.10), transparent 65%)",
              }}
            />
            <img
              src={BRAND.logoMark}
              alt="JB Websites"
              className={`relative transition-all duration-200 mix-blend-multiply dark:mix-blend-screen ${
                scrolled ? "h-8" : "h-10"
              }`}
              style={{ objectFit: "contain" }}
            />
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
