/* ============================================================
   /ai — THE AI AUTOMATION LANDING PAGE (TEST, 2026-10-06, Brad:
   "create AI automation systems for businesses", "a landing page for
   the AI page", reference utomic.framer.website — layout and feel only).

   CONTENT RULES, same as the rest of the site:
   - No invented stats, testimonials or client logos. The dashboard and
     demos are labelled "Example".
   - Three systems have published prices: the two AI systems
     (`aiSystems` in content.ts) and the CRM (`rateCard.sections.crm`,
     shown on /ai since 2026-10-06 so the page agrees with /pricing). Every
     other system is quoted after the free audit. Do not put a figure on
     one until Brad confirms it.
   - The voice receptionist's standard deployment is overflow and out of
     hours, NOT 24/7 (see the long comment on `aiSystems[1]`). Always-on
     answering is a separate quote. Keep that wording here.
   ============================================================ */

/** /ai as the rest of the site links to it: the menu, /services, every
    service page's "Other services", the sitemap and llms.txt. It replaced
    /services/ai (2026-10-06), which now redirects here. */
export const automationPage = {
  href: "/ai",
  label: "AI Automation",
  title: "AI Automation for UK Businesses",
  description:
    "AI receptionists, speed-to-lead, CRMs, review engines and admin automation for busy local businesses. Book a free automation audit.",
  lede: "Systems that answer, follow up and book while you get on with the work: a voice receptionist, a website assistant, speed-to-lead, CRM, reviews and admin automation.",
};

import { faqs } from "@/lib/content";

export type AutomationSystem = {
  id: string;
  name: string;
  /** Where it works, the small label above the name. */
  where: string;
  problem: string;
  does: string;
  result: string;
  /** "live" = published price on /pricing; "audit" = quoted after the audit. */
  status: "live" | "audit";
};

export const automationSystems: AutomationSystem[] = [
  {
    id: "receptionist",
    name: "AI Voice Receptionist",
    where: "Your phone line",
    problem: "Calls ring out after hours and when the team is busy, and most callers never ring back.",
    does: "Picks up when nobody else does, answers questions, takes the enquiry and texts you a summary of every call.",
    result: "Every caller gets an answer, and you see exactly what you would have missed.",
    status: "live",
  },
  {
    id: "speed-to-lead",
    name: "Speed-to-lead",
    where: "Forms, ads & missed calls",
    problem: "Leads go cold while they wait hours for a reply, and the fastest competitor wins the job.",
    does: "Replies to every new enquiry within a minute by text or email, asks the qualifying questions and offers a time to talk.",
    result: "You talk to warm, qualified leads instead of chasing cold ones.",
    status: "audit",
  },
  {
    id: "chatbot",
    name: "AI Website Assistant",
    where: "Your website",
    problem: "Visitors with a quick question leave rather than fill in a form.",
    does: "A chat assistant trained on your business answers them on the spot and sends every enquiry to your inbox or CRM.",
    result: "More of your existing traffic turns into enquiries.",
    status: "live",
  },
  {
    id: "crm",
    name: "CRM & Pipeline",
    where: "Behind the scenes",
    problem: "Leads and customers live across inboxes, spreadsheets and sticky notes, so follow-ups slip.",
    does: "Every lead, booking and customer in one place: a CRM like HubSpot or Pipedrive set up properly, or one built around how you work, with follow-ups that send themselves.",
    result: "Nothing falls through the cracks, and you can see the whole pipeline at a glance.",
    status: "live",
  },
  {
    id: "reviews",
    name: "Review Engine",
    where: "After every job",
    problem: "Happy customers rarely leave a review unless someone asks at the right moment.",
    does: "Asks every customer for a Google review at the right time, and drafts replies to the reviews you get.",
    result: "A steady flow of fresh reviews that helps you get found.",
    status: "audit",
  },
  {
    id: "win-back",
    name: "Win-back Campaigns",
    where: "Your customer list",
    problem: "Past customers forget you exist, and the list you already paid to build sits unused.",
    does: "Spots customers who have gone quiet and brings them back with timed text and email offers.",
    result: "Repeat business from people who already know and trust you.",
    status: "audit",
  },
  {
    id: "admin",
    name: "Quote & Admin Automation",
    where: "Your office",
    problem: "Hours every week go on quotes, chasing invoices and copying details between systems.",
    does: "Turns enquiries into draft quotes, chases unpaid invoices and moves data between your tools automatically.",
    result: "Your team gets those hours back for work that earns.",
    status: "audit",
  },
];

/* WHY SPEED MATTERS — published research on lead response time, shown on
   /ai above the stat cards (Brad, 2026-10-06: "a statistic saying how many
   clients are lost due to responses taking too long ... we need some
   analytics on the ai page").

   RULES. Every figure is quoted as its study published it, with the study
   and year beside it on the page: never rounded up, never extrapolated (no
   curve drawn between two published points), never presented as our
   clients' results. Both studies are US research and the page says so.
   Checked 2026-10-06 against:
   - The InsideSales.com/MIT Lead Response Management Study (James Oldroyd
     and Dave Elkington, presented October 2007; three years of data from
     six companies, 15,000+ web leads, 100,000+ call attempts): "The odds of
     contacting a lead if called in 5 minutes versus 30 minutes drop 100
     times. The odds of qualifying a lead if called in 5 minutes versus 30
     minutes drop 21 times." "Qualify" there means the lead agrees to enter
     the sales process, e.g. books an appointment.
   - Oldroyd, McElheran and Elkington, "The Short Life of Online Sales
     Leads", Harvard Business Review 89(3), March 2011: 2,241 US companies
     sent a web test lead; 37% replied within an hour, 16% in one to 24
     hours, 24% after more than 24 hours and 23% never; the average, among
     those replying within 30 days, was 42 hours. A separate analysis of
     1.25 million leads at 42 firms: those that tried to contact a lead
     within an hour were nearly seven times as likely to qualify it as
     those that tried even an hour later. */
export const responseResearch = {
  label: "Why speed matters",
  heading: "Enquiries go cold in minutes, not days.",
  lede: "Ever had an enquiry go quiet before you could call back? It is rarely the price. Interest peaks the moment someone gets in touch and falls away fast, and two well-known studies put numbers on how fast.",
  stats: [
    {
      value: "100×",
      text: "Calling a new lead back at 30 minutes instead of 5 cut the odds of reaching them a hundredfold.",
      source: "Lead Response Management Study, InsideSales.com and MIT, 2007",
    },
    {
      value: "21×",
      text: "Over the same 25 minutes, the odds of the lead agreeing to a next step, such as a call or an appointment, fell 21 times.",
      source: "Lead Response Management Study, InsideSales.com and MIT, 2007",
    },
    {
      value: "7×",
      text: "Firms that tried to reply within an hour were nearly seven times as likely to get that next step as firms that tried even an hour later.",
      source: "Harvard Business Review, 2011",
    },
  ],
  audit: {
    title: "How 2,241 US companies answered a test enquiry",
    segments: [
      { id: "hour", label: "Within an hour", value: 37 },
      { id: "day", label: "1 to 24 hours", value: 16 },
      { id: "later", label: "Over 24 hours", value: 24 },
      { id: "never", label: "Never replied", value: 23 },
    ],
    average: { value: "42", unit: "hours", label: "Average wait, among those that replied within 30 days" },
    source: {
      text: "Oldroyd, McElheran & Elkington, “The Short Life of Online Sales Leads”, Harvard Business Review, March 2011",
      href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
    },
  },
  bridge: "That gap, between the first five minutes and the next working day, is what these systems close.",
  note: "Published US research, quoted as published. Not results from our clients.",
};

export const automationSteps = [
  {
    id: "audit",
    title: "Audit",
    body: "A free call to map where time and enquiries leak out of your business, and which system to start with.",
  },
  {
    id: "build",
    title: "Build",
    body: "We build and train the systems around your business, connected to the tools you already use.",
  },
  {
    id: "launch",
    title: "Launch",
    body: "We test everything with you before it goes live, then switch it on.",
  },
  {
    id: "optimise",
    title: "Optimise",
    body: "Each month we check what it caught, fix what it missed and improve it, on the monthly plan.",
  },
] as const;

export const automationSectors = [
  { name: "Restaurants & hospitality", line: "Bookings and enquiries that come in while the kitchen is busy." },
  { name: "Estate agents & property", line: "Viewing requests and valuations answered before a rival agent replies." },
  { name: "Car dealers", line: "Every finance and test-drive enquiry followed up in minutes." },
  { name: "Trades & construction", line: "Quotes out the same day, even when you are on site." },
  { name: "Clinics & aesthetics", line: "Appointment requests and questions handled after hours." },
  { name: "Retail & boutiques", line: "Repeat customers brought back, and reviews collected." },
  { name: "Golf & leisure clubs", line: "Visitor calls, tee times and membership enquiries answered." },
];

export const automationFaqs = [
  {
    q: "Is my customers' data safe?",
    a: "We only connect the systems a job needs, and set each one up to store no more than it has to. Before anything goes live we walk you through exactly what is stored, where, and who can see it.",
  },
  {
    q: "Does the voice receptionist sound robotic?",
    a: "It uses a natural-sounding voice and is trained on your business, so it can answer real questions. The best test is to hear it yourself, and we will happily set up a demo trained on your business during the audit.",
  },
  {
    q: "What if it gets something wrong?",
    a: "Each system is set up to hand over to a person when it is unsure, rather than guess. You get a summary of every conversation, and the monthly review is where we fix anything it handled badly.",
  },
  {
    q: "Do I need new software?",
    a: "Usually not. We connect to the tools you already use where we can, and only build something new, like a CRM, when it saves you more than it costs.",
  },
  {
    q: "What does it cost?",
    a: "The website assistant, the voice receptionist and the CRM have published prices. Everything else is quoted after the free audit, as a one-off setup and a monthly fee, both agreed in writing before we start.",
  },
];

/** Every question on /ai, in order: the five above, then the two AI
    questions from `faqs` that /services/ai carried (the chatbot's running
    cost and what the voice receptionist covers), so the answers with the
    exact figures and the receptionist's scope did not leave the AI page
    when that page did. Read by meta, so an edit in content.ts lands here.
    The FAQPage JSON-LD on /ai reads the same list. */
export const automationPageFaqs: { q: string; a: string }[] = [
  ...automationFaqs,
  ...faqs.filter((f) => f.meta === "AI systems" || f.meta === "AI voice").map(({ q, a }) => ({ q, a })),
];
