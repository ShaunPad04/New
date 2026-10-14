import { COLLECTIONS, type Piece } from "@/lib/content";

// splitTitle lives in lib/piece-url.ts (no catalogue import), so client components can use it
export { splitTitle } from "@/lib/piece-url";
export const enquiryHref = (p: Piece) => `/enquiry?type=buying&piece=${encodeURIComponent(p.id)}`;
export const WATCHES = COLLECTIONS.find((c) => c.slug === "watches")?.pieces ?? [];
