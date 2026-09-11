"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/content";

/**
 * Editorial testimonial carousel.
 *
 * Structure is the supplied component's, unchanged: the oversized index
 * numeral, the quote, and a line-selector nav where the active item's rule
 * grows. What changed:
 *
 *   - Quotes are real, public Trustpilot reviews from `content.ts` rather
 *     than invented ones, and the author block is repurposed to name the
 *     source instead of a fake job title and company.
 *   - The avatar <Image> is gone. Its demo URLs pointed at a CDN that is not
 *     reachable from this environment, and we have no photographs of real
 *     reviewers — inventing faces for real quotes would be worse than having
 *     none. A quotation glyph carries the space instead.
 *   - The paging buttons have accessible names and the line selectors expose
 *     `aria-current`; the original had neither, and axe flags both.
 *   - The live region announces the change for screen reader users, who
 *     otherwise get no feedback that the quote swapped.
 */
export function EditorialTestimonials() {
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleChange = (index: number) => {
    if (index === active || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActive(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handlePrev = () =>
    handleChange(active === 0 ? testimonials.length - 1 : active - 1);

  const handleNext = () =>
    handleChange(active === testimonials.length - 1 ? 0 : active + 1);

  const current = testimonials[active];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8">
      <div className="flex items-start gap-6 sm:gap-8">
        <span
          className="select-none text-[80px] font-light leading-none text-bone/10 transition-all duration-500 sm:text-[120px]"
          style={{ fontFeatureSettings: '"tnum"' }}
          aria-hidden="true"
        >
          {String(active + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 pt-4 sm:pt-6">
          <blockquote
            className={`display-sm text-bone transition-all duration-300 ${
              isTransitioning
                ? "translate-x-4 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <p>&ldquo;{current.quote}&rdquo;</p>
          </blockquote>

          <div
            className={`mt-8 transition-all delay-100 duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-obsidian-line font-display text-xl leading-none text-champagne"
              >
                &rdquo;
              </span>
              <div>
                <p className="text-sm font-medium text-bone">
                  {current.author}
                </p>
                <p className="spec-label mt-1">
                  {current.source}
                  <span aria-hidden="true" className="mx-2 text-bone/20">
                    /
                  </span>
                  {current.detail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader users get no signal from a CSS cross-fade. */}
      <p aria-live="polite" className="sr-only">
        Review {active + 1} of {testimonials.length}. {current.quote}
      </p>

      <div className="mt-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {testimonials.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleChange(index)}
                aria-label={`Show review ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                className="group relative py-4"
              >
                <span
                  className={`block h-px transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    index === active
                      ? "w-12 bg-champagne"
                      : "w-6 bg-bone/20 group-hover:w-8 group-hover:bg-bone/40"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="spec-label" aria-hidden="true">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous review"
            className="rounded-full p-2 text-bone/40 transition-all duration-300 hover:bg-bone/5 hover:text-bone"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next review"
            className="rounded-full p-2 text-bone/40 transition-all duration-300 hover:bg-bone/5 hover:text-bone"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
