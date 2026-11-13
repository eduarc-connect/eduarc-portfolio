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
  {
    to: "/about",
    label: "About",
    icon: Compass,
    tileClass: "text-amber-700 bg-amber-500/15 hover:bg-amber-600 hover:text-white",
  },
  {
    to: "/mentors",
    label: "Mentors",
    icon: GraduationCap,
    tileClass: "text-indigo-700 bg-indigo-500/15 hover:bg-indigo-600 hover:text-white",
  },
  {
    to: "/programs",
    label: "Programs",
    icon: BookOpen,
    tileClass: "text-emerald-700 bg-emerald-500/15 hover:bg-emerald-600 hover:text-white",
  },
  {
    to: "/features",
    label: "Features",
    icon: Sparkles,
    tileClass: "text-purple-700 bg-purple-500/15 hover:bg-purple-600 hover:text-white",
  },
  {
    to: "/testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
    tileClass: "text-rose-700 bg-rose-500/15 hover:bg-rose-600 hover:text-white",
  },
  {
    to: "/contact",
    label: "Contact",
    icon: Phone,
    tileClass: "text-teal-700 bg-teal-500/15 hover:bg-teal-600 hover:text-white",
  },
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

            {/* Apple-Style Vertical Floating Dock */}
            <div
              id="mobile-nav"
              ref={menuRef}
              className="fixed top-18 right-3 sm:right-6 z-50 w-[58px] sm:w-[62px] rounded-[30px] bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.18),0_0_0_1px_rgba(0,0,0,0.06)] p-2 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-300 max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar"
              aria-label="Mobile navigation"
            >
              {/* Primary Pages as iOS Squircle Tiles */}
              <nav className="flex flex-col items-center gap-2" aria-label="Pages">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
                  const isHovered = hoveredItem === item.to;

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
                      className="relative group flex items-center justify-center cursor-pointer select-none"
                    >
                      {/* iOS Liquid Glass Pill Floating to Left */}
                      <div
                        className={cn(
                          "absolute right-[54px] sm:right-[58px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.25)] border border-white/15 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ease-out",
                          isHovered
                            ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                            : "opacity-0 translate-x-2.5 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                        )}
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#d4a373] shrink-0" />
                      </div>

                      {/* iOS Squircle Tile */}
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] flex items-center justify-center transition-all duration-300",
                          isActive
                            ? "bg-[#172621] text-white shadow-md ring-2 ring-[#965f33]/40 scale-105"
                            : cn(item.tileClass, "group-hover:scale-105 active:scale-95 shadow-2xs"),
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* iOS Frosted Divider */}
              <div className="w-6 h-px bg-black/10 my-0.5" />

              {/* Quick Actions (Partner with us & Contact Support) */}
              <div className="flex flex-col items-center gap-2" aria-label="Actions">
                {/* Partner with us */}
                <Link
                  to="/partner"
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setHoveredItem("partner")}
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() => setHoveredItem("partner")}
                  onBlur={() => setHoveredItem(null)}
                  aria-label="Partner with us"
                  className="relative group flex items-center justify-center cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "absolute right-[54px] sm:right-[58px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.25)] border border-white/15 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ease-out",
                      hoveredItem === "partner"
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-x-2.5 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    )}
                  >
                    <span>Partner with us</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#d4a373] shrink-0" />
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-[#965f33]/15 text-[#965f33] hover:bg-[#965f33] hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-2xs">
                    <Handshake className="h-5 w-5" />
                  </div>
                </Link>

                {/* Contact Support */}
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setHoveredItem("support")}
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() => setHoveredItem("support")}
                  onBlur={() => setHoveredItem(null)}
                  aria-label="Contact Support"
                  className="relative group flex items-center justify-center cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "absolute right-[54px] sm:right-[58px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.25)] border border-white/15 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ease-out",
                      hoveredItem === "support"
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-x-2.5 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    )}
                  >
                    <span>Contact Support</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#d4a373] shrink-0" />
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-slate-500/15 text-slate-700 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-2xs">
                    <Headphones className="h-5 w-5" />
                  </div>
                </Link>
              </div>

              {/* iOS Frosted Divider */}
              <div className="w-6 h-px bg-black/10 my-0.5" />

              {/* Dynamic Helpline, Email & Privacy Policy */}
              <div className="flex flex-col items-center gap-2" aria-label="Direct Contact">
                {/* Helpline */}
                <a
                  href={phoneHref(contact.phone)}
                  onMouseEnter={() => setHoveredItem("helpline")}
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() => setHoveredItem("helpline")}
                  onBlur={() => setHoveredItem(null)}
                  aria-label={`Helpline: ${contact.phone}`}
                  className="relative group flex items-center justify-center cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "absolute right-[54px] sm:right-[58px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.25)] border border-white/15 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ease-out",
                      hoveredItem === "helpline"
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-x-2.5 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    )}
                  >
                    <span>Helpline: {contact.phone}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#d4a373] shrink-0" />
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-green-500/15 text-green-700 hover:bg-green-600 hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-2xs">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contact.email}`}
                  onMouseEnter={() => setHoveredItem("email")}
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() => setHoveredItem("email")}
                  onBlur={() => setHoveredItem(null)}
                  aria-label={`Email: ${contact.email}`}
                  className="relative group flex items-center justify-center cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "absolute right-[54px] sm:right-[58px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.25)] border border-white/15 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ease-out",
                      hoveredItem === "email"
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-x-2.5 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    )}
                  >
                    <span>{contact.email}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#d4a373] shrink-0" />
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-sky-500/15 text-sky-700 hover:bg-sky-600 hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-2xs">
                    <Mail className="h-5 w-5" />
                  </div>
                </a>

                {/* Privacy Policy */}
                <Link
                  to="/privacy-policy"
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setHoveredItem("privacy")}
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() => setHoveredItem("privacy")}
                  onBlur={() => setHoveredItem(null)}
                  aria-label="Privacy Policy"
                  className="relative group flex items-center justify-center cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "absolute right-[54px] sm:right-[58px] top-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172621]/95 text-white backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.25)] border border-white/15 text-xs font-semibold tracking-wide whitespace-nowrap pointer-events-none transition-all duration-200 ease-out",
                      hoveredItem === "privacy"
                        ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-x-2.5 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    )}
                  >
                    <span>Privacy Policy</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#d4a373] shrink-0" />
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-neutral-500/15 text-neutral-600 hover:bg-neutral-600 hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-2xs">
                    <ShieldCheck className="h-5 w-5" />
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
