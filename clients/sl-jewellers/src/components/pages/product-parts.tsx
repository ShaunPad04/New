import Link from "next/link";
import type { Collection, Piece } from "@/lib/content";
import { BUSINESS, referenceSpec } from "@/lib/content";
import AddToBasket from "@/components/basket/AddToBasket";
import WatchCard from "@/components/shop/WatchCard";
import { pieceHref } from "@/lib/piece-url";

/** Parts of the product page (round 7, 7 Oct 2026). Only facts S&L have given: their own title
 *  for the piece, its category and how pricing works, plus, for a named reference, the maker's
 *  own specification with its source (Spec). Nothing invented. */
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

export function Facts({ c, p }: { c: Collection; p: Piece }) {
  const b = BUSINESS;
  const rows: [string, string][] = [
    ["Category", c.title],
    ["Listed as", p.title],
    ...(p.note ? ([["Note", p.note]] as [string, string][]) : []),
    ["Price", "On request: priced on the counter, or by message"],
    ["In stock", "Stock moves daily, so ask to check it is still in"],
    ["See it", `${b.address.street}, ${b.address.town}`],
  ];
  return (
    <dl className="pd-facts">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The reference's own specification, in the maker's words, with where it came from. It
 *  describes the reference as made, so it sits apart from the facts about this watch. */
export function Spec({ p }: { p: Piece }) {
  const s = referenceSpec(p.reference);
  if (!s || !p.reference) return null;
  return (
    <section className="pd-spec" aria-labelledby="pd-spec-title">
      <h2 id="pd-spec-title" className="pd-spec-title">
        The reference <span className="tnum">{p.reference}</span>
      </h2>
      <p className="pd-spec-lede">
        {s.maker} {s.model}, as {s.maker} specifies it.
      </p>
      <dl className="pd-facts">
        {s.rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="pd-note">
        {s.maker}&rsquo;s catalogue wording, from{" "}
        <a href={s.source.url} target="_blank" rel="noopener nofollow">
          {s.source.name}
        </a>
        . It describes the reference as made; for this watch&rsquo;s condition, service history and papers, ask us.
      </p>
    </section>
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
