import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { MagneticDockNav } from "./MagneticDockNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/site-content";
import { phoneHref } from "@/content/eduarc";

export const navItems = [
  { to: "/about", label: "About" },
  { to: "/mentors", label: "Mentors" },
  { to: "/programs", label: "Programs" },
  { to: "/features", label: "Features" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const menuRef = useRef<HTMLDivElement>(null);
  const { contact } = useSiteContent();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Close menu when viewport resizes to desktop width
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768 && open) {
        setOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-hairline/80 transition-all duration-200",
          open ? "bg-white" : "glass-nav",
        )}
      >
        <div className="container-wide flex h-16 items-center justify-between">
          <BrandLogo />

          {/* Desktop Navigation with macOS Dock Magnetic Hover and Sliding Indicator */}
          <MagneticDockNav />

          {/* Desktop Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="pill-gold" size="pill-sm">
              <Link to="/partner" className="gap-1.5">
                <span>Partner with us</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface md:hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer (Rendered into document.body to prevent containing-block clipping) */}
      {mounted &&
        open &&
        createPortal(
          <div
            id="mobile-nav"
            ref={menuRef}
            className="fixed inset-x-0 top-16 bottom-0 z-50 bg-white md:hidden overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="container-wide py-6 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
              <div>
                <nav
                  className="flex flex-col divide-y divide-hairline"
                  aria-label="Mobile navigation"
                >
                  {navItems.map((item) => {
                    const isActive = pathname === item.to || pathname.startsWith(item.to + "/");

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "py-4 text-lg font-semibold transition-colors flex items-center justify-between",
                          isActive
                            ? "text-primary font-bold"
                            : "text-foreground hover:text-primary",
                        )}
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="h-4 w-4 text-accent" />
                      </Link>
                    );
                  })}
                </nav>

                <div className="pt-6 mt-4 border-t border-hairline flex flex-col gap-3">
                  <Button asChild variant="pill-gold" size="pill" className="w-full justify-center">
                    <Link to="/partner" onClick={() => setOpen(false)}>
                      Partner with us
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="pill-outline"
                    size="pill"
                    className="w-full justify-center"
                  >
                    <Link to="/contact" onClick={() => setOpen(false)}>
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Bottom Quick Help & Legal */}
              <div className="pt-6 mt-8 border-t border-hairline/80 flex flex-col gap-3 text-xs text-muted-foreground pb-8">
                <div className="flex items-center justify-between">
                  <span>Helpline:</span>
                  <a
                    href={phoneHref(contact.phone)}
                    className="font-semibold text-primary hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email:</span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-semibold text-accent hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="pt-2 text-center border-t border-hairline/60">
                  <Link
                    to="/privacy-policy"
                    onClick={() => setOpen(false)}
                    className="text-[11px] text-muted-foreground hover:text-primary hover:underline"
                  >
                    Privacy Policy &amp; Data Protection
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
