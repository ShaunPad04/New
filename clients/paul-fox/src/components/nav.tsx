"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { nav, site, social } from "@/lib/content";
import { Button } from "./button";
import { Close, Hamburger } from "./icons";
import { APPEAR_EASE } from "./appear";

/**
 * The nav sits on a solid white header board (matching the reference), so
 * the page content is offset by the board's height — see `.header-offset`
 * in globals.css. The board stays fixed while scrolling.
 */
export function Nav() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-white">
        <div
          className="container flex h-[60px] items-center justify-between tablet:h-[68px]"
          onClick={() => setOpen(true)}
          role="presentation"
        >
          {/* Phone: caption left, chip right. Tablet up: chip / caption / CTA. */}
          <div className="order-2 flex flex-1 justify-end tablet:order-1 tablet:justify-start">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-7 w-8 items-center justify-center rounded-[4px] bg-ink-900 text-white"
              onClick={(e) => {
                stop(e);
                setOpen(true);
              }}
            >
              <Hamburger />
            </button>
          </div>
          <div className="order-1 flex flex-1 tablet:order-2 tablet:justify-center">
            <Link href="/" onClick={stop} className="caption2 max-w-[240px] !text-ink-900 tablet:max-w-none tablet:text-center">
              {site.strapline}
            </Link>
          </div>
          <div className="order-3 hidden flex-1 justify-end tablet:flex" onClick={stop} role="presentation">
            <Button label={nav.cta.label} href={nav.cta.href} />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 flex flex-col bg-ink-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between p-5" onClick={stop} role="presentation">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Close menu"
                  className="flex h-7 w-8 items-center justify-center rounded-[4px] bg-ink-900 text-white"
                  onClick={close}
                >
                  <Close />
                </button>
                <span className="h5 hidden tablet:block">{site.shortName}</span>
              </div>
              <Button label={nav.cta.label} href={nav.cta.href} />
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-5" onClick={stop}>
              {nav.links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="h2 transition-colors duration-300 hover:!text-ink-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: APPEAR_EASE, delay: i * 0.06 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-5">
                {social.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="caption2 !text-ink-900 transition-colors duration-300 hover:!text-ink-500"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
