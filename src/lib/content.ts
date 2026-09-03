/**
 * BLACKLINE AGENCY — SITE CONTENT
 *
 * Single source of truth for every word rendered on the marketing site.
 *
 * ─────────────────────────────────────────────────────────────────────
 * CONTENT INTEGRITY RULES FOR THIS FILE
 *
 * Service capability copy is written by us and is safe to edit freely.
 *
 * Anything that asserts a FACT about the business or a third party —
 * testimonials, client names, results, headcount, founding date, awards,
 * contact details — must be verified before it ships. Unverified entries
 * live behind `PLACEHOLDER_*` exports below and are deliberately obvious,
 * so they cannot be mistaken for real content or ship by accident.
 *
 * `npm run verify` fails the build if placeholder content is still
 * enabled while NEXT_PUBLIC_SITE_INDEXABLE=true.
 * ─────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Blackline Agency",
  // CLIENT INPUT REQUIRED — confirmed domain not yet supplied.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blacklineagency.co.uk",
  tagline: "Design that trades on presence.",
  description:
    "Blackline Agency designs and builds high-performance websites, then runs the search, email and SMS that keep them earning. Founder-led, monochrome by conviction.",
  // CLIENT INPUT REQUIRED — real inbox before launch.
  email: "hello@blacklineagency.co.uk",
  locale: "en_GB",
  currency: "GBP",
  currencySymbol: "£",
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Studio", href: "#studio" },
] as const;

/* ============================================================
   SERVICES — our own capability copy. Safe to edit.
   ============================================================ */

export type Service = {
  id: string;
  index: string;
  title: string;
  summary: string;
  detail: string;
  capabilities: string[];
};

export const services: Service[] = [
  {
    id: "design",
    index: "01",
    title: "Web Design & Build",
    summary:
      "Bespoke sites designed in-house and built to survive contact with the real world.",
    detail:
      "We do not start from a template. Every project begins with the commercial question — who is landing here, what do they need to believe, and what should happen next — and the design answers it. The build is hand-written Next.js, not a page builder, which is why our sites load in under a second and still look like nobody else's.",
    capabilities: [
      "Art direction & visual identity",
      "Responsive design, mobile-first",
      "Next.js & React development",
      "Headless CMS so you can edit copy yourself",
      "Motion & interaction design",
      "Accessibility to WCAG 2.2 AA",
    ],
  },
  {
    id: "seo",
    index: "02",
    title: "SEO & Search",
    summary:
      "Technical foundations and ongoing management that compound month over month.",
    detail:
      "Most agencies sell SEO as a monthly report. We treat it as engineering: crawlability, structured data, internal linking and page speed first, because no amount of content fixes a site Google struggles to render. Then content and authority, measured against revenue rather than vanity rankings.",
    capabilities: [
      "Technical audits & fixes",
      "Keyword and intent mapping",
      "On-page & structured data",
      "Local SEO and Google Business Profile",
      "Content strategy & production",
      "Monthly reporting against pipeline",
    ],
  },
  {
    id: "email",
    index: "03",
    title: "Email Marketing",
    summary:
      "Lifecycle flows that keep earning long after the campaign has gone quiet.",
    detail:
      "The traffic you already paid for is the cheapest revenue you will ever get. We build the welcome, abandonment, win-back and post-purchase sequences that convert it — designed to match the site, written to sound like you, and tested properly rather than sent on a hunch.",
    capabilities: [
      "Lifecycle & automation flows",
      "Campaign design and build",
      "List segmentation & hygiene",
      "Deliverability and domain authentication",
      "A/B testing programme",
      "Klaviyo, Mailchimp & HubSpot",
    ],
  },
  {
    id: "sms",
    index: "04",
    title: "SMS Marketing",
    summary:
      "The highest open rate in marketing, used with enough restraint to keep it that way.",
    detail:
      "SMS works because it is scarce. We treat the channel accordingly — tight segmentation, genuine reasons to message, and compliance handled properly so the list stays healthy. Used well it is the fastest route from a launch to money in the account.",
    capabilities: [
      "Opt-in capture & list growth",
      "Campaign and automation build",
      "Segmentation & send-time strategy",
      "GDPR & PECR compliance",
      "Integration with email lifecycle",
      "Performance reporting",
    ],
  },
  {
    id: "optimisation",
    index: "05",
    title: "Optimisation & Care",
    summary:
      "The behind-the-scenes work that stops a good site quietly decaying.",
    detail:
      "A site is not finished when it launches. We monitor Core Web Vitals, patch dependencies, keep backups tested, watch uptime and run conversion experiments against real analytics. It is the least glamorous thing we sell and usually the highest returning.",
    capabilities: [
      "Core Web Vitals monitoring",
      "Conversion rate optimisation",
      "A/B testing & analytics",
      "Security patching & backups",
      "Uptime monitoring & hosting",
      "Ongoing content edits",
    ],
  },
];

/* ============================================================
   PRICING

   ⚠️  PROPOSED — NOT YET CONFIRMED BY THE CLIENT.
   Website tiers sit inside the £1.5k–£6k range Brad specified.
   Monthly retainers are our proposal at UK SME market rate and
   were explicitly flagged as undecided. Confirm every number
   before this site is indexed.
   ============================================================ */

export const PRICING_CONFIRMED = false;

export type Tier = {
  id: string;
  name: string;
  price: number;
  cadence: "project" | "month";
  summary: string;
  includes: string[];
  featured?: boolean;
};

export const projectTiers: Tier[] = [
  {
    id: "essential",
    name: "Essential",
    price: 1500,
    cadence: "project",
    summary:
      "A sharp, fast marketing site for a business that needs to look established.",
    includes: [
      "Up to 5 pages",
      "Custom design, no templates",
      "Mobile-first responsive build",
      "Contact form & enquiry routing",
      "Foundational SEO setup",
      "Two rounds of revisions",
      "Analytics & Search Console",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    price: 3500,
    cadence: "project",
    summary:
      "Our most-specified build. Motion, CMS and the depth to carry a real brand.",
    includes: [
      "Up to 12 pages",
      "Bespoke art direction",
      "Scroll & interaction design",
      "Headless CMS — edit it yourself",
      "Copywriting support",
      "Advanced technical SEO",
      "Email capture & CRM integration",
      "Three rounds of revisions",
    ],
    featured: true,
  },
  {
    id: "flagship",
    name: "Flagship",
    price: 6000,
    cadence: "project",
    summary:
      "For e-commerce, booking systems and brands where the site is the business.",
    includes: [
      "Unlimited page architecture",
      "E-commerce or booking build",
      "Full motion design system",
      "Third-party integrations",
      "Performance budget guarantee",
      "Structured data & rich results",
      "Launch strategy & training",
      "Priority delivery",
    ],
  },
];

export const retainerTiers: Tier[] = [
  {
    id: "care",
    name: "Care",
    price: 150,
    cadence: "month",
    summary: "Keep it fast, patched, backed up and online.",
    includes: [
      "Managed hosting & SSL",
      "Uptime monitoring",
      "Weekly backups, tested",
      "Security patching",
      "Core Web Vitals monitoring",
      "One hour of edits monthly",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 600,
    cadence: "month",
    summary: "Everything in Care, plus active search management.",
    includes: [
      "Everything in Care",
      "Google SEO management",
      "Keyword & content roadmap",
      "Two content pieces monthly",
      "Local SEO & business profile",
      "Conversion tracking",
      "Monthly performance report",
    ],
    featured: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 1200,
    cadence: "month",
    summary: "Full-channel management across search, email and SMS.",
    includes: [
      "Everything in Growth",
      "Email marketing management",
      "SMS campaign management",
      "Conversion rate optimisation",
      "A/B testing programme",
      "Four content pieces monthly",
      "Quarterly strategy session",
      "Priority support",
    ],
  },
];

/* ============================================================
   PROCESS — our own copy.
   ============================================================ */

export const processSteps = [
  {
    index: "01",
    title: "Diagnose",
    body: "We start with the commercial problem, not the moodboard. Who is landing, what are they weighing up, and where is the current site losing them.",
  },
  {
    index: "02",
    title: "Direct",
    body: "Art direction, structure and copy locked before a single component is built. You approve the design before it costs anything to change.",
  },
  {
    index: "03",
    title: "Build",
    body: "Hand-written Next.js. Measured against a performance budget and an accessibility standard from the first commit, not audited at the end.",
  },
  {
    index: "04",
    title: "Compound",
    body: "Launch is the start. Search, email and SMS run on top of the asset we just built, and the numbers get reviewed every month.",
  },
];

/* ============================================================
   ⚠️  PLACEHOLDER CONTENT — MUST BE REPLACED BEFORE LAUNCH
   ============================================================

   These are NOT real. They are deliberately obvious so that they
   cannot be mistaken for verified client content.

   Fabricated testimonials and case-study results are illegal in the
   UK (CPUTR 2008 / DMCCA 2024, enforced by the CMA and ASA) and in
   the US (FTC Act §5). They will not be invented here.

   Replace with real, permissioned quotes and real project data,
   then set the two flags below to true.
   ============================================================ */

export const TESTIMONIALS_VERIFIED = false;
export const PORTFOLIO_VERIFIED = false;

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "[PLACEHOLDER — replace with a real, written-permission client quote. Do not publish this text.]",
    name: "[Client name]",
    role: "[Role]",
    company: "[Company]",
  },
  {
    id: "t2",
    quote:
      "[PLACEHOLDER — replace with a real, written-permission client quote. Do not publish this text.]",
    name: "[Client name]",
    role: "[Role]",
    company: "[Company]",
  },
  {
    id: "t3",
    quote:
      "[PLACEHOLDER — replace with a real, written-permission client quote. Do not publish this text.]",
    name: "[Client name]",
    role: "[Role]",
    company: "[Company]",
  },
  {
    id: "t4",
    quote:
      "[PLACEHOLDER — replace with a real, written-permission client quote. Do not publish this text.]",
    name: "[Client name]",
    role: "[Role]",
    company: "[Company]",
  },
];

export type Project = {
  id: string;
  title: string;
  sector: string;
  year: string;
  scope: string[];
  metric: string;
  metricLabel: string;
};

export const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "[Project name]",
    sector: "[Sector]",
    year: "[Year]",
    scope: ["Web design", "Build"],
    metric: "[--]",
    metricLabel: "[Replace with a measured result]",
  },
  {
    id: "p2",
    title: "[Project name]",
    sector: "[Sector]",
    year: "[Year]",
    scope: ["Web design", "SEO"],
    metric: "[--]",
    metricLabel: "[Replace with a measured result]",
  },
  {
    id: "p3",
    title: "[Project name]",
    sector: "[Sector]",
    year: "[Year]",
    scope: ["Build", "Email"],
    metric: "[--]",
    metricLabel: "[Replace with a measured result]",
  },
  {
    id: "p4",
    title: "[Project name]",
    sector: "[Sector]",
    year: "[Year]",
    scope: ["Web design", "SMS"],
    metric: "[--]",
    metricLabel: "[Replace with a measured result]",
  },
];

/* ============================================================
   FAQ — safe, non-factual copy.
   ============================================================ */

export const faqs = [
  {
    q: "How long does a website take?",
    a: "Essential builds run about three weeks. Signature is typically five to six. Flagship depends on scope, but we will give you a fixed date before you commit — and we hit it.",
  },
  {
    q: "Do I own the site?",
    a: "Entirely. Code, design files, domain and every account are yours, transferred on final payment. We do not hold clients hostage with proprietary platforms.",
  },
  {
    q: "Can I edit it myself?",
    a: "On Signature and Flagship, yes — we build on a headless CMS and train you on it. Essential includes an hour of edits a month on a Care plan if you would rather we handled it.",
  },
  {
    q: "Do I need a monthly plan?",
    a: "No. The build stands alone. Most clients take one because search, email and SMS are where the compounding happens, but it is never a condition of working together.",
  },
  {
    q: "What do you need from me?",
    a: "Brand assets if you have them, access to your existing accounts, and roughly two hours across the project for a kickoff call and two review sessions. We handle the rest.",
  },
];
