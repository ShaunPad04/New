import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, LAUNCH } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * "Shop by collection" as a bento (Shaun's pick in round 2 of the walk-through, 6 Oct 2026;
 * after 21st "Bento Grid"): watches as the large tile, chains, bracelets, coins & bullion
 * and collectibles around it. Each tile: S&L's own photo, the name, the count, through to the
 * category's page. Categories with nothing listed yet (rings, pendants) show a wide tile with
 * an illustration (`cover` in content/collections.json) and "Ask what is in"; without a
 * cover they fall back to a slim text tile.
 */
const ORDER = ["watches", "chains", "bracelets", "bullion", "collectibles"];

export default function Collections() {
  const withPhoto = ORDER.map((s) => COLLECTIONS.find((c) => c.slug === s)).filter((c) => c?.pieces?.length) as typeof COLLECTIONS;
  const rest = COLLECTIONS.filter((c) => !c.pieces?.length);
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
        <Reveal group as="ul" className="bento" aria-label="Collections">
          {withPhoto.map((c, i) => (
            <li key={c.slug} className={i === 0 ? "bento-big" : ""}>
              <Link href={`/pieces/${c.slug}`} className="bento-tile">
                <Image src={c.pieces![0].image} alt="" fill sizes={i === 0 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 50vw"} className="bento-img" />
                <span className="bento-cap">
                  <span className="bento-name">{c.title}</span>
                  <span className="bento-count tnum">{c.pieces!.length} in the case</span>
                </span>
                <span className="bento-arrow" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </Link>
            </li>
          ))}
          {rest.map((c) =>
            c.cover ? (
              <li key={c.slug} className="bento-wide">
                <Link href={`/pieces/${c.slug}`} className="bento-tile">
                  <Image src={c.cover} alt="" fill sizes="(min-width: 900px) 50vw, 50vw" className="bento-img" style={{ objectPosition: c.coverFocus }} />
                  <span className="bento-cap">
                    <span className="bento-name">{c.title}</span>
                    <span className="bento-count">Ask what is in</span>
                  </span>
                  <span className="bento-arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </Link>
              </li>
            ) : (
              <li key={c.slug} className="bento-slim">
                <Link href={`/pieces/${c.slug}`} className="bento-text">
                  <span className="bento-name">{c.title}</span>
                  <span className="bento-count">Ask what is in →</span>
                </Link>
                {!LAUNCH && c.todo && <span className="todo mt-2">{c.todo}</span>}
              </li>
            ),
          )}
        </Reveal>

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
