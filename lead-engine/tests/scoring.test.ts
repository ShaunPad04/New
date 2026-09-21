import assert from "node:assert/strict";
import { test } from "node:test";
import { RUBRIC_TOTAL, scoreLead, tierFor } from "../src/lib/domain/scoring.ts";
import type { QualificationInputs } from "../src/lib/domain/types.ts";

function inputs(overrides: Partial<QualificationInputs> = {}): QualificationInputs {
  const base: QualificationInputs = {
    accommodation: { strength: "travelling_workforce", evidenceIds: ["e1"] },
    timing: { horizon: "active_now", evidenceIds: ["e1"] },
    groupSize: { min: 8, max: 8, basis: "stated", evidenceIds: ["e1"] },
    duration: { weeks: 10, basis: "stated", recurring: "unknown", evidenceIds: ["e1"] },
    geography: { band: "humber", evidenceIds: ["e1"] },
    contactability: { namedContact: true, role: true, email: true, phone: false, genericChannel: false, evidenceIds: ["e1"] },
  };
  return { ...base, ...overrides };
}

test("the rubric adds up to 100", () => {
  assert.equal(RUBRIC_TOTAL, 100);
});

test("a well-evidenced lead scores in the high-intent band", () => {
  const score = scoreLead(inputs());
  assert.ok(score.total >= 75, `expected >= 75, got ${score.total}`);
  assert.equal(tierFor(score, inputs()), "high_intent");
  assert.equal(score.components.length, 6);
});

test("a component with no evidence cited scores zero", () => {
  const withoutEvidence = inputs({
    accommodation: { strength: "explicit_request", evidenceIds: [] },
  });
  const component = scoreLead(withoutEvidence).components.find((c) => c.key === "accommodation");
  assert.equal(component?.points, 0);
  assert.match(component?.reason ?? "", /No evidence cited/);
});

test("no score can exceed its component maximum", () => {
  const maxed = inputs({
    groupSize: { min: 500, max: 500, basis: "stated", evidenceIds: ["e1"] },
    duration: { weeks: 520, basis: "stated", recurring: "yes", evidenceIds: ["e1"] },
    contactability: { namedContact: true, role: true, email: true, phone: true, genericChannel: true, evidenceIds: ["e1"] },
  });
  for (const component of scoreLead(maxed).components) {
    assert.ok(component.points <= component.max, `${component.key} exceeded its maximum`);
  }
});

test("work outside a sensible distance is disqualified whatever else it scores", () => {
  const far = inputs({ geography: { band: "outside", evidenceIds: ["e1"] } });
  assert.equal(tierFor(scoreLead(far), far), "disqualified");
});

test("no accommodation signal is disqualified whatever else it scores", () => {
  const none = inputs({ accommodation: { strength: "none", evidenceIds: ["e1"] } });
  assert.equal(tierFor(scoreLead(none), none), "disqualified");
});

test("a high score without a direct workforce signal stops at potential", () => {
  const indirect = inputs({ accommodation: { strength: "temporary_roles", evidenceIds: ["e1"] } });
  const score = scoreLead(indirect);
  assert.equal(tierFor(score, indirect), "potential");
});

test("derived group sizes are discounted against stated ones", () => {
  const stated = scoreLead(inputs()).components.find((c) => c.key === "groupSize")?.points ?? 0;
  const derived =
    scoreLead(inputs({ groupSize: { min: 8, max: 8, basis: "derived", evidenceIds: ["e1"] } })).components.find(
      (c) => c.key === "groupSize",
    )?.points ?? 0;
  assert.ok(derived < stated, "a derived size should score lower than a stated one");
});

test("scoring is a pure function of its inputs", () => {
  const a = scoreLead(inputs());
  const b = scoreLead(inputs());
  assert.deepEqual(a, b);
});
