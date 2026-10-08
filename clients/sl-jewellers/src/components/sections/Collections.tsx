import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import { COLL_TILES } from "./collections/data";
import CollIndex from "./collections/CollIndex";
import CollCase from "./collections/CollCase";

/**
 * "Shop by collection", three ways while Shaun picks (?v=coll:a|b|c, 8 Oct 2026: "What do you
 * think to the shop by collection? ... I'm not too sure"). The heading, the button to every
 * piece and the note are the same in all three; each category goes through to its own page.
 *   A  Refined grid: the bento kept, the names in a band under each photo instead of over the
 *      piece, the watches tile on the Day-Date (the rail below opens with the GMT), and rings
 *      and pendants, which have nothing listed, folded into one slim line.
 *   B  Index: the categories as large names in a numbered list with counts; the photo of the one
 *      under the pointer shows beside it (CollIndex.tsx).
 *   C  Display case: one row of trays to swipe across, a photo, name and count each (CollCase.tsx).
 */
const Arrow = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Collections() {
  const full = COLL_TILES.filter((t) => !t.empty);
  const empty = COLL_TILES.filter((t) => t.empty);
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

        {/* A · Refined grid */}
        <div data-x="coll" data-x-dir="a">
          <Reveal group as="ul" className="cla" aria-label="Collections">
            {full.map((t, i) => (
              <li key={t.slug} className={i === 0 ? "cla-big" : ""}>
                <Link href={t.href} className="cla-tile">
                  <span className="cla-media">
                    <Image src={t.image} alt="" fill sizes={i === 0 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 50vw"} className="cla-img" />
                  </span>
                  <span className="cla-band">
                    <span className="cla-name">{t.title}</span>
                    <span className="cla-count tnum">{t.count} in the case</span>
                    <span className="cla-arrow">
                      <Arrow />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
          {empty.length > 0 && (
            <p className="cla-also">
              <span className="cla-also-h">Also ask about</span>
              {empty.map((t, i) => (
                <span key={t.slug}>
                  {i > 0 && <span className="cla-dot" aria-hidden="true">·</span>}
                  <Link href={t.href}>{t.title}</Link>
                </span>
              ))}
              <span className="cla-also-note">Nothing listed today; ask what is in.</span>
            </p>
          )}
        </div>

        {/* B · Index */}
        <div data-x="coll" data-x-dir="b">
          <CollIndex tiles={COLL_TILES} />
        </div>

        {/* C · Display case */}
        <div data-x="coll" data-x-dir="c">
          <CollCase tiles={COLL_TILES} />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/pieces" className="btn btn-metal">
            See all pieces <span aria-hidden="true">→</span>
          </Link>
        </div>

        <p className="mt-10 text-sm text-wall">
          Not affiliated with the brands we sell. Stock moves daily, so open a category to see what is
          listed, or catch what landed this week on Instagram.
        </p>
      </div>
    </section>
  );
}
