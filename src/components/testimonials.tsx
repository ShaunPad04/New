"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  PLACEHOLDER_TESTIMONIALS,
  TESTIMONIALS_VERIFIED,
  type Testimonial,
} from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Testimonial carousel.
 *
 * Renders nothing at all while `TESTIMONIALS_VERIFIED` is false. Fabricated
 * or placeholder client quotes are not shown on a live commercial site under
 * any circumstances — see the content-integrity note in lib/content.ts.
 *
 * Accessibility: the viewport is a labelled group with keyboard arrow
 * support, autoplay stops on interaction and on hover/focus, and the slide
 * count is announced politely rather than on every frame.
 */
export function Testimonials() {
  const slides: Testimonial[] = TESTIMONIALS_VERIFIED
    ? PLACEHOLDER_TESTIMONIALS
    : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Subscribe only — `init` and `reInit` deliver the starting snap, so
    // there is no need to call setState synchronously in the effect body.
    emblaApi.on("init", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("init", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (slides.length === 0) return null;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <p className="eyebrow mb-6">In their words</p>
        <h2
          id="testimonials-heading"
          className="display text-display-md max-w-[18ch] text-ink-1000"
        >
          What it is like to work with us.
        </h2>

        <div
          className="mt-16 overflow-hidden"
          ref={emblaRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") emblaApi?.scrollNext();
            if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
          }}
        >
          <ul className="flex">
            {slides.map((t, i) => (
              <li
                key={t.id}
                className="min-w-0 shrink-0 grow-0 basis-full pr-6 sm:basis-[70%] lg:basis-[46%]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}`}
              >
                <figure className="flex h-full flex-col justify-between border border-ink-300 p-8 lg:p-12">
                  <blockquote className="display-serif text-2xl leading-snug text-ink-900 lg:text-3xl">
                    <p>&ldquo;{t.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption className="mt-10 border-t border-ink-300 pt-6">
                    <p className="text-sm font-medium text-ink-1000">{t.name}</p>
                    <p className="mt-1 text-sm text-ink-600">
                      {t.role}, {t.company}
                    </p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex items-center gap-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-400 text-ink-800 transition-colors duration-300 hover:border-ink-800 hover:text-ink-1000"
            >
              <span className="sr-only">Previous testimonial</span>
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-400 text-ink-800 transition-colors duration-300 hover:border-ink-800 hover:text-ink-1000"
            >
              <span className="sr-only">Next testimonial</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <ul className="flex gap-2" aria-hidden="true">
            {slides.map((t, i) => (
              <li
                key={t.id}
                className={cn(
                  "h-px w-8 transition-colors duration-500",
                  i === selected ? "bg-ink-1000" : "bg-ink-400"
                )}
              />
            ))}
          </ul>

          <p aria-live="polite" className="sr-only">
            Testimonial {selected + 1} of {slides.length}
          </p>
        </div>
      </div>
    </section>
  );
}
