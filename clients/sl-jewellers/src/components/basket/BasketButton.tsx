"use client";

import { basket, useBasket } from "@/lib/basket";

/** The header's basket: a bag with the number of pieces in it; opens the basket drawer. */
export default function BasketButton() {
  const { items } = useBasket();
  const n = items.length;
  return (
    <button type="button" className="bkt-btn" onClick={() => basket.open()} aria-label={n ? `Your basket, ${n} ${n === 1 ? "piece" : "pieces"}` : "Your basket, empty"} aria-haspopup="dialog">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M6 8h12l-1 12H7L6 8Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {n > 0 && <span className="bkt-count tnum" key={n}>{n}</span>}
    </button>
  );
}
