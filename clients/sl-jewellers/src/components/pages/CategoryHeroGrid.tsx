import Link from "next/link";
import type { Collection } from "@/lib/content";
import Reveal from "@/components/Reveal";
import WatchCard from "@/components/shop/WatchCard";
import CategoryEmpty from "./CategoryEmpty";

/**
 * Category A, "Hero and case" (round 7, 7 Oct 2026; after Framer store templates): the
 * category's name, its line and the count over a hairline, then every piece as the same
 * product card the homepage watch shop uses. The lead piece's photo that sat beside the name
 * went on Shaun's word ("we don't need the picture of the necklace").
 */
export default function CategoryHeroGrid({ c }: { c: Collection }) {
  const pieces = c.pieces ?? [];
  return (
    <div className="wrap">
      <header className="cxa">
        <div>
          <p className="eyebrow">
            <Link href="/pieces" className="tap cxa-back text-wall no-underline hover:text-paper">
              <span aria-hidden="true">←</span> Shop all
            </Link>
          </p>
          <h1 className="cxa-title">{c.title}</h1>
        </div>
        <div className="cxa-side">
          <p className="cxa-blurb">{c.blurb}</p>
          <p className="cxa-count tnum">{pieces.length ? `${pieces.length} in the case · every one priced on the counter` : "Nothing listed right now"}</p>
        </div>
      </header>

      {pieces.length > 0 ? (
        <Reveal group as="ul" className="cxa-grid">
          {pieces.map((p) => (
            <li key={p.id}>
              <WatchCard piece={p} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw" />
            </li>
          ))}
        </Reveal>
      ) : (
        <CategoryEmpty c={c} cover={false} />
      )}
    </div>
  );
}
