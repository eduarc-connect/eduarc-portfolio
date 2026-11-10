import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Quote,
  Star,
  Users,
  Mail,
  Lock,
  Send,
  ArrowRight,
  MessageSquare,
  Camera,
  Upload,
  X,
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSiteContent } from "@/lib/site-content";
import { submitUserReview } from "@/lib/testimonials.functions";
import { initials, type TestimonialItem } from "@/content/eduarc";
import {
  getAvatarUrl,
  getGoogleInitialsAvatar,
  getGoogleMaterialAvatarSvg,
  getGravatarUrl,
} from "@/lib/avatar";
import { compressImage } from "@/lib/image-compression";

// Local cropped assets from reference design
import ananyaImg from "@/assets/testimonials/ananya.jpg";
import priyaImg from "@/assets/testimonials/priya.jpg";
import rohitImg from "@/assets/testimonials/rohit.jpg";
import meeraImg from "@/assets/testimonials/meera.jpg";
import rameshImg from "@/assets/testimonials/ramesh.jpg";
import snehaImg from "@/assets/testimonials/sneha.jpg";
import successBooksImg from "@/assets/testimonials/success-books.jpg";

const defaultAvatars: Record<string, string> = {
  ananya: ananyaImg,
  priya: priyaImg,
  rohit: rohitImg,
  meera: meeraImg,
  ramesh: rameshImg,
  sneha: snehaImg,
};

// Avatar lookup: checks custom URL / Google Gmail avatar from email, local presets, and Google Material fallback
function getAvatarSrc(t: TestimonialItem, index: number): string {
  if (t.avatar) {
    if (
      t.avatar.startsWith("http://") ||
      t.avatar.startsWith("https://") ||
      t.avatar.startsWith("data:") ||
      t.avatar.startsWith("//")
    ) {
      return t.avatar;
    }
    if (defaultAvatars[t.avatar.toLowerCase()]) {
      return defaultAvatars[t.avatar.toLowerCase()]!;
    }
  }
  // Load profile photo from user's email ID (Gmail / Google / Unavatar / Gravatar)
  if (t.email && t.email.includes("@")) {
    return getAvatarUrl(t.email, t.name);
  }
  const keys = ["ananya", "priya", "rohit", "meera", "ramesh", "sneha"];
  const fallbackKey = keys[index % keys.length];
  if (fallbackKey && defaultAvatars[fallbackKey]) {
    return defaultAvatars[fallbackKey]!;
  }
  return getGoogleInitialsAvatar(t.name, t.email);
}

export function TestimonialsContent() {
  const c = useSiteContent();
  const submitReviewFn = useServerFn(submitUserReview);
  const [localTestimonials, setLocalTestimonials] = useState<TestimonialItem[]>(c.testimonials);

  const stats = c.testimonialStats || {
    programsConducted: "100+",
    programsLabel: "Programs Conducted",
    institutionsPartnered: "50+",
    institutionsLabel: "Institutions Partnered",
    studentsReached: "10,000+",
    studentsLabel: "Students Reached",
    averageRating: "4.8/5",
    ratingLabel: "Average Rating",
    ctaTitle: "Be a part of their success story",
    ctaDescription: "Join EDUARC and help more students discover their true potential.",
    ctaButtonText: "Explore Our Programs",
  };

  useEffect(() => {
    setLocalTestimonials(c.testimonials);
  }, [c.testimonials]);

  const [emailInput, setEmailInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    name: "",
    email: "",
    role: "Class 12 Student",
    rating: 5,
    category: "Career Guidance Session",
    review: "",
    avatar: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Processing profile photo...", { id: "avatar-upload" });
      const compressed = await compressImage(file, {
        maxWidth: 240,
        maxHeight: 240,
        quality: 0.85,
        format: "image/webp",
      });
      setModalForm((prev) => ({ ...prev, avatar: compressed.dataUrl }));
      toast.dismiss("avatar-upload");
      toast.success("Profile photo attached!");
    } catch (err) {
      toast.dismiss("avatar-upload");
      toast.error(err instanceof Error ? err.message : "Failed to process photo");
    } finally {
      e.target.value = "";
    }
  }

  function handleQuickSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setModalForm((prev) => ({ ...prev, email: emailInput.trim() }));
    setIsModalOpen(true);
  }

  async function handleSaveReview(e: React.FormEvent) {
    e.preventDefault();
    if (!modalForm.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!modalForm.email.trim() || !modalForm.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!modalForm.review.trim()) {
      toast.error("Please write your review feedback");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("Submitting review...", { id: "user-review" });

      const res = await submitReviewFn({
        data: {
          name: modalForm.name.trim(),
          email: modalForm.email.trim(),
          role: modalForm.role.trim() || "Student",
          rating: modalForm.rating,
          category: modalForm.category.trim() || "Career Guidance Session",
          quote: modalForm.review.trim(),
          avatar: modalForm.avatar.trim() || undefined,
        },
      });

      toast.dismiss("user-review");

      if (res.skipped) {
        toast.info(res.message, {
          id: "user-review",
          duration: 6000,
        });
      } else {
        toast.success(res.message, {
          id: "user-review",
          duration: 6000,
        });
      }

      setIsModalOpen(false);
      setEmailInput("");
      setModalForm({
        name: "",
        email: "",
        role: "Class 12 Student",
        rating: 5,
        category: "Career Guidance Session",
        review: "",
        avatar: "",
      });
    } catch (err) {
      toast.dismiss("user-review");
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* 2. Testimonial Cards (3-Column Grid) */}
      <section className="py-12 md:py-16">
        <div className="container-apple">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localTestimonials.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-hairline shadow-xs">
                <Quote className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-base font-semibold text-brand-navy">
                  No testimonials published yet.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  Be the first to share your experience with EDUARC using the review form below!
                </p>
              </div>
            )}
            {localTestimonials.map((t, idx) => {
              const avatarSrc = getAvatarSrc(t, idx);
              const rating = t.rating ?? 5;
              const category =
                t.category ||
                (idx === 0
                  ? "Career Guidance Session"
                  : idx === 1
                    ? "Parent Feedback"
                    : idx === 2
                      ? "Mentorship Session"
                      : idx === 3
                        ? "Workshop Feedback"
                        : idx === 4
                          ? "Institution Partner"
                          : "Career Guidance Session");

              return (
                <Reveal key={t.name + idx} delay={idx * 60}>
                  <div className="group h-full rounded-2xl border border-hairline bg-white p-6 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      {/* Top Header: Avatar + Info + Quote Icon */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full overflow-hidden bg-[#FAF9F5] border border-hairline shrink-0 shadow-2xs flex items-center justify-center">
                            <img
                              src={avatarSrc}
                              alt={t.name}
                              width={44}
                              height={44}
                              loading="lazy"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const img = e.currentTarget;
                                if (!img.dataset.fallbackApplied) {
                                  img.dataset.fallbackApplied = "true";
                                  img.src = getGoogleMaterialAvatarSvg(t.name, t.email);
                                }
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="text-base font-medium text-[#243B35] leading-tight">
                              {t.name}
                            </h3>
                            <p className="text-xs text-[#343A36]/70 font-normal mt-0.5">{t.role}</p>
                          </div>
                        </div>

                        {/* Subtle circular quote badge */}
                        <div className="h-8 w-8 rounded-full bg-[#F5F1E8] border border-[#E2DBD0] flex items-center justify-center text-[#B47A4B] shrink-0">
                          <Quote className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      {/* Middle: Testimonial Quote */}
                      <blockquote className="mt-4 mb-5 text-[15px] sm:text-base text-[#343A36] leading-relaxed font-normal">
                        “{t.quote}”
                      </blockquote>
                    </div>

                    {/* Bottom: 5 Muted Terracotta Stars & Category Badge */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div
                        className="flex items-center gap-0.5 text-[#B47A4B]"
                        aria-label="5 stars"
                      >
                        {Array.from({ length: rating }).map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className="h-3.5 w-3.5 fill-[#B47A4B] text-[#B47A4B]"
                          />
                        ))}
                      </div>

                      <span className="text-[11px] font-medium text-slate-400 tracking-tight">
                        {category}
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* 3. Impact Metrics & Success Story Banner */}
          <Reveal delay={200}>
            <div className="mt-12 rounded-2xl border border-hairline bg-[#F5F1E8] p-5 sm:p-6 lg:p-7 shadow-xs">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-6 xl:gap-8">
                {/* Left Stats Section */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-brand-forest text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Users className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 items-center">
                    {/* Stat 1: Programs Conducted */}
                    <div className="min-w-0 pr-3 sm:pr-4 lg:pr-5">
                      <p className="text-lg sm:text-xl lg:text-[22px] xl:text-2xl font-semibold text-[#243B35] tracking-tight tabular-nums whitespace-nowrap">
                        {stats.programsConducted}
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#343A36]/70 font-medium mt-0.5 leading-snug line-clamp-2">
                        {stats.programsLabel}
                      </p>
                    </div>

                    {/* Stat 2: Institutions Partnered */}
                    <div className="min-w-0 pl-3 sm:px-4 lg:px-5 border-l border-hairline">
                      <p className="text-lg sm:text-xl lg:text-[22px] xl:text-2xl font-semibold text-[#243B35] tracking-tight tabular-nums whitespace-nowrap">
                        {stats.institutionsPartnered}
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#343A36]/70 font-medium mt-0.5 leading-snug line-clamp-2">
                        {stats.institutionsLabel}
                      </p>
                    </div>

                    {/* Stat 3: Students Reached */}
                    <div className="min-w-0 pt-3 sm:pt-0 pr-3 sm:px-4 lg:px-5 sm:border-l sm:border-hairline">
                      <p className="text-lg sm:text-xl lg:text-[22px] xl:text-2xl font-semibold text-[#243B35] tracking-tight tabular-nums whitespace-nowrap">
                        {stats.studentsReached}
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#343A36]/70 font-medium mt-0.5 leading-snug line-clamp-2">
                        {stats.studentsLabel}
                      </p>
                    </div>

                    {/* Stat 4: Average Rating */}
                    <div className="min-w-0 pt-3 sm:pt-0 pl-3 sm:pl-4 lg:pl-5 border-l border-hairline">
                      <p className="text-lg sm:text-xl lg:text-[22px] xl:text-2xl font-black text-[#243B35] tracking-tight tabular-nums whitespace-nowrap">
                        {stats.averageRating}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug line-clamp-2">
                        {stats.ratingLabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider for Desktop */}
                <div className="hidden lg:block h-12 w-px bg-hairline shrink-0" />

                {/* Right Call To Action with 3D Books Illustration */}
                <div className="flex items-center justify-between gap-4 lg:shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-hairline max-w-sm lg:max-w-[280px] xl:max-w-xs">
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-[#243B35] leading-snug">
                      {stats.ctaTitle}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {stats.ctaDescription}
                    </p>
                    <div className="mt-2.5 sm:mt-3">
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full bg-brand-forest hover:bg-brand-forest-deep text-white text-xs font-semibold px-4 py-2 gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Link to="/programs">
                          <span>{stats.ctaButtonText}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="h-16 w-20 sm:h-20 sm:w-24 xl:h-24 xl:w-28 shrink-0 flex items-center justify-center">
                    <img
                      src={successBooksImg}
                      alt="Education and Success"
                      width={145}
                      height={95}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 4. Share Your Experience Form */}
          <Reveal delay={250}>
            <div className="mt-8 rounded-2xl border border-hairline bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* Left Header */}
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#EDF3F0] text-[#243B35] flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#243B35]">
                      Share Your Experience
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 mt-0.5">
                      Your feedback helps us improve and reach more students.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Send us your review via email and be a part of our growing community.
                    </p>
                  </div>
                </div>

                {/* Center Form */}
                <div className="w-full lg:max-w-md">
                  <form
                    onSubmit={handleQuickSubmit}
                    className="flex flex-col sm:flex-row items-center gap-2"
                  >
                    <div className="relative w-full">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="yourname@example.com"
                        className="pl-9 h-10 rounded-full border-hairline text-xs bg-[#FAF9F5] focus-visible:bg-white"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto shrink-0 rounded-full bg-brand-forest hover:bg-brand-forest-deep text-white text-xs font-semibold px-5 h-10 gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Send className="h-3 w-3" />
                      <span>Send Review</span>
                    </Button>
                  </form>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-2 justify-center sm:justify-start">
                    <Lock className="h-3 w-3" />
                    <span>Your information is safe with us. We value your privacy.</span>
                  </p>
                </div>

                {/* Right Decorative Message */}
                <div className="hidden xl:flex items-center gap-2 text-[#B47A4B] select-none">
                  <svg
                    className="w-16 h-8 text-[#B47A4B]/80 stroke-current"
                    viewBox="0 0 60 30"
                    fill="none"
                  >
                    <path d="M2,28 C20,28 35,5 55,8" strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>
                  <span className="font-serif italic text-xs font-semibold text-[#B47A4B]">
                    Your words make a difference!
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Share Review Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#243B35] flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#B47A4B]" />
              <span>Share Your Review</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Share how EDUARC guided your academic or career journey.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveReview} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-slate-700">Your Full Name *</Label>
                <Input
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  placeholder="e.g. Ananya Sharma"
                  className="mt-1 h-9 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-700">Email Address *</Label>
                <Input
                  type="email"
                  value={modalForm.email}
                  onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                  placeholder="yourname@gmail.com"
                  className="mt-1 h-9 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            {/* Profile Photo: Upload custom photo or auto-load from Gmail / Google */}
            <div className="rounded-xl border border-hairline bg-[#FAF9F5] p-3">
              <div className="flex items-center gap-3.5">
                <div className="relative h-13 w-13 rounded-full overflow-hidden bg-slate-100 border-2 border-[#243B35]/40 shadow-xs shrink-0 flex items-center justify-center">
                  <img
                    key={modalForm.avatar || modalForm.email || modalForm.name}
                    src={
                      modalForm.avatar ||
                      (modalForm.email && modalForm.email.includes("@")
                        ? getAvatarUrl(modalForm.email, modalForm.name)
                        : getGoogleMaterialAvatarSvg(modalForm.name || "User", modalForm.email))
                    }
                    alt="Reviewer Avatar Preview"
                    width={52}
                    height={52}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.dataset.fallbackApplied) {
                        img.dataset.fallbackApplied = "true";
                        img.src = getGoogleMaterialAvatarSvg(
                          modalForm.name || "User",
                          modalForm.email,
                        );
                      }
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">Profile Photo</span>
                    {modalForm.avatar && (
                      <button
                        type="button"
                        onClick={() => setModalForm((prev) => ({ ...prev, avatar: "" }))}
                        className="text-[11px] text-red-500 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <X className="h-3 w-3" />
                        <span>Use Gmail Photo</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {modalForm.avatar
                      ? "Custom photo attached for your review card."
                      : modalForm.email && modalForm.email.includes("@")
                        ? "Auto-loaded from your Gmail / Google account."
                        : "Enter your email to auto-detect your Gmail photo, or choose a photo."}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-hairline text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-xs transition-colors">
                      <Camera className="h-3.5 w-3.5 text-brand-forest" />
                      <span>{modalForm.avatar ? "Change Photo" : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                    {modalForm.avatar && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Attached</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-slate-700">Your Role</Label>
                <select
                  value={modalForm.role}
                  onChange={(e) => setModalForm({ ...modalForm, role: e.target.value })}
                  className="mt-1 w-full h-9 rounded-xl border border-input bg-transparent px-3 text-xs"
                >
                  <option value="Student">Student</option>
                  <option value="Class 10 Student">Class 10 Student</option>
                  <option value="Class 12 Student">Class 12 Student</option>
                  <option value="College Student">College Student</option>
                  <option value="Parent">Parent</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Institution Representative">Institution Partner</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-700">Rating</Label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setModalForm({ ...modalForm, rating: star })}
                      className="cursor-pointer text-[#B47A4B] hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          star <= modalForm.rating
                            ? "fill-[#B47A4B] text-[#B47A4B]"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-slate-700">Program / Session</Label>
              <Input
                value={modalForm.category}
                onChange={(e) => setModalForm({ ...modalForm, category: e.target.value })}
                placeholder="e.g. Career Guidance Session"
                className="mt-1 h-9 rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-slate-700">Your Feedback / Review</Label>
              <Textarea
                value={modalForm.review}
                onChange={(e) => setModalForm({ ...modalForm, review: e.target.value })}
                placeholder="Describe how the guidance or mentoring helped you..."
                rows={4}
                className="mt-1 rounded-xl text-xs resize-none"
                required
              />
            </div>

            {/* Honeypot field for bot deterrence */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="sr-only opacity-0 pointer-events-none absolute -left-[9999px]"
              aria-hidden="true"
            />

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="rounded-full bg-brand-forest hover:bg-brand-forest-deep text-white text-xs font-semibold px-5 cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
