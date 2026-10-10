"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CollTile } from "./data";

/**
 * Shop by collection, the display case (Shaun's pick C, 8 Oct 2026): the categories as one row
 * of trays to swipe across, like the shop's window, each a photo set in a dark tray with its
 * name and count under it. On a computer the row drags with the mouse, with arrows and a hairline
 * of progress too; a phone swipes it.
 */
export default function CollCase({ tiles }: { tiles: CollTile[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const on = () => setP(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
    on();
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, []);
  // Drag the row with the mouse (Shaun, 8 Oct 2026: "you should be able to just slide your mouse
  // rather than having to click the arrows"). Touch and trackpads already swipe it natively. A drag
  // glides on a little when let go, then settles on the nearest tray; a drag is never a click.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let down = false;
    let moved = false;
    let x0 = 0;
    let s0 = 0;
    let lastX = 0;
    let lastT = 0;
    let v = 0;
    let raf = 0;
    const settle = () => {
      const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
      const stops = [...el.children].map((li) => (li as HTMLElement).offsetLeft - pad);
      const near = stops.reduce((a, b) => (Math.abs(b - el.scrollLeft) < Math.abs(a - el.scrollLeft) ? b : a), 0);
      el.scrollTo({ left: near, behavior: reduced ? "auto" : "smooth" });
      window.setTimeout(() => el.classList.remove("is-drag"), reduced ? 0 : 450);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      cancelAnimationFrame(raf);
      down = true;
      moved = false;
      x0 = lastX = e.clientX;
      s0 = el.scrollLeft;
      lastT = e.timeStamp;
      v = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        el.classList.add("is-drag");
        el.setPointerCapture(e.pointerId);
      }
      if (!moved) return;
      el.scrollLeft = s0 - dx;
      v = (e.clientX - lastX) / Math.max(1, e.timeStamp - lastT);
      lastX = e.clientX;
      lastT = e.timeStamp;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (!moved) return;
      let vel = reduced ? 0 : -v * 16;
      const glide = () => {
        if (Math.abs(vel) < 0.6) return settle();
        el.scrollLeft += vel;
        vel *= 0.92;
        raf = requestAnimationFrame(glide);
      };
      glide();
    };
    // the click that ends a drag must not open the tray under the pointer
    const onClick = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);
  const step = (d: number) => {
    const el = rail.current;
    const card = el?.querySelector("li");
    if (el && card) el.scrollBy({ left: d * (card.getBoundingClientRect().width + 14), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <div className="clc">
      <ul ref={rail} className="clc-rail" aria-label="Collections">
        {tiles.map((t) => (
          <li key={t.slug}>
            <Link href={t.href} className={`clc-card${t.empty ? " is-empty" : ""}`} draggable={false}>
              <span className="clc-tray">
                <span className="clc-plate">
                  <Image src={t.image} alt="" fill sizes="(min-width: 768px) 300px, 60vw" className="clc-img" style={{ objectPosition: t.focus }} draggable={false} />
                </span>
              </span>
              <span className="clc-name">{t.title}</span>
              <span className="clc-count tnum">{t.empty ? "Ask what is in" : `${t.count} in the case`}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="clc-foot">
        <span className="clc-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${0.18 + p * 0.82})` }} />
        </span>
        <div className="clc-steps">
          <button type="button" className="clc-step" onClick={() => step(-1)} aria-label="Previous collections">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" className="clc-step" onClick={() => step(1)} aria-label="More collections">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
