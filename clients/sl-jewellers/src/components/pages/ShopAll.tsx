"use client";

import { useEffect, useState } from "react";
import type { CardPiece } from "@/lib/content";
import WatchCard from "@/components/shop/WatchCard";

/**
 * Shop all: every piece S&L have listed, in one grid, with a chip per category to narrow it
 * (Shaun, 7 Oct 2026: "when you click shop all, it should show absolutely every product").
 * Every card is in the HTML; a chip only hides the others, and ?cat=<slug> opens on one.
 */
export type ShopCategory = { slug: string; title: string; pieces: CardPiece[] };

export default function ShopAll({ cats }: { cats: ShopCategory[] }) {
  const [on, setOn] = useState<string>("all");
  const total = cats.reduce((n, c) => n + c.pieces.length, 0);

  // open on ?cat=<slug> and keep the address in step, so a filtered view can be shared
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("cat");
    if (q && cats.some((c) => c.slug === q)) setOn(q);
  }, [cats]);
  const pick = (slug: string) => {
    setOn(slug);
    const u = new URL(location.href);
    if (slug === "all") u.searchParams.delete("cat");
    else u.searchParams.set("cat", slug);
    history.replaceState(history.state, "", u);
  };

  const chips = [{ slug: "all", title: "All", n: total }, ...cats.map((c) => ({ slug: c.slug, title: c.title, n: c.pieces.length }))];
  const shown = on === "all" ? total : cats.find((c) => c.slug === on)?.pieces.length ?? 0;

  return (
    <div className="shop">
      <div className="shop-bar">
        <div className="shop-chips" role="group" aria-label="Show">
          {chips.map((c) => (
            <button key={c.slug} type="button" className="shop-chip" aria-pressed={on === c.slug} onClick={() => pick(c.slug)}>
              {c.title} <span className="tnum">{c.n}</span>
            </button>
          ))}
        </div>
        <p className="shop-count tnum" aria-live="polite">
          {shown} {shown === 1 ? "piece" : "pieces"}
        </p>
      </div>
      <ul className="shop-grid">
        {cats.flatMap((c, ci) =>
          c.pieces.map((p, pi) => (
            <li key={p.id} hidden={on !== "all" && on !== c.slug}>
              {/* the first row is the page's first screen */}
              <WatchCard piece={p} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw" priority={ci === 0 && pi < 2} />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
