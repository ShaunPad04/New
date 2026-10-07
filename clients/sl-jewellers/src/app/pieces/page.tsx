import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS, COLLECTIONS, SITE_URL } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";

export const metadata: Metadata = {
  title: "Our pieces: gold, watches, bullion and more in Cleethorpes",
  description: `Every category in the case at S&L Jewellers, ${BUSINESS.address.street}, ${BUSINESS.address.town}: chains, watches, bracelets, coins and bullion, rings, pendants and collectibles. Ask for a price on any piece.`,
  alternates: { canonical: "/pieces" },
  openGraph: { title: "Our pieces | S&L Jewellers", url: `${SITE_URL}/pieces` },
};

/**
 * The catalogue's front door: one card per category, each showing the piece
 * that fronts it and how many are listed, through to that category's page.
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

        <Reveal group as="ul" className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {COLLECTIONS.map((c) => {
            const pieces = c.pieces ?? [];
            const star = pieces[0];
            return (
              <li key={c.slug} className={`card relative bg-graphite ${star || c.cover ? "piece-card" : ""}`}>
                <Link href={`/pieces/${c.slug}`} className="block no-underline">
                  <div className="piece-media relative aspect-[4/5]">
                    {star ? (
                      <Image src={star.image} alt={star.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" loading="lazy" />
                    ) : c.cover ? (
                      <Image src={c.cover} alt="" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" loading="lazy" />
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-wall">Nothing listed yet</div>
                    )}
                  </div>
                  <div className="caption p-4">
                    <h2 className="display-s">{c.title}</h2>
                    <p className="mt-1 text-sm text-wall">{pieces.length ? `${pieces.length} in the case` : "Ask what is in"}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </Reveal>

        <p className="mt-8 text-sm text-wall">Not affiliated with the brands we sell.</p>
      </div>
    </section>
  );
}
