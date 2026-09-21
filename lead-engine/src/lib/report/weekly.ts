import { leadsDiscoveredSince, leadsNeedingFollowUp, listLeads, sourcePerformance } from "../db/leads";
import { SOURCE_TYPE_LABELS } from "../domain/types";
import { totalFees, formatMoney, describeModel } from "../revenue/commercial";
import { assessRecurring } from "../domain/recurring";
import type { ClientConfig } from "../clients/types";
import type { Lead } from "../domain/types";

export type WeeklyReport = {
  clientId: string;
  from: string;
  to: string;
  newLeads: number;
  highIntent: Lead[];
  contacted: number;
  handedOff: Lead[];
  bookings: Lead[];
  bookingRevenue: number;
  blackLineFee: { total: number; currency: string; note?: string };
  bestSource?: { label: string; leads: number; booked: number };
  recurringOpportunities: { lead: Lead; reason: string }[];
  needingFollowUp: Lead[];
  commercialModel: string;
};

export function buildWeeklyReport(client: ClientConfig, days = 7): WeeklyReport {
  const to = new Date();
  const from = new Date(to.getTime() - days * 86_400_000);
  const fromIso = from.toISOString();

  const discovered = leadsDiscoveredSince(client.id, fromIso);
  const { leads: all } = listLeads({ clientId: client.id, limit: 500 });

  // Dates arrive in two shapes: full timestamps (handoffSentAt) and plain
  // YYYY-MM-DD (bookedOn). Comparing those as strings puts a booking made on
  // the first day of the window just outside it, so both are parsed.
  const fromTime = from.getTime();
  const inWindow = (value?: string) => {
    if (!value) return false;
    const parsed = Date.parse(value);
    return !Number.isNaN(parsed) && parsed >= fromTime;
  };

  const handedOff = all.filter((l) => inWindow(l.handoffSentAt));
  const bookings = all.filter((l) => l.status === "booked" && inWindow(l.booking?.bookedOn ?? l.updatedAt));
  const contacted = all.filter((l) =>
    l.history.some((h) => h.at >= fromIso && h.event.startsWith("status → contacted")),
  ).length;

  const performance = sourcePerformance(client.id);
  const ranked = [...performance].sort((a, b) => b.booked - a.booked || b.handedOff - a.handedOff || b.leads - a.leads);
  const best = ranked[0];

  const fees = totalFees([...handedOff, ...bookings], client.commercial);

  const recurring = all
    .filter((l) => l.tier !== "disqualified")
    .map((lead) => ({ lead, assessment: assessRecurring(lead) }))
    .filter((entry) => entry.assessment.value === "yes")
    .slice(0, 10)
    .map((entry) => ({ lead: entry.lead, reason: entry.assessment.reason }));

  return {
    clientId: client.id,
    from: fromIso,
    to: to.toISOString(),
    newLeads: discovered.length,
    highIntent: discovered.filter((l) => l.tier === "high_intent"),
    contacted,
    handedOff,
    bookings,
    bookingRevenue: bookings.reduce((sum, l) => sum + (l.booking?.value ?? 0), 0),
    blackLineFee: {
      total: fees.total,
      currency: fees.currency,
      note: fees.reason ?? (fees.uncalculable > 0 ? `${fees.uncalculable} lead(s) could not be costed.` : undefined),
    },
    bestSource: best ? { label: SOURCE_TYPE_LABELS[best.sourceType], leads: best.leads, booked: best.booked } : undefined,
    recurringOpportunities: recurring,
    needingFollowUp: leadsNeedingFollowUp(client.id, new Date().toISOString().slice(0, 10)),
    commercialModel: describeModel(client.commercial),
  };
}

export function reportToText(report: WeeklyReport, clientName: string): string {
  const lines: string[] = [];
  lines.push(`BLACKLINE LEAD REPORT — ${clientName}`);
  lines.push(`${report.from.slice(0, 10)} to ${report.to.slice(0, 10)}`);
  lines.push("");
  lines.push(`New opportunities:        ${report.newLeads}`);
  lines.push(`High intent:              ${report.highIntent.length}`);
  lines.push(`Leads contacted:          ${report.contacted}`);
  lines.push(`Handed to ${clientName}:  ${report.handedOff.length}`);
  lines.push(`Bookings:                 ${report.bookings.length}`);
  lines.push(`Booking revenue:          ${formatMoney(report.bookingRevenue)}`);
  lines.push(
    `BlackLine fee:            ${report.blackLineFee.note ?? formatMoney(report.blackLineFee.total, report.blackLineFee.currency)}`,
  );
  lines.push(`Commercial model:         ${report.commercialModel}`);

  if (report.bestSource) {
    lines.push("");
    lines.push(`Best performing source:   ${report.bestSource.label} (${report.bestSource.leads} leads, ${report.bestSource.booked} booked)`);
  }

  if (report.highIntent.length > 0) {
    lines.push("", "HIGH-INTENT LEADS", "-----------------");
    for (const lead of report.highIntent) {
      lines.push(`${lead.score.total}/100  ${lead.company.name} — ${lead.opportunity.projectLocation ?? "location not established"}`);
    }
  }

  if (report.recurringOpportunities.length > 0) {
    lines.push("", "RECURRING OPPORTUNITIES", "-----------------------");
    for (const entry of report.recurringOpportunities) {
      lines.push(`${entry.lead.company.name} — ${entry.reason}`);
    }
  }

  if (report.needingFollowUp.length > 0) {
    lines.push("", "NEEDS FOLLOW-UP", "---------------");
    for (const lead of report.needingFollowUp) {
      lines.push(`${lead.nextFollowUpOn}  ${lead.company.name} (${lead.status})`);
    }
  }

  return lines.join("\n");
}
