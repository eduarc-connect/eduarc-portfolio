import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck, UserCheck } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import counselorHeroBg from "@/assets/contact-hero-counselor-hd.jpg";
import { useSiteContent } from "@/lib/site-content";
import { ContactContent } from "@/components/site/sections/ContactContent";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EDUARC — Academic Consultation, Phone, WhatsApp & Office" },
      {
        name: "description",
        content:
          "Have questions about career guidance or institutional partnerships? Reach out to EDUARC via direct call (+91 95357 21089), email (eduarc.connect@gmail.com), WhatsApp, or visit our Bengaluru campus.",
      },
      {
        name: "keywords",
        content:
          "contact EDUARC, career counsellor Bangalore phone, student counselling WhatsApp, career guidance office Bengaluru, eduarc.connect@gmail.com, Karnataka education support",
      },
      { property: "og:title", content: "Contact EDUARC — Multiple Ways to Reach Us" },
      {
        property: "og:description",
        content:
          "We're here to help students, parents, and educational institutions across India. Connect with EDUARC today.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/contact" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { contactPage } = useSiteContent();

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      {/* 1. Hero Section - Structured 2-Column Academic Layout */}
      {/* 1. Hero Section - Full-Bleed Edge-to-Edge Academic Hero Banner */}
      <section className="relative overflow-hidden bg-[#E6FFFF] border-b border-hairline/80 min-h-[280px] sm:h-[300px] md:h-[320px] lg:h-[340px] xl:h-[350px] flex items-center">
        {/* Desktop & Tablet Background Banner: Edge-to-edge horizontally, locked right-bottom with left fade */}
        <div className="hidden sm:block absolute inset-y-0 right-0 h-full w-full pointer-events-none select-none z-0 overflow-hidden">
          <img
            src={counselorHeroBg}
            alt="EDUARC Educational Guidance and Counselling"
            width={6037}
            height={1963}
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
          <div className="absolute inset-y-0 left-0 w-[55%] md:w-[50%] lg:w-[45%] bg-gradient-to-r from-[#E6FFFF] via-[#E6FFFF]/90 to-transparent pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="container-apple relative z-10 w-full">
          <div className="py-6 sm:py-8 md:py-10 lg:py-12 max-w-lg lg:max-w-xl text-center sm:text-left">
            <span className="text-xs font-semibold tracking-wider text-[#B47A4B] uppercase mb-2 block">
              {contactPage.badge || "Get in Touch"}
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-semibold text-[#243B35] tracking-tight leading-[1.18] sm:leading-[1.15]">
              Let's build a brighter <br />
              future together.
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#343A36] max-w-md lg:max-w-lg mx-auto sm:mx-0 font-normal leading-relaxed">
              {contactPage.lead}
            </p>

            {/* 3 Value Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-hairline shadow-xs text-xs font-semibold text-slate-700">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EDF3F0] text-[#243B35]">
                  <MessageCircle className="w-3 h-3" />
                </span>
                {contactPage.pill1 || "Quick Response"}
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-hairline shadow-xs text-xs font-semibold text-slate-700">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EDF3F0] text-[#243B35]">
                  <ShieldCheck className="w-3 h-3" />
                </span>
                {contactPage.pill2 || "Dedicated Support"}
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-hairline shadow-xs text-xs font-semibold text-slate-700">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EDF3F0] text-[#243B35]">
                  <UserCheck className="w-3 h-3" />
                </span>
                {contactPage.pill3 || "Real People"}
              </div>
            </div>
          </div>

          {/* Mobile View: edge-to-edge horizontally, locked right-bottom, left empty space faded */}
          <div className="sm:hidden relative w-[calc(100%+2rem)] -mx-4 h-[250px] overflow-hidden mt-4">
            <img
              src={counselorHeroBg}
              alt="EDUARC Educational Guidance and Counselling"
              width={6037}
              height={1963}
              decoding="async"
              className="h-full w-full object-cover object-right-bottom block"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
              }}
            />
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#E6FFFF] to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* REUSABLE CONTACT CONTENT */}
      <ContactContent />
    </div>
  );
}
