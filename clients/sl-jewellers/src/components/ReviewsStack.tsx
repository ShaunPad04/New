"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import type { Review } from "@/lib/content";

export type Story = { review: Review; image: string; caption: string };

/** Where a review was left: Google's five stars, or Facebook's recommendation (never mixed). */
function Source({ r, className = "" }: { r: Review; className?: string }) {
  return (
    <span className={className}>
      {r.rating ? (
        <>
          <span className="stars" aria-label={`${r.rating} out of 5 stars on ${r.platform}`}>
            {"★".repeat(r.rating)}
          </span>{" "}
          <span aria-hidden="true">{r.platform}</span>
        </>
      ) : (
        <>Recommends on {r.platform}</>
      )}
    </span>
  );
}

/** A length class so long reviews set smaller and every quote fits its card whole. */
const size = (text: string) => (text.length < 95 ? "s" : text.length < 180 ? "m" : "l");
const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The reviews as stacked stories (Shaun's pick, round 6 of the walk-through, 7 Oct 2026):
 * five reviews, each on a large card beside a picture of what it is about, made for this
 * section from S&L's own stock photos (never the reviewer's own piece, and captioned so).
 * The cards pin under the header and stack as the page scrolls: each new card slides up over
 * the last, which settles back, smaller and darker, while the new picture eases out of a slow
 * zoom. One scroll listener writes two numbers per card (--e entering, --d buried); the rest
 * is CSS. Reduced motion: the cards still stack, nothing scales.
 */
export default function ReviewsStack({ stories }: { stories: Story[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = [...el.querySelectorAll<HTMLElement>(".rk-card")];
    let raf = 0;
    let pins: number[] = [];
    const measure = () => (pins = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0));
    const update = () => {
      raf = 0;
      const vh = innerHeight;
      // e: 0 while a card is below the screen, 1 once it has reached its pinned spot
      const e = cards.map((c, i) => Math.min(1, Math.max(0, (vh - c.getBoundingClientRect().top) / Math.max(1, vh - pins[i]))));
      cards.forEach((c, i) => {
        // d: how far this card is buried under the ones that came after it
        let d = 0;
        for (let j = i + 1; j < cards.length; j++) d += e[j];
        c.style.setProperty("--e", e[i].toFixed(3));
        c.style.setProperty("--d", Math.min(d, 3).toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const n = stories.length;
  return (
    <div ref={root} className="rk">
      {stories.map(({ review: r, image, caption }, i) => (
        <article key={r.id} className="rk-card" style={{ "--i": i } as CSSProperties} aria-label={`Review ${i + 1} of ${n}, from ${r.name}`}>
          <div className="rk-in">
            <div className="rk-photo">
              <Image src={image} alt="" fill sizes="(min-width: 900px) 44vw, 100vw" className="rk-img" />
              <span className="rk-caption">{caption}</span>
            </div>
            <figure className="rk-body">
              <p className="rk-no tnum" aria-hidden="true">
                {num(i)} <span>/ {num(n - 1)}</span>
              </p>
              <blockquote className="rk-quote" data-size={size(r.text)}>{r.text}</blockquote>
              <figcaption className="rk-cap">
                <span className="rk-name">{r.name}</span>
                <Source r={r} className="rk-src" />
              </figcaption>
            </figure>
          </div>
        </article>
      ))}
    </div>
  );
}
