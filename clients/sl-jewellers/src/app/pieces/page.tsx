import type { Metadata } from "next";
import { BUSINESS, COLLECTIONS, SITE_URL, toCard } from "@/lib/content";
import ShopAll from "@/components/pages/ShopAll";

export const metadata: Metadata = {
  title: "Shop Gold, Watches & Bullion in Cleethorpes",
  description: `Every piece in the case at S&L Jewellers, ${BUSINESS.address.town}: gold chains, bracelets, pre-owned watches, coins, bullion and collectibles. Ask for a price on any.`,
  alternates: { canonical: "/pieces" },
  openGraph: { title: "Shop all | S&L Jewellers", url: `${SITE_URL}/pieces`, images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "S&L Jewellers, Cleethorpes" }] },
};

/**
 * Shop all: every listed piece on one page, a chip per category to narrow it (Shaun, 7 Oct
 * 2026: "when you click shop all, it should show absolutely every product. It shouldn't take
 * you to what we sell ... with this little collection to choose from"). The categories keep
 * their own pages at /pieces/<slug>; a category with nothing listed has no chip.
 */
export default function ShopAllPage() {
  const cats = COLLECTIONS.filter((c) => (c.pieces?.length ?? 0) > 0).map((c) => ({ slug: c.slug, title: c.title, pieces: (c.pieces ?? []).map(toCard) }));
  return (
    <section className="on-black shop-page" aria-labelledby="shop-title">
      <div className="wrap">
        <header className="cxa">
          <div>
            <p className="eyebrow">S&amp;L Jewellers</p>
            <h1 id="shop-title" className="cxa-title">Shop all</h1>
          </div>
          <div className="cxa-side">
            <p className="cxa-blurb">Everything in the case. Stock moves daily and nothing is priced online: ask about a piece and you get a straight answer.</p>
          </div>
        </header>
        <ShopAll cats={cats} />
        <p className="mt-8 text-sm text-wall">Not affiliated with the brands we sell.</p>
      </div>
    </section>
  );
}
