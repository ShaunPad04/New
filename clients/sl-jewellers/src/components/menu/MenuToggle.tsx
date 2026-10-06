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

/** Two lines that cross into an X while the menu is open (CSS keys off the button's aria-expanded). */
export function Burger() {
  return (
    <span className="burger" aria-hidden="true">
      <span />
      <span />
    </span>
  );
}
