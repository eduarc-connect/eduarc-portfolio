import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/lib/site-content";
import featuresHeroImg from "@/assets/features-hero.jpg";
import { FeaturesContent } from "@/components/site/sections/FeaturesContent";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      {
        title: "EDUARC Features — 4-Pillar Career Guidance & Institutional Framework",
      },
      {
        name: "description",
        content:
          "Explore EDUARC's 4-pillar methodology: Aptitude Assessment, Tailored Roadmaps, Verified Faculty Mentorship, and Institutional Success Cohorts for schools and PU colleges.",
      },
      {
        name: "keywords",
        content:
          "career guidance framework, student psychometric assessment, career roadmaps, institutional mentorship programs, school workshop framework, PU college guidance, higher education consulting",
      },
      {
        property: "og:title",
        content: "EDUARC Features — Comprehensive Career Guidance Framework",
      },
      {
        property: "og:description",
        content:
          "Structured partnership features and student guidance methodology for schools, PU colleges, and universities across India.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/features" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/features" }],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  const c = useSiteContent();

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      {/* 1. Hero Section - Full-Bleed Edge-to-Edge Academic Hero Banner */}
      <section className="relative overflow-hidden bg-[#EFF6FE] border-b border-hairline/80 min-h-[280px] sm:h-[300px] md:h-[320px] lg:h-[340px] xl:h-[350px] flex items-center">
        {/* Desktop & Tablet Background Banner: Edge-to-edge horizontally, locked right-bottom with left fade */}
        <div className="hidden sm:block absolute inset-y-0 right-0 h-full w-full pointer-events-none select-none z-0 overflow-hidden">
          <img
            src={featuresHeroImg}
            alt="EDUARC Institutional Students Learning Together"
            width={2360}
            height={768}
            decoding="async"
            className="h-full w-auto max-w-none absolute right-0 bottom-0 block"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, transparent 8%, black 32%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, transparent 8%, black 32%, black 100%)",
            }}
          />
          {/* Subtle gradient behind text to guarantee contrast across all viewports */}
          <div className="absolute inset-y-0 left-0 w-[55%] md:w-[50%] lg:w-[45%] bg-gradient-to-r from-[#EFF6FE] via-[#EFF6FE]/90 to-transparent pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="container-apple relative z-10 w-full">
          <div className="py-6 sm:py-8 md:py-10 lg:py-12 max-w-lg lg:max-w-xl text-center sm:text-left">
            <span className="text-xs font-semibold tracking-wider text-[#B47A4B] uppercase mb-2 block">
              INSTITUTIONAL FEATURES
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-semibold text-[#243B35] tracking-tight leading-[1.18] sm:leading-[1.15]">
              Structured features for <br />
              <span className="text-[#243B35]">schools and colleges.</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#343A36] max-w-md lg:max-w-lg mx-auto sm:mx-0 font-normal leading-relaxed">
              {c.featuresPage?.lead ||
                "Designed to guide, support and empower students — and give institutions full visibility."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 items-center justify-center sm:justify-start">
              <Button
                asChild
                className="rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white text-sm font-semibold px-5 py-2.5 h-10 shadow-xs gap-1.5 cursor-pointer"
              >
                <Link to="/partner">
                  <span>Request Institutional Proposal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-[#243B35] bg-transparent hover:bg-[#243B35]/10 text-[#243B35] text-sm font-semibold px-4 py-2.5 h-10 cursor-pointer"
              >
                <Link to="/contact">Speak with Partnerships Team</Link>
              </Button>
            </div>
          </div>

          {/* Mobile View: edge-to-edge horizontally, locked right-bottom, left empty space faded */}
          <div className="sm:hidden relative w-[calc(100%+2rem)] -mx-4 h-[250px] overflow-hidden mt-4">
            <img
              src={featuresHeroImg}
              alt="EDUARC Institutional Students Learning Together"
              width={2360}
              height={768}
              decoding="async"
              className="h-full w-full object-cover object-right-bottom block"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
              }}
            />
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#EFF6FE] to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* REUSABLE FEATURES CONTENT */}
      <FeaturesContent />

      {/* 7. Institutional Bottom CTA Banner */}
      <section className="py-16 md:py-24 bg-[#FAF9F5]">
        <div className="container-apple">
          <div className="rounded-2xl bg-[#F5F1E8] border border-hairline p-8 sm:p-12 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3 text-center sm:text-left">
                <span className="text-[11px] font-bold tracking-wider text-[#B47A4B] uppercase block">
                  LET'S WORK TOGETHER
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-semibold text-[#243B35] tracking-tight leading-snug">
                  Partner with EDUARC
                </h2>
                <p className="text-sm sm:text-base text-[#343A36] max-w-lg mx-auto sm:mx-0 font-normal leading-relaxed">
                  Let's build brighter futures for your students, together.
                </p>
                <div className="pt-2 flex flex-wrap gap-3 items-center justify-center sm:justify-start">
                  <Button
                    asChild
                    className="rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white text-sm font-semibold px-5 py-2.5 h-10 shadow-xs gap-1.5 cursor-pointer"
                  >
                    <Link to="/partner">
                      <span>Request Institutional Proposal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-[#243B35] bg-transparent hover:bg-[#243B35]/10 text-[#243B35] text-sm font-semibold px-4 py-2.5 h-10 cursor-pointer"
                  >
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </div>

              {/* Right Side Callout Script Artifact */}
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                <div className="text-center sm:text-left rotate-[-2deg] p-4 rounded-xl bg-white border border-hairline shadow-xs">
                  <p className="font-serif italic font-bold text-[#243B35] text-sm sm:text-base leading-tight tracking-wide">
                    Better Guidance
                    <br />
                    <span className="text-[#B47A4B]">Brighter Futures</span>
                  </p>
                  <svg
                    className="w-20 sm:w-24 h-3 text-[#B47A4B] stroke-current mt-1 mx-auto sm:mx-0"
                    viewBox="0 0 100 12"
                    fill="none"
                  >
                    <path d="M2,8 Q50,2 98,6" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
