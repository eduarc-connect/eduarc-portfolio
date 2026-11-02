import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Building2,
  CalendarClock,
  Download,
  Eye,
  FileSpreadsheet,
  GraduationCap,
  KeyRound,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  ShieldCheck,
  X,
  FileText,
  Clock,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import {
  changeReceptionPassword,
  listEnquiries,
  receptionLogout,
  type EnquiryRow,
} from "@/lib/enquiry.functions";
import { enquiriesQuery, receptionStatusQuery } from "@/lib/reception-queries";
import { type EnquiryRole } from "@/lib/enquiry";
import { exportStudentsToExcel, exportStudentsToCsv } from "@/lib/export-excel";
import { BrandLogo } from "@/components/site/BrandLogo";
import { WhatsAppTemplateModal } from "./WhatsAppTemplateModal";
import { PasswordPanel } from "@/components/admin/PasswordPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { normalizeStatus, EnquiryCard, EnquiryDetailModal } from "./enquiry-components";

type RoleFilter = "all" | EnquiryRole;
type StatusFilter = "all" | "new" | "contacted" | "follow_up" | "resolved";

const roleFilterTabs: { id: RoleFilter; label: string }[] = [
  { id: "all", label: "All Enquiries" },
  { id: "student", label: "Students" },
  { id: "parent", label: "Parents" },
  { id: "institution", label: "Institutions" },
];

const statusFilterTabs: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All Statuses" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "follow_up", label: "Follow-up" },
  { id: "resolved", label: "Resolved" },
];

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });
const when = (iso: string) => `${dateFmt.format(new Date(iso))}, ${timeFmt.format(new Date(iso))}`;

export function ReceptionDashboard() {
  const queryClient = useQueryClient();
  const logout = useServerFn(receptionLogout);
  const fetchEnquiries = useServerFn(listEnquiries);

  const {
    data: rows = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: enquiriesQuery.queryKey,
    queryFn: () => fetchEnquiries(),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<EnquiryRow | null>(null);

  // Accurate real-time summary counts by role
  const counts = useMemo(() => {
    const c = {
      total: rows.length,
      student: 0,
      parent: 0,
      institution: 0,
      mentor: 0,
    };
    for (const r of rows) {
      const role = (r.role || "student").toLowerCase();
      if (role === "student" || role === "unknown") c.student++;
      else if (role === "parent") c.parent++;
      else if (role === "institution") c.institution++;
      else if (role === "mentor") c.mentor++;
      else c.student++;
    }
    return c;
  }, [rows]);

  const effectiveRoleFilter = roleFilter === "mentor" && counts.mentor === 0 ? "all" : roleFilter;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, "");

    return rows.filter((r) => {
      // Role filter check
      if (effectiveRoleFilter !== "all") {
        const itemRole = (r.role || "student").toLowerCase();
        if (effectiveRoleFilter === "student" && itemRole !== "student" && itemRole !== "unknown")
          return false;
        if (effectiveRoleFilter !== "student" && itemRole !== effectiveRoleFilter) return false;
      }

      // Status filter check
      if (statusFilter !== "all") {
        const norm = normalizeStatus(r.status);
        if (norm !== statusFilter) return false;
      }

      // Query check
      if (!q) return true;

      const searchable = [
        r.full_name,
        r.email,
        r.college ?? "",
        r.education ?? "",
        r.child_name ?? "",
        r.designation ?? "",
        r.mentor_expertise ?? "",
        r.remarks ?? "",
        r.role ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchable.includes(q) ||
        (qDigits.length >= 3 && (r.phone.includes(qDigits) || r.whatsapp.includes(qDigits)))
      );
    });
  }, [rows, effectiveRoleFilter, statusFilter, query]);

  async function onLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Reception logout error:", err);
    }
    queryClient.removeQueries({ queryKey: enquiriesQuery.queryKey });
    queryClient.setQueryData(receptionStatusQuery.queryKey, { authenticated: false });
    await queryClient.invalidateQueries({ queryKey: receptionStatusQuery.queryKey });
  }

  function handleExportExcel() {
    if (rows.length === 0) {
      toast.error("No student enquiries available to download.");
      return;
    }
    const toExport =
      visible.length > 0 &&
      (effectiveRoleFilter !== "all" || statusFilter !== "all" || query.trim().length > 0)
        ? visible
        : rows;
    const isFiltered = toExport.length !== rows.length;
    exportStudentsToExcel(
      toExport,
      isFiltered
        ? `EDUARC_Enquiries_${effectiveRoleFilter}_${statusFilter}_${new Date().toISOString().split("T")[0]}.xlsx`
        : undefined,
    );
    toast.success(
      isFiltered
        ? `Exported ${toExport.length} filtered record(s) to Excel (.xlsx)`
        : `Exported all ${rows.length} enquiry record(s) to Excel (.xlsx)`,
    );
  }

  function handleExportCsv() {
    if (rows.length === 0) {
      toast.error("No student enquiries available to download.");
      return;
    }
    const toExport =
      visible.length > 0 &&
      (effectiveRoleFilter !== "all" || statusFilter !== "all" || query.trim().length > 0)
        ? visible
        : rows;
    const isFiltered = toExport.length !== rows.length;
    exportStudentsToCsv(
      toExport,
      isFiltered
        ? `EDUARC_Enquiries_${effectiveRoleFilter}_${statusFilter}_${new Date().toISOString().split("T")[0]}.csv`
        : undefined,
    );
    toast.success(
      isFiltered
        ? `Exported ${toExport.length} filtered record(s) to CSV`
        : `Exported all ${rows.length} enquiry record(s) to CSV`,
    );
  }

  const hasActiveFilters =
    effectiveRoleFilter !== "all" || statusFilter !== "all" || query.trim().length > 0;

  const clearFilters = () => {
    setRoleFilter("all");
    setStatusFilter("all");
    setQuery("");
  };

  return (
    <div className="relative isolate min-h-screen bg-surface/40">
      {/* Top Header */}
      <header className="glass-nav sticky top-0 z-40 border-b border-hairline/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <Badge variant="navy" className="hidden sm:inline-flex py-0.5">
              Reception Portal
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="pill-gold"
              size="sm"
              className="text-xs font-bold"
              onClick={handleExportExcel}
              disabled={rows.length === 0}
              title="Download enquiries list in modern Microsoft Excel (.xlsx) file"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Export Excel</span>
            </Button>
            <Button
              variant="pill-outline"
              size="sm"
              className="hidden lg:inline-flex text-xs font-semibold bg-white/80 border-slate-300 text-slate-700 hover:bg-slate-100"
              onClick={handleExportCsv}
              disabled={rows.length === 0}
              title="Download enquiries list in universal CSV format"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              <span>CSV</span>
            </Button>
            <Button
              variant="pill-outline"
              size="sm"
              className="bg-white/80 border-emerald-500/30 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              onClick={() => setWaModalOpen(true)}
              title="Customize WhatsApp greeting message template"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1.5">WhatsApp Msg</span>
            </Button>
            <Button
              variant="pill-outline"
              size="sm"
              className="bg-white/80"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
              <span className="hidden sm:inline ml-1.5">Refresh</span>
            </Button>
            <Button
              variant="pill-outline"
              size="sm"
              className="bg-white/80"
              onClick={() => setPasswordOpen(true)}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1.5">Password</span>
            </Button>
            <Button
              variant="pill-outline"
              size="sm"
              className="bg-white/80 text-muted-foreground hover:text-destructive hover:border-destructive/30"
              onClick={onLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1.5">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-6 md:pt-10">
        {/* Title area */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-hairline">
          <div>
            <span className="type-eyebrow text-[#B47A4B]">Reception Operations</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#243B35] mt-1 font-heading">
              Role-Based Enquiries &amp; Leads
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Review live submissions across Students, Parents, and Institutions, follow up with
              direct contact actions, and manage status progression.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[#B47A4B] shrink-0" />
            <span>Authorized Reception Desk</span>
          </div>
        </div>

        {/* Summary Cards by Role */}
        <div
          className={cn(
            "mt-8 grid gap-3",
            counts.mentor > 0
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
              : "grid-cols-2 sm:grid-cols-4",
          )}
        >
          <button
            type="button"
            onClick={() => setRoleFilter("all")}
            aria-pressed={effectiveRoleFilter === "all"}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all cursor-pointer shadow-xs",
              effectiveRoleFilter === "all"
                ? "border-[#243B35] bg-[#243B35] text-white ring-2 ring-[#243B35]"
                : "border-hairline bg-white hover:border-[#243B35]/40 hover:shadow-card",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-semibold",
                  effectiveRoleFilter === "all" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                Total Enquiries
              </span>
              <FileText
                className={cn(
                  "h-4 w-4",
                  effectiveRoleFilter === "all" ? "text-[#E8E0D1]" : "text-[#243B35]",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 block text-2xl font-bold tracking-tight",
                effectiveRoleFilter === "all" ? "text-white" : "text-[#243B35]",
              )}
            >
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter("student")}
            aria-pressed={effectiveRoleFilter === "student"}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all cursor-pointer shadow-xs",
              effectiveRoleFilter === "student"
                ? "border-[#243B35] bg-[#243B35] text-white ring-2 ring-[#243B35]"
                : "border-hairline bg-white hover:border-[#243B35]/40 hover:shadow-card",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-semibold",
                  effectiveRoleFilter === "student" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                Students
              </span>
              <GraduationCap
                className={cn(
                  "h-4 w-4",
                  effectiveRoleFilter === "student" ? "text-[#E8E0D1]" : "text-[#243B35]",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 block text-2xl font-bold tracking-tight",
                effectiveRoleFilter === "student" ? "text-white" : "text-[#243B35]",
              )}
            >
              {counts.student}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter("parent")}
            aria-pressed={effectiveRoleFilter === "parent"}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all cursor-pointer shadow-xs",
              effectiveRoleFilter === "parent"
                ? "border-[#243B35] bg-[#243B35] text-white ring-2 ring-[#243B35]"
                : "border-hairline bg-white hover:border-[#243B35]/40 hover:shadow-card",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-semibold",
                  effectiveRoleFilter === "parent" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                Parents / Guardians
              </span>
              <Users
                className={cn(
                  "h-4 w-4",
                  effectiveRoleFilter === "parent" ? "text-[#E8E0D1]" : "text-[#243B35]",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 block text-2xl font-bold tracking-tight",
                effectiveRoleFilter === "parent" ? "text-white" : "text-[#243B35]",
              )}
            >
              {counts.parent}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleFilter("institution")}
            aria-pressed={effectiveRoleFilter === "institution"}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all cursor-pointer shadow-xs",
              effectiveRoleFilter === "institution"
                ? "border-[#243B35] bg-[#243B35] text-white ring-2 ring-[#243B35]"
                : "border-hairline bg-white hover:border-[#243B35]/40 hover:shadow-card",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-semibold",
                  effectiveRoleFilter === "institution" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                Institutions
              </span>
              <Building2
                className={cn(
                  "h-4 w-4",
                  effectiveRoleFilter === "institution" ? "text-[#E8E0D1]" : "text-[#243B35]",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 block text-2xl font-bold tracking-tight",
                effectiveRoleFilter === "institution" ? "text-white" : "text-[#243B35]",
              )}
            >
              {counts.institution}
            </span>
          </button>

          {counts.mentor > 0 && (
            <button
              type="button"
              onClick={() => setRoleFilter("mentor")}
              aria-pressed={effectiveRoleFilter === "mentor"}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all cursor-pointer shadow-xs",
                effectiveRoleFilter === "mentor"
                  ? "border-[#243B35] bg-[#243B35] text-white ring-2 ring-[#243B35]"
                  : "border-hairline bg-white hover:border-[#243B35]/40 hover:shadow-card",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    effectiveRoleFilter === "mentor" ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  Mentors (Historical)
                </span>
                <Sparkles
                  className={cn(
                    "h-4 w-4",
                    effectiveRoleFilter === "mentor" ? "text-[#E8E0D1]" : "text-[#243B35]",
                  )}
                />
              </div>
              <span
                className={cn(
                  "mt-2 block text-2xl font-bold tracking-tight",
                  effectiveRoleFilter === "mentor" ? "text-white" : "text-[#243B35]",
                )}
              >
                {counts.mentor}
              </span>
            </button>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone, email, institution, education, designation, or remarks..."
              aria-label="Search enquiries"
              className="h-12 rounded-2xl border-hairline bg-white pl-11 text-sm text-foreground shadow-xs focus-visible:ring-2 focus-visible:ring-brand-gold"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Secondary Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Status:</span>
              {statusFilterTabs.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={cn(
                    "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    statusFilter === st.id
                      ? "border-brand-navy bg-brand-navy text-white shadow-xs"
                      : "border-hairline bg-white text-foreground/80 hover:border-brand-gold/50",
                  )}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-brand-navy"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </div>

        {/* Enquiries Record Cards */}
        <div className="mt-6 space-y-4">
          {visible.length === 0 ? (
            <div className="rounded-3xl border border-hairline bg-white px-6 py-16 text-center shadow-xs">
              <Users className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-3 text-base font-bold text-brand-navy">
                {rows.length === 0
                  ? "No enquiries recorded yet"
                  : "No enquiries match your current filters"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                {rows.length === 0
                  ? "Incoming submissions from the role-based enquiry form will populate here automatically."
                  : "Try clearing your search query or switching to another role/status tab."}
              </p>
              {hasActiveFilters && (
                <div className="mt-4">
                  <Button variant="pill-outline" size="sm" onClick={clearFilters}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            visible.map((r, i) => (
              <EnquiryCard key={r.id} row={r} index={i} onOpenDetails={() => setActiveDetail(r)} />
            ))
          )}
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={activeDetail !== null} onOpenChange={(open) => !open && setActiveDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-hairline bg-white shadow-lift">
          <DialogTitle className="sr-only">Enquiry Details</DialogTitle>
          {activeDetail && (
            <EnquiryDetailModal row={activeDetail} onClose={() => setActiveDetail(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="max-w-xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Change Reception Password</DialogTitle>
          <PasswordPanel title="Change Reception Password" action={changeReceptionPassword} />
        </DialogContent>
      </Dialog>

      {/* WhatsApp Greeting Template Dialog */}
      <WhatsAppTemplateModal open={waModalOpen} onOpenChange={setWaModalOpen} />
    </div>
  );
}
