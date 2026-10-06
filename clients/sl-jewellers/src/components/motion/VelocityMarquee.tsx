"use client";

import { Fragment, useEffect, useRef } from "react";

/**
 * Two rows of large type drifting in opposite directions, faster the faster the page is
 * scrolled, and turning round when the scroll does (after "Scroll Based Velocity" by
 * Magic UI on 21st.dev, rebuilt without a motion runtime: one rAF loop, transforms only).
 * The first row is solid, the second outlined; gold diamonds sit between phrases.
 *
 * The loop only runs while the band is on screen and the tab is visible. Under reduced
 * motion nothing moves and only the first row shows. Screen readers get the phrases once,
 * as a list; the moving rows are hidden from them.
 */
const COPIES = 4;
/** Resting drift in px per second. */
const SPEED = 36;
/** Extra speed per 1000 px/s of scroll: the original maps scroll velocity 0..1000 to 0..5. */
const BOOST = 4;

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export default function VelocityMarquee({ items, label }: { items: string[]; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rows = tracks.current.filter(Boolean) as HTMLDivElement[];
    const seq = rows.map((r) => (r.firstElementChild as HTMLElement | null)?.offsetWidth || 1);
    const x = rows.map((_, i) => (i % 2 ? -seq[i] / 2 : 0));
    let dir = 1;
    let smooth = 0;
    let lastY = scrollY;
    let lastT = performance.now();
    let raf = 0;
    let onScreen = false;

    const tick = (t: number) => {
      raf = 0;
      const dt = Math.min(64, t - lastT) || 16;
      lastT = t;
      const y = scrollY;
      const v = ((y - lastY) / dt) * 1000;
      lastY = y;
      smooth += (v - smooth) * 0.14;
      const factor = (smooth / 1000) * BOOST;
      if (factor < -0.01) dir = -1;
      else if (factor > 0.01) dir = 1;
      rows.forEach((r, i) => {
        const base = (i % 2 ? -1 : 1) * SPEED;
        let move = dir * base * (dt / 1000);
        move += dir * move * factor;
        x[i] += move;
        r.style.transform = `translate3d(${wrap(-seq[i], 0, -x[i]).toFixed(2)}px, 0, 0)`;
      });
      if (onScreen && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf && onScreen && !document.hidden) {
        lastT = performance.now();
        lastY = scrollY;
        raf = requestAnimationFrame(tick);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      start();
    });
    io.observe(el);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => rows.forEach((r, i) => (seq[i] = (r.firstElementChild as HTMLElement | null)?.offsetWidth || seq[i]));
    addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const sequence = (
    <span className="vm-seq">
      {items.map((t) => (
        <Fragment key={t}>
          <span className="vm-item">{t}</span>
          <span className="vm-dot" />
        </Fragment>
      ))}
    </span>
  );

  return (
    <div ref={root} className="vm on-black" role="region" aria-label={label}>
      <ul className="sr-only">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {[0, 1].map((row) => (
        <div key={row} className={`vm-row ${row ? "vm-outline" : ""}`} aria-hidden="true">
          <div ref={(n) => void (tracks.current[row] = n)} className="vm-track">
            {Array.from({ length: COPIES }, (_, i) => (
              <Fragment key={i}>{sequence}</Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
