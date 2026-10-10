"use client";

import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/content";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

const MENU = [...nav, { label: "Contact", href: "#contact" }] as const;

/**
 * FLUID ISLAND NAV + FULL-SCREEN MENU
 *
 * The bar is the house pattern: a floating glass pill detached from the top
 * edge. An edge-to-edge bar glued to the viewport is explicitly banned by the
 * high-end-visual-design standard, so the client's reference is followed on
 * the menu and not on the bar.
 *
 * The overlay is the reference's: a "(Menu)" marker and a circular close on a
 * hairline top rail, oversized uppercase items divided by rules with the
 * current one marked, then the direct contact details.
 *
 * It opens at every breakpoint, not just on mobile, because it is the better
 * navigation — the inline links stay on desktop for people who just want to
 * jump one section.
 *
 * ── Dialog behaviour ──
 * Escape closes. Focus moves into the panel on open and returns to the
 * trigger on close. Tab cycles inside the panel rather than walking into the
 * page behind it — with the overlay now covering desktop too, an untrapped
 * dialog would let a keyboard user tab into content they cannot see. The page
 * behind is scroll-locked.
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

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const trigger = toggleRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4">
        <div
          className={cn(
            "pointer-events-auto mt-5 flex w-full max-w-[1100px] items-center justify-between gap-6 rounded-full py-2.5 pl-6 pr-2.5",
            "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            scrolled
              ? "border border-white/12 bg-ink-0/70 shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_20px_50px_-30px_rgb(0_0_0/0.9)] backdrop-blur-2xl"
              : "border border-white/[0.06] bg-ink-0/25 backdrop-blur-md"
          )}
        >
          <a
            href="#main"
            className="group flex items-center gap-3"
            aria-label={`${site.name} — home`}
          >
            <span
              aria-hidden="true"
              className="block h-4 w-px bg-ink-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:h-5 group-hover:bg-ink-1000"
            />
            <Wordmark />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="relative text-sm tracking-tight text-ink-800 transition-colors duration-500 hover:text-ink-1000 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-ink-1000 after:transition-all after:duration-700 after:ease-[cubic-bezier(0.32,0.72,0,1)] hover:after:w-full"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-full bg-ink-1000 px-5 py-2.5 text-sm font-medium tracking-tight text-ink-0 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03] active:scale-[0.98] sm:inline-block"
            >
              Enquire
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] transition-transform duration-500 hover:scale-105 active:scale-95"
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span className="absolute left-0 top-0 block h-px w-full bg-ink-1000" />
                <span className="absolute left-0 top-3 block h-px w-full bg-ink-1000" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Full-screen menu ---------- */}
      {open ? (
        <div
          ref={panelRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60] flex flex-col bg-ink-0/95 backdrop-blur-3xl"
        >
          {/* Top rail. */}
          <div className="flex items-center justify-between border-b border-ink-300 px-6 py-5 sm:px-10 lg:px-16">
            <p className="flex items-center gap-2.5 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink-800">
              <span
                aria-hidden="true"
                className="block h-1.5 w-1.5 bg-ink-1000"
              />
              Menu
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] transition-transform duration-500 hover:scale-105 active:scale-95"
            >
              <span className="sr-only">Close menu</span>
              <span aria-hidden="true" className="relative block h-4 w-4">
                <span className="absolute left-0 top-1/2 block h-px w-full rotate-45 bg-ink-1000" />
                <span className="absolute left-0 top-1/2 block h-px w-full -rotate-45 bg-ink-1000" />
              </span>
            </button>
          </div>

          <nav
            aria-label="Menu"
            className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-10 sm:px-10 lg:px-16"
          >
            <ul className="mx-auto w-full max-w-[1600px]">
              {MENU.map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-ink-300">
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{ animationDelay: `${60 + i * 55}ms` }}
                    className="display group flex animate-[rise_0.8s_cubic-bezier(0.32,0.72,0,1)_both] items-center gap-4 py-5 text-[clamp(2rem,7vw,4.5rem)] text-ink-800 transition-colors duration-500 hover:text-ink-1000"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="block h-2 w-2 shrink-0 scale-0 bg-ink-1000 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-100"
                    />
                  </a>
                </li>
              ))}
            </ul>

            {/* Direct contact. The reference puts a socials grid here; no
                social accounts have been supplied, and inventing handles that
                resolve to nothing — or to somebody else — is not an option. */}
            <div className="mx-auto mt-14 grid w-full max-w-[1600px] gap-10 sm:grid-cols-2">
              <div>
                <p className="field-label">(Email)</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-3 inline-block break-all text-lg tracking-tight text-ink-1000 transition-colors duration-500 hover:text-ink-800 sm:text-xl"
                >
                  {site.email}
                </a>
              </div>
              <div>
                <p className="field-label">(Phone)</p>
                <a
                  href={site.phoneHref}
                  className="mt-3 inline-block text-lg tracking-tight text-ink-1000 transition-colors duration-500 hover:text-ink-800 sm:text-xl"
                >
                  {site.phone}
                </a>
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
