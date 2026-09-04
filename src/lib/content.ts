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

/**
 * TRADEMARK SYMBOL — READ BEFORE CHANGING
 *
 * "™" may be used freely on ANY mark, registered or not.
 * "®" may ONLY be used on a mark that is actually registered. Using it
 * otherwise is a criminal offence in the UK (Trade Marks Act 1994, s.95) and
 * actionable as false advertising in the US (Lanham Act §43(a)).
 *
 * Set this to "®" ONLY once "Black Line Agency" is registered with the UK IPO
 * and you have the registration number. Until then it stays "™".
 */
export const BRAND_MARK: "™" | "®" = "™";
export const TRADEMARK_REGISTERED = false;

export const site = {
  name: "Black Line Agency",
  // Wordmark is set as two words on the business card: BLACK LINE / AGENCY.
  wordmarkPrimary: "BLACK LINE",
  wordmarkSecondary: "AGENCY",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blacklineagency.co.uk",
  tagline: "Design that trades on presence.",
  description:
    "Black Line Agency designs and builds high-performance websites, then runs the marketing, search, email and SMS that keep them earning — plus the hosting and maintenance behind them. Founder-led, monochrome by conviction.",
  // Confirmed from the business card supplied by the client.
  email: "contact@BlackLineAgency.co.uk",
  phone: "07935364845",
  phoneHref: "tel:+447935364845",
  locale: "en_GB",
  currency: "GBP",
  currencySymbol: "£",
} as const;

/**
 * Primary navigation.
 *
 * Every category resolves to a real route rather than a homepage fragment.
 * A page can be linked, shared, landed on from search and given its own
 * title and description; an anchor cannot. The homepage still carries the
 * same sections as a scroll narrative.
 */
export const nav = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Studio", href: "/studio" },
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
    id: "uiux",
    index: "02",
    title: "UI & UX Design",
    summary:
      "Interface and experience design — the part that decides whether a visitor acts or leaves.",
    detail:
      "Most sites do not lose people because they are ugly. They lose them because the path is unclear, the form asks too much, or the page never says what happens next. We design the journey before the pixels: what a visitor sees first, what they need to believe, where the friction sits, and which screen carries the decision. Then we prototype it and test it on real devices rather than arguing about it in a document.",
    capabilities: [
      "User journeys & information architecture",
      "Wireframing & interactive prototypes",
      "Interface design systems and components",
      "Conversion-focused layout & hierarchy",
      "Usability review on real devices",
      "Accessibility built in, not bolted on",
    ],
  },
  {
    id: "seo",
    index: "03",
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
    index: "04",
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
    index: "05",
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
    index: "06",
    title: "Hosting, Care & Optimisation",
    summary:
      "Managed hosting and the behind-the-scenes work that stops a good site quietly decaying.",
    detail:
      "A site is not finished when it launches. We host it, monitor Core Web Vitals, patch dependencies, keep backups tested, watch uptime and run conversion experiments against real analytics. It is the least glamorous thing we sell and usually the highest returning — and it means you have one number to call when something breaks.",
    capabilities: [
      "Managed hosting & SSL",
      "Uptime & performance monitoring",
      "Security patching & tested backups",
      "Core Web Vitals monitoring",
      "Conversion rate optimisation",
      "A/B testing & analytics",
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
  /** Scope marker set in mono beside the tier name — the "how big" at a glance. */
  meta: string;
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
    meta: "Up to 5 pages",
    summary:
      "A sharp, fast marketing site for a business that needs to look established.",
    includes: [
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
    meta: "Up to 12 pages",
    summary:
      "Our most-specified build. Motion, CMS and the depth to carry a real brand.",
    includes: [
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
    meta: "Unlimited scope",
    summary:
      "For e-commerce, booking systems and brands where the site is the business.",
    includes: [
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
    meta: "Hosting & upkeep",
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
    meta: "Search led",
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
    meta: "Full channel",
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

/**
 * Whether the testimonial carousel renders at all.
 *
 * True when the quotes are real, OR when this is a non-indexable preview —
 * which lets the client review the carousel with the temporary samples while
 * making it impossible for those samples to reach a public, indexed build.
 */
export const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";
export const SHOW_TESTIMONIALS = TESTIMONIALS_VERIFIED || !SITE_INDEXABLE;

/**
 * Founders — confirmed by the client.
 */
export const founders = [
  { name: "Bradley Hoxha", role: "Co-founder" },
  { name: "Shaun Padley", role: "Co-founder" },
] as const;

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
};

/**
 * ⚠️  TEMPORARY SAMPLE TESTIMONIALS — NOT REAL. DO NOT PUBLISH.
 *
 * Added at the client's explicit request so the carousel design can be
 * reviewed while the site is still a private preview. Every person, company
 * and claim below is INVENTED.
 *
 * These are safe only because:
 *   1. The site is not public and carries `Disallow: /` (robots.ts).
 *   2. `TESTIMONIALS_VERIFIED` is false, so `pnpm verify` HARD-FAILS the
 *      build if anyone sets NEXT_PUBLIC_SITE_INDEXABLE=true with these
 *      still in place.
 *
 * Publishing invented testimonials is illegal in the UK (CPUTR 2008 /
 * DMCCA 2024, enforced by the CMA and ASA) and the US (FTC Act §5).
 * Replace every entry with a real, written-permission quote, then set
 * TESTIMONIALS_VERIFIED = true.
 */
export const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "They rebuilt our site in five weeks and the enquiry volume changed almost immediately. What struck me was that we spoke to the people actually doing the work every single time.",
    name: "Sample Name",
    role: "Managing Director",
    company: "Sample Client Ltd",
  },
  {
    id: "t2",
    quote:
      "We had been quoted three times what they charged, for less. They were direct about what we did and did not need, which is rarer than it should be.",
    name: "Sample Name",
    role: "Founder",
    company: "Sample Client Ltd",
  },
  {
    id: "t3",
    quote:
      "The site is quick, it looks like nobody else's, and the monthly reporting actually tells us something. They handle the hosting so we never think about it.",
    name: "Sample Name",
    role: "Operations Lead",
    company: "Sample Client Ltd",
  },
  {
    id: "t4",
    quote:
      "The email and SMS work paid for itself inside two months. They set it up, they run it, and they tell us plainly when something is not working.",
    name: "Sample Name",
    role: "Marketing Manager",
    company: "Sample Client Ltd",
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
    meta: "Timeline",
    a: "Essential builds run about three weeks. Signature is typically five to six. Flagship depends on scope, but we will give you a fixed date before you commit — and we hit it.",
  },
  {
    q: "Do I own the site?",
    meta: "Ownership",
    a: "Entirely. Code, design files, domain and every account are yours, transferred on final payment. We do not hold clients hostage with proprietary platforms.",
  },
  {
    q: "Can I edit it myself?",
    meta: "Handover",
    a: "On Signature and Flagship, yes — we build on a headless CMS and train you on it. Essential includes an hour of edits a month on a Care plan if you would rather we handled it.",
  },
  {
    q: "Do I need a monthly plan?",
    meta: "Retainers",
    a: "No. The build stands alone. Most clients take one because search, email and SMS are where the compounding happens, but it is never a condition of working together.",
  },
  {
    q: "What do you need from me?",
    meta: "Process",
    a: "Brand assets if you have them, access to your existing accounts, and roughly two hours across the project for a kickoff call and two review sessions. We handle the rest.",
  },
];
