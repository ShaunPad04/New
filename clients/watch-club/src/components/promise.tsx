"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { promise } from "@/lib/content";

/**
 * "We leave them alone."
 *
 * The strongest thing this business has to say, so it gets a full editorial
 * spread rather than a bullet in a services list.
 *
 * The vertical film sits in the left column. It is decorative, silent and
 * below the fold, so:
 *
 *   - it is aria-hidden and carries no caption track
 *   - it does not mount until it is near the viewport (IntersectionObserver),
 *     so it never competes with the hero for bandwidth on first load
 *   - under prefers-reduced-motion only the poster renders and no <video>
 *     element is created at all
 */
export function Promise() {
  const holderRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const node = holderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section
      id="services"
      className="scroll-mt-24 border-y border-obsidian-line bg-obsidian-raised py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          {/* ------------------------------------------------------- film */}
          <Reveal>
            <div ref={holderRef} className="bezel">
              <div className="bezel-core relative aspect-[9/16] w-full">
                {/* The poster is the resting state and a complete image in
                    its own right — the film only ever plays on top of it. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[url('/images/promise-poster.jpg')] bg-cover bg-center"
                />
                {inView ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                    poster="/images/promise-poster.jpg"
                    className="absolute inset-0 h-full w-full object-cover"
                  >
                    {/* H.264 only. VP9 was re-encoded alongside it and came
                        out LARGER at matched quality — this footage is a
                        near-black field where VP9's strengths do not apply —
                        so a second source would cost bytes and buy nothing. */}
                    <source src="/video/rolex-detail.mp4" type="video/mp4" />
                  </video>
                ) : null}
              </div>
            </div>
          </Reveal>

          {/* ------------------------------------------------------- copy */}
          <div className="flex flex-col justify-center">
            <Reveal>
              <div className="rule-accent mb-8 w-24" />
              <p className="eyebrow mb-5">{promise.eyebrow}</p>
              <h2 className="display-lg text-bone">{promise.headline}</h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-col gap-5">
                {promise.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="max-w-xl text-[0.9375rem] leading-relaxed text-bone-dim"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-obsidian-line bg-obsidian-line sm:grid-cols-2">
                {promise.points.map((point) => (
                  <div key={point.label} className="bg-obsidian-raised p-6">
                    <dt className="spec-label">{point.label}</dt>
                    <dd className="mt-3 text-base text-bone">{point.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
