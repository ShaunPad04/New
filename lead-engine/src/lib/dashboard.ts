import { countsByStatus, countsByTier, listLeads, revenueTotals, sourcePerformance } from "./db/leads";
import { listRuns } from "./db/runs";
import { listNotifications } from "./db/notifications";
import { FUNNEL } from "./domain/status";
import { totalFees } from "./revenue/commercial";
import { requireAnthropic, requireSearch, env } from "./env";
import type { ClientConfig } from "./clients/types";

export function buildDashboard(client: ClientConfig) {
  const tiers = countsByTier(client.id);
  const statuses = countsByStatus(client.id);
  const revenue = revenueTotals(client.id);
  const sources = sourcePerformance(client.id);
  const runs = listRuns(client.id, 5);
  const notifications = listNotifications(client.id, 8);

  const { leads: recent } = listLeads({ clientId: client.id, limit: 200, sort: "discovered" });
  const fees = totalFees(recent, client.commercial);

  const count = (statusList: readonly string[]) =>
    statusList.reduce((sum, status) => sum + (statuses[status] ?? 0), 0);

  const funnel = FUNNEL.map((stage) => ({
    key: stage.key,
    label: stage.label,
    count: count(stage.statuses),
  }));

  const discovered = funnel[0]?.count ?? 0;
  const booked = statuses["booked"] ?? 0;

  const needsReview = recent
    .filter((l) => l.approval === "pending" && (l.tier === "high_intent" || l.tier === "potential"))
    .sort((a, b) => b.score.total - a.score.total);

  return {
    tiers,
    statuses,
    revenue,
    sources,
    runs,
    notifications,
    funnel,
    fees,
    needsReview,
    newThisWeek: recent.filter((l) => Date.now() - Date.parse(l.discoveredAt) < 7 * 86_400_000).length,
    handedOff: recent.filter((l) => Boolean(l.handoffSentAt)).length,
    conversion: discovered === 0 ? 0 : booked / discovered,
    integrations: integrationStatus(),
  };
}

export type IntegrationStatus = {
  key: string;
  label: string;
  ready: boolean;
  detail: string;
};

/**
 * What the engine can and cannot currently do. Shown prominently, because a
 * lead-generation system that silently cannot search is worse than one that
 * says so.
 */
export function integrationStatus(): IntegrationStatus[] {
  const search = requireSearch();
  const anthropic = requireAnthropic();
  return [
    {
      key: "search",
      label: "Search provider",
      ready: search.configured,
      detail: search.configured
        ? `${env.search.provider} configured.`
        : search.reason,
    },
    {
      key: "anthropic",
      label: "Evidence extraction",
      ready: anthropic.configured,
      detail: anthropic.configured
        ? `${env.anthropic.model} configured.`
        : anthropic.reason,
    },
    {
      key: "notifications",
      label: "Alert delivery",
      ready: Boolean(env.notifications.webhookUrl),
      detail: env.notifications.webhookUrl
        ? "Alerts are pushed to the configured webhook."
        : "NOTIFY_WEBHOOK_URL is not set — alerts appear in the app only.",
    },
    {
      key: "cron",
      label: "Scheduled discovery",
      ready: Boolean(env.cronSecret),
      detail: env.cronSecret
        ? "CRON_SECRET is set, so /api/cron/* can be called by a scheduler."
        : "CRON_SECRET is not set, so the scheduled endpoints reject every request.",
    },
  ];
}
