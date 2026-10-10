"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Property } from "@/lib/properties";
import { formatPrice } from "@/lib/properties";
import { cn } from "@/lib/utils";

const HOLD_MS = 6500;
const FADE_MS = 1400;

/**
 * Hero slideshow — the reference's full-bleed hero photograph, as a
 * slideshow of the agency's own highest-value listings. Each frame starts
 * slightly zoomed in and eases out to 1× over the hold (the "zoom-out"
 * Brad asked for), cross-fading into the next. Frames link to the listing
 * they show. Hover or focus pauses it; previous/next are real buttons; under
 * reduced motion the first frame is shown still.
 */
export function HeroSlideshow({ properties, className }: { properties: Property[]; className?: string }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);
  const slides = properties.filter((p) => p.images[0]);

  useEffect(() => {
    if (reduced || paused || slides.length < 2) return;
    timer.current = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), HOLD_MS);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [index, paused, reduced, slides.length]);

  if (!slides.length) return <div className={cn("relative aspect-[1440/931] w-full bg-ink/10", className)} />;
  const current = slides[index];
  const price = formatPrice(current);

  return (
    <div
      className={cn("group relative aspect-[1440/931] w-full overflow-hidden bg-ink", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured listings"
    >
      {slides.map((p, i) => {
        const img = p.images[0];
        const active = i === index;
        return (
          <div
            key={p.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${p.title}`}
            aria-hidden={!active}
            className="absolute inset-0 transition-opacity ease-out-soft"
            style={{ opacity: active ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
          >
            <div
              className={cn("absolute inset-0 will-change-transform", !reduced && active && "hero-kenburns")}
              style={{ animationDuration: `${HOLD_MS + FADE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
            >
              <Image src={img.src} alt={img.alt} fill priority={i === 0} quality={85} sizes="100vw" className="object-cover" />
            </div>
          </div>
        );
      })}

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/55 to-transparent" />

      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 md:p-7">
        <Link href={`/properties/${current.slug}`} className="max-w-[70%] text-white [text-shadow:0_1px_12px_rgba(8,11,15,0.6)]">
          <span className="block text-xs uppercase tracking-[0.12em] text-cloud/90">{current.isNewHome ? "New home" : "For sale"} · {price.qualifier ? `${price.qualifier} ` : ""}{price.amount}</span>
          <span className="mt-1 block text-base font-medium leading-tight underline-offset-4 hover:underline md:text-lg">{current.title} →</span>
        </Link>
        {slides.length > 1 ? (
          <div className="flex items-center gap-1" role="group" aria-label="Choose listing">
            {slides.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show listing ${i + 1} of ${slides.length}: ${p.title}`}
                aria-current={i === index ? "true" : undefined}
                className="group/dot flex h-7 min-w-7 items-center justify-center rounded-full"
              >
                <span aria-hidden="true" className={cn("block h-2.5 rounded-full transition-all duration-500 ease-out-soft", i === index ? "w-7 bg-white" : "w-2.5 bg-white/55 group-hover/dot:bg-white/80")} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
