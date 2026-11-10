import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  Compass,
  MapPin,
  Mail,
  Send,
  Quote,
  Check,
  Copy,
  Sparkles,
  Award,
  BookOpen,
  Route as RouteIcon,
  Lightbulb,
  HeartHandshake,
  TrendingUp,
  GitFork,
  Target,
  Bookmark,
  ShieldCheck,
  Eye,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import mentorImg from "@/assets/mentor-gayathri.jpg";
import { defaultContent, initials, type MentorProfile } from "@/content/eduarc";
import { siteContentQuery, useSiteContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mentors")({
  loader: async ({ context }) => {
    await context.queryClient.fetchQuery({ ...siteContentQuery, staleTime: 0 });
  },
  head: () => ({
    meta: [
      { title: "Academic Mentors & Guidance Advisors — EDUARC" },
      {
        name: "description",
        content:
          "Connect with experienced academic mentors and doctoral faculty at EDUARC. Informed guidance on Class 10 stream choices, Class 12 degree options, and future career roadmaps.",
      },
      {
        name: "keywords",
        content:
          "academic mentors, career guidance counsellors, student mentor Bangalore, Dr Gayathri G N, career planning after 10th, degree selection after 12th, EDUARC mentors",
      },
      { property: "og:title", content: "EDUARC Academic Mentors & Guidance Advisors" },
      {
        property: "og:description",
        content:
          "Personalized student guidance, stream selection after 10th, and academic roadmap planning with verified mentors.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/mentors" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/mentors" }],
  }),
  component: MentorProfilePage,
});

const guideIcons: LucideIcon[] = [
  Compass,
  GitFork,
  GraduationCap,
  RouteIcon,
  Lightbulb,
  HeartHandshake,
];

const whyConnectIcons: LucideIcon[] = [Award, GraduationCap, BookOpen, Target, Sparkles];

function isUsableImage(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim().replace(/^["']|["']$/g, "");
  if (!trimmed) return false;
  if (trimmed.startsWith("data:") && (trimmed.includes("AAAAAAAA") || trimmed.length < 50)) {
    return false;
  }
  return true;
}

function MentorCardImage({
  imageUrl,
  name,
  isGayathri,
}: {
  imageUrl?: string;
  name: string;
  isGayathri: boolean;
}) {
  const usableCustomUrl = isUsableImage(imageUrl)
    ? imageUrl!.trim().replace(/^["']|["']$/g, "")
    : null;
  const initialSrc = usableCustomUrl || (isGayathri ? mentorImg : null);
  const [src, setSrc] = useState<string | null>(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const updatedUsable = isUsableImage(imageUrl)
      ? imageUrl!.trim().replace(/^["']|["']$/g, "")
      : null;
    setSrc(updatedUsable || (isGayathri ? mentorImg : null));
    setHasError(false);
  }, [imageUrl, isGayathri]);

  if (!src || hasError) {
    if (isGayathri && src !== mentorImg) {
      return (
        <img
          src={mentorImg}
          alt={name}
          width={960}
          height={960}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
      );
    }
    return (
      <div className="absolute inset-0 h-full w-full bg-brand-navy flex items-center justify-center">
        <span className="text-6xl font-bold text-white/20 tracking-wider">{initials(name)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={960}
      height={960}
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
      onError={() => {
        if (isGayathri && src !== mentorImg) {
          setSrc(mentorImg);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}

function MentorModalImage({
  imageUrl,
  name,
  isGayathri,
}: {
  imageUrl?: string;
  name: string;
  isGayathri: boolean;
}) {
  const usableCustomUrl = isUsableImage(imageUrl)
    ? imageUrl!.trim().replace(/^["']|["']$/g, "")
    : null;
  const initialSrc = usableCustomUrl || (isGayathri ? mentorImg : null);
  const [src, setSrc] = useState<string | null>(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const updatedUsable = isUsableImage(imageUrl)
      ? imageUrl!.trim().replace(/^["']|["']$/g, "")
      : null;
    setSrc(updatedUsable || (isGayathri ? mentorImg : null));
    setHasError(false);
  }, [imageUrl, isGayathri]);

  if (!src || hasError) {
    if (isGayathri && src !== mentorImg) {
      return (
        <img
          src={mentorImg}
          alt={name}
          width={112}
          height={112}
          decoding="async"
          className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover object-top shadow-md border-2 border-brand-gold/40"
        />
      );
    }
    return (
      <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-brand-navy text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-brand-gold/40">
        {initials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={112}
      height={112}
      decoding="async"
      className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover object-top shadow-md border-2 border-brand-gold/40"
      onError={() => {
        if (isGayathri && src !== mentorImg) {
          setSrc(mentorImg);
        } else {
          setHasError(true);
        }
      }}
    />
  );
}

function MentorProfilePage() {
  const content = useSiteContent();
  const mentors = Array.isArray(content.mentors) ? content.mentors : defaultContent.mentors;

  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = !prev[id];
      if (next) {
        toast.success("Mentor bookmarked to your list!");
      } else {
        toast.info("Bookmark removed");
      }
      return { ...prev, [id]: next };
    });
  };

  const copyEmail = (email?: string) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative isolate overflow-hidden bg-surface/50 pb-24 pt-8 md:pb-32">
      <div className="container-wide">
        {/* Breadcrumb Top Bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <nav
            className="flex items-center gap-2 text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="transition-colors hover:text-brand-navy">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-brand-navy">Academic Mentors</span>
          </nav>

          <div className="flex items-center gap-2">
            <Badge variant="gold" className="gap-1.5 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-navy" />
              <span>Verified Academic Credentials</span>
            </Badge>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="type-eyebrow text-brand-gold">Empathetic & Credentialed Guidance</span>
          <h1 className="mt-3 text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold tracking-tight text-brand-navy leading-[1.2] sm:leading-[1.15] break-words">
            Meet Our <br className="sm:hidden" /> Academic Mentors
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground font-normal leading-relaxed">
            Guidance from university educators with genuine teaching and research experience. Click
            on any mentor card to view their complete academic background, guidance roadmap, and
            connect directly.
          </p>
        </div>

        {/* Mentor Profile Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto">
          {mentors.map((mentor) => {
            const isGayathri =
              mentor.id === "dr-gayathri-g-n" || mentor.name.toLowerCase().includes("gayathri");
            const isBookmarked = Boolean(bookmarkedIds[mentor.id]);

            const stats =
              mentor.cardStats && mentor.cardStats.length >= 3
                ? mentor.cardStats.slice(0, 3)
                : [
                    { label: "Experience", value: "7+ Yrs" },
                    { label: "Research", value: "6 Pubs" },
                    { label: "Education", value: "Ph.D." },
                  ];

            const shortDescription =
              mentor.shortBio?.trim() ||
              (mentor.about
                ? mentor.about.split("\n")[0]?.slice(0, 115) + "..."
                : "Helping students move from confusion to clarity with personalized roadmaps and career guidance.");

            return (
              <div
                key={mentor.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedMentor(mentor)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedMentor(mentor);
                  }
                }}
                className="group relative w-full max-w-[360px] aspect-[1/1.5] rounded-3xl overflow-hidden border border-hairline bg-brand-navy shadow-lift transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                {/* Background Image / Scrim */}
                <MentorCardImage
                  imageUrl={mentor.imageUrl}
                  name={mentor.name}
                  isGayathri={isGayathri}
                />

                {/* Apple-style gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep via-brand-navy/60 via-45% to-transparent" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy/70 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-semibold text-white">
                    <Sparkles className="h-3 w-3 text-brand-gold" />
                    {mentor.location || "EDUARC Mentor"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
                    <Eye className="h-3 w-3 text-brand-gold" /> Details
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white drop-shadow-xs">
                      {mentor.name}
                    </h3>
                    <span
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold text-brand-navy shadow-xs font-bold"
                      title="Verified EDUARC Mentor"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                  </div>

                  <p className="mt-2 text-xs sm:text-[13px] text-white/85 leading-relaxed line-clamp-2">
                    {shortDescription}
                  </p>

                  {/* 3 Stats Row with Dividers */}
                  <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-3 items-center text-center">
                    {stats.map((s, idx) => (
                      <div key={idx} className={cn("px-1", idx > 0 && "border-l border-white/20")}>
                        <div className="text-sm sm:text-base font-bold text-brand-gold tracking-tight">
                          {s.value}
                        </div>
                        <div className="text-[10px] font-medium text-white/70 uppercase tracking-wider mt-0.5">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Row */}
                  <div className="mt-5 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMentor(mentor);
                      }}
                      className="flex-1 rounded-full bg-brand-gold py-2.5 px-4 text-xs font-bold text-brand-navy flex items-center justify-center gap-2 shadow-xs hover:bg-brand-gold-hover transition-colors cursor-pointer"
                    >
                      <Mail className="h-4 w-4" />
                      View Full Profile
                    </button>

                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(mentor.id, e)}
                      title={isBookmarked ? "Remove Bookmark" : "Bookmark Mentor"}
                      className={cn(
                        "h-10 w-10 shrink-0 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer",
                        isBookmarked
                          ? "bg-white text-brand-navy border-white shadow-xs"
                          : "bg-white/15 hover:bg-white/25 border-white/20 text-white",
                      )}
                    >
                      <Bookmark
                        className={cn("h-4 w-4", isBookmarked && "fill-current text-brand-navy")}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Helper Banner */}
        <div className="mt-12 text-center text-xs text-muted-foreground">
          Click on any mentor profile card to explore their complete academic background, guidance
          roadmap, and session formats.
        </div>
      </div>

      {/* Full Details Modal Dialog */}
      <Dialog
        open={selectedMentor !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMentor(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 lg:p-10 border border-hairline shadow-2xl bg-white">
          {selectedMentor && (
            <div className="space-y-8">
              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-hairline">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <MentorModalImage
                      imageUrl={selectedMentor.imageUrl}
                      name={selectedMentor.name}
                      isGayathri={
                        selectedMentor.id === "dr-gayathri-g-n" ||
                        selectedMentor.name.toLowerCase().includes("gayathri")
                      }
                    />
                    <span
                      className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-brand-navy shadow ring-2 ring-white font-bold"
                      title="Verified Mentor"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                  </div>

                  <div>
                    <Badge variant="gold" className="gap-1 mb-1.5">
                      <Sparkles className="h-3 w-3 text-brand-navy" />
                      {selectedMentor.role || "Career Guidance & Student Counselling Mentor"}
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-brand-navy tracking-tight">
                      {selectedMentor.name}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-muted-foreground">
                      {selectedMentor.designation}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {selectedMentor.location && (
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <MapPin className="h-3.5 w-3.5 text-brand-gold" />
                          {selectedMentor.location}
                        </span>
                      )}
                      {selectedMentor.email && (
                        <button
                          type="button"
                          onClick={() => copyEmail(selectedMentor.email)}
                          className="flex items-center gap-1 font-medium text-brand-navy hover:underline cursor-pointer"
                        >
                          <Mail className="h-3.5 w-3.5 text-brand-gold" />
                          {selectedMentor.email}
                          {copied ? (
                            <Check className="h-3 w-3 text-success ml-0.5" />
                          ) : (
                            <Copy className="h-3 w-3 text-muted-foreground ml-0.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <Button asChild variant="pill-gold" size="pill-sm" className="w-full sm:w-auto">
                    <Link to="/partner" onClick={() => setSelectedMentor(null)}>
                      <Send className="h-3.5 w-3.5 mr-1" />
                      Request Guidance
                    </Link>
                  </Button>
                </div>
              </div>

              {/* 1. About the Mentor */}
              {selectedMentor.about && (
                <div className="rounded-2xl border border-hairline bg-surface/50 p-6">
                  <div className="flex items-center gap-2.5 mb-3 text-brand-navy font-bold text-base sm:text-lg">
                    <BookOpen className="h-5 w-5 text-brand-gold" />
                    About the Mentor
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-foreground/80">
                    {selectedMentor.about
                      .split("\n\n")
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                  </div>
                </div>
              )}

              {/* 2. How I Can Guide You */}
              {selectedMentor.howICanGuide && selectedMentor.howICanGuide.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4 text-brand-navy font-bold text-base sm:text-lg">
                    <Compass className="h-5 w-5 text-brand-gold" />
                    How I Can Guide You
                  </div>
                  <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                    {selectedMentor.howICanGuide.map((step, idx) => {
                      const IconComp = guideIcons[idx % guideIcons.length] || Compass;

                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-hairline bg-white p-5 shadow-xs hover:border-brand-gold/40 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="mb-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
                                <IconComp className="h-4.5 w-4.5" />
                              </div>
                            </div>
                            <h4 className="text-sm font-bold text-brand-navy">{step.title}</h4>
                            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Why Connect & Who Can Benefit */}
              <div className="grid gap-6 lg:grid-cols-12">
                {selectedMentor.whyConnect && selectedMentor.whyConnect.length > 0 && (
                  <div className="lg:col-span-7 rounded-2xl border border-hairline bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-2 mb-4 text-brand-navy font-bold text-sm sm:text-base">
                      <ShieldCheck className="h-4 w-4 text-brand-gold" />
                      Why Connect With This Mentor?
                    </div>
                    <div className="space-y-3">
                      {selectedMentor.whyConnect.map((reason, idx) => {
                        const IconComp = whyConnectIcons[idx % whyConnectIcons.length] || Award;
                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 rounded-xl border border-hairline bg-surface/40 p-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-border text-brand-navy">
                              <IconComp className="h-4 w-4 text-brand-gold" />
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm font-bold text-brand-navy">
                                {reason.title}
                              </h5>
                              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                                {reason.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedMentor.whoCanBenefit && selectedMentor.whoCanBenefit.length > 0 && (
                  <div className="lg:col-span-5 rounded-2xl border border-hairline bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-2 mb-4 text-brand-navy font-bold text-sm sm:text-base">
                      <Target className="h-4 w-4 text-brand-gold" />
                      Who Can Benefit?
                    </div>
                    <div className="space-y-3">
                      {selectedMentor.whoCanBenefit.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-brand-gold-border/60 bg-brand-gold-soft p-3.5"
                        >
                          <h5 className="text-xs font-bold text-brand-navy">{item.target}</h5>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                            {item.benefit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. EDUARC Mentorship Activity / Transparency */}
              {selectedMentor.impactMetrics && selectedMentor.impactMetrics.length > 0 && (
                <div className="rounded-2xl border border-hairline bg-white p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-hairline">
                    <div className="flex items-center gap-2 text-brand-navy font-bold text-sm sm:text-base">
                      <TrendingUp className="h-4 w-4 text-brand-gold" />
                      Activity & Milestones
                    </div>
                    {selectedMentor.impactNotice && (
                      <span className="text-[11px] text-muted-foreground italic">
                        {selectedMentor.impactNotice}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {selectedMentor.impactMetrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-hairline bg-surface/50 p-3 flex flex-col justify-between"
                      >
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {m.label}
                        </span>
                        <span className="mt-2 text-xs sm:text-sm font-bold text-brand-navy">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. A Message to Students & Parents */}
              {selectedMentor.message && (
                <div className="rounded-2xl border border-brand-gold-border bg-brand-gold-soft p-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy mb-3">
                    <Quote className="h-4 w-4 text-brand-gold" />A Message to Students & Parents
                  </div>
                  <div className="border-l-2 border-brand-gold pl-4 space-y-2 text-xs sm:text-sm italic text-foreground/85 leading-relaxed">
                    {selectedMentor.message
                      .split("\n\n")
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i}>“{para}”</p>
                      ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-brand-gold-border flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-bold text-brand-navy">— {selectedMentor.name}</span>
                    <span>{selectedMentor.designation}</span>
                  </div>
                </div>
              )}

              {/* 6. Connect CTA Footer */}
              <div className="rounded-2xl bg-brand-navy text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-brand-gold/30">
                <div>
                  <h4 className="text-base font-bold text-white">Connect With the Mentor</h4>
                  <p className="mt-1 text-xs text-ink-muted max-w-lg">
                    {selectedMentor.tagline ||
                      "Learn with direction. Grow with confidence. Build your future with EDUARC."}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                    {selectedMentor.email && <span>Email: {selectedMentor.email}</span>}
                    {selectedMentor.location && <span>Location: {selectedMentor.location}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <Button asChild variant="pill-gold" size="pill-sm" className="w-full sm:w-auto">
                    <Link to="/partner" onClick={() => setSelectedMentor(null)}>
                      <span>Request Guidance</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
