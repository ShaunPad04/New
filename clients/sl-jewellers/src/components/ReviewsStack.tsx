"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
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
 * From 768px the cards pin under the header and stack as the page scrolls: each new card
 * slides up over the last, which settles back, smaller and darker, while the new picture
 * eases out of a slow zoom. One scroll listener writes two numbers per card (--e entering,
 * --d buried); the rest is CSS. Reduced motion: the cards still stack, nothing scales.
 *
 * On a phone the same cards sit in a row to swipe across instead, with a bar for how far
 * along you are (Shaun, 8 Oct 2026: "why is this glitching ... for mobile"). Five sticky
 * cards each most of a phone's height, sliding over one another with a filter on each,
 * read as a glitch on a small screen and cost five screens of scrolling; a swipe row is
 * how the rest of the page already moves sideways on a phone (the trays, the services).
 */
const WIDE = "(min-width: 768px)";

export default function ReviewsStack({ stories }: { stories: Story[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  // wide screens: the stacking cards
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wide = matchMedia(WIDE);
    const cards = [...el.querySelectorAll<HTMLElement>(".rk-card")];
    let raf = 0;
    let pins: number[] = [];
    let on = false;
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
    const start = () => {
      if (on) return;
      on = true;
      measure();
      update();
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onResize);
    };
    const stop = () => {
      if (!on) return;
      on = false;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      raf = 0;
      cards.forEach((c) => (c.style.removeProperty("--e"), c.style.removeProperty("--d")));
    };
    const sync = () => (wide.matches ? start() : stop());
    sync();
    wide.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      stop();
    };
  }, []);

  // phones: how far along the row has been swiped
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = el.scrollWidth - el.clientWidth;
      setP(max > 0 ? el.scrollLeft / max : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const n = stories.length;
  return (
    <>
      <div ref={root} className="rk" role="region" aria-label="Reviews" tabIndex={0}>
        {stories.map(({ review: r, image, caption }, i) => (
          <article key={r.id} className="rk-card" style={{ "--i": i } as CSSProperties} aria-label={`Review ${i + 1} of ${n}, from ${r.name}`}>
            <div className="rk-in">
              <div className="rk-photo">
                <Image src={image} alt="" fill sizes="(min-width: 900px) 44vw, 86vw" className="rk-img" />
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
      {/* phones only: how far along the row you are */}
      <span className="rk-bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${(1 + p * (n - 1)) / n})` }} />
      </span>
    </>
  );
}
