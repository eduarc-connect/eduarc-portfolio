import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  Compass,
  GraduationCap,
  BookOpen,
  Sparkles,
  MessageSquareQuote,
  Phone,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { MagneticDockNav } from "./MagneticDockNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/site-content";
import { phoneHref } from "@/content/eduarc";

export const navItems = [
  { to: "/about", label: "About", icon: Compass },
  { to: "/mentors", label: "Mentors", icon: GraduationCap },
  { to: "/programs", label: "Programs", icon: BookOpen },
  { to: "/features", label: "Features", icon: Sparkles },
  { to: "/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/contact", label: "Contact", icon: Phone },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
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

      {/* Mobile Navigation Dropdown (Rendered into document.body to prevent containing-block clipping) */}
      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 top-16 bg-black/25 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Dropdown Card Anchored below Menu Toggle Button */}
            <div
              id="mobile-nav"
              ref={menuRef}
              className="fixed top-18 right-3 sm:right-6 z-50 w-auto min-w-[270px] max-w-[calc(100vw-1.5rem)] rounded-3xl bg-white/95 backdrop-blur-xl border border-hairline/90 shadow-2xl p-4 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-3 duration-300"
              aria-label="Mobile navigation"
            >
              {/* Header Label inside Dropdown */}
              <div className="flex items-center justify-between px-1.5 pt-0.5 pb-2 border-b border-hairline/70">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Menu Pages
                </span>
                <span className="text-[10px] text-[#965f33] font-bold bg-[#FAF9F5] px-2.5 py-0.5 rounded-full border border-hairline">
                  EDUARC
                </span>
              </div>

              {/* List of Pages as Icons with Smooth Expansion on Hover */}
              <nav
                className="flex flex-col items-end gap-2 py-1"
                aria-label="Pages"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
                  const isHovered = hoveredItem === item.to;
                  const isExpanded = isHovered;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setHoveredItem(item.to)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onFocus={() => setHoveredItem(item.to)}
                      onBlur={() => setHoveredItem(null)}
                      aria-label={item.label}
                      className={cn(
                        "group flex items-center justify-end rounded-full transition-all duration-300 ease-out cursor-pointer select-none",
                        isActive
                          ? "bg-[#243B35] text-white shadow-sm ring-1 ring-[#243B35]/30 font-semibold"
                          : isHovered
                            ? "bg-[#243B35] text-white shadow-md scale-[1.02]"
                            : "bg-[#FAF9F5] hover:bg-[#243B35] hover:text-white text-brand-navy border border-hairline/80 shadow-2xs",
                        isExpanded ? "pl-4 pr-1.5 py-1.5" : "p-1.5",
                      )}
                    >
                      {/* Expanding Page Name Label */}
                      <div
                        className={cn(
                          "overflow-hidden whitespace-nowrap transition-all duration-300 ease-out flex items-center gap-2",
                          isExpanded
                            ? "max-w-[200px] opacity-100 mr-2.5"
                            : "max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:mr-2.5",
                        )}
                      >
                        <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-accent shrink-0" />
                      </div>

                      {/* Icon Circle */}
                      <div
                        className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all duration-300",
                          isActive || isHovered
                            ? "bg-white/20 text-white"
                            : "bg-white text-brand-navy group-hover:bg-white/20 group-hover:text-white shadow-2xs",
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-hairline flex flex-col gap-2">
                <Button
                  asChild
                  variant="pill-gold"
                  size="pill"
                  className="w-full justify-center h-9 text-xs font-semibold shadow-xs"
                >
                  <Link to="/partner" onClick={() => setOpen(false)}>
                    Partner with us
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="pill-outline"
                  size="pill"
                  className="w-full justify-center h-9 text-xs font-semibold"
                >
                  <Link to="/contact" onClick={() => setOpen(false)}>
                    Contact Support
                  </Link>
                </Button>
              </div>

              {/* Bottom Quick Help & Legal */}
              <div className="pt-2.5 border-t border-hairline/80 flex flex-col gap-2 text-xs text-muted-foreground pb-1">
                <div className="flex items-center justify-between gap-3">
                  <span>Helpline:</span>
                  <a
                    href={phoneHref(contact.phone)}
                    className="font-semibold text-primary hover:underline tabular-nums"
                  >
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Email:</span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-semibold text-accent hover:underline truncate max-w-[170px]"
                    title={contact.email}
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="pt-1.5 text-center border-t border-hairline/60">
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
