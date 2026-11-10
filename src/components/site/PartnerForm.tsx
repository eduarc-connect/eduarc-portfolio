import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Building2,
  Check,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  PenLine,
  SendHorizontal,
  ShieldCheck,
  User,
  UserCheck,
} from "lucide-react";
import { PaperPlaneButton } from "@/components/site/PaperPlaneButton";
import { submitEnquiry } from "@/lib/enquiry.functions";
import { trackEnquirySubmit } from "@/lib/analytics-client";
import { educationLevels, enquirySchema, roleLabels, type EnquiryInput } from "@/lib/enquiry";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PartnerRole = "student" | "parent" | "institution";
const partnerRoles: readonly PartnerRole[] = ["student", "parent", "institution"] as const;

type FormState = {
  role: PartnerRole;
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  education: string;
  childName: string;
  college: string;
  designation: string;
  remarks: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
};

const emptyState: FormState = {
  role: "student",
  fullName: "",
  phone: "",
  whatsapp: "",
  email: "",
  education: "",
  childName: "",
  college: "",
  designation: "",
  remarks: "",
  privacyConsent: false,
  marketingConsent: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

function validateForm(values: FormState): Errors {
  const payload: EnquiryInput = {
    role: values.role,
    fullName: values.fullName,
    phone: values.phone,
    whatsapp: values.whatsapp,
    email: values.email,
    education: values.role === "student" || values.role === "parent" ? values.education : undefined,
    childName: values.role === "parent" ? values.childName || undefined : undefined,
    college: values.role === "institution" ? values.college : undefined,
    designation: values.role === "institution" ? values.designation : undefined,
    remarks: values.remarks.trim() ? values.remarks.trim() : undefined,
    privacyConsent: values.privacyConsent,
    marketingConsent: values.marketingConsent,
  };

  const r = enquirySchema.safeParse(payload);
  if (r.success) return {};
  const errors: Errors = {};
  for (const issue of r.error.issues) {
    const key = issue.path[0] as keyof FormState;
    if (key) errors[key] ??= issue.message;
  }
  return errors;
}

export function PartnerForm() {
  const submit = useServerFn(submitEnquiry);
  const [form, setForm] = useState<FormState>(emptyState);
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [doneName, setDoneName] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const effectiveForm: FormState = {
    ...form,
    whatsapp: sameAsPhone ? form.phone : form.whatsapp,
  };

  const errors = validateForm(effectiveForm);
  const show = (k: keyof FormState) => (submitted || touched[k] ? errors[k] : undefined);

  const setField = (k: keyof FormState) => (v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const markTouched = (k: keyof FormState) => () => {
    setTouched((prev) => ({ ...prev, [k]: true }));
  };

  const handleRoleChange = (newRole: PartnerRole) => {
    setForm((prev) => ({
      ...prev,
      role: newRole,
      education: newRole === "student" || newRole === "parent" ? prev.education : "",
      childName: newRole === "parent" ? prev.childName : "",
      college: newRole === "institution" ? prev.college : "",
      designation: newRole === "institution" ? prev.designation : "",
    }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);

    if (Object.keys(errors).length > 0) return;
    setBusy(true);

    try {
      const payload: EnquiryInput = {
        role: effectiveForm.role,
        fullName: effectiveForm.fullName.trim(),
        phone: effectiveForm.phone.trim(),
        whatsapp: effectiveForm.whatsapp.trim(),
        email: effectiveForm.email.trim(),
        education:
          effectiveForm.role === "student" || effectiveForm.role === "parent"
            ? effectiveForm.education.trim()
            : undefined,
        childName:
          effectiveForm.role === "parent" && effectiveForm.childName.trim()
            ? effectiveForm.childName.trim()
            : undefined,
        college: effectiveForm.role === "institution" ? effectiveForm.college.trim() : undefined,
        designation:
          effectiveForm.role === "institution" ? effectiveForm.designation.trim() : undefined,
        remarks: effectiveForm.remarks.trim() ? effectiveForm.remarks.trim() : undefined,
        privacyConsent: effectiveForm.privacyConsent,
        marketingConsent: effectiveForm.marketingConsent,
      };

      await submit({ data: { ...payload, website: honeypot } });
      trackEnquirySubmit(effectiveForm.role);
      setIsSuccess(true);
      const firstName = effectiveForm.fullName.trim().split(/\s+/)[0] ?? "";

      setTimeout(() => {
        setDoneName(firstName);
        setForm(emptyState);
        setSameAsPhone(false);
        setTouched({});
        setSubmitted(false);
        setIsSuccess(false);
      }, 1100);
    } catch (err: unknown) {
      setIsSuccess(false);
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to send your details right now. Please check your connection and try again.";
      setServerError(msg);
    } finally {
      setBusy(false);
    }
  }

  if (doneName !== null) {
    return (
      <div
        className="rounded-3xl border border-hairline bg-white p-8 md:p-12 text-center shadow-xl animate-in fade-in zoom-in-95 duration-300"
        role="status"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-forest/10 border border-brand-forest/20 text-brand-forest shadow-sm">
          <CheckCircle2 className="h-8 w-8 text-[#243B35]" strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-navy mt-6">
          Thank you! Your enquiry has been submitted successfully.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          Our team will get back to you soon. An academic counsellor from EDUARC will review your
          details and reach out on your provided contact details to discuss next steps.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="rounded-full border border-hairline px-6 py-2.5 text-xs font-semibold text-brand-navy hover:bg-surface transition-colors cursor-pointer"
            onClick={() => setDoneName(null)}
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  const roleIcons = {
    student: GraduationCap,
    parent: User,
    institution: Building2,
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[28px] sm:rounded-[32px] border border-black/5 bg-white p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(20,39,68,0.08)]"
      aria-label="EDUARC Guidance & Partnership Form"
    >
      {/* Header */}
      <div className="border-b border-hairline/80 pb-5">
        <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-brand-navy">
          Request Guidance &amp; Partnership
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Select who you are below. Fields marked with an asterisk (
          <span className="text-destructive">*</span>) are required.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Step 1: Role Selector ("1. I am a...") */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-brand-navy">1. I am a…</legend>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {partnerRoles.map((r) => {
              const active = form.role === r;
              const Icon = roleIcons[r];
              const displayLabel =
                r === "institution"
                  ? "School / College (Institution)"
                  : r === "parent"
                    ? "Parent / Guardian"
                    : roleLabels[r];

              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-3.5 sm:p-4 text-center transition-all cursor-pointer min-h-[96px]",
                    active
                      ? "border-[#243B35] bg-[#243B35] text-white shadow-xs ring-1 ring-[#243B35]"
                      : "border-hairline bg-white text-brand-navy hover:border-[#243B35]/40 hover:bg-surface/50",
                  )}
                  aria-pressed={active}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-transform",
                      active ? "text-white scale-110" : "text-[#243B35]",
                    )}
                  />
                  <span className="text-xs font-semibold leading-tight">{displayLabel}</span>
                  {active && (
                    <div className="absolute bottom-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-white">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Step 2: Role Details Header */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-2 border-b border-hairline/60 pb-2.5">
            <UserCheck className="h-4 w-4 text-[#243B35] shrink-0" />
            <h3 className="text-sm font-semibold text-brand-navy">
              2. {roleLabels[form.role]} Details
            </h3>
          </div>

          {/* Student Fields */}
          {form.role === "student" && (
            <>
              <Field
                id="fullName"
                label="Student Full Name"
                required
                error={show("fullName")}
                hint="Your legal name as per school or college records"
              >
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => setField("fullName")(e.target.value)}
                  onBlur={markTouched("fullName")}
                  placeholder="e.g. Rahul Sharma"
                  autoComplete="name"
                  aria-invalid={Boolean(show("fullName"))}
                  className="h-11 rounded-xl border-hairline bg-white text-sm placeholder:text-muted-foreground/60 focus-visible:border-[#243B35] focus-visible:ring-1 focus-visible:ring-[#243B35]"
                />
              </Field>

              <Field
                id="education"
                label="Current Education Level"
                required
                asGroup
                error={show("education")}
                hint="Select the level you are currently enrolled in"
              >
                <div
                  id="education"
                  role="radiogroup"
                  aria-labelledby="education-label"
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {educationLevels.map((lvl) => {
                    const active = form.education === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setField("education")(lvl)}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer text-center",
                          active
                            ? "border-[#243B35] bg-[#243B35]/10 text-[#243B35] font-bold ring-1 ring-[#243B35]"
                            : "border-hairline bg-white text-foreground/80 hover:border-[#243B35]/40",
                        )}
                        aria-pressed={active}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </>
          )}

          {/* Parent / Guardian Fields */}
          {form.role === "parent" && (
            <>
              <Field
                id="parentName"
                label="Parent / Guardian Name"
                required
                error={show("fullName")}
                hint="Your legal full name"
              >
                <Input
                  id="parentName"
                  value={form.fullName}
                  onChange={(e) => setField("fullName")(e.target.value)}
                  onBlur={markTouched("fullName")}
                  placeholder="e.g. Suresh Kumar"
                  autoComplete="name"
                  aria-invalid={Boolean(show("fullName"))}
                  className="h-11 rounded-xl border-hairline bg-white text-sm focus-visible:border-[#243B35] focus-visible:ring-1 focus-visible:ring-[#243B35]"
                />
              </Field>

              <Field
                id="childEducation"
                label="Child's Current Education Level"
                required
                asGroup
                error={show("education")}
                hint="Select your child's current study stage"
              >
                <div
                  id="childEducation"
                  role="radiogroup"
                  aria-labelledby="childEducation-label"
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {educationLevels.map((lvl) => {
                    const active = form.education === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setField("education")(lvl)}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer text-center",
                          active
                            ? "border-[#243B35] bg-[#243B35]/10 text-[#243B35] font-bold ring-1 ring-[#243B35]"
                            : "border-hairline bg-white text-foreground/80 hover:border-[#243B35]/40",
                        )}
                        aria-pressed={active}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field
                id="childName"
                label="Child's Name"
                optional
                error={show("childName")}
                hint="Optional: helps our counsellor prepare guidance material"
              >
                <Input
                  id="childName"
                  value={form.childName}
                  onChange={(e) => setField("childName")(e.target.value)}
                  onBlur={markTouched("childName")}
                  placeholder="e.g. Ananya Kumar"
                  className="h-11 rounded-xl border-hairline bg-white text-sm focus-visible:border-[#243B35] focus-visible:ring-1 focus-visible:ring-[#243B35]"
                />
              </Field>
            </>
          )}

          {/* School / College (Institution) Fields */}
          {form.role === "institution" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="contactPersonName"
                  label="Contact Person Name"
                  required
                  error={show("fullName")}
                  hint="Your full name"
                >
                  <Input
                    id="contactPersonName"
                    value={form.fullName}
                    onChange={(e) => setField("fullName")(e.target.value)}
                    onBlur={markTouched("fullName")}
                    placeholder="e.g. Dr. Ramesh Rao"
                    autoComplete="name"
                    aria-invalid={Boolean(show("fullName"))}
                    className="h-11 rounded-xl border-hairline bg-white text-sm focus-visible:border-[#243B35] focus-visible:ring-1 focus-visible:ring-[#243B35]"
                  />
                </Field>

                <Field
                  id="designation"
                  label="Designation at Institution"
                  required
                  error={show("designation")}
                  hint="Official title"
                >
                  <Input
                    id="designation"
                    value={form.designation}
                    onChange={(e) => setField("designation")(e.target.value)}
                    onBlur={markTouched("designation")}
                    placeholder="e.g. Principal / Director / Counsellor"
                    aria-invalid={Boolean(show("designation"))}
                    className="h-11 rounded-xl border-hairline bg-white text-sm focus-visible:border-[#243B35] focus-visible:ring-1 focus-visible:ring-[#243B35]"
                  />
                </Field>
              </div>

              <Field
                id="college"
                label="School / College / Institution Name"
                required
                error={show("college")}
                hint="Full official name of your educational institution"
              >
                <Input
                  id="college"
                  value={form.college}
                  onChange={(e) => setField("college")(e.target.value)}
                  onBlur={markTouched("college")}
                  placeholder="e.g. St. Joseph's Pre-University College"
                  aria-invalid={Boolean(show("college"))}
                  className="h-11 rounded-xl border-hairline bg-white text-sm focus-visible:border-[#243B35] focus-visible:ring-1 focus-visible:ring-[#243B35]"
                />
              </Field>
            </>
          )}

          {/* Two-Column Phone & WhatsApp Row with +91 Prepend */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone" className="text-xs font-semibold text-brand-navy">
                Contact Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="mt-1.5 flex rounded-xl border border-hairline bg-white shadow-2xs focus-within:border-[#243B35] focus-within:ring-1 focus-within:ring-[#243B35] overflow-hidden">
                <span className="flex items-center justify-center bg-surface border-r border-hairline px-3 text-xs font-semibold text-muted-foreground select-none">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => setField("phone")(e.target.value)}
                  onBlur={markTouched("phone")}
                  placeholder="98765 43210"
                  autoComplete="tel"
                  maxLength={15}
                  aria-invalid={Boolean(show("phone"))}
                  className="w-full h-11 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 bg-transparent"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                10-digit Indian mobile number
              </p>
              {show("phone") && <p className="text-xs text-destructive mt-1">{show("phone")}</p>}
            </div>

            <div>
              <Label htmlFor="whatsapp" className="text-xs font-semibold text-brand-navy">
                WhatsApp Number <span className="text-destructive">*</span>
              </Label>
              <div
                className={cn(
                  "mt-1.5 flex rounded-xl border border-hairline bg-white shadow-2xs overflow-hidden",
                  sameAsPhone
                    ? "bg-surface text-muted-foreground cursor-not-allowed"
                    : "focus-within:border-[#243B35] focus-within:ring-1 focus-within:ring-[#243B35]",
                )}
              >
                <span className="flex items-center justify-center bg-surface border-r border-hairline px-3 text-xs font-semibold text-muted-foreground select-none">
                  +91
                </span>
                <input
                  id="whatsapp"
                  type="tel"
                  inputMode="numeric"
                  disabled={sameAsPhone}
                  value={effectiveForm.whatsapp}
                  onChange={(e) => setField("whatsapp")(e.target.value)}
                  onBlur={markTouched("whatsapp")}
                  placeholder="98765 43210"
                  maxLength={15}
                  aria-invalid={Boolean(!sameAsPhone && show("whatsapp"))}
                  className={cn(
                    "w-full h-11 px-3 text-sm outline-none placeholder:text-muted-foreground/60 bg-transparent",
                    sameAsPhone ? "text-muted-foreground cursor-not-allowed" : "text-foreground",
                  )}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Where we can send guidance roadmaps and session links.
              </p>
              {!sameAsPhone && show("whatsapp") && (
                <p className="text-xs text-destructive mt-1">{show("whatsapp")}</p>
              )}
            </div>
          </div>

          {/* Sync Checkbox */}
          <div className="flex items-center gap-2 pt-0.5">
            <Checkbox
              id="sameAsPhone"
              checked={sameAsPhone}
              onCheckedChange={(c) => {
                const next = Boolean(c);
                setSameAsPhone(next);
                if (next) setField("whatsapp")(form.phone);
              }}
              className="h-4 w-4 rounded data-[state=checked]:bg-[#243B35] data-[state=checked]:border-[#243B35]"
            />
            <Label
              htmlFor="sameAsPhone"
              className="text-xs font-medium text-foreground/80 cursor-pointer select-none"
            >
              WhatsApp number is the same as contact number
            </Label>
          </div>

          {/* Email Address with left icon */}
          <Field
            id="email"
            label="Email Address"
            required
            error={show("email")}
            hint="We will send confirmed schedules and roadmap submissions to this email"
          >
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setField("email")(e.target.value)}
                onBlur={markTouched("email")}
                placeholder="name@example.com"
                autoComplete="email"
                aria-invalid={Boolean(show("email"))}
                className="w-full h-11 pl-10 pr-3 text-sm text-foreground rounded-xl border border-hairline bg-white outline-none placeholder:text-muted-foreground/60 focus:border-[#243B35] focus:ring-1 focus:ring-[#243B35] shadow-2xs"
              />
            </div>
          </Field>

          {/* Remarks Field with live counter and pencil icon */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="remarks" className="text-xs font-semibold text-brand-navy">
                Remarks / Anything you'd like us to know?{" "}
                <span className="font-normal text-muted-foreground">(Optional)</span>
              </Label>
              <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                {form.remarks.length} / 500
              </span>
            </div>

            <div className="relative">
              <textarea
                id="remarks"
                value={form.remarks}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setField("remarks")(e.target.value);
                  }
                }}
                onBlur={markTouched("remarks")}
                maxLength={500}
                rows={3}
                placeholder="Share your questions, career goals, requirements, or additional information here..."
                className="w-full rounded-xl border border-hairline bg-white p-3 pr-9 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-[#243B35] focus:ring-1 focus:ring-[#243B35] shadow-2xs resize-none"
              />
              <PenLine className="absolute bottom-3 right-3 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            </div>

            {show("remarks") && (
              <p className="text-xs text-destructive" role="alert">
                {show("remarks")}
              </p>
            )}
          </div>

          {/* Honeypot field */}
          <div
            className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="website-hp">Website</label>
            <input
              id="website-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Student & Minor Privacy Notice (DPDPA 2023) */}
          {form.role === "student" && (
            <div className="rounded-xl border border-hairline bg-[#F5F1E8] p-3.5 flex items-start gap-3 text-xs leading-relaxed">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B47A4B]/20 text-[#B47A4B] mt-0.5">
                <Lock className="h-3 w-3" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-[#243B35]">
                  Student &amp; Minor Privacy Notice (DPDPA, 2023)
                </p>
                <p className="text-[11.5px] text-slate-700 leading-relaxed">
                  If you are under 18 years of age, our academic roadmap and career guidance
                  sessions will involve your parents or legal guardian. Please ensure your parent or
                  guardian is aware of and consents to the educational guidance enquiry.
                </p>
              </div>
            </div>
          )}

          {form.role === "parent" && (
            <div className="rounded-xl border border-hairline bg-[#F5F1E8] p-3.5 flex items-start gap-3 text-xs leading-relaxed">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B47A4B]/20 text-[#B47A4B] mt-0.5">
                <Lock className="h-3 w-3" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-[#243B35]">Parental &amp; Guardian Authority</p>
                <p className="text-[11.5px] text-slate-700 leading-relaxed">
                  As a parent or legal guardian, you are submitting this enquiry on behalf of your
                  ward. EDUARC will use these details strictly to provide the educational guidance
                  requested for your child.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Privacy Policy & Consent Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-hairline/80">
            <div className="space-y-1">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="privacyConsent"
                  checked={form.privacyConsent}
                  onCheckedChange={(checked) => {
                    setForm((prev) => ({ ...prev, privacyConsent: Boolean(checked) }));
                    if (touched.privacyConsent) {
                      setTouched((prev) => ({ ...prev, privacyConsent: true }));
                    }
                  }}
                  onBlur={markTouched("privacyConsent")}
                  aria-invalid={Boolean(show("privacyConsent"))}
                  className="mt-0.5 h-4 w-4 rounded-full data-[state=checked]:bg-[#243B35] data-[state=checked]:border-[#243B35]"
                />
                <Label
                  htmlFor="privacyConsent"
                  className="text-xs font-normal text-foreground/90 leading-relaxed cursor-pointer select-none"
                >
                  I have read and agree to EDUARC’s{" "}
                  <Link
                    to="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#243B35] hover:text-brand-navy underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                  . I understand that my information will be used to respond to my enquiry and
                  provide the educational guidance or services I request.{" "}
                  <span className="text-destructive font-semibold">*</span>
                </Label>
              </div>
              {show("privacyConsent") && (
                <p className="text-xs text-destructive pl-6" role="alert">
                  {show("privacyConsent")}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2.5">
              <Checkbox
                id="marketingConsent"
                checked={form.marketingConsent}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, marketingConsent: Boolean(checked) }))
                }
                className="mt-0.5 h-4 w-4 rounded-full data-[state=checked]:bg-[#243B35] data-[state=checked]:border-[#243B35]"
              />
              <Label
                htmlFor="marketingConsent"
                className="text-xs font-normal text-muted-foreground leading-relaxed cursor-pointer select-none"
              >
                I would like to receive updates, educational resources, and information about EDUARC
                programmes and services.{" "}
                <span className="text-[11px] text-muted-foreground/80">(Optional)</span>
              </Label>
            </div>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div
              className="rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs font-medium text-destructive leading-relaxed"
              role="alert"
            >
              {serverError}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <PaperPlaneButton
              type="submit"
              disabled={busy}
              isSubmitting={busy}
              isSuccess={isSuccess}
              idleText="Submit Guidance Request"
              submittingText="Submitting Enquiry…"
              successText="Submitted Successfully"
            />

            <p className="mt-3 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>Your information is secure and will never be shared with third parties.</span>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  optional,
  error,
  hint,
  asGroup,
  children,
}: {
  id: string;
  label: string;
  required?: boolean | undefined;
  optional?: boolean | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  asGroup?: boolean | undefined;
  children: ReactNode;
}) {
  const errId = useId();
  const hintId = useId();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        {asGroup ? (
          <span id={`${id}-label`} className="text-xs font-semibold text-brand-navy">
            {label} {required && <span className="text-destructive">*</span>}
            {optional && <span className="font-normal text-muted-foreground"> (Optional)</span>}
          </span>
        ) : (
          <Label htmlFor={id} className="text-xs font-semibold text-brand-navy">
            {label} {required && <span className="text-destructive">*</span>}
            {optional && <span className="font-normal text-muted-foreground"> (Optional)</span>}
          </Label>
        )}
      </div>

      {children}

      {error ? (
        <p id={errId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[11px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
