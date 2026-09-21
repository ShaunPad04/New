import { getDb } from "./index";
import { newId } from "../domain/ids";

export type Notification = {
  id: string;
  clientId: string;
  leadId?: string;
  kind: "high_intent" | "follow_up" | "handoff" | "booking" | "run_failed" | "report";
  title: string;
  body: string;
  createdAt: string;
  readAt?: string;
  delivered: boolean;
  deliveryError?: string;
};

export function createNotification(
  input: Omit<Notification, "id" | "createdAt" | "delivered" | "readAt">,
): Notification {
  const notification: Notification = {
    ...input,
    id: newId("ntf"),
    createdAt: new Date().toISOString(),
    delivered: false,
  };
  getDb()
    .prepare(
      `INSERT INTO notifications (id, client_id, lead_id, kind, title, body, created_at, delivered, delivery_error)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    )
    .run(
      notification.id,
      notification.clientId,
      notification.leadId ?? null,
      notification.kind,
      notification.title,
      notification.body,
      notification.createdAt,
      notification.deliveryError ?? null,
    );
  return notification;
}

export function markDelivered(id: string, error?: string): void {
  getDb()
    .prepare("UPDATE notifications SET delivered = ?, delivery_error = ? WHERE id = ?")
    .run(error ? 0 : 1, error ?? null, id);
}

export function markRead(id: string): void {
  getDb().prepare("UPDATE notifications SET read_at = ? WHERE id = ?").run(new Date().toISOString(), id);
}

export function listNotifications(clientId: string, limit = 25): Notification[] {
  const rows = getDb()
    .prepare(
      `SELECT id, client_id, lead_id, kind, title, body, created_at, read_at, delivered, delivery_error
       FROM notifications WHERE client_id = ? ORDER BY created_at DESC LIMIT ?`,
    )
    .all(clientId, limit) as Record<string, string | number | null>[];
  return rows.map((r) => ({
    id: String(r.id),
    clientId: String(r.client_id),
    leadId: r.lead_id ? String(r.lead_id) : undefined,
    kind: String(r.kind) as Notification["kind"],
    title: String(r.title),
    body: String(r.body),
    createdAt: String(r.created_at),
    readAt: r.read_at ? String(r.read_at) : undefined,
    delivered: r.delivered === 1,
    deliveryError: r.delivery_error ? String(r.delivery_error) : undefined,
  }));
}

export function unreadCount(clientId: string): number {
  return (
    getDb()
      .prepare("SELECT COUNT(*) AS n FROM notifications WHERE client_id = ? AND read_at IS NULL")
      .get(clientId) as { n: number }
  ).n;
}
