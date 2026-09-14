"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

/**
 * SERVICE ROWS WITH HOVER MEDIA (redesign, 2026-09-11)
 *
 * The homepage's compact service list: editorial index rows, and on a
 * fine-pointer screen a floating monochrome still follows the cursor while a
 * row is hovered. Hover-reveal was chosen over a pinned horizontal scroll
 * deliberately — the hero already owns this page's one big scroll-jack, a
 * second pin would fight it, and a pin degrades to nothing on mobile anyway.
 * This costs no scroll length and disappears entirely where it cannot work.
 *
 * Mechanics: the cursor position is written imperatively as CSS custom
 * properties (no re-render per pointer move — same pattern as the FAQ sheen),
 * and only the active-row index is React state, which changes at hover
 * frequency, not frame frequency. All six images are mounted and cross-faded
 * so switching rows never waits on a mount. Transform/opacity only.
 *
 * The plate is `aria-hidden` decoration; each row is a real link to its
 * card on /services, which is also what a touch tap does — so mobile loses
 * only the garnish, never a capability. Under `prefers-reduced-motion` the
 * plate never renders (`motion-reduce:hidden`).
 */
export type ServiceRow = {
  id: string;
  index: string;
  title: string;
  summary: string;
  /** Resolved at build time; null renders the row with no preview. */
  image: string | null;
};

export function ServiceRows({ items }: { items: ServiceRow[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(-1);

  const track = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const anyImage = items.some((i) => i.image);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerMove={track}
      onPointerLeave={() => setActive(-1)}
    >
      <ul className="border-t border-ink-300">
        {items.map((service, i) => (
          <Reveal as="li" key={service.id} delay={i * 0.05} variant="slide">
            <Link
              href={`/services#${service.id}`}
              className="group grid gap-2 border-b border-ink-300 py-6 transition-colors duration-500 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-7 lg:py-9"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(-1)}
            >
              {/*
                THE INDEX LINE, phone only.

                `sm:contents` is what makes this free: from `sm` the wrapper
                stops generating a box, the number becomes a direct grid item
                again and the twelve-column desktop row is byte-identical to
                what it was. Below `sm` it is a flex line instead.

                On a phone the number used to sit in its capsule as the only
                item in a one-column grid row, so it stretched to the full
                width of the screen — a 364px pill containing "01", which
                reads as an empty form field and was the single thing making
                this section look generic. Now it is a hung mono figure, a
                rule that runs out to the edge, and the arrow: the classic
                printed index, and a tap affordance these rows never had.
                Six identical text blocks were the other half of the problem
                — the rule gives each row a horizontal line to sit against.
              */}
              <div className="flex items-center gap-4 sm:contents">
                <span className="eyebrow eyebrow-plain text-ink-600 sm:col-span-1 sm:text-ink-800">
                  {service.index}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-ink-300 sm:hidden"
                />
                {/* `group-active`, not `group-hover`: this arrow only exists
                    where there is no pointer to hover with. */}
                <span
                  aria-hidden="true"
                  className="block text-sm leading-none text-ink-600 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-active:translate-x-0.5 group-active:-translate-y-0.5 sm:hidden"
                >
                  &#8599;
                </span>
              </div>
              {/*
                THE STILL COMES TO THE PHONE.

                These six images already exist and already cost their credit
                — they are the plate that follows the cursor on a desktop.
                That plate is `lg:block` behind a fine-pointer check, so a
                touch device has never once seen them, which is most of why
                this section read as six blocks of text. A phone gets the
                same picture as a small plate against the copy.

                Two wrappers, both `sm:contents`: from `sm` neither generates
                a box, the heading and the summary go back to being direct
                children of the twelve-column row, and the desktop layout is
                the one that was already there. The plate is `hidden` above
                `sm` so the cursor version keeps the job it does better.
              */}
              <div className="flex gap-4 sm:contents">
                {service.image ? (
                  <span className="relative mt-1.5 hidden aspect-[4/5] w-[3.75rem] shrink-0 overflow-hidden rounded-[0.75rem] bg-ink-100 max-sm:block">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </span>
                ) : null}

                <div className="min-w-0 max-sm:block sm:contents">
                  <h3 className="display text-display-sm text-ink-1000 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:col-span-5 lg:group-hover:translate-x-2">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-700 sm:col-span-6 sm:mt-0">
                    {service.summary}
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>

      {anyImage ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 hidden w-[22rem] motion-reduce:hidden! lg:block"
          style={{
            transform:
              "translate3d(calc(var(--mx, -999px) + 2.5rem), calc(var(--my, -999px) - 50%), 0)",
          }}
        >
          <div
            className="bezel transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{
              opacity: active >= 0 && items[active]?.image ? 1 : 0,
              scale: active >= 0 && items[active]?.image ? "1" : "0.92",
            }}
          >
            <div className="bezel-core p-2">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[0.9rem] bg-ink-100">
                {items.map((service, i) =>
                  service.image ? (
                    <Image
                      key={service.id}
                      src={service.image}
                      alt=""
                      fill
                      sizes="352px"
                      className="object-cover transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      style={{ opacity: active === i ? 1 : 0 }}
                    />
                  ) : null,
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
