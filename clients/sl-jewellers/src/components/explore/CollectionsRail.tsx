import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import RailControls from "./RailControls";

/**
 * Shop by collection C, "Snap rail" (round 2; 21st "Snap Carousel"): tall portrait cards in a
 * horizontal scroll-snap rail, each with its number, S&L's own photo, the name and the count,
 * with arrows and a progress line. Swipe on phones.
 */
export default function CollectionsRail() {
  return (
    <section className="on-black section overflow-x-clip" aria-labelledby="collections-title-c">
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">In the case now</p>
            <SplitHeading id="collections-title-c" text={"Shop by\n*collection.*"} className="display-l mt-3" />
          </div>
          <p className="max-w-[38ch] text-wall">
            It is all in the case, not a warehouse. Ask about any piece and you get the metal, the weight and a straight price. No waffle.
          </p>
        </Reveal>
        <RailControls label="Collections" className="mt-10">
          {COLLECTIONS.map((c, i) => {
            const piece = c.pieces?.[0];
            return (
              <Link key={c.slug} href={`/pieces/${c.slug}`} className="crail-card" data-rail-item>
                <span className="crail-media">
                  {piece ? <Image src={piece.image} alt="" fill sizes="(min-width: 900px) 26vw, 72vw" className="crail-img" /> : <span className="crail-empty">Ask what is in</span>}
                </span>
                <span className="crail-idx tnum" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="crail-foot">
                  <span className="crail-name">{c.title}</span>
                  <span className="crail-count tnum">{c.pieces?.length ? `${c.pieces.length} in the case` : "Ask"}</span>
                </span>
              </Link>
            );
          })}
        </RailControls>
      </div>
    </section>
  );
}
