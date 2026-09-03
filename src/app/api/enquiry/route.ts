import { NextResponse } from "next/server";
import { site } from "@/lib/content";

/**
 * Enquiry delivery endpoint.
 *
 * There is deliberately NO fallback that pretends to succeed. Until a real
 * delivery provider is configured this returns 501 and the UI shows the
 * direct email address instead. A form that returns 200 without delivering
 * anywhere loses real enquiries silently, and nothing in the interface
 * reveals it.
 *
 * TO WIRE UP (developer task, not a content placeholder):
 *   1. Choose a provider (Resend, Postmark, SendGrid, or a CRM webhook).
 *   2. Set ENQUIRY_WEBHOOK_URL — or replace the forward() call below with
 *      that provider's SDK.
 *   3. Add the secret in the Vercel dashboard, never in the repository.
 */

const MAX_FIELD = 5000;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD) : "";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot. Return 200 so the bot does
  // not learn it was caught, but deliver nothing.
  if (clean(payload["company-website"])) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name);
  const email = clean(payload.email);
  const brief = clean(payload.brief);
  const budget = clean(payload.budget);

  if (!name || !email || !brief) {
    return NextResponse.json(
      { error: "Please complete your name, email and a short brief." },
      { status: 400 }
    );
  }

  // Server-side validation — the client `type="email"` check is a
  // convenience, not a guarantee.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 }
    );
  }

  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;

  if (!endpoint) {
    return NextResponse.json(
      {
        error: `Our enquiry form is not connected yet — please email us directly at ${site.email}.`,
      },
      { status: 501 }
    );
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        budget,
        brief,
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) throw new Error(`Delivery failed: ${res.status}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error: `We could not send that. Please email us directly at ${site.email}.`,
      },
      { status: 502 }
    );
  }
}
