import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
  Info,
  Mail,
  RefreshCw,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import type { EditorProps } from "./editors";
import { Panel, TextField } from "./fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendTestGreetingEmail, testSmtpConnection } from "@/lib/admin.functions";

export function EmailTemplateEditor({ draft, update }: EditorProps) {
  const template = draft.emailTemplate;
  const setField = <K extends keyof typeof template>(key: K, value: (typeof template)[K]) => {
    update("emailTemplate", { ...template, [key]: value });
  };

  const [testEmail, setTestEmail] = useState("eduarc.connect@gmail.com");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const sendTestFn = useServerFn(sendTestGreetingEmail);
  const testSmtpFn = useServerFn(testSmtpConnection);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleTestSmtp() {
    setIsTestingSmtp(true);
    setSmtpStatus(null);
    try {
      const res = await testSmtpFn();
      setSmtpStatus({ ok: res.ok, message: res.message });
      if (res.ok) {
        toast.success(res.message);
      } else {
        toast.error(`Dynadot SMTP: ${res.message}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to verify SMTP";
      setSmtpStatus({ ok: false, message: msg });
      toast.error(msg);
    } finally {
      setIsTestingSmtp(false);
    }
  }

  async function handleSendTest() {
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("Please enter a valid email address to receive the test email.");
      return;
    }
    setIsSendingTest(true);
    try {
      const res = await sendTestFn({ data: { to: testEmail, fullName: "EduArc Administrator" } });
      if (res?.ok) {
        const providerName = res.provider === "dynadot_smtp" ? "Dynadot SMTP" : "Resend API";
        toast.success(`Test email sent successfully via ${providerName}! (ID: ${res.id})`);
      } else {
        toast.error("Failed to send test email. Please check your email configuration.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send test email");
    } finally {
      setIsSendingTest(false);
    }
  }

  // Sample data for live preview
  const sampleName = "Rahul";
  const sampleRole = "Student Career Guidance";
  const previewSubject = (template.subject || "")
    .replace(/{name}/gi, sampleName)
    .replace(/{role}/gi, sampleRole);
  const previewGreeting = (template.greeting || "").replace(/{name}/gi, sampleName);
  const previewBody = (template.body || "")
    .replace(/{name}/gi, sampleName)
    .replace(/{role}/gi, sampleRole);

  const insertVariable = (variable: string) => {
    setField("body", (template.body || "") + " " + variable);
  };

  return (
    <div className="space-y-8">
      {/* Overview & Live Test Card */}
      <Panel
        title="Automated Greeting Email (Resend)"
        description="EduArc automatically sends a one-time welcome and confirmation email to students and partners when they submit the guidance form on /partner."
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-brand-navy/5 border border-brand-navy/10 p-4 sm:p-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-brand-navy text-[15px]">Automated Sending Status:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  template.enabled
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-slate-100 text-slate-700 border border-slate-300"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${template.enabled ? "bg-emerald-600 animate-pulse" : "bg-slate-400"}`}
                />
                {template.enabled ? "Active (Emails enabled)" : "Disabled (Emails paused)"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              When active, every fresh submission on the /partner page receives this branded email once.
            </p>
          </div>

          <Button
            type="button"
            variant="pill-outline"
            size="sm"
            onClick={() => setField("enabled", !template.enabled)}
            className="self-start sm:self-auto text-xs font-semibold cursor-pointer"
          >
            {template.enabled ? (
              <>
                <ToggleRight className="h-4 w-4 mr-1 text-emerald-600" />
                Turn Off
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4 mr-1 text-slate-400" />
                Turn On
              </>
            )}
          </Button>
        </div>

      {/* Mail Server & Connection Diagnostics Card */}
      <Panel
        title="Outgoing Mail Servers & Diagnostics"
        description="Monitor and verify your active mail servers (Dynadot SMTP & Resend fail-safe network)."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Dynadot SMTP Card */}
          <div className="rounded-2xl border border-hairline bg-card p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-brand-navy" />
                <span className="text-sm font-bold text-brand-navy">Dynadot SMTP Server</span>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                webhost.dynadot.com:587
              </span>
            </div>

            <div className="text-xs space-y-1 text-muted-foreground bg-slate-50 p-3 rounded-xl border border-slate-200/60 font-mono">
              <p><strong className="text-foreground font-sans">Host:</strong> webhost.dynadot.com</p>
              <p><strong className="text-foreground font-sans">Port:</strong> 587 (STARTTLS)</p>
              <p><strong className="text-foreground font-sans">Username:</strong> support@eduarc-connect.in</p>
            </div>

            {smtpStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                  smtpStatus.ok
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-amber-50 text-amber-950 border border-amber-200"
                }`}
              >
                {smtpStatus.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 w-full">
                  <p className="font-semibold text-xs">{smtpStatus.ok ? "Connected & Authenticated!" : "Authentication Issue Detected"}</p>
                  <p className="font-mono text-[11px] break-all bg-white/70 p-1.5 rounded border border-amber-200/50">{smtpStatus.message}</p>
                  {!smtpStatus.ok && (
                    <div className="mt-2 text-[11px] text-amber-900 space-y-1 leading-relaxed">
                      <p className="font-semibold">How to fix in Dynadot:</p>
                      <p>1. Log into Dynadot &rarr; <strong>My Emails</strong> &rarr; <strong>Sign In</strong> to webmail.</p>
                      <p>2. Click <strong>Settings (gear icon)</strong> &rarr; enable <strong>Remote Access</strong> (enables SMTP/IMAP).</p>
                      <p>3. Confirm that the password in <code>.env</code> is the dedicated mailbox password for <code>support@eduarc-connect.in</code>.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="pill-outline"
              size="sm"
              onClick={handleTestSmtp}
              disabled={isTestingSmtp}
              className="w-full text-xs font-semibold cursor-pointer py-2"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isTestingSmtp ? "animate-spin" : ""}`} />
              {isTestingSmtp ? "Testing Connection..." : "Check Dynadot SMTP Connection"}
            </Button>
          </div>

          {/* Resend High-Reliability Fallback Card */}
          <div className="rounded-2xl border border-hairline bg-card p-4 sm:p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-brand-navy">Resend Delivery Network</span>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Failover
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Active as a high-reliability fail-safe. If Dynadot SMTP encounters a rate limit, server reboot, or credential error, Resend automatically delivers the greeting email so no enquiries are lost.
              </p>
              <div className="text-xs space-y-1 text-muted-foreground bg-slate-50 p-3 rounded-xl border border-slate-200/60 font-mono">
                <p><strong className="text-foreground font-sans">Failover:</strong> Automatic Zero-Loss</p>
                <p><strong className="text-foreground font-sans">Reply-To:</strong> support@eduarc-connect.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Test Dispatcher */}
        <div className="pt-4 border-t border-hairline/60">
          <Label className="text-xs font-semibold text-brand-navy uppercase tracking-wider">
            Send Live Greeting Test Email
          </Label>
          <div className="mt-2 flex flex-col sm:flex-row gap-2 max-w-lg">
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter email to test delivery"
              className="rounded-xl text-sm"
            />
            <Button
              type="button"
              variant="pill-navy"
              size="sm"
              onClick={handleSendTest}
              disabled={isSendingTest}
              className="shrink-0 cursor-pointer text-xs font-bold"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              {isSendingTest ? "Sending..." : "Send Live Test"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-brand-navy/60 shrink-0" />
            <span>
              Sends a real branded email using Dynadot SMTP (or fallback). Applicant replies arrive in <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded font-mono">support@eduarc-connect.in</code>.
            </span>
          </p>
        </div>
      </Panel>
      </Panel>

      {/* Sender Configuration */}
      <Panel
        title="Sender & Reply-To Details"
        description="Configure display name, sender address, and where applicant replies are directed."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="From Name (Brand)"
            value={template.fromName}
            onChange={(v) => setField("fromName", v)}
            hint="Displayed in inbox (e.g. EduArc Guidance Team)"
          />
          <TextField
            label="From Email Address"
            value={template.fromEmail}
            onChange={(v) => setField("fromEmail", v)}
            hint="EduArc <onboarding@resend.dev> or once verified: EduArc <support@eduarc-connect.in>"
          />
          <TextField
            label="Reply-To Email"
            value={template.replyTo || "support@eduarc-connect.in"}
            onChange={(v) => setField("replyTo", v)}
            hint="Dynadot inbox: support@eduarc-connect.in (where recipient replies arrive)"
          />
        </div>
      </Panel>

      {/* Email Subject & Content */}
      <Panel
        title="Subject Line & Message Content"
        description="Craft the greeting message sent to applicants. Available placeholders: {name}, {role}, {email}, {phone}."
      >
        <div className="space-y-4">
          <TextField
            label="Email Subject Line"
            value={template.subject}
            onChange={(v) => setField("subject", v)}
            hint="Supports {name} and {role} placeholders"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Email Heading / Banner Title"
              value={template.heading}
              onChange={(v) => setField("heading", v)}
            />
            <TextField
              label="Salutation / Greeting"
              value={template.greeting}
              onChange={(v) => setField("greeting", v)}
              hint="e.g. Dear {name},"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[13px] font-medium text-foreground">
                Email Body Text
              </Label>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Insert:</span>
                {["{name}", "{role}", "{phone}"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertVariable(tag)}
                    className="px-2 py-0.5 rounded bg-brand-navy/10 hover:bg-brand-navy/20 text-brand-navy font-mono text-[11px] transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              rows={6}
              value={template.body}
              onChange={(e) => setField("body", e.target.value)}
              placeholder="Main email body text..."
              className="rounded-xl text-[14px] leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">
              Separate paragraphs with a blank line. Use {"{name}"} for the recipient's first name and {"{role}"} for their enquiry category.
            </p>
          </div>
        </div>
      </Panel>

      {/* Highlights / What Happens Next */}
      <Panel
        title="Next Steps & Key Highlights"
        description="Bullet points shown in a clean highlighted box to guide the student or partner on what to expect."
      >
        <div className="space-y-4">
          <TextField
            label="Section Title"
            value={template.highlightsTitle}
            onChange={(v) => setField("highlightsTitle", v)}
          />
          <TextField
            label="Highlight 1"
            value={template.highlight1}
            onChange={(v) => setField("highlight1", v)}
          />
          <TextField
            label="Highlight 2"
            value={template.highlight2}
            onChange={(v) => setField("highlight2", v)}
          />
          <TextField
            label="Highlight 3"
            value={template.highlight3}
            onChange={(v) => setField("highlight3", v)}
          />
        </div>
      </Panel>

      {/* Sign-off & Signature */}
      <Panel
        title="Closing & Official Signature"
        description="Formal sign-off and official contact channels."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Closing Salutation"
            value={template.closing}
            onChange={(v) => setField("closing", v)}
          />
          <TextField
            label="Signature & Contact Info"
            long
            value={template.signature}
            onChange={(v) => setField("signature", v)}
          />
        </div>
      </Panel>

      {/* Live Email Visual Preview */}
      <Panel
        title="Live Email Preview"
        description="Real-time rendering of the greeting email with sample student data."
      >
        <div className="flex items-center justify-between pb-3 border-b border-hairline/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview Mode
          </span>
          <div className="flex items-center gap-1 bg-surface rounded-lg p-0.5 border border-hairline">
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                previewDevice === "desktop"
                  ? "bg-white text-brand-navy shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                previewDevice === "mobile"
                  ? "bg-white text-brand-navy shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mobile
            </button>
          </div>
        </div>

        {/* Mock Email Client View */}
        <div className="p-4 sm:p-6 bg-[#FAF9F5] rounded-2xl border border-[#E2DBD0] overflow-hidden flex justify-center">
          <div
            className={`w-full bg-white rounded-2xl border border-[#E2DBD0] shadow-sm overflow-hidden transition-all duration-300 ${
              previewDevice === "mobile" ? "max-w-[360px]" : "max-w-[540px]"
            }`}
          >
            {/* Header */}
            <div className="bg-[#142744] p-5 text-left">
              <h3 className="text-xl font-bold text-white tracking-tight">EDUARC</h3>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#E5A83B] mt-0.5">
                Ambitious to Achievement
              </p>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                  Subject:
                </span>
                <p className="text-sm font-semibold text-brand-navy mt-0.5">
                  {previewSubject}
                </p>
              </div>

              <h4 className="text-base font-bold text-[#142744]">
                {template.heading}
              </h4>

              <p className="text-sm font-semibold text-[#142744]">
                {previewGreeting}
              </p>

              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {previewBody}
              </div>

              {/* Highlights Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#243B35]">
                  {template.highlightsTitle}
                </p>
                <ul className="text-xs text-slate-700 space-y-1 pl-1">
                  {template.highlight1 && <li>✓ {template.highlight1}</li>}
                  {template.highlight2 && <li>✓ {template.highlight2}</li>}
                  {template.highlight3 && <li>✓ {template.highlight3}</li>}
                </ul>
              </div>

              {/* Mock CTA Button */}
              <div className="pt-2">
                <span className="inline-block bg-[#142744] text-white text-xs font-semibold px-4 py-2 rounded-full">
                  Visit EduArc Website &rarr;
                </span>
              </div>

              {/* Signoff */}
              <div className="pt-3 text-xs text-slate-600">
                <p>{template.closing}</p>
                <p className="font-semibold text-brand-navy whitespace-pre-line mt-1">
                  {template.signature}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 text-center text-[10px] text-muted-foreground">
              EduArc &bull; Phone: +91 95357 21089 &bull; Email: eduarc.connect@gmail.com
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

