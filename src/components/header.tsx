"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav, site } from "@/lib/content";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

const MENU = [...nav, { label: "Contact", href: "/#contact" }] as const;

/**
 * FLUID ISLAND NAV
 *
 * A floating glass pill detached from the top edge, per the house
 * high-end-visual-design standard — an edge-to-edge bar glued to the viewport
 * is explicitly banned there. Opening the menu expands a screen-filling glass
 * overlay whose links reveal on a stagger from behind an invisible mask.
 *
 * `backdrop-blur` is applied only to this fixed element and the overlay,
 * never to scrolling content, which would force continuous GPU repaints.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        deliberate client override rather than a default: it stays clear of
        the hero panel rather than sitting on it, and only takes a surface
        once the page has scrolled under it.
      */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "pointer-events-auto flex h-[4.5rem] items-center gap-6 px-5 sm:px-7",
            "transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            scrolled
              ? "border-b border-white/10 bg-ink-0/70 backdrop-blur-2xl"
              : "border-b border-transparent"
          )}
        >
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
