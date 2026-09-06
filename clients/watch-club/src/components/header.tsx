"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { business, nav } from "@/lib/content";
import { Wordmark } from "@/components/wordmark";

/**
 * Site header.
 *
 * Structure is taken from the reference: a fully transparent fixed bar
 * sitting OVER the hero, with the logo left, a 2x2 dot-grid toggle dead
 * centre, and a single Contact link right. There are no nav links in the bar
 * itself — the dot grid is the only nav affordance, and it opens a
 * full-screen overlay with the page blurred behind it.
 *
 * That overlay is the primary navigation at every breakpoint, not a mobile
 * fallback, so it has to behave like a real dialog. The reference does not
 * do any of the following, and we do:
 *
 *   - a real <button> carrying aria-expanded and aria-controls
 *   - focus moved into the overlay on open and restored to the toggle on close
 *   - focus trapped inside while it is open
 *   - Escape closes it
 *   - background scroll locked while it is open
 *   - the blur dropped entirely under prefers-reduced-motion
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Escape to close, and trap Tab inside the panel while it is open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Lock background scroll, and restore focus to the toggle on close so the
  // keyboard user is not dumped back at the top of the document.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Captured now, not read in the cleanup: by the time cleanup runs the ref
    // may point somewhere else, and focus would be restored to the wrong node
    // (or nothing at all).
    const toggle = toggleRef.current;

    const firstLink = panelRef.current?.querySelector<HTMLElement>("a[href]");
    firstLink?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
          <a
            href="#main"
            className="shrink-0"
            aria-label={`${business.name} — home`}
          >
            <Wordmark />
          </a>

          {/* The dot grid sits centred at every width. It is absolutely
              positioned so the flanking items can be different widths
              without pulling it off centre. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md p-3 text-bone transition-colors duration-300 hover:text-champagne"
          >
            <MenuGlyph open={open} />
          </button>

          <a
            href="#visit"
            className="shrink-0 text-sm font-medium text-bone transition-colors duration-300 hover:text-champagne"
          >
            Contact
          </a>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-40 flex items-center justify-center bg-obsidian/80 backdrop-blur-2xl"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          >
            <nav>
              <ul className="flex flex-col items-center gap-1 text-center">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduced ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: reduced ? 0 : 0.08 + i * 0.055,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block px-6 py-1.5 text-[clamp(1.75rem,6vw,3.25rem)] font-semibold uppercase leading-[1.1] tracking-tight text-bone transition-colors duration-300 hover:text-champagne"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-12 flex flex-col items-center gap-2">
                <a
                  href={business.phoneHref}
                  className="spec-label transition-colors duration-300 hover:text-champagne"
                >
                  {business.phone}
                </a>
                <a
                  href={`mailto:${business.email}`}
                  className="spec-label transition-colors duration-300 hover:text-champagne"
                >
                  {business.email}
                </a>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/**
 * The toggle glyph: a 2x2 dot grid that becomes an X inside a thin square
 * outline, exactly as the reference does it. Drawn rather than swapped for an
 * icon component so the two states can share a viewBox and cross-fade
 * cleanly. Decorative — the button carries the accessible name.
 */
function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="21"
        rx="2"
        stroke="currentColor"
        strokeWidth="1"
        className="transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0 }}
      />
      <g
        className="transition-opacity duration-300"
        style={{ opacity: open ? 0 : 1 }}
      >
        <circle cx="8" cy="8" r="1.6" fill="currentColor" />
        <circle cx="14" cy="8" r="1.6" fill="currentColor" />
        <circle cx="8" cy="14" r="1.6" fill="currentColor" />
        <circle cx="14" cy="14" r="1.6" fill="currentColor" />
      </g>
      <g
        className="transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0 }}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        <line x1="7.5" y1="7.5" x2="14.5" y2="14.5" />
        <line x1="14.5" y1="7.5" x2="7.5" y2="14.5" />
      </g>
    </svg>
  );
}
