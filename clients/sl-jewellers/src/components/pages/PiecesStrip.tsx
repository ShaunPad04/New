"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { countLine, num2, type CategoryCard } from "./pieces-format";

/**
 * /pieces B, "Film strip" (round 7, 7 Oct 2026; after Framer's pinned horizontal galleries):
 * the section pins and the page's scroll slides a row of tall category frames sideways, with
 * a gold progress line under them. One scroll listener sets the offset (--x) and the
 * progress (--p). Phones, and reduced motion: an ordinary row you swipe, snapping to a frame.
 */
export default function PiecesStrip({ cards }: { cards: CategoryCard[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mq = matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let travel = 0;
    const measure = () => {
      if (!mq.matches) {
        el.style.height = "";
        el.style.removeProperty("--x");
        return;
      }
      travel = Math.max(0, tr.scrollWidth - tr.clientWidth);
      el.style.height = `${travel + innerHeight}px`;
    };
    const update = () => {
      raf = 0;
      if (!mq.matches) return;
      const top = el.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -top / Math.max(1, travel)));
      el.style.setProperty("--x", `${(-p * travel).toFixed(1)}px`);
      el.style.setProperty("--p", p.toFixed(3));
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
    mq.addEventListener("change", onResize);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      mq.removeEventListener("change", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className="pxb">
      <div className="pxb-pin">
        <ul ref={track} className="pxb-track" aria-label="Categories">
          {cards.map((c, i) => (
            <li key={c.slug} className="pxb-item">
              <Link href={`/pieces/${c.slug}`} className="pxb-card">
                {c.image && <Image src={c.image} alt="" fill sizes="(min-width: 900px) 32vw, 78vw" className="pxb-img" style={{ objectPosition: c.focus }} />}
                <span className="pxb-num tnum" aria-hidden="true">{num2(i)}</span>
                <span className="pxb-cap">
                  <span className="pxb-name">{c.title}</span>
                  <span className="pxb-count">{countLine(c.count)} →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="wrap pxb-foot" aria-hidden="true">
          <span className="pxb-bar"><span /></span>
          <span className="pxb-hint">Scroll</span>
        </div>
      </div>
    </div>
  );
}
