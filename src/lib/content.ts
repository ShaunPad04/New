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
  /**
   * Solid logotype form, as the client set it (2026-09-04) and as the domain
   * and email already use it: blacklineagency.co.uk, contact@BlackLineAgency.
   *
   * Kept SEPARATE from `name`. This is the drawn form of the mark, used once,
   * in the hero. Everything a machine or a lawyer reads — page titles, meta
   * descriptions, the ProfessionalService JSON-LD, the copyright line — keeps
   * the spaced `name` that appears on the business card, because that is the
   * business's actual name and structured data should not disagree with it.
   */
  logotype: "BlackLineAgency",
  /** The one line of copy in the hero, at the client's direction. */
  heroLine:
    "We partner with brands to create digital design that drives conversion and commands attention.",
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
   LOGO STRIP — the row below the hero.

   ⚠️  CONTENT INTEGRITY. A logo row directly under a hero reads as
   "these are our clients". It must never carry a mark we are not
   entitled to imply a relationship with.

   `LOGO_CLIENTS_VERIFIED` gates any row presented as clients. While
   it is false the strip shows the STACK WE BUILD ON, labelled as
   such, which is a true statement about our own work and does not
   assert anyone's endorsement.

   Entries render as type by default. Give one a `src` and it renders
   as an image instead, so real client logos drop in with no code
   change.
   ============================================================ */

export type LogoItem = {
  name: string;
  /** Key into LOGO_MARKS — an inlined single-colour glyph. */
  mark?: string;
  /** Optional self-hosted image, for a real client logo. */
  src?: string;
  width?: number;
  height?: number;
};

/** No client logo has been supplied or cleared for use. */
export const LOGO_CLIENTS_VERIFIED = false;

/**
 * True of our own work, verifiable, and asserts nothing about anyone else.
 * Nominative use — naming a tool we build with is not a claim of endorsement,
 * which is exactly why the strip is labelled "the stack we build on".
 */
export const stackLogos: LogoItem[] = [
  { name: "Next.js", mark: "nextdotjs" },
  { name: "React", mark: "react" },
  { name: "TypeScript", mark: "typescript" },
  { name: "Tailwind CSS", mark: "tailwindcss" },
  { name: "Node.js", mark: "nodedotjs" },
  { name: "Vercel", mark: "vercel" },
  { name: "GitHub", mark: "github" },
  { name: "Figma", mark: "figma" },
  { name: "Notion", mark: "notion" },
  { name: "Claude", mark: "claude" },
  { name: "NVIDIA", mark: "nvidia" },
  { name: "GSAP", mark: "greensock" },
  { name: "Shopify", mark: "shopify" },
  { name: "Google Analytics", mark: "googleanalytics" },
];

/**
 * Disciplines listed in the hero — the concise top-level summary of what the
 * studio sells, set by the client (2026-09-04).
 *
 * These now reconcile with /services: the earlier set named "Brand Identity"
 * and "Product Design", neither of which appears there, so the hero and the
 * Services page told a prospect two different stories. Every word here maps
 * onto a real service. The fuller list — email, SMS, hosting, care and
 * optimisation — stays on /services and the lower homepage sections.
 *
 * Four, deliberately. A hero summary stops being a summary at five.
 */
export const heroDisciplines = [
  "Web Design",
  "UI / UX",
  "Development",
  "SEO & Growth",
] as const;

/* ============================================================
   SOCIAL PROFILES

   Icons render now so the footer can be designed; `href` is empty
   until the real profile URLs are supplied. An entry with no href
   is NOT rendered as a link — a link to nowhere is worse than no
   link — it renders as the mark alone and becomes a real anchor the
   moment a URL lands.
   ============================================================ */

export type Social = { name: string; mark: string; href: string };

export const socials: Social[] = [
  { name: "Instagram", mark: "instagram", href: "" },
  { name: "X", mark: "x", href: "" },
  { name: "TikTok", mark: "tiktok", href: "" },
  { name: "Behance", mark: "behance", href: "" },
];

/** Populate only with logos the client has written permission to display. */
export const clientLogos: LogoItem[] = [];

/**
 * Heading for the strip, at the client's request.
 *
 * "Trusted by experts. Used by the leaders." is an OBJECTIVE CLAIM about the
 * business, not puffery, and the business currently has no clients. Publishing
 * it would be a misleading commercial practice under the CPUTR 2008 / DMCCA
 * 2024 (CMA and ASA enforced) and unsubstantiated under the CAP Code.
 *
 * So it is gated exactly like the sample testimonials: it renders on a private
 * non-indexable preview so the design can be reviewed, and `pnpm verify` hard
 * fails if anyone sets NEXT_PUBLIC_SITE_INDEXABLE=true while
 * LOGO_CLIENTS_VERIFIED is still false.
 */
export const TRUST_CLAIM = {
  quiet: "Trusted by experts.",
  loud: "Used by the leaders.",
} as const;

/** Defined next to SHOW_TESTIMONIALS, below — SITE_INDEXABLE is declared there. */

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
    title: "GEO / SEO & Search",
    summary:
      "Found on Google, and cited by the AI engines that increasingly answer before Google does.",
    detail:
      "Most agencies sell SEO as a monthly report. We treat it as engineering: crawlability, structured data, internal linking and page speed first, because no amount of content fixes a site Google struggles to render. Then content and authority, measured against revenue rather than vanity rankings. GEO — generative engine optimisation — is that same discipline pointed at the answer engines. ChatGPT, Google’s AI Overviews, Perplexity and Copilot increasingly answer the question before anyone reaches a results page, and they quote the sources they can parse and trust. We structure your pages so a model can lift a clean, attributable answer out of them, and we check which engines are actually naming you.",
    capabilities: [
      "Technical audits & fixes",
      "Keyword, intent & prompt mapping",
      "On-page & structured data",
      "Answer-ready content a model can cite",
      "AI citation & visibility checks",
      "Local SEO and Google Business Profile",
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

   Repriced repeatedly on 2026-09-07, every time on the client's
   instruction. The build band went £1.5k–£6k, then £1.5k–£12k, then
   £999–£3,000, then £999–£4,999, and now sits at £1,250–£4,999.
   The 2026-09-09 move lifted the two lower tiers only — Essential
   £999 -> £1,250 and Signature £1,999 -> £2,500 — on the client's
   instruction; Flagship was explicitly left where it was.

   The monthly retainers changed at the same time, and these are the
   figures WE recommended rather than ones handed to us: Care £99,
   Growth £450, Scale £950. They were set against UK SME market rate
   for the work each tier actually contains, and against the studio's
   stated near-term target — local businesses first, London brands
   later. Care is deliberately low enough that a small shop says yes
   without a meeting; Growth is where the margin is and is the tier
   the page recommends.

   Our position on the build ceiling is recorded because it still
   stands as analysis: the studio hand-writes Next.js, ships a
   scroll-driven hero, a bespoke design system and six routes, and
   holds accessibility 100 / CLS 0 behind an automated gate. UK
   studios producing that typically quote £12k–£25k, and price is
   read as a positioning signal before it is read as a fee. The
   client has chosen a lower band anyway, which is a coherent
   strategy for winning the first few clients. It is his call and his
   business; the numbers below are what he asked for.

   Confirm every number before this site is indexed.
   ============================================================ */

export const PRICING_CONFIRMED = false;

export type Tier = {
  id: string;
  name: string;
  price: number;
  cadence: "project" | "month";
  /**
   * Optional scope marker set in mono beside the tier name.
   *
   * The build tiers carried page counts ("Up to 5 pages") until the client
   * removed them 2026-09-07: a page count is the wrong unit for work priced
   * on scope, and it invites a negotiation about counting pages rather than
   * about what the site has to do. Flagship keeps "Unlimited scope" because
   * that is a statement about scope, not a tally.
   */
  meta?: string;
  summary: string;
  includes: string[];
  featured?: boolean;
};

export const projectTiers: Tier[] = [
  {
    id: "essential",
    name: "Essential",
    price: 1250,
    cadence: "project",
    summary:
      "A sharp, fast marketing site for a business that needs to look established.",
    includes: [
      "Custom design, no templates",
      "Mobile-first responsive build",
      "Contact form & enquiry routing",
      "Foundational SEO setup",
      "Analytics & Search Console",
      "Two rounds of revisions",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    price: 2500,
    cadence: "project",
    summary:
      "Our most-specified build. Motion, CMS and the depth to carry a real brand.",
    includes: [
      "Bespoke art direction",
      "Scroll & interaction design",
      "Headless CMS — edit it yourself",
      "Copywriting support",
      "Advanced technical SEO",
      "GEO — built to be cited by AI engines",
      "Email capture & CRM integration",
      "Three rounds of revisions",
      /* The setup fee is what is included, not the running cost. The chatbot's
         £79/month continues unless the client is on Growth or Scale, and a
         line reading "includes AI chatbot" without that distinction is the
         kind of thing a buyer reasonably reads as "included forever". The
         add-on band below states both halves. */
      "Includes AI Text Chatbot setup",
    ],
    featured: true,
  },
  {
    id: "flagship",
    name: "Flagship",
    price: 7500,
    cadence: "project",
    meta: "Enterprise scope",
    summary:
      "Full system build for e-commerce, complex booking systems and high-scale operations.",
    includes: [
      "E-commerce or custom booking build",
      "Full motion design system",
      "Bespoke third-party API & CRM integrations",
      "Data migration assistance",
      "Performance budget guarantee",
      "Structured data & rich results",
      "Full GEO build & citation tracking",
      "Launch strategy & team training",
      "Priority delivery",
      "Includes AI Text Chatbot setup",
    ],
  },
];

export const retainerTiers: Tier[] = [
  {
    id: "care",
    name: "Care",
    price: 99,
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
    price: 450,
    cadence: "month",
    meta: "Search led",
    summary:
      "Everything in Care, plus active search management and AI chat.",
    includes: [
      "Everything in Care",
      "Google SEO & GEO management",
      "Keyword, content & prompt roadmap",
      "Two content pieces monthly",
      "Local SEO, GEO & business profile",
      "Conversion tracking",
      "Monthly performance report",
      "AI Text Chat Assistant — hosting & updates in the monthly fee",
    ],
    featured: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 950,
    cadence: "month",
    meta: "Full channel",
    summary:
      "Full-channel management across search, email, SMS and voice.",
    includes: [
      "Everything in Growth",
      "Email marketing management",
      "SMS campaign management",
      "Conversion rate optimisation & A/B testing",
      "Four content pieces monthly",
      "Quarterly strategy session",
      "Priority support",
      "AI Voice Receptionist setup waived — 12-month commitment",
    ],
  },
];

/* ============================================================
   AI SYSTEMS — standalone add-ons.

   Added 2026-09-11 on the client's instruction, with his figures.

   These are priced in TWO parts and the distinction is the whole point of
   giving them their own band rather than another bullet in a tier: a setup fee
   that varies by what the client is buying alongside it, and a monthly fee
   that keeps running afterwards. A tier bullet can carry one of those; it
   cannot carry both without misleading somebody about the second.

   The Voice Receptionist carried "Powered by Retell AI" until the client
   removed it (2026-09-11). It was lawful as nominative use, so this is a
   positioning choice rather than a correction: naming the platform tells a
   buyer the capability is bought in rather than built, and it ties the
   studio's offer to a supplier it may want to change. The optional
   `subtitle` field went with it — it had no other use, and a field that
   nothing sets is the kind of thing that gets filled in later by accident.
   ============================================================ */

export type AiSystem = {
  id: string;
  title: string;
  summary: string;
  /** Each row is a priced component: what it is, the figure, and the caveat. */
  lines: { label: string; value: string; detail?: string }[];
};

export const aiSystems: AiSystem[] = [
  {
    id: "ai-chat",
    title: "AI Text Chatbot",
    summary:
      "An intelligent, lead-capturing assistant trained specifically on your business data.",
    lines: [
      {
        label: "Standalone setup",
        value: "£495 one-time",
        detail: "£300 on an Essential build. Free on Signature and Flagship.",
      },
      {
        label: "Monthly",
        value: "£79/month",
        detail:
          "Host infrastructure, query tokens and updates. Bundled into the Growth and Scale monthly plans.",
      },
    ],
  },
  {
    id: "ai-voice",
    title: "AI Voice Receptionist",
    summary:
      "A custom-trained voice AI that answers your phones, routes calls and books appointments, 24/7.",
    lines: [
      {
        label: "Setup",
        value: "£950 one-time",
        detail: "Waived with a 12-month commitment to the Scale plan.",
      },
      { label: "Monthly", value: "£199/month" },
      {
        label: "Usage",
        value: "300 minutes included",
        detail:
          "Roughly 200 calls a month. Additional time is billed at £0.40 per minute.",
      },
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

/** Same gate as the testimonials: preview only until the claim is true. */
export const SHOW_TRUST_CLAIM = LOGO_CLIENTS_VERIFIED || !SITE_INDEXABLE;

/* ============================================================
   RESULTS — performance and conversion figures
   ============================================================ */

/**
 * Whether the client-outcome figures are real, permissioned project data.
 *
 * They are NOT. See PLACEHOLDER_OUTCOMES below.
 */
export const RESULTS_VERIFIED = false;

/** Same gate as the testimonials: preview only until the numbers are real. */
export const SHOW_RESULTS = RESULTS_VERIFIED || !SITE_INDEXABLE;

export type Outcome = {
  id: string;
  /** The headline figure, already formatted — these are not arithmetic. */
  value: string;
  label: string;
  /** The baseline it moved from, or the window it was measured over. */
  detail: string;
};

/**
 * ⚠️  CLIENT-ASSERTED OUTCOME FIGURES — STILL GATED.
 *
 * History, because it matters to whoever reads this next. These four numbers
 * were INVENTED by us on 2026-09-06, at the client's request, so the results
 * section could be designed while the site was a private preview. Each one
 * therefore carried a visible "sample figure" caveat.
 *
 * On 2026-09-07 the client asked for those caveats to be removed, saying the
 * figures are true, and set the performance score to 100. The labels are
 * gone and the value is changed as instructed. What has NOT changed is that
 * nobody has yet produced the measurement behind any of them — no tool, no
 * window, no project named — so from this file's point of view they remain
 * unsubstantiated, and the gate below stays shut.
 *
 * That gate is the whole safety net now. A fabricated performance or
 * conversion figure is the single most dangerous claim an agency site can
 * carry — more so than an invented testimonial, because a number reads as
 * measured rather than as an opinion. In the UK it is a misleading commercial
 * practice under the CPUTR 2008 / DMCCA 2024 (CMA and ASA enforced); in the
 * US it is an unsubstantiated advertising claim under the FTC Act §5 and the
 * FTC's Endorsement Guides. The removal of a visible caveat does not change
 * any of that — it only removes the reader's warning, which is precisely why
 * the machine gate must not be weakened to match.
 *
 * So these stay safe only because:
 *   1. The site is not public and carries `Disallow: /` (robots.ts).
 *   2. `RESULTS_VERIFIED` is false, so `pnpm verify` HARD-FAILS the build if
 *      anyone sets NEXT_PUBLIC_SITE_INDEXABLE=true with these in place.
 *
 * To publish: for each entry, record the figure from a named tool (Google
 * Analytics, Search Console, CrUX, Lighthouse) over a stated window, on a
 * named project, with that client's written agreement to quote it. Then set
 * RESULTS_VERIFIED = true. Until that exists, do not flip the flag.
 */
export const PLACEHOLDER_OUTCOMES: Outcome[] = [
  {
    id: "load",
    value: "0.8s",
    label: "Load time",
    detail: "Down from 4.2s",
  },
  {
    id: "lighthouse",
    value: "100",
    label: "Performance score",
    detail: "Up from 48",
  },
  {
    id: "enquiries",
    value: "+142%",
    label: "Enquiries",
    detail: "First 90 days",
  },
  {
    id: "bounce",
    value: "−34%",
    label: "Mobile bounce rate",
    detail: "First 90 days",
  },
];

/**
 * GEO — the AI-visibility band.
 *
 * ⚠️  SAME GATE AS THE OUTCOMES ABOVE. `RESULTS_VERIFIED` is false, so this
 * cannot reach an indexable build.
 *
 * The copy about AI answer engines is ours and is accurate. The SCORES are
 * not measured, and they carry a caveat the other samples do not: **there is
 * no industry-standard GEO score.** Lighthouse is a real instrument anyone can
 * re-run and get the same figure from; a GEO score is not. So printing one
 * means citing our own audit, and that audit has to exist as a written, dated,
 * repeatable method before these numbers can go public — otherwise it is an
 * unsubstantiated claim wearing the clothes of a measurement. `detail` names
 * the instrument on the page ("Black Line GEO audit") so the provenance is not
 * implied to be somebody else's.
 *
 * The method it has to be: a fixed set of buying-intent prompts per sector,
 * run across the named engines, scored on citation frequency and accuracy plus
 * the on-page factors behind it.
 *
 * The "after" figure was 89 and was raised to 100 on the client's instruction
 * (2026-09-08). Worth knowing if it is ever revisited: 100 is a different kind
 * of claim from 89. A high-but-imperfect number reads as something that was
 * measured; a perfect one reads as a marketing round-up and invites the
 * question "measured how, by whom, against what". It also leaves no headroom —
 * there is nowhere to improve a client to. The client was told and chose 100;
 * it is his business and his call, and the gate below is what actually keeps
 * it honest until the audit method exists.
 */
export const geoOutcome = {
  before: "41",
  beforeLabel: "Typical score we inherit",
  after: "100",
  afterLabel: "After a GEO build",
  detail: "Black Line GEO audit",
} as const;

export type Standard = {
  id: string;
  value: string;
  label: string;
  detail: string;
};

/**
 * Real, and deliberately kept separate from the samples above.
 *
 * Every figure here is measured on THIS page and can be reproduced by anyone
 * who opens DevTools, which is why it needs no verification flag and survives
 * to a public build. It is also the better proof: a web studio quoting its own
 * audited build is more persuasive than a studio quoting a number nobody can
 * check.
 *
 * Each one is defended by the test suite rather than by good intentions —
 * `pnpm verify` runs axe at three viewports and Lighthouse three times, so
 * none of these can regress silently. Re-measure before changing them.
 */
/**
 * OUR OWN BUILD STANDARDS — real, measured, and deliberately ungated.
 *
 * Everything above this point is a claim about a client's results and sits
 * behind RESULTS_VERIFIED. These are claims about THIS page, which anyone can
 * check in thirty seconds, so they need no flag and they survive to
 * production. That is also why they have to be exactly right.
 *
 * Source: PageSpeed Insights, Lighthouse 13.4.1, run against the branch alias
 * on 2026-09-07. Desktop figures, and the detail line on each says so.
 *
 * WHY DESKTOP AND NOT MOBILE. Mobile PageSpeed on this page is bimodal — six
 * runs on one unchanged commit returned 94, 92 and 70, with LCP between 3.0s
 * and 7.9s, while desktop held 97-99 throughout. There is no honest single
 * mobile number to print, so none is printed. Naming the form factor is what
 * keeps this accurate rather than flattering; do not quietly drop it, and do
 * not average the mobile runs into something that looks tidier.
 *
 * Accessibility is the exception: it scores 100 on desktop AND mobile in
 * every run, so its detail line says so.
 *
 * Four figures, not five. Best practices (also 100 on both) was cut because
 * five wrapped to a row of four and an orphan, and an orphan in a spec strip
 * reads as an oversight rather than as a fifth credential. It is stated in the
 * panel copy instead, next to WCAG 2.2 AA — which belongs in prose anyway,
 * being a standard we hold to rather than a score.
 *
 * Re-measure before changing any of these, and update CLAUDE.md at the same
 * time. If a figure here ever disagrees with what a prospect's own run
 * returns, that is the most expensive kind of error this site can make.
 */
export const buildStandards: Outcome[] = [
  {
    id: "perf",
    value: "99",
    label: "Performance",
    detail: "PageSpeed, desktop",
  },
  {
    id: "a11y",
    value: "100",
    label: "Accessibility",
    detail: "PageSpeed, desktop & mobile",
  },
  {
    id: "lcp",
    value: "0.8s",
    label: "Largest paint",
    detail: "Core Web Vitals, desktop",
  },
  {
    id: "cls",
    value: "0",
    label: "Layout shift",
    detail: "Cumulative Layout Shift",
  },
];

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
  /**
   * What the quote is about, in two or three words. It labels the quote in
   * the selector beside the featured card — without it every row reads as the
   * same person, since attribution alone is "name, role, company".
   */
  topic: string;
  /**
   * A verbatim substring of `quote` to set in white against the grey body, so
   * the eye lands on the sentence that actually matters rather than reading
   * thirty words to find it. From the reference the client supplied
   * (2026-09-11).
   *
   * It must appear in `quote` EXACTLY once. The component matches on the
   * literal string and renders the quote unchanged if it does not find it, so
   * a typo degrades to an unhighlighted quote rather than to a broken or
   * silently truncated one.
   */
  highlight?: string;
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
    topic: "Design & build",
    highlight: "we spoke to the people actually doing the work",
  },
  {
    id: "t2",
    quote:
      "We had been quoted three times what they charged, for less. They were direct about what we did and did not need, which is rarer than it should be.",
    name: "Sample Name",
    role: "Founder",
    company: "Sample Client Ltd",
    topic: "Scope & pricing",
    highlight: "direct about what we did and did not need",
  },
  {
    id: "t3",
    quote:
      "The site is quick, it looks like nobody else's, and the monthly reporting actually tells us something. They handle the hosting so we never think about it.",
    name: "Sample Name",
    role: "Operations Lead",
    company: "Sample Client Ltd",
    topic: "Hosting & reporting",
    highlight: "the monthly reporting actually tells us something",
  },
  {
    id: "t4",
    quote:
      "The email and SMS work paid for itself inside two months. They set it up, they run it, and they tell us plainly when something is not working.",
    name: "Sample Name",
    role: "Marketing Manager",
    company: "Sample Client Ltd",
    topic: "Email & SMS",
    highlight: "paid for itself inside two months",
  },
];

export type Project = {
  id: string;
  title: string;
  sector: string;
  year: string;
  scope: string[];
  /** Optional: omitted rather than invented when no figure has been agreed. */
  metric?: string;
  metricLabel?: string;
  /** Optional live or preview link. */
  href?: string;
  /** Where the project stands. Rendered as a badge on the card. */
  status?: string;
  /** Slug of a written case study under /portfolio, when one exists. */
  caseStudy?: string;
};

/**
 * Real, client-approved work. Brad confirmed B Boutique may be shown
 * (2026-09-04).
 *
 * No metric is listed because none has been agreed — an invented conversion
 * figure is exactly the kind of fabricated claim the rest of this file exists
 * to prevent. Add `metric` once there is a number the client will stand behind.
 */
export const projects: Project[] = [
  {
    id: "b-boutique",
    title: "B Boutique",
    sector: "Boutique retail — Cleethorpes",
    year: "2026",
    scope: ["Web design", "Next.js build", "E-commerce", "Local SEO & GEO"],
    status: "In build",
    caseStudy: "b-boutique",
    /**
     * The project's STABLE BRANCH ALIAS, not its production alias and not a
     * deployment URL.
     *
     * Three URLs exist for this project and only one of them is correct here:
     *
     *   blacklineagencypreview.vercel.app
     *     the production alias — STALE. Every deployment on that project has
     *     `target: null`, i.e. nothing has ever been promoted to production,
     *     so this serves an old build. This is what the client was seeing.
     *   ...-ql5txz7z9-...
     *     a single deployment. Current today, dead on the next push.
     *   ...-git-client-b-boutique-...
     *     the branch alias. Always the newest commit on `client/b-boutique`,
     *     and it does not rot.
     *
     * Verified rather than assumed: the branch alias and the deployment URL
     * were both fetched and their bodies compared — identical, byte for byte
     * (SHA-256 match over 192,778 characters).
     */
    href: "https://blacklineagencypreview-git-client-b-boutique-black-line-agency.vercel.app/",
  },
  {
    id: "watch-club",
    title: "The Watch Club",
    sector: "Fine & rare watches — Mayfair, London",
    year: "2026",
    scope: ["Web design", "77-page catalogue", "Scroll-driven hero", "Technical SEO & GEO"],
    /**
     * "Concept" is load-bearing, not modesty.
     *
     * This build carries The Watch Club's trading name, their Mayfair
     * address, their telephone number, their catalogue and their
     * photography — and they are not a client. Presented without a label it
     * would assert a commercial relationship that does not exist, which is a
     * misleading commercial practice here (CPUTR 2008 / DMCCA 2024) and false
     * association in the US (Lanham Act §43(a)), on top of using a third
     * party's images and marks. The badge is what keeps this honest spec
     * work rather than an implied engagement, so do not remove it or soften
     * it to "In build" unless they actually engage us — at which point this
     * comment should go too.
     *
     * The site itself agrees: its footer reads "Private concept" and every
     * page returns `noindex, nofollow`.
     */
    status: "Concept",
    /**
     * The project's production alias. Unlike the B Boutique project this one
     * HAS been promoted, so this URL is stable and always serves the current
     * build; there is no branch-alias-versus-production trap here.
     */
    href: "https://watchclub-daydate.vercel.app/",
  },
];

/* ============================================================
   CASE STUDIES

   Prose about our own work, which is ours to write. The one rule
   that applies: nothing here may assert a RESULT the project has
   not produced. B Boutique has not launched, so there are no
   traffic or conversion figures, and the page says so rather than
   filling the gap.
   ============================================================ */

export type CaseStudy = {
  slug: string;
  /** Matches a `Project.id`, so the card and the study cannot drift apart. */
  projectId: string;
  title: string;
  lede: string;
  facts: { label: string; value: string }[];
  brief: string[];
  approach: { title: string; body: string }[];
  /** Real findings from the build. Each is a specific, checkable thing. */
  changed: { title: string; body: string }[];
  standards: string[];
  /** Stated plainly, because the alternative is implying results we have none of. */
  outcomeNote: string;
  /**
   * Why the live preview carries visible "provisional" markers. Without this a
   * prospect who clicks through reads them as sloppiness rather than as the
   * discipline they are.
   */
  previewNote: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "b-boutique",
    projectId: "b-boutique",
    title: "B Boutique",
    lede: "An independent boutique on Sea View Street, Cleethorpes. Womenswear, accessories and homeware, bought a few pieces at a time — and a site built to read like the shop rather than like a template.",
    facts: [
      { label: "Sector", value: "Independent retail" },
      { label: "Location", value: "Cleethorpes, Lincolnshire" },
      { label: "Year", value: "2026" },
      { label: "Status", value: "In build" },
      { label: "Scope", value: "Design, build, e-commerce, local SEO & GEO" },
      { label: "Stack", value: "Next.js, TypeScript, SumUp" },
    ],
    brief: [
      "B Boutique buys the way a small shop should: a few pieces at a time, chosen by hand, most of them the only one on the rail. The stock changes weekly and almost nothing is repeated. That is the whole proposition — you will not meet your coat coming the other way down the high street — and it is exactly the thing a template cannot carry.",
      "The brief was a site that reads like the shop. It had to look considered rather than merchandised, survive stock that turns over every week, and work for the customer deciding whether it is worth the drive from Grimsby.",
    ],
    approach: [
      {
        title: "A flat, editorial system",
        body: "Bodoni Moda for the display voice, Inter for the prose, and nothing else. No rounded corners, no drop shadows, no pill buttons, no gradient anywhere — the restraint is what reads as expensive. Every colour decision was checked for contrast against the ground it actually sits on rather than against a global default.",
      },
      {
        title: "One shoot, not a stock library",
        body: "Every photograph was directed to a single brief: garment still lifes on black marble and polished brass under warm window light from the left, category panels as studio shots on a muted seamless. Twenty-eight images that read as one day's shooting. A boutique whose photography looks bought is a boutique nobody believes.",
      },
      {
        title: "Structure the shop actually needs",
        body: "Nine clothing categories, each with its own page and its own stock. A twenty-six piece shop with a page per item and a SumUp checkout. A real search over the catalogue — one that will not return a black coat for the query \"black\" unless somebody has confirmed the coat is black.",
      },
      {
        title: "Findable by Google and by AI",
        body: "ClothingStore structured data carrying the address, the opening hours and the phone number, so a machine reading the page knows where the shop is and when it is open. That is what puts an independent shop into a local result and into an AI answer, rather than leaving it to a directory listing somebody else controls.",
      },
    ],
    changed: [
      {
        title: "A header that promised five pages and delivered one",
        body: "CLOTHING and ACCESSORIES both landed on a section of the home page — a link saying one thing and doing another. There are now real routes behind every item in the header, the menu and the footer, and every href resolves.",
      },
      {
        title: "Four categories with nothing behind them",
        body: "Of the nine clothing categories, four had no products at all: a label on an empty shelf, which reads as a broken shop rather than as a small range. Every category now lists actual stock.",
      },
      {
        title: "A wordmark that was dead on four routes out of five",
        body: "It was set to `#top` — a bare fragment, meaning a section of whatever page you happen to be on, and #top only exists on the home page. So the one control everybody reaches for to get back to the start did nothing at all on four pages. Now it goes home from anywhere.",
      },
      {
        title: "Images sent up to 56% larger than the slot they filled",
        body: "Measured against the rendered layout rather than trusted: the category card is 19.2vw wide at 1440px against a declared 30vw, and the homeware figures were over by a quarter and a third. Correcting them saves 53 KB on every desktop load, deterministically, with no visible change to the photography.",
      },
    ],
    standards: [
      "axe across nine routes at three viewport widths — 54 checks, zero violations",
      "Every price, policy and testimonial not yet confirmed by the shop is flagged in the code and marked as provisional on the page",
      "Hand-written Next.js and TypeScript, no page builder",
      "Structured data validated against the shop's confirmed address, hours and phone",
    ],
    outcomeNote:
      "The site has not launched yet, so there are no traffic or conversion figures to report — and we would rather say that than publish numbers nobody has measured. When it goes live, the figures land on this page.",
    previewNote:
      "The build is live as a private preview while we wait on the shop's own stock list, prices and customer reviews. Anything not yet confirmed carries a visible marker until it is — so nothing on the page can be mistaken for the shop's word before the shop has given it.",
  },
];

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
    q: "What does a website actually cost?",
    meta: "Pricing",
    a: "Essential starts at \u00a31,250, Signature at \u00a32,500 and Flagship at \u00a37,500, all excluding VAT. Every build is a fixed price agreed in writing before anything starts \u2014 there is no hourly billing and no invoice at the end that you did not see coming.",
  },
  {
    q: "How long does a website take?",
    meta: "Timeline",
    a: "Essential builds run about three weeks. Signature is typically five to six. Flagship depends on scope, but we will give you a fixed date before you commit \u2014 and we hit it.",
  },
  {
    q: "Do I own the site?",
    meta: "Ownership",
    a: "Entirely. Code, design files, domain and every account are yours, transferred on final payment. We do not hold clients hostage with proprietary platforms.",
  },
  {
    q: "Can I edit it myself, or will you do it?",
    meta: "Edits",
    a: "Either. Signature and Flagship are built on a headless CMS, so the copy and images are yours to change whenever you want. You never have to, though \u2014 every monthly plan includes an hour of edits, so you send us the change and we make it, with that time already covered by the fee rather than billed on top. Essential does not ship with a CMS; on that tier we handle the edits for you.",
  },
  {
    q: "Do I need a monthly plan?",
    meta: "Retainers",
    a: "No. The build stands alone, and the plans run on 30 days\u2019 notice. Care is \u00a399 a month for hosting, updates and small edits; Growth is \u00a3450 and adds search, email and SMS; Scale is \u00a3950. Most clients take one because that is where the compounding happens, but it is never a condition of working together.",
  },
  {
    q: "Who hosts it, and what happens if it breaks?",
    meta: "Hosting",
    a: "We do, on every monthly plan \u2014 hosting, SSL, backups, updates and monitoring are included rather than billed as extras. If something breaks it is our problem to fix, and you are talking to the two people who built it, not a ticket queue.",
  },
  {
    q: "What does the AI chatbot cost to run?",
    meta: "AI systems",
    a: "Two parts, and the second one continues. Setup is \u00a3495 standalone, \u00a3300 on an Essential build, and free with Signature or Flagship. Running it is \u00a379 a month for hosting, query tokens and updates \u2014 already bundled into the Growth and Scale plans. When a tier says it includes chatbot setup, it means the setup, not the monthly.",
  },
  {
    q: "Can the voice receptionist really answer my phone?",
    meta: "AI voice",
    a: "Yes \u2014 it answers, routes calls and books appointments around the clock. Setup is \u00a3950, waived with a 12-month Scale commitment, then \u00a3199 a month including 300 minutes, roughly 200 calls. Beyond that it is \u00a30.40 a minute. We would rather you checked that allowance against your real call volume before committing than found out later.",
  },
  {
    q: "What is GEO, and why is it on your pricing page?",
    meta: "AI search",
    a: "Generative Engine Optimisation \u2014 being the source an AI answer engine cites when someone asks it a buying question, rather than the tenth blue link. It is a different job to classic SEO: clean structure, machine-readable data, and content written to be quoted. Signature builds for it, Flagship adds citation tracking so you can see where you are being named.",
  },
  {
    q: "What do you need from me?",
    meta: "Process",
    a: "Brand assets if you have them, access to your existing accounts, and roughly two hours across the project for a kickoff call and two review sessions. We handle the rest.",
  },
];
