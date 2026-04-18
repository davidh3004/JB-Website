import { Link } from "wouter";
import { SiInstagram, SiTiktok, SiYoutube, SiLinkedin } from "react-icons/si";
import { BRAND } from "@/lib/brand";
import { useQuery } from "@tanstack/react-query";

export function Footer() {
  const { data: settings } = useQuery<any>({ queryKey: ["/api/settings"] });
  const sl = settings?.socialLinks || {};
  const ci = settings?.contactInfo || {};

  return (
    <footer className="relative bg-white dark:bg-zinc-950 border-t border-slate-200/80 dark:border-white/8 overflow-hidden" data-testid="footer">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-500 to-transparent opacity-60" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={BRAND.logoMark}
                alt="JB Websites"
                className="h-40 w-auto mix-blend-multiply dark:mix-blend-screen mt-[-30px]"
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Custom-coded websites and ongoing support for businesses that take their online presence seriously.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5 mt-5">
              {[
                { icon: SiInstagram, label: "Instagram", href: sl.instagram || "#" },
                { icon: SiTiktok, label: "TikTok", href: sl.tiktok || "#" },
                { icon: SiYoutube, label: "YouTube", href: sl.youtube || "#" },
                { icon: SiLinkedin, label: "LinkedIn", href: sl.linkedin || "#" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/6 border border-slate-200 dark:border-white/8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white hover:bg-indigo-600/80 hover:border-indigo-500/50 transition-all duration-200"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Pages column */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-xs uppercase tracking-widest">Pages</h4>
            <div className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="block text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white cursor-pointer transition-colors duration-150"
                    data-testid={`link-footer-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Services column */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-xs uppercase tracking-widest">Services</h4>
            <div className="space-y-2.5">
              {[
                "Custom Websites",
                "Social Media",
                "SEO & Ads",
                "AI Automation",
                "Monthly Plans",
              ].map((s) => (
                <Link key={s} href="/services">
                  <span className="block text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white cursor-pointer transition-colors duration-150">
                    {s}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-xs uppercase tracking-widest">Company</h4>
            <div className="space-y-2.5">
              <Link href="/contact">
                <span className="block text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white cursor-pointer transition-colors" data-testid="link-footer-contact">
                  Contact
                </span>
              </Link>
              <Link href="/about">
                <span className="block text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white cursor-pointer transition-colors">
                  About Us
                </span>
              </Link>
              <a href="#" className="block text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors" data-testid="link-footer-privacy">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors" data-testid="link-footer-terms">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-500" data-testid="text-copyright">
            © {new Date().getFullYear()} JB Websites. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-600">
            Custom-coded. No templates.
          </p>
        </div>
      </div>
    </footer>
  );
}
