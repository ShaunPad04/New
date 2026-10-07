import type { Metadata } from "next";
import { BUSINESS, SITE_URL } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import PiecesPanels from "@/components/pages/PiecesPanels";
import PiecesStrip from "@/components/pages/PiecesStrip";
import PiecesTilt from "@/components/pages/PiecesTilt";
import { CATEGORY_CARDS } from "@/components/pages/pieces-data";

export const metadata: Metadata = {
  title: "Our pieces: gold, watches, bullion and more in Cleethorpes",
  description: `Every category in the case at S&L Jewellers, ${BUSINESS.address.street}, ${BUSINESS.address.town}: chains, watches, bracelets, coins and bullion, rings, pendants and collectibles. Ask for a price on any piece.`,
  alternates: { canonical: "/pieces" },
  openGraph: { title: "Our pieces | S&L Jewellers", url: `${SITE_URL}/pieces` },
};

/**
 * The catalogue's front door: every category, each showing the piece that fronts it
 * (or its illustrated cover while nothing is listed) and how many are in, through to the
 * category's page. Three layouts on the walk-through's switch until Shaun picks.
 */
export default function PiecesIndex() {
  return (
    <section className="on-black section" aria-labelledby="pieces-title">
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">What we sell</p>
            <SplitHeading as="h1" id="pieces-title" text={"Our *pieces.*"} className="display-l mt-3" />
          </div>
          <p className="max-w-[38ch] text-wall">
            Pick a category to see everything listed in it. Stock moves daily and nothing is priced online: ask about a piece and you get a straight answer.
          </p>
        </Reveal>
      </div>

      {/* Round 7 of the walk-through (7 Oct 2026): three layouts on the preview switch, ?v=pieces:b */}
      <div data-x="pieces" data-x-dir="a">
        <div className="wrap mt-10">
          <PiecesPanels />
        </div>
      </div>
      <div data-x="pieces" data-x-dir="b">
        <div className="mt-10">
          <PiecesStrip cards={CATEGORY_CARDS} />
        </div>
      </div>
      <div data-x="pieces" data-x-dir="c">
        <div className="wrap mt-10">
          <PiecesTilt cards={CATEGORY_CARDS} />
        </div>
      </div>

      <div className="wrap">
        <p className="mt-8 text-sm text-wall">Not affiliated with the brands we sell.</p>
      </div>
    </section>
  );
}
