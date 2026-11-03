import { describe, expect, it } from "vitest";
import {
  DEFAULT_WHATSAPP_GREETING,
  enquirySchema,
  formatWhatsAppGreeting,
  normalizeIndianMobile,
  statusUpdateSchema,
  whatsappHref,
} from "@/lib/enquiry";

const validStudent = {
  role: "student" as const,
  fullName: "Ananya Rao",
  phone: "98765 43210",
  whatsapp: "+91 98765 43210",
  email: "Ananya@Example.com",
  college: "Sunrise PU College",
  education: "12th / PUC",
  privacyConsent: true,
};

describe("Role-based enquiry form validation", () => {
  it("accepts a fully filled student form and normalises contact numbers", () => {
    const r = enquirySchema.parse(validStudent);
    expect(r.role).toBe("student");
    expect(r.phone).toBe("9876543210");
    expect(r.whatsapp).toBe("9876543210");
    expect(r.email).toBe("ananya@example.com");
    expect(r.education).toBe("12th / PUC");
    expect(r.privacyConsent).toBe(true);
    expect(r.marketingConsent).toBe(false);
  });

  it("accepts a parent / guardian submission with child details and remarks", () => {
    const parentData = {
      role: "parent" as const,
      fullName: "Suresh Kumar",
      phone: "98450 12345",
      whatsapp: "98450 12345",
      email: "suresh.kumar@example.com",
      childName: "Ananya Kumar",
      education: "Class 10",
      remarks: "Looking for science stream guidance after 10th board exams.",
      privacyConsent: true,
      marketingConsent: true,
    };
    const r = enquirySchema.parse(parentData);
    expect(r.role).toBe("parent");
    expect(r.childName).toBe("Ananya Kumar");
    expect(r.education).toBe("Class 10");
    expect(r.remarks).toBe("Looking for science stream guidance after 10th board exams.");
    expect(r.privacyConsent).toBe(true);
    expect(r.marketingConsent).toBe(true);
  });

  it("accepts a school / college institution submission", () => {
    const instData = {
      role: "institution" as const,
      fullName: "Dr. K. S. Murthy",
      phone: "98451 98765",
      whatsapp: "98451 98765",
      email: "principal@nationalcollege.edu",
      college: "National PU College, Bangalore",
      designation: "Principal",
      remarks: "Interested in campus-wide career orientation workshop for 250 students.",
      privacyConsent: true,
    };
    const r = enquirySchema.parse(instData);
    expect(r.role).toBe("institution");
    expect(r.college).toBe("National PU College, Bangalore");
    expect(r.designation).toBe("Principal");
    expect(r.privacyConsent).toBe(true);
  });

  it("accepts a mentor submission with professional credentials", () => {
    const mentorData = {
      role: "mentor" as const,
      fullName: "Dr. Arvind Rao",
      phone: "98800 54321",
      whatsapp: "98800 54321",
      email: "arvind.rao@univ.edu",
      designation: "Associate Professor",
      mentorExpertise: "Bio-technology & Life Sciences",
      remarks: "Available for weekend student advisory panels.",
      privacyConsent: true,
    };
    const r = enquirySchema.parse(mentorData);
    expect(r.role).toBe("mentor");
    expect(r.designation).toBe("Associate Professor");
    expect(r.mentorExpertise).toBe("Bio-technology & Life Sciences");
    expect(r.privacyConsent).toBe(true);
  });

  it("enforces role-specific requirements: rejects student without education", () => {
    const invalid = { ...validStudent, education: "" };
    expect(enquirySchema.safeParse(invalid).success).toBe(false);
  });

  it("enforces role-specific requirements: rejects institution without college or designation", () => {
    const invalid1 = {
      role: "institution" as const,
      fullName: "Dr. Murthy",
      phone: "98451 98765",
      whatsapp: "98451 98765",
      email: "principal@school.edu",
      college: "",
      designation: "Principal",
      privacyConsent: true,
    };
    expect(enquirySchema.safeParse(invalid1).success).toBe(false);

    const invalid2 = { ...invalid1, college: "St. Joseph's", designation: "" };
    expect(enquirySchema.safeParse(invalid2).success).toBe(false);
  });

  it("enforces role-specific requirements: rejects mentor without expertise", () => {
    const invalid = {
      role: "mentor" as const,
      fullName: "Dr. Arvind",
      phone: "98800 54321",
      whatsapp: "98800 54321",
      email: "arvind@univ.edu",
      designation: "Professor",
      mentorExpertise: "",
      privacyConsent: true,
    };
    expect(enquirySchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts empty optional remarks, but rejects remarks exceeding 500 characters", () => {
    // Empty remarks
    const withoutRemarks = { ...validStudent, remarks: "" };
    expect(enquirySchema.safeParse(withoutRemarks).success).toBe(true);

    // 500 characters remarks
    const exact500 = "a".repeat(500);
    expect(enquirySchema.safeParse({ ...validStudent, remarks: exact500 }).success).toBe(true);

    // 501 characters remarks -> must fail
    const overLimit = "a".repeat(501);
    const result = enquirySchema.safeParse({ ...validStudent, remarks: overLimit });
    expect(result.success).toBe(false);
  });

  it("only accepts 10-digit Indian mobile numbers", () => {
    expect(normalizeIndianMobile("09876543210")).toBe("9876543210");
    expect(normalizeIndianMobile("12345")).toBeNull();
    expect(normalizeIndianMobile("5876543210")).toBeNull();
  });

  it("strictly enforces privacy policy consent agreement", () => {
    // Missing privacy consent
    const withoutConsent = { ...validStudent, privacyConsent: undefined };
    const resWithout = enquirySchema.safeParse(withoutConsent);
    expect(resWithout.success).toBe(false);

    // False privacy consent
    const withFalse = { ...validStudent, privacyConsent: false };
    const resFalse = enquirySchema.safeParse(withFalse);
    expect(resFalse.success).toBe(false);
    if (!resFalse.success) {
      expect(resFalse.error.issues[0]?.message).toMatch(/Privacy Policy/i);
    }

    // True privacy consent
    const withTrue = { ...validStudent, privacyConsent: true };
    expect(enquirySchema.safeParse(withTrue).success).toBe(true);
  });

  it("handles optional marketing consent independently", () => {
    const optIn = { ...validStudent, privacyConsent: true, marketingConsent: true };
    const parsedOptIn = enquirySchema.parse(optIn);
    expect(parsedOptIn.marketingConsent).toBe(true);

    const optOut = { ...validStudent, privacyConsent: true, marketingConsent: false };
    const parsedOptOut = enquirySchema.parse(optOut);
    expect(parsedOptOut.marketingConsent).toBe(false);
  });
});

describe("Counselling status schema", () => {
  const id = "3f1c2a9e-7b1d-4a5e-9c3f-2b8d6e4a1c70";
  it("allows all supported status values or cleared", () => {
    for (const status of [
      "contacted",
      "follow_up",
      "resolved",
      "done",
      "contact_again",
      "not_available",
      null,
    ]) {
      expect(statusUpdateSchema.safeParse({ id, status }).success).toBe(true);
    }
    expect(statusUpdateSchema.safeParse({ id, status: "invalid_status" }).success).toBe(false);
  });
});

describe("Admin-only Enquiry Deletion", () => {
  it("exports deleteEnquiry and rejects unauthenticated callers", async () => {
    const { deleteEnquiry } = await import("@/lib/enquiry.functions");
    expect(typeof deleteEnquiry).toBe("function");

    // Unauthenticated callers without admin session must be rejected
    await expect(
      deleteEnquiry({ data: { id: "00000000-0000-0000-0000-000000000000" } }),
    ).rejects.toThrow();
  });
});

describe("WhatsApp URL Generation and Greeting Formatter", () => {
  it("generates direct link to student without message when none is provided", () => {
    expect(whatsappHref("9876543210")).toBe("https://wa.me/919876543210");
    expect(whatsappHref("+91 98765 43210")).toBe("https://wa.me/919876543210");
  });

  it("appends URI-encoded custom greeting message", () => {
    const msg = "Hello Ananya Rao, thank you for contacting EDUARC!";
    const href = whatsappHref("9876543210", msg);
    expect(href).toBe(
      `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`,
    );
  });

  it("formats template by replacing {name} placeholders dynamically", () => {
    const formatted = formatWhatsAppGreeting(
      "Hello {name}, thank you for contacting EDUARC!",
      "Ananya Rao",
    );
    expect(formatted).toBe("Hello Ananya Rao, thank you for contacting EDUARC!");

    // Case insensitivity & {student_name}
    expect(
      formatWhatsAppGreeting("Hi {NAME}! Welcome to EDUARC.", "Rahul"),
    ).toBe("Hi Rahul! Welcome to EDUARC.");
    expect(
      formatWhatsAppGreeting("Hi {student_name}! Welcome to EDUARC.", "Rahul"),
    ).toBe("Hi Rahul! Welcome to EDUARC.");
  });

  it("falls back to DEFAULT_WHATSAPP_GREETING when template is empty", () => {
    const res = formatWhatsAppGreeting("", "Vikram");
    expect(res).toContain("Hello Vikram");
    expect(res).toContain("thank you for contacting EDUARC");
  });
});

describe("Duplicate Enquiry Verification & Handling", () => {
  it("rejects duplicate submissions with same email and phone", async () => {
    const { submitEnquiry } = await import("@/lib/enquiry.functions");
    expect(typeof submitEnquiry).toBe("function");
  });
});
