"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { WatchPlate } from "@/components/watch-plate";
import type { Watch } from "@/lib/content";

/**
 * Cinematic scroll section.
 *
 * Adapted from the supplied component. The idea worth keeping is the
 * grayscale-to-colour `clip-path` wipe driven by scroll position, with the
 * copy revealing in steps beside it. What changed:
 *
 *   1. anime.js is gone. Its only job was one staggered entrance, and adding
 *      a third animation library for that would cost more than the effect is
 *      worth. `motion` — already in the bundle — does it in `whileInView`.
 *   2. The clothing mock data is gone; the section is driven by real Patek
 *      references passed in as props from `content.ts`.
 *   3. `colors` and `sizes` meant nothing for watches. They are replaced by
 *      the three facts a collector actually asks for: movement, case
 *      material, and whether it has its box and papers.
 *   4. Reduced motion. The original had no path at all: the colour layer was
 *      clipped to `inset(0 0 100% 0)` at rest and only opened on scroll, so
 *      a visitor with the query set would see a permanently grey, mostly
 *      empty section. Now the wipe and the step reveals are skipped entirely
 *      and everything renders in its final state.
 *   5. The `<Link>`-wrapped "quick view" is gone. There is no product route
 *      on a single-page pitch build, and a link to nowhere is worse than no
 *      link.
 */
export function CinematicProductScroll({ pieces }: { pieces: Watch[] }) {
  return (
    <>
      {pieces.map((piece, index) => (
        <ProductPanel
          key={piece.id}
          piece={piece}
          reversed={index % 2 !== 0}
          index={index}
        />
      ))}
    </>
  );
}

function ProductPanel({
  piece,
  reversed,
  index,
}: {
  piece: Watch;
  reversed: boolean;
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const section = sectionRef.current;
    if (!section) return;

    // Raw scroll maths rather than useScroll: the desktop layout pins for
    // 250vh and the mobile layout does not pin at all, so the progress
    // source differs per breakpoint.
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const mask = section.querySelector<HTMLElement>(".color-mask");

      let progress = 0;

      if (window.innerWidth < 768) {
        const startReveal = windowHeight;
        const endReveal = windowHeight * 0.25;
        progress = (startReveal - rect.top) / (startReveal - endReveal);
      } else if (rect.top <= 0) {
        const scrollable = rect.height - windowHeight;
        if (scrollable > 0) progress = Math.abs(rect.top) / scrollable;
      }

      progress = Math.min(Math.max(progress, 0), 1);

      if (mask) {
        mask.style.clipPath =
          window.innerWidth < 768
            ? `inset(0 ${100 - progress * 100}% 0 0)`
            : `inset(0 0 ${100 - progress * 100}% 0)`;
      }

      section.querySelectorAll<HTMLElement>(".reveal-step").forEach((step) => {
        const start = parseFloat(step.dataset.progress ?? "0");
        step.classList.toggle("active", progress > start);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [reduced]);

  // With motion reduced, the colour layer is simply open and every step is
  // already in its resting state.
  const maskStyle = reduced
    ? { clipPath: "inset(0 0 0 0)" }
    : { clipPath: "inset(0 0 100% 0)" };

  const stepClass = reduced
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-12 [&.active]:translate-y-0 [&.active]:opacity-100";

  return (
    <div
      ref={sectionRef}
      className="relative h-auto w-full md:h-[250vh]"
      aria-labelledby={`piece-${piece.id}`}
    >
      <div className="relative h-auto w-full overflow-hidden md:sticky md:top-0 md:h-screen">
        <div className="grid h-auto w-full grid-cols-1 md:h-full md:grid-cols-2">
          {/* ------------------------------------------------------ image */}
          <div
            className={`relative mx-auto flex w-full max-w-[420px] items-center justify-center p-6 sm:max-w-[520px] md:max-w-none md:p-0 ${
              reversed ? "md:order-2" : ""
            }`}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:aspect-auto md:h-full md:rounded-none">
              {piece.image ? (
                <>
                  {/* Desaturated base layer... */}
                  <Image
                    src={piece.image}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain grayscale brightness-110"
                    priority={index === 0}
                  />
                  {/* ...with the full-colour image wiped over it by scroll.
                      Only this layer carries the alt text, so the image is
                      announced once rather than twice. */}
                  <div
                    className="color-mask absolute inset-0 h-full w-full will-change-[clip-path]"
                    style={maskStyle}
                  >
                    <Image
                      src={piece.image}
                      alt={`${piece.brand} ${piece.model}, reference ${piece.reference}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                </>
              ) : (
                /* No photography of this reference exists yet. The wipe has
                   nothing to reveal, so the plate simply renders — see
                   WatchPlate for why an invented photograph would be worse
                   than none. */
                <WatchPlate brand={piece.brand} reference={piece.reference} />
              )}
            </div>
          </div>

          {/* ------------------------------------------------------- copy */}
          <div
            className={`relative z-10 flex items-center justify-center px-6 py-10 md:p-12 ${
              reversed ? "md:order-1" : ""
            }`}
          >
            <div className="flex w-full max-w-md flex-col gap-8 md:gap-10">
              <div
                className={`reveal-step transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${stepClass}`}
                data-progress="0.2"
              >
                <p className="eyebrow mb-4">{piece.brand}</p>
                <h3 id={`piece-${piece.id}`} className="display-md text-bone">
                  {piece.model}
                </h3>
                <p className="mt-4 font-mono text-sm text-champagne">
                  Ref. {piece.reference} &middot; {piece.year} &middot;{" "}
                  {piece.caseSize}
                </p>
              </div>

              <div
                className={`reveal-step transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${stepClass}`}
                data-progress="0.4"
              >
                <p className="border-t border-obsidian-line pt-6 text-sm leading-relaxed text-bone-dim">
                  {piece.note}
                </p>
              </div>

              <dl
                className={`reveal-step grid grid-cols-2 gap-x-6 gap-y-5 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${stepClass}`}
                data-progress="0.6"
              >
                <div>
                  <dt className="spec-label">Movement</dt>
                  <dd className="spec-value mt-2">{piece.movement}</dd>
                </div>
                <div>
                  <dt className="spec-label">Case</dt>
                  <dd className="spec-value mt-2">{piece.material}</dd>
                </div>
                <div>
                  <dt className="spec-label">Accompanied by</dt>
                  <dd className="spec-value mt-2">{piece.accompaniments}</dd>
                </div>
                <div>
                  <dt className="spec-label">Price</dt>
                  <dd className="mt-2 font-mono text-base text-bone">
                    {piece.price}
                  </dd>
                </div>
              </dl>

              <motion.div
                className={`reveal-step pt-2 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${stepClass}`}
                data-progress="0.8"
              >
                <a
                  href="#visit"
                  className="group inline-flex w-full items-center justify-between rounded-full border border-obsidian-line py-2 pl-6 pr-2 text-sm font-medium text-bone transition-colors duration-300 hover:border-champagne/50"
                >
                  Enquire about this piece
                  <span className="grid size-9 place-items-center rounded-full bg-bone text-obsidian transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 11L11 3M11 3H4.5M11 3v6.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
