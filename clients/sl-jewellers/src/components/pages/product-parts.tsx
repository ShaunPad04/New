import Link from "next/link";
import type { Collection, Piece } from "@/lib/content";
import AddToBasket from "@/components/basket/AddToBasket";
import WatchCard from "@/components/shop/WatchCard";
import { pieceHref } from "@/lib/piece-url";

/** Parts of the product page (round 7, 7 Oct 2026). Only facts S&L have given: their own title
 *  for the piece and how pricing works; the grouped details are lib/piece-details.ts and
 *  DetailsTabs.tsx. Nothing invented. */
export type ProductProps = { c: Collection; p: Piece; name: string; detail: string; more: Piece[] };

export function Crumbs({ c, name }: { c: Collection; name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="pd-crumbs">
      <Link href="/pieces">Shop all</Link>
      <span aria-hidden="true">/</span>
      <Link href={`/pieces/${c.slug}`}>{c.title}</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{name}</span>
    </nav>
  );
}

export function Actions({ c, p }: { c: Collection; p: Piece }) {
  return (
    <div className="pd-actions">
      <AddToBasket item={{ id: p.id, title: p.title, image: p.image, href: pieceHref(p), category: c.title }} />
      <Link href={`/enquiry?type=buying&piece=${encodeURIComponent(p.id)}`} className="pd-ask">
        Ask about this piece now <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export function More({ c, more }: { c: Collection; more: Piece[] }) {
  if (!more.length) return null;
  return (
    <section className="pd-more" aria-labelledby="pd-more-title">
      <div className="pd-more-head">
        <h2 id="pd-more-title" className="pd-more-title">More {c.title.toLowerCase()}</h2>
        <Link href={`/pieces/${c.slug}`} className="link-arrow">
          See all {c.pieces?.length ?? ""} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <ul className="pd-more-grid">
        {more.map((m) => (
          <li key={m.id}>
            <WatchCard piece={m} sizes="(min-width: 1024px) 22vw, 46vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
