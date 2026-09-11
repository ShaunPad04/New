"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { faqs } from "@/lib/content";
import { Reveal } from "@/components/reveal";

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
export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/*
            The rail holds while the answers scroll past it.

            The client sent a reference for this section and the layout was
            already the one he liked — label, headline and standfirst in a left
            rail, cards on the right. The part that was missing is that the
            rail STAYS: at 1440 the six cards run about 900px, so by the third
            question the heading has left the screen and the reader is looking
            at an unlabelled stack. Sticky, the section keeps saying what it is
            for the whole time it is being read.

            `self-start` is required — a grid item stretches to the row height
            by default, and a stretched item cannot stick to anything. Only
            from `lg`, because below that the columns stack and there is
            nothing to hold beside.
          */}
          <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
            <p className="eyebrow mb-6">Questions</p>
            <h2
              id="faq-heading"
              className="display text-display-md text-ink-1000"
            >
              Before you ask.
            </h2>
            <p className="mt-8 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-700">
              The things people ask before they commit. If yours is not here,
              ask us directly — you will get a straight answer.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {/* Not a <dl>: a definition list may only directly contain dt/dd
                (or div) children, and <details> between them is invalid — axe
                flags it as `definition-list` + `dlitem`. Headings inside
                <summary> carry the same semantics without breaking the
                content model. */}
            <div className="flex flex-col gap-3">
              {faqs.map((item, i) => (
                <Reveal key={item.q} delay={i * 0.05} variant="slide">
                  <FaqRow item={item} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqRow({
  item,
  index,
}: {
  item: { q: string; a: string; meta?: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Write the pointer position onto the element as custom properties. Doing
   * this imperatively rather than through state is the point: a cursor move
   * fires continuously, and re-rendering React on every one of those would
   * cost far more than the effect is worth.
   */
  const track = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--fx", `${e.clientX - r.left}px`);
    el.style.setProperty("--fy", `${e.clientY - r.top}px`);
    el.style.setProperty("--fo", "1");
  };

  const clear = () => {
    ref.current?.style.setProperty("--fo", "0");
  };

  return (
    // Double bezel, per the house standard: an outer tray holding an inner
    // plate, with concentric radii. Flattening these into a single bordered
    // box is exactly what the standard forbids.
    <div
      ref={ref}
      onPointerMove={track}
      onPointerLeave={clear}
      className="bezel group relative"
    >
      <details
        name="faq"
        className="faq-row bezel-core relative overflow-hidden transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
      >
        {/* Pointer sheen. Purely decorative, sits under the content, and is
            suppressed entirely under reduced motion. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[var(--fo,0)] transition-opacity duration-500 motion-reduce:hidden"
          style={{
            background:
              "radial-gradient(280px circle at var(--fx,50%) var(--fy,50%), rgba(255,255,255,0.06), transparent 70%)",
          }}
        />

      <summary className="relative flex cursor-pointer list-none items-start gap-5 px-6 py-4 sm:gap-6 sm:px-8 sm:py-5 [&::-webkit-details-marker]:hidden">
        {/* Ring + morphing plus. Two strokes rotating, not a glyph swap. */}
        <span
          aria-hidden="true"
          className="mt-px flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-400/60 bg-white/[0.03] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-ink-500/70 group-open:border-ink-600"
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            className="text-ink-800 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-open:rotate-45 group-open:text-ink-1000"
          >
            <path
              d="M12 5.5v13M5.5 12h13"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <span className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          {/*
              `display-soft` — the Archivo display family in sentence case,
              which is what the client asked for when he called the previous
              setting unprofessional. It was Geist Regular at 17px: the body
              face at body weight, so a question read as another paragraph
              rather than as a heading someone chose.

              Weight is the class's own 700. It was briefly overridden to 500
              on the argument that five stacked questions at Archivo Bold
              would shout; the client looked at it and asked for bolder, so
              the override is gone rather than retuned.

              There is no 600 to split the difference with: `next/font` is
              asked for 500/700/800/900 in `layout.tsx` and nothing else, so a
              `font-semibold` here would not load a face — the browser would
              pick the nearest weight it has and the class would be a lie.
              Adding 600 to that list for one component is a font file's worth
              of payload on the page's critical path, which is a trade to make
              deliberately rather than to sneak in behind a utility class.
          */}
          {/*
              Sized up at the client's request (2026-09-11): 17/18px was too
              small to read as premium. A question is the heading of the row,
              and at 17px in a card with 40px of ring beside it, it was the
              smallest confident thing on the page — the plus icon carried
              more weight than the words.

              It is now 20px rising to 24px, which puts it above body copy at
              every breakpoint and roughly a third larger than the answer it
              introduces, so the hierarchy inside the card is unambiguous
              rather than implied by weight alone.
          */}
          <h3 className="display-soft text-[1.25rem] leading-snug text-ink-1000 transition-colors duration-500 sm:text-[1.375rem] lg:text-[1.5rem]">
            {item.q}
          </h3>
          {item.meta ? (
            <span className="field-label shrink-0 text-ink-600 sm:ml-auto">
              {item.meta}
            </span>
          ) : null}
        </span>

        <span
          aria-hidden="true"
          className="field-label mt-1 hidden shrink-0 text-ink-500 lg:block"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </summary>

        {/* `faq-answer` carries the fade — see globals.css. It is a CSS rule
            keyed on `details[open]`, not a Tailwind variant, because `group`
            sits on the outer bezel while `open` lands on the <details>, so
            `group-open:` cannot reach this element. Keying on the attribute
            also means the animation restarts every time the row is reopened,
            which matters here: `name="faq"` makes this an exclusive
            accordion, so rows open and close repeatedly. */}
        <div className="faq-answer relative px-6 pb-7 pl-[4rem] sm:px-8 sm:pb-8 sm:pl-[4.5rem]">
          {/* Raised with the question, but by less — the gap between them is
              what makes the question read as a heading. Measure tightened to
              56ch because the longer line height at this size pushes a 58ch
              paragraph past comfortable. */}
          <p className="max-w-[56ch] text-[1rem] leading-[1.65] text-ink-700 sm:text-[1.0625rem]">
            {item.a}
          </p>
        </div>
      </details>
    </div>
  );
}
