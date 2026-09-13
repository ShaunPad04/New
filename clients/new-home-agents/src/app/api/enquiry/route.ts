import { NextResponse } from "next/server";

/**
 * Enquiry / valuation / registration delivery.
 *
 * Forwards a validated payload to ENQUIRY_WEBHOOK_URL (a CRM webhook, an
 * email service, Zapier…). Until that variable is configured this returns
 * 501 and the forms show the direct telephone and email routes. It never
 * fakes a success state, and no test submissions are sent anywhere.
 */
export const runtime = "nodejs";

const KINDS = new Set(["enquiry", "viewing", "valuation", "register"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const kind = String(body.kind ?? "");
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const honeypot = String(body.company ?? "");

  if (!KINDS.has(kind)) return NextResponse.json({ ok: false, error: "Unknown form." }, { status: 400 });
  if (honeypot) return NextResponse.json({ ok: true, delivered: false }, { status: 202 });
  if (name.length < 2) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 422 });
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
  if (phone && phone.replace(/\D/g, "").length < 9) return NextResponse.json({ ok: false, error: "Please enter a valid telephone number." }, { status: 422 });

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      { ok: false, delivered: false, error: "Form delivery is not configured on this preview." },
      { status: 501 }
    );
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, receivedAt: new Date().toISOString(), source: "newhomeagents-preview" }),
  });
  if (!res.ok) {
    return NextResponse.json({ ok: false, delivered: false, error: "The enquiry service did not accept the message." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
