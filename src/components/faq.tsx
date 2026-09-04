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
          <div className="lg:col-span-4">
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
                <Reveal key={item.q} delay={i * 0.05}>
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
        className="bezel-core relative overflow-hidden transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
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

      <summary className="relative flex cursor-pointer list-none items-start gap-5 px-6 py-6 sm:gap-6 sm:px-8 sm:py-7 [&::-webkit-details-marker]:hidden">
        {/* Ring + morphing plus. Two strokes rotating, not a glyph swap. */}
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink-400/60 bg-white/[0.03] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-ink-500/70 group-open:border-ink-600"
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
          <h3 className="text-[1.0625rem] font-normal leading-snug tracking-tight text-ink-1000 transition-colors duration-500 sm:text-lg">
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

        <div className="relative px-6 pb-7 pl-[4.25rem] sm:px-8 sm:pb-8 sm:pl-[4.75rem]">
          <p className="max-w-[58ch] leading-relaxed text-ink-700">{item.a}</p>
        </div>
      </details>
    </div>
  );
}
