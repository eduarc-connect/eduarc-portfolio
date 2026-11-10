import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageTransition } from "@/components/site/PageTransition";
import { AnalyticsTracker } from "@/components/site/AnalyticsTracker";
import { Toaster } from "@/components/ui/sonner";
import { siteContentQuery } from "@/lib/site-content";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center p-8 rounded-2xl border border-hairline bg-surface/50">
        <span className="type-eyebrow text-brand-gold">Error 404</span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-brand-navy">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The requested page could not be located. It may have been moved or updated.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="pill-gold" size="pill-sm">
            <Link to="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function PendingComponent() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-8">
      <div className="loader" role="status" aria-label="Loading page..." />
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center p-8 rounded-2xl border border-hairline bg-surface/50">
        <span className="type-eyebrow text-destructive">Application Notice</span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-navy">
          Unable to display this view
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We encountered an unexpected condition. Please refresh the page or return to the main
          portal.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            variant="pill"
            size="pill-sm"
          >
            Retry
          </Button>
          <Button asChild variant="pill-outline" size="pill-sm">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://eduarc-connect.in/#organization",
      name: "EduArc",
      alternateName: ["EDUARC", "EduArc Connect", "EduArc Education Guidance Platform"],
      url: "https://eduarc-connect.in",
      logo: "https://eduarc-connect.in/icon-512.png",
      image: "https://eduarc-connect.in/og-image.jpg",
      description:
        "Career guidance & education support platform for schools, colleges, and students. Structured career roadmaps, verified academic mentorship, and future-ready planning.",
      slogan: "Ambitious to Achievement",
      email: "eduarc.connect@gmail.com",
      telephone: "+91 95357 21089",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      sameAs: [
        "https://instagram.com/eduarc_official",
        "https://facebook.com/eduarc",
        "https://x.com/eduarc_official",
        "https://linkedin.com/company/eduarc",
        "https://youtube.com/@eduarc",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91 95357 21089",
          contactType: "student counseling",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi", "Kannada"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://eduarc-connect.in/#website",
      url: "https://eduarc-connect.in/",
      name: "EduArc",
      alternateName: [
        "EDUARC",
        "EduArc Connect",
        "eduarc-connect.in",
        "www.eduarc-connect.in",
      ],
      description:
        "Empowering Students for a Brighter Future with Structured Career Roadmaps and Mentorship.",
      publisher: {
        "@id": "https://eduarc-connect.in/#organization",
      },
      inLanguage: "en-IN",
    },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "EDUARC — Career Guidance & Education Support Platform | Ambitious to Achievement",
      },
      {
        name: "description",
        content:
          "EDUARC empowers schools, colleges, and students across India with structured career roadmaps, verified academic mentorship, stream selection guidance, and future-ready education support.",
      },
      {
        name: "keywords",
        content:
          "EDUARC, career guidance, education support, career counselling Bangalore, student mentorship India, school guidance workshops, college admission guidance, stream selection after 10th, career planning after 12th, academic counselling, Karnataka education consultancy, Ambitious to Achievement",
      },
      { name: "author", content: "EDUARC" },
      { name: "theme-color", content: "#243B35" },
      { name: "google-site-verification", content: "googlee87f8b26b8c2d2b8" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large" },
      { name: "application-name", content: "EDUARC" },
      { name: "apple-mobile-web-app-title", content: "EDUARC" },

      // Open Graph (WhatsApp, Facebook, LinkedIn, iMessage)
      { property: "og:site_name", content: "EduArc" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      {
        property: "og:title",
        content: "EduArc – Your Career Guide",
      },
      {
        property: "og:description",
        content:
          "Get expert guidance, explore courses, and build the right career path.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { property: "og:image:secure_url", content: "https://eduarc-connect.in/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1024" },
      { property: "og:image:height", content: "1024" },
      {
        property: "og:image:alt",
        content: "EduArc – Your Career Guide",
      },

      // Twitter / X Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@eduarc_official" },
      { name: "twitter:creator", content: "@eduarc_official" },
      {
        name: "twitter:title",
        content: "EduArc – Your Career Guide",
      },
      {
        name: "twitter:description",
        content:
          "Get expert guidance, explore courses, and build the right career path.",
      },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-1BSX32V16Q",
        async: true,
      },
      {
        children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-1BSX32V16Q');`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  pendingComponent: PendingComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-[#E8E0D1] selection:text-[#243B35]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#243B35] focus:text-[#FAF9F5] focus:rounded-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-[#B47A4B]"
        >
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isAdmin = useRouterState({
    select: (s) => /^\/(admin|reception)(\/|$)/.test(s.location.pathname),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsTracker />
      {!isAdmin && <SiteHeader />}
      <main id="main-content" className="flex-1 focus:outline-none">
        {/* Required: nested routes render here with subtle upward fade transition */}
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      {!isAdmin && <SiteFooter />}
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
