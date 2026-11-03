import { useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  Info,
  Mail,
  Send,
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
import { sendTestGreetingEmail } from "@/lib/admin.functions";

export function EmailTemplateEditor({ draft, update }: EditorProps) {
  const template = draft.emailTemplate;
  const setField = <K extends keyof typeof template>(key: K, value: (typeof template)[K]) => {
    update("emailTemplate", { ...template, [key]: value });
  };

  const [testEmail, setTestEmail] = useState("eduarc.connect@gmail.com");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const sendTestFn = useServerFn(sendTestGreetingEmail);

  async function handleSendTest() {
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("Please enter a valid email address to receive the test email.");
      return;
    }
    setIsSendingTest(true);
    try {
      const res = await sendTestFn({ data: { to: testEmail, fullName: "EduArc Administrator" } });
      if (res?.ok) {
        toast.success(`Test email sent successfully via Resend! (ID: ${res.id})`);
      } else {
        toast.error("Failed to send test email. Please check your Resend configuration.");
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

        {/* Test Email Dispatcher */}
        <div className="pt-2 border-t border-hairline/60">
          <Label className="text-xs font-semibold text-brand-navy uppercase tracking-wider">
            Send Live Test Email via Resend
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
              {isSendingTest ? "Sending..." : "Send Test"}
            </Button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-brand-navy/60 shrink-0" />
            <span>
              Resend sending key is active. Testing emails are sent from{" "}
              <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">onboarding@resend.dev</code> (or verified domain).
            </span>
          </p>
        </div>
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

