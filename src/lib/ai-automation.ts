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
