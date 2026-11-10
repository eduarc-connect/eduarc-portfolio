import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  BarChart3,
  Check,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  House,
  Info,
  KeyRound,
  Layers,
  Loader2,
  LogOut,
  Mail,
  MailCheck,
  Settings2,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Undo2,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { siteContentSchema, type SiteContent } from "@/content/eduarc";
import { adminLogout, saveSiteContent } from "@/lib/admin.functions";
import { adminStatusQuery } from "@/lib/admin-status";
import { siteContentQuery, useSiteContent } from "@/lib/site-content";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AboutEditor,
  ContactEditor,
  EditorStack,
  EmailTemplateEditor,
  FeaturesEditor,
  GeneralEditor,
  HomeEditor,
  MentorsEditor,
  PartnerEditor,
  ProgramsEditor,
  TestimonialsEditor,
  type EditorProps,
} from "./editors";
import { PasswordPanel } from "./PasswordPanel";
import { ReceptionAdminPanel } from "./ReceptionAdminPanel";
import { AnalyticsAdminPanel } from "./AnalyticsAdminPanel";
import { SecurityAdminPanel } from "./SecurityAdminPanel";

type Section = {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  Editor?: ComponentType<EditorProps>;
  Custom?: ComponentType;
};

const sections: Section[] = [
  {
    id: "home",
    label: "Home",
    icon: House,
    description: "Headline, mission statement, and student journey.",
    Editor: HomeEditor,
  },
  {
    id: "about",
    label: "About",
    icon: Info,
    description: "Educational philosophy, mission, and institutional benefits.",
    Editor: AboutEditor,
  },
  {
    id: "mentors",
    label: "Mentors",
    icon: GraduationCap,
    description: "Manage verified mentor profiles, roadmaps, and credentials.",
    Editor: MentorsEditor,
  },
  {
    id: "features",
    label: "Features",
    icon: Sparkles,
    description: "Platform capabilities, stream exploration, and tools.",
    Editor: FeaturesEditor,
  },
  {
    id: "programs",
    label: "Programs",
    icon: Layers,
    description: "Institutional offerings for schools and colleges.",
    Editor: ProgramsEditor,
  },
  {
    id: "partner",
    label: "Partner",
    icon: HeartHandshake,
    description: "Student & institutional inquiry copy, expectations, and contact promises.",
    Editor: PartnerEditor,
  },
  {
    id: "impact",
    label: "Testimonials",
    icon: TrendingUp,
    description: "Student, parent, and institutional testimonials and reviews.",
    Editor: TestimonialsEditor,
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    description: "Institutional email, support phone, and website channels.",
    Editor: ContactEditor,
  },
  {
    id: "general",
    label: "Brand & Footer",
    icon: Settings2,
    description: "Tagline, footer descriptions, and call-to-action defaults.",
    Editor: GeneralEditor,
  },
  {
    id: "email-template",
    label: "Email Template",
    icon: MailCheck,
    description:
      "Automated welcome & greeting email sent via Resend upon partner / student enquiry submission.",
    Editor: EmailTemplateEditor,
  },
  {
    id: "reception",
    label: "Reception & Leads",
    icon: UserRoundCheck,
    description:
      "Live student & institutional enquiries, progress reports, lead statuses, and staff access.",
    Custom: ReceptionAdminPanel,
  },
  {
    id: "analytics",
    label: "Site Analytics",
    icon: BarChart3,
    description:
      "Visitor volume, popular pages, acquisition sources, device usage, and enquiry conversions.",
    Custom: AnalyticsAdminPanel,
  },
  {
    id: "security-monitoring",
    label: "Security Monitoring",
    icon: ShieldAlert,
    description:
      "Real-time threat detection, IP investigation, WAF audit logs, and active IP blocklist.",
    Custom: SecurityAdminPanel,
  },
  {
    id: "security",
    label: "Admin Security",
    icon: KeyRound,
    description: "Update the master administrator password.",
    Custom: PasswordPanel,
  },
];

const sectionLinks: Record<string, string> = {
  home: "/",
  about: "/about",
  mentors: "/mentors",
  features: "/features",
  programs: "/programs",
  partner: "/partner",
  impact: "/testimonials",
  contact: "/contact",
  general: "/",
  "email-template": "/partner",
  reception: "/reception",
};

function clean(c: SiteContent): SiteContent {
  const keep = (s: string) => s.trim().length > 0;
  return {
    ...c,
    idealFor: c.idealFor.filter(keep),
  };
}

export function AdminDashboard() {
  const saved = useSiteContent();
  const queryClient = useQueryClient();
  const router = useRouter();
  const save = useServerFn(saveSiteContent);
  const logout = useServerFn(adminLogout);

  const [draft, setDraft] = useState<SiteContent>(saved);
  const [active, setActive] = useState(sections[0]!.id);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);
  const section = sections.find((s) => s.id === active) ?? sections[0]!;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update: EditorProps["update"] = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  async function onSave(explicitDraft?: SiteContent) {
    const targetDraft = explicitDraft ?? draft;
    const parsed = siteContentSchema.safeParse(clean(targetDraft));
    if (!parsed.success) {
      toast.error("Some fields are too long or invalid. Please check your inputs.");
      return;
    }
    setSaving(true);
    try {
      await save({ data: parsed.data });
      queryClient.setQueryData(siteContentQuery.queryKey, parsed.data);
      await queryClient.invalidateQueries({ queryKey: siteContentQuery.queryKey });
      await router.invalidate();
      setDraft(parsed.data);
      toast.success("Changes published live to the EDUARC website");
    } catch {
      toast.error("Couldn't save. Your session may have expired — sign in again.");
      await queryClient.invalidateQueries({ queryKey: adminStatusQuery.queryKey });
    } finally {
      setSaving(false);
    }
  }

  async function onLogout() {
    if (dirty && !window.confirm("You have unsaved changes. Sign out anyway?")) return;
    await logout();
    await queryClient.invalidateQueries({ queryKey: adminStatusQuery.queryKey });
  }

  const Editor = section.Editor;
  const Custom = section.Custom;

  return (
    <div className="relative isolate min-h-screen bg-surface/40">
      {/* Top Navigation Bar */}
      <header className="glass-nav sticky top-0 z-40 border-b border-hairline/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <Badge variant="gold" className="hidden sm:inline-flex py-0.5">
              Admin Workspace
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="pill-outline" size="sm" className="bg-white/80">
              <a href="/" target="_blank" rel="noreferrer" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Preview Live Site</span>
              </a>
            </Button>
            <Button
              variant="pill-outline"
              size="sm"
              className="bg-white/80 text-muted-foreground hover:text-destructive hover:border-destructive/30"
              onClick={onLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-32 pt-6 md:px-6 lg:grid-cols-[250px_1fr] lg:pt-8">
        {/* Sidebar Navigation */}
        <nav aria-label="Dashboard sections" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-hairline bg-white p-2 shadow-xs flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {sections.map((s) => {
              const Icon = s.icon;
              const on = s.id === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(s.id)}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all duration-150 cursor-pointer",
                    on
                      ? "bg-brand-navy text-white shadow-xs"
                      : "text-muted-foreground hover:bg-surface hover:text-brand-navy",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      on ? "text-brand-gold" : "text-muted-foreground",
                    )}
                    strokeWidth={1.75}
                  />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content Pane */}
        <div key={section.id} className="min-w-0">
          <div className="mb-6 pb-4 border-b border-hairline flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="type-eyebrow text-brand-gold">
                {section.Custom ? "System Configuration" : "Content Editor"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-navy mt-1">
                {section.label}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">{section.description}</p>
            </div>
            {sectionLinks[section.id] && (
              <Button
                asChild
                variant="pill-outline"
                size="sm"
                className="self-start sm:self-auto bg-white/80"
              >
                <a
                  href={sectionLinks[section.id]}
                  target="_blank"
                  rel="noreferrer"
                  className="gap-1.5 text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open {sectionLinks[section.id]}</span>
                </a>
              </Button>
            )}
          </div>

          {Editor ? (
            <EditorStack>
              <Editor draft={draft} update={update} onSave={onSave} isSaving={saving} />
            </EditorStack>
          ) : Custom ? (
            <Custom />
          ) : null}
        </div>
      </div>

      {/* Floating Save Action Bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 transition-all duration-300",
          dirty ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-20 opacity-0",
        )}
        aria-hidden={!dirty}
      >
        <div className="flex w-full max-w-xl items-center justify-between gap-3 rounded-full bg-brand-navy text-white py-2 pl-5 pr-2.5 shadow-2xl border border-brand-gold/30">
          <p className="flex items-center gap-2 text-xs font-medium text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-gold" />
            <span>Unsaved brochure modifications</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setDraft(saved)}
              disabled={saving}
              tabIndex={dirty ? 0 : -1}
            >
              <Undo2 className="h-3.5 w-3.5 mr-1" /> Discard
            </Button>
            <Button
              variant="pill-gold"
              size="pill-sm"
              className="h-8 text-xs font-bold"
              onClick={() => onSave()}
              disabled={saving}
              tabIndex={dirty ? 0 : -1}
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Publishing...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Save & Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
