import { BUSINESS, COLLECTIONS, brandOf, type Collection, type Piece } from "@/lib/content";

/**
 * Search titles and descriptions for the product pages (pre-launch QA, 8 Oct 2026): a title of
 * 50 to 60 characters and a description of 140 to 160, both unique across the site, built from
 * the piece's own title so nothing is said that the page does not. Watches lead with
 * "Pre-Owned": the shop is not an authorised dealer of any brand it sells, and the brand name is
 * used only to say what the watch is.
 *
 * A title is the piece's name (with its maker, for a watch) plus as many of its details as fit,
 * then the shop and, where there is room, the town. Two identical pieces (there are two of the
 * same Day-Date and three cast silver bars) get different details, never an invented number.
 * `seoTitle` on a piece in content/collections.json replaces its title here when no fit exists.
 */
const NAME = BUSINESS.name;
const TOWN = BUSINESS.address.town;
const SUFFIXES = [` | ${NAME}`, ` in ${TOWN} | ${NAME}`, `, ${TOWN} | ${NAME}`, ` for Sale in ${TOWN} | ${NAME}`, ` | ${NAME}, ${TOWN}`];

/** Every subset of the details, in their order, the longest first. */
function subsets<T>(xs: T[]): T[][] {
  const out: T[][] = [];
  for (let m = (1 << xs.length) - 1; m >= 0; m--) out.push(xs.filter((_, i) => m & (1 << i)));
  return out.sort((a, b) => b.length - a.length);
}

const nameOf = (c: Collection, p: Piece, title = p.title) => {
  const brand = c.slug === "watches" ? brandOf(p) : undefined;
  return brand && !title.startsWith(brand) ? `${brand} ${title}` : title;
};

function titleCandidates(c: Collection, p: Piece): string[] {
  const watch = c.slug === "watches";
  const [first, ...rest] = (p.seoTitle ?? p.title).split(", ");
  const scored: { pre: number; n: number; si: number; t: string }[] = [];
  for (const pre of watch ? ["Pre-Owned ", ""] : [""]) {
    const head = pre + nameOf(c, p, first);
    for (const sub of subsets(rest)) {
      const base = [head, ...sub].join(", ");
      SUFFIXES.forEach((s, si) => {
        // "37 g, 8.5 in in Cleethorpes" reads as a stammer
        if (/\d\s?(in|g|oz)$/.test(base) && /^ (in|for) /.test(s)) return;
        const t = base + s;
        if (t.length >= 50 && t.length <= 60) scored.push({ pre: pre ? 1 : 0, n: sub.length, si, t });
      });
    }
  }
  scored.sort((a, b) => b.pre - a.pre || b.n - a.n || a.si - b.si || b.t.length - a.t.length || (a.t < b.t ? 1 : -1));
  return scored.map((x) => x.t);
}

const fallbackTitle = (c: Collection, p: Piece) => {
  const room = 60 - ` | ${NAME}`.length;
  let base = nameOf(c, p);
  while (base.length > room && base.includes(" ")) base = base.slice(0, base.lastIndexOf(" ")).replace(/[,&]\s*$/, "");
  return `${base} | ${NAME}`;
};

function descriptionCandidates(c: Collection, p: Piece, seoTitle: string): string[] {
  const kind: Record<string, string> = { watches: "pre-owned watches", bullion: "coins and bars" };
  const noun = kind[c.slug] ?? c.title.toLowerCase();
  const name = nameOf(c, p);
  // the title's own head, which differs between identical pieces
  const head = seoTitle.split(" | ")[0].replace(new RegExp(`(,| in| for Sale in) ${TOWN}$`), "");
  const heads = [`${name}, one of the ${noun} in the case`, `${name}, in the case`, name, `${head}, one of the ${noun} in the case`, `${head}, in the case`, head];
  const a = BUSINESS.address;
  const tails = [
    ` at ${NAME}, ${a.street}, ${a.town}. Price on request: add it to your basket or ask us about it.`,
    ` at ${NAME}, ${a.town}. Price on request: add it to your basket or ask us about it.`,
    ` at ${NAME}, ${a.street}, ${a.town}. Price on request: ask us about it.`,
    ` at ${NAME}, ${a.town}. Price on request: ask us about it.`,
  ];
  const out: string[] = [];
  for (const h of heads) for (const t of tails) out.push(h + t);
  const fit = out.filter((d) => d.length >= 140 && d.length <= 160);
  return fit.length ? fit : out.sort((x, y) => Math.abs(x.length - 150) - Math.abs(y.length - 150));
}

const TITLES = new Map<string, string>();
const DESCRIPTIONS = new Map<string, string>();
{
  const usedT = new Set<string>();
  const usedD = new Set<string>();
  for (const c of COLLECTIONS) {
    for (const p of c.pieces ?? []) {
      const t = titleCandidates(c, p).find((x) => !usedT.has(x)) ?? fallbackTitle(c, p);
      usedT.add(t);
      TITLES.set(p.id, t);
      const ds = descriptionCandidates(c, p, t);
      const d = ds.find((x) => !usedD.has(x)) ?? ds[0];
      usedD.add(d);
      DESCRIPTIONS.set(p.id, d);
    }
  }
}

/** The product page's <title>, used absolute (no site template after it). */
export const pieceSeoTitle = (c: Collection, p: Piece) => TITLES.get(p.id) ?? fallbackTitle(c, p);
export const pieceSeoDescription = (c: Collection, p: Piece) => DESCRIPTIONS.get(p.id) ?? descriptionCandidates(c, p, pieceSeoTitle(c, p))[0];

/** Category pages: their search title (before " | S&L Jewellers") and description, written
 *  from each category's own blurb in content/collections.json. */
const CATEGORY_SEO: Record<string, { title: string; description: string }> = {
  watches: { title: "Pre-Owned Luxury Watches in Cleethorpes", description: "Pre-owned luxury watches at S&L Jewellers, 49 Cambridge Street, Cleethorpes: Rolex, Cartier and more, checked in the shop. Ask us for a price on any watch." },
  chains: { title: "Gold Chains & Necklaces in Cleethorpes", description: "Curb, Cuban, belcher and rope chains in gold and silver at S&L Jewellers, 49 Cambridge Street, Cleethorpes, weighed in front of you. Ask for a price on any." },
  bracelets: { title: "Heavy Gold Bracelets in Cleethorpes", description: "Heavy gold bracelets, curb and fancy link, at S&L Jewellers, 49 Cambridge Street, Cleethorpes. See them in the case or ask us for a price on any bracelet." },
  bullion: { title: "Gold & Silver Coins and Bullion, Cleethorpes", description: "Gold and silver bars and coins, sealed and loose, at S&L Jewellers, 49 Cambridge Street, Cleethorpes. Buy bullion over the counter or ask us for a price." },
  collectibles: { title: "Collectibles & Gold Bar Cards, Cleethorpes", description: "The odd rarity at S&L Jewellers, Cleethorpes: silver collectibles, graded cards, sealed comics and gold bar cards. Ask us what is in and for a price on any." },
  rings: { title: "Gold Rings in Cleethorpes, Ask What Is In", description: "Signet, stone-set and coin rings in solid gold at S&L Jewellers, 49 Cambridge Street, Cleethorpes. Stock moves daily, so ask us what is in the case today." },
  pendants: { title: "Gold Pendants in Cleethorpes, Ask What Is In", description: "Cherub, coin and other pendants in solid gold at S&L Jewellers, 49 Cambridge Street, Cleethorpes. Stock moves daily, so ask us what is in the case today." },
};
export const categorySeo = (c: Collection) =>
  CATEGORY_SEO[c.slug] ?? { title: `${c.title} in ${TOWN}`, description: `${c.blurb} At ${NAME}, ${BUSINESS.address.street}, ${TOWN}.` };

/** schema.org BreadcrumbList for a category or product page. */
export const breadcrumbLd = (siteUrl: string, trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: `${siteUrl}${t.path}` })),
});
