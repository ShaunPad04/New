import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import RailControls from "./RailControls";
import WatchCard from "./WatchCard";
import { WATCHES } from "./watch-data";

/**
 * Watch shop A, "New-in carousel" (round 2; 21st "Carousel" / "Product Card"): every watch in
 * the case as a product card in a swipeable rail with arrows. Enquiry only.
 */
export default function WatchRail() {
  return (
    <section className="on-black section overflow-x-clip" aria-labelledby="watches-title-a">
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Pre-owned watches</p>
            <SplitHeading id="watches-title-a" text={"Watches in\n*the case.*"} className="display-l mt-3" />
          </div>
          <Link href="/pieces/watches" className="link-arrow">
            All {WATCHES.length} watches <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <RailControls label="Watches in the case" className="mt-10">
          {WATCHES.map((p) => (
            <WatchCard key={p.id} piece={p} rail sizes="(min-width: 900px) 22vw, 64vw" />
          ))}
        </RailControls>
        <p className="mt-6 text-xs text-wall">Not affiliated with the brands we sell. Stock moves daily; ask before you travel.</p>
      </div>
    </section>
  );
}
