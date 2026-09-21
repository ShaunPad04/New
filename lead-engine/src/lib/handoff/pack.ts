import { TIER_LABELS } from "../domain/scoring";
import { assessRecurring } from "../domain/recurring";
import type { ClientConfig } from "../clients/types";
import type { Lead } from "../domain/types";

/**
 * Everything Cambridge Mews needs to pick the conversation up, and nothing
 * BlackLine cannot stand behind. Inferences travel clearly marked as
 * inferences, and unknowns travel too — a gap the client can see is worth far
 * more than a gap we quietly papered over.
 */
export type HandoffPack = {
  generatedAt: string;
  from: { organisation: string; contact: string; email: string; phone: string };
  to: { client: string; recipients: string[] };
  prospect: {
    company: string;
    website?: string;
    industry?: string;
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
  };
  opportunity: {
    project?: string;
    location?: string;
    people?: string;
    dates?: string;
    duration?: string;
    reason: string;
  };
  evidence: {
    verified: { statement: string; source?: string; observedAt?: string }[];
    inference: string[];
    unknown: string[];
  };
  score: { total: number; max: number; tier: string; breakdown: { label: string; points: number; max: number; reason: string }[] };
  recurring: { value: string; reason: string };
  blackLineNotes?: string;
  contactHistory: { at: string; event: string; detail?: string }[];
};

export type HandoffReadiness = { ready: boolean; blockers: string[]; warnings: string[] };

/**
 * A lead is not handed over just because someone clicked a button. These are
 * the conditions that make a handoff worth Cambridge Mews' time.
 */
export function checkReadiness(lead: Lead, client: ClientConfig): HandoffReadiness {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (lead.approval !== "approved") blockers.push("The lead has not been approved by BlackLine.");
  if (lead.tier === "disqualified") blockers.push("The lead is disqualified.");
  if (lead.handoffSentAt) blockers.push(`Already sent to ${client.name} on ${lead.handoffSentAt.slice(0, 10)}.`);
  if (lead.evidence.filter((e) => e.kind === "verified").length === 0) {
    blockers.push("There is no verified evidence attached to this lead.");
  }

  if (lead.status !== "requirement_confirmed") {
    warnings.push(
      "The prospect has not confirmed a requirement yet. The pack will say so, but a confirmed requirement is worth much more to the client.",
    );
  }
  if (!lead.contact.email && !lead.contact.phone) {
    warnings.push("No direct contact details — the client will have no way to reach the prospect.");
  }
  if (client.routing.handoffRecipients.length === 0) {
    warnings.push(
      `No recipient is recorded for ${client.name}, so the pack has to be sent by hand. Record one in Settings.`,
    );
  }

  return { ready: blockers.length === 0, blockers, warnings };
}

export function buildPack(lead: Lead, client: ClientConfig): HandoffPack {
  const verified = lead.evidence.filter((e) => e.kind === "verified");
  const size = lead.qualification.groupSize;
  const duration = lead.qualification.duration;
  const recurring = assessRecurring(lead);

  const people = size.max ?? size.min;
  const peopleText = people
    ? `${size.min && size.max && size.min !== size.max ? `${size.min}–${size.max}` : people}${
        size.basis === "derived" ? " (derived from the roles advertised, not stated)" : ""
      }`
    : undefined;

  const dates = [lead.opportunity.startsOn, lead.opportunity.endsOn].filter(Boolean).join(" to ");

  return {
    generatedAt: new Date().toISOString(),
    from: {
      organisation: client.outreach.senderOrganisation,
      contact: client.outreach.senderName,
      email: client.outreach.senderEmail,
      phone: client.outreach.senderPhone,
    },
    to: { client: client.name, recipients: client.routing.handoffRecipients },
    prospect: {
      company: lead.company.name,
      website: lead.company.website,
      industry: lead.company.industry,
      name: lead.contact.name,
      role: lead.contact.role,
      email: lead.contact.email,
      phone: lead.contact.phone,
    },
    opportunity: {
      project: lead.opportunity.projectName,
      location: lead.opportunity.projectLocation,
      people: peopleText,
      dates: dates.length > 0 ? dates : undefined,
      duration: duration.weeks ? `About ${duration.weeks} weeks` : undefined,
      reason: lead.signalSummary,
    },
    evidence: {
      verified: verified.map((e) => ({ statement: e.statement, source: e.sourceUrl, observedAt: e.observedAt })),
      inference: lead.evidence.filter((e) => e.kind === "inference").map((e) => e.statement),
      unknown: lead.evidence.filter((e) => e.kind === "unknown").map((e) => e.statement),
    },
    score: {
      total: lead.score.total,
      max: lead.score.max,
      tier: TIER_LABELS[lead.tier].label,
      breakdown: lead.score.components.map((c) => ({ label: c.label, points: c.points, max: c.max, reason: c.reason })),
    },
    recurring,
    blackLineNotes: lead.notes,
    contactHistory: lead.history
      .filter((h) => h.actor !== "discovery")
      .map((h) => ({ at: h.at, event: h.event, detail: h.detail })),
  };
}

/** The same pack as plain text, for pasting into an email or a message. */
export function packToText(pack: HandoffPack): string {
  const lines: string[] = [];
  const section = (title: string) => lines.push("", title.toUpperCase(), "-".repeat(title.length));

  lines.push(`QUALIFIED ACCOMMODATION OPPORTUNITY — ${pack.prospect.company}`);
  lines.push(`Prepared by ${pack.from.organisation} for ${pack.to.client} on ${pack.generatedAt.slice(0, 10)}`);

  section("Prospect");
  lines.push(`Company: ${pack.prospect.company}`);
  if (pack.prospect.website) lines.push(`Website: ${pack.prospect.website}`);
  if (pack.prospect.industry) lines.push(`Industry: ${pack.prospect.industry}`);
  lines.push(`Contact: ${pack.prospect.name ?? "Not identified"}${pack.prospect.role ? `, ${pack.prospect.role}` : ""}`);
  lines.push(`Email: ${pack.prospect.email ?? "Not held"}`);
  lines.push(`Phone: ${pack.prospect.phone ?? "Not held"}`);

  section("Opportunity");
  lines.push(`Project: ${pack.opportunity.project ?? "Not named in the sources"}`);
  lines.push(`Location: ${pack.opportunity.location ?? "Not established"}`);
  lines.push(`Number of people: ${pack.opportunity.people ?? "Not established"}`);
  lines.push(`Dates: ${pack.opportunity.dates ?? "Not established"}`);
  lines.push(`Duration: ${pack.opportunity.duration ?? "Not established"}`);
  lines.push(`Why accommodation may be needed: ${pack.opportunity.reason}`);

  section("Verified evidence");
  if (pack.evidence.verified.length === 0) lines.push("None.");
  for (const item of pack.evidence.verified) {
    lines.push(`• ${item.statement}`);
    if (item.source) lines.push(`  Source: ${item.source}${item.observedAt ? ` (${item.observedAt})` : ""}`);
  }

  section("Our inference — not confirmed fact");
  if (pack.evidence.inference.length === 0) lines.push("None.");
  for (const item of pack.evidence.inference) lines.push(`• ${item}`);

  section("Not established");
  if (pack.evidence.unknown.length === 0) lines.push("Nothing outstanding was flagged.");
  for (const item of pack.evidence.unknown) lines.push(`• ${item}`);

  section("Lead score");
  lines.push(`${pack.score.total} / ${pack.score.max} — ${pack.score.tier}`);
  for (const c of pack.score.breakdown) {
    lines.push(`  ${c.label.padEnd(30)} ${String(c.points).padStart(2)}/${c.max}  ${c.reason}`);
  }

  section("Recurring potential");
  lines.push(`${pack.recurring.value.toUpperCase()} — ${pack.recurring.reason}`);

  if (pack.blackLineNotes) {
    section("BlackLine notes");
    lines.push(pack.blackLineNotes);
  }

  if (pack.contactHistory.length > 0) {
    section("What has happened so far");
    for (const h of pack.contactHistory) {
      lines.push(`${h.at.slice(0, 10)}  ${h.event}${h.detail ? ` — ${h.detail}` : ""}`);
    }
  }

  lines.push(
    "",
    `${pack.from.organisation} identified and qualified this opportunity. Availability, pricing, quoting and booking sit with ${pack.to.client}.`,
    `Questions: ${pack.from.contact} — ${pack.from.email} — ${pack.from.phone}`,
  );

  return lines.join("\n");
}
