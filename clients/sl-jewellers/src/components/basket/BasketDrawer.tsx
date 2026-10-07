"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { basket, useBasket } from "@/lib/basket";

/**
 * The basket drawer: slides in from the right over a dimmed page. Each piece with its photo
 * and a remove button; "Enquire about these" takes the list to the enquiry form, where the
 * shop prices them. No prices, no checkout. Escape, the dimmed page and the close button shut
 * it; focus moves in on open and back to where it was on close; Tab stays inside.
 */
export default function BasketDrawer() {
  const { items, open } = useBasket();
  const panel = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    back.current = document.activeElement as HTMLElement | null;
    document.documentElement.setAttribute("data-basket-open", "");
    const p = panel.current;
    requestAnimationFrame(() => p?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") basket.close();
      if (e.key !== "Tab" || !p) return;
      const f = [...p.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === p)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-basket-open");
      back.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  const n = items.length;
  return (
    <div className={`bkt${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open}>
      <div className="bkt-scrim" onClick={() => basket.close()} />
      <div ref={panel} className="bkt-panel" role="dialog" aria-modal="true" aria-labelledby="bkt-title" tabIndex={-1} data-lenis-prevent>
        <div className="bkt-head">
          <p id="bkt-title" className="bkt-title">
            Your basket <span className="tnum">({n})</span>
          </p>
          <button type="button" className="bkt-close" onClick={() => basket.close()} aria-label="Close the basket">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        {n ? (
          <ul className="bkt-list">
            {items.map((it) => (
              <li key={it.id} className="bkt-item">
                <Link href={it.href} className="bkt-thumb" onClick={() => basket.close()} tabIndex={-1} aria-hidden="true">
                  <Image src={it.image} alt="" fill sizes="72px" className="object-cover" />
                </Link>
                <div className="bkt-text">
                  <Link href={it.href} className="bkt-name" onClick={() => basket.close()}>{it.title}</Link>
                  <p className="bkt-cat">{it.category} · Price on request</p>
                </div>
                <button type="button" className="bkt-remove" onClick={() => basket.remove(it.id)} aria-label={`Remove ${it.title}`}>
                  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bkt-empty">
            <p className="text-paper">Nothing in here yet.</p>
            <p className="mt-2 text-wall">Add the pieces you like and send them over in one enquiry. We come back with prices.</p>
            <Link href="/pieces" className="link-arrow mt-4" onClick={() => basket.close()}>
              Shop all <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        <div className="bkt-foot">
          <p className="bkt-note">No prices online and nothing to pay here. Send the list and the shop comes back to you with prices, usually the same day.</p>
          {n > 0 && (
            <Link href="/enquiry?type=buying&basket=1" className="plan-cta bkt-go" onClick={() => basket.close()}>
              <span>Enquire about {n === 1 ? "this piece" : `these ${n}`}</span>
              <span className="plan-disc" aria-hidden="true">
                <svg viewBox="0 0 16 16" className="plan-arrow"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
