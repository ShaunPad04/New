import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The oversized outlined wordmark across the foot of the page.
 *
 * A studio signature rather than a piece of information — the name is already
 * in the header, in the footer's own lockup and in the copyright line, so this
 * says nothing new and is marked `aria-hidden`. A screen reader hearing
 * "BlackLineAgency" a fourth time on the way out is noise, not branding.
 *
 * WHY SVG RATHER THAN A HEADING WITH `-webkit-text-stroke`. Three reasons, in
 * order of how much they matter here:
 *
 *  1. It fills the measure exactly. `textLength` makes the glyphs meet the
 *     container edges at every viewport, which is the entire effect. Sizing
 *     HTML text in `vw` only approximates it, and the approximation drifts
 *     with the container's padding — which changes twice between 390px and
 *     1600px in this footer.
 *  2. `-webkit-text-stroke` is unprefixed nowhere and centres the stroke on
 *     the glyph edge, so it thins the counters as it thickens. An SVG stroke
 *     is honest and identical in every engine.
 *  3. Transparent-filled HTML text is a colour-contrast finding waiting to
 *     happen. axe treats text as text whether or not it is `aria-hidden`, and
 *     text with `color: transparent` over a dark ground is exactly the shape
 *     of a real failure. SVG `<text>` is outside that rule, which keeps the
 *     audit honest about the copy that IS meant to be read.
 *
 * `vectorEffect="non-scaling-stroke"` keeps the hairline at one device pixel
 * whatever the width — without it the stroke scales with the viewBox and the
 * mark reads as a thin outline on a phone and a heavy one on a large display.
 */
export function FooterWordmark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 120"
      className={cn("block w-full select-none", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x="0"
        y="95"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        fill="none"
        stroke="rgb(255 255 255 / 0.16)"
        vectorEffect="non-scaling-stroke"
        // Thinner on a phone. The mark fills the measure at every width, so on
        // a 390px screen the same fifteen letters are a third of the height
        // they are on a desktop — and a hairline that reads as a hairline at
        // 150px tall reads as a heavy outline at 45px, closing the counters on
        // the a, e and g. Set in CSS rather than as an attribute so the
        // breakpoint lives with the rest of the styling.
        className="[stroke-width:0.6] sm:[stroke-width:0.8] lg:[stroke-width:1]"
        style={{
          fontFamily: "var(--font-archivo), system-ui, sans-serif",
          fontWeight: 900,
          fontSize: "104px",
        }}
      >
        {site.logotype}
      </text>
    </svg>
  );
}
