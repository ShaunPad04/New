"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * JOURNEY — after the "The Journey" section on neiden.framer.media (Brad,
 * 2026-09-29: "the pictures change, and there's a timeline thing"); layout
 * studied, no assets, code or copy taken. Neiden's timeline is the studio's
 * history in years; ours is a project's six steps (`processSteps`), because
 * that is the journey a client actually takes with us.
 *
 * Desktop: the heading holds in the first column, the picture holds in the
 * second and changes with the step, and the timeline scrolls in the third —
 * a red rule with a dot at its tip follows the middle of the screen as you
 * scroll, and each step it passes lights up. Phones: one column, the same
 * picture pinned under the bar while the steps pass. Pictures are
 * AI-generated atmosphere (Higgsfield, 2026-09-29): hands and desks, no
 * faces, never presented as the founders or a client.
 */

/* The steps arrive as props (the page reads `processSteps`), so this client
   component does not pull content.ts into the browser. */
export type JourneyStep = { id: string; index: string; title: string; body: string };
const image = (id: string) => `/images/journey/${id}.2026-09-29.webp`;
const LABEL = "text-[0.75rem] font-bold uppercase tracking-[-0.02em]";

export function Journey({ index = "05", steps }: { index?: string; steps: JourneyStep[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const rail = railRef.current;
    if (!list || !rail) return;
    // Read on scroll, written once a frame: the red rule follows the middle
    // of the screen continuously (Brad: "it should go down smoothly"), and
    // the step under that line is the lit one.
    let raf = 0;
    let lit = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      const r = list.getBoundingClientRect();
      rail.style.setProperty("--p", String(Math.min(1, Math.max(0, (mid - r.top) / r.height))));
      let next = 0;
      // A step lights (and its picture swaps in) the moment the red tip
      // reaches ITS DOT — the li's first child — so the two stay in sync.
      Array.from(list.children).forEach((li, i) => {
        const dot = li.firstElementChild!.getBoundingClientRect();
        if (dot.top + dot.height / 2 <= mid) next = i;
      });
      if (next !== lit) setActive((lit = next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      aria-labelledby="journey-heading"
      className="relative mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-8 lg:py-32"
    >
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-0">
        {/* 1 — the heading, held */}
        <div className="lg:pr-10">
          <div className="lg:sticky lg:top-28">
            <p className={`${LABEL} text-ink-700`}>
              [ <span className="text-accent">{index}</span> — The journey ]
            </p>
            <h2
              id="journey-heading"
              className="display mt-6 text-[clamp(3rem,6.2vw,6.5rem)] leading-[0.92] text-ink-1000"
            >
              The
              <br />
              journey.
            </h2>
            <p className="mt-6 max-w-[34ch] text-[1.0625rem] leading-[1.4] tracking-[-0.04em] text-ink-800">
              Six steps from the first call to a site that keeps earning. The
              same two founders at every one of them.
            </p>
          </div>
        </div>

        {/* 2 — the picture, held; changes with the step (desktop) */}
        <div className="hidden lg:block lg:px-10">
          <div className="sticky top-[calc(50vh-11rem)]">
            <Frame steps={steps} active={active} sizes="(min-width: 1600px) 450px, 28vw" />
          </div>
        </div>

        {/* 3 — the timeline */}
        <div className="lg:pl-10">
          {/* Phones: the same picture, pinned under the bar while the steps
              pass beneath it (one picture, not six: Brad found six "a bit
              long"). Opaque so the steps slide out of sight behind it. */}
          <div className="sticky top-11 z-10 -mx-6 mb-8 bg-ink-0 px-6 pb-4 pt-3 sm:-mx-8 sm:px-8 lg:hidden">
            <Frame steps={steps} active={active} sizes="100vw" wide />
          </div>
          <div className="relative">
            {/* The rule, the red fill down to the middle of the screen, and
                the red dot riding its tip — both follow the scroll directly. */}
            <div
              ref={railRef}
              aria-hidden="true"
              className="absolute bottom-0 left-0 top-0 w-px bg-ink-1000/12"
            >
              <div
                className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
                style={{ transform: "scaleY(var(--p, 0))" }}
              />
              <div
                className="absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_rgba(240,43,66,0.6)]"
                style={{ top: "calc(var(--p, 0) * 100%)" }}
              />
            </div>
            <ol ref={listRef}>
              {steps.map((s, i) => {
                const dim = i === active ? "" : "text-ink-600";
                return (
                  <li
                    key={s.id}
                    className="relative pb-12 pl-8 last:pb-0 lg:flex lg:min-h-[50vh] lg:flex-col lg:justify-center lg:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[3.5px] top-1.5 size-2 rounded-full transition-colors duration-300 lg:top-1/2 ${
                        i <= active ? "bg-accent" : "bg-ink-500"
                      }`}
                    />
                    <p className={`${LABEL} tabular-nums text-ink-600`}>Step {s.index}</p>
                    <h3
                      className={`mt-3 text-[1.375rem] font-semibold leading-tight tracking-[-0.03em] text-ink-1000 transition-colors duration-300 ${dim}`}
                    >
                      {s.title}
                    </h3>
                    <p
                      className={`mt-3 max-w-[38ch] text-[0.9375rem] leading-[1.5] tracking-[-0.02em] text-ink-800 transition-colors duration-300 ${dim}`}
                    >
                      {s.body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The held picture: every step's still stacked, the active one shown. */
function Frame({ steps, active, sizes, wide }: { steps: JourneyStep[]; active: number; sizes: string; wide?: boolean }) {
  const last = steps.length - 1;
  return (
    <>
      <div className={`relative overflow-hidden bg-ink-100 ${wide ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        {steps.map((s, i) => (
          <Image
            key={s.id}
            src={image(s.id)}
            alt=""
            fill
            sizes={sizes}
            className={`object-cover transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
            }`}
          />
        ))}
      </div>
      <div className={`${wide ? "mt-3" : "mt-4"} flex justify-between ${LABEL} text-ink-700`}>
        <span>{steps[active].title}</span>
        <span className="tabular-nums">
          {steps[active].index} / {steps[last].index}
        </span>
      </div>
    </>
  );
}
