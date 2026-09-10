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
              <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </div>
          </div>
        );
      })}

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/55 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 md:p-8">
        <Link href={`/properties/${current.slug}`} className="max-w-[70%] rounded-[15px] bg-ink-deep/45 px-5 py-4 text-white backdrop-blur-sm transition-colors hover:bg-ink-deep/60">
          <p className="text-sm text-cloud">{current.isNewHome ? "New home" : "For sale"} · {price.qualifier ? `${price.qualifier} ` : ""}{price.amount}</p>
          <p className="mt-0.5 text-lg font-medium leading-tight md:text-2xl">{current.title}</p>
          <p className="mt-1 text-sm underline underline-offset-4">View this property</p>
        </Link>
        {slides.length > 1 ? (
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur-sm transition-colors hover:bg-white" aria-label="Previous listing">←</button>
            <span className="rounded-full bg-white/85 px-3 py-2 text-sm text-ink backdrop-blur-sm" aria-live="polite">{index + 1} / {slides.length}</span>
            <button type="button" onClick={() => setIndex((i) => (i + 1) % slides.length)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur-sm transition-colors hover:bg-white" aria-label="Next listing">→</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
