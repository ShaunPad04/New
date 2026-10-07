import { COLLECTIONS } from "@/lib/content";
import type { CategoryCard } from "./pieces-format";

export const CATEGORY_CARDS: CategoryCard[] = COLLECTIONS.map((c) => {
  const first = c.pieces?.[0];
  return {
    slug: c.slug,
    title: c.title,
    blurb: c.blurb,
    count: c.pieces?.length ?? 0,
    image: first?.image ?? c.cover,
    focus: first ? undefined : c.coverFocus,
  };
});
