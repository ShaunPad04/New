"use client";

import { useCallback, useRef, useState } from "react";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { AuroraField } from "@/components/aurora-field";

/**
 * LET'S WORK TOGETHER — the closing invitation, directly above the form.
 *
 * Adapted from a supplied reference rather than pasted. What was kept is the
 * whole choreography: the availability pill, the two-line headline whose lines
 * lift on hover, the hairlines that stretch out from either side, the circular
 * arrow that fills and then expands off the page, and the second state that
 * fades up in its place.
 *
 * What was changed, and why:
 *
 *  - The reference is a shadcn component: `text-muted-foreground`, `bg-border`,
 *    `var(--border)`. None of those tokens exist here — this project has its
 *    own `ink-0`..`ink-1000` scale — so every colour is mapped onto it.
 *  - The status dot was `bg-emerald-400/500`. The palette is monochrome by
 *    decision; the dot is white.
 *  - `lucide-react` is not a dependency and is not worth becoming one for two
 *    glyphs. The arrow is the same "↗" the rest of the site's CTAs use, and
 *    the calendar is nine lines of inline SVG.
 *  - The reference's button opened `cal.com/jatin-yadav05/15min` — somebody
 *    else's booking page — and printed `hello@example.com`. Both now come from
 *    `site`, and the call goes to our own enquiry form.
 *  - The trigger was a `<div onClick>` wrapping an `<h2>`. That is not
 *    keyboard-operable and is not announced as a control, and an `<h2>` is not
 *    valid inside a `<button>` either. It is now a `<button>` INSIDE the `<h2>`,
 *    which is both valid and operable.
 *  - Only one layer is live at a time. The faded one is `inert`, so it is out
 *    of the tab order and out of the accessibility tree — without that, half
 *    this section is an invisible tab stop. Focus moves to "Book a call" on
 *    reveal, so the keyboard lands where the eye does.
 *  - `min-h-screen` became ordinary section padding. A full viewport is a lot
 *    to spend on a band whose own form is one screen further down.
 */

const EASE = "cubic-bezier(0.16,1,0.3,1)";

export function LetsWork() {
  const [revealed, setRevealed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const bookRef = useRef<HTMLAnchorElement | null>(null);

  const reveal = useCallback(() => {
    setRevealed(true);
    // After the cross-fade, so focus does not land on something still at zero
    // opacity. Matches the 500ms the second layer takes to arrive.
    window.setTimeout(() => bookRef.current?.focus(), 520);
  }, []);

  const lift = hovered && !revealed;

  return (
    <section
      // Labelled here rather than by the headline: the headline is one of two
      // layers and is inert half the time, so it cannot be the stable name.
      aria-label="Work with us"
      className="relative overflow-hidden border-t border-ink-300"
    >
      {/* Slow monochrome light behind the invitation. This section sits still
          — nothing here is pinned or scrubbed — which is the whole reason it
          is one of the two that carry it. */}
      <AuroraField />
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col items-center px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        {/* ---------- Layer one: the invitation ---------- */}
        <div
          inert={revealed}
          className={cn(
            "flex flex-col items-center transition-all duration-700",
            revealed && "-translate-y-6 opacity-0",
          )}
          style={{ transitionTimingFunction: EASE }}
        >
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink-1000 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ink-1000" />
            </span>
            <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.2em] text-ink-700">
              Available for projects
            </span>
          </p>

          <h2 className="relative mt-12 text-center">
            <button
              type="button"
              onClick={reveal}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="group relative flex cursor-pointer flex-col items-center gap-6 rounded-3xl px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ink-1000"
            >
              {/* Each line rides in its own clipped box, so the lift reads as
                  the type sliding behind a mask rather than simply moving. */}
              <span className="flex flex-col">
                <span className="block overflow-hidden">
                  <span
                    className="display block text-display-lg text-ink-1000 transition-transform duration-700"
                    style={{
                      transitionTimingFunction: EASE,
                      transform: lift ? "translateY(-7%)" : "translateY(0)",
                    }}
                  >
                    Let&rsquo;s work
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span
                    className="display block text-display-lg text-ink-600 transition-transform delay-75 duration-700"
                    style={{
                      transitionTimingFunction: EASE,
                      transform: lift ? "translateY(-7%)" : "translateY(0)",
                    }}
                  >
                    together
                  </span>
                </span>
              </span>

              {/* The arrow, in its own circle — the house button-in-button
                  motif at display scale. On click the ring expands past the
                  headline and the arrow leaves the frame. */}
              <span className="relative mt-2 flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full border transition-all ease-out"
                  style={{
                    borderColor: lift
                      ? "var(--color-ink-1000)"
                      : "rgb(255 255 255 / 0.18)",
                    backgroundColor: revealed
                      ? "transparent"
                      : lift
                        ? "var(--color-ink-1000)"
                        : "transparent",
                    transform: revealed
                      ? "scale(3)"
                      : lift
                        ? "scale(1.1)"
                        : "scale(1)",
                    opacity: revealed ? 0 : 1,
                    transitionDuration: revealed ? "700ms" : "500ms",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="relative text-2xl transition-all sm:text-3xl"
                  style={{
                    transitionTimingFunction: EASE,
                    transform: revealed
                      ? "translate(120px, -120px) scale(0.5)"
                      : lift
                        ? "translate(3px, -3px)"
                        : "translate(0, 0)",
                    opacity: revealed ? 0 : 1,
                    color: lift
                      ? "var(--color-ink-0)"
                      : "var(--color-ink-1000)",
                    transitionDuration: revealed ? "600ms" : "500ms",
                  }}
                >
                  ↗
                </span>
              </span>
            </button>

            {/* Hairlines flanking the headline. Decorative, hidden from AT,
                and only drawn where there is room for them. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-1/2 hidden h-px w-12 -translate-x-[calc(100%+2rem)] -translate-y-1/2 bg-ink-500 transition-all duration-500 lg:block"
              style={{
                transform: lift ? "scaleX(1.6)" : "scaleX(1)",
                opacity: revealed ? 0 : lift ? 1 : 0.5,
              }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-12 translate-x-[calc(100%+2rem)] -translate-y-1/2 bg-ink-500 transition-all duration-500 lg:block"
              style={{
                transform: lift ? "scaleX(1.6)" : "scaleX(1)",
                opacity: revealed ? 0 : lift ? 1 : 0.5,
              }}
            />
          </h2>

          <p className="mt-12 max-w-[46ch] text-center text-[0.9375rem] leading-relaxed text-ink-700">
            Tell us what you are building. We reply within one working day, and
            we will say honestly if we are not the right studio for it.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-5 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink-600 underline-offset-4 transition-colors duration-500 hover:text-ink-1000 hover:underline"
          >
            {site.email}
          </a>
        </div>

        {/* ---------- Layer two: the next step ---------- */}
        <div
          inert={!revealed}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-6 transition-all duration-700"
          style={{
            transitionTimingFunction: EASE,
            opacity: revealed ? 1 : 0,
            transform: revealed
              ? "translateY(0) scale(1)"
              : "translateY(20px) scale(0.97)",
          }}
        >
          <p className="field-label">Next step</p>
          <p className="display text-display-md text-center text-ink-1000">
            Let&rsquo;s talk
          </p>

          {/* Goes to our own enquiry form. The reference pointed at a stranger's
              booking page, which is the one thing in it that could not ship. */}
          <a
            ref={bookRef}
            href="#contact"
            className="group inline-flex min-h-[3.25rem] items-center gap-3 rounded-full border border-white/25 bg-transparent py-2 pl-7 pr-7 text-sm font-medium tracking-tight text-ink-1000 transition-colors duration-500 hover:border-transparent hover:bg-ink-1000 hover:text-ink-0"
            style={{ transitionTimingFunction: EASE }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <rect x="3" y="5" width="18" height="16" rx="2.5" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            Book a call
            <span
              aria-hidden="true"
              className="text-base transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-[1px]"
              style={{ transitionTimingFunction: EASE }}
            >
              ↗
            </span>
          </a>

          <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink-600">
            One working day, every time
          </p>
        </div>
      </div>
    </section>
  );
}
