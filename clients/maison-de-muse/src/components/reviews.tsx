"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  GOOGLE_RATING_VERIFIED,
  GOOGLE_REVIEWS_URL,
  TRIPADVISOR_URL,
  reviews,
} from "@/lib/reviews";
import { Cta } from "@/components/cta";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

/**
 * REVIEWS — the template's testimonial cards, as a carousel.
 *
 * Every card is a real public review. Paraphrased entries render without
 * quotation marks and carry a "summary" label, so no one is attributed
 * words they did not write. No star counts or aggregate figures are
 * printed while `GOOGLE_RATING_VERIFIED` is false — the section links to
 * Google and Tripadvisor instead.
 *
 * Accessibility: labelled carousel group with arrow-key support, autoplay
 * stops on interaction and on hover/focus, and the slide position is
 * announced politely.
 */
export function Reviews({ compact = false }: { compact?: boolean }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [Autoplay({ delay: 7000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("init", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("init", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className={cn("bg-plaster", compact ? "" : "")}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[36rem]">
            <Reveal>
              <p className="eyebrow mb-6">In their words</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="reviews-heading" className="display text-display-lg text-espresso">
                Loved by
                <br />
                <em className="display-italic text-plum">the regulars.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-6 max-w-[44ch]">
                Summaries of public reviews, each linked to where it was
                written. Read the latest on Google and Tripadvisor.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="flex flex-wrap gap-3">
            <Cta href={GOOGLE_REVIEWS_URL} external variant="ghost">
              Reviews on Google
            </Cta>
            <Cta href={TRIPADVISOR_URL} external variant="ghost">
              Tripadvisor
            </Cta>
          </Reveal>
        </div>

        {!GOOGLE_RATING_VERIFIED ? (
          <p className="sr-only">
            The Google rating and review count are not shown until verified.
          </p>
        ) : null}

        <div
          className="mt-14 overflow-hidden"
          ref={emblaRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") emblaApi?.scrollNext();
            if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
          }}
        >
          {/* Divs, not ul/li: each slide carries role="group", which would
              leave a list with non-listitem children — axe flags that. */}
          <div className="flex">
            {reviews.map((r, i) => (
              <div
                key={r.id}
                className="min-w-0 shrink-0 grow-0 basis-full pr-4 sm:basis-[70%] lg:basis-[40%] lg:pr-5"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${reviews.length}`}
              >
                <div className="bezel h-full">
                  <figure className="bezel-core flex h-full flex-col justify-between p-7 lg:p-9">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="eyebrow">{r.theme}</span>
                        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-mocha">
                          {r.kind === "quote" ? "Quote" : "Summary"}
                        </span>
                      </div>
                      <blockquote className="mt-8">
                        <p className="serif text-[1.375rem] leading-snug text-espresso lg:text-2xl">
                          {r.kind === "quote" ? `“${r.text}”` : r.text}
                        </p>
                      </blockquote>
                    </div>
                    <figcaption className="mt-10 border-t border-sand pt-5 text-sm text-mocha">
                      {r.kind === "paraphrase" ? "Paraphrased from a " : "From a "}
                      <a
                        href={r.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-line text-espresso"
                      >
                        {r.source.label}
                      </a>
                      {r.when ? `, ${r.when}` : ""}
                    </figcaption>
                  </figure>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center gap-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-espresso/15 bg-cream/70 text-espresso transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-espresso/40 active:scale-95"
            >
              <span className="sr-only">Previous review</span>
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-espresso/15 bg-cream/70 text-espresso transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-espresso/40 active:scale-95"
            >
              <span className="sr-only">Next review</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <ul className="flex gap-2" aria-hidden="true">
            {reviews.map((r, i) => (
              <li
                key={r.id}
                className={cn(
                  "h-px w-8 transition-colors duration-500",
                  i === selected ? "bg-plum" : "bg-sand-deep"
                )}
              />
            ))}
          </ul>

          <p aria-live="polite" className="sr-only">
            Review {selected + 1} of {reviews.length}
          </p>
        </div>
      </div>
    </section>
  );
}
