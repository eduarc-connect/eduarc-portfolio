import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Compass,
  Facebook,
  Globe,
  GraduationCap,
  Headphones,
  HelpCircle,
  Instagram,
  Linkedin,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Users,
  Youtube,
} from "lucide-react";
import { phoneHref, websiteHref } from "@/content/eduarc";
import { useSiteContent } from "@/lib/site-content";

/* Official X (Twitter) Logo Component */
function XLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ContactContent() {
  const { contact, contactPage, socials } = useSiteContent();
  const [selectedTopic, setSelectedTopic] = useState<string>("general");

  const topics = [
    {
      id: "general",
      title: "General Enquiry",
      icon: MessageSquare,
      targetHref: `mailto:${contact.email}?subject=General%20Enquiry`,
    },
    {
      id: "mentorship",
      title: "Mentorship & Guidance",
      icon: GraduationCap,
      targetHref: "/partner?role=student",
      isInternal: true,
    },
    {
      id: "institution",
      title: "Institution Partnership",
      icon: Building2,
      targetHref: "/partner?role=institution",
      isInternal: true,
    },
    {
      id: "other",
      title: "Other",
      icon: HelpCircle,
      targetHref: `mailto:${contact.email}?subject=General%20Question`,
    },
  ];

  const currentTopic = topics.find((t) => t.id === selectedTopic) ?? topics[0]!;

  return (
    <>
      {/* 2. Contact Information Cards */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
              CONTACT INFORMATION
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B35] tracking-tight">
              {contactPage.channelsTitle || "Multiple Ways to Reach Us"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {contactPage.channelsLead ||
                "Choose the channel that works best for you. We're just a call, email or message away!"}
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Phone Card */}
            <a
              href={phoneHref(contact.phone)}
              className="bg-white rounded-2xl p-5 border border-hairline shadow-xs hover:shadow-card hover:border-brand-forest/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-forest text-white shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-forest group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-5 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Phone</h3>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-forest transition-colors">
                  {contact.phone}
                </p>
                <p className="text-xs text-slate-500">
                  {contact.phoneHours || "Mon - Fri, 9:00 AM - 6:00 PM (IST)"}
                </p>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${contact.email}`}
              className="bg-white rounded-2xl p-5 border border-hairline shadow-xs hover:shadow-card hover:border-brand-forest/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-forest text-white shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-forest group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-5 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Email</h3>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-forest transition-colors break-all">
                  {contact.email}
                </p>
                <p className="text-xs text-slate-500">
                  {contact.emailNote || "We reply within 24 hours"}
                </p>
              </div>
            </a>

            {/* Location Card */}
            <a
              href="https://maps.google.com/?q=Bengaluru,Karnataka,India"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-5 border border-hairline shadow-xs hover:shadow-card hover:border-brand-forest/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-forest text-white shadow-xs">
                  <Compass className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-forest group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-5 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Our Location</h3>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-forest transition-colors">
                  {contact.location || "Bengaluru, Karnataka, India"}
                </p>
                <p className="text-xs text-slate-500">
                  {contact.locationNote || "(By appointment only)"}
                </p>
              </div>
            </a>

            {/* Website Card */}
            <a
              href={websiteHref(contact.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-5 border border-hairline shadow-xs hover:shadow-card hover:border-brand-forest/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-forest text-white shadow-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-forest group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-5 space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Website</h3>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-forest transition-colors">
                  {contact.website}
                </p>
                <p className="text-xs text-slate-500">
                  {contact.websiteNote || "Explore more about us"}
                </p>
              </div>
            </a>
          </div>

          {/* 3. Social Media Channels (5 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 pt-2">
            {/* Instagram */}
            <a
              href={socials.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#D62976]/40 transition-all flex items-center justify-between group overflow-hidden min-w-0"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#FA7E1E] via-[#D62976] to-[#962FBF] text-white shadow-2xs shrink-0">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Instagram</h4>
                  <p
                    className="text-[11px] text-slate-500 font-medium truncate block"
                    title={socials.instagramHandle}
                  >
                    {socials.instagramHandle}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#D62976] group-hover:translate-x-0.5 transition-all ml-1.5 shrink-0" />
            </a>

            {/* Facebook */}
            <a
              href={socials.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1877F2]/40 transition-all flex items-center justify-between group overflow-hidden min-w-0"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1877F2] text-white shadow-2xs shrink-0">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Facebook</h4>
                  <p
                    className="text-[11px] text-slate-500 font-medium truncate block"
                    title={socials.facebookHandle}
                  >
                    {socials.facebookHandle}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#1877F2] group-hover:translate-x-0.5 transition-all ml-1.5 shrink-0" />
            </a>

            {/* X (Twitter) */}
            <a
              href={socials.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-black/40 transition-all flex items-center justify-between group overflow-hidden min-w-0"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black text-white shadow-2xs shrink-0">
                  <XLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">X (Twitter)</h4>
                  <p
                    className="text-[11px] text-slate-500 font-medium truncate block"
                    title={socials.twitterHandle}
                  >
                    {socials.twitterHandle}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-black group-hover:translate-x-0.5 transition-all ml-1.5 shrink-0" />
            </a>

            {/* LinkedIn */}
            <a
              href={socials.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0A66C2]/40 transition-all flex items-center justify-between group overflow-hidden min-w-0"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0A66C2] text-white shadow-2xs shrink-0">
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">LinkedIn</h4>
                  <p
                    className="text-[11px] text-slate-500 font-medium truncate block"
                    title={socials.linkedinHandle}
                  >
                    {socials.linkedinHandle}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0A66C2] group-hover:translate-x-0.5 transition-all ml-1.5 shrink-0" />
            </a>

            {/* YouTube */}
            <a
              href={socials.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#FF0000]/40 transition-all flex items-center justify-between group overflow-hidden min-w-0"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF0000] text-white shadow-2xs shrink-0">
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">YouTube</h4>
                  <p
                    className="text-[11px] text-slate-500 font-medium truncate block"
                    title={socials.youtubeHandle}
                  >
                    {socials.youtubeHandle}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FF0000] group-hover:translate-x-0.5 transition-all ml-1.5 shrink-0" />
            </a>
          </div>

          {/* 4. Dual Engagement Section ("Ready to Connect?" & "Send Us a Message") */}
          <div className="rounded-2xl border border-hairline shadow-xs overflow-hidden bg-white grid grid-cols-1 lg:grid-cols-12 mt-6">
            {/* Left Box: We're Here for What's Next */}
            <div className="lg:col-span-5 bg-[#F5F1E8] p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <span className="text-xs font-semibold text-[#B47A4B] uppercase tracking-wider block">
                  {contactPage.connectEyebrow || "— Ready to Connect?"}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-[#243B35] tracking-tight leading-snug">
                  {contactPage.connectTitle || "We’re Here for What’s Next"}
                </h3>

                <p className="text-sm sm:text-base text-[#343A36] font-normal leading-relaxed max-w-sm">
                  {contactPage.connectLead}
                </p>

                {/* Flying Paper Airplane Path */}
                <div className="relative py-2 select-none pointer-events-none">
                  <svg
                    viewBox="0 0 180 50"
                    className="w-full h-12 overflow-visible"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 10,40 Q 75,5 155,20"
                      stroke="#243B35"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.35"
                    />
                  </svg>
                  <div className="absolute top-1 right-6 text-[#B47A4B] transform rotate-12">
                    <Send className="w-5 h-5 -rotate-45" />
                  </div>
                </div>
              </div>

              {/* Quick Links List */}
              <div className="space-y-2.5 relative z-10 pt-4">
                <Link
                  to="/partner"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-hairline text-[#243B35] text-xs sm:text-sm font-semibold transition-all shadow-xs group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF9F5] text-[#243B35] group-hover:scale-110 transition-transform">
                    <Compass className="w-4 h-4" />
                  </span>
                  <span>Career Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400 group-hover:text-[#B47A4B] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/mentors"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-hairline text-[#243B35] text-xs sm:text-sm font-semibold transition-all shadow-xs group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF9F5] text-[#243B35] group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </span>
                  <span>Mentor Support</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400 group-hover:text-[#B47A4B] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  to="/partner"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-hairline text-[#243B35] text-xs sm:text-sm font-semibold transition-all shadow-xs group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF9F5] text-[#243B35] group-hover:scale-110 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <span>Institution Partnership</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400 group-hover:text-[#B47A4B] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <a
                  href={`mailto:${contact.email}?subject=General%20Enquiry`}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-hairline text-[#243B35] text-xs sm:text-sm font-semibold transition-all shadow-xs group"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF9F5] text-[#243B35] group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <span>General Enquiries</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400 group-hover:text-[#B47A4B] group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>

              {/* Decorative background botanical corner motif */}
              <div
                className="absolute -bottom-8 -left-8 w-44 h-44 pointer-events-none opacity-10 text-[#243B35]"
                aria-hidden="true"
              >
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M10 90 C 20 50, 60 20, 95 10 C 85 40, 60 80, 10 90 Z" />
                  <path d="M15 85 C 35 60, 55 45, 80 35 C 65 55, 45 75, 15 85 Z" opacity="0.6" />
                </svg>
              </div>
            </div>

            {/* Right Box: Send Us a Message */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F1E8] text-[#B47A4B] border border-[#E2DBD0] inline-block mb-2">
                    {contactPage.messageBadge || "Quick Contact"}
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-[#243B35] tracking-tight leading-snug">
                    {contactPage.messageTitle || "Send Us a Message"}
                  </h3>
                  <p className="text-sm sm:text-base text-[#343A36] font-normal mt-1 leading-relaxed">
                    {contactPage.messageLead ||
                      "Have a specific question or inquiry? Choose a topic and we'll get back to you with the right person from our team."}
                  </p>
                </div>

                {/* 4 Topic Selection Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {topics.map((topic) => {
                    const isSelected = selectedTopic === topic.id;
                    const Icon = topic.icon;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#EDF3F0] border-[#243B35] text-[#243B35] ring-1 ring-[#243B35]/30 shadow-xs font-bold"
                            : "bg-white border-hairline text-slate-700 hover:border-slate-300 hover:bg-[#FAF9F5] font-semibold"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                            isSelected ? "bg-[#243B35] text-white" : "bg-[#F5F1E8] text-[#243B35]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs leading-snug">{topic.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Action button reflecting chosen topic */}
                <div className="pt-1">
                  {currentTopic.isInternal ? (
                    <Link
                      to={currentTopic.targetHref}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#243B35] hover:bg-[#1A2C27] text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Proceed with {currentTopic.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <a
                      href={currentTopic.targetHref}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#243B35] hover:bg-[#1A2C27] text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Send Message for {currentTopic.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Direct Conversation Callout Box */}
                <div className="rounded-xl bg-[#FAF9F5] border border-hairline p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#EDF3F0] text-[#243B35] shrink-0 border border-[#D3DFDA]">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-[#243B35]">
                        {contactPage.directCallTitle || "Prefer a direct conversation?"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {contactPage.directCallLead || (
                          <>
                            Call us at{" "}
                            <span className="font-semibold text-slate-900">{contact.phone}</span>{" "}
                            during our working hours (
                            {contact.phoneHours || "Mon - Fri, 9:00 AM - 6:00 PM IST"}).
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <a
                    href={phoneHref(contact.phone)}
                    aria-label={`Call ${contact.phone}`}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#243B35] hover:bg-[#1A2C27] text-white shrink-0 shadow-xs transition-colors self-end sm:self-auto cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Signature Footer */}
              <div className="pt-2 flex items-center justify-end gap-3 text-slate-700 select-none">
                <span className="font-serif italic text-lg sm:text-xl font-bold text-[#243B35]/85 tracking-wide">
                  {contactPage.signature || "“We’d love to hear from you!”"}
                </span>
                <div className="flex items-center gap-1 text-[#B47A4B]">
                  <svg
                    width="44"
                    height="20"
                    viewBox="0 0 44 20"
                    fill="none"
                    className="overflow-visible"
                    aria-hidden="true"
                  >
                    <path
                      d="M 2,16 Q 22,2 38,10"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  </svg>
                  <Send className="w-4 h-4 -rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
