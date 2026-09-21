import { env } from "../env";
import { createNotification, markDelivered } from "../db/notifications";
import { TIER_LABELS } from "../domain/scoring";
import type { Notification } from "../db/notifications";
import type { Lead } from "../domain/types";

/**
 * Notifications are always recorded in the database first, then pushed to a
 * webhook if one is configured. A failed push is recorded against the row —
 * it never silently disappears, and it never stops the discovery run.
 */
export function notifyHighIntent(lead: Lead): Notification {
  const size = lead.qualification.groupSize.max ?? lead.qualification.groupSize.min;
  const lines = [
    `${lead.company.name}`,
    size ? `${size} people` : undefined,
    lead.opportunity.projectLocation ? `${lead.opportunity.projectLocation}` : undefined,
    lead.qualification.duration.weeks ? `${lead.qualification.duration.weeks}-week timeframe` : undefined,
    `Lead score: ${lead.score.total}`,
    lead.contact.name ? `Decision maker identified: ${lead.contact.name}${lead.contact.role ? ` (${lead.contact.role})` : ""}` : "No named contact yet",
  ].filter(Boolean);

  const notification = createNotification({
    clientId: lead.clientId,
    leadId: lead.id,
    kind: "high_intent",
    title: `${TIER_LABELS[lead.tier].mark} New accommodation opportunity — ${lead.company.name}`,
    body: lines.join("\n"),
  });

  void deliver(notification);
  return notification;
}

export function notify(input: Omit<Notification, "id" | "createdAt" | "delivered" | "readAt">): Notification {
  const notification = createNotification(input);
  void deliver(notification);
  return notification;
}

async function deliver(notification: Notification): Promise<void> {
  const url = env.notifications.webhookUrl;
  if (!url) {
    markDelivered(notification.id, "No NOTIFY_WEBHOOK_URL configured — the alert is in the app only.");
    return;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: notification.kind,
        title: notification.title,
        body: notification.body,
        leadId: notification.leadId,
        createdAt: notification.createdAt,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    markDelivered(notification.id, response.ok ? undefined : `Webhook returned ${response.status}`);
  } catch (error) {
    markDelivered(notification.id, error instanceof Error ? error.message : "Delivery failed");
  }
}
