import type { ReactNode } from "react";
import type { SiteContent } from "@/content/eduarc";
import { IconSelect, ListEditor, ObjectFields, Panel, StringList, TextField } from "./fields";

type Update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
export type EditorProps = {
  draft: SiteContent;
  update: Update;
  onSave?: (explicitDraft?: SiteContent) => Promise<void>;
  isSaving?: boolean;
};

type IconItem = SiteContent["features"][number];
type TextItem = SiteContent["steps"][number];

function IconItems({
  label,
  items,
  onChange,
  max,
}: {
  label: string;
  items: IconItem[];
  onChange: (v: IconItem[]) => void;
  max: number;
}) {
  return (
    <ListEditor
      label={label}
      items={items}
      onChange={onChange}
      max={max}
      newItem={(): IconItem => ({ icon: "sparkles", title: "", body: "" })}
      itemTitle={(it) => it.title}
      renderItem={(it, set) => (
        <div className="grid gap-4 md:grid-cols-[200px_1fr]">
          <IconSelect value={it.icon} onChange={(icon) => set({ ...it, icon })} />
          <TextField label="Title" value={it.title} onChange={(title) => set({ ...it, title })} />
          <div className="md:col-span-2">
            <TextField
              label="Description"
              long
              value={it.body}
              onChange={(body) => set({ ...it, body })}
            />
          </div>
        </div>
      )}
    />
  );
}

function TextItems({
  label,
  items,
  onChange,
  max,
}: {
  label: string;
  items: TextItem[];
  onChange: (v: TextItem[]) => void;
  max: number;
}) {
  return (
    <ListEditor
      label={label}
      items={items}
      onChange={onChange}
      max={max}
      newItem={() => ({ title: "", body: "" })}
      itemTitle={(it) => it.title}
      renderItem={(it, set) => (
        <div className="space-y-4">
          <TextField label="Title" value={it.title} onChange={(title) => set({ ...it, title })} />
          <TextField
            label="Description"
            long
            value={it.body}
            onChange={(body) => set({ ...it, body })}
          />
        </div>
      )}
    />
  );
}

export function GeneralEditor({ draft, update }: EditorProps) {
  return (
    <>
      <Panel title="Brand" description="Shown in the footer on every page.">
        <ObjectFields
          value={draft.brand}
          onChange={(v) => update("brand", v)}
          fields={[
            { key: "tagline", label: "Tagline" },
            { key: "footerBlurb", label: "Footer description", long: true },
          ]}
        />
      </Panel>
      <Panel
        title="Call‑to‑action banner"
        description="The “Let’s build a brighter future” box near the bottom of most pages."
      >
        <ObjectFields
          value={draft.cta}
          onChange={(v) => update("cta", v)}
          fields={[
            { key: "title", label: "Heading", long: true },
            { key: "lead", label: "Text", long: true },
          ]}
        />
      </Panel>
    </>
  );
}

export function HomeEditor({ draft, update }: EditorProps) {
  const home = draft.home;
  const updateHome = (patch: Partial<typeof home>) => {
    update("home", { ...home, ...patch });
  };

  return (
    <>
      <Panel title="Hero Section" description="The primary banner above the fold on the homepage.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Eyebrow Badge"
            value={home.eyebrow || ""}
            onChange={(eyebrow) => updateHome({ eyebrow })}
            placeholder="Ambitious to Achievement"
          />
          <TextField
            label="Heading Highlight"
            value={home.titleHighlight || ""}
            onChange={(titleHighlight) => updateHome({ titleHighlight })}
            placeholder="brighter future."
          />
        </div>
        <TextField
          label="Main Heading"
          value={home.title || ""}
          onChange={(title) => updateHome({ title })}
          placeholder="Empowering students for a"
        />
        <TextField
          label="Hero Subtitle / Lead Paragraph"
          long
          value={home.lead || ""}
          onChange={(lead) => updateHome({ lead })}
          placeholder="Career guidance & education support platform for schools and colleges..."
        />
      </Panel>

      <Panel
        title="Hero Visual Floating Badges"
        description="The two Apple-style floating badges on the hero image showcase."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {/* Badge 1 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Badge 1 (Top Left)
            </span>
            <TextField
              label="Title"
              value={home.badge1Title || ""}
              onChange={(badge1Title) => updateHome({ badge1Title })}
              placeholder="Tailored Direction"
            />
            <TextField
              label="Subtitle"
              value={home.badge1Sub || ""}
              onChange={(badge1Sub) => updateHome({ badge1Sub })}
              placeholder="Class 10 to College Pathways"
            />
          </div>

          {/* Badge 2 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Badge 2 (Bottom Right)
            </span>
            <TextField
              label="Title"
              value={home.badge2Title || ""}
              onChange={(badge2Title) => updateHome({ badge2Title })}
              placeholder="Verified Mentorship"
            />
            <TextField
              label="Subtitle"
              value={home.badge2Sub || ""}
              onChange={(badge2Sub) => updateHome({ badge2Sub })}
              placeholder="Dedicated Academic Guidance"
            />
          </div>
        </div>
      </Panel>

      <Panel
        title="Student Journey (Four Intentional Steps)"
        description="The 4-step student roadmap section on the homepage."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Section Eyebrow"
            value={home.journeyEyebrow || ""}
            onChange={(journeyEyebrow) => updateHome({ journeyEyebrow })}
            placeholder="The Student Journey"
          />
          <TextField
            label="Section Heading"
            value={home.journeyTitle || ""}
            onChange={(journeyTitle) => updateHome({ journeyTitle })}
            placeholder="Four intentional steps from confusion to clarity."
          />
        </div>
        <TextField
          label="Section Lead Description"
          long
          value={home.journeyLead || ""}
          onChange={(journeyLead) => updateHome({ journeyLead })}
          placeholder="We guide students through a structured methodology..."
        />

        <div className="grid gap-4 md:grid-cols-2 pt-2">
          {/* Step 1 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block">
              Step 01
            </span>
            <TextField
              label="Title"
              value={home.step1Title || ""}
              onChange={(step1Title) => updateHome({ step1Title })}
              placeholder="Discover"
            />
            <TextField
              label="Subtitle"
              value={home.step1Subtitle || ""}
              onChange={(step1Subtitle) => updateHome({ step1Subtitle })}
              placeholder="Identify Strengths & Interests"
            />
            <TextField
              label="Description"
              long
              value={home.step1Desc || ""}
              onChange={(step1Desc) => updateHome({ step1Desc })}
              placeholder="Clarify academic interests..."
            />
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block">
              Step 02
            </span>
            <TextField
              label="Title"
              value={home.step2Title || ""}
              onChange={(step2Title) => updateHome({ step2Title })}
              placeholder="Explore"
            />
            <TextField
              label="Subtitle"
              value={home.step2Subtitle || ""}
              onChange={(step2Subtitle) => updateHome({ step2Subtitle })}
              placeholder="Unpack Real Career Paths"
            />
            <TextField
              label="Description"
              long
              value={home.step2Desc || ""}
              onChange={(step2Desc) => updateHome({ step2Desc })}
              placeholder="Evaluate Science, Commerce..."
            />
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block">
              Step 03
            </span>
            <TextField
              label="Title"
              value={home.step3Title || ""}
              onChange={(step3Title) => updateHome({ step3Title })}
              placeholder="Connect"
            />
            <TextField
              label="Subtitle"
              value={home.step3Subtitle || ""}
              onChange={(step3Subtitle) => updateHome({ step3Subtitle })}
              placeholder="Verified Academic Mentorship"
            />
            <TextField
              label="Description"
              long
              value={home.step3Desc || ""}
              onChange={(step3Desc) => updateHome({ step3Desc })}
              placeholder="Discuss choices with experienced academicians..."
            />
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block">
              Step 04
            </span>
            <TextField
              label="Title"
              value={home.step4Title || ""}
              onChange={(step4Title) => updateHome({ step4Title })}
              placeholder="Progress"
            />
            <TextField
              label="Subtitle"
              value={home.step4Subtitle || ""}
              onChange={(step4Subtitle) => updateHome({ step4Subtitle })}
              placeholder="Actionable Educational Milestones"
            />
            <TextField
              label="Description"
              long
              value={home.step4Desc || ""}
              onChange={(step4Desc) => updateHome({ step4Desc })}
              placeholder="Build a step-by-step academic plan..."
            />
          </div>
        </div>
      </Panel>

      <Panel
        title="Tailored Solutions & Audience Pathways"
        description="Headings and cards for the 3 audience pathways (Students, Schools, Mentors)."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Section Eyebrow"
            value={home.pathwaysEyebrow || ""}
            onChange={(pathwaysEyebrow) => updateHome({ pathwaysEyebrow })}
            placeholder="Tailored Solutions"
          />
          <TextField
            label="Section Title"
            value={home.pathwaysTitle || ""}
            onChange={(pathwaysTitle) => updateHome({ pathwaysTitle })}
            placeholder="Guidance designed for your educational context."
          />
        </div>
        <TextField
          label="Section Description"
          long
          value={home.pathwaysLead || ""}
          onChange={(pathwaysLead) => updateHome({ pathwaysLead })}
          placeholder="Whether you are a student planning your next academic milestone..."
        />

        <div className="grid gap-5 md:grid-cols-3 pt-4 border-t border-hairline">
          {/* Pathway 1 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Pathway 1: Students &amp; Parents
            </span>
            <TextField
              label="Card Title"
              value={home.pathway1Title || ""}
              onChange={(pathway1Title) => updateHome({ pathway1Title })}
              placeholder="Clarity over Confusion"
            />
            <TextField
              label="Description"
              long
              value={home.pathway1Desc || ""}
              onChange={(pathway1Desc) => updateHome({ pathway1Desc })}
              placeholder="Avoid stream regrets after Class 10 or 12..."
            />
          </div>

          {/* Pathway 2 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Pathway 2: Schools &amp; Colleges
            </span>
            <TextField
              label="Card Title"
              value={home.pathway2Title || ""}
              onChange={(pathway2Title) => updateHome({ pathway2Title })}
              placeholder="Institutional Guidance Hub"
            />
            <TextField
              label="Description"
              long
              value={home.pathway2Desc || ""}
              onChange={(pathway2Desc) => updateHome({ pathway2Desc })}
              placeholder="Equip your institution with systematic career guidance..."
            />
          </div>

          {/* Pathway 3 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Pathway 3: Academic Mentors
            </span>
            <TextField
              label="Card Title"
              value={home.pathway3Title || ""}
              onChange={(pathway3Title) => updateHome({ pathway3Title })}
              placeholder="Verified Mentorship Network"
            />
            <TextField
              label="Description"
              long
              value={home.pathway3Desc || ""}
              onChange={(pathway3Desc) => updateHome({ pathway3Desc })}
              placeholder="Connect certified educators and domain specialists..."
            />
          </div>
        </div>
      </Panel>
    </>
  );
}

export function AboutEditor({ draft, update }: EditorProps) {
  const about = draft.about;
  const updateAbout = (patch: Partial<typeof about>) => {
    update("about", { ...about, ...patch });
  };

  return (
    <>
      {/* 1. Who We Are */}
      <Panel
        title="Section: Who We Are"
        description="Introduction to EDUARC, core identity, and value pillars."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Eyebrow"
            value={about.whoWeAreEyebrow || ""}
            onChange={(whoWeAreEyebrow) => updateAbout({ whoWeAreEyebrow })}
            placeholder="WHO WE ARE"
          />
          <TextField
            label="Heading"
            value={about.whoWeAreTitle || ""}
            onChange={(whoWeAreTitle) => updateAbout({ whoWeAreTitle })}
            placeholder="What is EduArc?"
          />
        </div>
        <TextField
          label="Description"
          long
          value={about.whoWeAreLead || ""}
          onChange={(whoWeAreLead) => updateAbout({ whoWeAreLead })}
          placeholder="EduArc is a modern career guidance platform..."
        />
        <div className="grid gap-4 md:grid-cols-3 pt-2">
          <TextField
            label="Value Pillar 1"
            value={about.pillar1Title || ""}
            onChange={(pillar1Title) => updateAbout({ pillar1Title })}
            placeholder="Student Focused"
          />
          <TextField
            label="Value Pillar 2"
            value={about.pillar2Title || ""}
            onChange={(pillar2Title) => updateAbout({ pillar2Title })}
            placeholder="Guidance Driven"
          />
          <TextField
            label="Value Pillar 3"
            value={about.pillar3Title || ""}
            onChange={(pillar3Title) => updateAbout({ pillar3Title })}
            placeholder="Future Ready"
          />
        </div>
      </Panel>

      {/* 2. The Problem We Solve & Solutions */}
      <Panel
        title="Section: Challenges & Solutions"
        description="Headings, problem cards, and solution cards on the About page."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Challenges Eyebrow"
            value={about.problemsEyebrow || ""}
            onChange={(problemsEyebrow) => updateAbout({ problemsEyebrow })}
            placeholder="THE PROBLEM WE SOLVE"
          />
          <TextField
            label="Challenges Heading"
            value={about.problemsTitle || ""}
            onChange={(problemsTitle) => updateAbout({ problemsTitle })}
            placeholder="Common Challenges Students Face"
          />
        </div>
        <TextField
          label="Challenges Intro Text"
          long
          value={about.problemsLead || ""}
          onChange={(problemsLead) => updateAbout({ problemsLead })}
          placeholder="We understand the struggles..."
        />

        {/* 4 Common Challenge Cards */}
        <div className="pt-3 border-t border-hairline">
          <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block mb-3">
            Common Student Struggles (4 Cards)
          </span>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                Struggle 1
              </span>
              <TextField
                label="Title"
                value={about.challenge1Title || ""}
                onChange={(challenge1Title) => updateAbout({ challenge1Title })}
                placeholder="Confusion in Choosing Career Paths"
              />
              <TextField
                label="Description"
                value={about.challenge1Desc || ""}
                onChange={(challenge1Desc) => updateAbout({ challenge1Desc })}
                placeholder="Too many options, not enough clarity."
              />
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                Struggle 2
              </span>
              <TextField
                label="Title"
                value={about.challenge2Title || ""}
                onChange={(challenge2Title) => updateAbout({ challenge2Title })}
                placeholder="Lack of Proper Career Guidance"
              />
              <TextField
                label="Description"
                value={about.challenge2Desc || ""}
                onChange={(challenge2Desc) => updateAbout({ challenge2Desc })}
                placeholder="Limited access to expert advice and real-world insights."
              />
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                Struggle 3
              </span>
              <TextField
                label="Title"
                value={about.challenge3Title || ""}
                onChange={(challenge3Title) => updateAbout({ challenge3Title })}
                placeholder="Limited Awareness of Industry Opportunities"
              />
              <TextField
                label="Description"
                value={about.challenge3Desc || ""}
                onChange={(challenge3Desc) => updateAbout({ challenge3Desc })}
                placeholder="Not knowing about emerging fields and future trends."
              />
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                Struggle 4
              </span>
              <TextField
                label="Title"
                value={about.challenge4Title || ""}
                onChange={(challenge4Title) => updateAbout({ challenge4Title })}
                placeholder="Difficulty Finding the Right Skills & Certifications"
              />
              <TextField
                label="Description"
                value={about.challenge4Desc || ""}
                onChange={(challenge4Desc) => updateAbout({ challenge4Desc })}
                placeholder="Unclear about what to learn, where to learn and how to get certified."
              />
            </div>
          </div>
        </div>

        {/* 4 Solutions Cards */}
        <div className="pt-4 border-t border-hairline space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Solutions Eyebrow"
              value={about.solutionsEyebrow || ""}
              onChange={(solutionsEyebrow) => updateAbout({ solutionsEyebrow })}
              placeholder="OUR SOLUTIONS"
            />
            <TextField
              label="Solutions Heading"
              value={about.solutionsTitle || ""}
              onChange={(solutionsTitle) => updateAbout({ solutionsTitle })}
              placeholder="How We Help You"
            />
          </div>

          <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
            Our Solutions (4 Cards)
          </span>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
              <span className="text-[11px] font-bold text-brand-gold uppercase">Solution 1</span>
              <TextField
                label="Title"
                value={about.solution1Title || ""}
                onChange={(solution1Title) => updateAbout({ solution1Title })}
                placeholder="Career Guidance"
              />
              <TextField
                label="Description"
                long
                value={about.solution1Desc || ""}
                onChange={(solution1Desc) => updateAbout({ solution1Desc })}
                placeholder="Personalized career path suggestions based on your interests..."
              />
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
              <span className="text-[11px] font-bold text-brand-gold uppercase">Solution 2</span>
              <TextField
                label="Title"
                value={about.solution2Title || ""}
                onChange={(solution2Title) => updateAbout({ solution2Title })}
                placeholder="Expert Mentorship"
              />
              <TextField
                label="Description"
                long
                value={about.solution2Desc || ""}
                onChange={(solution2Desc) => updateAbout({ solution2Desc })}
                placeholder="Learn from industry professionals with real-world experience..."
              />
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
              <span className="text-[11px] font-bold text-brand-gold uppercase">Solution 3</span>
              <TextField
                label="Title"
                value={about.solution3Title || ""}
                onChange={(solution3Title) => updateAbout({ solution3Title })}
                placeholder="Skill Development Programs"
              />
              <TextField
                label="Description"
                long
                value={about.solution3Desc || ""}
                onChange={(solution3Desc) => updateAbout({ solution3Desc })}
                placeholder="Build in-demand skills through structured learning..."
              />
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
              <span className="text-[11px] font-bold text-brand-gold uppercase">Solution 4</span>
              <TextField
                label="Title"
                value={about.solution4Title || ""}
                onChange={(solution4Title) => updateAbout({ solution4Title })}
                placeholder="Certification & Learning Programs"
              />
              <TextField
                label="Description"
                long
                value={about.solution4Desc || ""}
                onChange={(solution4Desc) => updateAbout({ solution4Desc })}
                placeholder="Gain recognized certifications to boost your profile..."
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* 3. Mission & Vision */}
      <Panel
        title="Section: Mission & Vision"
        description="Core institutional commitments displayed with the mountain summit visual."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Mission & Vision Eyebrow"
            value={about.missionEyebrow || ""}
            onChange={(missionEyebrow) => updateAbout({ missionEyebrow })}
            placeholder="OUR MISSION & VISION"
          />
          <TextField
            label="Section Heading"
            value={about.missionTitle || ""}
            onChange={(missionTitle) => updateAbout({ missionTitle })}
            placeholder="Building a Brighter Future"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 pt-2">
          <TextField
            label="Mission Statement"
            long
            value={about.missionText || ""}
            onChange={(missionText) => updateAbout({ missionText })}
            placeholder="To help every student make informed career decisions..."
          />
          <TextField
            label="Vision Statement"
            long
            value={about.visionText || ""}
            onChange={(visionText) => updateAbout({ visionText })}
            placeholder="To build a future where every student has access..."
          />
        </div>
      </Panel>

      {/* 4. Meet Our Mentors Section Header */}
      <Panel
        title="Section: Meet Our Mentors"
        description="The headline and introductory copy for the featured mentor profile showcase."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Mentors Eyebrow"
            value={about.mentorsEyebrow || ""}
            onChange={(mentorsEyebrow) => updateAbout({ mentorsEyebrow })}
            placeholder="MEET OUR MENTORS"
          />
          <TextField
            label="Mentors Heading"
            value={about.mentorsTitle || ""}
            onChange={(mentorsTitle) => updateAbout({ mentorsTitle })}
            placeholder="Learn From The Best"
          />
        </div>
        <TextField
          label="Intro Paragraph"
          long
          value={about.mentorsLead || ""}
          onChange={(mentorsLead) => updateAbout({ mentorsLead })}
          placeholder="Our mentors are experienced university educators..."
        />
        <div className="rounded-xl border border-brand-gold-border/80 bg-brand-gold-soft/50 p-3.5 text-xs text-brand-navy flex items-center justify-between gap-3">
          <span>
            <strong>Mentor Profiles &amp; Roadmaps:</strong> Individual mentor details, photos,
            stats, and guidance roadmaps are managed in the <strong>Mentors</strong> tab.
          </span>
        </div>
      </Panel>
    </>
  );
}

export function FeaturesEditor({ draft, update }: EditorProps) {
  const featuresPage = draft.featuresPage;
  const updateFeatures = (patch: Partial<typeof featuresPage>) => {
    update("featuresPage", { ...featuresPage, ...patch });
  };

  return (
    <>
      <Panel
        title="Features Hero Banner"
        description="Headings for the main features presentation."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Heading Start"
            value={featuresPage.title || ""}
            onChange={(title) => updateFeatures({ title })}
            placeholder="Features for schools & colleges."
          />
          <TextField
            label="Heading Highlight"
            value={featuresPage.titleHighlight || ""}
            onChange={(titleHighlight) => updateFeatures({ titleHighlight })}
            placeholder="For every institution."
          />
        </div>
        <TextField
          label="Lead Subtitle"
          long
          value={featuresPage.lead || ""}
          onChange={(lead) => updateFeatures({ lead })}
          placeholder="We offer flexible partnership models..."
        />
      </Panel>

      <Panel
        title="Feature Levels (3 Transition Cards)"
        description="Headlines and content for Secondary Schools, Pre-University, and Colleges."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Feature Levels Eyebrow"
            value={featuresPage.levelsEyebrow || ""}
            onChange={(levelsEyebrow) => updateFeatures({ levelsEyebrow })}
            placeholder="FEATURE LEVELS"
          />
          <TextField
            label="Feature Levels Heading"
            value={featuresPage.levelsTitle || ""}
            onChange={(levelsTitle) => updateFeatures({ levelsTitle })}
            placeholder="Designed for every critical academic transition."
          />
        </div>
        <TextField
          label="Feature Levels Lead"
          long
          value={featuresPage.levelsLead || ""}
          onChange={(levelsLead) => updateFeatures({ levelsLead })}
          placeholder="Our features are calibrated to the exact developmental stage..."
        />

        <div className="grid gap-6 md:grid-cols-3 pt-4 border-t border-hairline">
          {/* Card 1: Secondary Schools */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Level 1: Secondary Schools
            </span>
            <TextField
              label="Card Title"
              value={featuresPage.level1Title || ""}
              onChange={(level1Title) => updateFeatures({ level1Title })}
              placeholder="Secondary Schools"
            />
            <TextField
              label="Subtitle"
              value={featuresPage.level1Subtitle || ""}
              onChange={(level1Subtitle) => updateFeatures({ level1Subtitle })}
              placeholder="Stream Selection & Foundation Planning"
            />
            <TextField
              label="Audience Badge"
              value={featuresPage.level1Badge || ""}
              onChange={(level1Badge) => updateFeatures({ level1Badge })}
              placeholder="Class 9 & 10 Students and Parents"
            />
            <TextField
              label="Included Item 1"
              value={featuresPage.level1Item1 || ""}
              onChange={(level1Item1) => updateFeatures({ level1Item1 })}
              placeholder="Stream evaluation workshops..."
            />
            <TextField
              label="Included Item 2"
              value={featuresPage.level1Item2 || ""}
              onChange={(level1Item2) => updateFeatures({ level1Item2 })}
              placeholder="Aptitude and subject interest discovery"
            />
            <TextField
              label="Included Item 3"
              value={featuresPage.level1Item3 || ""}
              onChange={(level1Item3) => updateFeatures({ level1Item3 })}
              placeholder="Interactive parent orientation sessions"
            />
            <TextField
              label="Included Item 4"
              value={featuresPage.level1Item4 || ""}
              onChange={(level1Item4) => updateFeatures({ level1Item4 })}
              placeholder="Individual stream roadmap summaries"
            />
          </div>

          {/* Card 2: Pre-University */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Level 2: Pre-University
            </span>
            <TextField
              label="Card Title"
              value={featuresPage.level2Title || ""}
              onChange={(level2Title) => updateFeatures({ level2Title })}
              placeholder="Pre-University & Junior Colleges"
            />
            <TextField
              label="Subtitle"
              value={featuresPage.level2Subtitle || ""}
              onChange={(level2Subtitle) => updateFeatures({ level2Subtitle })}
              placeholder="Higher-Ed Pathways & Degree Alignment"
            />
            <TextField
              label="Audience Badge"
              value={featuresPage.level2Badge || ""}
              onChange={(level2Badge) => updateFeatures({ level2Badge })}
              placeholder="Class 11 & 12 / PUC Students"
            />
            <TextField
              label="Included Item 1"
              value={featuresPage.level2Item1 || ""}
              onChange={(level2Item1) => updateFeatures({ level2Item1 })}
              placeholder="Degree and university options exploration"
            />
            <TextField
              label="Included Item 2"
              value={featuresPage.level2Item2 || ""}
              onChange={(level2Item2) => updateFeatures({ level2Item2 })}
              placeholder="Entrance exam timelines..."
            />
            <TextField
              label="Included Item 3"
              value={featuresPage.level2Item3 || ""}
              onChange={(level2Item3) => updateFeatures({ level2Item3 })}
              placeholder="One-on-one academic mentor consultations"
            />
            <TextField
              label="Included Item 4"
              value={featuresPage.level2Item4 || ""}
              onChange={(level2Item4) => updateFeatures({ level2Item4 })}
              placeholder="Targeted college selection roadmaps"
            />
          </div>

          {/* Card 3: Colleges */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Level 3: Higher Ed
            </span>
            <TextField
              label="Card Title"
              value={featuresPage.level3Title || ""}
              onChange={(level3Title) => updateFeatures({ level3Title })}
              placeholder="Colleges & Institutes"
            />
            <TextField
              label="Subtitle"
              value={featuresPage.level3Subtitle || ""}
              onChange={(level3Subtitle) => updateFeatures({ level3Subtitle })}
              placeholder="Postgraduate & Career Specialization"
            />
            <TextField
              label="Audience Badge"
              value={featuresPage.level3Badge || ""}
              onChange={(level3Badge) => updateFeatures({ level3Badge })}
              placeholder="Undergraduate Students"
            />
            <TextField
              label="Included Item 1"
              value={featuresPage.level3Item1 || ""}
              onChange={(level3Item1) => updateFeatures({ level3Item1 })}
              placeholder="Higher education & research opportunities"
            />
            <TextField
              label="Included Item 2"
              value={featuresPage.level3Item2 || ""}
              onChange={(level3Item2) => updateFeatures({ level3Item2 })}
              placeholder="Emerging industry domains & skills"
            />
            <TextField
              label="Included Item 3"
              value={featuresPage.level3Item3 || ""}
              onChange={(level3Item3) => updateFeatures({ level3Item3 })}
              placeholder="Faculty-aligned guidance seminars"
            />
            <TextField
              label="Included Item 4"
              value={featuresPage.level3Item4 || ""}
              onChange={(level3Item4) => updateFeatures({ level3Item4 })}
              placeholder="Academic assessment and roadmap planning"
            />
          </div>
        </div>
      </Panel>

      <Panel
        title="Delivery Formats"
        description="Settings for on-campus and hybrid seminar delivery options."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Section Eyebrow"
            value={featuresPage.deliveryEyebrow || ""}
            onChange={(deliveryEyebrow) => updateFeatures({ deliveryEyebrow })}
            placeholder="DELIVERY FORMAT"
          />
          <TextField
            label="Section Title"
            value={featuresPage.deliveryTitle || ""}
            onChange={(deliveryTitle) => updateFeatures({ deliveryTitle })}
            placeholder="Flexible on-campus and hybrid formats."
          />
        </div>
        <TextField
          label="Lead Description"
          long
          value={featuresPage.deliveryLead || ""}
          onChange={(deliveryLead) => updateFeatures({ deliveryLead })}
          placeholder="Whether you prefer in-person auditorium seminars..."
        />
        <div className="grid gap-4 md:grid-cols-2 pt-3 border-t border-hairline">
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Format 1
            </span>
            <TextField
              label="Title"
              value={featuresPage.deliveryOnCampusTitle || ""}
              onChange={(deliveryOnCampusTitle) => updateFeatures({ deliveryOnCampusTitle })}
              placeholder="On-Campus Seminars"
            />
            <TextField
              label="Subtitle"
              value={featuresPage.deliveryOnCampusLead || ""}
              onChange={(deliveryOnCampusLead) => updateFeatures({ deliveryOnCampusLead })}
              placeholder="Direct mentor engagement"
            />
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Format 2
            </span>
            <TextField
              label="Title"
              value={featuresPage.deliveryParentTitle || ""}
              onChange={(deliveryParentTitle) => updateFeatures({ deliveryParentTitle })}
              placeholder="Parent Orientations"
            />
            <TextField
              label="Subtitle"
              value={featuresPage.deliveryParentLead || ""}
              onChange={(deliveryParentLead) => updateFeatures({ deliveryParentLead })}
              placeholder="Joint guidance clarity"
            />
          </div>
        </div>
      </Panel>

      <Panel
        title="Onboarding & Guidance Suite"
        description="Headlines for the 4-phase onboarding methodology and guidance suite."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Feature Levels Eyebrow"
            value={featuresPage.levelsEyebrow || ""}
            onChange={(levelsEyebrow) => updateFeatures({ levelsEyebrow })}
            placeholder="FEATURE LEVELS"
          />
          <TextField
            label="Feature Levels Heading"
            value={featuresPage.levelsTitle || ""}
            onChange={(levelsTitle) => updateFeatures({ levelsTitle })}
            placeholder="Designed for every critical academic transition."
          />
        </div>
        <TextField
          label="Feature Levels Lead"
          long
          value={featuresPage.levelsLead || ""}
          onChange={(levelsLead) => updateFeatures({ levelsLead })}
          placeholder="Our features are calibrated to the exact developmental stage..."
        />

        <div className="grid gap-4 md:grid-cols-2 pt-3 border-t border-hairline">
          <TextField
            label="Onboarding Methodology Eyebrow"
            value={featuresPage.onboardingEyebrow || ""}
            onChange={(onboardingEyebrow) => updateFeatures({ onboardingEyebrow })}
            placeholder="STRUCTURED ENGAGEMENT"
          />
          <TextField
            label="Onboarding Methodology Heading"
            value={featuresPage.onboardingTitle || ""}
            onChange={(onboardingTitle) => updateFeatures({ onboardingTitle })}
            placeholder="How we onboard your institution."
          />
        </div>
        <TextField
          label="Onboarding Methodology Lead"
          long
          value={featuresPage.onboardingLead || ""}
          onChange={(onboardingLead) => updateFeatures({ onboardingLead })}
          placeholder="A seamless, four-stage implementation methodology..."
        />

        <div className="grid gap-4 md:grid-cols-2 pt-3 border-t border-hairline">
          <TextField
            label="Guidance Suite Eyebrow"
            value={featuresPage.suiteEyebrow || ""}
            onChange={(suiteEyebrow) => updateFeatures({ suiteEyebrow })}
            placeholder="INSTITUTIONAL GUIDANCE SUITE"
          />
          <TextField
            label="Guidance Suite Heading"
            value={featuresPage.suiteTitle || ""}
            onChange={(suiteTitle) => updateFeatures({ suiteTitle })}
            placeholder="Everything your institution needs to guide students with confidence."
          />
        </div>
        <TextField
          label="Guidance Suite Lead"
          long
          value={featuresPage.suiteLead || ""}
          onChange={(suiteLead) => updateFeatures({ suiteLead })}
          placeholder="Comprehensive guidance infrastructure combining mentor engagement..."
        />
      </Panel>
    </>
  );
}

export function PartnerEditor({ draft, update }: EditorProps) {
  const partnerPage = draft.partnerPage;
  const updatePartner = (patch: Partial<typeof partnerPage>) => {
    update("partnerPage", { ...partnerPage, ...patch });
  };

  return (
    <>
      <Panel
        title="Partner Page Hero"
        description="The primary heading and intro text shown on the /partner enquiry page."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            label="Eyebrow Badge"
            value={partnerPage.badge || ""}
            onChange={(badge) => updatePartner({ badge })}
            placeholder="Student & Institutional Enquiries"
          />
          <TextField
            label="Heading Start"
            value={partnerPage.title || ""}
            onChange={(title) => updatePartner({ title })}
            placeholder="Start your guidance journey with"
          />
          <TextField
            label="Heading Highlight"
            value={partnerPage.titleHighlight || ""}
            onChange={(titleHighlight) => updatePartner({ titleHighlight })}
            placeholder="EDUARC."
          />
        </div>
        <TextField
          label="Hero Subtitle / Description"
          long
          value={partnerPage.lead || ""}
          onChange={(lead) => updatePartner({ lead })}
          placeholder="Whether you are a student evaluating streams..."
        />
      </Panel>

      <Panel
        title="What to Expect After Submitting"
        description="The 3 reassurance promises displayed beside the partner inquiry form."
      >
        <TextField
          label="Section Title"
          value={partnerPage.expectationsTitle || ""}
          onChange={(expectationsTitle) => updatePartner({ expectationsTitle })}
          placeholder="What to Expect After Submitting:"
        />

        <div className="space-y-4 pt-2">
          {/* Step 1 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Expectation 1
            </span>
            <TextField
              label="Title"
              value={partnerPage.step1Title || ""}
              onChange={(step1Title) => updatePartner({ step1Title })}
              placeholder="1. Dedicated Counsellor Contact"
            />
            <TextField
              label="Description"
              long
              value={partnerPage.step1Body || ""}
              onChange={(step1Body) => updatePartner({ step1Body })}
              placeholder="An academic coordinator will review your background..."
            />
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Expectation 2
            </span>
            <TextField
              label="Title"
              value={partnerPage.step2Title || ""}
              onChange={(step2Title) => updatePartner({ step2Title })}
              placeholder="2. Focused Guidance Consultation"
            />
            <TextField
              label="Description"
              long
              value={partnerPage.step2Body || ""}
              onChange={(step2Body) => updatePartner({ step2Body })}
              placeholder="Explore stream opportunities..."
            />
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
              Expectation 3
            </span>
            <TextField
              label="Title"
              value={partnerPage.step3Title || ""}
              onChange={(step3Title) => updatePartner({ step3Title })}
              placeholder="3. Absolute Privacy & Integrity"
            />
            <TextField
              label="Description"
              long
              value={partnerPage.step3Body || ""}
              onChange={(step3Body) => updatePartner({ step3Body })}
              placeholder="Your details remain confidential..."
            />
          </div>
        </div>
      </Panel>

      <Panel
        title="Trust Indicators (Bottom Badges)"
        description="The three assurance badges displayed at the bottom of the /partner enquiry page."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            label="Trust Badge 1"
            value={partnerPage.trust1 || ""}
            onChange={(trust1) => updatePartner({ trust1 })}
            placeholder="Trusted by Students & Families"
          />
          <TextField
            label="Trust Badge 2"
            value={partnerPage.trust2 || ""}
            onChange={(trust2) => updatePartner({ trust2 })}
            placeholder="Partnered with Schools & Colleges"
          />
          <TextField
            label="Trust Badge 3"
            value={partnerPage.trust3 || ""}
            onChange={(trust3) => updatePartner({ trust3 })}
            placeholder="Focused on Your Future"
          />
        </div>
      </Panel>
    </>
  );
}

export { ProgramsEditor } from "./ProgramsEditor";
export { TestimonialsEditor, TestimonialsEditor as ImpactEditor } from "./TestimonialsEditor";

export function ContactEditor({ draft, update }: EditorProps) {
  const contact = draft.contact;
  const contactPage = draft.contactPage;
  const socials = draft.socials;

  const updateContact = (patch: Partial<typeof contact>) => {
    update("contact", { ...contact, ...patch });
  };

  const updateContactPage = (patch: Partial<typeof contactPage>) => {
    update("contactPage", { ...contactPage, ...patch });
  };

  const updateSocials = (patch: Partial<typeof socials>) => {
    update("socials", { ...socials, ...patch });
  };

  return (
    <>
      {/* 1. Hero Section Banner */}
      <Panel
        title="Contact Hero Banner"
        description="Headlines, description and reassurance pills shown across the full-page counselor banner."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <TextField
            label="Eyebrow Badge"
            value={contactPage.badge || ""}
            onChange={(badge) => updateContactPage({ badge })}
            placeholder="Get in Touch"
          />
          <TextField
            label="Headline Start"
            value={contactPage.title}
            onChange={(title) => updateContactPage({ title })}
            placeholder="Let’s Build"
          />
          <TextField
            label="Headline Highlight"
            value={contactPage.titleHighlight}
            onChange={(titleHighlight) => updateContactPage({ titleHighlight })}
            placeholder="Brighter Futures Together"
          />
        </div>

        <TextField
          label="Hero Subtitle / Description"
          long
          value={contactPage.lead}
          onChange={(lead) => updateContactPage({ lead })}
          placeholder="Have questions, feedback, or want to collaborate?..."
        />

        <div className="grid gap-5 md:grid-cols-3 pt-2">
          <TextField
            label="Feature Pill 1"
            value={contactPage.pill1 || ""}
            onChange={(pill1) => updateContactPage({ pill1 })}
            placeholder="Quick Response"
          />
          <TextField
            label="Feature Pill 2"
            value={contactPage.pill2 || ""}
            onChange={(pill2) => updateContactPage({ pill2 })}
            placeholder="Dedicated Support"
          />
          <TextField
            label="Feature Pill 3"
            value={contactPage.pill3 || ""}
            onChange={(pill3) => updateContactPage({ pill3 })}
            placeholder="Real People"
          />
        </div>
      </Panel>

      {/* 2. Direct Contact Channels */}
      <Panel
        title="Direct Contact Channels"
        description="Information displayed on the 4 primary channel cards (Phone, Email, Location, Website)."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Section Title"
            value={contactPage.channelsTitle || ""}
            onChange={(channelsTitle) => updateContactPage({ channelsTitle })}
            placeholder="Multiple Ways to Reach Us"
          />
          <TextField
            label="Section Subtitle"
            value={contactPage.channelsLead || ""}
            onChange={(channelsLead) => updateContactPage({ channelsLead })}
            placeholder="Choose the channel that works best for you..."
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 pt-2">
          {/* Phone Card */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>📞 Phone Channel</span>
            </h3>
            <TextField
              label="Contact Phone Number"
              type="tel"
              value={contact.phone}
              onChange={(phone) => updateContact({ phone })}
              placeholder="+91 98765 43210"
            />
            <TextField
              label="Operating Schedule / Hours"
              value={contact.phoneHours || ""}
              onChange={(phoneHours) => updateContact({ phoneHours })}
              placeholder="Mon - Fri, 9:00 AM - 6:00 PM (IST)"
            />
          </div>

          {/* Email Card */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>✉️ Email Channel</span>
            </h3>
            <TextField
              label="Primary Email Address"
              type="email"
              value={contact.email}
              onChange={(email) => updateContact({ email })}
              placeholder="partnerships@eduarc.in"
            />
            <TextField
              label="Reply Commitment Note"
              value={contact.emailNote || ""}
              onChange={(emailNote) => updateContact({ emailNote })}
              placeholder="We reply within 24 hours"
            />
          </div>

          {/* Location Card */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>📍 Office Location</span>
            </h3>
            <TextField
              label="Physical Location"
              value={contact.location || ""}
              onChange={(location) => updateContact({ location })}
              placeholder="Bengaluru, Karnataka, India"
            />
            <TextField
              label="Appointment Note"
              value={contact.locationNote || ""}
              onChange={(locationNote) => updateContact({ locationNote })}
              placeholder="(By appointment only)"
            />
          </div>

          {/* Website Card */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>🌐 Website Channel</span>
            </h3>
            <TextField
              label="Official Website URL"
              value={contact.website}
              onChange={(website) => updateContact({ website })}
              placeholder="www.eduarc.in"
            />
            <TextField
              label="Explorer Note"
              value={contact.websiteNote || ""}
              onChange={(websiteNote) => updateContact({ websiteNote })}
              placeholder="Explore more about us"
            />
          </div>
        </div>
      </Panel>

      {/* 3. Social Media Channels */}
      <Panel
        title="Social Media Channels"
        description="Links and handles displayed across the 5 social media cards (Instagram, Facebook, X, LinkedIn, YouTube)."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {/* Instagram */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
              Instagram
            </span>
            <TextField
              label="Handle"
              value={socials.instagramHandle || ""}
              onChange={(instagramHandle) => updateSocials({ instagramHandle })}
              placeholder="@eduarc_official"
            />
            <TextField
              label="URL"
              value={socials.instagramUrl || ""}
              onChange={(instagramUrl) => updateSocials({ instagramUrl })}
              placeholder="https://instagram.com/eduarc_official"
            />
          </div>

          {/* Facebook */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Facebook
            </span>
            <TextField
              label="Handle"
              value={socials.facebookHandle || ""}
              onChange={(facebookHandle) => updateSocials({ facebookHandle })}
              placeholder="/eduarc"
            />
            <TextField
              label="URL"
              value={socials.facebookUrl || ""}
              onChange={(facebookUrl) => updateSocials({ facebookUrl })}
              placeholder="https://facebook.com/eduarc"
            />
          </div>

          {/* X (Twitter) */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
              X (Twitter)
            </span>
            <TextField
              label="Handle"
              value={socials.twitterHandle || ""}
              onChange={(twitterHandle) => updateSocials({ twitterHandle })}
              placeholder="@eduarc_official"
            />
            <TextField
              label="URL"
              value={socials.twitterUrl || ""}
              onChange={(twitterUrl) => updateSocials({ twitterUrl })}
              placeholder="https://x.com/eduarc_official"
            />
          </div>

          {/* LinkedIn */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
              LinkedIn
            </span>
            <TextField
              label="Handle"
              value={socials.linkedinHandle || ""}
              onChange={(linkedinHandle) => updateSocials({ linkedinHandle })}
              placeholder="/company/eduarc"
            />
            <TextField
              label="URL"
              value={socials.linkedinUrl || ""}
              onChange={(linkedinUrl) => updateSocials({ linkedinUrl })}
              placeholder="https://linkedin.com/company/eduarc"
            />
          </div>

          {/* YouTube */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3 md:col-span-2">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
              YouTube
            </span>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Handle"
                value={socials.youtubeHandle || ""}
                onChange={(youtubeHandle) => updateSocials({ youtubeHandle })}
                placeholder="@eduarc"
              />
              <TextField
                label="URL"
                value={socials.youtubeUrl || ""}
                onChange={(youtubeUrl) => updateSocials({ youtubeUrl })}
                placeholder="https://youtube.com/@eduarc"
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* 4. Dual Engagement & Direct Conversation Card */}
      <Panel
        title="Engagement & Message Card"
        description="Text for the dual 'Ready to Connect?' left column and 'Send Us a Message' right column."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column Settings */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Left Column: Ready to Connect</h3>
            <TextField
              label="Eyebrow"
              value={contactPage.connectEyebrow || ""}
              onChange={(connectEyebrow) => updateContactPage({ connectEyebrow })}
              placeholder="— Ready to Connect?"
            />
            <TextField
              label="Title"
              value={contactPage.connectTitle || ""}
              onChange={(connectTitle) => updateContactPage({ connectTitle })}
              placeholder="We’re Here for What’s Next"
            />
            <TextField
              label="Description"
              long
              value={contactPage.connectLead || ""}
              onChange={(connectLead) => updateContactPage({ connectLead })}
              placeholder="Whether you’re a student, parent, educator..."
            />
          </div>

          {/* Right Column Settings */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              Right Column: Quick Contact & Banner
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Badge"
                value={contactPage.messageBadge || ""}
                onChange={(messageBadge) => updateContactPage({ messageBadge })}
                placeholder="Quick Contact"
              />
              <TextField
                label="Title"
                value={contactPage.messageTitle || ""}
                onChange={(messageTitle) => updateContactPage({ messageTitle })}
                placeholder="Send Us a Message"
              />
            </div>
            <TextField
              label="Topic Prompt Text"
              value={contactPage.messageLead || ""}
              onChange={(messageLead) => updateContactPage({ messageLead })}
              placeholder="Have a specific question or inquiry?..."
            />
            <TextField
              label="Direct Call Callout Title"
              value={contactPage.directCallTitle || ""}
              onChange={(directCallTitle) => updateContactPage({ directCallTitle })}
              placeholder="Prefer a direct conversation?"
            />
            <TextField
              label="Direct Call Callout Note"
              value={contactPage.directCallLead || ""}
              onChange={(directCallLead) => updateContactPage({ directCallLead })}
              placeholder="Call us during our working hours..."
            />
            <TextField
              label="Signature Quote"
              value={contactPage.signature || ""}
              onChange={(signature) => updateContactPage({ signature })}
              placeholder="“We’d love to hear from you!”"
            />
          </div>
        </div>
      </Panel>
    </>
  );
}

export function EditorStack({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

export { MentorsEditor } from "./MentorsEditor";
export { EmailTemplateEditor } from "./EmailTemplateEditor";
