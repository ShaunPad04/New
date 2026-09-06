import { NextResponse } from "next/server";

/**
 * Enquiry delivery.
 *
 * There is no inbox wired up on a pitch build. Rather than accept a message
 * and drop it — which looks like success and loses a real enquiry — this
 * returns 501 until ENQUIRY_WEBHOOK_URL is configured. The form reports that
 * honestly and offers the phone number and email address instead.
 *
 * It never fakes a send.
 */

const MAX_FIELD = 2000;

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

function asField(value: unknown, limit = MAX_FIELD): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > limit) return null;
  return trimmed;
}

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const name = asField(body.name, 200);
  const email = asField(body.email, 320);
  const message = asField(body.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are all required." },
      { status: 400 }
    );
  }

  // Deliberately permissive. Rejecting valid-but-unusual addresses loses real
  // enquiries, and the only authoritative test is delivery.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 }
    );
  }

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;

  if (!webhook) {
    return NextResponse.json(
      {
        error:
          "Enquiries are not connected on this preview. Please call or email us directly.",
      },
      { status: 501 }
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      // Upstream failed. Say so — do not report a success we did not get.
      return NextResponse.json(
        { error: "We could not send that just now. Please call or email us." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "We could not send that just now. Please call or email us." },
      { status: 502 }
    );
  }
}
