"use client";

import { basket, useBasket, type BasketItem } from "@/lib/basket";

/** "Add to basket" on a piece's page; once added it reads "In your basket" and opens the basket. */
export default function AddToBasket({ item, className = "" }: { item: BasketItem; className?: string }) {
  const { items } = useBasket();
  const inBasket = items.some((x) => x.id === item.id);
  return (
    <button type="button" className={`bkt-add${inBasket ? " is-in" : ""} ${className}`} onClick={() => (inBasket ? basket.open() : basket.add(item))} aria-pressed={inBasket}>
      <span className="bkt-add-icon" aria-hidden="true">
        {inBasket ? (
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : (
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        )}
      </span>
      <span>{inBasket ? "In your basket" : "Add to basket"}</span>
    </button>
  );
}
