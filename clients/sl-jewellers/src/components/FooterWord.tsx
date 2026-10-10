"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * The name at the very foot of every page (Shaun's pick, 8 Oct 2026: "cropped and rising").
 * Plain white Archivo set the full width of the page and cut off by the bottom edge, so the
 * page ends on the name; as it comes into view the letters rise one after another from behind
 * that edge. Gold only on the ampersand. On a phone the name breaks after "S&L" so it can be
 * set larger. Decoration (aria-hidden): the footer names the shop in its links and legal lines.
 */
const WORDS = [["S", "&", "L"], ["J", "E", "W", "E", "L", "L", "E", "R", "S"]];

export default function FooterWord() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let i = 0;
  return (
    <div ref={ref} className="fwR" aria-hidden="true">
      <p>
        {WORDS.map((w, wi) => (
          <span key={wi} className="fwR-w">
            {w.map((ch, ci) => (
              <span key={ci} className={ch === "&" ? "fwR-l fw-amp" : "fwR-l"} style={{ "--i": i++ } as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  );
}
