"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PUBLISHED_REVIEWS, REVIEWS, type Review } from "@/lib/content";

/**
 * A carousel of S&L's reviews above the footer on every page but the home page, which keeps its
 * stacked stories (Shaun, 7 Oct 2026: "keep the home page testimonials as it is, but for the
 * other pages ... the carousel for the reviews"). Every quote is word for word from Google or
 * Facebook (content/reviews.json). Three ways on the switch, ?v=rv:a|b|c:
 *   A  Rail: the cards drift past on a loop and stop under the pointer.
 *   B  One at a time: a single quote, arrows and a count, moving on by itself every few seconds.
 *   C  Cards: a row that snaps card by card, arrows and a count.
 */
const g = REVIEWS.google;
const fb = REVIEWS.facebook;
const HIDE = ["/", "/privacy"];

function Source({ r }: { r: Review }) {
  return r.rating ? (
    <>
      <span className="stars" aria-label={`${r.rating} out of 5 stars on ${r.platform}`}>
        {"★".repeat(r.rating)}
      </span>{" "}
      <span aria-hidden="true">{r.platform}</span>
    </>
  ) : (
    <>Recommends on {r.platform}</>
  );
}

function Card({ r, className = "" }: { r: Review; className?: string }) {
  return (
    <figure className={`rvx-card ${className}`}>
      <p className="rvx-src">
        <Source r={r} />
      </p>
      <blockquote className="rvx-q">&ldquo;{r.text}&rdquo;</blockquote>
      <figcaption className="rvx-who">
        {r.name}
        {r.date && <span> · {r.date}</span>}
      </figcaption>
    </figure>
  );
}

function Head({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <div className="rvx-head">
      <div>
        <p className="eyebrow">Reviews</p>
        <h2 id={id} className="rvx-title">
          Fifty-nine recommendations. <span className="text-gold">Not one against.</span>
        </h2>
        <p className="rvx-figs tnum">
          <a href={g.url} target="_blank" rel="noopener">{g.rating.toFixed(1)} on Google</a>
          <span aria-hidden="true">·</span>
          <a href={fb.url} target="_blank" rel="noopener">{fb.recommendPercent}% recommend on Facebook ({fb.reviewCount})</a>
        </p>
      </div>
      {children}
    </div>
  );
}

const Chevron = ({ back = false }: { back?: boolean }) => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" style={back ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* A · Rail */
function Rail() {
  const list = PUBLISHED_REVIEWS;
  return (
    <section className="rvx rvx-a" aria-labelledby="rvx-a-t">
      <div className="wrap">
        <Head id="rvx-a-t" />
      </div>
      <div className="rva-track" tabIndex={0} aria-label="Reviews, scrolling">
        <div className="rva-belt">
          {[...list, ...list].map((r, i) => (
            <Card key={`${r.id}-${i}`} r={r} className="rva-card" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* B · One at a time */
function Single() {
  const list = PUBLISHED_REVIEWS;
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const go = useCallback((d: number) => setI((x) => (x + d + list.length) % list.length), [list.length]);
  useEffect(() => {
    if (hold || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => go(1), 7000);
    return () => window.clearTimeout(id);
  }, [i, hold, go]);
  const r = list[i];
  return (
    <section className="rvx rvx-b" aria-labelledby="rvx-b-t" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="wrap rvb-in">
        <Head id="rvx-b-t" />
        <div className="rvb-stage" aria-live="polite">
          <figure key={r.id} className="rvb-quote">
            <p className="rvx-src">
              <Source r={r} />
            </p>
            <blockquote>&ldquo;{r.text}&rdquo;</blockquote>
            <figcaption className="rvx-who">
              {r.name}
              {r.date && <span> · {r.date}</span>}
            </figcaption>
          </figure>
          <div className="rvb-ctrl">
            <span className="tnum rvx-count">
              {String(i + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </span>
            <span className="rvb-bar" aria-hidden="true">
              <span key={`${i}-${hold}`} className={hold ? "" : "is-run"} />
            </span>
            <button type="button" className="rvx-arrow" onClick={() => go(-1)} aria-label="Previous review">
              <Chevron back />
            </button>
            <button type="button" className="rvx-arrow" onClick={() => go(1)} aria-label="Next review">
              <Chevron />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* C · Cards */
function Cards() {
  const list = PUBLISHED_REVIEWS;
  const row = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const step = (d: number) => {
    const el = row.current;
    const card = el?.querySelector<HTMLElement>(".rvc-card");
    if (!el || !card) return;
    el.scrollBy({ left: d * (card.offsetWidth + 14), behavior: "smooth" });
  };
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const on = () => {
      const card = el.querySelector<HTMLElement>(".rvc-card");
      if (card) setAt(Math.round(el.scrollLeft / (card.offsetWidth + 14)));
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, []);
  return (
    <section className="rvx rvx-c" aria-labelledby="rvx-c-t">
      <div className="wrap">
        <Head id="rvx-c-t">
          <div className="rvc-ctrl">
            <span className="tnum rvx-count">
              {String(Math.min(at + 1, list.length)).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </span>
            <button type="button" className="rvx-arrow" onClick={() => step(-1)} aria-label="Previous reviews">
              <Chevron back />
            </button>
            <button type="button" className="rvx-arrow" onClick={() => step(1)} aria-label="More reviews">
              <Chevron />
            </button>
          </div>
        </Head>
        <div ref={row} className="rvc-row" tabIndex={0} aria-label="Reviews">
          {list.map((r) => (
            <Card key={r.id} r={r} className="rvc-card" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ReviewsBand() {
  const path = usePathname();
  if (HIDE.includes(path)) return null;
  return (
    <>
      <div data-x="rv" data-x-dir="a">
        <Rail />
      </div>
      <div data-x="rv" data-x-dir="b">
        <Single />
      </div>
      <div data-x="rv" data-x-dir="c">
        <Cards />
      </div>
    </>
  );
}
