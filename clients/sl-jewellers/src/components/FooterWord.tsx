"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * The name at the foot of the footer, three ways while Shaun picks (?v=fword:a|b|c; 8 Oct 2026,
 * "i like the font but i dont like the genericness" of the plain white full-width name). The
 * same face, Archivo, in each:
 *   A  Struck: the name pressed into the black like a stamp, lit gold only where a light passes
 *      (the pointer on a computer; a slow drift on a phone).
 *   B  In gold: the letters filled with S&L's own Cuban chain, the links sliding slowly through
 *      them; the ampersand in white.
 *   C  Hallmark: the name set as the punches on a piece of gold (maker's mark, the crown, the
 *      trade, the town), struck one after another as they come into view.
 * All three are decoration (aria-hidden): the footer names the shop in its links and legal lines.
 */
export default function FooterWord() {
  const lit = useRef<HTMLDivElement>(null);
  const marks = useRef<HTMLDivElement>(null);

  // A: the light follows the pointer across the name. Touch screens and reduced motion keep the
  // CSS drift (or a still light), so nothing here runs for them.
  useEffect(() => {
    const el = lit.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const zone = el.closest("footer") ?? el;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(2)}%`);
        el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(2)}%`);
      });
    };
    zone.addEventListener("pointermove", move as EventListener);
    return () => {
      cancelAnimationFrame(raf);
      zone.removeEventListener("pointermove", move as EventListener);
    };
  }, []);

  // C: strike the punches once the row comes into view.
  useEffect(() => {
    const el = marks.current;
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
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const name = (
    <>
      S<span className="fw-amp">&amp;</span>L Jewellers
    </>
  );

  return (
    <>
      {/* A · Struck */}
      <div data-x="fword" data-x-dir="a">
        <div ref={lit} className="fwA" aria-hidden="true">
          <p className="fwA-base">{name}</p>
          <p className="fwA-lit">{name}</p>
        </div>
      </div>

      {/* B · In gold */}
      <div data-x="fword" data-x-dir="b">
        <p className="fwB" aria-hidden="true">
          <span className="fwB-g">S</span>
          <span className="fwB-amp">&amp;</span>
          <span className="fwB-g">L Jewellers</span>
        </p>
      </div>

      {/* C · Hallmark */}
      <div data-x="fword" data-x-dir="c">
        <div ref={marks} className="fwC" aria-hidden="true">
          <span className="fwC-p fwC-shield" style={{ "--i": 0 } as CSSProperties}>
            <span className="fwC-t is-gold">S&amp;L</span>
          </span>
          <span className="fwC-p fwC-round" style={{ "--i": 1 } as CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" alt="" width={64} height={64} className="fwC-crown" />
          </span>
          <span className="fwC-p fwC-rect" style={{ "--i": 2 } as CSSProperties}>
            <span className="fwC-t">Jewellers</span>
          </span>
          <span className="fwC-p fwC-oval" style={{ "--i": 3 } as CSSProperties}>
            <span className="fwC-t">Cleethorpes</span>
          </span>
        </div>
      </div>
    </>
  );
}
