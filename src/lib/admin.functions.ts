import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { siteContentSchema } from "@/content/eduarc";
import {
  changeOwnPassword,
  receptionAccessInfo,
  requireAdmin,
  setReceptionPassword,
  staffLogin,
  staffLogout,
  staffStatus,
} from "./staff.server";

const passwordInput = z.object({ password: z.string().min(1).max(200) });
const changeInput = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().max(200),
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(() => staffStatus("admin"));

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d) => passwordInput.parse(d))
  .handler(({ data }) => staffLogin("admin", data.password));

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  await staffLogout("admin");
  return { ok: true as const };
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .validator((d) => siteContentSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: "main", data, updated_at: new Date().toISOString() });
    if (error) throw new Error("Could not save changes");
    return { ok: true as const };
  });

export const changeAdminPassword = createServerFn({ method: "POST" })
  .validator((d) => changeInput.parse(d))
  .handler(({ data }) => changeOwnPassword("admin", data.currentPassword, data.newPassword));

export const getReceptionAccess = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return receptionAccessInfo();
});

export const adminSetReceptionPassword = createServerFn({ method: "POST" })
  .validator((d) => passwordInput.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    return setReceptionPassword(data.password);
  });

export const resetReceptionPassword = adminSetReceptionPassword;

/**
 * Parses a Supabase Storage public URL to extract the bucket and path.
 */
function parseSupabaseStorageUrl(
  url?: string | null,
): { bucket: string; path: string } | null {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!match) return null;
  return {
    bucket: match[1]!,
    path: decodeURIComponent(match[2]!),
  };
}

/**
 * Deletes an asset from Supabase Storage if the URL belongs to Supabase storage.
 */
export async function removeImageFromStorageIfSupabase(url?: string | null) {
  if (!url) return;
  const parsed = parseSupabaseStorageUrl(url);
  if (!parsed) return;
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from(parsed.bucket).remove([parsed.path]);
    if (error) {
      console.warn(
        `[removeImageFromStorage] Failed to remove ${parsed.bucket}/${parsed.path}:`,
        error.message,
      );
    } else {
      console.log(`[removeImageFromStorage] Removed ${parsed.bucket}/${parsed.path}`);
    }
  } catch (err) {
    console.warn(`[removeImageFromStorage] Exception removing ${url}:`, err);
  }
}

const uploadImageInput = z.object({
  fileName: z.string().max(200),
  contentType: z.string().max(100).default("image/jpeg"),
  base64Data: z.string().max(15_000_000),
  sessionId: z.string().max(150).default("custom"),
  type: z.enum(["card", "hero", "gallery"]).default("card"),
  galleryIndex: z.number().optional(),
  oldImageUrl: z.string().optional(),
});

export const uploadProgramImage = createServerFn({ method: "POST" })
  .validator((d) => uploadImageInput.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Clean base64 prefix
    const rawBase64 = data.base64Data.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(rawBase64, "base64");

    const cleanSessionId =
      data.sessionId
        .toLowerCase()
        .replace(/[^\w-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "custom";

    let targetFileName = "";
    const ext = data.contentType.includes("webp") ? "webp" : "jpg";
    if (data.type === "card") {
      targetFileName = `card.${ext}`;
    } else if (data.type === "hero") {
      targetFileName = `hero.${ext}`;
    } else if (data.type === "gallery") {
      const idx = (data.galleryIndex ?? 0) + 1;
      targetFileName = `gallery-${idx}.${ext}`;
    } else {
      targetFileName = `${Date.now()}-${data.fileName.toLowerCase().replace(/[^\w.-]/g, "-")}`;
    }

    // Keep every session's images in its own separate directory: sessions/{sessionId}/...
    const uniquePath = `sessions/${cleanSessionId}/${targetFileName}`;

    // If an old image URL was provided and differs from the target path, clean it up
    if (data.oldImageUrl) {
      const oldParsed = parseSupabaseStorageUrl(data.oldImageUrl);
      if (oldParsed && (oldParsed.bucket !== "programs" || oldParsed.path !== uniquePath)) {
        await removeImageFromStorageIfSupabase(data.oldImageUrl);
      }
    }

    // Upload to Supabase Storage bucket 'programs'
    const { error: uploadError } = await supabaseAdmin.storage
      .from("programs")
      .upload(uniquePath, buffer, {
        contentType: data.contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("[uploadProgramImage] Storage upload error:", uploadError);
      throw new Error(`Failed to upload image to Supabase Storage: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from("programs").getPublicUrl(uniquePath);

    return {
      ok: true as const,
      publicUrl: publicUrlData.publicUrl,
      path: uniquePath,
    };
  });

export const deleteStorageImage = createServerFn({ method: "POST" })
  .validator((d) => z.object({ url: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    await removeImageFromStorageIfSupabase(data.url);
    return { ok: true as const };
  });

const uploadTestimonialInput = z.object({
  fileName: z.string().max(200),
  contentType: z.string().max(100).default("image/webp"),
  base64Data: z.string().max(15_000_000),
  testimonialName: z.string().max(100).optional(),
  oldPhotoUrl: z.string().optional(),
});

export const uploadTestimonialImage = createServerFn({ method: "POST" })
  .validator((d) => uploadTestimonialInput.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // If old photo exists in Supabase storage, delete it to prevent storage bloat
    if (data.oldPhotoUrl) {
      await removeImageFromStorageIfSupabase(data.oldPhotoUrl);
    }

    // Clean base64 prefix
    const rawBase64 = data.base64Data.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(rawBase64, "base64");

    const cleanName =
      (data.testimonialName || "reviewer")
        .toLowerCase()
        .replace(/[^\w-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "avatar";

    const ext = data.contentType.includes("webp") ? "webp" : "jpg";
    const uniquePath = `avatars/${cleanName}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("testimonials")
      .upload(uniquePath, buffer, {
        contentType: data.contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("[uploadTestimonialImage] Storage upload error:", uploadError);
      throw new Error(`Failed to upload photo to Supabase: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("testimonials")
      .getPublicUrl(uniquePath);

    return {
      ok: true as const,
      publicUrl: publicUrlData.publicUrl,
      path: uniquePath,
    };
  });

export const deleteTestimonialPhoto = createServerFn({ method: "POST" })
  .validator((d) => z.object({ photoUrl: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    await removeImageFromStorageIfSupabase(data.photoUrl);
    return { ok: true as const };
  });

/**
 * Admin-only: Fetch Gmail SMTP configuration status.
 */
export const getGmailDiagnostics = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { getGmailDiagnosticInfo } = await import("./email.server");
  return getGmailDiagnosticInfo();
});

/**
 * Admin-only: Test live connection and authentication with Gmail SMTP server.
 */
export const testGmailConnection = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const { verifyGmailSmtpConnection } = await import("./email.server");
  return await verifyGmailSmtpConnection();
});

/**
 * Admin-only: Send a live test greeting email using Gmail SMTP.
 */
export const sendTestGreetingEmail = createServerFn({ method: "POST" })
  .validator((d) =>
    z
      .object({
        to: z.string().trim().email("Enter a valid recipient email"),
        fullName: z.string().trim().default("EduArc Admin Test"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { sendGreetingEmail } = await import("./email.server");
    const result = await sendGreetingEmail({
      to: data.to,
      fullName: data.fullName,
      role: "student",
      phone: "+91 95357 21089",
    });

    if (!result.success) {
      throw new Error(result.error || result.reason || "Failed to deliver test email via Gmail SMTP.");
    }
    return { ok: true as const, id: result.id, provider: result.provider };
  });
