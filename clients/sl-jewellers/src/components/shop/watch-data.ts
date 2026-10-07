import { COLLECTIONS, type Piece } from "@/lib/content";

/** S&L's own listing title split for a product card: the name, then the details after the first comma. */
export function splitTitle(title: string) {
  const i = title.indexOf(",");
  return i < 0 ? { name: title, detail: "" } : { name: title.slice(0, i), detail: title.slice(i + 1).trim() };
}
export const enquiryHref = (p: Piece) => `/enquiry?type=buying&piece=${encodeURIComponent(p.id)}`;
export const WATCHES = COLLECTIONS.find((c) => c.slug === "watches")?.pieces ?? [];
