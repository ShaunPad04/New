import Image from "next/image";
import Link from "next/link";

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
 *  - desktop: index | name | line | arrow, text only. Hovering a row rolls
 *    its name up (the menu's and the header's roll), lifts its line, fills
 *    and turns its arrow, turns its index red and dims the other rows. All
 *    transform, opacity and colour; no layout moves, so scrolling under a
 *    resting pointer costs nothing (the 2026-10-04 slowdown cannot come
 *    back). A still that followed the pointer behind the words was tried
 *    the same day and taken off (Brad: "why is it there?"): under the type
 *    it muddied the rows, and on the last row it could not follow the
 *    pointer down, so it sat behind the row above.
 *  - phones and tablets: the line under the name with the service's still
 *    beside it, the whole row one link.
 * Reduced motion keeps the colours and dimming, without the roll or the lift.
 * No state and no script: a server component.
 */
export function ExpandList({ items }: { items: ExpandItem[] }) {
  return (
    <ul className="group/list mt-14 border-t border-ink-300">
      {items.map((s) => (
        <li
          key={s.id}
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
                under it below lg, with the still beside it. */}
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
