"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, openingHours, serviceHours, site } from "@/lib/site";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

/**
 * ANNOUNCEMENT BAR + FLUID ISLAND NAV
 *
 * The announcement strip carries the evening-service line and the day's
 * hours. Beneath it the navigation is a floating glass pill detached from
 * the top edge; once the page scrolls the strip folds away and the pill
 * gains a firmer glass surface so it holds against photography.
 *
 * The mobile menu is a screen-filling overlay: Escape closes it, focus moves
 * in on open and returns to the trigger on close, the page behind is locked,
 * and the current page is marked with aria-current.
 *
 * `backdrop-blur` is applied only to these fixed elements, never to
 * scrolling content.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      // Keep Tab inside the overlay.
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const trigger = toggleRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const todayIndex = new Date().getDay(); // 0 = Sunday
  const todayName = (
    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const
  )[todayIndex];
  const today = openingHours.find((row) => (row.days as readonly string[]).includes(todayName));

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center">
        {/* Announcement strip */}
        <div
          aria-hidden={scrolled}
          className={cn(
            "pointer-events-auto flex w-full items-center justify-center gap-4 bg-plum px-4 py-2 text-center text-[0.75rem] font-medium tracking-wide text-cream",
            "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            scrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          <p className="truncate">
            <span className="hidden sm:inline">Evening menu &amp; wine bar — {serviceHours.evening.display}.</span>
            <span className="sm:hidden">Wine bar Fri &amp; Sat from 4pm.</span>
            {today ? (
              <span className="ml-3 text-cream/70">
                Today {today.display}
              </span>
            ) : null}
          </p>
        </div>

        <div
          className={cn(
            "pointer-events-auto flex w-[calc(100%-2rem)] max-w-[1120px] items-center justify-between gap-6 rounded-full py-2 pl-5 pr-2",
            "transition-[transform,background-color,box-shadow,border-color,margin] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            scrolled
              ? "-mt-6 border border-espresso/10 bg-ivory/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_24px_50px_-30px_rgb(43_29_24/0.45)] backdrop-blur-2xl"
              : "mt-4 border border-espresso/[0.06] bg-ivory/55 backdrop-blur-md"
          )}
        >
          <Link href="/" className="group flex items-center" aria-label={`${site.name} — home`}>
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={cn(
                      "link-line text-[0.875rem] tracking-tight transition-colors duration-500",
                      isCurrent(item.href) ? "text-espresso" : "text-espresso-soft hover:text-espresso"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.phoneHref}
              className="hidden rounded-full bg-plum px-5 py-2.5 text-sm font-medium tracking-tight text-cream transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03] active:scale-[0.98] sm:inline-block"
            >
              Call {site.phone}
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-espresso/12 bg-cream/70 transition-transform duration-500 active:scale-95 lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-espresso transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    open ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-espresso transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    open ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Screen-filling overlay with a staggered reveal. */}
      {open ? (
        <div
          ref={panelRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-40 overflow-y-auto bg-ivory/92 backdrop-blur-3xl lg:hidden"
        >
          <nav aria-label="Mobile" className="flex min-h-full flex-col justify-center px-8 pb-12 pt-28">
            <ul>
              {nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    style={{ animationDelay: `${80 + i * 60}ms` }}
                    className={cn(
                      "display flex animate-[rise_0.8s_cubic-bezier(0.32,0.72,0,1)_both] items-baseline gap-4 py-3 text-[2.75rem] leading-none",
                      isCurrent(item.href) ? "text-plum" : "text-espresso"
                    )}
                  >
                    {item.label}
                    {isCurrent(item.href) ? (
                      <span className="text-[0.625rem] font-sans font-semibold uppercase tracking-[0.2em] text-plum">
                        Here
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-12 border-t border-espresso/10 pt-8 text-sm text-espresso-soft">
              <a href={site.phoneHref} className="link-line inline-block py-1 text-espresso">
                {site.phone}
              </a>
              <br />
              <a href={`mailto:${site.email}`} className="link-line inline-block py-1 text-espresso">
                {site.email}
              </a>
              <p className="mt-4">
                {site.address.street}, {site.address.town} {site.address.postcode}
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
