"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PLACEHOLDER_TESTIMONIALS,
  SHOW_TESTIMONIALS,
  type Testimonial,
} from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * TESTIMONIALS — one quote at a time, large, on a white plate.
 *
 * This replaced a tilted 3D wall of quote cards (2026-09-06). The wall was
 * handsome as an object and useless as social proof: every card was ~15px
 * grey on black, half of them were sliced by the edge fades, the whole thing
 * moved, and because it was decorative duplication it had to be `aria-hidden`
 * with the real quotes buried in an `sr-only` list. Nobody could read a word
 * of it. On a site whose job is to convert, an unreadable testimonial section
 * is a section that does nothing.
 *
 * So the quote is now the largest text in the section, black on white — the
 * one place on this page that inverts, which is what makes it land in a
 * monochrome palette where there is no accent colour to reach for. The other
 * quotes sit beside it as a labelled selector, which doubles as the reason a
 * visitor stays: four different things we are being praised for, visible at a
 * glance, rather than four identical grey rectangles.
 *
 * Attribution is a typographic monogram, never a photograph. The quotes here
 * are invented samples; putting a face on an invented claim about this
 * business is what the CMA and ASA prosecute.
 *
 * Accessibility: this is the WAI-ARIA tabs pattern — roving tabindex, arrow
 * keys, Home/End, one panel in the DOM at a time. The panel advances itself
 * every 9s, so there is a real pause control (WCAG 2.2.2) as well as pause on
 * hover and on focus, and the rotation never starts at all under
 * `prefers-reduced-motion`.
 */

/** Dwell time per quote. Long enough to read ~45 words without hurrying. */
const ADVANCE_MS = 9000;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Testimonials() {
  const items: Testimonial[] = SHOW_TESTIMONIALS ? PLACEHOLDER_TESTIMONIALS : [];
  const count = items.length;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Keyed on `active`, so choosing a quote by hand restarts the clock rather
  // than inheriting whatever was left of the previous one.
  useEffect(() => {
    if (paused || reduced || count < 2) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % count),
      ADVANCE_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, paused, reduced, count]);

  const select = useCallback((i: number) => {
    setActive(i);
    tabs.current[i]?.focus();
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (count < 2) return;
      const next = {
        ArrowDown: (active + 1) % count,
        ArrowRight: (active + 1) % count,
        ArrowUp: (active - 1 + count) % count,
        ArrowLeft: (active - 1 + count) % count,
        Home: 0,
        End: count - 1,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next);
    },
    [active, count, select],
  );

  if (count === 0) return null;

  const current = items[active];
  const running = !paused && !reduced && count > 1;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-24 border-t border-ink-300"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
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

          {/* Only meaningful while something is rotating: under reduced motion
              nothing advances, so a pause button would control nothing. */}
          {!reduced && count > 1 && (
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
          )}
        </div>

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-8">
          {/* ---- The quote, inverted. ---- */}
          <div className="bezel">
            <div
              // `key` remounts on change, which is what replays the entrance —
              // a persistent node would animate once, on mount, and never again.
              key={active}
              id={`testimonial-panel-${active}`}
              role="tabpanel"
              aria-labelledby={`testimonial-tab-${active}`}
              tabIndex={0}
              className="bezel-core-invert relative flex flex-col justify-between overflow-hidden p-8 animate-[rise_700ms_cubic-bezier(0.32,0.72,0,1)_both] sm:min-h-[22rem] sm:p-12 lg:min-h-[26rem] lg:p-14"
            >
              <span
                aria-hidden="true"
                className="display pointer-events-none absolute right-6 top-2 select-none text-[9rem] leading-[0.72] text-ink-0/[0.12] sm:right-10 sm:text-[13rem] lg:text-[15rem]"
              >
                &rdquo;
              </span>

              <blockquote className="relative">
                <p className="display-soft max-w-[30ch] text-[clamp(1.375rem,2.6vw,2.125rem)] text-ink-0">
                  {current.quote}
                </p>
              </blockquote>

              <figcaption className="relative mt-10 flex items-center gap-4 border-t border-ink-0/10 pt-6">
                {/* Typographic monogram, not a photograph — there are no
                    client portraits, and inventing one invents a person. */}
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink-0/15 bg-ink-0/[0.05] font-mono text-[0.6875rem] tracking-[0.1em] text-ink-0/70">
                  {initials(current.name)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-medium tracking-tight text-ink-0">
                    {current.name}
                  </span>
                  {/* `.field-label` sets ink-700, which is a light grey and
                      fails contrast on a white plate — hence the override. */}
                  <span className="field-label mt-1 leading-relaxed !text-ink-0/70">
                    {current.role} — {current.company}
                  </span>
                </span>
              </figcaption>
            </div>
          </div>

          {/* ---- The other quotes, as a labelled selector. ---- */}
          <div
            role="tablist"
            aria-label="Choose a testimonial"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="flex flex-col gap-3"
          >
            {items.map((t, i) => {
              const isActive = i === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`testimonial-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls={`testimonial-panel-${i}`}
                  // Roving tabindex: the list is one tab stop, arrow keys move
                  // within it. Tabbing past four buttons to reach the next
                  // section is what the pattern exists to prevent.
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group relative flex flex-col justify-center overflow-hidden rounded-2xl border px-5 py-4 text-left transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:flex-1",
                    isActive
                      ? "border-white/25 bg-white/[0.06]"
                      : "border-white/[0.08] bg-white/[0.015] hover:border-white/20 hover:bg-white/[0.04]",
                  )}
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "font-mono text-[0.625rem] tracking-[0.2em] transition-colors duration-500",
                        isActive ? "text-ink-800" : "text-ink-600",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-[0.9375rem] font-medium tracking-tight transition-colors duration-500",
                        isActive ? "text-ink-1000" : "text-ink-800",
                      )}
                    >
                      {t.topic}
                    </span>
                  </span>
                  <span className="mt-1.5 block pl-[2.375rem] text-[0.8125rem] leading-relaxed text-ink-600">
                    {t.role} — {t.company}
                  </span>

                  {/* The dwell timer, drawn as a hairline. It is the only
                      indication that the panel is about to move on, and it
                      pauses with everything else. */}
                  {isActive && running && (
                    <span
                      key={active}
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink-1000/40 animate-[tick_9000ms_linear_forwards]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
