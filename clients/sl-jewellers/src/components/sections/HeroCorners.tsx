import { BUSINESS } from "@/lib/content";
import OpenNowChip from "@/components/OpenNowChip";

/**
 * Small type anchored to the film's corners (Shaun's pick, round 1 of the walk-through,
 * after the Spector reference): the film untouched, with what the shop does, top left; the address,
 * bottom left; open now, bottom right beside the pause button; the categories running up
 * the right edge; and a scroll cue. Still no headline, no buttons.
 */
export default function HeroCorners() {
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
