import type { Lead, Ternary } from "./types";

const RECURRING_INDUSTRY_HINTS = [
  "recruitment",
  "staffing",
  "employment agency",
  "labour supply",
  "contractor",
  "engineering",
  "construction",
  "offshore",
  "marine",
  "industrial services",
  "maintenance",
];

/**
 * Recurring potential is reported, with a reason, rather than assumed. An
 * agency that places workers locally is the strongest case: one relationship
 * can produce many bookings.
 */
export function assessRecurring(lead: Pick<Lead, "sourceType" | "company" | "qualification">): {
  value: Ternary;
  reason: string;
} {
  const stated = lead.qualification.duration.recurring;
  if (stated === "yes" || stated === "no") {
    return { value: stated, reason: lead.qualification.duration.recurringReason ?? "Recorded during qualification." };
  }

  if (lead.sourceType === "recruitment") {
    return {
      value: "yes",
      reason:
        "A recruitment business placing workers into the area can generate a booking on every placement, not just once.",
    };
  }

  const industry = (lead.company.industry ?? "").toLowerCase();
  const hint = RECURRING_INDUSTRY_HINTS.find((h) => industry.includes(h));
  if (hint) {
    return {
      value: "unknown",
      reason: `The company works in ${lead.company.industry}, where repeat project work is common, but nothing in the sources confirms repeat demand.`,
    };
  }

  return { value: "unknown", reason: "Nothing in the sources indicates whether this would repeat." };
}
