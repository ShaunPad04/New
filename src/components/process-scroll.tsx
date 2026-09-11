"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { processSteps } from "@/lib/content";

/**
 * PROCESS — PINNED HORIZONTAL SCROLL (/services, redesign 2026-09-11)
 *
 * The client asked for the process to be a ride rather than a row: reach
 * the section, the page pins, scrolling carries you sideways through all
 * six steps, then releases you downward. Modelled on the premium-Framer
 * pattern the house standard points at.
 *
 * It lives on /services only. The homepage deliberately keeps its one
 * scroll-jack (the hero); /studio keeps the draggable track. Here the page
 * has no other pin, so the section can own the scroll without fighting one.
 *
 * PROGRESSIVE ENHANCEMENT, deliberately: the server renders a static grid
 * that works everywhere — no JavaScript, reduced motion, small screens.
 * The effect upgrades it to the pinned track only on a wide viewport with
 * motion allowed, by adding `.process-track-h` (plain unlayered CSS in
 * globals.css, so it wins over the Tailwind grid) BEFORE ScrollTrigger
 * measures. Everything scrubbed is transform/opacity/filter:
 *
 *  - the track translates by exactly its overflow, so step six lands flush
 *  - each card's image scales 1.14→1 and unblurs as the card crosses the
 *    viewport centre — the "pop" — computed from cached offsets, no layout
 *    reads inside the scrub loop
 *  - a hairline progress rail fills and a counter ticks 01→06 (textContent
 *    writes only)
 *
 * GSAP + ScrollTrigger are dynamically imported on demand, the same pattern
 * as the hero; `gsap.context` owns the cleanup.
 */
export function ProcessScroll({
  images,
}: {
  /** step id → resolved public path, or null when no file exists yet. */
  images: Record<string, string | null>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let disposed = false;
    let ctx: { revert: () => void } | undefined;
    let cleanupRo: (() => void) | undefined;
    let settle: ReturnType<typeof setTimeout>;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      // Switch to the horizontal layout BEFORE anything measures.
      track.classList.add("process-track-h");

      const cards = Array.from(
        track.querySelectorAll<HTMLElement>("[data-process-card]"),
      );
      const media = Array.from(
        track.querySelectorAll<HTMLElement>("[data-process-media]"),
      );

      const overflow = () =>
        Math.max(0, track.scrollWidth - section.clientWidth);

      // Card centres relative to the track — static while pinned, so they
      // are cached outside the scrub loop and refreshed with the trigger.
      let centres: number[] = [];
      let viewW = 0;
      const cache = () => {
        viewW = section.clientWidth;
        centres = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
      };
      cache();

      const bar = barRef.current;
      const counter = counterRef.current;
      const count = processSteps.length;

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -overflow(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${overflow()}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onRefresh: cache,
            onUpdate(self) {
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
              if (counter) {
                const n = Math.min(
                  count,
                  1 + Math.floor(self.progress * count),
                );
                const label = String(n).padStart(2, "0");
                if (counter.textContent !== label)
                  counter.textContent = label;
              }
              // The pop: images resolve as their card crosses centre.
              const viewMid = self.progress * overflow() + viewW / 2;
              for (let i = 0; i < media.length; i++) {
                const off = Math.min(
                  1,
                  Math.abs(centres[i] - viewMid) / viewW,
                );
                media[i].style.transform =
                  `scale(${(1 + off * 0.14).toFixed(3)})`;
                media[i].style.filter = `blur(${(off * 6).toFixed(1)}px)`;
                media[i].style.opacity = `${(1 - off * 0.35).toFixed(3)}`;
              }
            },
          },
        });
      }, section);

      ScrollTrigger.refresh();

      /*
       * RE-MEASURE WHEN THE DOCUMENT GROWS ABOVE US.
       *
       * This trigger's start is an absolute document position fixed at
       * creation, and on the homepage the hero pins independently — after
       * its own dynamic GSAP import — inserting a 150vh spacer ABOVE this
       * section. Whichever effect runs second invalidates the other's
       * measurement until something refreshes.
       *
       * In practice a refresh does arrive (ScrollTrigger's own `load`
       * handler, and the hero's after its frame tail lands), and wheeling
       * through the section measures correct: the track sits at x≈0 as the
       * section reaches the top. This observer is insurance for the case
       * where it does not arrive in time — a slow connection where the
       * reader gets here before the hero has finished — and it covers late
       * images and font swap for free. `refresh()` is idempotent: it may
       * change the height once as spacers recalculate, after which the
       * observer sees no further change.
       */
      const ro = new ResizeObserver(() => {
        clearTimeout(settle);
        settle = setTimeout(() => {
          if (!disposed) ScrollTrigger.refresh();
        }, 120);
      });
      ro.observe(document.body);
      cleanupRo = () => ro.disconnect();
    })();

    return () => {
      disposed = true;
      clearTimeout(settle);
      cleanupRo?.();
      ctx?.revert();
      track.classList.remove("process-track-h");
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="relative overflow-hidden border-t border-ink-300 bg-ink-50"
    >
      <div className="px-6 pb-16 pt-24 sm:px-10 lg:px-16 lg:pb-20 lg:pt-32">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-6">How a project runs</p>
            <h2
              id="process-heading"
              className="display text-display-md text-ink-1000"
            >
              Six steps. No surprises.
            </h2>
          </div>
          {/* Live counter, mirrored by the rail below. aria-hidden — the
              steps themselves are numbered for readers. */}
          <p
            aria-hidden="true"
            className="hidden shrink-0 font-mono text-sm tracking-[0.2em] text-ink-600 md:block"
          >
            <span ref={counterRef}>01</span> / {String(processSteps.length).padStart(2, "0")}
          </p>
        </div>

        <div ref={trackRef} className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {processSteps.map((step) => (
            <article
              key={step.id}
              data-process-card
              className="bezel relative"
            >
              <div className="bezel-core flex h-full flex-col p-3">
                <div className="relative aspect-[3/2] overflow-hidden rounded-[1.1rem] bg-ink-100">
                  {images[step.id] ? (
                    <div data-process-media className="absolute inset-0 will-change-transform">
                      <Image
                        src={images[step.id]!}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 44vw, 100vw"
                        className="object-cover grayscale"
                      />
                    </div>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.07),transparent_65%)]">
                      <span className="display text-6xl text-ink-400">
                        {step.index}
                      </span>
                    </span>
                  )}
                  {/* Ghost numeral over the image's foot — the oversized
                      index that keys the set together. */}
                  <span
                    aria-hidden="true"
                    className="display pointer-events-none absolute -bottom-4 right-3 text-[5.5rem] leading-none text-white/15 [text-shadow:0_2px_24px_rgb(0_0_0/0.5)]"
                  >
                    {step.index}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 px-4 pb-5 pt-6">
                  <p className="field-label text-ink-600">Step {step.index}</p>
                  <h3 className="display text-display-sm text-ink-1000">
                    {step.title}
                  </h3>
                  <p className="max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-700">
                    {step.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Progress rail — fills as the track travels. Hidden where there is
          no travel to report. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-8 hidden h-px bg-ink-300 sm:inset-x-10 md:block lg:inset-x-16"
      >
        <div
          ref={barRef}
          className="h-full origin-left bg-ink-1000"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
