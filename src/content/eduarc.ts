// Content model + defaults for the EduArc site. The admin dashboard saves edits to the
// database; pages read the merged result through `useSiteContent()`.
import { z } from "zod";
import {
  conductedPrograms as defaultConductedPrograms,
  defaultSessionGallery,
} from "@/content/programs-data";

export const iconNames = [
  "route",
  "users",
  "compass",
  "shield",
  "map",
  "video",
  "user",
  "award",
  "bell",
  "layout",
  "graduation",
  "chart",
  "headset",
  "sparkles",
  "trending",
  "network",
  "building",
] as const;

const str = z.string().max(2000);
const iconItem = z.object({ icon: z.enum(iconNames), title: str, body: str });
const textItem = z.object({ title: str, body: str });

export const mentorGuideStepSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(1000),
});

export const mentorReasonSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(1000),
});

export const mentorBeneficiarySchema = z.object({
  target: z.string().max(200),
  benefit: z.string().max(1000),
});

export const mentorImpactMetricSchema = z.object({
  label: z.string().max(200),
  value: z.string().max(100),
});

export const mentorCardStatSchema = z.object({
  label: z.string().max(50),
  value: z.string().max(50),
});

export const mentorProfileSchema = z.object({
  id: z.string().max(100),
  name: z.string().max(200),
  role: z.string().max(200).default("Career Guidance & Student Counselling Mentor"),
  designation: z.string().max(250),
  location: z.string().max(200),
  email: z.string().max(200),
  imageUrl: z.string().max(2_000_000).default(""),
  shortBio: z.string().max(400).default(""),
  cardStats: z.array(mentorCardStatSchema).default([]),
  about: z.string().max(5000),
  howICanGuide: z.array(mentorGuideStepSchema).default([]),
  whyConnect: z.array(mentorReasonSchema).default([]),
  whoCanBenefit: z.array(mentorBeneficiarySchema).default([]),
  impactNotice: z
    .string()
    .max(500)
    .default("Verified EDUARC activity metrics can be added as the programme grows."),
  impactMetrics: z.array(mentorImpactMetricSchema).default([]),
  message: z.string().max(5000),
  tagline: z
    .string()
    .max(300)
    .default("Learn with direction. Grow with confidence. Build your future with EDUARC."),
});

export type MentorProfile = z.infer<typeof mentorProfileSchema>;
export type MentorGuideStep = z.infer<typeof mentorGuideStepSchema>;
export type MentorReason = z.infer<typeof mentorReasonSchema>;
export type MentorBeneficiary = z.infer<typeof mentorBeneficiarySchema>;
export type MentorImpactMetric = z.infer<typeof mentorImpactMetricSchema>;
export type MentorCardStat = z.infer<typeof mentorCardStatSchema>;

export const programSessionReviewSchema = z.object({
  quote: z.string().max(2000),
  author: z.string().max(250),
});

export const programInstitutionDetailsSchema = z.object({
  name: z.string().max(250),
  type: z.string().max(200),
  city: z.string().max(200),
  contactPerson: z.string().max(200),
  phone: z.string().max(100),
  email: z.string().max(200),
});

export const programSummarySchema = z.object({
  text: z.string().max(5000),
  quote: z.string().max(2000),
  quoteAuthor: z.string().max(250),
});

export const programFeedbackSchema = z.object({
  rating: z.string().max(20).default("4.8"),
  totalResponses: z.number().default(86),
  reviews: z.array(programSessionReviewSchema).default([]),
});

export const programSessionSchema = z.object({
  id: z.string().max(150),
  institution: z.string().max(250),
  title: z.string().max(250),
  date: z.string().max(150),
  duration: z.string().max(150).default("2 Hours"),
  location: z.string().max(300),
  image: z.string().max(2_000_000).default(""),
  heroImage: z.string().max(2_000_000).default(""),
  gallery: z.array(z.string().max(2_000_000)).default([]),
  type: z.enum(["school", "college"]).default("school"),
  tag: z.string().max(150).default("Higher Secondary"),
  category: z.string().max(200).default("Career Guidance Session"),
  description: z.string().max(3000),
  institutionDetails: programInstitutionDetailsSchema,
  summary: programSummarySchema,
  feedback: programFeedbackSchema,
});

export type ProgramSessionReview = z.infer<typeof programSessionReviewSchema>;
export type ProgramInstitutionDetails = z.infer<typeof programInstitutionDetailsSchema>;
export type ProgramSessionItem = z.infer<typeof programSessionSchema>;

export const emailTemplateSchema = z
  .object({
    enabled: z.boolean().default(true),
    fromName: str.default("EduArc Guidance Team"),
    fromEmail: str.default("EduArc <eduarc.connect@gmail.com>"),
    replyTo: str.default("eduarc.connect@gmail.com"),
    subject: str.default("Thank you for connecting with EduArc!"),
    heading: str.default("Welcome to EduArc Guidance"),
    greeting: str.default("Dear {name},"),
    body: str.default(
      "Thank you for reaching out to EduArc! We have successfully received your enquiry regarding {role} guidance.\n\nOur expert academic coordinators are reviewing your details. A dedicated counsellor will connect with you shortly on your provided contact details to discuss personalized roadmaps and next steps for your educational journey.",
    ),
    highlightsTitle: str.default("What happens next:"),
    highlight1: str.default("1-on-1 Academic & Career Consultation"),
    highlight2: str.default("Course, College & Stream Exploration"),
    highlight3: str.default("Confidential Guidance from Verified Mentors"),
    closing: str.default("Together for Student Success,"),
    signature: str.default(
      "EduArc — Ambitious to Achievement\nEmail: eduarc.connect@gmail.com | Phone: +91 95357 21089\nWebsite: https://www.eduarc-connect.in",
    ),
  })
  .default({
    enabled: true,
    fromName: "EduArc Guidance Team",
    fromEmail: "EduArc <eduarc.connect@gmail.com>",
    replyTo: "eduarc.connect@gmail.com",
    subject: "Thank you for connecting with EduArc!",
    heading: "Welcome to EduArc Guidance",
    greeting: "Dear {name},",
    body: "Thank you for reaching out to EduArc! We have successfully received your enquiry regarding {role} guidance.\n\nOur expert academic coordinators are reviewing your details. A dedicated counsellor will connect with you shortly on your provided contact details to discuss personalized roadmaps and next steps for your educational journey.",
    highlightsTitle: "What happens next:",
    highlight1: "1-on-1 Academic & Career Consultation",
    highlight2: "Course, College & Stream Exploration",
    highlight3: "Confidential Guidance from Verified Mentors",
    closing: "Together for Student Success,",
    signature:
      "EduArc — Ambitious to Achievement\nEmail: eduarc.connect@gmail.com | Phone: +91 95357 21089\nWebsite: https://www.eduarc-connect.in",
  });

export type EmailTemplate = z.infer<typeof emailTemplateSchema>;

export const siteContentSchema = z.object({
  brand: z.object({ tagline: str, footerBlurb: str }),
  contact: z.object({
    email: str,
    phone: str,
    website: str,
    phoneHours: str.default("Mon - Fri, 9:00 AM - 6:00 PM (IST)"),
    emailNote: str.default("We reply within 24 hours"),
    location: str.default("Bengaluru, Karnataka, India"),
    locationNote: str.default("(By appointment only)"),
    websiteNote: str.default("Explore more about us"),
  }),
  socials: z
    .object({
      instagramUrl: str.default("https://instagram.com/eduarc_official"),
      instagramHandle: str.default("@eduarc_official"),
      facebookUrl: str.default("https://facebook.com/eduarc"),
      facebookHandle: str.default("/eduarc"),
      twitterUrl: str.default("https://x.com/eduarc_official"),
      twitterHandle: str.default("@eduarc_official"),
      linkedinUrl: str.default("https://linkedin.com/company/eduarc"),
      linkedinHandle: str.default("/company/eduarc"),
      youtubeUrl: str.default("https://youtube.com/@eduarc"),
      youtubeHandle: str.default("@eduarc"),
    })
    .default({
      instagramUrl: "https://instagram.com/eduarc_official",
      instagramHandle: "@eduarc_official",
      facebookUrl: "https://facebook.com/eduarc",
      facebookHandle: "/eduarc",
      twitterUrl: "https://x.com/eduarc_official",
      twitterHandle: "@eduarc_official",
      linkedinUrl: "https://linkedin.com/company/eduarc",
      linkedinHandle: "/company/eduarc",
      youtubeUrl: "https://youtube.com/@eduarc",
      youtubeHandle: "@eduarc",
    }),
  home: z.object({
    eyebrow: str,
    title: str,
    titleHighlight: str,
    lead: str,
    missionTitle: str,
    missionLead: str,
    quote: str,
    quoteHighlight: str,
    quoteSub: str,
    bannerTitle: str,
    badge1Title: str.default("Tailored Direction"),
    badge1Sub: str.default("Class 10 to College Pathways"),
    badge2Title: str.default("Verified Mentorship"),
    badge2Sub: str.default("Dedicated Academic Guidance"),
    journeyEyebrow: str.default("The Student Journey"),
    journeyTitle: str.default("Four intentional steps from confusion to clarity."),
    journeyLead: str.default(
      "We guide students through a structured methodology that replaces guesswork with verified academic insights.",
    ),
    step1Title: str.default("Discover"),
    step1Subtitle: str.default("Identify Strengths & Interests"),
    step1Desc: str.default(
      "Clarify academic interests, natural strengths, and subjects that inspire genuine curiosity before making critical stream choices.",
    ),
    step2Title: str.default("Explore"),
    step2Subtitle: str.default("Unpack Real Career Paths"),
    step2Desc: str.default(
      "Evaluate Science, Commerce, Arts, and emerging degree options with realistic information on course contents and higher-ed requirements.",
    ),
    step3Title: str.default("Connect"),
    step3Subtitle: str.default("Verified Academic Mentorship"),
    step3Desc: str.default(
      "Discuss choices with experienced academicians and career counsellors who provide unbiased, supportive advice for students and parents.",
    ),
    step4Title: str.default("Progress"),
    step4Subtitle: str.default("Actionable Educational Milestones"),
    step4Desc: str.default(
      "Build a step-by-step academic plan with timelines, skill benchmarks, and clear criteria for next-stage admissions and preparations.",
    ),
    pathwaysEyebrow: str.default("Tailored Solutions"),
    pathwaysTitle: str.default("Guidance designed for your educational context."),
    pathwaysLead: str.default(
      "Whether you are a student planning your next academic milestone or an institution structuring guidance for hundreds.",
    ),
    pathway1Title: str.default("Clarity over Confusion"),
    pathway1Desc: str.default(
      "Avoid stream regrets after Class 10 or 12. Receive structured guidance to choose courses confidently with full family alignment.",
    ),
    pathway2Title: str.default("Institutional Guidance Hub"),
    pathway2Desc: str.default(
      "Equip your institution with systematic career guidance workshops, mentor sessions, and structured tracking for every student batch.",
    ),
    pathway3Title: str.default("Verified Mentorship Network"),
    pathway3Desc: str.default(
      "Connect certified educators and domain specialists with young minds seeking genuine academic direction and industry perspective.",
    ),
  }),
  about: z.object({
    title: str,
    lead: str,
    goal: str,
    advantagesTitle: str,
    advantagesLead: str,
    quote: str,
    whoWeAreEyebrow: str.default("WHO WE ARE"),
    whoWeAreTitle: str.default("What is EduArc?"),
    whoWeAreLead: str.default(
      "EduArc is a modern career guidance platform that connects students with expert mentors, learning programs and industry insights. We help you explore career options, build essential skills and take confident steps towards your dream career.",
    ),
    pillar1Title: str.default("Student Focused"),
    pillar2Title: str.default("Guidance Driven"),
    pillar3Title: str.default("Future Ready"),
    problemsEyebrow: str.default("THE PROBLEM WE SOLVE"),
    problemsTitle: str.default("Common Challenges Students Face"),
    problemsLead: str.default(
      "We understand the struggles. Here are some of the key problems students face today:",
    ),
    challenge1Title: str.default("Confusion in Choosing Career Paths"),
    challenge1Desc: str.default("Too many options, not enough clarity."),
    challenge2Title: str.default("Lack of Proper Career Guidance"),
    challenge2Desc: str.default("Limited access to expert advice and real-world insights."),
    challenge3Title: str.default("Limited Awareness of Industry Opportunities"),
    challenge3Desc: str.default("Not knowing about emerging fields and future trends."),
    challenge4Title: str.default("Difficulty Finding the Right Skills & Certifications"),
    challenge4Desc: str.default(
      "Unclear about what to learn, where to learn and how to get certified.",
    ),
    solutionsEyebrow: str.default("OUR SOLUTIONS"),
    solutionsTitle: str.default("How We Help You"),
    solution1Title: str.default("Career Guidance"),
    solution1Desc: str.default(
      "Personalized career path suggestions based on your interests, skills and market trends.",
    ),
    solution2Title: str.default("Expert Mentorship"),
    solution2Desc: str.default(
      "Learn from industry professionals with real-world experience and practical advice.",
    ),
    solution3Title: str.default("Skill Development Programs"),
    solution3Desc: str.default(
      "Build in-demand skills through structured learning and hands-on projects.",
    ),
    solution4Title: str.default("Certification & Learning Programs"),
    solution4Desc: str.default(
      "Gain recognized certifications to boost your profile and career opportunities.",
    ),
    missionEyebrow: str.default("OUR MISSION & VISION"),
    missionTitle: str.default("Building a Brighter Future"),
    missionText: str.default(
      "To help every student make informed career decisions with the right guidance, resources and support.",
    ),
    visionText: str.default(
      "To build a future where every student has access to the right guidance, mentorship and opportunities to achieve their dreams.",
    ),
    mentorsEyebrow: str.default("MEET OUR MENTORS"),
    mentorsTitle: str.default("Learn From The Best"),
    mentorsLead: str.default(
      "Our mentors are experienced university educators and research scholars dedicated to giving students clarity, direction, and structured academic roadmaps.",
    ),
  }),
  pillars: z.array(iconItem).max(12),
  advantages: z.array(textItem).max(12),
  featuresPage: z.object({
    title: str,
    titleHighlight: str,
    lead: str,
    devicesTitle: str,
    devicesLead: str,
    levelsEyebrow: str.default("FEATURE LEVELS"),
    levelsTitle: str.default("Designed for every critical academic transition."),
    levelsLead: str.default(
      "Our features are calibrated to the exact developmental and academic stage of your student body.",
    ),
    level1Title: str.default("Secondary Schools"),
    level1Subtitle: str.default("Stream Selection & Foundation Planning"),
    level1Badge: str.default("Class 9 & 10 Students and Parents"),
    level1Item1: str.default("Stream evaluation workshops (Science, Commerce, Arts)"),
    level1Item2: str.default("Aptitude and subject interest discovery"),
    level1Item3: str.default("Interactive parent orientation sessions"),
    level1Item4: str.default("Individual stream roadmap summaries"),
    level2Title: str.default("Pre-University & Junior Colleges"),
    level2Subtitle: str.default("Higher-Ed Pathways & Degree Alignment"),
    level2Badge: str.default("Class 11 & 12 / PUC Students"),
    level2Item1: str.default("Degree and university options exploration"),
    level2Item2: str.default("Entrance exam timelines (CET, JEE, NEET, CUET, CLAT, etc.)"),
    level2Item3: str.default("One-on-one academic mentor consultations"),
    level2Item4: str.default("Targeted college selection roadmaps"),
    level3Title: str.default("Colleges & Institutes"),
    level3Subtitle: str.default("Postgraduate & Career Specialization"),
    level3Badge: str.default("Undergraduate Students"),
    level3Item1: str.default("Higher education & research opportunities"),
    level3Item2: str.default("Emerging industry domains & skill prerequisites"),
    level3Item3: str.default("Faculty-aligned guidance seminars"),
    level3Item4: str.default("Academic assessment and roadmap planning"),
    deliveryEyebrow: str.default("DELIVERY FORMAT"),
    deliveryTitle: str.default("Flexible on-campus and hybrid formats."),
    deliveryLead: str.default(
      "Whether you prefer in-person auditorium seminars, classroom workshops, or structured hybrid sessions with parent participation, EDUARC seamlessly adapts to your institutional timetable.",
    ),
    deliveryOnCampusTitle: str.default("On-Campus Seminars"),
    deliveryOnCampusLead: str.default("Direct mentor engagement"),
    deliveryParentTitle: str.default("Parent Orientations"),
    deliveryParentLead: str.default("Joint guidance clarity"),
    onboardingEyebrow: str.default("STRUCTURED ENGAGEMENT"),
    onboardingTitle: str.default("How we onboard your institution."),
    onboardingLead: str.default(
      "A seamless, four-stage implementation methodology designed to minimize administrative friction while maximizing student engagement.",
    ),
    suiteEyebrow: str.default("INSTITUTIONAL GUIDANCE SUITE"),
    suiteTitle: str.default("Everything your institution needs to guide students with confidence."),
    suiteLead: str.default(
      "Comprehensive guidance infrastructure combining mentor engagement, student analytics, and longitudinal progress tracking.",
    ),
  }),
  features: z.array(iconItem).max(18),
  programsPage: z.object({
    title: str,
    lead: str,
    idealForTitle: str,
    processTitle: str,
    processLead: str,
  }),
  offers: z.array(iconItem).max(12),
  idealFor: z.array(str).max(20),
  steps: z.array(textItem).max(12),
  impactPage: z.object({ title: str, lead: str }),
  impacts: z.array(iconItem).max(12),
  testimonials: z
    .array(
      z.object({
        quote: str,
        name: str,
        role: str,
        rating: z.number().default(5).optional(),
        category: str.optional(),
        avatar: str.optional(),
        email: str.optional(),
        createdAt: str.optional(),
      }),
    )
    .max(100),
  testimonialStats: z
    .object({
      programsConducted: str.default("100+"),
      programsLabel: str.default("Programs Conducted"),
      institutionsPartnered: str.default("50+"),
      institutionsLabel: str.default("Institutions Partnered"),
      studentsReached: str.default("10,000+"),
      studentsLabel: str.default("Students Reached"),
      averageRating: str.default("4.8/5"),
      ratingLabel: str.default("Average Rating"),
      ctaTitle: str.default("Be a part of their success story"),
      ctaDescription: str.default(
        "Join EDUARC and help more students discover their true potential.",
      ),
      ctaButtonText: str.default("Explore Our Programs"),
    })
    .default({
      programsConducted: "100+",
      programsLabel: "Programs Conducted",
      institutionsPartnered: "50+",
      institutionsLabel: "Institutions Partnered",
      studentsReached: "10,000+",
      studentsLabel: "Students Reached",
      averageRating: "4.8/5",
      ratingLabel: "Average Rating",
      ctaTitle: "Be a part of their success story",
      ctaDescription: "Join EDUARC and help more students discover their true potential.",
      ctaButtonText: "Explore Our Programs",
    }),
  testimonialsPage: z
    .object({
      badge: str.default("TESTIMONIALS"),
      title: str.default("Real Stories."),
      titleHighlight: str.default("Brighter Futures."),
      lead: str.default(
        "Hear from students, parents and educators who have experienced the impact of EDUARC's career guidance programs.",
      ),
      calloutLine1: str.default("Better Guidance"),
      calloutLine2: str.default("Brighter Futures"),
    })
    .default({
      badge: "TESTIMONIALS",
      title: "Real Stories.",
      titleHighlight: "Brighter Futures.",
      lead: "Hear from students, parents and educators who have experienced the impact of EDUARC's career guidance programs.",
      calloutLine1: "Better Guidance",
      calloutLine2: "Brighter Futures",
    }),
  contactPage: z.object({
    badge: str.default("Get in Touch"),
    title: str,
    titleHighlight: str,
    lead: str,
    pill1: str.default("Quick Response"),
    pill2: str.default("Dedicated Support"),
    pill3: str.default("Real People"),
    channelsTitle: str.default("Multiple Ways to Reach Us"),
    channelsLead: str.default(
      "Choose the channel that works best for you. We're just a call, email or message away!",
    ),
    connectEyebrow: str.default("— Ready to Connect?"),
    connectTitle: str.default("We’re Here for What’s Next"),
    connectLead: str.default(
      "Whether you’re a student, parent, educator, or institution — your journey matters to us. Let’s talk and create the right guidance for your future.",
    ),
    messageBadge: str.default("Quick Contact"),
    messageTitle: str.default("Send Us a Message"),
    messageLead: str.default(
      "Have a specific question or inquiry? Choose a topic and we'll get back to you with the right person from our team.",
    ),
    directCallTitle: str.default("Prefer a direct conversation?"),
    directCallLead: str.default(
      "Call us during our working hours (Mon - Fri, 9:00 AM - 6:00 PM IST).",
    ),
    signature: str.default("“We’d love to hear from you!”"),
    thankYou: str.default(
      "For your time and consideration. Together, let's empower more students to achieve their dreams.",
    ),
  }),
  partnerPage: z
    .object({
      badge: str.default("Student & Institutional Enquiries"),
      title: str.default("Start your guidance journey with"),
      titleHighlight: str.default("EDUARC."),
      lead: str.default(
        "Whether you are a student evaluating streams after Class 10 or 12, a parent seeking objective higher-education advice, or a school administrator planning a student guidance cohort.",
      ),
      expectationsTitle: str.default("What to Expect After Submitting:"),
      step1Title: str.default("1. Dedicated Counsellor Contact"),
      step1Body: str.default(
        "An academic coordinator will review your background and connect via phone or WhatsApp to understand your educational goals.",
      ),
      step2Title: str.default("2. Focused Guidance Consultation"),
      step2Body: str.default(
        "Explore stream opportunities, college options, and entrance timelines in a pressure-free, student-first consultation.",
      ),
      step3Title: str.default("3. Absolute Privacy & Integrity"),
      step3Body: str.default(
        "Your details remain confidential and are accessed exclusively by verified EDUARC counselling staff for educational planning.",
      ),
      trust1: str.default("Trusted by Students & Families"),
      trust2: str.default("Partnered with Schools & Colleges"),
      trust3: str.default("Focused on Your Future"),
    })
    .default({
      badge: "Student & Institutional Enquiries",
      title: "Start your guidance journey with",
      titleHighlight: "EDUARC.",
      lead: "Whether you are a student evaluating streams after Class 10 or 12, a parent seeking objective higher-education advice, or a school administrator planning a student guidance cohort.",
      expectationsTitle: "What to Expect After Submitting:",
      step1Title: "1. Dedicated Counsellor Contact",
      step1Body:
        "An academic coordinator will review your background and connect via phone or WhatsApp to understand your educational goals.",
      step2Title: "2. Focused Guidance Consultation",
      step2Body:
        "Explore stream opportunities, college options, and entrance timelines in a pressure-free, student-first consultation.",
      step3Title: "3. Absolute Privacy & Integrity",
      step3Body:
        "Your details remain confidential and are accessed exclusively by verified EDUARC counselling staff for educational planning.",
      trust1: "Trusted by Students & Families",
      trust2: "Partnered with Schools & Colleges",
      trust3: "Focused on Your Future",
    }),
  cta: z.object({ title: str, lead: str }),
  mentors: z.array(mentorProfileSchema).default([]),
  conductedPrograms: z.array(programSessionSchema).default([]),
  emailTemplate: emailTemplateSchema,
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type IconName = (typeof iconNames)[number];
export type TestimonialItem = SiteContent["testimonials"][number];

export const defaultContent: SiteContent = {
  brand: {
    tagline: "Ambitious to Achievement",
    footerBlurb: "Career guidance and education support for schools and colleges.",
  },
  contact: {
    email: "partnerships@eduarc.in",
    phone: "+91 98765 43210",
    website: "www.eduarc.in",
    phoneHours: "Mon - Fri, 9:00 AM - 6:00 PM (IST)",
    emailNote: "We reply within 24 hours",
    location: "Bengaluru, Karnataka, India",
    locationNote: "(By appointment only)",
    websiteNote: "Explore more about us",
  },
  socials: {
    instagramUrl: "https://instagram.com/eduarc_official",
    instagramHandle: "@eduarc_official",
    facebookUrl: "https://facebook.com/eduarc",
    facebookHandle: "/eduarc",
    twitterUrl: "https://x.com/eduarc_official",
    twitterHandle: "@eduarc_official",
    linkedinUrl: "https://linkedin.com/company/eduarc",
    linkedinHandle: "/company/eduarc",
    youtubeUrl: "https://youtube.com/@eduarc",
    youtubeHandle: "@eduarc",
  },
  home: {
    eyebrow: "Ambitious to Achievement",
    title: "Empowering students for a",
    titleHighlight: "brighter future.",
    lead: "Career guidance & education support platform for schools and colleges. Help students discover their potential, explore career paths and build a successful future.",
    missionTitle: "Guidance that meets every student where they are.",
    missionLead:
      "EduArc is a next‑generation education guidance platform that helps students make informed decisions about their academic and career journey.",
    quote: "Guidance today,",
    quoteHighlight: "success tomorrow.",
    quoteSub: "Our goal is simple — every student deserves the right guidance.",
    bannerTitle: "Right guidance today. Greater opportunities tomorrow.",
    badge1Title: "Tailored Direction",
    badge1Sub: "Class 10 to College Pathways",
    badge2Title: "Verified Mentorship",
    badge2Sub: "Dedicated Academic Guidance",
    journeyEyebrow: "The Student Journey",
    journeyTitle: "Four intentional steps from confusion to clarity.",
    journeyLead:
      "We guide students through a structured methodology that replaces guesswork with verified academic insights.",
    step1Title: "Discover",
    step1Subtitle: "Identify Strengths & Interests",
    step1Desc:
      "Clarify academic interests, natural strengths, and subjects that inspire genuine curiosity before making critical stream choices.",
    step2Title: "Explore",
    step2Subtitle: "Unpack Real Career Paths",
    step2Desc:
      "Evaluate Science, Commerce, Arts, and emerging degree options with realistic information on course contents and higher-ed requirements.",
    step3Title: "Connect",
    step3Subtitle: "Verified Academic Mentorship",
    step3Desc:
      "Discuss choices with experienced academicians and career counsellors who provide unbiased, supportive advice for students and parents.",
    step4Title: "Progress",
    step4Subtitle: "Actionable Educational Milestones",
    step4Desc:
      "Build a step-by-step academic plan with timelines, skill benchmarks, and clear criteria for next-stage admissions and preparations.",
    pathwaysEyebrow: "Tailored Solutions",
    pathwaysTitle: "Guidance designed for your educational context.",
    pathwaysLead:
      "Whether you are a student planning your next academic milestone or an institution structuring guidance for hundreds.",
    pathway1Title: "Clarity over Confusion",
    pathway1Desc:
      "Avoid stream regrets after Class 10 or 12. Receive structured guidance to choose courses confidently with full family alignment.",
    pathway2Title: "Institutional Guidance Hub",
    pathway2Desc:
      "Equip your institution with systematic career guidance workshops, mentor sessions, and structured tracking for every student batch.",
    pathway3Title: "Verified Mentorship Network",
    pathway3Desc:
      "Connect certified educators and domain specialists with young minds seeking genuine academic direction and industry perspective.",
  },
  about: {
    title: "About EduArc.",
    lead: "EduArc is a next‑generation education guidance platform that helps students make informed decisions about their academic and career journey.",
    goal: "Our goal is simple — every student deserves the right guidance.",
    advantagesTitle: "Why partner with EduArc.",
    advantagesLead:
      "EduArc gives your institution the tools to support students beyond the classroom — with structured guidance, expert mentorship and real‑world career insights.",
    quote: "Guidance today, success tomorrow.",
    whoWeAreEyebrow: "WHO WE ARE",
    whoWeAreTitle: "What is EduArc?",
    whoWeAreLead:
      "EduArc is a modern career guidance platform that connects students with expert mentors, learning programs and industry insights. We help you explore career options, build essential skills and take confident steps towards your dream career.",
    pillar1Title: "Student Focused",
    pillar2Title: "Guidance Driven",
    pillar3Title: "Future Ready",
    problemsEyebrow: "THE PROBLEM WE SOLVE",
    problemsTitle: "Common Challenges Students Face",
    problemsLead:
      "We understand the struggles. Here are some of the key problems students face today:",
    challenge1Title: "Confusion in Choosing Career Paths",
    challenge1Desc: "Too many options, not enough clarity.",
    challenge2Title: "Lack of Proper Career Guidance",
    challenge2Desc: "Limited access to expert advice and real-world insights.",
    challenge3Title: "Limited Awareness of Industry Opportunities",
    challenge3Desc: "Not knowing about emerging fields and future trends.",
    challenge4Title: "Difficulty Finding the Right Skills & Certifications",
    challenge4Desc: "Unclear about what to learn, where to learn and how to get certified.",
    solutionsEyebrow: "OUR SOLUTIONS",
    solutionsTitle: "How We Help You",
    solution1Title: "Career Guidance",
    solution1Desc:
      "Personalized career path suggestions based on your interests, skills and market trends.",
    solution2Title: "Expert Mentorship",
    solution2Desc:
      "Learn from industry professionals with real-world experience and practical advice.",
    solution3Title: "Skill Development Programs",
    solution3Desc: "Build in-demand skills through structured learning and hands-on projects.",
    solution4Title: "Certification & Learning Programs",
    solution4Desc: "Gain recognized certifications to boost your profile and career opportunities.",
    missionEyebrow: "OUR MISSION & VISION",
    missionTitle: "Building a Brighter Future",
    missionText:
      "To help every student make informed career decisions with the right guidance, resources and support.",
    visionText:
      "To build a future where every student has access to the right guidance, mentorship and opportunities to achieve their dreams.",
    mentorsEyebrow: "MEET OUR MENTORS",
    mentorsTitle: "Learn From The Best",
    mentorsLead:
      "Our mentors are experienced university educators and research scholars dedicated to giving students clarity, direction, and structured academic roadmaps.",
  },
  pillars: [
    {
      icon: "route",
      title: "Personalized Roadmaps",
      body: "Structured guidance from 10th to career, tailored to each student's goals.",
    },
    {
      icon: "users",
      title: "Expert Mentors",
      body: "Connect with industry experts and experienced mentors for real career insights.",
    },
    {
      icon: "compass",
      title: "Skill & Career Exploration",
      body: "Discover your interests, explore career paths and build the right skills.",
    },
    {
      icon: "shield",
      title: "Trusted & Secure",
      body: "Built on secure infrastructure for safe data, privacy and reliable performance.",
    },
  ],
  advantages: [
    {
      title: "Enhance Student Success",
      body: "Better guidance leads to higher engagement, stronger performance and improved outcomes.",
    },
    {
      title: "Reduce Career Confusion",
      body: "Help students make informed decisions with expert advice and personalized roadmaps.",
    },
    {
      title: "Strengthen Institutional Reputation",
      body: "Showcase your commitment to student career growth and holistic development.",
    },
    {
      title: "Build Future‑Ready Students",
      body: "Prepare them with the right skills, knowledge and confidence for tomorrow's opportunities.",
    },
  ],
  featuresPage: {
    title: "Features for schools & colleges.",
    titleHighlight: "For every institution.",
    lead: "We offer flexible partnership models designed to meet the unique needs of your institution.",
    devicesTitle: "Accessible on all devices.",
    devicesLead:
      "Desktop, tablet and mobile — students and staff stay connected wherever they are.",
    levelsEyebrow: "FEATURE LEVELS",
    levelsTitle: "Designed for every critical academic transition.",
    levelsLead:
      "Our features are calibrated to the exact developmental and academic stage of your student body.",
    level1Title: "Secondary Schools",
    level1Subtitle: "Stream Selection & Foundation Planning",
    level1Badge: "Class 9 & 10 Students and Parents",
    level1Item1: "Stream evaluation workshops (Science, Commerce, Arts)",
    level1Item2: "Aptitude and subject interest discovery",
    level1Item3: "Interactive parent orientation sessions",
    level1Item4: "Individual stream roadmap summaries",
    level2Title: "Pre-University & Junior Colleges",
    level2Subtitle: "Higher-Ed Pathways & Degree Alignment",
    level2Badge: "Class 11 & 12 / PUC Students",
    level2Item1: "Degree and university options exploration",
    level2Item2: "Entrance exam timelines (CET, JEE, NEET, CUET, CLAT, etc.)",
    level2Item3: "One-on-one academic mentor consultations",
    level2Item4: "Targeted college selection roadmaps",
    level3Title: "Colleges & Institutes",
    level3Subtitle: "Postgraduate & Career Specialization",
    level3Badge: "Undergraduate Students",
    level3Item1: "Higher education & research opportunities",
    level3Item2: "Emerging industry domains & skill prerequisites",
    level3Item3: "Faculty-aligned guidance seminars",
    level3Item4: "Academic assessment and roadmap planning",
    deliveryEyebrow: "DELIVERY FORMAT",
    deliveryTitle: "Flexible on-campus and hybrid formats.",
    deliveryLead:
      "Whether you prefer in-person auditorium seminars, classroom workshops, or structured hybrid sessions with parent participation, EDUARC seamlessly adapts to your institutional timetable.",
    deliveryOnCampusTitle: "On-Campus Seminars",
    deliveryOnCampusLead: "Direct mentor engagement",
    deliveryParentTitle: "Parent Orientations",
    deliveryParentLead: "Joint guidance clarity",
    onboardingEyebrow: "STRUCTURED ENGAGEMENT",
    onboardingTitle: "How we onboard your institution.",
    onboardingLead:
      "A seamless, four-stage implementation methodology designed to minimize administrative friction while maximizing student engagement.",
    suiteEyebrow: "INSTITUTIONAL GUIDANCE SUITE",
    suiteTitle: "Everything your institution needs to guide students with confidence.",
    suiteLead:
      "Comprehensive guidance infrastructure combining mentor engagement, student analytics, and longitudinal progress tracking.",
  },
  features: [
    {
      icon: "map",
      title: "Career Roadmaps",
      body: "Structured learning paths from 10th to higher education.",
    },
    {
      icon: "video",
      title: "Mentor Sessions",
      body: "Expert guidance through one‑on‑one and group sessions.",
    },
    {
      icon: "user",
      title: "Profile & Progress",
      body: "Track profile completion and set personal goals.",
    },
    { icon: "award", title: "Certificates", body: "Earn and download completion certificates." },
    {
      icon: "bell",
      title: "Notifications",
      body: "Stay updated with important alerts and opportunities.",
    },
    {
      icon: "layout",
      title: "Admin Dashboard",
      body: "Complete control for school and college administrators.",
    },
  ],
  programsPage: {
    title: "Our Programs",
    lead: "Explore the career guidance sessions, workshops and seminars conducted by EDUARC at various schools and colleges.",
    idealForTitle: "Every stage of the student journey.",
    processTitle: "Implementation process.",
    processLead: "Get started quickly with our simple 4‑step process.",
  },
  offers: [
    {
      icon: "graduation",
      title: "Student Access",
      body: "All enrolled students get access to EduArc's full suite of programs.",
    },
    {
      icon: "chart",
      title: "Institution Dashboard",
      body: "Principals and counsellors can monitor usage, progress and outcomes.",
    },
    {
      icon: "headset",
      title: "Dedicated Support",
      body: "Account manager and technical support for smooth implementation.",
    },
  ],
  idealFor: [
    "High Schools (10th & 12th)",
    "Pre‑University Colleges (PUC)",
    "Degree Colleges",
    "Professional & Technical Institutions",
  ],
  steps: [
    {
      title: "Initial Consultation",
      body: "Discuss your institution's needs and the right partnership model.",
    },
    {
      title: "Setup & Customization",
      body: "Configure your institution details, branding and user access.",
    },
    {
      title: "Training & Launch",
      body: "Train your team and students, then go live with full support.",
    },
    { title: "Ongoing Support", body: "We provide continuous assistance and updates." },
  ],
  impactPage: {
    title: "Impact for your institution.",
    lead: "EduArc helps institutions create a more focused, engaged and future‑ready student community.",
  },
  impacts: [
    {
      icon: "sparkles",
      title: "Higher Student Engagement",
      body: "More active participation in learning and career planning.",
    },
    {
      icon: "trending",
      title: "Improved Academic Outcomes",
      body: "Better decision‑making leads to higher success rates.",
    },
    {
      icon: "network",
      title: "Stronger Alumni Network",
      body: "Students build lasting connections with mentors and industry experts.",
    },
    {
      icon: "building",
      title: "Institutional Growth",
      body: "Enhanced reputation and increased admissions through better results.",
    },
  ],
  testimonials: [
    {
      name: "Ananya S",
      role: "Class 12 Student",
      quote:
        "EDUARC helped me understand my interests and explore career options I had never considered. The session was interactive, and the mentors were so supportive and friendly.",
      rating: 5,
      category: "Career Guidance Session",
      avatar: "ananya",
    },
    {
      name: "Priya Sharma",
      role: "Parent",
      quote:
        "As a parent, I was confused about the best career path for my daughter. EDUARC gave us clear guidance and practical steps. The team is professional and truly cares about students' future.",
      rating: 5,
      category: "Parent Feedback",
      avatar: "priya",
    },
    {
      name: "Rohit Kumar",
      role: "College Student",
      quote:
        "The mentor session was very insightful. I got to know about different career paths, the required skills and even some real-life examples. It gave me confidence to plan my future.",
      rating: 5,
      category: "Mentorship Session",
      avatar: "rohit",
    },
    {
      name: "Dr. Meera Iyer",
      role: "Teacher",
      quote:
        "EDUARC's sessions are well-structured and highly engaging. The resources and guidance provided are excellent and help students make informed decisions about their careers.",
      rating: 5,
      category: "Workshop Feedback",
      avatar: "meera",
    },
    {
      name: "Mr. Ramesh Babu",
      role: "Institution Representative",
      quote:
        "The EDUARC team conducted an excellent career guidance program at our school. The session was informative, interactive and received very positive feedback from our students and staff.",
      rating: 5,
      category: "Institution Partner",
      avatar: "ramesh",
    },
    {
      name: "Sneha V",
      role: "Class 10 Student",
      quote:
        "I was so confused about my future, but after the EDUARC session, I feel much more confident. It helped me discover my interests and gave me clear next steps.",
      rating: 5,
      category: "Career Guidance Session",
      avatar: "sneha",
    },
  ],
  testimonialStats: {
    programsConducted: "100+",
    programsLabel: "Programs Conducted",
    institutionsPartnered: "50+",
    institutionsLabel: "Institutions Partnered",
    studentsReached: "10,000+",
    studentsLabel: "Students Reached",
    averageRating: "4.8/5",
    ratingLabel: "Average Rating",
    ctaTitle: "Be a part of their success story",
    ctaDescription: "Join EDUARC and help more students discover their true potential.",
    ctaButtonText: "Explore Our Programs",
  },
  testimonialsPage: {
    badge: "TESTIMONIALS",
    title: "Real Stories.",
    titleHighlight: "Brighter Futures.",
    lead: "Hear from students, parents and educators who have experienced the impact of EDUARC's career guidance programs.",
    calloutLine1: "Better Guidance",
    calloutLine2: "Brighter Futures",
  },
  contactPage: {
    badge: "Get in Touch",
    title: "Let’s Build",
    titleHighlight: "Brighter Futures Together",
    lead: "Have questions, feedback, or want to collaborate? We're here to help. Reach out to us through any of the channels below — we'd love to hear from you!",
    pill1: "Quick Response",
    pill2: "Dedicated Support",
    pill3: "Real People",
    channelsTitle: "Multiple Ways to Reach Us",
    channelsLead:
      "Choose the channel that works best for you. We're just a call, email or message away!",
    connectEyebrow: "— Ready to Connect?",
    connectTitle: "We’re Here for What’s Next",
    connectLead:
      "Whether you’re a student, parent, educator, or institution — your journey matters to us. Let’s talk and create the right guidance for your future.",
    messageBadge: "Quick Contact",
    messageTitle: "Send Us a Message",
    messageLead:
      "Have a specific question or inquiry? Choose a topic and we'll get back to you with the right person from our team.",
    directCallTitle: "Prefer a direct conversation?",
    directCallLead: "Call us during our working hours (Mon - Fri, 9:00 AM - 6:00 PM IST).",
    signature: "“We’d love to hear from you!”",
    thankYou:
      "For your time and consideration. Together, let's empower more students to achieve their dreams.",
  },
  partnerPage: {
    badge: "Student & Institutional Enquiries",
    title: "Start your guidance journey with",
    titleHighlight: "EDUARC.",
    lead: "Whether you are a student evaluating streams after Class 10 or 12, a parent seeking objective higher-education advice, or a school administrator planning a student guidance cohort.",
    expectationsTitle: "What to Expect After Submitting:",
    step1Title: "1. Dedicated Counsellor Contact",
    step1Body:
      "An academic coordinator will review your background and connect via phone or WhatsApp to understand your educational goals.",
    step2Title: "2. Focused Guidance Consultation",
    step2Body:
      "Explore stream opportunities, college options, and entrance timelines in a pressure-free, student-first consultation.",
    step3Title: "3. Absolute Privacy & Integrity",
    step3Body:
      "Your details remain confidential and are accessed exclusively by verified EDUARC counselling staff for educational planning.",
    trust1: "Trusted by Students & Families",
    trust2: "Partnered with Schools & Colleges",
    trust3: "Focused on Your Future",
  },
  cta: {
    title: "Let's build a brighter future together.",
    lead: "Partner with EduArc and give your students the guidance, mentorship and opportunities they deserve.",
  },
  mentors: [
    {
      id: "dr-gayathri-g-n",
      name: "Dr. Gayathri G N",
      role: "Career Guidance & Student Counselling Mentor",
      designation: "Associate Professor · Ph.D. in Computer Science & Engineering",
      location: "Tumkur, Karnataka, India",
      email: "gaytri.infosea@gmail.com",
      imageUrl: "",
      shortBio:
        "Helping students move from confusion to clarity with informed academic choices and future career roadmaps.",
      cardStats: [
        { label: "Experience", value: "7+ Yrs" },
        { label: "Research", value: "6 Pubs" },
        { label: "Education", value: "Ph.D." },
      ],
      about:
        "Choosing the right career path after Class 10 or Class 12 can be challenging for students and parents. With so many courses, streams, and career opportunities available, finding the right direction can make all the difference.\n\nDr. Gayathri G N is an experienced academician with over 7 years of experience in teaching, student mentoring, academic assessment, and research guidance.\n\nThrough EDUARC, she aims to help students discover their interests, explore suitable career options, make informed academic decisions, and build a clear roadmap for their future.\n\nWith her academic and research background, she brings an informed perspective to higher education, emerging career opportunities, and long-term academic planning.\n\nHer goal is simple: to help students move from confusion to clarity and make confident decisions about their future, with parents feeling informed and supported throughout the journey.",
      howICanGuide: [
        {
          title: "Discover Your Career",
          description:
            "Understand your interests, recognise your strengths, and explore career options that align with your aspirations.",
        },
        {
          title: "Choose the Right Stream",
          description:
            "Explore Science, Commerce, and Humanities after Class 10 and understand which pathways may suit your interests and future goals.",
        },
        {
          title: "Find the Right Course",
          description:
            "Discover degree programmes, college options, and educational pathways after Class 12.",
        },
        {
          title: "Build Your Career Roadmap",
          description:
            "Get a clearer plan for your next academic steps, skill development, and future career exploration.",
        },
        {
          title: "Explore Future Opportunities",
          description:
            "Discover emerging careers, new industries, and opportunities beyond the options you already know.",
        },
        {
          title: "Guidance for Students & Parents",
          description:
            "Make informed education decisions through supportive discussions about academic choices, career possibilities, and future goals.",
        },
      ],
      whyConnect: [
        {
          title: "7+ Years of Academic Experience",
          description: "Teaching, student mentoring, and academic guidance.",
        },
        {
          title: "Ph.D. in Computer Science & Engineering",
          description: "A strong academic foundation and understanding of higher education.",
        },
        {
          title: "Research Experience",
          description:
            "6 research publications across cloud security, cryptography, computer networks, and machine learning.",
        },
        {
          title: "Student-Focused Guidance",
          description:
            "Support for exploring interests, evaluating options, and planning future learning.",
        },
        {
          title: "A Wider View of Opportunities",
          description:
            "Academic and research experience that helps introduce students to emerging technology fields and higher education possibilities.",
        },
      ],
      whoCanBenefit: [
        {
          target: "Class 10 Students",
          benefit: "Explore streams and plan the next stage of education.",
        },
        {
          target: "Class 12 Students",
          benefit: "Understand undergraduate courses and future career pathways.",
        },
        {
          target: "Parents",
          benefit:
            "Gain clarity about available academic options and support their children's decisions.",
        },
        {
          target: "Students Exploring Their Future",
          benefit: "Discover opportunities, set goals, and identify useful next steps.",
        },
      ],
      impactNotice: "Verified EDUARC activity metrics can be added as the programme grows.",
      impactMetrics: [
        { label: "Students counselled", value: "To be updated" },
        { label: "Counselling sessions completed", value: "To be updated" },
        { label: "Career awareness workshops conducted", value: "To be updated" },
        { label: "Schools associated", value: "To be updated" },
        { label: "Colleges associated", value: "To be updated" },
      ],
      message:
        "Every student has different interests, strengths, and dreams. Choosing a career should not be about following the crowd, but about understanding the possibilities and making informed decisions.\n\nMy aim is to help students explore their options, identify a suitable direction, and approach their academic journey with greater clarity and confidence. I also believe parents play an important role in this process, and the right guidance can help families make decisions together.\n\nThrough EDUARC, let us turn career confusion into clarity and possibilities into purposeful action.",
      tagline: "Learn with direction. Grow with confidence. Build your future with EDUARC.",
    },
  ],
  conductedPrograms: defaultConductedPrograms,
  emailTemplate: {
    enabled: true,
    fromName: "EduArc Guidance Team",
    fromEmail: "EduArc <eduarc.connect@gmail.com>",
    replyTo: "eduarc.connect@gmail.com",
    subject: "Thank you for connecting with EduArc!",
    heading: "Welcome to EduArc Guidance",
    greeting: "Dear {name},",
    body: "Thank you for reaching out to EduArc! We have successfully received your enquiry regarding {role} guidance.\n\nOur expert academic coordinators are reviewing your details. A dedicated counsellor will connect with you shortly on your provided contact details to discuss personalized roadmaps and next steps for your educational journey.",
    highlightsTitle: "What happens next:",
    highlight1: "1-on-1 Academic & Career Consultation",
    highlight2: "Course, College & Stream Exploration",
    highlight3: "Confidential Guidance from Verified Mentors",
    closing: "Together for Student Success,",
    signature:
      "EduArc — Ambitious to Achievement\nEmail: eduarc.connect@gmail.com | Phone: +91 95357 21089\nWebsite: https://www.eduarc-connect.in",
  },
};

/** Saved data is layered over defaults per section so new fields always have a value. */
export function mergeContent(saved: unknown): SiteContent {
  if (!saved || typeof saved !== "object") return defaultContent;
  const merged: Record<string, unknown> = { ...defaultContent };
  for (const [key, def] of Object.entries(defaultContent)) {
    const value = (saved as Record<string, unknown>)[key];
    if (value === undefined || value === null) continue;
    merged[key] =
      Array.isArray(def) || typeof def !== "object" ? value : { ...def, ...(value as object) };
  }
  if (!Array.isArray(merged["testimonials"])) {
    merged["testimonials"] = defaultContent.testimonials;
  }
  const parsed = siteContentSchema.safeParse(merged);
  if (parsed.success) return parsed.data;

  // If saved testimonials failed validation, fall back to default testimonials
  if (merged["testimonials"]) {
    const fallback = { ...merged, testimonials: defaultContent.testimonials };
    const retry = siteContentSchema.safeParse(fallback);
    if (retry.success) return retry.data;
  }

  // If saved mentors failed validation due to old schema, fall back to updated default mentors
  if (merged["mentors"]) {
    const fallback = { ...merged, mentors: defaultContent.mentors };
    const retry = siteContentSchema.safeParse(fallback);
    if (retry.success) return retry.data;
  }
  if (merged["conductedPrograms"]) {
    const fallback = { ...merged, conductedPrograms: defaultContent.conductedPrograms };
    const retry = siteContentSchema.safeParse(fallback);
    if (retry.success) return retry.data;
  }
  return defaultContent;
}

export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const websiteHref = (site: string) =>
  /^https?:\/\//i.test(site) ? site : `https://${site}`;
export const initials = (name: string) =>
  name
    .replace(/^(dr|mr|mrs|ms|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
