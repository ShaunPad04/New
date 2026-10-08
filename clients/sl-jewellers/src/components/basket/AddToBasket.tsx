"use client";

import { basket, useBasket, type BasketItem } from "@/lib/basket";

/** "Add to basket" on a piece's page; once added it reads "In your basket" and opens the basket.
 *  Words only: the + disc beside them is gone (Shaun, 8 Oct 2026: "remove this"). */
export default function AddToBasket({ item, className = "" }: { item: BasketItem; className?: string }) {
  const { items } = useBasket();
  const inBasket = items.some((x) => x.id === item.id);
  return (
    <button type="button" className={`bkt-add${inBasket ? " is-in" : ""} ${className}`} onClick={() => (inBasket ? basket.open() : basket.add(item))} aria-pressed={inBasket}>
      <span>{inBasket ? "In your basket" : "Add to basket"}</span>
    </button>
  );
}
