import { COLLECTIONS } from "@/lib/content";

/* Shared by the headers and every menu variant. No "Brands" list: S&L is not affiliated
   with the brands it sells, and there are no brand pages to link. */
export const NAV = [
  { href: "/pieces", label: "Pieces" },
  { href: "/services", label: "Services" },
  { href: "/#reviews", label: "Reviews" },
];
export const COLLECTION_LINKS = [{ href: "/pieces", label: "All pieces" }, ...COLLECTIONS.map((c) => ({ href: `/pieces/${c.slug}`, label: c.title }))];
export const SHOP_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/gold-prices", label: "Gold prices" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/about", label: "About us" },
  { href: "/faq", label: "FAQ" },
  { href: "/enquiry", label: "Make an enquiry" },
];
/** Every category with its count and the photo of the first piece in it (S&L's own). */
export const CATEGORIES = COLLECTIONS.map((c) => ({
  href: `/pieces/${c.slug}`,
  title: c.title,
  count: c.pieces?.length ?? 0,
  piece: c.pieces?.[0],
}));
/** A card per category for the mega panel, showing the first piece in it. */
export const CARDS = (
  [
    ["watches", "Watches"],
    ["chains", "Chains"],
    ["bracelets", "Bracelets"],
  ] as const
)
  .map(([slug, short]) => ({ c: COLLECTIONS.find((x) => x.slug === slug), short }))
  .filter(({ c }) => c && c.pieces?.length)
  .map(({ c, short }) => ({ href: `/pieces/${c!.slug}`, title: short, piece: c!.pieces![0] }));
