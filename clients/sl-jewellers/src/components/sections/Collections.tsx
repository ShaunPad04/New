import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, LAUNCH } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * "Shop by collection" (Shaun, 6 Oct 2026: was "Our pieces", and the starfield behind it
 * is gone). One compact tile per category (the piece
 * that fronts it, its name and a count) through to that category's page, where
 * the whole catalogue lives. The home page never shows everything.
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

        {/* Choose by category: one compact tile per category, through to its page. */}
        <Reveal group as="ul" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4" aria-label="Choose by category">
          {COLLECTIONS.map((c) => {
            const pieces = c.pieces ?? [];
            const star = pieces[0];
            const label = c.title.toLowerCase();
            return (
              <li key={c.slug} className={`card relative bg-graphite ${star ? "piece-card" : ""}`}>
                <Link href={`/pieces/${c.slug}`} className="block no-underline" aria-label={pieces.length ? `${c.title}: ${pieces.length} in the case` : `${c.title}: ask what is in`}>
                  <div className="piece-media relative aspect-square">
                    {star ? (
                      <Image src={star.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" loading="lazy" />
                    ) : (
                      <div className="grid h-full place-items-center px-4 text-center text-sm text-wall">Ask what is in</div>
                    )}
                  </div>
                  <div className="caption flex items-baseline justify-between gap-3 px-4 py-3">
                    <h3 className="font-display text-base font-medium">{c.title}</h3>
                    <span className="shrink-0 text-xs text-wall tnum">{pieces.length ? `${pieces.length} in` : `ask`}</span>
                  </div>
                  {!LAUNCH && c.todo && <span className="todo mx-4 mb-3">{c.todo}</span>}
                </Link>
              </li>
            );
          })}
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
