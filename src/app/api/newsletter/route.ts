import { NextResponse } from "next/server";

/**
 * NEWSLETTER SIGN-UP (Brad, 2026-09-26: "set up a real newsletter").
 *
 * Adds the address to the "Newsletter" segment in the studio's Resend
 * account. Server-side only — the browser talks to this route and nothing
 * else, so the site still makes no third-party request from the page and
 * sets no cookie (asserted by the test suite).
 *
 * Consent is the lawful basis (UK GDPR Art. 6(1)(a); PECR reg. 22 for the
 * emails themselves): the form states plainly what the subscriber agrees to
 * and how to leave, and the route refuses a submission without the explicit
 * `consent: true` the form sends. The privacy policy's newsletter section
 * (src/lib/legal.ts) describes exactly this.
 *
 * Honest failure, like /api/enquiry: 501 when the key is missing — never a
 * fake success — and a generic 502 if Resend refuses. The response never
 * says whether an address was already subscribed.
 */

const RESEND = "https://api.resend.com";
/** The "Newsletter" segment, created 2026-09-26. Not a secret; override
    with RESEND_NEWSLETTER_SEGMENT_ID if the segment is ever recreated. */
const DEFAULT_SEGMENT = "4837f34e-a0b7-4cba-89df-341fc12fc9f6";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_KEYS = 5000;
const hits = new Map<string, number[]>();

function rateLimited(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  if (hits.size > RATE_LIMIT_MAX_KEYS) hits.clear();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

/** Deliberately plain: one @, something either side, a dot in the domain. */
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,63}$/;

export async function POST(request: Request) {
  if (rateLimited(request)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;

  // Honeypot: a field real visitors never see. Filled means a bot; answer
  // as if it worked so the bot learns nothing.
  if (typeof b.company === "string" && b.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase().slice(0, 320) : "";
  if (!EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }
  if (b.consent !== true) {
    return NextResponse.json({ ok: false, error: "Please confirm you want to receive the newsletter." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "Sign-up is not available right now." }, { status: 501 });
  }
  const segment = process.env.RESEND_NEWSLETTER_SEGMENT_ID || DEFAULT_SEGMENT;
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };

  try {
    // New contact, straight into the segment.
    const created = await fetch(`${RESEND}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, unsubscribed: false, segments: [{ id: segment }] }),
      signal: AbortSignal.timeout(10_000),
    });
    if (created.ok) return NextResponse.json({ ok: true });

    // Already a contact (e.g. from elsewhere): add them to the segment.
    // Either way the visitor sees the same success.
    const added = await fetch(`${RESEND}/contacts/${encodeURIComponent(email)}/segments/${segment}`, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(10_000),
    });
    if (added.ok) return NextResponse.json({ ok: true });

    console.error("[newsletter] Resend refused", created.status, added.status);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again later." }, { status: 502 });
  } catch (err) {
    console.error("[newsletter] request failed", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again later." }, { status: 502 });
  }
}
