"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { processSteps } from "@/lib/content";

/**
 * PROCESS — HORIZONTAL SCROLL RIDE
 *
 * Reach the section, it holds, scrolling carries you sideways through all
 * six steps, then the page releases and continues down.
 *
 * BUILT ON NATIVE `position: sticky`, NOT ON A SCROLLTRIGGER PIN — and that
 * is the whole point of this file. The first version pinned with GSAP, which
 * inserts a spacer and stores the trigger's start as an ABSOLUTE document
 * position captured at creation. On the homepage the hero pins independently
 * and inserts 150vh of spacer ABOVE this section, asynchronously, after its
 * own dynamic import. Whichever effect ran second left the other's start
 * stale — and a stale start does not degrade gently: the moment the reader
 * crossed that phantom line, hundreds of pixels above the section, the
 * section slammed to the top of the viewport. The client reported exactly
 * that, and it is unshippable.
 *
 * Refreshing on layout change was tried and is the wrong shape of fix: it
 * chases the symptom, and a refresh landing mid-scroll causes its own jump.
 *
 * Sticky has no stored measurement to go stale. The browser holds the pane
 * while its tall parent scrolls past; the travel is read LIVE from
 * `getBoundingClientRect()` on every frame, so it is correct no matter what
 * loads, resizes or pins above it. It also needs no GSAP here at all.
 *
 * PROGRESSIVE ENHANCEMENT: the server renders a plain responsive grid, which
 * is what no-JS, reduced motion and small or short viewports keep. The
 * effect adds `.process-h` (unlayered CSS in globals.css, so it beats the
 * Tailwind grid utilities) and the outer height that gives the ride its
 * scroll distance. Everything animated is transform/opacity/filter, written
 * once per frame inside rAF with no layout reads in the loop beyond one
 * rect.
 */
export function ProcessScroll({
  images,
}: {
  /** step id → resolved public path, or null when no file exists yet. */
  images: Record<string, string | null>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pane = paneRef.current;
    const track = trackRef.current;
    if (!section || !pane || !track) return;

    // Short viewports cannot hold a full-height pane and the cards without
    // clipping them, so they keep the grid.
    const allowed = window.matchMedia(
      "(min-width: 768px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)",
    );
    if (!allowed.matches) return;

    section.classList.add("process-h");

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-process-card]"),
    );
    const media = Array.from(
      track.querySelectorAll<HTMLElement>("[data-process-media]"),
    );
    const bar = barRef.current;
    const counter = counterRef.current;
    const count = processSteps.length;

    let overflow = 0;
    let centres: number[] = [];
    let frame = 0;

    /** Re-measure the track and give the section the height that ride needs. */
    const measure = () => {
      overflow = Math.max(0, track.scrollWidth - pane.clientWidth);
      centres = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
      // The scroll distance IS the horizontal overflow, so the ride runs at
      // 1:1 with the wheel — no acceleration, nothing to catch up on.
      section.style.height = `${pane.clientHeight + overflow}px`;
    };

    const paint = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - pane.clientHeight;
      // Live progress. Nothing here is remembered between frames, so nothing
      // can be stale — this is what removes the snap.
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;

      track.style.transform = `translate3d(${-(overflow * p).toFixed(2)}px,0,0)`;
      if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
      if (counter) {
        const n = Math.min(count, 1 + Math.floor(p * count));
        const label = String(n).padStart(2, "0");
        if (counter.textContent !== label) counter.textContent = label;
      }

      // Each image resolves as its card crosses the middle of the pane.
      const viewMid = overflow * p + pane.clientWidth / 2;
      for (let i = 0; i < media.length; i++) {
        const off = Math.min(1, Math.abs(centres[i] - viewMid) / pane.clientWidth);
        media[i].style.transform = `scale(${(1 + off * 0.12).toFixed(3)})`;
        media[i].style.filter = `blur(${(off * 5).toFixed(1)}px)`;
        media[i].style.opacity = `${(1 - off * 0.3).toFixed(3)}`;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(paint);
    };

    measure();
    paint();

    window.addEventListener("scroll", onScroll, { passive: true });
    // Width changes alter both the overflow and the height that encodes it.
    const ro = new ResizeObserver(() => {
      measure();
      paint();
    });
    ro.observe(track);
    ro.observe(pane);

    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(frame);
      section.classList.remove("process-h");
      section.style.height = "";
      track.style.transform = "";
      for (const m of media) {
        m.style.transform = "";
        m.style.filter = "";
        m.style.opacity = "";
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="relative border-t border-ink-300 bg-ink-50"
    >
      <div ref={paneRef} className="process-pane overflow-hidden">
        <div className="px-6 pb-10 pt-24 sm:px-10 lg:px-16 lg:pb-12 lg:pt-28">
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
              <span ref={counterRef}>01</span> /{" "}
              {String(processSteps.length).padStart(2, "0")}
            </p>
          </div>

          <div
            ref={trackRef}
            className="process-track mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {processSteps.map((step) => (
              <article key={step.id} data-process-card className="bezel relative">
                <div className="bezel-core flex h-full flex-col p-3">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-[1.1rem] bg-ink-100">
                    {images[step.id] ? (
                      <div
                        data-process-media
                        className="absolute inset-0 will-change-transform"
                      >
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

        {/* Progress rail — fills as the track travels. Only meaningful while
            the horizontal ride is active. */}
        <div
          aria-hidden="true"
          className="process-rail absolute inset-x-6 bottom-8 hidden h-px bg-ink-300 sm:inset-x-10 lg:inset-x-16"
        >
          <div
            ref={barRef}
            className="h-full origin-left bg-ink-1000"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
