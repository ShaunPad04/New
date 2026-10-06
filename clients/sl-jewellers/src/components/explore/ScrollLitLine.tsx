"use client";

import { useEffect, useRef } from "react";

/**
 * Marquee C, "Scroll-lit line" (round 2): one oversized statement in S&L's own words that
 * lights up word by word as it scrolls through the screen (21st "Text Scroll Read"). One
 * scroll listener writes the progress to --p; each word's opacity follows from its index
 * in CSS. Reduced motion shows it fully lit.
 */
const TEXT = "We buy *gold*, precious metals and *watches*. Weighed and priced in front of you. No middle men, no waffle.";

export default function ScrollLitLine() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el?.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      // 0 when the line's top reaches 85% of the screen, 1 when its bottom passes 40%
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.45);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const words = TEXT.split(" ");
  return (
    <section className="lit on-black" aria-label="What the shop does">
      <div className="wrap">
        <p ref={ref} className="lit-line" style={{ ["--n" as string]: words.length }} aria-label={TEXT.replace(/\*/g, "")}>
          {words.map((w, i) => (
            <span key={i} aria-hidden="true" className={w.includes("*") ? "lit-w lit-gold" : "lit-w"} style={{ ["--i" as string]: i }}>
              {w.replace(/\*/g, "")}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
