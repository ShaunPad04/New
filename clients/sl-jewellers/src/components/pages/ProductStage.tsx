import Image from "next/image";
import { Actions, Crumbs, Facts, More, type ProductProps } from "./product-parts";

/**
 * A piece's own page (Shaun, 7 Oct 2026: "an actual product page, like an e-commerce store,
 * just without the Buy now", with a basket that turns into one enquiry). "Stage", Shaun's
 * pick of three in round 7: the piece on a full black stage under its name set huge, then a
 * bar with the name and the actions that sticks to the foot of the screen while the details
 * and more from the same category scroll past.
 */
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
