"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export type ExpandItem = { id: string; index: string; title: string; summary: string; href: string; img: string | null };

/**
 * The services as an expanding list (Brad, 2026-10-02, after the "Expand
 * OnHover List" idea on the Framer marketplace; rebuilt here, nothing
 * copied). One row is open at a time: hovering or focusing a row opens it
 * and shows its line and its still; the rest stay a single line, so six
 * services fit in about a screen. On touch, the first tap opens a row and
 * the "View service" link inside it navigates. The first row starts open.
 * Under reduced motion the rows still open, without the travel.
 */
export function ExpandList({ items }: { items: ExpandItem[] }) {
  const [open, setOpen] = useState(0);
  // Was the row already open when the press began? Focus and the synthetic
  // hover a tap fires both open the row BEFORE its click, so the click alone
  // cannot tell a first tap from a second one.
  const openAtPress = useRef<boolean | null>(null);
  const ease = "duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

  return (
    <ul className="mt-14 border-t border-ink-300">
      {items.map((s, i) => {
        const on = open === i;
        return (
          <li
            key={s.id}
            className="border-b border-ink-300"
            // Mouse only: a touch tap fires a synthetic hover first, which
            // opened the row and let the same tap navigate away.
            onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
            onFocus={() => setOpen(i)}
          >
            <Link
              href={s.href}
              aria-expanded={on}
              onPointerDown={(e) => (openAtPress.current = e.pointerType === "mouse" || on)}
              onClick={(e) => {
                // A press on a closed row opens it instead of leaving; a
                // keyboard Enter (no press) follows the link, as focus has
                // already opened the row.
                if (openAtPress.current === false) {
                  e.preventDefault();
                  setOpen(i);
                }
                openAtPress.current = null;
              }}
              className="group flex items-center gap-5 py-6 lg:gap-10 lg:py-7"
            >
              <span className={`w-10 shrink-0 font-[family-name:var(--font-cal-ui)] text-[1.25rem] tabular-nums transition-colors lg:w-16 lg:text-[1.75rem] ${ease} ${on ? "text-accent" : "text-ink-600"}`}>
                {s.index}
              </span>
              <h3
                className={`flex-1 text-[clamp(1.5rem,3.4vw,3rem)] font-semibold uppercase leading-[0.95] tracking-[-0.045em] transition-colors ${ease} ${on ? "text-ink-1000" : "text-ink-600 group-hover:text-ink-800"}`}
              >
                {s.title}
              </h3>
              <span
                aria-hidden="true"
                className={`grid size-11 shrink-0 place-items-center rounded-full border transition-[transform,background-color,color,border-color] lg:size-14 ${ease} ${on ? "-rotate-45 border-ink-1000 bg-ink-1000 text-ink-0" : "border-ink-500 text-ink-1000"}`}
              >
                →
              </span>
            </Link>

            {/* The open part. Collapsed with grid rows, not removed, so the
                line stays in the HTML for crawlers; a closed panel is `inert`
                (out of the tab order and the accessibility tree), as anything
                hidden on purpose must be. Focusing the row's link opens it. */}
            <div
              inert={!on}
              className={`grid transition-[grid-template-rows] ${ease} ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div className="grid gap-6 pb-8 pl-15 sm:grid-cols-[1fr_auto] sm:items-end lg:pb-10 lg:pl-26">
                  <div className={`transition-[opacity,transform] ${ease} ${on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                    <p className="max-w-[46ch] text-[1rem] leading-relaxed text-ink-700 lg:text-[1.0625rem]">{s.summary}</p>
                    <Link
                      href={s.href}
                      className="mt-5 inline-flex min-h-11 items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[-0.02em] text-ink-1000 hover:text-accent"
                    >
                      View service <span aria-hidden="true">+</span>
                    </Link>
                  </div>
                  {s.img ? (
                    <div
                      className={`relative aspect-[4/3] w-full max-w-[22rem] overflow-hidden transition-[opacity,transform] sm:w-[22rem] ${ease} ${on ? "rotate-[-2deg] scale-100 opacity-100" : "rotate-0 scale-90 opacity-0"}`}
                    >
                      <Image src={s.img} alt="" fill sizes="22rem" className="object-cover grayscale" />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
