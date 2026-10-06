"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

/**
 * Footer A (round 4 of Shaun's walk-through): the 21st.dev "Light Beam Footer with Giant
 * Wordmark" (21st.dev/@kedhareswer, beam-wordmark-footer, demo 35251) rebuilt in S&L's
 * theme: rich black, a slow gold shaft of light that leans toward the pointer and passes
 * behind the columns and through a giant "S&L JEWELLERS" cropped by the bottom edge, set
 * in the site's Archivo. The maths (fit, drift, approach, baseline) is the original's;
 * the styling lives in globals.css under .bwf. The beam only runs while the footer is
 * on screen, and holds still under reduced motion.
 */

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const fitSize = (at100: number, target: number, cap: number) => (at100 > 0 && target > 0 ? Math.min((100 * target) / at100, cap) : 0);
const beamTarget = (u: number) => 30 + 52 * clamp(Number.isFinite(u) ? u : 0.5, 0, 1);
const drift = (t: number) => 58 + 9 * (0.7 * Math.sin(t * 0.21) + 0.3 * Math.sin(t * 0.077 + 1.3));
const approach = (from: number, to: number, k: number, dt: number) => to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60);
/** Where the baseline sits in a line-height: 1 box, as a fraction of the font size (from the font's own metrics). */
const baselineOf = (el: HTMLElement) => {
  try {
    const cs = getComputedStyle(el);
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return 0.8;
    ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
    const m = ctx.measureText(el.textContent || "S");
    const a = m.fontBoundingBoxAscent;
    const d = m.fontBoundingBoxDescent;
    return a > 0 && d >= 0 ? clamp(((100 - a - d) / 2 + a) / 100, 0.5, 1.2) : 0.8;
  } catch {
    return 0.8;
  }
};
/** How far below the baseline the bottom edge cuts the wordmark, in em (negative cuts into the letters). */
const CUT = -0.06;

export default function FooterBeam({ word, top, columns }: { word: string; top: ReactNode; columns: ReactNode }) {
  const letters = useMemo(() => Array.from(word), [word]);
  const rootRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const ptr = useRef({ u: 0.5, x: 0, y: 0, inside: false });
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Fit the wordmark to the width, then tell each letter where it sits in the footer so
  // its slice of the beam lines up with the backdrop.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;
    let frame = 0;
    const place = () => {
      const r = root.getBoundingClientRect();
      root.style.setProperty("--bwf-rw", r.width + "px");
      root.style.setProperty("--bwf-rh", r.height + "px");
      let top = 0;
      inner.querySelectorAll<HTMLElement>(".bwf-l").forEach((s, i) => {
        let x = 0;
        let y = 0;
        let el: HTMLElement | null = s;
        while (el && el !== root) {
          x += el.offsetLeft;
          y += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        s.style.setProperty("--bwf-x", x + "px");
        s.style.setProperty("--bwf-y", y + "px");
        if (i === 0) top = y;
      });
      root.style.setProperty("--bwf-top", top + "px");
      root.style.setProperty("--bwf-bot", top + (parseFloat(inner.style.fontSize) || 0) * 0.92 + "px");
    };
    const fit = () => {
      const box = inner.parentElement!;
      const pad = parseFloat(getComputedStyle(box).paddingLeft) || 0;
      const target = box.clientWidth - pad * 2;
      inner.style.fontSize = "100px";
      const next = fitSize(inner.offsetWidth, target, target * 0.42);
      inner.style.fontSize = next + "px";
      if (wordRef.current) wordRef.current.style.height = Math.max(0, next * (baselineOf(inner) + CUT)) + "px";
      place();
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    fit();
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    let alive = true;
    document.fonts?.ready.then(() => alive && schedule());
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [word]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.12 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const set = (b: number, px: number, py: number, g: number) => {
      root.style.setProperty("--bwf-b", b.toFixed(2) + "%");
      root.style.setProperty("--bwf-px", px.toFixed(1) + "px");
      root.style.setProperty("--bwf-py", py.toFixed(1) + "px");
      root.style.setProperty("--bwf-g", g.toFixed(3));
    };
    if (reduced || !visible) {
      const p = ptr.current;
      set(58, p.x, p.y, 0);
      return;
    }
    let raf = 0;
    let last = performance.now();
    let t = last / 1000;
    let b = 58;
    let px = ptr.current.x;
    let py = ptr.current.y;
    let g = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      t += dt;
      const p = ptr.current;
      const idle = drift(t);
      b = approach(b, p.inside ? beamTarget(p.u) * 0.75 + idle * 0.25 : idle, 0.035, dt);
      px = approach(px, p.x, 0.16, dt);
      py = approach(py, p.y, 0.16, dt);
      g = approach(g, p.inside ? 1 : 0, 0.06, dt);
      set(b, px, py, g);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, visible]);

  const onPointer = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const p = ptr.current;
    p.x = e.clientX - r.left;
    p.y = e.clientY - r.top;
    p.u = r.width ? p.x / r.width : 0.5;
    p.inside = e.type !== "pointerleave";
  };

  return (
    <footer ref={rootRef} className="bwf" data-in={seen ? "true" : "false"} onPointerMove={onPointer} onPointerEnter={onPointer} onPointerLeave={onPointer}>
      <div className="bwf-sky" aria-hidden="true">
        <div className="bwf-wash" />
        <div className="bwf-bands" />
        <div className="bwf-beam" />
        <div className="bwf-glow" />
      </div>
      <div className="bwf-rule" aria-hidden="true" />
      <div className="bwf-inner">
        <div className="bwf-col bwf-fade">{top}</div>
        {columns}
      </div>
      <div ref={wordRef} className="bwf-word" aria-hidden="true">
        <div className="bwf-word-box">
          <span ref={innerRef} className="bwf-word-in">
            {letters.map((ch, i) => (
              <span key={i} className="bwf-lw" style={{ "--bwf-d": 120 + i * 45 + "ms" } as CSSProperties}>
                <span className="bwf-l">{ch === " " ? " " : ch}</span>
              </span>
            ))}
          </span>
        </div>
        <div className="bwf-foot" />
      </div>
    </footer>
  );
}
