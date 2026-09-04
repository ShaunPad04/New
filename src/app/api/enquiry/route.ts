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

const BUDGET_LABELS: Record<string, string> = {
  "1500-3500": "£1,500 – £3,500",
  "3500-6000": "£3,500 – £6,000",
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

  // Resend will only send from a domain verified in the account. Until
  // blacklineagency.co.uk is verified there, onboarding@resend.dev is the
  // one address every account can send from, so it is the default.
  const from =
    process.env.ENQUIRY_EMAIL_FROM ||
    `${site.name} Website <onboarding@resend.dev>`;

  const budgetLabel = BUDGET_LABELS[enquiry.budget] ?? enquiry.budget ?? "";

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
