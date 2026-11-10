import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Send } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { siteContentQuery, useSiteContent } from "@/lib/site-content";
import aboutHeroImg from "@/assets/about-hero.jpg";
import { AboutContent } from "@/components/site/sections/AboutContent";

export const Route = createFileRoute("/about")({
  loader: async ({ context }) => {
    await context.queryClient.fetchQuery({ ...siteContentQuery, staleTime: 0 });
  },
  head: () => ({
    meta: [
      { title: "About EDUARC — Educational Mentorship, Vision & Guidance Philosophy" },
      {
        name: "description",
        content:
          "Discover EDUARC's mission to bridge education with career achievement through structured roadmaps, experienced academic faculty, and holistic student guidance in India.",
      },
      {
        name: "keywords",
        content:
          "about EDUARC, education guidance philosophy, student career mentorship, career counselling Bangalore, school education consultants, academic advisory India, Ambitious to Achievement",
      },
      {
        property: "og:title",
        content: "About EDUARC — Empowering Students to Discover Their Future",
      },
      {
        property: "og:description",
        content:
          "Connect with expert academic mentors, unpack career possibilities, and build actionable milestone plans with EDUARC.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/about" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const c = useSiteContent();

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          Empowering Students to Discover Their Future
         ========================================================================= */}
      {/* 1. Hero Section - Full-Bleed Edge-to-Edge Academic Hero Banner */}
      <section className="relative overflow-hidden bg-[#F5F5F5] border-b border-hairline/80 min-h-[280px] sm:h-[300px] md:h-[320px] lg:h-[340px] xl:h-[350px] flex items-center">
        {/* Desktop & Tablet Background Banner: Edge-to-edge horizontally, locked right-bottom with left fade */}
        <div className="hidden sm:block absolute inset-y-0 right-0 h-full w-full pointer-events-none select-none z-0 overflow-hidden">
          <img
            src={aboutHeroImg}
            alt="Empowering Students to Discover Their Future"
            width={1024}
            height={341}
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
          <div className="absolute inset-y-0 left-0 w-[55%] md:w-[50%] lg:w-[45%] bg-gradient-to-r from-[#F5F5F5] via-[#F5F5F5]/90 to-transparent pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="container-apple relative z-10 w-full">
          <div className="py-6 sm:py-8 md:py-10 lg:py-12 max-w-lg lg:max-w-xl text-center sm:text-left">
            <div className="inline-flex items-center gap-2 mb-2 justify-center sm:justify-start">
              <span className="w-6 h-[2.5px] bg-[#B47A4B] inline-block rounded-full" />
              <span className="text-xs font-bold tracking-wider text-[#243B35]/80 uppercase">
                About EduArc
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-semibold text-[#243B35] tracking-tight leading-[1.18] sm:leading-[1.15]">
              Empowering Students <br />
              to Discover <span className="text-[#B47A4B]">Their Future.</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#343A36] max-w-md lg:max-w-lg mx-auto sm:mx-0 font-normal leading-relaxed">
              {c.about?.lead ||
                "EduArc is a career guidance platform designed to help students make informed decisions about their future. We provide the right guidance, resources and support to turn your dreams into achievable goals."}
            </p>
          </div>

          {/* Mobile View: edge-to-edge horizontally, locked right-bottom, left empty space faded */}
          <div className="sm:hidden relative w-[calc(100%+2rem)] -mx-4 h-[250px] overflow-hidden mt-4">
            <img
              src={aboutHeroImg}
              alt="Empowering Students to Discover Their Future"
              width={1024}
              height={341}
              decoding="async"
              className="h-full w-full object-cover object-right-bottom block"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
              }}
            />
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F5F5F5] to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* REUSABLE ABOUT CONTENT SECTIONS 2 THROUGH 6 */}
      <AboutContent />

      {/* =========================================================================
          SECTION 7: BOTTOM CTA BANNER
          Your Future Starts With The Right Guidance.
         ========================================================================= */}
      <section className="bg-[#EDF3F0] border-t border-hairline py-8 sm:py-10">
        <div className="container-apple">
          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
              {/* Paper Airplane & Headline */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-[#B47A4B]">
                  <Send className="w-6 h-6 rotate-[-20deg]" />
                </div>

                <div className="hidden sm:block h-9 w-[1px] bg-[#E2DBD0]" />

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-[#243B35] tracking-tight leading-snug">
                    Your Future Starts With <br className="hidden sm:inline" />
                    The <span className="text-[#B47A4B]">Right Guidance.</span>
                  </h2>
                </div>
              </div>

              {/* Subtext */}
              <p className="text-sm sm:text-base text-[#343A36] max-w-sm font-normal">
                Join EduArc today and take the first step towards a successful career.
              </p>

              {/* Action Button */}
              <Button
                asChild
                className="rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white text-sm font-semibold px-6 py-2.5 h-10 shadow-xs shrink-0 gap-2 cursor-pointer"
              >
                <Link to="/partner">
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
