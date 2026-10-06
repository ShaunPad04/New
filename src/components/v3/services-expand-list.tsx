"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

export type ExpandItem = { id: string; index: string; title: string; summary: string; href: string; img: string | null };

const EASE = "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

/**
 * The services on the homepage: one ruled row each, NOTHING EVER CHANGES
 * SIZE (Brad, 2026-10-06: "it's so glitchy ... it instantly changes", "a
 * massive gap between ... web design and build and ... bespoke sites
 * designed in-house", "the images also shouldn't be in that position").
 *
 * The old list opened a row on hover: its line was pinned to the foot of a
 * 264px picture inside the row (the gap), and as one row grew and the row
 * above shut, the list jumped under the pointer, which then sat on a
 * different row and opened that (the glitch). Now every row is always the
 * same height and always shows its name and line:
 *  - desktop: index | name | line | arrow. Hovering a row rolls its name up
 *    (the menu's and the header's roll), lifts its line, fills and turns its
 *    arrow, turns its index red and dims the other rows. All transform,
 *    opacity and colour; no layout moves, so scrolling under a resting
 *    pointer costs nothing (the 2026-10-04 slowdown cannot come back).
 *  - the still follows the pointer BEHIND the words (fine pointers only),
 *    eased, cross-fading from service to service; it re-reads the list's
 *    position each frame, so it stays under the pointer while the page
 *    scrolls. Decorative, aria-hidden.
 *  - phones and touch: the line under the name with the still beside it,
 *    the whole row one link.
 * Reduced motion keeps the colours and dimming, without the roll, the lift
 * or the easing of the still.
 */
export function ExpandList({ items }: { items: ExpandItem[] }) {
  const list = useRef<HTMLUListElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // The still's position: the pointer (viewport coordinates) eased into
  // place relative to the list, every frame while a row is hovered.
  const pointer = useRef({ x: 0, y: 0 });
  const pos = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = list.current;
    const c = card.current;
    if (active === null || !el || !c) return;
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const r = el.getBoundingClientRect();
      // Kept to the middle of the list, so it sits behind the names, not over the lines.
      const w = c.offsetWidth;
      const tx = Math.min(Math.max(pointer.current.x - r.left, w * 0.5 + r.width * 0.12), r.width * 0.58 - w * 0.5);
      const h = c.offsetHeight;
      const ty = Math.min(Math.max(pointer.current.y - r.top, h / 2), r.height - h / 2);
      const p = (pos.current ??= { x: tx, y: ty });
      const k = instant ? 1 : 0.16;
      p.x += (tx - p.x) * k;
      p.y += (ty - p.y) * k;
      c.style.transform = `translate3d(${p.x - w / 2}px, ${p.y - h / 2}px, 0)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  const track = (e: ReactPointerEvent) => {
    pointer.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <ul
      ref={list}
      onPointerMove={(e) => e.pointerType === "mouse" && track(e)}
      onPointerLeave={() => {
        setActive(null);
        pos.current = null;
      }}
      className="group/list relative isolate mt-14 border-t border-ink-300"
    >
      {/* The still behind the words, following the pointer. */}
      <div
        ref={card}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 -z-10 hidden aspect-[4/3] w-[20rem] overflow-hidden transition-[opacity,scale] lg:pointer-fine:block xl:w-[22rem] ${EASE} ${active === null ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
      >
        {items.map((s, i) =>
          s.img ? (
            <Image
              key={s.id}
              src={s.img}
              alt=""
              fill
              sizes="22rem"
              className={`object-cover grayscale transition-[opacity,scale] ${EASE} ${active === i ? "scale-100 opacity-70" : "scale-110 opacity-0"}`}
            />
          ) : null,
        )}
      </div>

      {items.map((s, i) => (
        <li
          key={s.id}
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            track(e);
            setActive(i);
          }}
          className={`border-b border-ink-300 transition-opacity ${EASE} lg:group-hover/list:opacity-35 lg:hover:opacity-100!`}
        >
          <Link
            href={s.href}
            className="group/row grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 py-6 [grid-template-areas:'i_t_a'_'._s_s'] lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,26rem)_3.5rem] lg:gap-x-10 lg:py-8 lg:[grid-template-areas:'i_t_s_a']"
          >
            <span
              className={`[grid-area:i] font-[family-name:var(--font-cal-ui)] text-[1.25rem] tabular-nums text-ink-600 transition-colors lg:text-[1.75rem] group-hover/row:text-accent group-focus-visible/row:text-accent ${EASE}`}
            >
              {s.index}
            </span>

            {/* The name rolls up to a white copy on hover. */}
            <h3 className="[grid-area:t] text-[clamp(1.5rem,3.4vw,3rem)] font-semibold uppercase leading-[0.95] tracking-[-0.045em] text-ink-1000">
              <span className="relative block overflow-hidden">
                <span className={`block transition-transform group-hover/row:-translate-y-full group-focus-visible/row:-translate-y-full ${EASE}`}>{s.title}</span>
                <span aria-hidden="true" className={`absolute inset-x-0 top-0 block translate-y-full text-ink-1000 transition-transform group-hover/row:translate-y-0 group-focus-visible/row:translate-y-0 ${EASE}`}>
                  {s.title}
                </span>
              </span>
            </h3>

            {/* The line: beside the name on desktop, lifting a touch on hover;
                under it on phones, with the still beside it. */}
            <div className="[grid-area:s] flex items-center gap-4">
              <p
                className={`flex-1 text-[0.9375rem] leading-relaxed text-ink-700 transition-[color,translate] lg:translate-y-1.5 lg:text-[1rem] group-hover/row:translate-y-0 group-hover/row:text-ink-900 ${EASE}`}
              >
                {s.summary}
              </p>
              {s.img ? (
                <span aria-hidden="true" className="relative aspect-[4/3] w-[5.5rem] shrink-0 overflow-hidden lg:hidden">
                  <Image src={s.img} alt="" fill sizes="5.5rem" className="object-cover grayscale" />
                </span>
              ) : null}
            </div>

            <span
              aria-hidden="true"
              className={`[grid-area:a] grid size-11 place-items-center justify-self-end rounded-full border border-ink-500 text-ink-1000 transition-[rotate,background-color,color,border-color] lg:size-14 group-hover/row:-rotate-45 group-hover/row:border-ink-1000 group-hover/row:bg-ink-1000 group-hover/row:text-ink-0 group-focus-visible/row:-rotate-45 group-focus-visible/row:bg-ink-1000 group-focus-visible/row:text-ink-0 ${EASE}`}
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
