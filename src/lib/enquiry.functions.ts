import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { enquirySchema, statusUpdateSchema, type CounsellingStatus } from "./enquiry";
import { checkRateLimit, getClientIp, ENQUIRY_RATE_LIMIT_OPTIONS } from "./rate-limit.server";
import {
  changeOwnPassword,
  requireAdmin,
  requireReception,
  staffLogin,
  staffLogout,
  staffStatus,
} from "./staff.server";

export type EnquiryRow = {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  college: string | null;
  education: string | null;
  role: string | null;
  child_name: string | null;
  designation: string | null;
  mentor_expertise: string | null;
  remarks: string | null;
  consent_given: boolean | null;
  consent_timestamp: string | null;
  consent_version: string | null;
  marketing_consent: boolean | null;
  marketing_consent_timestamp: string | null;
  status: CounsellingStatus | null;
  status_updated_at: string | null;
  created_at: string;
};

/** Public: anyone can submit the role-based enquiry form. Input is fully re-validated here. */
export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((d) => enquirySchema.parse(d))
  .handler(async ({ data }) => {
    // Honeypot: bots fill the hidden "website" field; pretend success and store nothing.
    if (data.website) return { ok: true as const };

    // Rate limiting by client IP
    let ip = "unknown";
    try {
      const req = getRequest();
      if (req?.headers) ip = getClientIp(req.headers);
    } catch {
      ip = "unknown";
    }

    const rateCheck = checkRateLimit(`enquiry:${ip}`, ENQUIRY_RATE_LIMIT_OPTIONS);
    if (!rateCheck.allowed) {
      const minutes = Math.max(1, Math.ceil(rateCheck.retryAfterSeconds / 60));
      throw new Error(
        `Too many submissions. Please wait ${minutes} minute${minutes === 1 ? "" : "s"} before submitting again.`,
      );
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const normalizedEmail = data.email.trim().toLowerCase();
    const normalizedPhone = data.phone.trim();
    const phoneVariants = [normalizedPhone, `+91${normalizedPhone}`, `91${normalizedPhone}`];

    // 1. Check if duplicate record exists with the same email AND the same phone number
    const { data: duplicateRows, error: dupCheckErr } = await supabaseAdmin
      .from("partner_enquiries")
      .select("id")
      .ilike("email", normalizedEmail)
      .in("phone", phoneVariants)
      .limit(1);

    if (!dupCheckErr && duplicateRows && duplicateRows.length > 0) {
      throw new Error("A record with this email and phone number already exists.");
    }

    // 2. Check if this email address has already submitted before (one-time greeting email guarantee)
    const { data: priorEmailRows } = await supabaseAdmin
      .from("partner_enquiries")
      .select("id")
      .ilike("email", normalizedEmail)
      .limit(1);

    const isFirstSubmissionForEmail = !priorEmailRows || priorEmailRows.length === 0;

    // Compute standard text fallback values for college and education for backward compatibility
    let collegeVal = data.college || "";
    let educationVal = data.education || "";

    if (data.role === "student") {
      collegeVal = collegeVal || "Student";
    } else if (data.role === "parent") {
      collegeVal =
        collegeVal || (data.childName ? `Parent of ${data.childName}` : "Parent / Guardian");
    } else if (data.role === "institution") {
      educationVal =
        educationVal || (data.designation ? `Institution (${data.designation})` : "Institution");
    } else if (data.role === "mentor") {
      collegeVal =
        collegeVal || (data.designation ? `Mentor: ${data.designation}` : "Academic Mentor");
      educationVal = educationVal || data.mentorExpertise || "Mentorship";
    }

    const nowIso = new Date().toISOString();
    const fullPayload = {
      full_name: data.fullName,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      college: collegeVal,
      education: educationVal,
      role: data.role,
      child_name: data.childName || null,
      designation: data.designation || null,
      mentor_expertise: data.mentorExpertise || null,
      remarks: data.remarks || null,
      consent_given: true,
      consent_timestamp: nowIso,
      consent_version: "2026.1",
      marketing_consent: Boolean(data.marketingConsent),
      marketing_consent_timestamp: data.marketingConsent ? nowIso : null,
    };

    function isMissingColumnError(err: { message?: string } | null | undefined): boolean {
      if (!err || !err.message) return false;
      const msg = err.message.toLowerCase();
      return (
        msg.includes("column") ||
        msg.includes("schema cache") ||
        msg.includes("does not exist") ||
        msg.includes("could not find") ||
        msg.includes("pgrst204")
      );
    }

    let { error } = await supabaseAdmin.from("partner_enquiries").insert(fullPayload);

    // If new columns are not yet applied in remote Supabase, fall back gracefully to legacy schema
    if (error && isMissingColumnError(error)) {
      console.warn(
        `[submitEnquiry] Column missing in database (${error.message}); falling back to legacy schema with preserved context.`,
      );
      const rolePrefix = data.role ? `[Role: ${data.role}] ` : "";
      const childPrefix = data.childName ? `[Child: ${data.childName}] ` : "";
      const packedCollege = [
        rolePrefix + childPrefix,
        collegeVal || data.remarks || "Direct Enquiry",
      ]
        .filter(Boolean)
        .join(" ")
        .slice(0, 150);

      const basePayload = {
        full_name: data.fullName,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
        college: packedCollege.length >= 2 ? packedCollege : "Direct Enquiry",
        education: (educationVal || "General Guidance").slice(0, 100),
      };
      const retry = await supabaseAdmin.from("partner_enquiries").insert(basePayload);
      error = retry.error;
    }

    if (error) {
      console.error("submitEnquiry failed", error.message);
      throw new Error("Could not save your details");
    }

    // 3. Trigger greeting email only after successful fresh submission (one-time per email address)
    if (isFirstSubmissionForEmail) {
      try {
        const { sendGreetingEmail } = await import("./email.server");
        await sendGreetingEmail({
          to: normalizedEmail,
          fullName: data.fullName,
          role: data.role,
          phone: data.phone,
        });
      } catch (emailErr) {
        console.error("[submitEnquiry] Error triggering greeting email:", emailErr);
      }
    }

    return { ok: true as const };
  });

export const getReceptionStatus = createServerFn({ method: "GET" }).handler(async () => {
  return staffStatus("reception");
});

export const receptionLogin = createServerFn({ method: "POST" })
  .validator((d) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(({ data }) => staffLogin("reception", data.password));

export const receptionLogout = createServerFn({ method: "POST" }).handler(async () => {
  await staffLogout("reception");
  return { ok: true as const };
});

export const changeReceptionPassword = createServerFn({ method: "POST" })
  .validator((d) =>
    z
      .object({ currentPassword: z.string().min(1).max(200), newPassword: z.string().max(200) })
      .parse(d),
  )
  .handler(({ data }) => changeOwnPassword("reception", data.currentPassword, data.newPassword));

export const listEnquiries = createServerFn({ method: "GET" }).handler(async () => {
  await requireReception();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  let { data, error } = await supabaseAdmin
    .from("partner_enquiries")
    .select(
      "id, full_name, phone, whatsapp, email, college, education, role, child_name, designation, mentor_expertise, remarks, consent_given, consent_timestamp, consent_version, marketing_consent, marketing_consent_timestamp, status, status_updated_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(2000);

  // If new columns are missing in remote DB, fall back to legacy columns and polyfill defaults
  if (error && isMissingColumnError(error)) {
    const fallback = await supabaseAdmin
      .from("partner_enquiries")
      .select(
        "id, full_name, phone, whatsapp, email, college, education, status, status_updated_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(2000);

    if (fallback.error) throw new Error("Could not load enquiries");
    data = (fallback.data ?? []).map((row) => ({
      ...row,
      role: "student",
      child_name: null,
      designation: null,
      mentor_expertise: null,
      remarks: null,
      consent_given: true,
      consent_timestamp: row.created_at,
      consent_version: "legacy",
      marketing_consent: false,
      marketing_consent_timestamp: null,
    }));
    error = null;
  }

  if (error) throw new Error("Could not load enquiries");
  return (data ?? []) as EnquiryRow[];
});

export const updateEnquiryStatus = createServerFn({ method: "POST" })
  .validator((d) => statusUpdateSchema.parse(d))
  .handler(async ({ data }) => {
    await requireReception();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const statusUpdatedAt = data.status ? new Date().toISOString() : null;

    let targetStatus = data.status;
    let { error } = await supabaseAdmin
      .from("partner_enquiries")
      .update({ status: targetStatus, status_updated_at: statusUpdatedAt })
      .eq("id", data.id);

    // If remote DB still enforces the legacy check constraint ('done', 'contact_again', 'not_available')
    // from migration 0001, map modern status values to legacy equivalents:
    if (
      error &&
      (error.code === "23514" ||
        error.message?.includes("partner_enquiries_status_check") ||
        error.message?.includes("check constraint"))
    ) {
      const legacyMap: Record<string, string> = {
        follow_up: "contact_again",
        contacted: "done",
        resolved: "done",
        done: "done",
        contact_again: "contact_again",
        not_available: "not_available",
      };
      const fallbackStatus = data.status ? (legacyMap[data.status] ?? data.status) : null;
      console.warn(
        `[updateEnquiryStatus] Check constraint rejected status '${data.status}'. Retrying with legacy status '${fallbackStatus}'...`,
      );
      const retry = await supabaseAdmin
        .from("partner_enquiries")
        .update({ status: fallbackStatus, status_updated_at: statusUpdatedAt })
        .eq("id", data.id);
      error = retry.error;
      targetStatus = fallbackStatus as typeof data.status;
    }

    if (error) {
      console.error("[updateEnquiryStatus] update failed:", error.message);
      throw new Error(`Could not update status: ${error.message}`);
    }
    return { ok: true as const, statusUpdatedAt, status: targetStatus };
  });

/**
 * Admin-only: Permanently delete an enquiry from the database.
 * Strictly gated behind requireAdmin() so reception desk staff cannot delete records.
 */
export const deleteEnquiry = createServerFn({ method: "POST" })
  .validator((d) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("partner_enquiries").delete().eq("id", data.id);

    if (error) {
      console.error("[deleteEnquiry] delete failed:", error.message);
      throw new Error(`Could not delete enquiry: ${error.message}`);
    }

    return { ok: true as const, deletedId: data.id };
  });
