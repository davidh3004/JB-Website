import { Link } from "wouter";
import { SiInstagram, SiTiktok, SiYoutube, SiLinkedin } from "react-icons/si";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-background border-t border-slate-200/60 dark:border-slate-800/60 py-12" data-testid="footer">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <img src={BRAND.logoMark} alt="JB Websites" className="h-8 mix-blend-multiply dark:mix-blend-screen" style={{ objectFit: "contain" }} />
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Custom-coded websites and ongoing support for businesses that take their online presence seriously.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Pages</h4>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="block text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" data-testid={`link-footer-${link.label.toLowerCase()}`}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Support</h4>
            <div className="space-y-2">
              <Link href="/contact">
                <span className="block text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" data-testid="link-footer-contact">Contact</span>
              </Link>
              <Link href="/privacy">
                <span className="block text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" data-testid="link-footer-privacy">Privacy Policy</span>
              </Link>
              <Link href="/terms">
                <span className="block text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors" data-testid="link-footer-terms">Terms of Service</span>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex items-center gap-3">
              {[
                { icon: SiInstagram, label: "Instagram" },
                { icon: SiTiktok, label: "TikTok" },
                { icon: SiYoutube, label: "YouTube" },
                { icon: SiLinkedin, label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-9 h-9 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500" data-testid="text-copyright">
            &copy; {new Date().getFullYear()} JB Websites. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
