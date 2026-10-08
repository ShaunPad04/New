import Image from "next/image";
import Link from "next/link";
import { BUSINESS, brandOf } from "@/lib/content";
import { pieceDetails, type Figure, type PieceDetails } from "@/lib/piece-details";
import AddToBasket from "@/components/basket/AddToBasket";
import { pieceHref } from "@/lib/piece-url";
import { Actions, Crumbs, More, type ProductProps } from "./product-parts";
import DetailsTabs from "./DetailsTabs";
import Gallery from "./Gallery";
import StickyBuy from "./StickyBuy";
import Watch3D from "./Watch3D";

/**
 * A piece's own page, three ways while Shaun picks (?v=pdp:a|b|c). 8 Oct 2026, first: "add the
 * details on the left and right hand side of the actual product image / 360 thing"; then, for a
 * computer: "the product to one side and then the add to basket ... an e-commerce kind of vibe".
 * All three keep the black stage, the tabs and "More" underneath. On a phone all three stack the
 * same way, with room to breathe: crumbs, the piece, its name, the figures two by two, then the
 * buttons ("this is so squished"). The buy bar only appears once those buttons have scrolled
 * away (StickyBuy.tsx).
 *   A  Shop: the piece large on the left with thumbnails (front, back, 360°) under it; on the
 *      right, kept in view as the pictures scroll, the name, the buttons, how buying works and
 *      the figures (Gallery.tsx).
 *   B  Flanked: the name and the buttons on the left of the piece, its figures stacked on the right.
 *   C  Callouts: the figures either side of the piece on hairline leaders, like a maker's
 *      technical drawing, over the piece's name set huge and faint; the name and buttons beneath.
 * Nothing new is claimed: the figures and rows are lib/piece-details.ts, as before.
 */
type View = ProductProps & { uid: string };

/**
 * What sits beside the piece: its headline figures; a piece with none (a ring, a collectible)
 * shows its first details instead, and one S&L list with no details at all (a "Gold Cuban
 * Chain") is topped up with how the shop sells, as the header and the Buying tab already say.
 */
type Side = { label: string; value: string; unit?: string; text?: boolean };
const SHOP_SIDE: Side[] = [
  { label: "See it at", value: BUSINESS.address.street, text: true },
  { label: "Weighed and priced", value: "In front of you", text: true },
  { label: "Stock", value: "Moves daily, ask us", text: true },
];
const sideOf = (d: PieceDetails): Side[] => {
  const own: Side[] = d.figures.length
    ? d.figures
    : d.piece.filter(([k]) => k !== "Note" && k !== "Category").slice(0, 4).map(([label, value]) => ({ label, value, text: true }));
  return own.length >= 2 ? own : [...own, ...SHOP_SIDE].slice(0, 3);
};

function Head({ p, name, detail, c }: Pick<View, "p" | "name" | "detail" | "c">) {
  const brand = brandOf(p);
  return (
    <div className="pdv-head">
      <h1 className="pdv-name">
        {brand && <span className="pdv-brand">{brand}</span>}
        {name}
      </h1>
      <p className="pdv-detail">{detail || c.title}</p>
      <p className="pdv-price">Price on request</p>
    </div>
  );
}

function Stage({ p, name }: Pick<View, "p" | "name">) {
  return (
    <div className="pdb-stage pdv-stage">
      <div className={`pdb-photo pdv-photo${p.cutout ? " is-cut" : ""}`}>
        <Image src={p.cutout || p.image} alt={p.alt} fill priority sizes="(min-width: 1024px) 40vw, 92vw" className="pdb-img" />
      </div>
      {p.model && <Watch3D src={p.model} label={name} />}
    </div>
  );
}

function Value({ f }: { f: Side | Figure }) {
  return (
    <span className={`pdv-v tnum${"text" in f && f.text ? " is-text" : ""}`}>
      {f.value}
      {f.unit && <small>{f.unit}</small>}
    </span>
  );
}

function Figs({ items, className = "" }: { items: Side[]; className?: string }) {
  if (!items.length) return null;
  return (
    <ul className={`pdv-figs ${className}`}>
      {items.map((f) => (
        <li key={f.label}>
          <Value f={f} />
          <span className="pdv-k">{f.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Buy({ c, p }: Pick<View, "c" | "p">) {
  return (
    <div className="pdv-buy" data-buy>
      <Actions c={c} p={p} />
    </div>
  );
}

function Below({ c, p, d, more, uid }: Pick<View, "c" | "p" | "more" | "uid"> & { d: PieceDetails }) {
  const ask = `/enquiry?type=buying&piece=${encodeURIComponent(p.id)}`;
  return (
    <div className="wrap" id={`${uid}-details`}>
      <DetailsTabs d={d} ask={ask} uid={uid} />
      <More c={c} more={more} />
    </div>
  );
}

function Sticky({ c, p, name, detail }: Pick<View, "c" | "p" | "name" | "detail">) {
  return (
    <StickyBuy>
      <div className="wrap pdv-sticky-in">
        <div className="pdv-sticky-name">
          <p>{name}</p>
          <p className="pdv-sticky-sub">{detail || c.title} · Price on request</p>
        </div>
        <div className="pdv-sticky-act">
          <AddToBasket item={{ id: p.id, title: p.title, image: p.image, href: pieceHref(p), category: c.title }} />
          <Link href={`/enquiry?type=buying&piece=${encodeURIComponent(p.id)}`} className="pd-ask pdv-sticky-ask">
            Ask <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </StickyBuy>
  );
}

const Jump = ({ uid }: { uid: string }) => (
  <a href={`#${uid}-details`} className="pdv-jump">
    Full details <span aria-hidden="true">↓</span>
  </a>
);

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Pin = () => <Icon d="M10 17.5s5.5-5 5.5-9.2a5.5 5.5 0 0 0-11 0c0 4.2 5.5 9.2 5.5 9.2ZM10 10.2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />;
const Scales = () => <Icon d="M10 3v14M6 17h8M4 6h12M4 6l-2 5a2.5 2.5 0 0 0 4 0L4 6Zm12 0-2 5a2.5 2.5 0 0 0 4 0l-2-5Z" />;
const Clock = () => <Icon d="M10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM10 6v4.2l2.8 1.8" />;

/** A · Shop */
export function ProductA(props: View) {
  const { c, p, name, detail, uid } = props;
  const d = pieceDetails(c, p, detail);
  const ask = `/enquiry?type=buying&piece=${encodeURIComponent(p.id)}`;
  const b = BUSINESS;
  return (
    <div className="pdv-root">
      <section className="pdv pdv-a" aria-label={name}>
        <div className="wrap">
          <Crumbs c={c} name={name} />
          <div className="pdv-shop">
            <Gallery front={p.cutout || p.image} back={p.back} alt={p.alt} cut={!!p.cutout} model={p.model} label={name} />
            <div className="pdv-box">
              <Head p={p} name={name} detail={detail} c={c} />
              <div className="pdv-box-buy" data-buy>
                <AddToBasket item={{ id: p.id, title: p.title, image: p.image, href: pieceHref(p), category: c.title }} />
                <Link href={ask} className="pdv-ask">
                  Ask about this piece <span aria-hidden="true">→</span>
                </Link>
              </div>
              <ul className="pdv-assure">
                <li>
                  <Pin /> See it in the shop, {b.address.street}
                </li>
                <li>
                  <Scales /> Weighed and priced in front of you
                </li>
                <li>
                  <Clock /> Stock moves daily, so ask us to check it is in
                </li>
              </ul>
              <p className="pdv-label">At a glance</p>
              <Figs items={sideOf(d)} className="is-grid" />
              <Jump uid={uid} />
            </div>
          </div>
        </div>
      </section>
      <Below {...props} d={d} />
      <Sticky c={c} p={p} name={name} detail={detail} />
    </div>
  );
}

/** B · Flanked */
export function ProductB(props: View) {
  const { c, p, name, detail, uid } = props;
  const d = pieceDetails(c, p, detail);
  return (
    <div className="pdv-root">
      <section className="pdv pdv-b" aria-label={name}>
        <div className="wrap">
          <Crumbs c={c} name={name} />
          <div className="pdv-b-grid">
            <Head p={p} name={name} detail={detail} c={c} />
            <Buy c={c} p={p} />
            <Stage p={p} name={name} />
            <div className="pdv-b-side">
              <Figs items={sideOf(d)} className="is-stack" />
              <Jump uid={uid} />
            </div>
          </div>
        </div>
      </section>
      <Below {...props} d={d} />
      <Sticky c={c} p={p} name={name} detail={detail} />
    </div>
  );
}

/** C · Callouts */
export function ProductC(props: View) {
  const { c, p, name, detail, uid } = props;
  const d = pieceDetails(c, p, detail);
  const items = sideOf(d);
  const half = Math.ceil(items.length / 2);
  return (
    <div className="pdv-root">
      <section className="pdv pdv-c" aria-label={name}>
        <div className="wrap">
          <Crumbs c={c} name={name} />
          <div className="pdv-c-grid">
            <p className="pdb-word pdv-word" aria-hidden="true">
              {name}
            </p>
            <Figs items={items.slice(0, half)} className="is-call is-l" />
            <Stage p={p} name={name} />
            <Figs items={items.slice(half)} className="is-call is-r" />
            <Figs items={items} className="is-phone" />
            <div className="pdv-c-foot">
              <Head p={p} name={name} detail={detail} c={c} />
              <Buy c={c} p={p} />
            </div>
          </div>
          <Jump uid={uid} />
        </div>
      </section>
      <Below {...props} d={d} />
      <Sticky c={c} p={p} name={name} detail={detail} />
    </div>
  );
}
