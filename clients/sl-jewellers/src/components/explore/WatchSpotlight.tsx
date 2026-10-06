import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import WatchCard from "./WatchCard";
import { WATCHES, enquiryHref, splitTitle } from "./watch-data";

/**
 * Watch shop B, "Spotlight" (round 2; 21st "Featured Product Showcase"): one watch large, with
 * its full listing line and an Enquire pill, and four more beside it. Enquiry only.
 */
export default function WatchSpotlight() {
  const [hero, ...rest] = WATCHES;
  if (!hero) return null;
  const { name, detail } = splitTitle(hero.title);
  return (
    <section className="on-black section" aria-labelledby="watches-title-b">
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Pre-owned watches</p>
            <SplitHeading id="watches-title-b" text={"Watches in\n*the case.*"} className="display-l mt-3" />
          </div>
          <Link href="/pieces/watches" className="link-arrow">
            All {WATCHES.length} watches <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <div className="spot mt-10">
          <Reveal className="spot-hero">
            <span className="spot-media">
              <Image src={hero.image} alt={hero.alt} fill sizes="(min-width: 1024px) 46vw, 100vw" className="spot-img" />
              <span className="pcard-tag">In the case</span>
            </span>
            <span className="spot-body">
              <span className="spot-name">{name}</span>
              {detail && <span className="spot-detail">{detail}</span>}
              <span className="spot-price">Ask for a price</span>
              <Link href={enquiryHref(hero)} className="pill-metal spot-cta">
                <span>Enquire about this watch</span>
                <span className="plan-disc" aria-hidden="true">
                  <svg viewBox="0 0 16 16" className="plan-arrow"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </Link>
            </span>
          </Reveal>
          <Reveal group as="ul" className="spot-grid" aria-label="More watches">
            {rest.slice(0, 4).map((p) => (
              <li key={p.id}>
                <WatchCard piece={p} sizes="(min-width: 1024px) 22vw, 46vw" />
              </li>
            ))}
          </Reveal>
        </div>
        <p className="mt-6 text-xs text-wall">Not affiliated with the brands we sell. Stock moves daily; ask before you travel.</p>
      </div>
    </section>
  );
}
