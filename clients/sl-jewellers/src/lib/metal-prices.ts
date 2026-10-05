import "server-only";

/**
 * Gold and silver, per gram, in GBP, derived from the London spot price.
 *
 * Rendered on the server so the table is in the HTML on first paint: no
 * "checking…", no ellipsis, no layout shift. The page revalidates hourly
 * (see `revalidate` in app/page.tsx) while the upstream call itself sits in
 * the Vercel Data Cache for a day, so the figure is fresh enough for an
 * indicative table without burning the metered API allowance.
 *
 * Staleness is handled by the two caches above rather than by a store of our
 * own. If the feed is down when the page revalidates, the revalidation fails
 * and Next keeps serving the last good render, which already carries its own
 * "prices as of" stamp; and the upstream response itself stays in the Data
 * Cache for a day, so even a fresh deployment during an outage usually still
 * has a figure. A price outside the sanity bounds is treated as a failure and
 * never shown: the counter price is the real offer, and a wrong number here is
 * an argument waiting at the counter.
 *
 * Env: METALS_API_KEY, METALS_API_HOST (goldapi.io | metalpriceapi.com).
 */

export type Metal = "gold" | "silver";
export type Grade = { label: string; name: string; perGram: number };
export type MetalQuote = { perOunce: number; perGram: number; grades: Grade[] };
export type Quotes = Partial<Record<Metal, MetalQuote>>;

/** What the table renders. `live` false means the numbers are the last known ones. */
export type PricesView = {
  metals: Quotes | null;
  asOf: string | null;
  live: boolean;
  /** No key and no snapshot: the table shows grades and "ask", never a guess. */
  configured: boolean;
};

export const FINENESS: Record<Metal, { label: string; name: string; purity: number }[]> = {
  gold: [
    { label: "24ct", name: "Fine gold", purity: 1.0 },
    { label: "22ct", name: "22 carat", purity: 0.9167 },
    { label: "18ct", name: "18 carat", purity: 0.75 },
    { label: "14ct", name: "14 carat", purity: 0.585 },
    { label: "9ct", name: "9 carat", purity: 0.375 },
  ],
  silver: [
    { label: "999", name: "Fine silver", purity: 0.999 },
    { label: "958", name: "Britannia", purity: 0.958 },
    { label: "925", name: "Sterling", purity: 0.925 },
    { label: "800", name: "Continental", purity: 0.8 },
  ],
};

const GRAMS_PER_TROY_OUNCE = 31.1034768;
const SYMBOL: Record<Metal, string> = { gold: "XAU", silver: "XAG" };
/** Tripwire, not a forecast: a provider returning USD, ounces-per-pound or zero lands outside these. */
const PLAUSIBLE_GBP_PER_OUNCE: Record<Metal, [number, number]> = { gold: [400, 20000], silver: [5, 500] };

/** The upstream call sits in the Data Cache for a day: two metals, about 60 calls a month
 *  against goldapi.io's free 100, however often the page itself revalidates. */
const UPSTREAM_TTL = 86400;
const SNAPSHOT_KEY = "metal-prices:last";

type Provider = (metal: Metal, key: string, signal: AbortSignal) => Promise<number>;
const PROVIDERS: Record<string, Provider> = {
  "goldapi.io": async (metal, key, signal) => {
    const origin = process.env.METALS_API_ORIGIN || "https://www.goldapi.io"; // test seam only
    const res = await fetch(`${origin}/api/${SYMBOL[metal]}/GBP`, { headers: { "x-access-token": key }, signal, next: { revalidate: UPSTREAM_TTL } });
    if (!res.ok) throw new Error(`goldapi.io ${res.status}`);
    const body = (await res.json()) as { price?: number };
    return Number(body.price);
  },
  "metalpriceapi.com": async (metal, key, signal) => {
    const url = `https://api.metalpriceapi.com/v1/latest?api_key=${encodeURIComponent(key)}&base=GBP&currencies=${SYMBOL[metal]}`;
    const res = await fetch(url, { signal, next: { revalidate: UPSTREAM_TTL } });
    if (!res.ok) throw new Error(`metalpriceapi.com ${res.status}`);
    const body = (await res.json()) as { rates?: Record<string, number> };
    const perGbp = Number(body.rates?.[SYMBOL[metal]]); // ounces per GBP, so invert
    return perGbp > 0 ? 1 / perGbp : NaN;
  },
};

const round = (n: number, dp: number) => Math.round(n * 10 ** dp) / 10 ** dp;

async function quote(metal: Metal, key: string, host: string, signal: AbortSignal): Promise<MetalQuote> {
  const fetchOunce = PROVIDERS[host];
  if (!fetchOunce) throw new Error(`unknown METALS_API_HOST "${host}"`);
  const perOunce = await fetchOunce(metal, key, signal);
  const [lo, hi] = PLAUSIBLE_GBP_PER_OUNCE[metal];
  if (!Number.isFinite(perOunce) || perOunce < lo || perOunce > hi) throw new Error(`${metal}: implausible spot price ${perOunce}`);
  const perGram = perOunce / GRAMS_PER_TROY_OUNCE;
  return {
    perOunce: round(perOunce, 2),
    perGram: round(perGram, 2),
    grades: FINENESS[metal].map((g) => ({ label: g.label, name: g.name, perGram: round(perGram * g.purity, 2) })),
  };
}

/** Fetches the spot price. Never throws; returns no figures rather than a guess. */
export async function getMetalPrices(): Promise<PricesView> {
  const key = process.env.METALS_API_KEY;
  const host = process.env.METALS_API_HOST || "goldapi.io";
  if (!key) return { metals: null, asOf: null, live: false, configured: false };

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 5000);
  try {
    const wanted: Metal[] = ["gold", "silver"];
    const settled = await Promise.allSettled(wanted.map((m) => quote(m, key, host, abort.signal)));
    const metals: Quotes = {};
    settled.forEach((r, i) => {
      if (r.status === "fulfilled") metals[wanted[i]] = r.value;
      else console.warn("[metal-prices]", wanted[i], r.reason);
    });
    if (!Object.keys(metals).length) throw new Error("no usable price from upstream");
    return { metals, asOf: new Date().toISOString(), live: true, configured: true };
  } catch (err) {
    console.warn("[metal-prices] no price this render:", err);
    return { metals: null, asOf: null, live: false, configured: true };
  } finally {
    clearTimeout(timer);
  }
}

/** "27 September at 14:05" in London time, whatever the server's own zone. */
export function formatAsOf(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
}
