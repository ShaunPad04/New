"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { DIETARY_KEY, MENU_HIGHLIGHTS, findItem, priceLabel } from "@/lib/menu";
import { Cta } from "@/components/cta";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

/**
 * MENU PREVIEW — the template's "Explore Our Signature Brews": tab pills
 * above a grid of product cards. Every panel is server-rendered into the
 * HTML (hidden panels use the `hidden` attribute), so search engines and
 * no-JS visitors still get the content and the link to the full menu.
 *
 * Tabs follow the WAI-ARIA tabs pattern: arrow keys move between tabs,
 * each tab controls one panel, and only the active tab is in the tab order.
 */
export function MenuPreview() {
  const [active, setActive] = useState(0);
  const baseId = useId();

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = MENU_HIGHLIGHTS.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <section
      id="menu-preview"
      aria-labelledby="menu-preview-heading"
      className="bg-plaster"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[40rem]">
            <Reveal>
              <p className="eyebrow mb-6">The menu</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="menu-preview-heading" className="display text-display-lg text-espresso">
                Explore the
                <br />
                <em className="display-italic text-plum">menu.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-6 max-w-[42ch]">
                A few favourites from the counter and the kitchen. Food is served
                8am to 5pm; the evening menu from 4pm on Fridays and Saturdays.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div
              role="tablist"
              aria-label="Menu highlights"
              className="rail -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:px-0"
            >
              {MENU_HIGHLIGHTS.map((group, i) => {
                const selected = i === active;
                return (
                  <button
                    key={group.tab}
                    id={`${baseId}-tab-${i}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel-${i}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={cn(
                      "min-h-11 shrink-0 snap-start rounded-full border px-5 py-2.5 text-sm font-medium tracking-tight",
                      "transition-[background-color,color,border-color,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
                      selected
                        ? "border-plum bg-plum text-cream"
                        : "border-espresso/15 bg-cream/70 text-espresso-soft hover:border-espresso/35"
                    )}
                  >
                    {group.tab}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {MENU_HIGHLIGHTS.map((group, i) => (
          <div
            key={group.tab}
            id={`${baseId}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${i}`}
            hidden={i !== active}
            className="mt-14"
          >
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {group.items.map(({ section, name }) => {
                const hit = findItem(section, name);
                if (!hit) return null;
                const { item, category } = hit;
                return (
                  <li key={name} className="bezel">
                    <article className="bezel-core group relative flex h-full flex-col p-6 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 lg:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <span className="eyebrow">{category.label}</span>
                        <span className="serif tabular text-xl text-plum">{priceLabel(item)}</span>
                      </div>
                      <h3 className="serif mt-8 text-[1.5rem] text-espresso">{item.name}</h3>
                      {item.description ? (
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-mocha">
                          {item.description}
                        </p>
                      ) : null}
                      <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                        <span className="flex gap-2">
                          {item.dietary?.map((d) => (
                            <span
                              key={d}
                              className="rounded-full border border-sage/40 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-sage"
                              title={DIETARY_KEY[d]}
                            >
                              {DIETARY_KEY[d]}
                            </span>
                          ))}
                        </span>
                        <Link
                          href={`/menu#${section}`}
                          className="link-line text-sm font-medium text-espresso"
                          aria-label={`${item.name} on the full menu`}
                        >
                          On the menu
                        </Link>
                      </div>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-peach-soft/60 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                      />
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Cta href="/menu">View the full menu</Cta>
          <p className="text-sm text-mocha">Prices may change — see the menu for allergen notes.</p>
        </div>
      </div>
    </section>
  );
}
