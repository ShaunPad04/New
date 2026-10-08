import Image from "next/image";
import { brandOf } from "@/lib/content";
import { pieceDetails } from "@/lib/piece-details";
import { Actions, Crumbs, More, type ProductProps } from "./product-parts";
import DetailsTabs from "./DetailsTabs";
import Watch3D from "./Watch3D";

/**
 * A piece's own page (Shaun, 7 Oct 2026: "an actual product page, like an e-commerce store,
 * just without the Buy now", with a basket that turns into one enquiry). "Stage", Shaun's
 * pick of three in round 7: the piece on a full black stage under its name set huge, then a
 * bar with the name and the actions that sticks to the foot of the screen while the details
 * and more from the same category scroll past. A watch with a model (piece.model) can be
 * turned in 3D on the stage; the photo stays underneath as the first paint and the fallback.
 */
export function ProductStage({ c, p, name, detail, more }: ProductProps) {
  const d = pieceDetails(c, p, detail);
  // the maker sits above the name, inside the heading ("Rolex / GMT-Master II 'Bruce Wayne'")
  const brand = brandOf(p);
  const ask = `/enquiry?type=buying&piece=${encodeURIComponent(p.id)}`;
  return (
    <>
      <div className="pdb-stage">
        <p className="pdb-word" aria-hidden="true">{name}</p>
        <div className={`pdb-photo${p.cutout ? " is-cut" : ""}`}>
          <Image src={p.cutout || p.image} alt={p.alt} fill priority sizes="(min-width: 900px) 46vw, 92vw" className="pdb-img" />
        </div>
        {p.model && <Watch3D src={p.model} label={name} />}
        <div className="wrap pdb-top">
          <Crumbs c={c} name={name} />
        </div>
      </div>
      <div className="pdb-bar">
        <div className="wrap pdb-bar-in">
          <div className="pdb-bar-name">
            <h1 className="pdb-title">
              {brand && <span className="pdb-brand">{brand}</span>}
              {name}
            </h1>
            <p className="pdb-sub">{detail || c.title} · Price on request</p>
          </div>
          <Actions c={c} p={p} />
        </div>
      </div>
      <div className="wrap">
        {/* the details, grouped into tabs (Shaun's pick A of three in round 8, 7 Oct 2026) */}
        <DetailsTabs d={d} ask={ask} />
        <More c={c} more={more} />
      </div>
    </>
  );
}
