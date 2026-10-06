import { COLLECTIONS } from "@/lib/content";

/** Every category with its count and the photo of the first piece in it (S&L's own). Shared by
 *  the header, the menu and the footer. No "Brands" list: S&L is not affiliated with the brands
 *  it sells, and there are no brand pages to link. */
export const CATEGORIES = COLLECTIONS.map((c) => ({
  href: `/pieces/${c.slug}`,
  title: c.title,
  count: c.pieces?.length ?? 0,
  piece: c.pieces?.[0],
}));
