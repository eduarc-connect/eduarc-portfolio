import { describe, expect, it, vi } from "vitest";

const mockSendMail = vi.fn();
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: mockSendMail,
    })),
  },
}));

import {
  buildGreetingEmailHtml,
  sendGreetingEmail,
} from "@/lib/email.server";
import { defaultContent } from "@/content/eduarc";

describe("Gmail SMTP & Greeting System", () => {
  const sampleTemplate = {
    ...defaultContent.emailTemplate,
    subject: "Welcome to EduArc, {name}!",
    heading: "Your Guidance Journey Begins",
    greeting: "Dear {name},",
    body: "Thank you for reaching out regarding {role}. We have your email {email} and phone {phone}.",
    highlightsTitle: "Next steps:",
    highlight1: "Consultation call",
    highlight2: "Curated roadmap",
    highlight3: "Verified mentor",
    closing: "Best regards,",
    signature: "EduArc Team",
  };

  it("replaces dynamic placeholders in subject, greeting and body", () => {
    const { subject, html, text } = buildGreetingEmailHtml(sampleTemplate, {
      name: "Aarav",
      fullName: "Aarav Sharma",
      role: "Student Career Guidance",
      email: "aarav@example.com",
      phone: "9876543210",
    });

    expect(subject).toBe("Welcome to EduArc, Aarav!");
    expect(html).toContain("Dear Aarav,");
    expect(html).toContain("Student Career Guidance");
    expect(html).toContain("aarav@example.com");
    expect(html).toContain("Consultation call");
    expect(html).toContain("EDU");
    expect(html).toContain("ARC");
    expect(text).toContain("Subject: Welcome to EduArc, Aarav!");
    expect(text).toContain("Best regards,");
  });

  it("skips sending if email sending is disabled in template", async () => {
    vi.stubEnv("GMAIL_APP_PASSWORD", "mockapppassword123");

    const disabledTemplate = { ...sampleTemplate, enabled: false };
    const res = await sendGreetingEmail(
      {
        to: "disabled@example.com",
        fullName: "Test User",
      },
      disabledTemplate,
    );

    expect(res.success).toBe(false);
    expect(res.reason).toBe("disabled");
  });

  it("returns error if GMAIL_APP_PASSWORD is not configured", async () => {
    vi.stubEnv("GMAIL_APP_PASSWORD", "");

    const res = await sendGreetingEmail(
      {
        to: "someone@example.com",
        fullName: "Test User",
      },
      { ...sampleTemplate, enabled: true },
    );

    expect(res.success).toBe(false);
    expect(res.error).toContain("GMAIL_APP_PASSWORD");
  });

  it("sends email via Gmail SMTP with correct parameters", async () => {
    vi.stubEnv("GMAIL_USER", "eduarc.connect@gmail.com");
    vi.stubEnv("GMAIL_APP_PASSWORD", "abcd efgh ijkl mnop");
    vi.stubEnv("GMAIL_FROM", "EduArc <eduarc.connect@gmail.com>");
    vi.stubEnv("GMAIL_REPLY_TO", "eduarc.connect@gmail.com");

    mockSendMail.mockResolvedValueOnce({ messageId: "<gmail-msg-12345@gmail.com>" });

    const res = await sendGreetingEmail(
      {
        to: "student@example.com",
        fullName: "Rohan V",
        role: "student",
        phone: "9988776655",
      },
      { ...sampleTemplate, enabled: true },
    );

    expect(res.success).toBe(true);
    expect(res.id).toBe("<gmail-msg-12345@gmail.com>");
    expect(res.provider).toBe("gmail_smtp");
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "EduArc <eduarc.connect@gmail.com>",
        to: "student@example.com",
        replyTo: "eduarc.connect@gmail.com",
        subject: "Welcome to EduArc, Rohan!",
      }),
    );
  });
});
