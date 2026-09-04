"use client";

import { useState } from "react";
import {
  PLACEHOLDER_TESTIMONIALS,
  SHOW_TESTIMONIALS,
  TESTIMONIALS_VERIFIED,
  type Testimonial,
} from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * TESTIMONIALS — continuously scrolling columns.
 *
 * Adapted from a scrolling-column reference rather than copied. The reference
 * carried several things this site cannot take:
 *
 *  - a `neutral-*` palette and a light/dark toggle. The site is monochrome
 *    `ink-*` and dark-only, so both are dropped.
 *  - stock photographs of real people attached to each quote. Pairing a real
 *    face with an invented quote about this business is exactly what the CMA
 *    and ASA prosecute, so attribution is a typographic monogram instead.
 *  - Framer Motion driving three infinite loops on the main thread. The
 *    marquee is a CSS transform animation here, which the compositor owns —
 *    no JS runs per frame, and it costs nothing in Total Blocking Time.
 *  - no way to stop the movement. Content that animates automatically for
 *    more than five seconds needs a pause control under WCAG 2.2.2, so there
 *    is a real button, plus pause on hover and on keyboard focus.
 *
 * Column count adapts to how many quotes exist rather than being fixed at
 * three: a third column only appears once there are nine quotes to fill it,
 * because three columns dealt from four quotes would repeat inside a single
 * screen and read as padding. With the four samples in place the belt does
 * still loop visibly — that is a content problem, not a design one, and it
 * resolves itself the moment real quotes land.
 *
 * Renders nothing while `TESTIMONIALS_VERIFIED` is false unless the build is
 * a non-indexable preview — see the content-integrity note in lib/content.ts.
 */

/** Deal out round-robin so neighbouring columns never show the same quote. */
function toColumns(items: Testimonial[], count: number): Testimonial[][] {
  const columns: Testimonial[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => columns[i % count].push(item));
  return columns;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Testimonials() {
  const [paused, setPaused] = useState(false);

  const items: Testimonial[] = SHOW_TESTIMONIALS ? PLACEHOLDER_TESTIMONIALS : [];
  if (items.length === 0) return null;

  const columnCount = items.length >= 9 ? 3 : items.length >= 4 ? 2 : 1;
  const columns = toColumns(items, columnCount);

  // Staggered speeds stop the columns locking into step with one another.
  const durations = ["46s", "58s", "52s"];

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-6">In their words</p>
            <h2
              id="testimonials-heading"
              className="display text-display-md max-w-[16ch] text-ink-1000"
            >
              What it is like to work with us
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            className="group inline-flex min-h-[3rem] shrink-0 items-center gap-3 self-start rounded-full border border-white/15 bg-white/[0.03] py-2 pl-6 pr-2 text-sm tracking-tight text-ink-1000 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/30 lg:self-auto"
          >
            {paused ? "Resume scrolling" : "Pause scrolling"}
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
            >
              <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
                {paused ? (
                  <path d="M4 2.5 13 8l-9 5.5z" />
                ) : (
                  <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" />
                )}
              </svg>
            </span>
          </button>
        </div>

        {/* Unmistakable while the quotes are samples. Disappears the moment
            TESTIMONIALS_VERIFIED flips to true, and `pnpm verify` refuses to
            let an indexable build ship with this banner still rendering. */}
        {!TESTIMONIALS_VERIFIED ? (
          <p
            role="note"
            className="mt-8 inline-block border border-dashed border-ink-500 px-4 py-2.5 text-xs tracking-tight text-ink-800"
          >
            Sample content for design review — these are not real client
            quotes and must be replaced before launch.
          </p>
        ) : null}

        {/*
          The moving columns are decorative duplication: every quote is
          rendered twice so the loop can be seamless, which would make a
          screen reader read the section twice over. The animated region is
          therefore hidden from assistive technology and the same quotes are
          exposed once, in order, in the list below it.
        */}
        <div
          aria-hidden="true"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mt-16 grid max-h-[620px] gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_9%,black_91%,transparent)] sm:grid-cols-1 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
          style={{ ["--cols" as string]: String(columnCount) }}
        >
          {columns.map((column, c) => {
            // A short column would leave a gap at the bottom of the mask
            // before the loop comes round, so it is padded out until one pass
            // is comfortably taller than the visible window.
            const pass = column.length >= 3 ? column : [...column, ...column];
            return (
            <div key={c} className={cn(c > 0 && "hidden md:block")}>
              <div
                className="marquee-track-y flex flex-col gap-6"
                style={{
                  ["--marquee-duration" as string]: durations[c] ?? "50s",
                  animationPlayState: paused ? "paused" : "running",
                }}
              >
                {[0, 1].map((copy) =>
                  pass.map((t, i) => (
                    <QuoteCard key={`${copy}-${i}-${t.id}`} testimonial={t} />
                  )),
                )}
              </div>
            </div>
            );
          })}
        </div>

        <ul className="sr-only">
          {items.map((t) => (
            <li key={t.id}>
              <figure>
                <blockquote>
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption>
                  {t.name}, {t.role}, {t.company}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * One quote, as a double-bezel object: an outer tray holding an inner plate
 * with concentric radii, per the house standard. Nothing sits flat.
 */
function QuoteCard({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <div className="bezel">
      <figure className="bezel-core p-8 lg:p-10">
        <span
          aria-hidden="true"
          className="display block text-3xl leading-none text-ink-500"
        >
          &ldquo;
        </span>

        <blockquote className="mt-5">
          <p className="display-soft text-lg leading-snug text-ink-1000 lg:text-xl">
            {t.quote}
          </p>
        </blockquote>

        <figcaption className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
          {/* Typographic monogram rather than a photograph. There are no real
              client portraits, and inventing one would be a fabricated claim
              about a person. */}
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] font-mono text-[0.6875rem] tracking-[0.12em] text-ink-800"
          >
            {initials(t.name)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium tracking-tight text-ink-1000">
              {t.name}
            </span>
            <span className="field-label mt-1.5 truncate">
              {t.role} — {t.company}
            </span>
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
