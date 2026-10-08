import { COLLECTIONS } from "@/lib/content";

/** One entry per category for the home page's "Shop by collection", in shop order: the ones
 *  with pieces first, then those with nothing listed (rings, pendants: their illustrated
 *  cover, "Ask what is in"). Each category's picture is its first piece, except watches, which
 *  lead with the Day-Date: the watch rail straight underneath opens with the GMT-Master II. */
export type CollTile = { slug: string; title: string; href: string; count: number; image: string; focus?: string; empty: boolean };

const ORDER = ["watches", "chains", "bracelets", "bullion", "collectibles"];
const LEAD: Record<string, string> = { watches: "watches-28-7f93acb2" };

export const COLL_TILES: CollTile[] = [
  ...ORDER.map((s) => COLLECTIONS.find((c) => c.slug === s)).filter((c) => c?.pieces?.length),
  ...COLLECTIONS.filter((c) => !c.pieces?.length && c.cover),
].map((c) => {
  const pieces = c!.pieces ?? [];
  const lead = pieces.find((p) => p.id === LEAD[c!.slug]) ?? pieces[0];
  return {
    slug: c!.slug,
    title: c!.title,
    href: `/pieces/${c!.slug}`,
    count: pieces.length,
    image: lead?.image ?? c!.cover!,
    focus: lead ? undefined : c!.coverFocus,
    empty: !pieces.length,
  };
});
