/**
 * Property data access.
 *
 * Everything that renders a listing reads through this module, so a live
 * feed can replace the JSON snapshot later without touching the pages.
 *
 * The snapshot in src/data/properties.json is a dated copy of what the
 * agency's public website listed when it was captured — see
 * src/data/README.md. It is not a live feed and is never described as one.
 */
import data from "@/data/properties.json";

export type PropertyImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  local: boolean;
};

export type Property = {
  id: string;
  slug: string;
  sourceUrl: string;
  title: string;
  town: string;
  area: string;
  price: { raw: string; amount: number | null; qualifier: string | null };
  beds: number | null;
  baths: number | null;
  receptions: number | null;
  status: string;
  isNewHome: boolean;
  isNewListing: boolean;
  features: string[];
  summary: string;
  description: string;
  images: PropertyImage[];
  floorplans: PropertyImage[];
  epcRating: string | null;
  virtualTours: string[];
  brochures: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  fetchedAt: string | null;
  order: number;
};

const snapshot = data as unknown as {
  capturedAt: string | null;
  source: string;
  count: number;
  properties: Property[];
};

export const SNAPSHOT_DATE = snapshot.capturedAt;
export const SNAPSHOT_SOURCE = snapshot.source;

export function getAllProperties(): Property[] {
  return snapshot.properties;
}

export function getProperty(slug: string): Property | undefined {
  return snapshot.properties.find((p) => p.slug === slug);
}

export function getFeatured(count = 3): Property[] {
  // Three listings with local photography and the fullest data set.
  return [...snapshot.properties]
    .filter((p) => p.images[0]?.local && p.beds && p.description.length > 200)
    .sort((a, b) => (b.images.length - a.images.length) || a.order - b.order)
    .slice(0, count);
}

export function getHighlighted(): Property | undefined {
  return getFeatured(4).at(-1) ?? snapshot.properties[0];
}

export function getRelated(p: Property, count = 3): Property[] {
  const sameTown = snapshot.properties.filter((x) => x.id !== p.id && x.town === p.town);
  const sameKind = snapshot.properties.filter((x) => x.id !== p.id && x.isNewHome === p.isNewHome && x.town !== p.town);
  return [...sameTown, ...sameKind].filter((x, i, a) => a.indexOf(x) === i).slice(0, count);
}

export type SortKey = "newest" | "price-asc" | "price-desc" | "beds-desc";

export type SearchParams = {
  q?: string;
  location?: string;
  type?: "all" | "new" | "resale";
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  sort?: SortKey;
};

export const PRICE_STEPS = [100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 600000, 700000, 800000, 900000, 1000000, 1250000, 1500000];

export function getLocations(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of snapshot.properties) counts.set(p.town, (counts.get(p.town) ?? 0) + 1);
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function searchProperties(params: SearchParams): Property[] {
  const q = (params.q ?? "").trim().toLowerCase();
  const location = (params.location ?? "").trim().toLowerCase();
  let list = snapshot.properties.filter((p) => {
    if (params.type === "new" && !p.isNewHome) return false;
    if (params.type === "resale" && p.isNewHome) return false;
    if (location && p.town.toLowerCase() !== location) return false;
    if (params.minPrice && (p.price.amount ?? 0) < params.minPrice) return false;
    if (params.maxPrice && (p.price.amount ?? Infinity) > params.maxPrice) return false;
    if (params.beds && (p.beds ?? 0) < params.beds) return false;
    if (q) {
      const hay = `${p.title} ${p.area} ${p.town} ${p.summary}`.toLowerCase();
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const sort = params.sort ?? "newest";
  list = [...list].sort((a, b) => {
    switch (sort) {
      case "price-asc": return (a.price.amount ?? Infinity) - (b.price.amount ?? Infinity) || a.order - b.order;
      case "price-desc": return (b.price.amount ?? -1) - (a.price.amount ?? -1) || a.order - b.order;
      case "beds-desc": return (b.beds ?? 0) - (a.beds ?? 0) || a.order - b.order;
      default: return a.order - b.order;
    }
  });
  return list;
}

export function parseSearchParams(sp: Record<string, string | string[] | undefined>): SearchParams {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) ?? undefined;
  const num = (k: string) => { const v = Number(one(k)); return Number.isFinite(v) && v > 0 ? v : undefined; };
  const type = one("type");
  const sort = one("sort");
  return {
    q: one("q"),
    location: one("location"),
    type: type === "new" || type === "resale" ? type : "all",
    minPrice: num("min"),
    maxPrice: num("max"),
    beds: num("beds"),
    sort: sort === "price-asc" || sort === "price-desc" || sort === "beds-desc" ? sort : "newest",
  };
}

export function formatPrice(p: Property): { qualifier: string | null; amount: string } {
  const amount = p.price.amount != null ? `£${p.price.amount.toLocaleString("en-GB")}` : p.price.raw || "Price on application";
  return { qualifier: p.price.qualifier, amount };
}

export function formatMoney(n: number) {
  return `£${n.toLocaleString("en-GB")}`;
}
