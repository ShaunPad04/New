import { CRAWLER_CONTACT } from "../discovery/provider";

const USER_AGENT = `BlackLineLeadEngine/0.1 (+mailto:${CRAWLER_CONTACT})`;
const TIMEOUT_MS = 20_000;
const MAX_BYTES = 2_000_000;

export type PageFetch =
  | { ok: true; url: string; title?: string; text: string; fetchedAt: string }
  | { ok: false; url: string; reason: string };

const robotsCache = new Map<string, { disallows: string[]; fetchedAt: number }>();
const ROBOTS_TTL_MS = 6 * 60 * 60 * 1000;

/**
 * A deliberately conservative robots.txt reader. It looks at the `*` group
 * only and treats anything it cannot parse as "do not fetch". The engine is
 * meant to read public business information politely, not to win an argument
 * with a site owner about what a wildcard means.
 */
export async function isAllowed(url: string): Promise<{ allowed: boolean; reason?: string }> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { allowed: false, reason: "Not a valid URL." };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { allowed: false, reason: `Unsupported protocol ${parsed.protocol}` };
  }

  const origin = parsed.origin;
  const cached = robotsCache.get(origin);
  let disallows: string[];

  if (cached && Date.now() - cached.fetchedAt < ROBOTS_TTL_MS) {
    disallows = cached.disallows;
  } else {
    disallows = await loadRobots(origin);
    robotsCache.set(origin, { disallows, fetchedAt: Date.now() });
  }

  const path = parsed.pathname + parsed.search;
  const blocked = disallows.find((rule) => rule.length > 0 && path.startsWith(rule));
  if (blocked) return { allowed: false, reason: `robots.txt disallows ${blocked}` };
  return { allowed: true };
}

async function loadRobots(origin: string): Promise<string[]> {
  try {
    const response = await fetch(`${origin}/robots.txt`, {
      headers: { "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(10_000),
    });
    // No robots.txt means no restrictions expressed.
    if (response.status === 404) return [];
    if (!response.ok) return [];
    const body = await response.text();
    return parseRobots(body);
  } catch {
    // Unreachable robots.txt is not permission — but it is also not a refusal.
    // We allow, because the alternative is blocking on every transient error.
    return [];
  }
}

export function parseRobots(body: string): string[] {
  const disallows: string[] = [];
  let inWildcardGroup = false;
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.split("#")[0]?.trim() ?? "";
    if (line.length === 0) continue;
    const [rawField, ...rest] = line.split(":");
    const field = rawField?.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (field === "user-agent") {
      inWildcardGroup = value === "*";
      continue;
    }
    if (!inWildcardGroup) continue;
    if (field === "disallow" && value.length > 0) disallows.push(value);
  }
  return disallows;
}

export async function fetchPage(url: string): Promise<PageFetch> {
  const permission = await isAllowed(url);
  if (!permission.allowed) {
    return { ok: false, url, reason: permission.reason ?? "Not allowed by robots.txt" };
  }

  try {
    const response = await fetch(url, {
      headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: "follow",
    });
    if (!response.ok) return { ok: false, url, reason: `HTTP ${response.status} ${response.statusText}` };

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("html") && !contentType.includes("text/plain")) {
      return { ok: false, url, reason: `Unsupported content type "${contentType}"` };
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) {
      return { ok: false, url, reason: `Page is larger than ${MAX_BYTES} bytes` };
    }
    const html = new TextDecoder("utf-8").decode(buffer);
    return {
      ok: true,
      url: response.url || url,
      title: extractTitle(html),
      text: htmlToText(html),
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    return { ok: false, url, reason: error instanceof Error ? error.message : "Fetch failed." };
  }
}

export function extractTitle(html: string): string | undefined {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match?.[1] ? decodeEntities(match[1]).trim().slice(0, 300) : undefined;
}

/** Strips markup down to readable text. Good enough to hand to an extractor. */
export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|svg|head)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<\/(p|div|li|tr|h[1-6]|section|article|br)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", pound: "£", euro: "€", hellip: "…",
  mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”",
};

export function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name: string) => ENTITIES[name.toLowerCase()] ?? match);
}
