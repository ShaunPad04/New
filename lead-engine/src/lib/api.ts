import { env } from "./env";

/**
 * Scheduled endpoints require a shared secret. Without CRON_SECRET set, they
 * refuse every request rather than running unauthenticated — an open endpoint
 * that spends money on searches is not a reasonable default.
 */
export function authoriseCron(request: Request): { ok: true } | { ok: false; status: number; message: string } {
  if (!env.cronSecret) {
    return {
      ok: false,
      status: 503,
      message: "CRON_SECRET is not set, so scheduled discovery is disabled.",
    };
  }
  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : request.headers.get("x-cron-secret") ?? "";
  if (!timingSafeEqual(provided, env.cronSecret)) {
    return { ok: false, status: 401, message: "Invalid or missing cron secret." };
  }
  return { ok: true };
}

/** Constant-time comparison, so a wrong secret cannot be guessed a byte at a time. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}
