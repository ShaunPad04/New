"use client";

import { faqs } from "@/lib/content";
import { FaqTabs } from "@/components/faq-tabs";

/**
 * FAQ — premium accordion.
 *
 * Built on native <details>/<summary>. That is a deliberate choice over a
 * button + aria-expanded implementation: it is keyboard-operable and
 * screen-reader-correct without any ARIA to get wrong, and crucially it stays
 * expandable by the browser's own find-in-page. A visitor searching the page
 * for "own the site" finds the answer inside a collapsed row; with a custom
 * accordion that text is invisible to find-in-page.
 *
 * The craft sits on top of that foundation rather than replacing it:
 *
 *  - each row is a bezel card, not a hairline divider, so the section reads as
 *    a considered object instead of a list of rules
 *  - a pointer-tracked radial sheen follows the cursor across the card, which
 *    is what makes an otherwise static block feel expensive
 *  - the plus sits inside its own ring and rotates 45° into a cross, so the
 *    shape morphs rather than swapping glyph
 *  - a Geist Mono category tag and an index give each row a second, quieter
 *    line of typographic information
 *
 * Motion is CSS-only and driven by a custom property. There is no state, no
 * re-render on pointer move, and the whole thing is inert under
 * `prefers-reduced-motion` — the sheen simply never appears.
 */
/**
 * `compact` (the homepage, redesign 2026-09-11) shows the first five
 * questions and routes to /faq for the full set — the data order in
 * content.ts puts cost, timeline and ownership first, which are the ones a
 * prospect actually arrives with.
 */
export function Faq({
  compact = false,
  metas,
  heading = "Before you ask.",
  lede = "The things people ask before they commit. If yours is not here, ask us directly — you will get a straight answer.",
}: {
  compact?: boolean;
  /**
   * Show only questions whose `meta` is in this list (redesign, 2026-09-11)
   * — lets /pricing carry just the money questions. Applied before
   * `compact`'s slice.
   */
  metas?: string[];
  heading?: string;
  lede?: string;
}) {
  const pool = metas ? faqs.filter((f) => metas.includes(f.meta)) : faqs;
  const items = compact ? pool.slice(0, 5) : pool;
  /* Nocta framed accordion (2026-09-26) — same component as /faq, fixed
     to this page's questions, no tabs. Props and selection unchanged. */
  return (
    <FaqTabs
      items={items}
      heading={heading}
      lede={lede}
      more={items.length < faqs.length ? { text: "Every question is answered on the", href: "/faq", label: "full FAQ page" } : undefined}
    />
  );
}
