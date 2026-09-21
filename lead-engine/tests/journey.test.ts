import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// The database path is read when the connection is first opened, so it has to
// be set before anything imports the repository layer.
process.env.DATABASE_FILE = join(mkdtempSync(join(tmpdir(), "lead-engine-")), "journey.db");

const { saveLead, setStatus, getLead, listLeads, revenueTotals, sourcePerformance } = await import(
  "../src/lib/db/leads.ts"
);
const { closeDb } = await import("../src/lib/db/index.ts");
const { scoreLead, tierFor } = await import("../src/lib/domain/scoring.ts");
const { dedupeKey } = await import("../src/lib/domain/ids.ts");
const { assessRecurring } = await import("../src/lib/domain/recurring.ts");
const { templateDrafts } = await import("../src/lib/outreach/generate.ts");
const { buildPack, checkReadiness, packToText } = await import("../src/lib/handoff/pack.ts");
const { feeForLead } = await import("../src/lib/revenue/commercial.ts");
const { buildWeeklyReport } = await import("../src/lib/report/weekly.ts");
const { CAMBRIDGE_MEWS } = await import("../src/lib/clients/cambridge-mews.ts");
type Lead = import("../src/lib/domain/types.ts").Lead;

/**
 * The journey the whole product exists to support, end to end:
 * a company announces work in the Humber → the opportunity is created and
 * scored → outreach is prepared → the prospect confirms → the pack goes to
 * Cambridge Mews → it books → the fee and the source are recorded.
 */
test("a discovered opportunity travels all the way to a recorded booking", async (t) => {
  t.after(() => closeDb());

  const qualification = {
    accommodation: { strength: "travelling_workforce" as const, evidenceIds: ["e1", "e2"] },
    timing: { horizon: "active_now" as const, evidenceIds: ["e1"] },
    groupSize: { min: 8, max: 8, basis: "stated" as const, evidenceIds: ["e2"] },
    duration: { weeks: 10, basis: "stated" as const, recurring: "unknown" as const, evidenceIds: ["e2"] },
    geography: { band: "humber" as const, workLocation: "Immingham", evidenceIds: ["e1"] },
    contactability: {
      namedContact: true, role: true, email: true, phone: false, genericChannel: false, evidenceIds: ["e3"],
    },
  };

  const score = scoreLead(qualification);
  const tier = tierFor(score, qualification);

  assert.ok(score.total >= CAMBRIDGE_MEWS.qualification.notifyAtScore, `score ${score.total} should clear the alert threshold`);
  assert.equal(tier, "high_intent");
  assert.equal(score.components.reduce((n, c) => n + c.points, 0), score.total, "the breakdown must add up to the total");

  const now = new Date().toISOString();
  let lead: Lead = {
    id: "lead_journey",
    clientId: CAMBRIDGE_MEWS.id,
    sourceType: "project",
    dedupeKey: dedupeKey({ company: "ABC Engineering", project: "Immingham jetty", location: "Immingham" }),
    company: { name: "ABC Engineering", industry: "Civil engineering", location: "Manchester", basedOutsideRegion: true },
    contact: { name: "Sam Taylor", role: "Operations Manager", email: "sam@example.com" },
    opportunity: { projectName: "Immingham jetty refurbishment", projectLocation: "Immingham", summary: "Refurbishment works at Immingham." },
    signalSummary: "Eight engineers are being mobilised to Immingham from Manchester for a ten-week programme.",
    evidence: [
      { id: "e1", kind: "verified", statement: "Contract awarded for jetty refurbishment at Immingham.", sourceUrl: "https://example.com/award", observedAt: "2026-02-01" },
      { id: "e2", kind: "verified", statement: "Eight engineers are being mobilised for a ten-week programme.", sourceUrl: "https://example.com/award", observedAt: "2026-02-01" },
      { id: "e3", kind: "verified", statement: "Sam Taylor is listed as Operations Manager on the company's contact page.", sourceUrl: "https://example.com/contact" },
      { id: "e4", kind: "inference", statement: "Engineers travelling from Manchester may need somewhere to stay near the site.", derivedFrom: ["e1", "e2"] },
      { id: "e5", kind: "unknown", statement: "How many of the eight already have accommodation arranged." },
    ],
    qualification,
    score,
    tier,
    status: "qualified",
    approval: "pending",
    outreach: [],
    discoveredAt: now,
    updatedAt: now,
    history: [{ at: now, actor: "discovery", event: "discovered" }],
  };
  saveLead(lead);

  await t.test("the engine explains why it qualifies", () => {
    const accommodation = score.components.find((c) => c.key === "accommodation");
    assert.match(accommodation?.reason ?? "", /travelling into the area/);
  });

  await t.test("outreach references the real reason and asks rather than asserts", () => {
    const drafts = templateDrafts(lead, CAMBRIDGE_MEWS);
    lead = { ...lead, outreach: drafts, status: "outreach_ready" };
    saveLead(lead);
    const email = drafts.find((d) => d.channel === "email");
    assert.match(email?.body ?? "", /Immingham/);
    assert.match(email?.body ?? "", /wondered whether/);
  });

  await t.test("nothing reaches the client before approval", () => {
    assert.equal(checkReadiness(lead, CAMBRIDGE_MEWS).ready, false);
  });

  await t.test("the prospect is contacted and confirms a requirement", () => {
    lead = setStatus(lead, "contacted", "blackline");
    lead = setStatus(lead, "responded", "blackline");
    lead = setStatus(lead, "requirement_confirmed", "blackline", "Sam confirmed eight rooms are needed from March.");
    assert.equal(getLead(lead.id)?.status, "requirement_confirmed");
  });

  await t.test("the pack carries the evidence, the inference and the gaps", () => {
    lead = { ...lead, approval: "approved" };
    saveLead(lead);
    const readiness = checkReadiness(lead, CAMBRIDGE_MEWS);
    assert.equal(readiness.ready, true);

    const text = packToText(buildPack(lead, CAMBRIDGE_MEWS));
    assert.match(text, /Eight engineers are being mobilised/);
    assert.match(text, /may need somewhere to stay/);
    assert.match(text, /already have accommodation arranged/);
    assert.match(text, /Sam Taylor/);
    assert.match(text, /https:\/\/example\.com\/award/);

    lead = { ...lead, handoffSentAt: new Date().toISOString(), status: "sent_to_cambridge_mews" };
    saveLead(lead);
  });

  await t.test("the booking, the fee and the lead source are all recorded", () => {
    lead = { ...lead, status: "booked", booking: { value: 4800, currency: "GBP", nights: 70, guests: 8, bookedOn: new Date().toISOString().slice(0, 10) } };
    saveLead(lead);

    const totals = revenueTotals(CAMBRIDGE_MEWS.id);
    assert.equal(totals.bookings, 1);
    assert.equal(totals.bookingRevenue, 4800);
    assert.equal(totals.nights, 70);

    const unconfigured = feeForLead(lead, { kind: "unconfigured" });
    assert.equal(unconfigured.known, false, "no fee may be reported before terms are agreed");

    const fee = feeForLead(lead, { kind: "percentage_commission", currency: "GBP", percentage: 10 });
    assert.equal(fee.known, true);
    if (fee.known) assert.equal(fee.amount, 480);

    const performance = sourcePerformance(CAMBRIDGE_MEWS.id).find((s) => s.sourceType === "project");
    assert.equal(performance?.booked, 1, "the booking must be attributable to the source that found it");
    assert.equal(performance?.bookingRevenue, 4800);
  });

  await t.test("the recurring assessment explains itself", () => {
    const recurring = assessRecurring(lead);
    assert.ok(["yes", "no", "unknown"].includes(recurring.value));
    assert.ok(recurring.reason.length > 10);
  });

  await t.test("the weekly report picks the journey up", () => {
    const report = buildWeeklyReport({ ...CAMBRIDGE_MEWS, commercial: { kind: "percentage_commission", currency: "GBP", percentage: 10 } });
    assert.equal(report.newLeads, 1);
    assert.equal(report.bookings.length, 1);
    assert.equal(report.bookingRevenue, 4800);
    assert.equal(report.bestSource?.label, "Projects");
  });

  await t.test("a second source for the same opportunity is the same lead", () => {
    const sameKey = dedupeKey({ company: "ABC Engineering Ltd", project: "immingham jetty", location: "Immingham" });
    assert.equal(sameKey, lead.dedupeKey);
    assert.equal(listLeads({ clientId: CAMBRIDGE_MEWS.id }).total, 1);
  });
});
