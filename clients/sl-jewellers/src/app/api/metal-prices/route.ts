import { NextResponse } from "next/server";

/**
 * Live gold and silver, per gram, in GBP, derived from the London spot price.
 *
 *   GET /api/metal-prices -> { asOf, currency, unit, basis, metals: { gold, silver } }
 *
 * Runs on the server so the metered API key never reaches the browser, and
 * one cached answer serves every visitor. Degrades one way only: no key,
 * upstream down or slow, or a price outside the sanity bounds returns an
 * error and NO figures. It never returns a stale price, a zero, or a guess.
 * The counter price is the real offer; a wrong number here is an argument
 * waiting at the counter.
 *
 * Env: METALS_API_KEY (required), METALS_API_HOST (goldapi.io | metalpriceapi.com).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Metal = "gold" | "silver";

const FINENESS: Record<Metal, { label: string; name: string; purity: number }[]> = {
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

/** Upstream calls go through the Vercel Data Cache (shared across regions and deployments) and refresh once a day:
 *  two metals, so about 60 calls a month against goldapi.io's free 100. The table is indicative, not a quote. */
const UPSTREAM_TTL = 86400;

type Provider = (metal: Metal, key: string, signal: AbortSignal) => Promise<number>;
const PROVIDERS: Record<string, Provider> = {
  "goldapi.io": async (metal, key, signal) => {
    const origin = process.env.METALS_API_ORIGIN || "https://www.goldapi.io"; // test seam only
    const res = await fetch(`${origin}/api/${SYMBOL[metal]}/GBP`, { headers: { "x-access-token": key }, signal, next: { revalidate: UPSTREAM_TTL } });
    if (!res.ok) throw new Error(`goldapi.io ${res.status}`);
    const body = (await res.json()) as { price?: number; prev_close_price?: number };
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

async function quote(metal: Metal, key: string, host: string, signal: AbortSignal) {
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

export async function GET() {
  const key = process.env.METALS_API_KEY;
  const host = process.env.METALS_API_HOST || "goldapi.io";
  if (!key) {
    return NextResponse.json({ error: "METALS_API_KEY is not configured" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 5000);
  try {
    const wanted: Metal[] = ["gold", "silver"];
    const settled = await Promise.allSettled(wanted.map((m) => quote(m, key, host, abort.signal)));
    const metals: Partial<Record<Metal, Awaited<ReturnType<typeof quote>>>> = {};
    settled.forEach((r, i) => {
      if (r.status === "fulfilled") metals[wanted[i]] = r.value;
      else console.warn("[metal-prices]", wanted[i], r.reason);
    });
    if (!Object.keys(metals).length) {
      return NextResponse.json({ error: "no usable price from upstream" }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json(
      {
        asOf: new Date().toISOString(),
        currency: "GBP",
        unit: "gram",
        basis: "Indicative metal value from the London spot price. Not an offer.",
        metals,
      },
      // Browser 5 min, edge 1 h, served stale for a day while it refreshes; the upstream figure itself is daily (UPSTREAM_TTL).
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch (err) {
    return NextResponse.json({ error: String(err instanceof Error ? err.message : err) }, { status: 502, headers: { "Cache-Control": "no-store" } });
  } finally {
    clearTimeout(timer);
  }
}
