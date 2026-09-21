import { getClient } from "@/lib/clients";
import { listLeads } from "@/lib/db/leads";
import { authoriseCron, json } from "@/lib/api";
import { TIERS, PIPELINE_STATUSES, CLOSED_STATUSES } from "@/lib/domain/types";
import type { LeadStatus, Tier } from "@/lib/domain/types";

/**
 * Read-only export of the lead database, for anything outside this app that
 * needs it. It is behind the same shared secret as the scheduled endpoints.
 */
export async function GET(request: Request) {
  const auth = authoriseCron(request);
  if (!auth.ok) return json({ ok: false, error: auth.message }, auth.status);

  const url = new URL(request.url);
  const client = getClient();

  const tier = url.searchParams.get("tier");
  const status = url.searchParams.get("status");
  const minScore = url.searchParams.get("minScore");
  const allStatuses = [...PIPELINE_STATUSES, ...CLOSED_STATUSES] as readonly string[];

  const { leads, total } = listLeads({
    clientId: client.id,
    tier: tier && (TIERS as readonly string[]).includes(tier) ? [tier as Tier] : undefined,
    status: status && allStatuses.includes(status) ? [status as LeadStatus] : undefined,
    minScore: minScore ? Number(minScore) : undefined,
    limit: Math.min(Number(url.searchParams.get("limit")) || 100, 500),
    offset: Number(url.searchParams.get("offset")) || 0,
  });

  return json({ ok: true, total, count: leads.length, leads });
}
