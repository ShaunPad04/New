/**
 * Server-side Cloudflare Turnstile verification.
 *
 * Turnstile is optional. When TURNSTILE_SECRET_KEY is set the widget is shown
 * and every submission is verified; when it is not, the form still works and
 * the honeypot plus the rate limit are what stand between the shop and the
 * bots. That is deliberate: this site is handed over with no support contract,
 * and a form that silently refuses every customer because a key was not
 * carried across is a worse failure than a little spam. The warning below is
 * there so the reason is visible in the deployment logs.
 */
let warned = false;

export async function verifyTurnstile(token: string | null, ip: string): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (!warned) {
      warned = true;
      console.warn("[enquiry] TURNSTILE_SECRET_KEY is not set: enquiries are accepted on the honeypot and rate limit alone.");
    }
    return { ok: true };
  }
  if (!token) return { ok: false, reason: "missing-token" };
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    return data.success ? { ok: true } : { ok: false, reason: (data["error-codes"] || []).join(",") || "failed" };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "network" };
  }
}
