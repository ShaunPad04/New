"use client";

import { useState } from "react";
import {
  PLACEHOLDER_TESTIMONIALS,
  SHOW_TESTIMONIALS,
  type Testimonial,
} from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * TESTIMONIALS — a tilted 3D wall of quote cards.
 *
 * Adapted from a perspective-marquee reference rather than copied. What was
 * taken is the idea: columns travelling in alternating directions behind a
 * perspective transform, so the wall reads as an object in space instead of a
 * list. What was not taken:
 *
 *  - a stock photograph of a real person on every card. The quotes here are
 *    invented samples; putting a real face on an invented claim about this
 *    business is what the CMA and ASA prosecute. Attribution is a typographic
 *    monogram, as agreed.
 *  - `role="marquee"`, which is not a real ARIA role, and `tabIndex={0}` on a
 *    decorative container, which puts a focus stop on nothing.
 *  - shadcn `Card` and `Avatar` with `@radix-ui/react-avatar`. None of it is
 *    installed and none of it is needed; the cards are the house double bezel.
 *
 * Motion is the site's existing CSS transform marquee — the compositor owns
 * it, nothing runs per frame. Content that animates automatically for more
 * than five seconds needs a pause control under WCAG 2.2.2, so there is a real
 * button as well as pause on hover and on keyboard focus.
 *
 * The wall is decorative duplication: every quote appears several times so the
 * columns can loop. It is therefore hidden from assistive technology, and the
 * quotes are exposed once, in order, in the list beside it.
 */

/** Column travel times. Different per column so they never lock into step. */
const COLUMN_DURATIONS = ["52s", "64s", "58s"];

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

  // Always three columns from `lg`. Dealing four quotes into two leaves the
  // wall reading as a gap rather than a wall; the repetition inside a column
  // is far less noticeable than a half-empty stage.
  const columns = toColumns(items, 3);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
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
            {paused ? "Resume" : "Pause"}
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

        {/*
          The wall. `perspective` sits on the outer element and the rotation on
          the inner one — a transform and its perspective cannot live on the
          same element or the depth is ignored.

          The tilt only applies from `lg`. On a phone a rotated wall throws most
          of the cards off-screen and leaves the rest unreadable, so narrow
          viewports get the same columns square-on.
        */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-hidden="true"
          className="relative mt-14 h-[26rem] overflow-hidden [perspective:1400px] lg:mt-20 lg:h-[34rem]"
        >
          {/*
            The wall is deliberately wider than its container and pulled left,
            because a rotated plane no longer covers the box that contains it —
            without the overhang the tilt exposes an empty corner.
          */}
          <div className="flex h-full w-full justify-center gap-5 lg:ml-[-10%] lg:w-[120%] lg:[transform:translateZ(-90px)_rotateX(10deg)_rotateY(-13deg)_rotateZ(8deg)]">
            {columns.map((column, c) => (
              <div
                key={c}
                className={cn(
                  // Full width on a phone, where there is only one column and
                  // no tilt to leave room for.
                  "w-full shrink-0 sm:w-72",
                  c > 0 && "hidden sm:block",
                  c > 1 && "hidden lg:block",
                )}
              >
                <div
                  className="marquee-track-y flex flex-col gap-5"
                  style={{
                    ["--marquee-duration" as string]: COLUMN_DURATIONS[c] ?? "56s",
                    animationPlayState: paused ? "paused" : "running",
                    animationDirection: c % 2 === 1 ? "reverse" : "normal",
                  }}
                >
                  {/* Rendered twice so the -50% travel loops seamlessly, and
                      each pass padded out so a short column never leaves a gap
                      before the loop comes round. */}
                  {[0, 1].map((copy) =>
                    [0, 1, 2].flatMap((pass) =>
                      column.map((t) => (
                        <QuoteCard key={`${copy}-${pass}-${t.id}`} testimonial={t} />
                      )),
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Fades on every edge, so cards enter and leave the wall rather than
              being sliced off by the container. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink-0 to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink-0 to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-ink-0 to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-ink-0 to-transparent" />
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

/** One quote, as a double-bezel object per the house standard. */
function QuoteCard({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <div className="bezel">
      <figure className="bezel-core p-6">
        <blockquote>
          <p className="text-[0.9375rem] leading-relaxed text-ink-800">
            {t.quote}
          </p>
        </blockquote>

        <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
          {/* Typographic monogram, not a photograph. There are no client
              portraits, and inventing one would fabricate a person. */}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] font-mono text-[0.625rem] tracking-[0.1em] text-ink-800">
            {initials(t.name)}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium tracking-tight text-ink-1000">
              {t.name}
            </span>
            {/* Wraps rather than truncating: at this card width the mono role
                line was being cut to "SAMPLE CLIE…", which reads as a bug. */}
            <span className="field-label mt-1 leading-relaxed">
              {t.role} — {t.company}
            </span>
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
