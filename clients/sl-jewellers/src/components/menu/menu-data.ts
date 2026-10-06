import { COLLECTIONS } from "@/lib/content";

/* Shared by the header and the menu. No "Brands" list: S&L is not affiliated
   with the brands it sells, and there are no brand pages to link. */
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
