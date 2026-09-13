"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { processSteps } from "@/lib/content";

/**
 * HOW WE WORK — scroll-driven horizontal track
 *
 * The section pins while the step cards travel left, so scrolling down reads
 * the process across. The reference does the same thing.
 *
 * ── Why the distance is measured rather than guessed ──
 * A hard-coded `x: -60%` breaks at every viewport that isn't the one it was
 * tuned on: too little and the last card never arrives, too much and the
 * track scrolls into empty space. The overflow is measured from the DOM and
 * re-measured on resize, so the last card lands flush on any screen.
 *
 * ── Reduced motion, and small screens ──
 * Pinning hijacks the scrollbar. Under `prefers-reduced-motion` — and below
 * `lg`, where a pinned viewport-height section is hostile on a phone — the
 * mechanism is dropped for an ordinary horizontally scrollable region that
 * works with a thumb, a trackpad and arrow keys.
 *
 * The two layouts are chosen in state rather than with `lg:hidden` twins,
 * because rendering both would put two copies of the same headings and ids in
 * the DOM — a duplicate-id violation and a second <h2> that axe would flag,
 * even though only one is visible.
 */
export function Process() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [overflow, setOverflow] = useState(0);
  // Server-renders unpinned, then upgrades after mount. The markup is
  // identical either way, so there is nothing for hydration to mismatch on.
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setPinned(mq.matches && !reduced);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reduced]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setOverflow(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [pinned]);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -overflow]);

  const head = (
    <div className="flex items-start gap-4">
      <h2 id="process-heading" className="section-word">
        How we
        <br />
        <span className="text-ink-1000">work</span>
      </h2>
      <p className="field-label mt-2 shrink-0">(Process)</p>
    </div>
  );

  const cards = (
    <ol
      ref={trackRef}
      className="flex w-max border-y border-ink-300 [&>li]:border-l [&>li]:border-ink-300 [&>li:last-child]:border-r"
    >
      {processSteps.map((step, i) => (
        <li
          key={step.index}
          className="flex w-[min(80vw,22rem)] flex-col justify-between gap-20 bg-ink-0 px-7 py-9 transition-colors duration-700 hover:bg-ink-100 lg:w-[24rem] lg:px-9 lg:py-11"
        >
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-800">
            Step {i + 1}
            <span aria-hidden="true" className="ml-0.5 text-ink-600">
              .
            </span>
          </p>

          <div>
            <h3 className="display-soft text-3xl text-ink-1000 lg:text-4xl">
              {step.title}
            </h3>
            <p className="mt-5 max-w-[30ch] text-sm leading-relaxed text-ink-700">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      {pinned ? (
        <div
          ref={wrapRef}
          className="relative"
          // Travel scales with how far the track actually has to move: a short
          // track should not demand three screens of scrolling to clear.
          style={{ height: `calc(100vh + ${overflow}px)` }}
        >
          <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
            <div className="mx-auto w-full max-w-[1600px] px-16 pb-12">
              {head}
            </div>
            <div ref={viewportRef} className="w-full overflow-hidden pl-16">
              <motion.div style={{ x }} className="will-change-transform">
                {cards}
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mx-auto w-full max-w-[1600px] px-6 pb-8 pt-24 sm:px-10 lg:px-16">
            {head}
          </div>
          {/* A scrollable region with no focusable children is unreachable by
              keyboard — axe flags it `scrollable-region-focusable`, and
              rightly: the step cards contain no links, so without a tabstop
              of its own nobody navigating by keyboard can scroll to step 4.
              `tabIndex` makes it focusable and arrow-scrollable; the role and
              label give that tabstop something to announce. */}
          <div
            ref={viewportRef}
            tabIndex={0}
            role="region"
            aria-label="Process steps — scroll horizontally"
            className="overflow-x-auto pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="w-max px-6 sm:px-10">{cards}</div>
          </div>
        </>
      )}
    </section>
  );
}
