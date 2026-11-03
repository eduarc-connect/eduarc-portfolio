// Server-only email sending module using Gmail SMTP (via nodemailer).
import nodemailer from "nodemailer";
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
  provider?: "gmail_smtp";
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #142744; padding: 32px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #FFFFFF;">
                      EDU<span style="color: #0284C7;">ARC</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #94A3B8;">
                      Ambitious to Achievement
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #142744; line-height: 1.3;">
                ${renderedHeading}
              </h1>

              <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #0284C7;">
                ${renderedGreeting}
              </p>

              ${bodyParagraphs}

              <!-- Highlights Box -->
              <div style="background-color: #F0F9FF; border-left: 4px solid #0284C7; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0369A1; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${template.highlightsTitle}
                </p>
                <ul style="margin: 0; padding-left: 0; list-style-type: none;">
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
 * Creates a configured nodemailer transporter for Gmail SMTP.
 */
function createGmailTransporter() {
  const user = process.env["GMAIL_USER"] || "eduarc.connect@gmail.com";
  const pass = process.env["GMAIL_APP_PASSWORD"];

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Verifies live connection and authentication with Gmail SMTP server.
 */
export async function verifyGmailSmtpConnection(): Promise<{
  ok: boolean;
  message: string;
  user: string;
}> {
  const user = process.env["GMAIL_USER"] || "eduarc.connect@gmail.com";
  const pass = process.env["GMAIL_APP_PASSWORD"];

  if (!pass) {
    return {
      ok: false,
      message: "GMAIL_APP_PASSWORD is not configured in .env. Generate a 16-character App Password from Google Account.",
      user,
    };
  }

  try {
    const transporter = createGmailTransporter();
    await transporter.verify();
    return {
      ok: true,
      message: "Connected and authenticated successfully with Gmail SMTP!",
      user,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      message: msg,
      user,
    };
  }
}

/**
 * Returns current Gmail SMTP configuration status for the admin dashboard.
 */
export function getGmailDiagnosticInfo() {
  const user = process.env["GMAIL_USER"] || "eduarc.connect@gmail.com";
  const hasPassword = Boolean(process.env["GMAIL_APP_PASSWORD"]);

  return {
    user,
    isConfigured: hasPassword,
  };
}

/**
 * Sends the automated greeting email to a student or partner via Gmail SMTP.
 */
export async function sendGreetingEmail(
  params: SendGreetingParams,
  templateOverride?: EmailTemplate,
): Promise<SendEmailResult> {
  const pass = process.env["GMAIL_APP_PASSWORD"];
  if (!pass) {
    console.warn("[sendGreetingEmail] GMAIL_APP_PASSWORD is not configured in environment variables.");
    return {
      success: false,
      error: "GMAIL_APP_PASSWORD is not configured in .env. Please add your 16-character Google App Password.",
    };
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
    process.env["GMAIL_FROM"] ||
    template.fromEmail ||
    "EduArc <eduarc.connect@gmail.com>";

  const replyToAddress =
    process.env["GMAIL_REPLY_TO"] ||
    template.replyTo ||
    "eduarc.connect@gmail.com";

  try {
    const transporter = createGmailTransporter();
    const info = await transporter.sendMail({
      from: fromAddress,
      to: params.to.trim().toLowerCase(),
      replyTo: replyToAddress,
      subject,
      html,
      text,
    });

    console.log(`[sendGreetingEmail] Gmail SMTP email sent successfully to ${params.to} (MessageId: ${info.messageId})`);
    return { success: true, id: info.messageId, provider: "gmail_smtp" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[sendGreetingEmail] Gmail SMTP error:", msg);
    return { success: false, error: msg };
  }
}
