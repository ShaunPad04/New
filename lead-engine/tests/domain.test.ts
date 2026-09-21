import assert from "node:assert/strict";
import { test } from "node:test";
import { bandForLocation, bandForDistance, haversineKm, ANCHOR } from "../src/lib/domain/geo.ts";
import { canTransition } from "../src/lib/domain/status.ts";
import { dedupeKey } from "../src/lib/domain/ids.ts";
import { parseLooseDate } from "../src/lib/discovery/provider.ts";
import { parseRobots, htmlToText, decodeEntities } from "../src/lib/research/fetch.ts";
import { feeForLead, describeModel } from "../src/lib/revenue/commercial.ts";
import type { Lead } from "../src/lib/domain/types.ts";

test("Grimsby is in the immediate area, Lincoln is not", () => {
  assert.equal(bandForLocation("A project in Grimsby town centre").band, "in_area");
  assert.equal(bandForLocation("Works at Immingham docks").band, "humber");
  assert.equal(bandForLocation("Offices in Lincoln").band, "wider_region");
});

test("an unrecognised location is unknown, never guessed", () => {
  assert.equal(bandForLocation("somewhere in the south").band, "unknown");
  assert.equal(bandForLocation(undefined).band, "unknown");
});

test("distance bands follow the distance", () => {
  assert.equal(bandForDistance(2), "in_area");
  assert.equal(bandForDistance(14), "humber");
  assert.equal(bandForDistance(30), "humber");
  assert.equal(bandForDistance(80), "wider_region");
  assert.equal(bandForDistance(300), "outside");
});

test("the anchor is zero distance from itself", () => {
  assert.equal(Math.round(haversineKm(ANCHOR, { lat: ANCHOR.lat, lon: ANCHOR.lon })), 0);
});

test("the pipeline cannot be skipped, but closing and stepping back are allowed", () => {
  assert.equal(canTransition("qualified", "outreach_ready").ok, true);
  assert.equal(canTransition("qualified", "booked").ok, false);
  assert.equal(canTransition("contacted", "qualified").ok, true);
  assert.equal(canTransition("contacted", "lost").ok, true);
  assert.equal(canTransition("lost", "researching").ok, true);
  assert.equal(canTransition("lost", "booked").ok, false);
});

test("the same opportunity from two sources produces one key", () => {
  const a = dedupeKey({ company: "ABC Engineering Ltd", project: "Immingham jetty", location: "Immingham" });
  const b = dedupeKey({ company: "abc engineering", project: "immingham jetty", location: "immingham" });
  assert.equal(a, b);
});

test("different projects at the same company stay separate", () => {
  const a = dedupeKey({ company: "ABC Engineering", project: "Immingham jetty" });
  const b = dedupeKey({ company: "ABC Engineering", project: "Hull quayside" });
  assert.notEqual(a, b);
});

test("unparseable provider dates are dropped rather than approximated", () => {
  assert.equal(parseLooseDate("not a date"), undefined);
  assert.equal(parseLooseDate(undefined), undefined);
  assert.equal(parseLooseDate("2026-03-04"), "2026-03-04");
  assert.equal(typeof parseLooseDate("3 days ago"), "string");
});

test("robots.txt parsing only honours the wildcard group", () => {
  const rules = parseRobots(
    ["User-agent: Googlebot", "Disallow: /secret", "", "User-agent: *", "Disallow: /private", "Disallow: /admin"].join("\n"),
  );
  assert.deepEqual(rules, ["/private", "/admin"]);
});

test("html is reduced to readable text", () => {
  const text = htmlToText("<p>Eight roles</p><script>ignore()</script><p>at Immingham</p>");
  assert.match(text, /Eight roles/);
  assert.match(text, /at Immingham/);
  assert.doesNotMatch(text, /ignore/);
});

test("entities are decoded", () => {
  assert.equal(decodeEntities("6&nbsp;month &amp; &pound;5"), "6 month & £5");
});

function lead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_1",
    clientId: "cambridge-mews",
    sourceType: "project",
    dedupeKey: "k",
    company: { name: "ABC" },
    contact: {},
    opportunity: { summary: "s" },
    signalSummary: "s",
    evidence: [],
    qualification: {
      accommodation: { strength: "none", evidenceIds: [] },
      timing: { horizon: "unknown", evidenceIds: [] },
      groupSize: { basis: "unknown", evidenceIds: [] },
      duration: { basis: "unknown", recurring: "unknown", evidenceIds: [] },
      geography: { band: "unknown", evidenceIds: [] },
      contactability: { namedContact: false, role: false, email: false, phone: false, genericChannel: false, evidenceIds: [] },
    },
    score: { total: 0, max: 100, rubricVersion: "1.0.0", components: [] },
    tier: "prospect",
    status: "new",
    approval: "pending",
    outreach: [],
    discoveredAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    history: [],
    ...overrides,
  };
}

test("no fee is reported while the commercial terms are unrecorded", () => {
  const result = feeForLead(lead({ status: "booked", booking: { value: 2000, currency: "GBP" } }), { kind: "unconfigured" });
  assert.equal(result.known, false);
  assert.equal(describeModel({ kind: "unconfigured" }), "Not agreed yet");
});

test("commission is calculated from a recorded booking value", () => {
  const result = feeForLead(
    lead({ status: "booked", booking: { value: 2000, currency: "GBP" } }),
    { kind: "percentage_commission", currency: "GBP", percentage: 12.5 },
  );
  assert.equal(result.known, true);
  if (result.known) assert.equal(result.amount, 250);
});

test("commission cannot be calculated without a booking value", () => {
  const result = feeForLead(
    lead({ status: "booked", booking: { currency: "GBP" } }),
    { kind: "percentage_commission", currency: "GBP", percentage: 10 },
  );
  assert.equal(result.known, false);
});

test("a per-lead fee applies on handover, not before", () => {
  const model = { kind: "per_qualified_lead", currency: "GBP", feePerLead: 50 } as const;
  assert.equal(feeForLead(lead(), model).known, false);
  assert.equal(feeForLead(lead({ handoffSentAt: "2026-01-02T00:00:00.000Z" }), model).known, true);
});
