"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion, subscribe } from "@/lib/scroll-ticker";

/**
 * The case studies' pinned background, as Neiden's (measured 2026-09-30):
 * one full-screen layer that stays put while the projects scroll over it,
 * holding every project's picture lightly blurred (8px, scaled 1.2), and
 * cross-fading to the picture of whichever project is centred on screen.
 *
 * It also writes each project block's distance from the viewport centre, as
 * a fraction of the viewport (`--dn`, 0 when centred, -1 a screen below, +1 a
 * screen above), so CSS can zoom the picture in as it arrives and drift it
 * as it leaves (`.cs-frame-img`). Reduced motion: no ticker, `--dn` unset,
 * pictures still; the background simply shows the first project.
 *
 * Over a picture, fine pointers get the hero's ring-and-dot cursor, eased
 * after the pointer (Brad, 2026-09-30: no "View project" disc; one cursor
 * across the site); the native cursor is hidden there. Touch screens never see it. Under reduced motion
 * it still appears, but sits on the pointer without easing after it.
 */
export function CaseStudiesBackdrop({ images, children }: { images: string[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-cs]"));
    let current = 0;
    return subscribe(({ vh }) => {
      let best = 0;
      let bestDist = Infinity;
      blocks.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = vh / 2 - (r.top + r.height / 2);
        const dn = (d / vh).toFixed(4);
        if (el.style.getPropertyValue("--dn") !== dn) el.style.setProperty("--dn", dn);
        if (Math.abs(d) < bestDist) {
          bestDist = Math.abs(d);
          best = i;
        }
      });
      if (best !== current) setActive((current = best));
    });
  }, []);

  // The hero's ring cursor, eased after the pointer while over a picture.
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    const disc = cursorRef.current;
    if (!root || !disc || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const still = prefersReducedMotion();
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const paint = () => {
      x += (tx - x) * (still ? 1 : 0.22);
      y += (ty - y) * (still ? 1 : 0.22);
      disc.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(paint) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const over = (e.target as Element).closest("[data-cs-frame]");
      if (!over) {
        delete disc.dataset.on;
        return;
      }
      tx = e.clientX;
      ty = e.clientY;
      if (!disc.dataset.on) {
        x = tx;
        y = ty;
        disc.dataset.on = "";
      }
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => delete disc.dataset.on;
    // Scrolling moves the pictures under a still pointer: re-check what is
    // under it rather than hiding the disc until the mouse moves again.
    const onScroll = () => {
      if (disc.dataset.on !== undefined && !document.elementFromPoint(tx, ty)?.closest("[data-cs-frame]")) onLeave();
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    // overflow: clip (never hidden, which would break the sticky layer): the
    // pinned background's negative margin let it run a full screen past the
    // last project, over the next section (Brad, 2026-09-30).
    <div ref={ref} className="relative overflow-clip">
      {/* The hero's own cursor (ring + dot, `.plexus-ring*`), no words:
          one cursor across the site (Brad, 2026-09-30). */}
      <div ref={cursorRef} aria-hidden="true" className="plexus-ring pointer-events-none fixed left-0 top-0 z-50 mix-blend-difference">
        <span className="plexus-ring-circle" />
        <span className="plexus-ring-dot" />
      </div>
      <div aria-hidden="true" className="sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden">
        {/* Blurred 8px, so a small variant looks identical: 25vw fetches a
            ~640px file instead of the full-width one (2026-10-02). */}
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="25vw"
            className={`scale-[1.2] object-cover blur-[8px] transition-opacity duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/45" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
