const WINDOW_S = 10 * 60;
const LIMIT = 5;

/**
 * Per-instance rate limit, five enquiries per IP per ten minutes.
 *
 * This used to sit in Redis so the count was shared across serverless
 * instances. That meant a database, an account and a bill to inherit, for a
 * shop that gets a handful of enquiries a week. In memory the count resets
 * whenever Vercel starts a new instance, so a determined flooder could get
 * more than five through; the honeypot and, when it is configured, Turnstile
 * are what actually stop bots. This is the cheap second line, and it costs
 * nothing to own.
 */
const memory = new Map<string, { count: number; reset: number }>();

/** Returns true when the caller is over the limit. */
export async function isRateLimited(ip: string): Promise<boolean> {
  const key = `rl:enquiry:${ip}`;
  const now = Date.now();

  // Keep the map from growing without bound on a long-lived instance.
  if (memory.size > 5000) {
    for (const [k, v] of memory) if (v.reset < now) memory.delete(k);
  }

  const entry = memory.get(key);
  if (!entry || entry.reset < now) {
    memory.set(key, { count: 1, reset: now + WINDOW_S * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : req.headers.get("x-real-ip") || "unknown").trim();
}
