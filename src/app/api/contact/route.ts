import { NextResponse } from "next/server";

/**
 * Enquiry endpoint. It never fakes a successful send: if no delivery target is
 * configured it returns 501 so the front end can tell the visitor to call or
 * email instead. Set CONTACT_WEBHOOK_URL (e.g. a form-to-email service) to
 * enable delivery.
 */
export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  website?: string; // honeypot
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: silently accept and drop bot submissions.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  const phone = (body.phone || "").trim();

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please tell us your name.";
  if (!email) errors.email = "Please add an email address.";
  else if (!isEmail(email)) errors.email = "That email address doesn’t look right.";
  if (!message) errors.message = "Please add a short message.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please check the form.", errors }, { status: 422 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      {
        error:
          "The enquiry form isn’t connected yet. Please call 07873 220636 to reach us in the meantime.",
      },
      { status: 501 },
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source: "zendenconcept",
        name,
        email,
        phone,
        message,
        receivedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch {
    return NextResponse.json(
      { error: "We couldn’t send your message just now. Please call 07873 220636." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
