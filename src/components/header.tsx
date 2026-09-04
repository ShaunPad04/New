"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav, site } from "@/lib/content";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

const MENU = [...nav, { label: "Contact", href: "/#contact" }] as const;

/** Height of the bar, in px, matching the `h-[4.5rem]` below. */
const BAR_HEIGHT_PX = 72;

/**
 * Id of the zero-height marker that pages place immediately after their hero.
 * Exported so the page owns the placement and the header owns the behaviour,
 * rather than the header reaching for a section it does not render.
 */
export const HEADER_SENTINEL_ID = "header-surface-sentinel";

/** Drop this straight after the hero. It marks a position and nothing else. */
export function HeaderSurfaceSentinel() {
  return <div id={HEADER_SENTINEL_ID} aria-hidden="true" />;
}

/**
 * FLUID ISLAND NAV
 *
 * A floating glass pill detached from the top edge, per the house
 * high-end-visual-design standard — an edge-to-edge bar glued to the viewport
 * is explicitly banned there. Opening the menu expands a screen-filling glass
 * overlay whose links reveal on a stagger from behind an invisible mask.
 *
 * `backdrop-blur` is applied only to the mobile overlay, which is fixed —
 * never to scrolling content, which would force continuous GPU repaints.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /**
   * The bar is transparent over the hero and takes a surface once the page has
   * scrolled past it.
   *
   * Position is read from a sentinel element rather than a scroll offset,
   * because the hero PINS: ScrollTrigger holds it on screen for several
   * viewport heights, so "past the hero" is nowhere near
   * `scrollY > innerHeight`, and any constant would silently drift the moment
   * the pin distance changes. The sentinel sits immediately after the hero in
   * the document, outside the pinned section, so it reaches the top of the
   * viewport exactly when the pin releases — whatever that distance is.
   *
   * This was an IntersectionObserver first. It is the obvious tool and it is
   * the wrong one here: a 1px target crosses the entire observation band
   * inside a single frame on a fast scroll, so `isIntersecting` goes false to
   * false and the browser reports no change at all. Measured on this page, a
   * one-jump scroll past the hero produced ZERO callbacks where an
   * incremental scroll produced two — meaning the bar would simply fail to
   * appear after a flick scroll, an anchor jump, or a restored scroll
   * position on reload.
   *
   * Reading the rect on scroll is deterministic at any speed. The listener is
   * passive and coalesced to one read per animation frame, and it only touches
   * React state when the boolean actually flips, so a full-page scroll costs a
   * handful of re-renders rather than hundreds.
   *
   * Pages without a hero have no sentinel and take the surface as soon as the
   * page moves. Their intro block sits on the page ground, so there is nothing
   * for the bar to stay out of the way of.
   */
  useEffect(() => {
    const sentinel = document.getElementById(HEADER_SENTINEL_ID);
    let frame = 0;

    const measure = () => {
      frame = 0;
      const next = sentinel
        ? sentinel.getBoundingClientRect().top <= BAR_HEIGHT_PX
        : window.scrollY > 24;
      setSolid((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Dialog semantics: Escape closes, focus moves in on open and returns to
  // the trigger on close, and the page behind is locked.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
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

  return (
    <>
      {/*
        Full-width spread bar, at the client's explicit request (2026-09-04),
        replacing the floating island pill. The house standard prefers a
        detached pill and bans a bar "glued to the top", so this is a
        deliberate client override rather than a default. It is transparent
        over the hero and takes a surface past it — see the notes below.
      */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        {/*
          Fully transparent over the hero, then a glass bar once the page has
          scrolled past it.

          The surface is its own layer whose OPACITY is animated, rather than
          classes being swapped on the bar. Swapping meant the background and
          hairline cross-faded but `backdrop-filter` did not — a filter cannot
          transition from `none`, so the blur snapped in at full strength while
          everything else eased, which read as a glitch rather than an arrival.
          Fading a single layer takes the blur, the tint and the hairline up
          together on one compositor-friendly property.

          The layer stays mounted at zero opacity over the hero. That is the
          trade for the smooth transition: a fully transparent element is not
          painted, so the cost is a layer the compositor skips rather than a
          blur it recomputes every frame.
        */}
        <div className="pointer-events-auto relative flex h-[4.5rem] items-center gap-6 px-5 sm:px-7">
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 border-b border-white/10 bg-ink-0/70 backdrop-blur-2xl",
              "transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              solid ? "opacity-100" : "opacity-0"
            )}
          />
          {/* Soft top-down gradient for the transparent state only. It is not
              a surface and costs nothing, but it keeps the wordmark off a
              bright frame of the hero sequence. It fades out as the bar
              arrives — over the same duration, so the two cross rather than
              stack. */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 -z-20 h-[8rem] bg-gradient-to-b from-black/70 via-black/28 to-transparent",
              "transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              solid ? "opacity-0" : "opacity-100"
            )}
          />
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
            aria-label={`${site.name} — home`}
          >
            <span
              aria-hidden="true"
              className="block h-4 w-px bg-ink-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:h-5 group-hover:bg-ink-1000"
            />
            <Wordmark />
          </Link>

          {/* Items are spread across the remaining width rather than clustered,
              which is what gives the bar its editorial rhythm. */}
          <nav aria-label="Primary" className="hidden flex-1 md:block">
            <ul className="flex items-center justify-evenly">
              {nav.map((item) => {
                // A route needs <Link> for client-side navigation; an in-page
                // anchor must stay a plain <a> so the browser handles the jump.
                const isRoute = item.href.startsWith("/");
                const cls =
                  "relative text-sm tracking-tight text-ink-800 transition-colors duration-500 hover:text-ink-1000 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-ink-1000 after:transition-all after:duration-700 after:ease-[cubic-bezier(0.32,0.72,0,1)] hover:after:w-full";
                return (
                  <li key={item.href}>
                    {isRoute ? (
                      <Link href={item.href} className={cls}>
                        {item.label}
                      </Link>
                    ) : (
                      <a href={item.href} className={cls}>
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
            {/* The header CTA is the single highest-intent element on the
                page. "Book a call" names the actual next step, which converts
                better than an abstract "Enquire" — and it is honest: the form
                below routes straight to booking a call. */}
            <Link
              href="/#contact"
              className="hidden rounded-full bg-ink-1000 px-5 py-2.5 text-sm font-medium tracking-tight text-ink-0 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03] active:scale-[0.98] sm:inline-block"
            >
              Book a call
            </Link>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] transition-transform duration-500 active:scale-95 md:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-ink-1000 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    open ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-ink-1000 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    open ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Screen-filling glass overlay with a staggered mask reveal. */}
      {open ? (
        <div
          ref={panelRef}
          id="mobile-nav"
          className="fixed inset-0 z-40 bg-ink-0/85 backdrop-blur-3xl md:hidden"
        >
          <nav
            aria-label="Mobile"
            className="flex h-full flex-col justify-center px-8"
          >
            <ul>
              {MENU.map((item, i) => {
                const isRoute = item.href.startsWith("/");
                const cls =
                  "display block animate-[rise_0.8s_cubic-bezier(0.32,0.72,0,1)_both] py-3 text-4xl text-ink-1000";
                const style = { animationDelay: `${80 + i * 60}ms` };
                return (
                  <li key={item.href} className="overflow-hidden">
                    {isRoute ? (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        style={style}
                        className={cls}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        style={style}
                        className={cls}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-14 border-t border-white/10 pt-8">
              <a
                href={`mailto:${site.email}`}
                className="block text-sm text-ink-800"
              >
                {site.email}
              </a>
              <a
                href={site.phoneHref}
                className="mt-3 block text-sm text-ink-800"
              >
                {site.phone}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
