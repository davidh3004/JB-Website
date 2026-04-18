import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { useQuery } from "@tanstack/react-query";

const links = [
  { href: "/",         label: "Home"      },
  { href: "/services", label: "Services"  },
  { href: "/portfolio",label: "Portfolio" },
  { href: "/about",    label: "About"     },
  { href: "/contact",  label: "Contact"   },
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

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useDarkMode();

  const { data: settings } = useQuery<any>({ queryKey: ["/api/settings"] });
  const quoteLink = settings?.ctaLinks?.quote || "/contact";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-50/40 dark:bg-zinc-950/40 backdrop-blur-2xl border-b border-indigo-100/60 dark:border-zinc-800/60 dark:shadow-none"
          : "bg-transparent border-b border-transparent"
      }`}
      data-testid="navbar"
    >
      <div className={`max-w-6xl mx-auto px-6 flex items-center justify-between gap-4 transition-all duration-300 ${
        scrolled ? "h-16" : "h-20"
      }`}>

        {/* Logo */}
        <Link href="/">
          <span className="relative flex items-center gap-2.5 cursor-pointer group" data-testid="link-logo">
            <span
              className="absolute inset-0 -m-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.12), transparent 65%)" }}
            />
            <motion.img
              src={BRAND.logoMark}
              alt="JB Websites"
              className={`relative transition-all duration-300 mix-blend-multiply dark:mix-blend-screen w-auto shrink-0 my-[-16px] ${
                scrolled ? "h-20 md:h-24" : "h-24 md:h-28"
              }`}
              style={{ objectFit: "contain" }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            />
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <span
                  className={`relative px-3.5 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors duration-150 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-indigo-500"
                      layoutId="nav-underline"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-colors"
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link href={quoteLink}>
            <Button
              className="shimmer-btn bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-0 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200"
              data-testid="button-nav-quote"
            >
              Get a Quote
            </Button>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            className="p-2 rounded-md text-slate-600 dark:text-slate-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-t border-slate-200/60 dark:border-white/8 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                      location === link.href
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                    onClick={() => setMobileOpen(false)}
                    data-testid={`link-mobile-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="pt-3 pb-1">
                <Link href={quoteLink}>
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-0 shadow-md"
                    onClick={() => setMobileOpen(false)}
                    data-testid="button-mobile-quote"
                  >
                    Get a Quote
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
