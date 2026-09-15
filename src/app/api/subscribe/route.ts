import { NextResponse } from "next/server";

/**
 * Newsletter subscription endpoint.
 *
 * Built 2026-09-15 with the footer redesign, and it follows the same contract
 * as `/api/enquiry`: if delivery is not configured it returns 501 and says so,
 * and there is deliberately NO path that returns 200 without doing anything.
 * A subscribe box that thanks you and drops the address is worse than no box —
 * the reader believes they are on a list they are not on.
 *
 * ── WHAT THIS NEEDS BEFORE IT WORKS ──────────────────────────────────────
 *
 *   RESEND_API_KEY      already set in Vercel for the enquiry form.
 *   RESEND_AUDIENCE_ID  NOT set. Create an Audience in Resend and paste its
 *                       id. Until then this returns 501 and the form tells
 *                       the reader to email us instead.
 *
 * ── WHAT IS NOT OPTIONAL, LEGALLY ────────────────────────────────────────
 *
 * This is the first thing on the site that collects personal data for
 * MARKETING rather than to answer an enquiry, and marketing is a different
 * lawful basis with different obligations:
 *
 *  1. CONSENT, not legitimate interest (PECR reg. 22 for electronic mail to
 *     individuals). Typing an address into a box labelled "sign up for our
 *     newsletter" and pressing Subscribe is valid consent — it is specific,
 *     informed and affirmative. It stops being valid the moment the box is
 *     bundled with something else, pre-ticked, or unclear about what arrives.
 *     So the label must keep saying newsletter, and this endpoint must never
 *     be reused to capture addresses collected for another purpose.
 *  2. EVERY campaign needs a working unsubscribe link (PECR reg. 22(3)(c)),
 *     and the right to withdraw must be as easy as giving consent. Resend
 *     Broadcasts insert one; a hand-rolled send would not.
 *  3. The privacy policy has to describe this processing before it runs —
 *     see the `newsletter` section in `src/lib/legal.ts`, added with this.
 *  4. The enquiry form's promise still stands: an enquiry never joins this
 *     list. The two are separate on purpose and must stay separate.
 */

const RESEND_CONTACTS = "https://api.resend.com/audiences";

/**
 * Deliberately loose. A validator that rejects real addresses is a worse
 * failure than one that accepts a typo, and the only authority on whether an
 * address exists is the mail server. This rejects the shapes that cannot be
 * an address at all and leaves the rest to Resend.
 */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email =
    typeof (payload as { email?: unknown })?.email === "string"
      ? (payload as { email: string }).email.trim()
      : "";

  if (!looksLikeEmail(email)) {
    return NextResponse.json(
      { error: "Enter an email address we can reach you at." },
      { status: 400 }
    );
  }

  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;

  if (!key || !audience) {
    return NextResponse.json(
      { error: "Sign-ups are not open yet. Email us and we will add you." },
      { status: 501 }
    );
  }

  try {
    const response = await fetch(
      `${RESEND_CONTACTS}/${encodeURIComponent(audience)}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error(`Resend contacts responded ${response.status}: ${detail}`);
      return NextResponse.json(
        { error: "That did not go through. Try again, or email us." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Subscribe failed", error);
    return NextResponse.json(
      { error: "That did not go through. Try again, or email us." },
      { status: 502 }
    );
  }
}
