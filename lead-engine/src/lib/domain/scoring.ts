import type { LeadScore, QualificationInputs, ScoreComponent, Tier } from "./types";

export const RUBRIC_VERSION = "1.0.0";

export const RUBRIC_MAX = {
  accommodation: 30,
  timing: 20,
  groupSize: 15,
  duration: 15,
  geography: 10,
  contactability: 10,
} as const;

export const RUBRIC_TOTAL = Object.values(RUBRIC_MAX).reduce((a, b) => a + b, 0);

/**
 * The integrity rule that makes the score defensible: a component scores zero
 * unless at least one piece of evidence was cited for it. No source, no points.
 */
function gate(evidenceIds: string[], points: number, reason: string): { points: number; reason: string } {
  if (evidenceIds.length === 0) {
    return { points: 0, reason: "No evidence cited for this component, so it scores zero." };
  }
  return { points, reason };
}

function scoreAccommodation(q: QualificationInputs): ScoreComponent {
  const max = RUBRIC_MAX.accommodation;
  const table: Record<QualificationInputs["accommodation"]["strength"], [number, string]> = {
    explicit_request: [30, "A source shows the organisation is actively looking for accommodation."],
    travelling_workforce: [24, "Sources show workers travelling into the area for this work."],
    temporary_roles: [18, "Temporary or contract roles are advertised for a site in the area."],
    project_presence: [10, "The organisation has work in the area, with no direct accommodation signal."],
    none: [0, "No accommodation signal was found."],
  };
  const [points, reason] = table[q.accommodation.strength];
  const gated = gate(q.accommodation.evidenceIds, points, reason);
  return { key: "accommodation", label: "Accommodation evidence", max, ...gated };
}

function scoreTiming(q: QualificationInputs): ScoreComponent {
  const max = RUBRIC_MAX.timing;
  const table: Record<QualificationInputs["timing"]["horizon"], [number, string]> = {
    active_now: [20, "The work is under way now."],
    starting_soon: [16, "The work starts within roughly the next two months."],
    announced_future: [10, "The work is announced but starts further out."],
    speculative: [4, "Timing is speculative."],
    unknown: [0, "No timing information was established."],
  };
  const [points, reason] = table[q.timing.horizon];
  const gated = gate(q.timing.evidenceIds, points, reason);
  return { key: "timing", label: "Timing", max, ...gated };
}

function scoreGroupSize(q: QualificationInputs): ScoreComponent {
  const max = RUBRIC_MAX.groupSize;
  const size = q.groupSize.max ?? q.groupSize.min;
  let points = 0;
  let reason = "No group size was established.";
  if (size !== undefined) {
    if (size >= 20) [points, reason] = [15, `Around ${size} people — a large group requirement.`];
    else if (size >= 8) [points, reason] = [13, `Around ${size} people — a substantial group.`];
    else if (size >= 4) [points, reason] = [10, `Around ${size} people — a small team.`];
    else if (size >= 2) [points, reason] = [6, `Around ${size} people.`];
    else [points, reason] = [3, "A single individual."];
    if (q.groupSize.basis === "derived") {
      points = Math.round(points * 0.7);
      reason += " Derived from the number of roles advertised, not stated directly.";
    }
  }
  const gated = gate(q.groupSize.evidenceIds, points, reason);
  return { key: "groupSize", label: "Potential group size", max, ...gated };
}

function scoreDuration(q: QualificationInputs): ScoreComponent {
  const max = RUBRIC_MAX.duration;
  const weeks = q.duration.weeks;
  let points = 0;
  let reason = "No duration was established.";
  if (weeks !== undefined) {
    if (weeks >= 26) [points, reason] = [12, `About ${weeks} weeks of work — a long stay.`];
    else if (weeks >= 8) [points, reason] = [10, `About ${weeks} weeks of work.`];
    else if (weeks >= 3) [points, reason] = [7, `About ${weeks} weeks of work.`];
    else [points, reason] = [3, `About ${weeks} week(s) of work — a short stay.`];
    if (q.duration.basis === "derived") points = Math.round(points * 0.7);
  }
  if (q.duration.recurring === "yes") {
    points = Math.min(max, points + 3);
    reason += " The organisation could produce repeat bookings.";
  }
  const gated = gate(q.duration.evidenceIds, points, reason);
  return { key: "duration", label: "Duration / recurring potential", max, ...gated };
}

function scoreGeography(q: QualificationInputs): ScoreComponent {
  const max = RUBRIC_MAX.geography;
  const table: Record<QualificationInputs["geography"]["band"], [number, string]> = {
    in_area: [10, "The work is in Cleethorpes or Grimsby."],
    humber: [8, "The work is elsewhere in the Humber area."],
    wider_region: [4, "The work is in the wider region."],
    outside: [0, "The work is outside a sensible travelling distance."],
    unknown: [0, "No work location was established."],
  };
  const [points, reason] = table[q.geography.band];
  const gated = gate(q.geography.evidenceIds, points, reason);
  return { key: "geography", label: "Geographic relevance", max, ...gated };
}

function scoreContactability(q: QualificationInputs): ScoreComponent {
  const max = RUBRIC_MAX.contactability;
  const c = q.contactability;
  let points = 0;
  const has: string[] = [];
  if (c.namedContact) { points += 3; has.push("a named contact"); }
  if (c.role) { points += 2; has.push("their role"); }
  if (c.email) { points += 3; has.push("a business email"); }
  if (c.phone) { points += 2; has.push("a phone number"); }
  if (points === 0 && c.genericChannel) { points = 2; has.push("a general company contact route only"); }
  points = Math.min(points, max);
  const reason = has.length > 0 ? `We hold ${has.join(", ")}.` : "No route to a decision maker was found.";
  const gated = gate(c.evidenceIds, points, reason);
  return { key: "contactability", label: "Contactability", max, ...gated };
}

export function scoreLead(q: QualificationInputs): LeadScore {
  const components = [
    scoreAccommodation(q),
    scoreTiming(q),
    scoreGroupSize(q),
    scoreDuration(q),
    scoreGeography(q),
    scoreContactability(q),
  ];
  return {
    total: components.reduce((sum, c) => sum + c.points, 0),
    max: RUBRIC_TOTAL,
    rubricVersion: RUBRIC_VERSION,
    components,
  };
}

/**
 * Tier is derived from the score plus two hard gates, so a lead cannot reach
 * HIGH INTENT on a big score alone if nobody has evidence of an accommodation
 * need or of the work being anywhere near Cleethorpes.
 */
export function tierFor(score: LeadScore, q: QualificationInputs): Tier {
  const { band } = q.geography;
  const strength = q.accommodation.strength;

  if (band === "outside" || strength === "none") return "disqualified";
  if (band === "unknown" && score.total < 40) return "disqualified";

  const directSignal = strength === "explicit_request" || strength === "travelling_workforce";
  if (score.total >= 75 && directSignal) return "high_intent";
  if (score.total >= 55) return "potential";
  if (score.total >= 30) return "prospect";
  return "disqualified";
}

export const TIER_LABELS: Record<Tier, { label: string; mark: string; blurb: string }> = {
  high_intent: {
    label: "High intent",
    mark: "🔥",
    blurb: "Clear evidence of an active or imminent accommodation opportunity.",
  },
  potential: {
    label: "Potential",
    mark: "🟡",
    blurb: "Strong opportunity, but the accommodation requirement is not confirmed.",
  },
  prospect: {
    label: "Prospect",
    mark: "⚪",
    blurb: "Possible customer with limited evidence.",
  },
  disqualified: {
    label: "Disqualified",
    mark: "❌",
    blurb: "Not relevant, or not enough evidence to justify outreach.",
  },
};
