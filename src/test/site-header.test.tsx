import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { SiteHeader, navItems } from "@/components/site/SiteHeader";

type MockLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to?: string;
  activeProps?: Record<string, unknown>;
};

// Mock @tanstack/react-router Link and useRouterState
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    onClick,
    className,
    activeProps: _activeProps,
    ...props
  }: MockLinkProps) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      className={className}
      {...props}
    >
      {children}
    </a>
  ),
  useRouterState: vi.fn(() => "/"),
}));

const mockSiteContent = {
  contact: {
    phone: "+91 95357 21089",
    email: "eduarc.connect@gmail.com",
    website: "www.eduarc-connect.in",
  },
};

vi.mock("@/lib/site-content", () => ({
  useSiteContent: () => mockSiteContent,
}));

describe("SiteHeader & Mobile Navigation Drawer", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    // Clean up any remaining portals in document.body
    const existing = document.getElementById("mobile-nav");
    if (existing) {
      existing.remove();
    }
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("exports correct navigation items for EDUARC", () => {
    expect(navItems).toHaveLength(6);
    expect(navItems.map((item) => item.to)).toEqual([
      "/about",
      "/mentors",
      "/programs",
      "/features",
      "/testimonials",
      "/contact",
    ]);
  });

  it("renders closed mobile menu by default with glass-nav class and accessible attributes", () => {
    const { container } = render(<SiteHeader />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("glass-nav");
    expect(header).not.toHaveClass("bg-white");

    const toggleBtn = screen.getByRole("button", { name: /open navigation menu/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
    expect(toggleBtn).toHaveAttribute("aria-controls", "mobile-nav");

    // Drawer should not be in the document
    expect(document.getElementById("mobile-nav")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("opens the mobile drawer portaled into document.body on toggle click", () => {
    const { container } = render(<SiteHeader />);
    const toggleBtn = screen.getByRole("button", { name: /open navigation menu/i });

    // Open menu
    fireEvent.click(toggleBtn);

    const header = container.querySelector("header");
    expect(header).toHaveClass("bg-white");
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");
    expect(toggleBtn).toHaveAttribute("aria-label", "Close navigation menu");

    // Drawer is mounted directly in document.body (portal verification)
    const mobileNav = document.getElementById("mobile-nav");
    expect(mobileNav).not.toBeNull();
    expect(document.body.contains(mobileNav)).toBe(true);

    // Body scroll is locked
    expect(document.body.style.overflow).toBe("hidden");

    // All navigation links exist in the mobile drawer
    navItems.forEach((item) => {
      const links = mobileNav?.querySelectorAll(`a[href="${item.to}"]`);
      expect(links && links.length > 0).toBe(true);
      expect(Array.from(links || []).some((l) => l.textContent?.includes(item.label))).toBe(true);
    });

    // Action buttons exist
    const partnerLink = mobileNav?.querySelector('a[href="/partner"]');
    expect(partnerLink?.textContent).toContain("Partner with us");

    const contactLinks = mobileNav?.querySelectorAll('a[href="/contact"]');
    expect(
      Array.from(contactLinks || []).some((link) => link.textContent?.includes("Contact Support")),
    ).toBe(true);

    // Dynamic contact info from site content and privacy policy exist
    expect(mobileNav?.textContent).toContain("+91 95357 21089");
    expect(mobileNav?.textContent).toContain("eduarc.connect@gmail.com");
    const helplineLink = mobileNav?.querySelector('a[href="tel:+919535721089"]');
    expect(helplineLink).not.toBeNull();
    const emailLink = mobileNav?.querySelector('a[href="mailto:eduarc.connect@gmail.com"]');
    expect(emailLink).not.toBeNull();
    const privacyLink = mobileNav?.querySelector('a[href="/privacy-policy"]');
    expect(privacyLink).not.toBeNull();
  });

  it("closes the drawer and unlocks body scroll when toggled again", () => {
    render(<SiteHeader />);
    const toggleBtn = screen.getByRole("button", { name: /open navigation menu/i });

    // Open
    fireEvent.click(toggleBtn);
    expect(document.getElementById("mobile-nav")).not.toBeNull();
    expect(document.body.style.overflow).toBe("hidden");

    // Close
    fireEvent.click(toggleBtn);
    expect(document.getElementById("mobile-nav")).toBeNull();
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the mobile drawer when Escape key is pressed", () => {
    render(<SiteHeader />);
    const toggleBtn = screen.getByRole("button", { name: /open navigation menu/i });

    // Open
    fireEvent.click(toggleBtn);
    expect(document.getElementById("mobile-nav")).not.toBeNull();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });

    // Menu should be closed
    expect(document.getElementById("mobile-nav")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("reveals page name on hover/first tap and opens page when clicked while revealed", () => {
    render(<SiteHeader />);
    const toggleBtn = screen.getByRole("button", { name: /open navigation menu/i });

    // Open
    fireEvent.click(toggleBtn);
    const mobileNav = document.getElementById("mobile-nav");
    expect(mobileNav).not.toBeNull();

    // Find "Mentors" link
    const mentorsLink = mobileNav?.querySelector('a[href="/mentors"]');
    expect(mentorsLink).not.toBeNull();

    // First click on unrevealed link: reveals page name without closing drawer
    fireEvent.click(mentorsLink!);
    expect(document.getElementById("mobile-nav")).not.toBeNull();

    // Second click on the revealed link: opens page and closes drawer
    fireEvent.click(mentorsLink!);
    expect(document.getElementById("mobile-nav")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the mobile drawer when hovering and then clicking a link", () => {
    render(<SiteHeader />);
    const toggleBtn = screen.getByRole("button", { name: /open navigation menu/i });

    // Open
    fireEvent.click(toggleBtn);
    const mobileNav = document.getElementById("mobile-nav");
    expect(mobileNav).not.toBeNull();

    // Mouse over "About" link reveals page name
    const aboutLink = mobileNav?.querySelector('a[href="/about"]');
    expect(aboutLink).not.toBeNull();
    fireEvent.mouseEnter(aboutLink!);

    // Click while hovered opens page and closes drawer
    fireEvent.click(aboutLink!);
    expect(document.getElementById("mobile-nav")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("automatically closes when the window is resized to desktop width (>= 768px)", () => {
    render(<SiteHeader />);
    const toggleBtn = screen.getByRole("button", { name: /open navigation menu/i });

    // Open
    fireEvent.click(toggleBtn);
    expect(document.getElementById("mobile-nav")).not.toBeNull();

    // Simulate resizing to desktop (e.g. 1024px)
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Drawer closes
    expect(document.getElementById("mobile-nav")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("renders direct route links to dedicated pages without hijacking with homepage scroll", () => {
    render(<SiteHeader />);

    // Direct route links exist with exact destination hrefs
    const aboutLink = screen.getByRole("link", { name: /^about$/i });
    const featuresLink = screen.getByRole("link", { name: /^features$/i });
    const contactLink = screen.getByRole("link", { name: /^contact$/i });

    expect(aboutLink).toHaveAttribute("href", "/about");
    expect(featuresLink).toHaveAttribute("href", "/features");
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("correctly highlights active tab when current route matches", async () => {
    const routerMock = await import("@tanstack/react-router");
    (routerMock.useRouterState as ReturnType<typeof vi.fn>).mockReturnValue("/features");

    render(<SiteHeader />);

    const featuresLink = screen.getByRole("link", { name: /^features$/i });
    const contactLink = screen.getByRole("link", { name: /^contact$/i });

    // Features link should have active styling (font-semibold and active indicator class)
    expect(featuresLink).toHaveClass("font-semibold");
    // Contact link should NOT have active styling
    expect(contactLink).not.toHaveClass("font-semibold");
  });
});
