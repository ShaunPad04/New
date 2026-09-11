"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PLACEHOLDER_TESTIMONIALS,
  SHOW_TESTIMONIALS,
  type Testimonial,
} from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * TESTIMONIALS — two dark plates, one quote at a time, click to advance.
 *
 * Rebuilt 2026-09-11 from a reference the client sent, and it OVERRIDES a
 * recorded decision, so the reasoning it replaces is worth stating rather than
 * quietly deleting. The previous treatment was black-on-white: the only
 * inverted plate on the page, chosen because a monochrome palette has no
 * accent colour to reach for and inversion was the strongest contrast move
 * available. The client prefers the reference's dark-on-dark, and it is a
 * defensible trade — the section now belongs to the page instead of
 * interrupting it, and emphasis moves from the plate to the sentence, which
 * the highlight does more precisely than a white rectangle ever did.
 *
 * WHAT WAS NOT TAKEN FROM THE REFERENCE, and why:
 *
 * - "Trusted by 20+ companies." Black Line has ONE signed client. That is an
 *   objective, checkable claim about the business, not puffery, and
 *   publishing it is a misleading commercial practice under the CPUTR 2008 /
 *   DMCCA 2024 — the same rule that keeps these very quotes behind
 *   TESTIMONIALS_VERIFIED. The left plate says what is true instead. When
 *   real clients exist, that line becomes a real count.
 * - The photographic avatars. These quotes are invented samples; a face on an
 *   invented claim invents a person. The monogram stays.
 * - The client logos (Kiwe, DRIFTR in the reference). There are none to show,
 *   and the strip above this section already documents why borrowed marks
 *   under a trust claim are a false-association problem. The slot carries the
 *   quote's topic instead, which is our own label and asserts nothing.
 *
 * ACCESSIBILITY. Still the WAI-ARIA tabs pattern — the dots are the tablist,
 * with roving tabindex, arrow keys and Home/End. The card is the panel.
 *
 * Click-to-advance is a real <button> laid over the card rather than an
 * onClick on the card itself: it is keyboard-operable, it is announced, and it
 * works on touch, where the reference's hover affordance does not exist. It
 * sits above the text, so the quote can no longer be selected with the mouse —
 * that is the cost of making the whole plate a control, and it is the
 * behaviour the reference has.
 *
 * The dots deliberately live OUTSIDE that button in the DOM and are layered
 * over it. A button inside a button is invalid HTML and the inner one stops
 * being reachable.
 */

/**
 * Dwell time per quote, shortened from 9s at the client's request.
 *
 * Do not push this below about 5s: WCAG 2.2.2 is satisfied by the pause
 * control at any speed, but a panel that changes before the slowest reader
 * reaches the attribution line stops being readable content and starts being
 * an animation.
 */
const ADVANCE_MS = 6500;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Renders the quote with its highlighted clause in white against the grey.
 *
 * Splits on the literal string rather than using an index or a regex: a regex
 * would need every quote escaped, and an index would silently drift the moment
 * anyone edits the copy. If the phrase is not found — a typo, or copy edited
 * without updating `highlight` — this returns the quote whole. The failure
 * mode is a quote with no emphasis, never a quote with a hole in it.
 */
function Quote({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, ...rest] = text.split(highlight);
  return (
    <>
      {before}
      <span className="text-ink-1000">{highlight}</span>
      {rest.join(highlight)}
    </>
  );
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
  const plate =
    "rounded-[1.75rem] border border-white/[0.07] bg-ink-200 shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset]";

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
              What it is like
              {/* The second line drops to grey, as in the reference the client
                  sent — the same two-tone headline the capability band uses,
                  done with the palette rather than with a colour. */}
              <span className="block text-ink-600">to work with us</span>
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

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-6">
          {/* ---- Left plate: the standing statement. ---- */}
          <div
            className={cn(
              plate,
              "relative flex flex-col justify-between overflow-hidden p-8 sm:p-9",
            )}
          >
            <span
              aria-hidden="true"
              className="display select-none text-[5.5rem] leading-[0.62] text-ink-1000/[0.09]"
            >
              &rdquo;
            </span>

            <div className="mt-14 lg:mt-24">
              {/* NOT "Trusted by 20+ companies" — see the note at the top of
                  this file. This says what is true today and still gives the
                  plate something to hold. */}
              <p className="text-[1.3125rem] font-medium leading-tight tracking-tight text-ink-1000">
                Founder-led, start to finish.
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-700">
                Click a quote to read the next one.
              </p>
            </div>
          </div>

          {/* ---- Right plate: the quote itself. ---- */}
          <div className="relative">
            <div
              key={active}
              id={`testimonial-panel-${active}`}
              role="tabpanel"
              aria-labelledby={`testimonial-tab-${active}`}
              className={cn(
                plate,
                "group/card relative flex min-h-[20rem] flex-col justify-between overflow-hidden p-8 animate-[rise_600ms_cubic-bezier(0.32,0.72,0,1)_both] sm:min-h-[23rem] sm:p-10 lg:min-h-[25rem] lg:p-12",
              )}
            >
              <blockquote className="relative mt-9 max-w-[46ch] sm:mt-10">
                <p className="text-[1.125rem] leading-[1.55] tracking-tight text-ink-700 sm:text-[1.375rem] lg:text-[1.5rem]">
                  <Quote text={current.quote} highlight={current.highlight} />
                </p>
              </blockquote>

              <figcaption className="relative mt-10 flex items-end justify-between gap-6">
                <span className="flex min-w-0 items-center gap-3.5">
                  {/* Typographic monogram, not a photograph — there are no
                      client portraits, and inventing one invents a person. */}
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] font-mono text-[0.6875rem] tracking-[0.1em] text-ink-700">
                    {initials(current.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.9375rem] font-medium tracking-tight text-ink-1000">
                      {current.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.8125rem] text-ink-700">
                      {current.company}, {current.role}
                    </span>
                  </span>
                </span>

                {/* The reference puts a client logo here. There are none, so
                    the slot carries our own label for the quote instead. */}
                <span className="hidden shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-600 sm:block">
                  {current.topic}
                </span>
              </figcaption>

              {/* Click-to-advance. A real button over the plate, so it is
                  keyboard-operable and works on touch, where the reference's
                  hover-only affordance does not exist. */}
              <button
                type="button"
                onClick={() => setActive((i) => (i + 1) % count)}
                className="absolute inset-0 z-10 cursor-pointer rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white/70"
              >
                <span className="sr-only">Next testimonial</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-ink-300/90 px-4 py-2 text-[0.8125rem] font-medium tracking-tight text-ink-1000 opacity-0 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/card:opacity-100 group-focus-within/card:opacity-100"
                >
                  Next
                </span>
              </button>
            </div>

            {/* ---- The dots: the tablist, layered over the plate. ----
                Outside the click-to-advance button in the DOM on purpose: a
                button inside a button is invalid and the inner one stops being
                reachable. */}
            <div
              role="tablist"
              aria-label="Choose a testimonial"
              onKeyDown={onKeyDown}
              className="absolute left-8 top-8 z-20 flex items-center gap-2 sm:left-10 sm:top-10 lg:left-12 lg:top-12"
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
                    // Roving tabindex: the list is one tab stop, arrow keys
                    // move within it.
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActive(i)}
                    // A 6px mark inside a 44px target. The hit area is padding,
                    // not the visible dot, so the control clears the minimum
                    // touch size without drawing a 44px circle.
                    className="group/dot -m-3 flex h-11 w-11 items-center justify-center p-3"
                  >
                    <span className="sr-only">{t.topic}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative block h-1.5 overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isActive
                          ? "w-6 bg-white/20"
                          : "w-1.5 bg-white/25 group-hover/dot:bg-white/50",
                      )}
                    >
                      {/* The dwell timer, drawn as the active dot filling.
                          Its duration comes from ADVANCE_MS rather than a
                          class string, so the bar and the timeout cannot drift
                          apart the way they did when both were written out. */}
                      {isActive && (
                        <span
                          className={cn(
                            "absolute inset-0 block origin-left rounded-full bg-ink-1000",
                            running ? "" : "scale-x-100",
                          )}
                          style={
                            running
                              ? { animation: `tick ${ADVANCE_MS}ms linear forwards` }
                              : undefined
                          }
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
