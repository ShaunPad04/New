"use client";

import { useEffect } from "react";

/**
 * THE ONE PIECE OF SCRIPT BEHIND EVERY SCROLL ENTRANCE.
 *
 * `Reveal` and `TextReveal` are plain markup: an element carrying
 * `data-reveal` or `data-text-reveal` starts hidden (CSS, and only under
 * `@media (scripting: enabled)`) and arrives when `data-in` is set. This
 * component sets it. One IntersectionObserver for the whole document rather
 * than a hook per block, because a hook means a client boundary, and a
 * client boundary means the wrapped section is serialised into the RSC
 * payload and hydrated — see the note in reveal.tsx for what that cost.
 *
 * Elements mounted later — a carousel panel, a filtered list — are picked up
 * by the MutationObserver, so a block that remounts animates in again, as it
 * did under Motion. Once revealed an element is never hidden again: React
 * does not manage `data-in`, so a re-render leaves it alone.
 *
 * The margin matches what Motion's `viewport.margin` was, so blocks arrive at
 * the same scroll position as before. With no IntersectionObserver, every
 * block is shown at once.
 */
const SELECTOR = "[data-reveal]:not([data-in]), [data-text-reveal]:not([data-in])";

export function RevealObserver() {
  useEffect(() => {
    const show = (el: Element) => el.setAttribute("data-in", "");
    const pending = (root: Element | Document) => {
      const list: Element[] = [];
      if (root instanceof Element && root.matches(SELECTOR)) list.push(root);
      root.querySelectorAll(SELECTOR).forEach((el) => list.push(el));
      return list;
    };

    if (typeof IntersectionObserver === "undefined") {
      pending(document).forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    pending(document).forEach((el) => io.observe(el));

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) pending(node).forEach((el) => io.observe(el));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
