/**
 * Inserts a handful of clearly-marked EXAMPLE leads so the interface can be
 * reviewed before any real discovery has run.
 *
 * These are not real companies, real projects or real people. Every record is
 * prefixed "[EXAMPLE]" and cites example.com, so a seeded database can never
 * be mistaken for a working one. It refuses to run without ALLOW_DEMO_SEED=1,
 * and refuses to touch a database that already holds leads.
 *
 *   ALLOW_DEMO_SEED=1 DATABASE_FILE=data/demo.db pnpm demo:seed
 */
import { getDb, closeDb } from "../src/lib/db/index.ts";
import { listLeads, saveLead } from "../src/lib/db/leads.ts";
import { dedupeKey, newId } from "../src/lib/domain/ids.ts";
import { scoreLead, tierFor } from "../src/lib/domain/scoring.ts";
import { assessRecurring } from "../src/lib/domain/recurring.ts";
import { CAMBRIDGE_MEWS } from "../src/lib/clients/cambridge-mews.ts";
import type { Lead, QualificationInputs, SourceType } from "../src/lib/domain/types.ts";

if (process.env.ALLOW_DEMO_SEED !== "1") {
  console.error("Refusing to seed. Set ALLOW_DEMO_SEED=1 if you really want example data in this database.");
  process.exit(1);
}

getDb();
const existing = listLeads({ clientId: CAMBRIDGE_MEWS.id, limit: 1 });
if (existing.total > 0) {
  console.error(`Refusing to seed: this database already holds ${existing.total} lead(s).`);
  closeDb();
  process.exit(1);
}

type Seed = {
  company: string;
  industry: string;
  based: string;
  project: string;
  location: string;
  summary: string;
  signal: string;
  sourceType: SourceType;
  contact?: { name: string; role: string; email?: string; phone?: string };
  q: Omit<QualificationInputs, "contactability">;
};

const SEEDS: Seed[] = [
  {
    company: "[EXAMPLE] Northgate Marine Engineering",
    industry: "Marine and subsea engineering",
    based: "Manchester",
    project: "[EXAMPLE] Immingham jetty refurbishment",
    location: "Immingham",
    summary:
      "Example record. A Manchester engineering contractor mobilising a team to a jetty refurbishment at Immingham.",
    signal: "Eight engineers travelling in from Manchester for a ten-week programme.",
    sourceType: "project",
    contact: { name: "[EXAMPLE] Sam Taylor", role: "Operations Manager", email: "operations@example.com" },
    q: {
      accommodation: { strength: "travelling_workforce", evidenceIds: ["A"] },
      timing: { horizon: "active_now", evidenceIds: ["A"] },
      groupSize: { min: 8, max: 8, basis: "stated", evidenceIds: ["A"] },
      duration: { weeks: 10, basis: "stated", recurring: "unknown", evidenceIds: ["A"] },
      geography: { band: "humber", workLocation: "Immingham", evidenceIds: ["A"] },
    },
  },
  {
    company: "[EXAMPLE] Fen & Coast Recruitment",
    industry: "Industrial recruitment and labour supply",
    based: "Hull",
    project: "[EXAMPLE] Ongoing industrial placements",
    location: "Grimsby",
    summary: "Example record. An agency placing industrial and engineering workers into Humber sites.",
    signal: "Places contract workers into Grimsby and Immingham sites throughout the year.",
    sourceType: "recruitment",
    contact: { name: "[EXAMPLE] Jo Bright", role: "Branch Manager", phone: "01000 000000" },
    q: {
      accommodation: { strength: "temporary_roles", evidenceIds: ["A"] },
      timing: { horizon: "active_now", evidenceIds: ["A"] },
      groupSize: { min: 4, max: 12, basis: "derived", evidenceIds: ["A"] },
      duration: { weeks: 12, basis: "derived", recurring: "yes", recurringReason: "Places workers continuously.", evidenceIds: ["A"] },
      geography: { band: "in_area", workLocation: "Grimsby", evidenceIds: ["A"] },
    },
  },
  {
    company: "[EXAMPLE] Saltmarsh Civils",
    industry: "Civil engineering",
    based: "Leeds",
    project: "[EXAMPLE] Highways scheme",
    location: "Stallingborough",
    summary: "Example record. A civils contractor with a highways scheme starting near Stallingborough.",
    signal: "Fixed-term site roles advertised for a scheme starting next month.",
    sourceType: "job",
    q: {
      accommodation: { strength: "temporary_roles", evidenceIds: ["A"] },
      timing: { horizon: "starting_soon", evidenceIds: ["A"] },
      groupSize: { min: 5, max: 5, basis: "derived", evidenceIds: ["A"] },
      duration: { weeks: 6, basis: "stated", recurring: "unknown", evidenceIds: ["A"] },
      geography: { band: "in_area", workLocation: "Stallingborough", evidenceIds: ["A"] },
    },
  },
  {
    company: "[EXAMPLE] Harbour Point Foods",
    industry: "Food manufacturing",
    based: "Grimsby",
    project: "[EXAMPLE] Line commissioning",
    location: "Grimsby",
    summary: "Example record. A local manufacturer commissioning a new production line.",
    signal: "Commissioning engineers expected on site, though nothing states where they are travelling from.",
    sourceType: "expansion",
    q: {
      accommodation: { strength: "project_presence", evidenceIds: ["A"] },
      timing: { horizon: "announced_future", evidenceIds: ["A"] },
      groupSize: { basis: "unknown", evidenceIds: [] },
      duration: { basis: "unknown", recurring: "unknown", evidenceIds: [] },
      geography: { band: "in_area", workLocation: "Grimsby", evidenceIds: ["A"] },
    },
  },
];

let created = 0;
for (const seed of SEEDS) {
  const evidenceId = newId("ev");
  const remap = (ids: string[]) => ids.map(() => evidenceId);

  const qualification: QualificationInputs = {
    accommodation: { ...seed.q.accommodation, evidenceIds: remap(seed.q.accommodation.evidenceIds) },
    timing: { ...seed.q.timing, evidenceIds: remap(seed.q.timing.evidenceIds) },
    groupSize: { ...seed.q.groupSize, evidenceIds: remap(seed.q.groupSize.evidenceIds) },
    duration: { ...seed.q.duration, evidenceIds: remap(seed.q.duration.evidenceIds) },
    geography: { ...seed.q.geography, evidenceIds: remap(seed.q.geography.evidenceIds) },
    contactability: {
      namedContact: Boolean(seed.contact?.name),
      role: Boolean(seed.contact?.role),
      email: Boolean(seed.contact?.email),
      phone: Boolean(seed.contact?.phone),
      genericChannel: !seed.contact,
      evidenceIds: [evidenceId],
    },
  };

  const score = scoreLead(qualification);
  const now = new Date().toISOString();
  const lead: Lead = {
    id: newId("lead"),
    clientId: CAMBRIDGE_MEWS.id,
    sourceType: seed.sourceType,
    dedupeKey: dedupeKey({ company: seed.company, project: seed.project, location: seed.location }),
    company: { name: seed.company, website: "https://example.com", industry: seed.industry, location: seed.based },
    contact: { ...seed.contact, sourceUrl: "https://example.com/contact" },
    opportunity: { projectName: seed.project, projectLocation: seed.location, summary: seed.summary },
    signalSummary: seed.signal,
    evidence: [
      {
        id: evidenceId,
        kind: "verified",
        statement: `EXAMPLE DATA — ${seed.signal}`,
        sourceUrl: "https://example.com/source",
        sourceTitle: "Example source (not a real page)",
        observedAt: now.slice(0, 10),
      },
      {
        id: newId("ev"),
        kind: "inference",
        statement: "Some of those people may need somewhere to stay near the site.",
        derivedFrom: [evidenceId],
      },
      { id: newId("ev"), kind: "unknown", statement: "How many already have accommodation arranged." },
    ],
    qualification,
    score,
    tier: tierFor(score, qualification),
    status: "qualified",
    approval: "pending",
    outreach: [],
    notes: "EXAMPLE DATA — seeded for interface review. Delete before using this database for real work.",
    discoveredAt: now,
    updatedAt: now,
    history: [{ at: now, actor: "demo-seed", event: "seeded as example data" }],
  };

  const recurring = assessRecurring(lead);
  lead.qualification.duration.recurring = recurring.value;
  lead.qualification.duration.recurringReason = recurring.reason;

  saveLead(lead);
  created += 1;
  console.log(`  ${score.total.toString().padStart(3)}/100  ${lead.tier.padEnd(12)} ${seed.company}`);
}

console.log(`\nSeeded ${created} EXAMPLE leads into ${process.env.DATABASE_FILE ?? "data/lead-engine.db"}.`);
closeDb();
