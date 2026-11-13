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
  Handshake,
  Headphones,
  PhoneCall,
  Mail,
  ShieldCheck,
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
  const [revealedItem, setRevealedItem] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const menuRef = useRef<HTMLDivElement>(null);
  const { contact } = useSiteContent();

  const handleItemClick = (e: React.MouseEvent, targetId: string) => {
    // If not yet revealed on touch or initial tap: reveal page name before redirect
    if (revealedItem !== targetId) {
      e.preventDefault();
      setRevealedItem(targetId);
      return;
    }
    // If already revealed (user is hovering or tapped second time): redirect & close
    setOpen(false);
    setRevealedItem(null);
  };

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

      {/* Mobile iOS-Inspired Dynamic Floating Capsule Dock */}
      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Frosted backdrop overlay */}
            <div
              className="fixed inset-0 top-16 bg-black/20 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Minimal Apple-Style Floating Capsule Dock */}
            <div
              id="mobile-nav"
              ref={menuRef}
              className="fixed top-18 right-3 sm:right-6 z-50 w-[52px] sm:w-[56px] rounded-[28px] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_20px_45px_rgba(15,23,42,0.14),0_0_0_1px_rgba(0,0,0,0.04)] p-1.5 flex flex-col items-center gap-1.5 animate-in fade-in slide-in-from-top-3 duration-300 max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar"
              aria-label="Mobile navigation"
            >
              {/* Primary Pages as Minimal Icons */}
              <nav className="flex flex-col items-center gap-1.5" aria-label="Pages">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
                  const isRevealed = revealedItem === item.to;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={(e) => handleItemClick(e, item.to)}
                      onMouseEnter={() => setRevealedItem(item.to)}
                      onMouseLeave={() => setRevealedItem(null)}
                      onFocus={() => setRevealedItem(item.to)}
                      onBlur={() => setRevealedItem(null)}
                      aria-label={item.label}
                      className="relative group flex items-center justify-center cursor-pointer select-none"
                    >
                      {/* Minimal Floating Label Pill on Left */}
                      <div
                        className={cn(
                          "absolute right-[48px] sm:right-[52px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.22)] border border-white/10 text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 ease-out",
                          isRevealed
                            ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                            : "opacity-0 translate-x-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                        )}
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="h-3 w-3 text-[#d4a373] shrink-0" />
                      </div>

                      {/* Minimal Monochrome Icon Tile */}
                      <div
                        className={cn(
                          "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200",
                          isActive
                            ? "bg-[#172621] text-white shadow-xs"
                            : isRevealed
                              ? "bg-[#172621] text-white shadow-xs scale-105"
                              : "text-foreground/75 hover:text-foreground hover:bg-black/5 active:scale-95",
                        )}
                      >
                        <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Minimal Frosted Divider */}
              <div className="w-5 h-px bg-black/8 my-0.5" />

              {/* Quick Actions (Partner with us & Contact Support) */}
              <div className="flex flex-col items-center gap-1.5" aria-label="Actions">
                {/* Partner with us */}
                <Link
                  to="/partner"
                  onClick={(e) => handleItemClick(e, "/partner")}
                  onMouseEnter={() => setRevealedItem("/partner")}
                  onMouseLeave={() => setRevealedItem(null)}
                  onFocus={() => setRevealedItem("/partner")}
                  onBlur={() => setRevealedItem(null)}
                  aria-label="Partner with us"
                  className="relative group flex items-center justify-center cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "absolute right-[48px] sm:right-[52px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.22)] border border-white/10 text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 ease-out",
                      revealedItem === "/partner"
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-x-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    )}
                  >
                    <span>Partner with us</span>
                    <ArrowUpRight className="h-3 w-3 text-[#d4a373] shrink-0" />
                  </div>
                  <div
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200",
                      revealedItem === "/partner"
                        ? "bg-[#172621] text-white shadow-xs scale-105"
                        : "text-foreground/75 hover:text-foreground hover:bg-black/5 active:scale-95",
                    )}
                  >
                    <Handshake className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </div>
                </Link>

                {/* Contact Support */}
                <Link
                  to="/contact"
                  onClick={(e) => handleItemClick(e, "/contact-support")}
                  onMouseEnter={() => setRevealedItem("/contact-support")}
                  onMouseLeave={() => setRevealedItem(null)}
                  onFocus={() => setRevealedItem("/contact-support")}
                  onBlur={() => setRevealedItem(null)}
                  aria-label="Contact Support"
                  className="relative group flex items-center justify-center cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "absolute right-[48px] sm:right-[52px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.22)] border border-white/10 text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 ease-out",
                      revealedItem === "/contact-support"
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-x-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    )}
                  >
                    <span>Contact Support</span>
                    <ArrowUpRight className="h-3 w-3 text-[#d4a373] shrink-0" />
                  </div>
                  <div
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200",
                      revealedItem === "/contact-support"
                        ? "bg-[#172621] text-white shadow-xs scale-105"
                        : "text-foreground/75 hover:text-foreground hover:bg-black/5 active:scale-95",
                    )}
                  >
                    <Headphones className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </div>
                </Link>
              </div>

              {/* Minimal Frosted Divider */}
              <div className="w-5 h-px bg-black/8 my-0.5" />

              {/* Dynamic Helpline, Email & Privacy Policy */}
              <div className="flex flex-col items-center gap-1.5" aria-label="Direct Contact">
                {/* Helpline */}
                <a
                  href={phoneHref(contact.phone)}
                  onClick={(e) => handleItemClick(e, "helpline")}
                  onMouseEnter={() => setRevealedItem("helpline")}
                  onMouseLeave={() => setRevealedItem(null)}
                  onFocus={() => setRevealedItem("helpline")}
                  onBlur={() => setRevealedItem(null)}
                  aria-label={`Helpline: ${contact.phone}`}
                  className="relative group flex items-center justify-center cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "absolute right-[48px] sm:right-[52px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.22)] border border-white/10 text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 ease-out",
                      revealedItem === "helpline"
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-x-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    )}
                  >
                    <span>Helpline: {contact.phone}</span>
                    <ArrowUpRight className="h-3 w-3 text-[#d4a373] shrink-0" />
                  </div>
                  <div
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200",
                      revealedItem === "helpline"
                        ? "bg-[#172621] text-white shadow-xs scale-105"
                        : "text-foreground/75 hover:text-foreground hover:bg-black/5 active:scale-95",
                    )}
                  >
                    <PhoneCall className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contact.email}`}
                  onClick={(e) => handleItemClick(e, "email")}
                  onMouseEnter={() => setRevealedItem("email")}
                  onMouseLeave={() => setRevealedItem(null)}
                  onFocus={() => setRevealedItem("email")}
                  onBlur={() => setRevealedItem(null)}
                  aria-label={`Email: ${contact.email}`}
                  className="relative group flex items-center justify-center cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "absolute right-[48px] sm:right-[52px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.22)] border border-white/10 text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 ease-out",
                      revealedItem === "email"
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-x-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    )}
                  >
                    <span>{contact.email}</span>
                    <ArrowUpRight className="h-3 w-3 text-[#d4a373] shrink-0" />
                  </div>
                  <div
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200",
                      revealedItem === "email"
                        ? "bg-[#172621] text-white shadow-xs scale-105"
                        : "text-foreground/75 hover:text-foreground hover:bg-black/5 active:scale-95",
                    )}
                  >
                    <Mail className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </div>
                </a>

                {/* Privacy Policy */}
                <Link
                  to="/privacy-policy"
                  onClick={(e) => handleItemClick(e, "/privacy-policy")}
                  onMouseEnter={() => setRevealedItem("/privacy-policy")}
                  onMouseLeave={() => setRevealedItem(null)}
                  onFocus={() => setRevealedItem("/privacy-policy")}
                  onBlur={() => setRevealedItem(null)}
                  aria-label="Privacy Policy"
                  className="relative group flex items-center justify-center cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "absolute right-[48px] sm:right-[52px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.22)] border border-white/10 text-xs font-medium tracking-wide whitespace-nowrap pointer-events-none transition-all duration-200 ease-out",
                      revealedItem === "/privacy-policy"
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-x-2 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    )}
                  >
                    <span>Privacy Policy</span>
                    <ArrowUpRight className="h-3 w-3 text-[#d4a373] shrink-0" />
                  </div>
                  <div
                    className={cn(
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200",
                      revealedItem === "/privacy-policy"
                        ? "bg-[#172621] text-white shadow-xs scale-105"
                        : "text-foreground/75 hover:text-foreground hover:bg-black/5 active:scale-95",
                    )}
                  >
                    <ShieldCheck className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </div>
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
