import type { CSSProperties } from "react";
import Image from "next/image";
import { Actions, Crumbs, Facts, More, type ProductProps } from "./product-parts";
import ZoomImage from "./ZoomImage";

/**
 * A piece's own page (Shaun, 7 Oct 2026: "an actual product page, like an e-commerce store,
 * just without the Buy now", with a basket that turns into one enquiry). Three layouts on the
 * walk-through's switch (?v=pdp:a|b|c) until he picks:
 *   A  Store: the photo large with a loupe zoom on the left, the details and actions beside it.
 *   B  Stage: the piece on a full black stage under its name set huge, then a sticky bar with
 *      the actions while the details scroll.
 *   C  Detail: the details held still on the left; on the right the photo, then two close
 *      crops of the same photo, labelled as such.
 * Each ends with more from the same category.
 */
export function ProductStore({ c, p, name, detail, more }: ProductProps) {
  return (
    <div className="wrap">
      <Crumbs c={c} name={name} />
      <div className="pda">
        <div className="pda-media">
          <ZoomImage src={p.image} alt={p.alt} sizes="(min-width: 1024px) 50vw, 100vw" priority />
        </div>
        <div className="pda-info">
          <p className="eyebrow">{c.title}</p>
          <h1 className="pd-title">{name}</h1>
          {detail && <p className="pd-detail">{detail}</p>}
          <p className="pd-price">Price on request</p>
          <Actions c={c} p={p} />
          <Facts c={c} p={p} />
          <p className="pd-note">{c.blurb} Not affiliated with the brands we sell.</p>
        </div>
      </div>
      <More c={c} more={more} />
    </div>
  );
}

export function ProductStage({ c, p, name, detail, more }: ProductProps) {
  return (
    <>
      <div className="pdb-stage">
        <p className="pdb-word" aria-hidden="true">{name}</p>
        <div className="pdb-photo">
          <Image src={p.image} alt={p.alt} fill priority sizes="(min-width: 900px) 46vw, 92vw" className="pdb-img" />
        </div>
        <div className="wrap pdb-top">
          <Crumbs c={c} name={name} />
        </div>
      </div>
      <div className="pdb-bar">
        <div className="wrap pdb-bar-in">
          <div className="pdb-bar-name">
            <h1 className="pdb-title">{name}</h1>
            <p className="pdb-sub">{detail || c.title} · Price on request</p>
          </div>
          <Actions c={c} p={p} />
        </div>
      </div>
      <div className="wrap">
        <div className="pdb-body">
          <div>
            <p className="eyebrow">{c.title}</p>
            <p className="pdb-lede">{c.blurb}</p>
            <p className="pd-note">Not affiliated with the brands we sell.</p>
          </div>
          <Facts c={c} p={p} />
        </div>
        <More c={c} more={more} />
      </div>
    </>
  );
}

export function ProductCrops({ c, p, name, detail, more }: ProductProps) {
  return (
    <div className="wrap">
      <Crumbs c={c} name={name} />
      <div className="pdc">
        <div className="pdc-info">
          <p className="pdc-cat">{c.title}</p>
          <h1 className="pd-title">{name}</h1>
          {detail && <p className="pd-detail">{detail}</p>}
          <p className="pd-price">Price on request</p>
          <Actions c={c} p={p} />
          <Facts c={c} p={p} />
        </div>
        <div className="pdc-gallery">
          <figure className="pdc-main">
            <Image src={p.image} alt={p.alt} fill priority sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" />
          </figure>
          <div className="pdc-crops">
            <figure className="pdc-crop" style={{ "--cx": "50%", "--cy": "38%" } as CSSProperties}>
              <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 26vw, 50vw" className="pdc-crop-img" />
              <figcaption>Detail</figcaption>
            </figure>
            <figure className="pdc-crop" style={{ "--cx": "50%", "--cy": "74%" } as CSSProperties}>
              <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 26vw, 50vw" className="pdc-crop-img" />
              <figcaption>Detail</figcaption>
            </figure>
          </div>
        </div>
      </div>
      <More c={c} more={more} />
    </div>
  );
}
