import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import { COLL_TILES } from "./collections/data";
import CollCase from "./collections/CollCase";

/**
 * "Shop by collection": the display case (Shaun's pick, 8 Oct 2026: "use display C", of a
 * refined grid, an index and this). One row of trays to swipe across, a photo, name and count
 * each, every one through to its category's page (CollCase.tsx); then the button to every piece.
 * Watches lead on the Day-Date, since the watch rail straight underneath opens with the GMT.
 * The brands note sits once, under that watch rail.
 */
export default function Collections() {
  return (
    <section id="collections" className="on-black section" aria-labelledby="collections-title">
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">In the case now</p>
            <SplitHeading id="collections-title" text={"Shop by\n*collection.*"} className="display-l mt-3" />
          </div>
          <p className="max-w-[38ch] text-wall">
            It is all in the case, not a warehouse. Ask about any piece and you get the metal, the weight and a straight price. No waffle.
          </p>
        </Reveal>

        <CollCase tiles={COLL_TILES} />

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/pieces" className="btn btn-metal">
            See all pieces <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
