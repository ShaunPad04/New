/**
 * Small type anchored to the film's corners (Shaun's pick, round 1 of the walk-through,
 * after the Spector reference): the film untouched, with what the shop does, bottom left (moved from the top left on 7 Oct
 * 2026, Shaun); the
 * categories running up the right edge; and a scroll cue. Still no headline, no buttons.
 * The address and open-now came off the film's foot on 6 Oct 2026 (Shaun): the header strip
 * right above already says both.
 */
export default function HeroCorners() {
  return (
    <div className="hero-b">
      <p className="hero-b-bl">
        <span className="hero-b-idx">(01)</span> Gold, watches and bullion,
        <br />
        bought and sold over the counter
      </p>
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
