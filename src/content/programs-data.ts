// Central data repository for EDUARC conducted programs and session details

import imgSriVenkateshwara from "@/assets/programs/program-sri-venkateshwara.jpg";
import imgStMarys from "@/assets/programs/program-st-marys.jpg";
import imgKendriyaVidyalaya from "@/assets/programs/program-kendriya-vidyalaya.jpg";
import imgDavPublic from "@/assets/programs/program-dav-public.jpg";
import imgPsgCollege from "@/assets/programs/program-psg-college.jpg";
import imgSriChaitanya from "@/assets/programs/program-sri-chaitanya.jpg";
import imgChinmayaVidyalaya from "@/assets/programs/program-chinmaya-vidyalaya.jpg";
import imgVitVellore from "@/assets/programs/program-vit-vellore.jpg";
import imgBishopHeber from "@/assets/programs/program-bishop-heber.jpg";

// Session photos
import sessionHeroImg from "@/assets/programs/session/session-hero.jpg";
import sessionGallery1 from "@/assets/programs/session/session-gallery-1.jpg";
import sessionGallery2 from "@/assets/programs/session/session-gallery-2.jpg";
import sessionGallery3 from "@/assets/programs/session/session-gallery-3.jpg";
import sessionGallery4 from "@/assets/programs/session/session-gallery-4.jpg";
import sessionGallery5 from "@/assets/programs/session/session-gallery-5.jpg";

export const SUPABASE_STORAGE_URL =
  "https://bxdibrixivozxipefylz.supabase.co/storage/v1/object/public/programs";

export const supabaseProgramImages = {
  sriVenkateshwara: `${SUPABASE_STORAGE_URL}/program-sri-venkateshwara.jpg`,
  stMarys: `${SUPABASE_STORAGE_URL}/program-st-marys.jpg`,
  kendriyaVidyalaya: `${SUPABASE_STORAGE_URL}/program-kendriya-vidyalaya.jpg`,
  davPublic: `${SUPABASE_STORAGE_URL}/program-dav-public.jpg`,
  psgCollege: `${SUPABASE_STORAGE_URL}/program-psg-college.jpg`,
  sriChaitanya: `${SUPABASE_STORAGE_URL}/program-sri-chaitanya.jpg`,
  chinmayaVidyalaya: `${SUPABASE_STORAGE_URL}/program-chinmaya-vidyalaya.jpg`,
  vitVellore: `${SUPABASE_STORAGE_URL}/program-vit-vellore.jpg`,
  bishopHeber: `${SUPABASE_STORAGE_URL}/program-bishop-heber.jpg`,
  sessionHero: `${SUPABASE_STORAGE_URL}/session/session-hero.jpg`,
  sessionGallery1: `${SUPABASE_STORAGE_URL}/session/session-gallery-1.jpg`,
  sessionGallery2: `${SUPABASE_STORAGE_URL}/session/session-gallery-2.jpg`,
  sessionGallery3: `${SUPABASE_STORAGE_URL}/session/session-gallery-3.jpg`,
  sessionGallery4: `${SUPABASE_STORAGE_URL}/session/session-gallery-4.jpg`,
  sessionGallery5: `${SUPABASE_STORAGE_URL}/session/session-gallery-5.jpg`,
};

export interface ProgramSessionReview {
  quote: string;
  author: string;
}

export interface ProgramSessionData {
  id: string;
  institution: string;
  title: string;
  date: string;
  duration: string;
  location: string;
  image: string;
  heroImage: string;
  gallery: string[];
  type: "school" | "college";
  tag: string;
  category: string;
  description: string;
  institutionDetails: {
    name: string;
    type: string;
    city: string;
    contactPerson: string;
    phone: string;
    email: string;
  };
  summary: {
    text: string;
    quote: string;
    quoteAuthor: string;
  };
  feedback: {
    rating: string;
    totalResponses: number;
    reviews: ProgramSessionReview[];
  };
}

export const defaultSessionGallery = [
  supabaseProgramImages.sessionGallery1,
  supabaseProgramImages.sessionGallery2,
  supabaseProgramImages.sessionGallery3,
  supabaseProgramImages.sessionGallery4,
  supabaseProgramImages.sessionGallery5,
];

export const conductedPrograms: ProgramSessionData[] = [
  {
    id: "sri-venkateshwara",
    institution: "Sri Venkateshwara Higher Secondary School",
    title: "Career Options After 10th – Discover Your Path",
    date: "15 Oct 2025",
    duration: "2 Hours",
    location: "Sri Venkateshwara Higher Secondary School, Coimbatore",
    image: supabaseProgramImages.sriVenkateshwara,
    heroImage: supabaseProgramImages.sessionHero,
    gallery: defaultSessionGallery,
    type: "school",
    tag: "Higher Secondary",
    category: "Career Guidance Session",
    description:
      "An interactive session to help students explore various career options after 10th, understand the right stream choices and plan their future with confidence.",
    institutionDetails: {
      name: "Sri Venkateshwara Higher Secondary School",
      type: "Higher Secondary School",
      city: "Coimbatore, Tamil Nadu",
      contactPerson: "Mr. R. Kumar",
      phone: "+91 98765 43210",
      email: "info@svhss.edu.in",
    },
    summary: {
      text: "The session focused on helping Class 10 students understand the different career options available after 10th, including Science, Commerce, Arts and vocational courses. The EDUARC team guided students on how to choose the right stream based on their interests, strengths and future goals. Interactive activities, Q&A and real-life examples made the session engaging and informative.",
      quote: "Very helpful session. Now I have a clear idea about my options after 10th.",
      quoteAuthor: "Ananya S, Class 10",
    },
    feedback: {
      rating: "4.8",
      totalResponses: 86,
      reviews: [
        {
          quote:
            "The session was very informative and well organized. The mentors were supportive and answered all our questions.",
          author: "Rahul K, Class 10",
        },
        {
          quote: "Excellent presentation and guidance. It boosted my confidence.",
          author: "Priya M, Class 10",
        },
        {
          quote:
            "Very useful session for all students. It helped me understand the different career options clearly.",
          author: "Sneha V, Class 10",
        },
      ],
    },
  },
  {
    id: "st-marys",
    institution: "St. Mary's College",
    title: "Building a Successful Career in Science",
    date: "12 Aug 2025",
    duration: "2.5 Hours",
    location: "St. Mary's College Auditorium, Tiruchirappalli, Tamil Nadu",
    image: supabaseProgramImages.stMarys,
    heroImage: supabaseProgramImages.sessionHero,
    gallery: defaultSessionGallery,
    type: "college",
    tag: "Undergraduate",
    category: "Science & Research Symposium",
    description:
      "Conducted for undergraduate students, unpacking career trajectories in Pure Sciences, Biotechnology, Data Analytics, and competitive examinations like JAM and GATE.",
    institutionDetails: {
      name: "St. Mary's College",
      type: "Undergraduate & Postgraduate College",
      city: "Tiruchirappalli, Tamil Nadu",
      contactPerson: "Dr. S. Anthony",
      phone: "+91 98421 56789",
      email: "guidance@stmaryscollege.edu",
    },
    summary: {
      text: "EDUARC academic mentors walked students through emerging frontiers in scientific research and industrial laboratory roles. The session broke down national eligibility criteria, research fellowship applications, and interdisciplinary opportunities combining computing with biological sciences.",
      quote:
        "The roadmap for post-graduate research was eye-opening. Every student pursuing science should attend this.",
      quoteAuthor: "Karthik R, B.Sc Physics",
    },
    feedback: {
      rating: "4.9",
      totalResponses: 112,
      reviews: [
        {
          quote: "Clear roadmap for national examinations and research scholarships.",
          author: "Divya P, B.Sc Biotech",
        },
        {
          quote: "Mentors gave practical advice on balancing academic study and preparation.",
          author: "Arun M, B.Sc Chemistry",
        },
        {
          quote: "Detailed insights into emerging fields like bioinformatics.",
          author: "Swetha K, B.Sc Maths",
        },
      ],
    },
  },
  {
    id: "kendriya-vidyalaya",
    institution: "Kendriya Vidyalaya",
    title: "Higher Education & Future Opportunities",
    date: "20 Jul 2025",
    duration: "2 Hours",
    location: "Kendriya Vidyalaya Main Auditorium, Bengaluru, Karnataka",
    image: supabaseProgramImages.kendriyaVidyalaya,
    heroImage: supabaseProgramImages.sessionHero,
    gallery: defaultSessionGallery,
    type: "school",
    tag: "Senior School",
    category: "Senior Secondary Guidance",
    description:
      "A structured roadmap session for Class 11 & 12 students covering entrance examination timelines, central university admissions, and merit scholarships across India.",
    institutionDetails: {
      name: "Kendriya Vidyalaya",
      type: "Senior Secondary School (CBSE)",
      city: "Bengaluru, Karnataka",
      contactPerson: "Mrs. Meena Sharma",
      phone: "+91 98112 34567",
      email: "principal@kvbengaluru.edu.in",
    },
    summary: {
      text: "The workshop demystified competitive examination calendars including CUET, JEE, NEET, and CLAT. Students received tangible milestone checklists, subject preparation strategies, and guidance on identifying universities matching their personal strengths.",
      quote: "EDUARC made university admissions timelines feel structured instead of overwhelming.",
      quoteAuthor: "Aditya N, Class 12",
    },
    feedback: {
      rating: "4.8",
      totalResponses: 94,
      reviews: [
        {
          quote: "The admission calendar mapping was the most practical guidance we've received.",
          author: "Tarun S, Class 12",
        },
        {
          quote: "Very honest answers about cutoff realities and alternative degree options.",
          author: "Kavya R, Class 11",
        },
        {
          quote: "Interactive Q&A helped clear doubts my parents and I shared.",
          author: "Nikhil B, Class 12",
        },
      ],
    },
  },
  {
    id: "dav-public",
    institution: "DAV Public School",
    title: "Personality Development & Life Skills Workshop",
    date: "10 Jun 2025",
    duration: "3 Hours",
    location: "DAV Public School Campus, Mysuru, Karnataka",
    image: supabaseProgramImages.davPublic,
    heroImage: supabaseProgramImages.sessionHero,
    gallery: defaultSessionGallery,
    type: "school",
    tag: "Life Skills",
    category: "Youth Leadership Workshop",
    description:
      "An experiential workshop focusing on public speaking, collaborative teamwork, emotional agility, and personal goal setting for young students.",
    institutionDetails: {
      name: "DAV Public School",
      type: "Public Secondary Institution",
      city: "Mysuru, Karnataka",
      contactPerson: "Mr. Rajesh V",
      phone: "+91 94481 23901",
      email: "admin@davmysuru.edu.in",
    },
    summary: {
      text: "Through simulated group discussions, presentations, and active listening drills, students practiced expressing their ideas with clarity. The workshop also emphasized digital hygiene, time management, and building disciplined study routines.",
      quote:
        "The interactive exercises helped me overcome my stage fear and speak with confidence.",
      quoteAuthor: "Varun G, Class 9",
    },
    feedback: {
      rating: "4.7",
      totalResponses: 78,
      reviews: [
        {
          quote: "I loved the speaking games. It made everyone participate enthusiastically.",
          author: "Ananya M, Class 9",
        },
        {
          quote: "Great insights on managing exam stress and time effectively.",
          author: "Deepak L, Class 10",
        },
        {
          quote: "Mentors were friendly, approachable, and encouraging.",
          author: "Pooja H, Class 9",
        },
      ],
    },
  },
  {
    id: "psg-college",
    institution: "PSG College of Arts & Science",
    title: "Stream Selection Guidance (Session 1)",
    date: "25 Apr 2025",
    duration: "2 Hours",
    location: "PSG CAS Seminar Hall, Coimbatore, Tamil Nadu",
    image: supabaseProgramImages.psgCollege,
    heroImage: supabaseProgramImages.sessionHero,
    gallery: defaultSessionGallery,
    type: "college",
    tag: "Degree College",
    category: "Academic Specialization",
    description:
      "Phase 1 of our collegiate guidance initiative, helping students evaluate degree options, professional certifications, and industry career alignments.",
    institutionDetails: {
      name: "PSG College of Arts & Science",
      type: "Autonomous Arts & Science College",
      city: "Coimbatore, Tamil Nadu",
      contactPerson: "Prof. K. Venkatesh",
      phone: "+91 98430 87123",
      email: "careerhub@psgcas.ac.in",
    },
    summary: {
      text: "Conducted for undergraduate students, this seminar unpacked career avenues across corporate finance, creative industries, analytics, and civil services. EDUARC specialists demonstrated how to build complementary skills during university semesters.",
      quote:
        "We were able to evaluate professional degree choices with verified industry trends rather than hearsay.",
      quoteAuthor: "Meenakshi B, 1st Year B.Com",
    },
    feedback: {
      rating: "4.9",
      totalResponses: 130,
      reviews: [
        {
          quote: "Extremely insightful session on industry certifications that actually matter.",
          author: "Goutham S, B.Com",
        },
        {
          quote:
            "Helped me understand the difference between theoretical degrees and applied skills.",
          author: "Lavanya C, B.A. Literature",
        },
        {
          quote: "Clear, factual, and direct guidance with no sales gimmicks.",
          author: "Vignesh T, B.Sc CS",
        },
      ],
    },
  },
  {
    id: "sri-chaitanya",
    institution: "Sri Chaitanya Junior College",
    title: "Resume Building & Interview Preparation",
    date: "15 Mar 2025",
    duration: "2.5 Hours",
    location: "Sri Chaitanya Campus, Hyderabad, Telangana",
    image: supabaseProgramImages.sriChaitanya,
    heroImage: supabaseProgramImages.sessionHero,
    gallery: defaultSessionGallery,
    type: "college",
    tag: "Junior College",
    category: "Career Preparation Workshop",
    description:
      "A hands-on masterclass equipping students with resume architecture principles, elevator pitch training, and interview panel techniques.",
    institutionDetails: {
      name: "Sri Chaitanya Junior College",
      type: "Junior College / Intermediate",
      city: "Hyderabad, Telangana",
      contactPerson: "Mr. M. Srinivas",
      phone: "+91 99890 12345",
      email: "admissions@srichaitanya.ac.in",
    },
    summary: {
      text: "Students learned how to highlight academic projects, leadership roles, and technical proficiencies concisely. The interactive mock interview rounds allowed participants to receive immediate constructive feedback on posture, phrasing, and response structure.",
      quote: "The mock interview drill gave me real confidence for college admissions panels.",
      quoteAuthor: "Siddharth T, Junior College Senior",
    },
    feedback: {
      rating: "4.8",
      totalResponses: 105,
      reviews: [
        {
          quote: "The before-and-after resume examples made the formatting rules so obvious.",
          author: "Sai Krishna, MPC Stream",
        },
        {
          quote: "Live feedback during mock interviews was invaluable.",
          author: "Ayesha F, BiPC Stream",
        },
        {
          quote: "Very practical session that will benefit my college applications.",
          author: "Pranav M, MEC Stream",
        },
      ],
    },
  },
  {
    id: "chinmaya-vidyalaya",
    institution: "Chinmaya Vidyalaya",
    title: "Career Guidance Session for Class 12 Students",
    date: "22 Feb 2025",
    duration: "2 Hours",
    location: "Chinmaya Vidyalaya Auditorium, Ernakulam, Kerala",
    image: supabaseProgramImages.chinmayaVidyalaya,
    heroImage: supabaseProgramImages.sessionHero,
    gallery: defaultSessionGallery,
    type: "school",
    tag: "Class 12 Focus",
    category: "Career Strategy Seminar",
    description:
      "Specialized consultation for outgoing Class 12 students highlighting modern career paths across Design, Law, Management, Humanities, and Applied Tech.",
    institutionDetails: {
      name: "Chinmaya Vidyalaya",
      type: "Senior Secondary School",
      city: "Ernakulam, Kerala",
      contactPerson: "Mrs. Latha Nair",
      phone: "+91 94471 67890",
      email: "info@chinmayakochi.edu.in",
    },
    summary: {
      text: "EDUARC educators provided students and attending parents with transparent comparative analyses of career stability, initial compensation, and growth curves across non-traditional domains, resolving anxieties around course selection.",
      quote:
        "I discovered career paths in UX and data analytics that I had never considered before.",
      quoteAuthor: "Rohan P, Class 12",
    },
    feedback: {
      rating: "4.9",
      totalResponses: 89,
      reviews: [
        {
          quote:
            "My parents attended with me and we finally reached an agreement on my degree choice.",
          author: "Anjali K, Class 12",
        },
        {
          quote: "Clear breakdown of entrance requirements for design and humanities institutes.",
          author: "Manish E, Class 12",
        },
        {
          quote: "Objective, empathetic, and data-backed guidance throughout.",
          author: "Shruti N, Class 12",
        },
      ],
    },
  },
  {
    id: "vit-vellore",
    institution: "VIT Vellore",
    title: "Career Guidance & Goal Setting Workshop",
    date: "18 Jan 2025",
    duration: "3 Hours",
    location: "Technology Tower Auditorium, VIT Vellore, Tamil Nadu",
    image: supabaseProgramImages.vitVellore,
    heroImage: supabaseProgramImages.sessionHero,
    gallery: defaultSessionGallery,
    type: "college",
    tag: "University",
    category: "University Masterclass",
    description:
      "Strategic milestone planning for university students, covering technical profile building, research fellowships abroad, and targeted industry transitions.",
    institutionDetails: {
      name: "VIT Vellore",
      type: "Institute of Technology",
      city: "Vellore, Tamil Nadu",
      contactPerson: "Dr. R. Ramanathan",
      phone: "+91 94432 54321",
      email: "guidance@vit.ac.in",
    },
    summary: {
      text: "Conducted for undergraduate engineering and science cohorts, the masterclass outlined semester-by-semester roadmaps for competitive hackathons, academic publications, open-source contributions, and graduate school admissions abroad.",
      quote:
        "The goal-setting framework helped me plan my final two university years with total clarity.",
      quoteAuthor: "Harish S, 2nd Year B.Tech",
    },
    feedback: {
      rating: "4.9",
      totalResponses: 160,
      reviews: [
        {
          quote: "Exceptional depth regarding higher education fellowships in Europe and the US.",
          author: "Shreya V, B.Tech CSE",
        },
        {
          quote: "Mentors gave actionable tips on writing strong statements of purpose.",
          author: "Kiran D, B.Tech ECE",
        },
        {
          quote: "One of the most practical career workshops conducted on our campus.",
          author: "Akash R, B.Tech Mech",
        },
      ],
    },
  },
  {
    id: "bishop-heber",
    institution: "Bishop Heber College",
    title: "Higher Education Pathways and Career Choices",
    date: "12 Dec 2024",
    duration: "2.5 Hours",
    location: "Bishop Heber College Main Hall, Tiruchirappalli, Tamil Nadu",
    image: supabaseProgramImages.bishopHeber,
    heroImage: supabaseProgramImages.sessionHero,
    gallery: defaultSessionGallery,
    type: "college",
    tag: "Higher Education",
    category: "Collegiate Guidance Summit",
    description:
      "A comprehensive post-graduate pathways summit detailing university entrance exams, central research scholarships, and industry placement strategies.",
    institutionDetails: {
      name: "Bishop Heber College",
      type: "Autonomous College of Higher Education",
      city: "Tiruchirappalli, Tamil Nadu",
      contactPerson: "Prof. J. Paul",
      phone: "+91 98424 11223",
      email: "placement@bhc.edu.in",
    },
    summary: {
      text: "The symposium featured presentation segments on central university admissions followed by dedicated 1-on-1 counselor desks where students reviewed their academic transcripts and career interests with EDUARC educators.",
      quote:
        "The 1-on-1 counselor desk answered all my doubts about applying for central university PG courses.",
      quoteAuthor: "Preethi M, B.A. Economics",
    },
    feedback: {
      rating: "4.8",
      totalResponses: 120,
      reviews: [
        {
          quote: "The 1-on-1 counseling desk was incredibly supportive.",
          author: "Joseph D, B.Sc Computer Science",
        },
        {
          quote: "Detailed breakdown of central government research scholarships.",
          author: "Nithya S, B.Com",
        },
        {
          quote: "Clear and encouraging guidance for students from all academic backgrounds.",
          author: "Vimal R, B.Sc Physics",
        },
      ],
    },
  },
];

export function getProgramSessionById(id: string): ProgramSessionData | undefined {
  return conductedPrograms.find((p) => p.id === id);
}
