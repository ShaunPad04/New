import { getDb } from "./index";
import { canTransition } from "../domain/status";
import type { Lead, LeadStatus, SourceType, Tier } from "../domain/types";

type Row = { doc: string };

function hydrate(row: Row): Lead {
  return JSON.parse(row.doc) as Lead;
}

function columns(lead: Lead): Record<string, string | number | null> {
  return {
    id: lead.id,
    client_id: lead.clientId,
    dedupe_key: lead.dedupeKey,
    source_type: lead.sourceType,
    company_name: lead.company.name,
    company_website: lead.company.website ?? null,
    company_industry: lead.company.industry ?? null,
    company_location: lead.company.location ?? null,
    contact_name: lead.contact.name ?? null,
    contact_role: lead.contact.role ?? null,
    contact_email: lead.contact.email ?? null,
    contact_phone: lead.contact.phone ?? null,
    project_name: lead.opportunity.projectName ?? null,
    project_location: lead.opportunity.projectLocation ?? null,
    score_total: lead.score.total,
    tier: lead.tier,
    status: lead.status,
    approval: lead.approval,
    next_follow_up_on: lead.nextFollowUpOn ?? null,
    handoff_sent_at: lead.handoffSentAt ?? null,
    booking_value: lead.booking?.value ?? null,
    booking_currency: lead.booking?.currency ?? null,
    booking_nights: lead.booking?.nights ?? null,
    booking_guests: lead.booking?.guests ?? null,
    booked_on: lead.booking?.bookedOn ?? null,
    discovered_at: lead.discoveredAt,
    updated_at: lead.updatedAt,
    doc: JSON.stringify(lead),
  };
}

const UPSERT_COLUMNS = [
  "id", "client_id", "dedupe_key", "source_type", "company_name", "company_website",
  "company_industry", "company_location", "contact_name", "contact_role", "contact_email",
  "contact_phone", "project_name", "project_location", "score_total", "tier", "status",
  "approval", "next_follow_up_on", "handoff_sent_at", "booking_value", "booking_currency",
  "booking_nights", "booking_guests", "booked_on", "discovered_at", "updated_at", "doc",
] as const;

export function saveLead(lead: Lead): Lead {
  const db = getDb();
  const values = columns(lead);
  const placeholders = UPSERT_COLUMNS.map((c) => `$${c}`).join(", ");
  const updates = UPSERT_COLUMNS.filter((c) => c !== "id")
    .map((c) => `${c} = excluded.${c}`)
    .join(", ");
  db.prepare(
    `INSERT INTO leads (${UPSERT_COLUMNS.join(", ")}) VALUES (${placeholders})
     ON CONFLICT (id) DO UPDATE SET ${updates}`,
  ).run(Object.fromEntries(UPSERT_COLUMNS.map((c) => [c, values[c] ?? null])));
  return lead;
}

export function getLead(id: string): Lead | undefined {
  const row = getDb().prepare("SELECT doc FROM leads WHERE id = ?").get(id) as Row | undefined;
  return row ? hydrate(row) : undefined;
}

export function findByDedupeKey(clientId: string, key: string): Lead | undefined {
  const row = getDb()
    .prepare("SELECT doc FROM leads WHERE client_id = ? AND dedupe_key = ?")
    .get(clientId, key) as Row | undefined;
  return row ? hydrate(row) : undefined;
}

export type LeadQuery = {
  clientId: string;
  tier?: Tier[];
  status?: LeadStatus[];
  sourceType?: SourceType[];
  minScore?: number;
  search?: string;
  approval?: Lead["approval"];
  handedOff?: boolean;
  sort?: "score" | "discovered" | "updated";
  limit?: number;
  offset?: number;
};

export function listLeads(query: LeadQuery): { leads: Lead[]; total: number } {
  const db = getDb();
  const where: string[] = ["client_id = ?"];
  const params: (string | number)[] = [query.clientId];

  const inClause = (column: string, values: string[] | undefined) => {
    if (!values || values.length === 0) return;
    where.push(`${column} IN (${values.map(() => "?").join(", ")})`);
    params.push(...values);
  };
  inClause("tier", query.tier);
  inClause("status", query.status);
  inClause("source_type", query.sourceType);

  if (query.minScore !== undefined) {
    where.push("score_total >= ?");
    params.push(query.minScore);
  }
  if (query.approval) {
    where.push("approval = ?");
    params.push(query.approval);
  }
  if (query.handedOff !== undefined) {
    where.push(query.handedOff ? "handoff_sent_at IS NOT NULL" : "handoff_sent_at IS NULL");
  }
  if (query.search) {
    where.push(
      "(company_name LIKE ? OR project_name LIKE ? OR project_location LIKE ? OR contact_name LIKE ? OR company_industry LIKE ?)",
    );
    const like = `%${query.search}%`;
    params.push(like, like, like, like, like);
  }

  const sort =
    query.sort === "discovered"
      ? "discovered_at DESC"
      : query.sort === "updated"
        ? "updated_at DESC"
        : "score_total DESC, discovered_at DESC";

  const clause = where.join(" AND ");
  const total = (
    db.prepare(`SELECT COUNT(*) AS n FROM leads WHERE ${clause}`).get(...params) as { n: number }
  ).n;

  const limit = Math.min(query.limit ?? 100, 500);
  const offset = query.offset ?? 0;
  const rows = db
    .prepare(`SELECT doc FROM leads WHERE ${clause} ORDER BY ${sort} LIMIT ? OFFSET ?`)
    .all(...params, limit, offset) as Row[];

  return { leads: rows.map(hydrate), total };
}

export function appendHistory(lead: Lead, actor: string, event: string, detail?: string): Lead {
  return {
    ...lead,
    updatedAt: new Date().toISOString(),
    history: [...lead.history, { at: new Date().toISOString(), actor, event, detail }],
  };
}

export class TransitionError extends Error {}

export function setStatus(lead: Lead, status: LeadStatus, actor: string, detail?: string): Lead {
  const check = canTransition(lead.status, status);
  if (!check.ok) throw new TransitionError(check.reason);
  const next = appendHistory({ ...lead, status }, actor, `status → ${status}`, detail);
  return saveLead(next);
}

export function countsByTier(clientId: string): Record<Tier, number> {
  const rows = getDb()
    .prepare("SELECT tier, COUNT(*) AS n FROM leads WHERE client_id = ? GROUP BY tier")
    .all(clientId) as { tier: Tier; n: number }[];
  const out: Record<Tier, number> = { high_intent: 0, potential: 0, prospect: 0, disqualified: 0 };
  for (const row of rows) out[row.tier] = row.n;
  return out;
}

export function countsByStatus(clientId: string): Record<string, number> {
  const rows = getDb()
    .prepare("SELECT status, COUNT(*) AS n FROM leads WHERE client_id = ? GROUP BY status")
    .all(clientId) as { status: string; n: number }[];
  return Object.fromEntries(rows.map((r) => [r.status, r.n]));
}

export type SourcePerformance = {
  sourceType: SourceType;
  leads: number;
  qualified: number;
  handedOff: number;
  booked: number;
  bookingRevenue: number;
};

export function sourcePerformance(clientId: string): SourcePerformance[] {
  const rows = getDb()
    .prepare(
      `SELECT source_type AS sourceType,
              COUNT(*) AS leads,
              SUM(CASE WHEN tier IN ('high_intent','potential') THEN 1 ELSE 0 END) AS qualified,
              SUM(CASE WHEN handoff_sent_at IS NOT NULL THEN 1 ELSE 0 END) AS handedOff,
              SUM(CASE WHEN status = 'booked' THEN 1 ELSE 0 END) AS booked,
              COALESCE(SUM(CASE WHEN status = 'booked' THEN booking_value ELSE 0 END), 0) AS bookingRevenue
       FROM leads WHERE client_id = ? GROUP BY source_type ORDER BY leads DESC`,
    )
    .all(clientId) as SourcePerformance[];
  return rows;
}

export function leadsDiscoveredSince(clientId: string, isoDate: string): Lead[] {
  const rows = getDb()
    .prepare("SELECT doc FROM leads WHERE client_id = ? AND discovered_at >= ? ORDER BY score_total DESC")
    .all(clientId, isoDate) as Row[];
  return rows.map(hydrate);
}

export function leadsNeedingFollowUp(clientId: string, onOrBefore: string): Lead[] {
  const rows = getDb()
    .prepare(
      `SELECT doc FROM leads
       WHERE client_id = ? AND next_follow_up_on IS NOT NULL AND next_follow_up_on <= ?
         AND status NOT IN ('booked','lost','not_qualified','no_response','duplicate','not_suitable')
       ORDER BY next_follow_up_on ASC`,
    )
    .all(clientId, onOrBefore) as Row[];
  return rows.map(hydrate);
}

export function revenueTotals(clientId: string): { bookings: number; bookingRevenue: number; nights: number; guests: number } {
  const row = getDb()
    .prepare(
      `SELECT COUNT(*) AS bookings,
              COALESCE(SUM(booking_value), 0) AS bookingRevenue,
              COALESCE(SUM(booking_nights), 0) AS nights,
              COALESCE(SUM(booking_guests), 0) AS guests
       FROM leads WHERE client_id = ? AND status = 'booked'`,
    )
    .get(clientId) as { bookings: number; bookingRevenue: number; nights: number; guests: number };
  return row;
}
