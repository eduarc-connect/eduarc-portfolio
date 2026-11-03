import { describe, expect, it, vi } from "vitest";
import {
  buildGreetingEmailHtml,
  sendGreetingEmail,
} from "@/lib/email.server";
import { defaultContent } from "@/content/eduarc";

describe("Resend Web Mail & Greeting System", () => {
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
    expect(html).toContain("EDUARC");
    expect(text).toContain("Subject: Welcome to EduArc, Aarav!");
    expect(text).toContain("Best regards,");
  });

  it("skips sending if email sending is disabled in template", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_dummy_key");

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

  it("calls Resend REST API with correct headers and payload", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_mock_valid_key");

    const activeTemplate = {
      ...sampleTemplate,
      enabled: true,
      fromEmail: "EduArc <onboarding@resend.dev>",
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "mock-resend-email-id-12345" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const res = await sendGreetingEmail(
      {
        to: "student@example.com",
        fullName: "Rohan V",
        role: "student",
        phone: "9988776655",
      },
      activeTemplate,
    );

    expect(res.success).toBe(true);
    expect(res.id).toBe("mock-resend-email-id-12345");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer re_mock_valid_key",
          "Content-Type": "application/json",
        }),
      }),
    );
  });
});
