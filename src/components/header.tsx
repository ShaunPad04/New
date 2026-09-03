"use client";

import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/content";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

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

  // Dialog semantics for the mobile panel: Escape closes it, focus moves in
  // on open and returns to the trigger on close, and the page behind is
  // locked. Skipping any of these is what makes a mobile menu untestable.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    // Captured now: by cleanup time the ref may point elsewhere.
    const trigger = toggleRef.current;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-expo)]",
        scrolled
          ? "border-b border-ink-300 bg-ink-0/80 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <a
          href="#main"
          className="group flex items-center gap-3"
          aria-label={`${site.name} — home`}
        >
          <span
            aria-hidden="true"
            className="block h-5 w-px bg-ink-700 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:h-6 group-hover:bg-ink-1000"
          />
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative text-sm tracking-tight text-ink-800 transition-colors duration-300 hover:text-ink-1000 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-ink-1000 after:transition-all after:duration-400 after:ease-[var(--ease-out-expo)] hover:after:w-full"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full border border-ink-500 px-5 py-2.5 text-sm tracking-tight text-ink-1000 transition-colors duration-300 hover:border-ink-800 sm:inline-block"
          >
            Enquire
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-400 md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-ink-1000 transition-all duration-300 ease-[var(--ease-out-expo)]",
                  open ? "top-1.5 rotate-45" : "top-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-ink-1000 transition-all duration-300 ease-[var(--ease-out-expo)]",
                  open ? "top-1.5 -rotate-45" : "top-3"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          ref={panelRef}
          id="mobile-nav"
          className="border-t border-ink-300 bg-ink-0 md:hidden"
        >
          <ul className="px-6 py-4">
            {[...nav, { label: "Contact", href: "#contact" }].map((item) => (
              <li key={item.href} className="border-b border-ink-200 last:border-0">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-5 text-2xl tracking-tight text-ink-1000"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
