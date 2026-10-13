import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import CardMarquee from "@/components/motion/CardMarquee";
import WatchCard from "@/components/shop/WatchCard";
import { WATCHES } from "@/components/shop/watch-data";
import { toCard } from "@/lib/content";

/**
 * The watch shop (Shaun, 6 Oct 2026: "think e-commerce brand", enquiry only; round 2 of the
 * walk-through picked the new-in row and asked for it to run as a marquee, "consistently just
 * going across the screen"). Every watch in the case as a product card, drifting left; each
 * card opens an enquiry about that watch. Nothing is priced online and there is no basket.
 * Headed "Watches recently stocked" (Tom, WhatsApp group, Oct 2026), not "Watches in the case".
 */
export default function WatchShop() {
  if (!WATCHES.length) return null;
  return (
    <section id="watches" className="on-black section overflow-x-clip" aria-labelledby="watches-title">
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Pre-owned watches</p>
            <SplitHeading id="watches-title" text={"Watches recently\n*stocked.*"} className="display-l mt-3" />
          </div>
          <Link href="/pieces/watches" className="link-arrow">
            All {WATCHES.length} watches <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
      <div className="mt-10">
        <CardMarquee count={WATCHES.length} label="Watches recently stocked">
          {WATCHES.map((p) => (
            <WatchCard key={p.id} piece={toCard(p)} sizes="(min-width: 900px) 22vw, 60vw" />
          ))}
        </CardMarquee>
      </div>
      <div className="wrap">
        <p className="mt-6 text-xs text-wall">Not affiliated with the brands we sell. Stock moves daily; ask before you travel.</p>
      </div>
    </section>
  );
}
