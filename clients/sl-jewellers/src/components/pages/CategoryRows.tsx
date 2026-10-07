import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/content";
import Reveal from "@/components/Reveal";
import { splitTitle } from "@/components/shop/watch-data";
import { pieceHref } from "@/lib/piece-url";
import CategoryEmpty from "./CategoryEmpty";

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Category B, "Showcase" (round 7, 7 Oct 2026; after editorial product pages on Framer): the
 * name set huge and centred, then one piece per row, large, alternating sides, each with its
 * number, S&L's own title split into name and details, "Price on request" and a pill through
 * to the piece's own page.
 */
export default function CategoryRows({ c }: { c: Collection }) {
  const pieces = c.pieces ?? [];
  return (
    <div className="wrap">
      <header className="cxb-head">
        <p className="eyebrow">
          <Link href="/pieces" className="tap text-wall no-underline hover:text-paper">Shop all</Link>
        </p>
        <h1 className="cxb-title">{c.title}</h1>
        <p className="cxb-blurb">{c.blurb}</p>
        {pieces.length > 0 && <p className="cxb-count tnum">{pieces.length} in the case</p>}
      </header>

      {pieces.length > 0 ? (
        <ol className="cxb-list">
          {pieces.map((p, i) => {
            const { name, detail } = splitTitle(p.title);
            return (
              <Reveal as="li" key={p.id} className="cxb-row">
                <Link href={pieceHref(p)} className="cxb-media" tabIndex={-1} aria-hidden="true">
                  <Image src={p.image} alt="" fill sizes="(min-width: 900px) 44vw, 92vw" className="cxb-img" />
                </Link>
                <div className="cxb-copy">
                  <p className="cxb-no tnum" aria-hidden="true">
                    {num(i)} <span>/ {num(pieces.length - 1)}</span>
                  </p>
                  <h2 className="cxb-name">{name}</h2>
                  {detail && <p className="cxb-detail">{detail}</p>}
                  {p.note && <p className="cxb-detail">{p.note}</p>}
                  <p className="cxb-price">Price on request</p>
                  <Link href={pieceHref(p)} className="plan-cta cxb-cta">
                    <span>View the piece</span>
                    <span className="plan-disc" aria-hidden="true">
                      <svg viewBox="0 0 16 16" className="plan-arrow"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span className="sr-only">: {p.title}</span>
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </ol>
      ) : (
        <CategoryEmpty c={c} />
      )}
    </div>
  );
}
