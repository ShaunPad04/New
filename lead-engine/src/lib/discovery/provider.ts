import { env, requireSearch } from "../env";

export type SearchResult = {
  title: string;
  url: string;
  snippet: string;
  /** ISO date, when the provider reports one. Never guessed. */
  publishedAt?: string;
  provider: string;
};

export type SearchOutcome =
  | { ok: true; results: SearchResult[] }
  | { ok: false; reason: string };

type Adapter = (query: string, apiKey: string, limit: number) => Promise<SearchResult[]>;

const TIMEOUT_MS = 15_000;

async function postJson(url: string, headers: Record<string, string>, body: unknown): Promise<unknown> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`${new URL(url).hostname} returned ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function getJson(url: string, headers: Record<string, string>): Promise<unknown> {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`${new URL(url).hostname} returned ${response.status} ${response.statusText}`);
  }
  return response.json();
}

const serper: Adapter = async (query, apiKey, limit) => {
  const data = (await postJson("https://google.serper.dev/search", { "X-API-KEY": apiKey }, {
    q: query,
    gl: "gb",
    hl: "en",
    num: limit,
  })) as { organic?: { title?: string; link?: string; snippet?: string; date?: string }[] };
  return (data.organic ?? [])
    .filter((r): r is { title: string; link: string; snippet?: string; date?: string } => Boolean(r.title && r.link))
    .map((r) => ({
      title: r.title,
      url: r.link,
      snippet: r.snippet ?? "",
      publishedAt: parseLooseDate(r.date),
      provider: "serper",
    }));
};

const brave: Adapter = async (query, apiKey, limit) => {
  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", query);
  url.searchParams.set("country", "gb");
  url.searchParams.set("count", String(limit));
  const data = (await getJson(url.toString(), {
    "X-Subscription-Token": apiKey,
    accept: "application/json",
  })) as { web?: { results?: { title?: string; url?: string; description?: string; age?: string }[] } };
  return (data.web?.results ?? [])
    .filter((r): r is { title: string; url: string; description?: string; age?: string } => Boolean(r.title && r.url))
    .map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.description ?? "",
      publishedAt: parseLooseDate(r.age),
      provider: "brave",
    }));
};

const tavily: Adapter = async (query, apiKey, limit) => {
  const data = (await postJson("https://api.tavily.com/search", { authorization: `Bearer ${apiKey}` }, {
    query,
    max_results: limit,
    search_depth: "basic",
    country: "united kingdom",
  })) as { results?: { title?: string; url?: string; content?: string; published_date?: string }[] };
  return (data.results ?? [])
    .filter((r): r is { title: string; url: string; content?: string; published_date?: string } =>
      Boolean(r.title && r.url),
    )
    .map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.content ?? "",
      publishedAt: parseLooseDate(r.published_date),
      provider: "tavily",
    }));
};

const ADAPTERS: Record<string, Adapter> = { serper, brave, tavily };

/**
 * Providers report dates in wildly different shapes ("3 days ago",
 * "12 Jan 2026", an ISO string). Anything we cannot parse confidently is
 * dropped rather than approximated — a wrong date would change a lead's
 * timing score.
 */
export function parseLooseDate(input: string | undefined): string | undefined {
  if (!input) return undefined;
  const relative = /^(\d+)\s+(hour|day|week|month|year)s?\s+ago$/i.exec(input.trim());
  if (relative) {
    const amount = Number(relative[1]);
    const unitDays: Record<string, number> = { hour: 1 / 24, day: 1, week: 7, month: 30, year: 365 };
    const unit = relative[2]?.toLowerCase();
    const days = unit ? unitDays[unit] : undefined;
    if (days === undefined) return undefined;
    return new Date(Date.now() - amount * days * 86_400_000).toISOString().slice(0, 10);
  }
  const parsed = Date.parse(input);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString().slice(0, 10);
}

export async function search(query: string, limit = 10): Promise<SearchOutcome> {
  const configured = requireSearch();
  if (!configured.configured) return { ok: false, reason: configured.reason };

  const adapter = ADAPTERS[configured.value.provider];
  if (!adapter) {
    return {
      ok: false,
      reason: `Unknown SEARCH_PROVIDER "${configured.value.provider}". Supported: ${Object.keys(ADAPTERS).join(", ")}.`,
    };
  }

  try {
    return { ok: true, results: await adapter(query, configured.value.apiKey, limit) };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "Search failed." };
  }
}

export const SUPPORTED_PROVIDERS = Object.keys(ADAPTERS);
export const CRAWLER_CONTACT = env.crawlerContact;
