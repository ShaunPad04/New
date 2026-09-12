/**
 * Property listings, captured from paul-fox.com in September 2026.
 * Sixty residential sales and twelve lettings. Image paths are relative to
 * the WordPress uploads folder and resolved with `upload()`.
 */
import sales1 from "@/data/properties-sales.json";
import sales2 from "@/data/properties-sales-2.json";
import sales3 from "@/data/properties-sales-3.json";
import lettings from "@/data/properties-lettings.json";

export type Department = "residential-sales" | "residential-lettings";

export type Property = {
  slug: string;
  title: string;
  price: string;
  qualifier: string;
  type: string;
  availability: string;
  beds: string;
  baths: string;
  receptions: string;
  tenure: string;
  councilTax: string;
  features: string[];
  summary: string;
  description: string[];
  images: string[];
  department: Department;
};

type Raw = Omit<Property, "department">;

const tag = (list: Raw[], department: Department): Property[] =>
  list.map((p) => ({ ...p, department }));

export const salesProperties: Property[] = tag([...sales1, ...sales2, ...sales3] as Raw[], "residential-sales");
export const lettingsProperties: Property[] = tag(lettings as Raw[], "residential-lettings");
export const allProperties: Property[] = [...salesProperties, ...lettingsProperties];

export function getProperty(slug: string): Property | undefined {
  return allProperties.find((p) => p.slug === slug);
}

/** "£1,100,000" → 1100000; "£1,350 pcm" → 1350. */
export function priceNumber(p: Property): number {
  const n = Number(p.price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Postcode district from the title, e.g. "Sand Pit Lane, Scunthorpe, DN15" → "DN15". */
export function district(p: Property): string {
  const m = p.title.match(/\b(DN\d{1,2}|LN\d{1,2})\b/);
  return m ? m[1] : "";
}

/** Town or village — the middle segment of the title. */
export function locality(p: Property): string {
  const parts = p.title.split(",").map((s) => s.trim());
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0];
}

export const DEPARTMENT_LABEL: Record<Department, string> = {
  "residential-sales": "For sale",
  "residential-lettings": "To let",
};
