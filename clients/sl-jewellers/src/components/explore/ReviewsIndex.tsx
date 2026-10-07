"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Review } from "@/lib/content";
import { Source, num, size } from "./reviews-shared";

const STEP = 8000;

/**
 * Reviews A, "The index" (6 Oct 2026, after Shaun called the spotlight generic): set like a
 * magazine's letters page. One review at a time, large, its words resolving out of a blur;
 * beside it an index of everyone who wrote, numbered, with a gold line drawing under the one
 * being read. Choose a name to read it; otherwise it moves on every 8 s while on screen,
 * pausing on hover and focus. On phones the index becomes a strip of names under the quote.
 * Reduced motion: no blur, no auto-advance.
 */
export default function ReviewsIndex({ reviews }: { reviews: Review[] }) {
  const n = reviews.length;
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduce, setReduce] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = inView && !hold && !reduce;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), STEP);
    return () => clearTimeout(t);
  }, [i, running, n]);

  // Keep the active name in view on the phone strip without scrolling the page.
  useEffect(() => {
    const ol = list.current;
    const li = ol?.children[i] as HTMLElement | undefined;
    if (!ol || !li || ol.scrollWidth <= ol.clientWidth) return;
    ol.scrollTo({ left: li.offsetLeft - (ol.clientWidth - li.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  }, [i, reduce]);

  const pick = useCallback((k: number) => setI(k), []);
  const r = reviews[i];
  const words = r.text.split(/\s+/).filter(Boolean);

  return (
    <div
      ref={root}
      className="ri"
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !root.current?.contains(e.relatedTarget as Node) && setHold(false)}
    >
      <figure className="ri-stage" key={r.id} aria-live={running ? "off" : "polite"}>
        <p className="ri-no tnum" aria-hidden="true">
          <span className="ri-no-i">{num(i)}</span>
          <span className="ri-no-n">/ {num(n - 1)}</span>
        </p>
        <blockquote className="ri-quote" data-size={size(r.text)}>
          {words.map((w, k) => (
            <Fragment key={k}>
              <span className="ri-w" style={{ "--k": k } as CSSProperties}>{w}</span>{" "}
            </Fragment>
          ))}
        </blockquote>
        <figcaption className="ri-cap">
          <span className="ri-name">{r.name}</span>
          <Source r={r} className="ri-src" />
        </figcaption>
      </figure>

      <nav className="ri-nav" aria-label="Choose a review">
        <ol ref={list} className="ri-index">
          {reviews.map((x, k) => (
            <li key={x.id}>
              <button
                type="button"
                className={`ri-row${k === i ? " is-on" : ""}${k === i && running ? " is-run" : ""}`}
                style={k === i ? ({ "--step": `${STEP}ms` } as CSSProperties) : undefined}
                aria-current={k === i ? "true" : undefined}
                onClick={() => pick(k)}
              >
                <span className="ri-row-n tnum" aria-hidden="true">{num(k)}</span>
                <span className="ri-row-name">{x.name}</span>
                <span className="ri-row-p" aria-hidden="true">{x.platform}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
