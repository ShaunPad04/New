import Image from "next/image";
import Link from "next/link";
import { BUSINESS, COLLECTIONS } from "@/lib/content";
import OpenNowChip from "@/components/OpenNowChip";

/**
 * Hero B, "Film + corner microtype" (round 1): the film untouched, with small type anchored
 * to its corners (after the Spector reference): what the shop does, top left; the address,
 * bottom left; open now, bottom right beside the pause button; the categories running up
 * the right edge; and a scroll cue. Still no headline, no buttons.
 */
export function HeroCorners() {
  const b = BUSINESS;
  return (
    <div className="hero-b">
      <p className="hero-b-tl">
        <span className="hero-b-idx">(01)</span> Gold, watches and bullion,
        <br />
        bought and sold over the counter
      </p>
      <p className="hero-b-bl">
        {b.address.street}
        <br />
        {b.address.town} {b.address.postcode}
      </p>
      <div className="hero-b-br">
        <OpenNowChip compact />
      </div>
      <p className="hero-b-rail" aria-hidden="true">
        Chains · Watches · Bracelets · Coins & bullion · Collectibles — Cleethorpes
      </p>
      <a href="#collections" className="hero-b-cue">
        <span>Scroll</span>
        <span className="hero-b-line" aria-hidden="true" />
      </a>
    </div>
  );
}

/** Four pieces from the case for the dock: the first of each of four categories. */
const DOCK = ["watches", "chains", "bracelets", "bullion"]
  .map((slug) => COLLECTIONS.find((c) => c.slug === slug))
  .filter((c) => c?.pieces?.length)
  .map((c) => ({ cat: c!.title, piece: c!.pieces![0] }));

/**
 * Hero C, "Film + product dock" (round 1): the film with a slim strip of four pieces from
 * the case docked along its foot, each with its photo, name and an Enquire link, and a link
 * to everything. Shop first, still no headline.
 */
export function HeroDock() {
  return (
    <div className="hero-c">
      <div className="wrap hero-c-dock">
        <p className="hero-c-label">In the case now</p>
        <ul className="hero-c-list">
          {DOCK.map(({ cat, piece }) => {
            const name = piece.title.split(",")[0];
            return (
              <li key={piece.id}>
                <Link href={`/enquiry?type=buying&item=${encodeURIComponent(piece.title)}`} className="hero-c-item">
                  <span className="hero-c-thumb">
                    <Image src={piece.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="hero-c-text">
                    <span className="hero-c-cat">{cat}</span>
                    <span className="hero-c-name">{name}</span>
                  </span>
                  <span className="hero-c-enq">Enquire</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/pieces" className="hero-c-all">
          Shop all <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
