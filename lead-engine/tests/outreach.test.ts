import assert from "node:assert/strict";
import { test } from "node:test";
import { templateDrafts, findForbidden } from "../src/lib/outreach/generate.ts";
import { CAMBRIDGE_MEWS } from "../src/lib/clients/cambridge-mews.ts";
import { checkReadiness, buildPack, packToText } from "../src/lib/handoff/pack.ts";
import type { Lead } from "../src/lib/domain/types.ts";

const LEAD: Lead = {
  id: "lead_1",
  clientId: "cambridge-mews",
  sourceType: "job",
  dedupeKey: "k",
  company: { name: "ABC Engineering", industry: "Civil engineering" },
  contact: { name: "Sam Taylor", role: "Operations Manager", email: "sam@example.com" },
  opportunity: { projectName: "Jetty refurbishment", projectLocation: "Immingham", summary: "Refurbishment works." },
  signalSummary: "Eight fixed-term engineering roles advertised at an Immingham site.",
  evidence: [
    {
      id: "e1",
      kind: "verified",
      statement: "Eight six-month engineering contracts advertised for an Immingham site.",
      sourceUrl: "https://example.com/jobs",
      observedAt: "2026-02-01",
    },
    { id: "e2", kind: "inference", statement: "Some of those workers may travel in and need somewhere to stay." },
    { id: "e3", kind: "unknown", statement: "How many of the eight live locally." },
  ],
  qualification: {
    accommodation: { strength: "temporary_roles", evidenceIds: ["e1"] },
    timing: { horizon: "active_now", evidenceIds: ["e1"] },
    groupSize: { min: 8, max: 8, basis: "stated", evidenceIds: ["e1"] },
    duration: { weeks: 26, basis: "stated", recurring: "unknown", evidenceIds: ["e1"] },
    geography: { band: "humber", workLocation: "Immingham", evidenceIds: ["e1"] },
    contactability: { namedContact: true, role: true, email: true, phone: false, genericChannel: false, evidenceIds: ["e1"] },
  },
  score: { total: 80, max: 100, rubricVersion: "1.0.0", components: [] },
  tier: "potential",
  status: "qualified",
  approval: "pending",
  outreach: [],
  discoveredAt: "2026-02-02T00:00:00.000Z",
  updatedAt: "2026-02-02T00:00:00.000Z",
  history: [],
};

test("template drafts cover all four channels", () => {
  const drafts = templateDrafts(LEAD, CAMBRIDGE_MEWS);
  assert.deepEqual(drafts.map((d) => d.channel), ["email", "linkedin", "phone", "follow_up"]);
});

test("no draft tells the prospect they need accommodation or offers a rate", () => {
  const drafts = templateDrafts(LEAD, CAMBRIDGE_MEWS);
  assert.equal(findForbidden(drafts, CAMBRIDGE_MEWS), undefined);
  for (const draft of drafts) {
    assert.doesNotMatch(draft.body, /\bwe have (rooms|availability)\b/i);
  }
});

test("the email asks rather than asserts, and names BlackLine as the sender", () => {
  const email = templateDrafts(LEAD, CAMBRIDGE_MEWS).find((d) => d.channel === "email");
  assert.ok(email);
  assert.match(email.body, /I wondered whether/);
  assert.match(email.body, /BlackLine Agency/);
});

test("a lead cannot be handed over before it is approved", () => {
  const readiness = checkReadiness(LEAD, CAMBRIDGE_MEWS);
  assert.equal(readiness.ready, false);
  assert.ok(readiness.blockers.some((b) => /approved/i.test(b)));
});

test("an approved lead with evidence is ready, with the gaps flagged as warnings", () => {
  const readiness = checkReadiness({ ...LEAD, approval: "approved" }, CAMBRIDGE_MEWS);
  assert.equal(readiness.ready, true);
  assert.ok(readiness.warnings.some((w) => /recipient/i.test(w)));
});

test("a lead with no verified evidence can never be handed over", () => {
  const readiness = checkReadiness(
    { ...LEAD, approval: "approved", evidence: LEAD.evidence.filter((e) => e.kind !== "verified") },
    CAMBRIDGE_MEWS,
  );
  assert.equal(readiness.ready, false);
});

test("the pack keeps facts, inferences and unknowns apart", () => {
  const text = packToText(buildPack(LEAD, CAMBRIDGE_MEWS));
  assert.match(text, /VERIFIED EVIDENCE/);
  assert.match(text, /OUR INFERENCE — NOT CONFIRMED FACT/);
  assert.match(text, /NOT ESTABLISHED/);
  assert.match(text, /How many of the eight live locally/);
  assert.match(text, /https:\/\/example\.com\/jobs/);
});

test("the pack states that pricing and booking are the client's, not BlackLine's", () => {
  const text = packToText(buildPack(LEAD, CAMBRIDGE_MEWS));
  assert.match(text, /Availability, pricing, quoting and booking sit with Cambridge Mews Accommodation/);
});

test("fields the sources never established are labelled, not filled in", () => {
  const bare = { ...LEAD, contact: {}, opportunity: { summary: "x" } };
  const text = packToText(buildPack(bare, CAMBRIDGE_MEWS));
  assert.match(text, /Contact: Not identified/);
  assert.match(text, /Location: Not established/);
});
