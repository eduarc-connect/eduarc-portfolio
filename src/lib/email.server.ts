// Server-only Resend email sending module.
import { defaultContent, type EmailTemplate } from "@/content/eduarc";

export interface SendGreetingParams {
  to: string;
  fullName: string;
  role?: string | null;
  phone?: string | null;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  reason?: string;
}

/**
 * Loads the active email template from the site_content table in Supabase,
 * falling back to defaultContent.emailTemplate if not customized.
 */
export async function getEmailTemplate(): Promise<EmailTemplate> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("site_content")
      .select("data")
      .eq("id", "main")
      .maybeSingle();

    if (!error && data?.data && typeof data.data === "object") {
      const savedData = data.data as Record<string, unknown>;
      if (savedData["emailTemplate"] && typeof savedData["emailTemplate"] === "object") {
        return {
          ...defaultContent.emailTemplate,
          ...(savedData["emailTemplate"] as Partial<EmailTemplate>),
        };
      }
    }
  } catch (err) {
    console.warn("[getEmailTemplate] Error reading site_content for emailTemplate:", err);
  }
  return defaultContent.emailTemplate;
}

function formatRoleLabel(role?: string | null): string {
  if (!role) return "Student Career Guidance";
  const lower = role.toLowerCase();
  if (lower === "student") return "Student Career Guidance";
  if (lower === "parent") return "Parent Guidance & Stream Consultation";
  if (lower === "institution") return "School & College Partnership";
  if (lower === "mentor") return "Academic Mentorship";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function replacePlaceholders(
  text: string,
  params: { name: string; fullName: string; role: string; email: string; phone: string },
): string {
  return text
    .replace(/{name}/gi, params.name)
    .replace(/{fullName}/gi, params.fullName)
    .replace(/{role}/gi, params.role)
    .replace(/{email}/gi, params.email)
    .replace(/{phone}/gi, params.phone);
}

/**
 * Builds a clean, responsive, professional HTML email layout matching EduArc brand colors.
 */
export function buildGreetingEmailHtml(
  template: EmailTemplate,
  params: { name: string; fullName: string; role: string; email: string; phone: string },
): { html: string; text: string; subject: string } {
  const renderedSubject = replacePlaceholders(template.subject, params);
  const renderedHeading = replacePlaceholders(template.heading, params);
  const renderedGreeting = replacePlaceholders(template.greeting, params);
  const renderedBody = replacePlaceholders(template.body, params);
  const renderedClosing = replacePlaceholders(template.closing, params);
  const renderedSignature = replacePlaceholders(template.signature, params);

  // Format body paragraphs
  const bodyParagraphs = renderedBody
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">${p.replace(/\n/g, "<br/>")}</p>`,
    )
    .join("");

  const highlights = [template.highlight1, template.highlight2, template.highlight3]
    .filter(Boolean)
    .map(
      (h) => `
        <li style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.5; color: #1E293B;">
          <strong style="color: #142744;">✓</strong> ${h}
        </li>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${renderedSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF9F5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E2DBD0; box-shadow: 0 4px 16px rgba(20, 39, 68, 0.06);">
          <!-- Top Brand Header -->
          <tr>
            <td style="background-color: #142744; padding: 32px 32px 28px 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.5px;">EDUARC</h1>
                    <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px; color: #E5A83B;">Ambitious to Achievement</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #142744; letter-spacing: -0.3px;">
                ${renderedHeading}
              </h2>

              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #142744;">
                ${renderedGreeting}
              </p>

              ${bodyParagraphs}

              <!-- Highlights Box -->
              <div style="background-color: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #243B35;">
                  ${template.highlightsTitle}
                </p>
                <ul style="margin: 0; padding-left: 18px; list-style-type: none;">
                  ${highlights}
                </ul>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0 20px 0;">
                <tr>
                  <td align="center" style="border-radius: 9999px; background-color: #142744;">
                    <a href="https://www.eduarc-connect.in" target="_blank" style="font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; padding: 12px 28px; display: inline-block; border-radius: 9999px;">
                      Visit EduArc Website &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <p style="margin: 28px 0 6px 0; font-size: 14px; color: #475569;">
                ${renderedClosing}
              </p>
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #142744; white-space: pre-line;">
                ${renderedSignature}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748B;">
                EduArc &bull; Empowering Students for a Brighter Future
              </p>
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #94A3B8;">
                Phone: +91 95357 21089 &bull; Email: eduarc.connect@gmail.com
              </p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                This automated greeting was sent to confirm your guidance enquiry.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Subject: ${renderedSubject}

${renderedHeading}

${renderedGreeting}

${renderedBody}

${template.highlightsTitle}
- ${template.highlight1}
- ${template.highlight2}
- ${template.highlight3}

Visit website: https://www.eduarc-connect.in

${renderedClosing}
${renderedSignature}
`;

  return { html, text, subject: renderedSubject };
}

/**
 * Sends the automated greeting email to a student or partner via Resend.
 */
export async function sendGreetingEmail(
  params: SendGreetingParams,
  templateOverride?: EmailTemplate,
): Promise<SendEmailResult> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.warn("[sendGreetingEmail] RESEND_API_KEY is not configured in environment variables.");
    return { success: false, error: "RESEND_API_KEY is not configured." };
  }

  const template = templateOverride || (await getEmailTemplate());
  if (template.enabled === false) {
    console.log("[sendGreetingEmail] Email sending is disabled in admin email template.");
    return { success: false, reason: "disabled" };
  }

  const firstName = params.fullName.trim().split(/\s+/)[0] || "Student";
  const roleName = formatRoleLabel(params.role);

  const { html, text, subject } = buildGreetingEmailHtml(template, {
    name: firstName,
    fullName: params.fullName.trim(),
    role: roleName,
    email: params.to.trim().toLowerCase(),
    phone: params.phone || "",
  });

  const fromAddress =
    process.env["RESEND_FROM_EMAIL"] ||
    template.fromEmail ||
    "EduArc <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [params.to.trim().toLowerCase()],
        subject,
        html,
        text,
      }),
    });

    const data = (await response.json()) as { id?: string; message?: string; name?: string; statusCode?: number };

    if (!response.ok) {
      console.warn(`[sendGreetingEmail] Resend API error (${response.status}):`, data.message || data);

      // If custom from address failed (e.g. domain not verified), try once with onboarding@resend.dev
      if (
        fromAddress !== "EduArc <onboarding@resend.dev>" &&
        (response.status === 403 || data.message?.toLowerCase().includes("domain"))
      ) {
        console.log("[sendGreetingEmail] Retrying with default onboarding@resend.dev fallback...");
        const fallbackRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "EduArc <onboarding@resend.dev>",
            to: [params.to.trim().toLowerCase()],
            subject,
            html,
            text,
          }),
        });
        const fallbackData = (await fallbackRes.json()) as { id?: string; message?: string };
        if (fallbackRes.ok && fallbackData.id) {
          console.log(`[sendGreetingEmail] Fallback email sent successfully: ${fallbackData.id}`);
          return { success: true, id: fallbackData.id };
        }
      }

      return { success: false, error: data.message || "Failed to send email via Resend" };
    }

    console.log(`[sendGreetingEmail] Greeting email sent successfully to ${params.to} (ID: ${data.id})`);
    return { success: true, id: data.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[sendGreetingEmail] Network or server error:", msg);
    return { success: false, error: msg };
  }
}
