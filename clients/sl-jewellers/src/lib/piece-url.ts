import type { Piece } from "@/lib/content";

/**
 * A piece's own page, from its id and title alone (no catalogue import, so client
 * components can use it): /pieces/<category>/<title-slug>-<photo hash>, e.g.
 * /pieces/watches/gmt-master-ii-bruce-wayne-126710grnr-full-set-1983460d.
 * Ids look like "watches-05-1983460d": the category, the photo's number, its hash.
 */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");

export const pieceCategory = (p: Pick<Piece, "id">) => p.id.slice(0, p.id.indexOf("-"));
export const pieceSlug = (p: Pick<Piece, "id" | "title">) => `${slugify(p.title)}-${p.id.split("-").pop()}`;
export const pieceHref = (p: Pick<Piece, "id" | "title">) => `/pieces/${pieceCategory(p)}/${pieceSlug(p)}`;

/** S&L's own listing title split for a product card: the name, then the details after the first comma. */
export function splitTitle(title: string) {
  const i = title.indexOf(",");
  return i < 0 ? { name: title, detail: "" } : { name: title.slice(0, i), detail: title.slice(i + 1).trim() };
}
