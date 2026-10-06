/**
 * The site menu's open state lives on <html data-menu-open>, so every header variant's
 * toggle and every menu variant's panel read the same flag without sharing React state
 * (they sit in different trees: the headers, then the menus, in the layout).
 */
export const MENU_EVENT = "menu:change";

export function isMenuOpen() {
  return document.documentElement.hasAttribute("data-menu-open");
}

export function setMenu(open: boolean) {
  const h = document.documentElement;
  if (open === isMenuOpen()) return;
  if (open) h.setAttribute("data-menu-open", "");
  else h.removeAttribute("data-menu-open");
  window.dispatchEvent(new CustomEvent(MENU_EVENT, { detail: open }));
}
