"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MENU_EVENT, isMenuOpen, setMenu } from "./menu-state";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const visible = (el: Element) => (el as HTMLElement).getClientRects().length > 0;

/**
 * Behaviour shared by every menu variant:
 *  - on open, move focus into the panel and pause smooth scroll; on close, give focus back
 *    to the toggle that opened it. Nothing is measured on open: reading layout straight after
 *    <html data-menu-open> flips forces a restyle of the whole page, which on the home page
 *    was most of a 200 ms tap on a throttled phone (pre-launch QA, 8 Oct 2026)
 *  - Escape, a tap outside the panel and header, a close button or any link closes it
 *  - full-screen and drawer variants keep Tab inside the panel and its toggle
 *  - a route change closes it
 */
export default function MenuController() {
  const pathname = usePathname();

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const root = document.getElementById("site-menu");
    if (!root) return;
    let opener: HTMLElement | null = null;
    // Opened from the keyboard: focus goes to the first link. Opened with a mouse or a finger:
    // focus goes to the panel itself, so no focus ring is drawn round a word nobody chose.
    let keyboard = false;
    const onKeyInput = () => (keyboard = true);
    const onPointerInput = () => (keyboard = false);
    const panel = () => [...root.querySelectorAll<HTMLElement>("[data-menu-panel]")].find(visible) ?? null;
    const header = () => [...document.querySelectorAll<HTMLElement>("[data-site-header]")].find(visible) ?? null;
    const trap = () => panel()?.hasAttribute("data-menu-trap") ?? false;

    const onChange = () => {
      const open = isMenuOpen();
      if (open) {
        opener = document.activeElement as HTMLElement | null;
        window.dispatchEvent(new Event("lenis:stop"));
        // the panel is looked up inside the timer, after the frame that shows it, so the tap
        // itself measures nothing; focus() returns undefined, so pick the target first rather
        // than chaining the calls with ??
        setTimeout(() => {
          const p = panel();
          if (p) (keyboard ? ([...p.querySelectorAll<HTMLElement>("[data-menu-first]")].find(visible) ?? [...p.querySelectorAll<HTMLElement>(FOCUSABLE)].find(visible)) : p)?.focus({ preventScroll: true });
        }, 60);
      } else {
        window.dispatchEvent(new Event("lenis:start"));
        // after the frame that hides the menu, as on open (visible() and focus() both need fresh styles)
        const back = opener;
        opener = null;
        setTimeout(() => {
          if (back && document.contains(back) && visible(back)) back.focus({ preventScroll: true });
        }, 60);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (!isMenuOpen()) return;
      if (e.key === "Escape") return setMenu(false);
      if (e.key !== "Tab" || !trap()) return;
      const p = panel();
      // A panel with its own close button covers the header, so the header's toggle drops out of the loop.
      const toggle = p?.querySelector("[data-menu-close]") ? undefined : [...(header()?.querySelectorAll<HTMLElement>("[data-menu-toggle]") ?? [])].find(visible);
      const items = [...(toggle ? [toggle] : []), ...[...(p?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])].filter(visible)];
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === items.length - 1 ? 0 : i + 1;
      e.preventDefault();
      items[next].focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!isMenuOpen()) return;
      const t = e.target as Element;
      if (t.closest("[data-menu-close]")) return; // handled on click
      if (t.closest("[data-menu-toggle]") || t.closest("[data-menu-surface]")) return;
      if (header()?.contains(t)) return;
      setMenu(false);
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest("[data-menu-close]") || t.closest("#site-menu a[href]")) setMenu(false);
    };
    document.addEventListener("keydown", onKeyInput, true);
    document.addEventListener("pointerdown", onPointerInput, true);
    window.addEventListener(MENU_EVENT, onChange);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyInput, true);
      document.removeEventListener("pointerdown", onPointerInput, true);
      window.removeEventListener(MENU_EVENT, onChange);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
