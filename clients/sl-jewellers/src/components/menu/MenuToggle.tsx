"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MENU_EVENT, isMenuOpen, setMenu } from "./menu-state";

/** The button that opens and closes the site menu, whichever header and menu are showing. */
export default function MenuToggle({ className = "", children }: { className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const sync = () => setOpen(isMenuOpen());
    window.addEventListener(MENU_EVENT, sync);
    return () => window.removeEventListener(MENU_EVENT, sync);
  }, []);
  return (
    <button
      type="button"
      className={className}
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      data-menu-toggle
      onClick={() => setMenu(!isMenuOpen())}
    >
      {children}
    </button>
  );
}

/**
 * The menu mark (6 Oct 2026, Shaun): two lines of the same length and weight, an equals sign,
 * set on whole pixels so both render at the same thickness. On hover they part: the top one
 * shortens from the left, the bottom one from the right. With `label`, the word MENU sits
 * before it. The menu has its own close button, so the mark never needs to turn into an X.
 */
export function Burger({ label = false }: { label?: boolean }) {
  return (
    <span className="mbtn">
      {label && <span className="mbtn-word">Menu</span>}
      <span className="mbtn-icon" aria-hidden="true">
        <span />
        <span />
      </span>
    </span>
  );
}
