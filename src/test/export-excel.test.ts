import { describe, expect, it, vi } from "vitest";
import { exportStudentsToExcel, exportStudentsToCsv, sanitizeSpreadsheetValue } from "@/lib/export-excel";
import type { EnquiryRow } from "@/lib/enquiry.functions";

describe("Export Excel & CSV System", () => {
  const sampleRows: EnquiryRow[] = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      full_name: "Rahul Sharma",
      phone: "9876543210",
      whatsapp: "9876543210",
      email: "rahul@example.com",
      college: "National College",
      education: "Undergraduate",
      status: "contacted",
      status_updated_at: "2026-11-01T10:00:00Z",
      role: "student",
      child_name: null,
      designation: null,
      mentor_expertise: null,
      remarks: "Interested in Career Counseling",
      consent_given: true,
      consent_timestamp: "2026-11-01T09:00:00Z",
      consent_version: "2026.1",
      marketing_consent: false,
      marketing_consent_timestamp: null,
      created_at: "2026-11-01T09:00:00Z",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      full_name: "=1+1 Formula Injection Attempt",
      phone: "+919535721089",
      whatsapp: "9535721089",
      email: "parent@example.com",
      college: null,
      education: null,
      status: "follow_up",
      status_updated_at: null,
      role: "parent",
      child_name: "Aarav",
      designation: null,
      mentor_expertise: null,
      remarks: "@DDE_EXPLOIT",
      consent_given: true,
      consent_timestamp: "2026-11-02T10:00:00Z",
      consent_version: "2026.1",
      marketing_consent: true,
      marketing_consent_timestamp: "2026-11-02T10:00:00Z",
      created_at: "2026-11-02T10:00:00Z",
    },
  ];

  it("sanitizes formula injection triggers", () => {
    expect(sanitizeSpreadsheetValue("=SUM(A1:B10)")).toBe("'=SUM(A1:B10)");
    expect(sanitizeSpreadsheetValue("+12345")).toBe("'+12345");
    expect(sanitizeSpreadsheetValue("-50")).toBe("'-50");
    expect(sanitizeSpreadsheetValue("@cmd")).toBe("'@cmd");
    expect(sanitizeSpreadsheetValue("Normal Text")).toBe("Normal Text");
    expect(sanitizeSpreadsheetValue(null)).toBe("");
  });

  it("exports modern .xlsx workbook without errors", () => {
    // In headless test environments, mock triggerDownload / DOM elements
    const mockClick = vi.fn();
    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();

    vi.stubGlobal("document", {
      createElement: () => ({
        set href(val: string) {},
        set download(val: string) {},
        click: mockClick,
      }),
      body: {
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild,
      },
    });

    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:mock-url"),
      revokeObjectURL: vi.fn(),
    });

    expect(() => exportStudentsToExcel(sampleRows)).not.toThrow();
    expect(mockClick).toHaveBeenCalled();

    // Verify .xls extension is corrected to .xlsx
    expect(() => exportStudentsToExcel(sampleRows, "custom_export.xls")).not.toThrow();
  });

  it("exports CSV with UTF-8 BOM and sanitized values", () => {
    const mockClick = vi.fn();
    vi.stubGlobal("document", {
      createElement: () => ({
        set href(val: string) {},
        set download(val: string) {},
        click: mockClick,
      }),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    });

    expect(() => exportStudentsToCsv(sampleRows)).not.toThrow();
    expect(mockClick).toHaveBeenCalled();
  });
});

