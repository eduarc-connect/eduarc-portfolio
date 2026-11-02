import * as XLSX from "xlsx";
import type { EnquiryRow } from "./enquiry.functions";
import { statusLabels, roleLabels, type EnquiryRole } from "./enquiry";

/**
 * Neutralizes spreadsheet formula trigger characters (=, +, -, @, \t, \r)
 * to prevent Formula Injection (CWE-1236) when opened in Excel or Calc.
 */
export function sanitizeSpreadsheetValue(val: string | null | undefined): string {
  if (!val) return "";
  if (/^[=+\-@\t\r]/.test(val)) {
    return "'" + val;
  }
  return val;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function getRoleDisplay(role: string | null | undefined): string {
  if (!role) return "Student";
  const r = role.toLowerCase() as EnquiryRole;
  return roleLabels[r] ?? role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * Generates and downloads a native modern Excel spreadsheet (.xlsx - OpenXML format)
 * compatible with Microsoft Excel 2016-2024, Microsoft 365, Google Sheets, LibreOffice, and mobile apps.
 * Fixes legacy "Microsoft Excel 97-2003 Worksheet (.xls)" compatibility issues.
 */
export function exportStudentsToExcel(rows: EnquiryRow[], customFilename?: string): void {
  const dateStr = new Date().toISOString().split("T")[0];
  let filename = customFilename || `EduArc_Enquiries_${dateStr}.xlsx`;
  if (filename.endsWith(".xls")) {
    filename = filename.replace(/\.xls$/, ".xlsx");
  }

  const data = rows.map((row, idx) => {
    let statusText = "New";
    if (row.status === "contacted" || row.status === "done") {
      statusText = "Contacted";
    } else if (row.status === "follow_up" || row.status === "contact_again") {
      statusText = "Follow-up Required";
    } else if (row.status === "resolved") {
      statusText = "Resolved";
    } else if (row.status === "not_available") {
      statusText = "Not Available";
    }

    return {
      "Sl. No.": idx + 1,
      "Full Name": sanitizeSpreadsheetValue(row.full_name),
      "Role": getRoleDisplay(row.role),
      "Phone": sanitizeSpreadsheetValue(row.phone),
      "WhatsApp": sanitizeSpreadsheetValue(row.whatsapp),
      "Email": sanitizeSpreadsheetValue(row.email),
      "Education Level": sanitizeSpreadsheetValue(row.education) || "—",
      "Child Name": sanitizeSpreadsheetValue(row.child_name) || "—",
      "Institution / College": sanitizeSpreadsheetValue(row.college) || "—",
      "Designation": sanitizeSpreadsheetValue(row.designation) || "—",
      "Mentor Expertise": sanitizeSpreadsheetValue(row.mentor_expertise) || "—",
      "Remarks": sanitizeSpreadsheetValue(row.remarks) || "—",
      "Privacy Consent": row.consent_given ? `Yes (${row.consent_version || "2026.1"})` : "—",
      "Marketing Consent": row.marketing_consent ? "Opted In" : "No",
      "Status": statusText,
      "Submitted At": formatDate(row.created_at),
      "Status Updated": formatDate(row.status_updated_at),
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-fit column widths for clear readability in Excel
  ws["!cols"] = [
    { wch: 8 },  // Sl. No.
    { wch: 22 }, // Full Name
    { wch: 14 }, // Role
    { wch: 15 }, // Phone
    { wch: 15 }, // WhatsApp
    { wch: 26 }, // Email
    { wch: 20 }, // Education Level
    { wch: 20 }, // Child Name
    { wch: 25 }, // Institution / College
    { wch: 20 }, // Designation
    { wch: 24 }, // Mentor Expertise
    { wch: 30 }, // Remarks
    { wch: 18 }, // Privacy Consent
    { wch: 18 }, // Marketing Consent
    { wch: 18 }, // Status
    { wch: 22 }, // Submitted At
    { wch: 22 }, // Status Updated
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Enquiries");

  // Generate real modern .xlsx OpenXML binary array
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, filename);
}

/**
 * Generates and downloads a clean CSV file with UTF-8 BOM so Excel opens it with perfect encoding.
 */
export function exportStudentsToCsv(rows: EnquiryRow[], customFilename?: string): void {
  const dateStr = new Date().toISOString().split("T")[0];
  let filename = customFilename || `EduArc_Enquiries_${dateStr}.csv`;
  if (filename.endsWith(".xls") || filename.endsWith(".xlsx")) {
    filename = filename.replace(/\.xlsx?$/, ".csv");
  }

  const headers = [
    "Sl No",
    "Full Name",
    "Role",
    "Phone",
    "WhatsApp",
    "Email",
    "Education Level",
    "Child Name",
    "Institution Name",
    "Designation",
    "Mentor Expertise",
    "Remarks",
    "Privacy Consent",
    "Marketing Consent",
    "Status",
    "Submitted At",
    "Status Updated",
  ];

  /**
   * Escapes quotes and neutralizes spreadsheet formula injection (CWE-1236)
   * for CSV export by prefixing formula indicators (=, +, -, @, \t, \r) with a single quote (').
   */
  const escapeCsv = (val: string | null | undefined): string => {
    if (!val) return '""';
    let s = val.replace(/"/g, '""');
    if (/^[=+\-@\t\r]/.test(s)) {
      s = "'" + s;
    }
    return `"${s}"`;
  };

  const csvRows = rows.map((r, i) => [
    i + 1,
    escapeCsv(r.full_name),
    escapeCsv(getRoleDisplay(r.role)),
    escapeCsv(r.phone),
    escapeCsv(r.whatsapp),
    escapeCsv(r.email),
    escapeCsv(r.education),
    escapeCsv(r.child_name),
    escapeCsv(r.college),
    escapeCsv(r.designation),
    escapeCsv(r.mentor_expertise),
    escapeCsv(r.remarks),
    escapeCsv(r.consent_given ? `Yes (${r.consent_version || "2026.1"})` : "—"),
    escapeCsv(r.marketing_consent ? "Opted In" : "No"),
    escapeCsv(r.status ? (statusLabels[r.status] ?? r.status) : "New"),
    escapeCsv(formatDate(r.created_at)),
    escapeCsv(formatDate(r.status_updated_at)),
  ]);

  const csvContent =
    "\uFEFF" + [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
