import { NextResponse } from "next/server";
import { site } from "@/lib/content";

/**
 * Enquiry delivery endpoint.
 *
 * Two delivery routes, tried in order:
 *
 *   1. RESEND_API_KEY  → sends the enquiry as an email to ENQUIRY_EMAIL_TO
 *                        (defaults to the studio address in content.ts),
 *                        with Reply-To set to the enquirer so hitting reply
 *                        in the inbox answers them directly.
 *   2. ENQUIRY_WEBHOOK_URL → POSTs the JSON to a CRM or automation endpoint.
 *
 * If neither is configured this returns 501 and the UI shows the direct email
 * address. There is deliberately NO fallback that pretends to succeed: a form
 * returning 200 without delivering anywhere loses real enquiries silently,
 * and nothing in the interface reveals it.
 *
 * Resend is called over plain fetch rather than through its SDK — one HTTP
 * POST does not justify a dependency, and the API surface used here has been
 * stable for years.
 */

const MAX_FIELD = 5000;
const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * RATE LIMIT.
 *
 * This is a public, unauthenticated endpoint that causes an email to be
 * sent. Unthrottled, a script can flood the inbox, exhaust the Resend
 * allowance, and — the part that actually costs money — get
 * blacklineagency.co.uk scored as a spam source, which degrades delivery of
 * every real client email sent from the domain afterwards.
 *
 * WHAT THIS IS AND IS NOT. The counter lives in the memory of one serverless
 * instance, so it limits a burst from one address to one instance. Vercel
 * may run several, and an idle instance is discarded, so a determined
 * attacker spreading requests across instances and addresses is NOT stopped
 * by this. It is a cheap floor that removes the trivial case — a loop from
 * one machine — and nothing more.
 *
 * THE REAL CONTROL IS THE PLATFORM, and it belongs in the Vercel dashboard
 * rather than here: Firewall -> Rate limiting, scoped to /api/enquiry. That
 * runs at the edge, before a function is invoked, and holds across
 * instances. This code is the belt; that is the braces, and it has not been
 * configured yet.
 *
 * The window is deliberately generous. A real person sending a second
 * enquiry, or correcting a typo and resubmitting, must never be blocked —
 * a false positive here is a lost client, which is worse than the spam.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_KEYS = 5000;

const hits = new Map<string, number[]>();

/**
 * The caller's address, taken from the proxy headers Vercel sets.
 *
 * `x-forwarded-for` is client-controlled on an unproxied origin, so this
 * would be trivially spoofable if the app were exposed directly. Behind
 * Vercel the platform overwrites it, and the LEFTMOST entry is the real
 * client. Returning a constant when there is no header means a local or
 * direct-origin deployment throttles everyone together rather than failing
 * open, which is the safer direction to be wrong in.
 */
function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(request: Request): boolean {
  const key = clientKey(request);
  const now = Date.now();

  /* Unbounded growth is a memory leak an attacker can drive with spoofed
     addresses, so the map is cleared wholesale once it is implausibly
     large. Dropping every counter is acceptable: the window is ten minutes
     and the cost of a reset is a handful of extra allowed requests. */
  if (hits.size > RATE_LIMIT_MAX_KEYS) hits.clear();

  const recent = (hits.get(key) ?? []).filter(
    (at) => now - at < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  return false;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD) : "";
}

/**
 * Escape anything that reaches the HTML body of the notification.
 *
 * The enquirer controls every one of these strings. Without escaping, a brief
 * containing markup would render as markup in our own inbox — and a mail
 * client is a browser.
 */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Strip CR/LF from anything interpolated into a header-like field. A newline
 * in the subject or reply-to is the classic header-injection vector.
 */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Mirrors the <option> values in components/contact.tsx, which are the
 * published build tiers. A key that is missing here is not a crash — the
 * notification email would print the raw slug — so change both together.
 */
const BUDGET_LABELS: Record<string, string> = {
  "under-1400": "Under £1,400",
  "1400-2500": "£1,400 – £2,500",
  "2500-4500": "£2,500 – £4,500",
  "4500-6000": "£4,500 – £6,000",
  "6000+": "£6,000+",
  unsure: "Not sure yet",
};

type Enquiry = {
  name: string;
  email: string;
  budget: string;
  brief: string;
  receivedAt: string;
};

async function sendEmail(enquiry: Enquiry, apiKey: string): Promise<void> {
  const to = process.env.ENQUIRY_EMAIL_TO || site.email;

  /*
    Resend will only send from a domain verified in the account, and
    blacklineagency.co.uk was verified on 2026-09-14 (DKIM at
    `resend._domainkey`, SPF on the `send` subdomain, all three green).

    This used to default to `onboarding@resend.dev`, Resend's shared sandbox
    sender, with a note saying "until the domain is verified". That default
    does not merely look unbranded — it CANNOT REACH ANYONE. Resend restricts
    the sandbox sender to the account owner's own address and answers 403
    for every other recipient, which is precisely what the first live test
    returned. Left in place it would have meant a form that looked wired up
    and delivered nothing.

    `enquiries@` does not need to be a real mailbox: the reply-to is set to
    the enquirer, so hitting reply in the inbox answers them, and nothing is
    expected to arrive at this address.
  */
  const from =
    process.env.ENQUIRY_EMAIL_FROM ||
    `${site.name} <enquiries@blacklineagency.co.uk>`;

  /* Only a known key becomes a label. It used to fall back to the raw value,
     which put up to 5,000 characters of attacker-controlled text into the
     SUBJECT LINE of an email we send ourselves. `headerSafe` kept that from
     becoming header injection, but the subject was still whatever a stranger
     typed. An unrecognised value is now simply absent — see POST, which
     rejects it before this is reached. */
  const budgetLabel = Object.hasOwn(BUDGET_LABELS, enquiry.budget)
    ? BUDGET_LABELS[enquiry.budget]
    : "";

  const rows: [string, string][] = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Budget", budgetLabel || "Not given"],
    ["Received", new Date(enquiry.receivedAt).toUTCString()],
  ];

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Brief:",
    enquiry.brief,
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px;font-size:18px">New enquiry from the website</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <h3 style="margin:24px 0 8px;font-size:15px">Brief</h3>
      <p style="margin:0;white-space:pre-wrap">${esc(enquiry.brief)}</p>
    </div>
  `;

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: headerSafe(enquiry.email),
      subject: headerSafe(
        `Website enquiry — ${enquiry.name}${budgetLabel ? ` (${budgetLabel})` : ""}`,
      ),
      text,
      html,
    }),
  });

  if (!res.ok) {
    // The body carries Resend's reason (unverified domain, bad key). It goes
    // to the server log, never to the browser.
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 500)}`);
  }
}

async function sendWebhook(enquiry: Enquiry, endpoint: string): Promise<void> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enquiry),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

export async function POST(request: Request) {
  /* Before the body is even read: a rejected caller should cost us a header
     lookup, not a JSON parse of whatever they chose to send. 429 with
     Retry-After is the correct answer — it tells a real client when to come
     back, and it tells us, in the logs, that this fired. */
  if (rateLimited(request)) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
        },
      },
    );
  }

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

  /* Budget is a <select>, so the only legitimate values are the option keys.
     Anything else was hand-crafted rather than chosen, and the field's only
     destination is an email subject and our own inbox — so an unknown value
     is rejected outright rather than passed along. Empty stays allowed: the
     select has no forced choice and the field is optional. */
  /* `Object.hasOwn`, NOT `budget in BUDGET_LABELS`. `in` walks the prototype
     chain, so "toString", "constructor" and "valueOf" would all pass the
     check — and the lookup below would then hand back a FUNCTION where a
     label was expected and stringify it into the email subject. */
  if (budget && !Object.hasOwn(BUDGET_LABELS, budget)) {
    return NextResponse.json(
      { error: "Please choose one of the listed budget ranges." },
      { status: 400 }
    );
  }

  const enquiry: Enquiry = {
    name,
    email,
    budget,
    brief,
    receivedAt: new Date().toISOString(),
  };

  const apiKey = process.env.RESEND_API_KEY;
  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;

  if (!apiKey && !endpoint) {
    return NextResponse.json(
      {
        error: `Our enquiry form is not connected yet — please email us directly at ${site.email}.`,
      },
      { status: 501 }
    );
  }

  try {
    if (apiKey) await sendEmail(enquiry, apiKey);
    if (endpoint) await sendWebhook(enquiry, endpoint);
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Logged for us, never surfaced: the provider's message can name the
    // sending domain and the account, which is not the enquirer's business.
    console.error("[enquiry] delivery failed", error);
    return NextResponse.json(
      {
        error: `We could not send that. Please email us directly at ${site.email}.`,
      },
      { status: 502 }
    );
  }
}
