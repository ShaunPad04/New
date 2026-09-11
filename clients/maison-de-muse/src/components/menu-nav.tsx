"use client";

import { useEffect, useState } from "react";
import { menu } from "@/lib/menu";
import { cn } from "@/lib/utils";

/**
 * MENU CATEGORY NAV
 *
 * Plain anchor links to each category — they work with no JavaScript and
 * keep every category in the HTML. On larger screens the rail is sticky
 * beside the menu; on small screens it is a horizontally scrollable strip
 * pinned beneath the header. JavaScript only adds the "current" highlight
 * via IntersectionObserver.
 */
export function MenuNav() {
  const [current, setCurrent] = useState<string>(menu[0].id);

  useEffect(() => {
    const sections = menu
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // The topmost intersecting section wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // Keep the active pill in view on the mobile rail.
    const el = document.querySelector<HTMLAnchorElement>(`[data-menu-link="${current}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [current]);

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-[4.75rem] z-30 -mx-6 border-b border-sand bg-ivory/90 px-6 backdrop-blur-md sm:-mx-10 sm:px-10 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none"
    >
      <ul className="rail flex gap-2 overflow-x-auto py-3 lg:flex-col lg:gap-1 lg:overflow-visible lg:py-0">
        {menu.map((c) => {
          const active = c.id === current;
          return (
            <li key={c.id} className="shrink-0 snap-start">
              <a
                href={`#${c.id}`}
                data-menu-link={c.id}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium tracking-tight",
                  "transition-[background-color,color,border-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  "lg:rounded-none lg:border-0 lg:border-l lg:px-4 lg:py-2.5",
                  active
                    ? "border-plum bg-plum text-cream lg:bg-transparent lg:text-plum lg:border-l-plum"
                    : "border-espresso/12 bg-cream/70 text-espresso-soft hover:border-espresso/35 lg:bg-transparent lg:border-l-sand lg:hover:text-espresso"
                )}
              >
                {c.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
