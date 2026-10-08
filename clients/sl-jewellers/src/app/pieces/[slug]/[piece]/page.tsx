import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BUSINESS, COLLECTIONS, SITE_URL, collectionBySlug } from "@/lib/content";
import { pieceHref, pieceSlug } from "@/lib/piece-url";
import { splitTitle } from "@/components/shop/watch-data";
import { ProductA, ProductB, ProductC } from "@/components/pages/ProductViews";

/**
 * A piece's own page: /pieces/<category>/<title-slug>-<hash> (lib/piece-url.ts). Every
 * product card on the site lands here first; "Add to basket" collects pieces into one
 * enquiry, "Ask about this piece now" goes straight to the form. Built at deploy time for
 * every piece in content/collections.json.
 */
export function generateStaticParams() {
  return COLLECTIONS.flatMap((c) => (c.pieces ?? []).map((p) => ({ slug: c.slug, piece: pieceSlug(p) })));
}

const find = (slug: string, piece: string) => {
  const c = collectionBySlug(slug);
  const p = c?.pieces?.find((x) => pieceSlug(x) === piece);
  return c && p ? { c, p } : null;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; piece: string }> }): Promise<Metadata> {
  const { slug, piece } = await params;
  const hit = find(slug, piece);
  if (!hit) return {};
  const { c, p } = hit;
  const title = `${p.title} | ${c.title}`;
  const description = `${p.title} at S&L Jewellers, ${BUSINESS.address.street}, ${BUSINESS.address.town}. Price on request: add it to your basket or ask about it.`;
  return {
    title,
    description,
    alternates: { canonical: pieceHref(p) },
    openGraph: { title, description, url: `${SITE_URL}${pieceHref(p)}`, images: [{ url: p.image }] },
  };
}

export default async function PiecePage({ params }: { params: Promise<{ slug: string; piece: string }> }) {
  const { slug, piece } = await params;
  const hit = find(slug, piece);
  if (!hit) notFound();
  const { c, p } = hit;
  const { name, detail } = splitTitle(p.title);
  const all = c.pieces ?? [];
  const i = all.findIndex((x) => x.id === p.id);
  // the next four in the category, wrapping round, never this one
  const more = Array.from({ length: Math.min(4, all.length - 1) }, (_, k) => all[(i + 1 + k) % all.length]);
  const props = { c, p, name, detail, more };

  // three layouts while Shaun picks one (?v=pdp:a|b|c, components/pages/ProductViews.tsx)
  return (
    <div className="on-black pd">
      <div data-x="pdp" data-x-dir="a">
        <ProductA {...props} uid="pa" />
      </div>
      <div data-x="pdp" data-x-dir="b">
        <ProductB {...props} uid="pb" />
      </div>
      <div data-x="pdp" data-x-dir="c">
        <ProductC {...props} uid="pc" />
      </div>
    </div>
  );
}
