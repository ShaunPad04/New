import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/content";
import Reveal from "@/components/Reveal";
import WatchCard from "@/components/shop/WatchCard";
import CategoryEmpty from "./CategoryEmpty";

/**
 * Category A, "Hero and case" (round 7, 7 Oct 2026; after Framer store templates): a framed
 * band with the category's lead piece lit on the right and its name set large on the left,
 * then every piece as the same product card the homepage watch shop uses (name, details,
 * "Ask for a price", Enquire).
 */
export default function CategoryHeroGrid({ c }: { c: Collection }) {
  const pieces = c.pieces ?? [];
  const lead = pieces[0]?.image ?? c.cover;
  return (
    <div className="wrap">
      <header className="cxa">
        {lead && (
          <div className="cxa-media">
            <Image src={lead} alt="" fill priority sizes="(min-width: 900px) 40vw, 90vw" className="cxa-img" style={{ objectPosition: pieces[0] ? undefined : c.coverFocus }} />
          </div>
        )}
        <div className="cxa-copy">
          <p className="eyebrow">
            <Link href="/pieces" className="tap text-wall no-underline hover:text-paper">Shop all</Link>
          </p>
          <h1 className="cxa-title">{c.title}</h1>
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
