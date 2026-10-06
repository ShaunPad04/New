"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import type { Collection } from "@/lib/content";
import WatchCard from "./WatchCard";

/**
 * Watch shop C, "Tabbed shop grid" (round 2; 21st "Ecommerce Category Page"): tabs for the
 * four stocked categories, watches first, each showing eight pieces as product cards with a
 * quick Enquire and a link to the rest. ARIA tabs: arrow keys move between them.
 */
export default function ShopTabs({ cats, heading }: { cats: Collection[]; heading: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (active + d + cats.length) % cats.length;
    setActive(n);
    tabs.current[n]?.focus();
  };
  const c = cats[active];
  return (
    <>
      <div className="stabs-head">
        {heading}
        <div role="tablist" aria-label="Shop by category" className="stabs" onKeyDown={onKey}>
          {cats.map((cat, i) => (
            <button
              key={cat.slug}
              ref={(n) => void (tabs.current[i] = n)}
              type="button"
              role="tab"
              id={`stab-${cat.slug}`}
              aria-selected={i === active}
              aria-controls={`spanel-${cat.slug}`}
              tabIndex={i === active ? 0 : -1}
              className="stab"
              onClick={() => setActive(i)}
            >
              {cat.title} <span className="tnum">{cat.pieces?.length}</span>
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel" id={`spanel-${c.slug}`} aria-labelledby={`stab-${c.slug}`} className="stabs-panel" key={c.slug}>
        <ul className="stabs-grid">
          {(c.pieces ?? []).slice(0, 8).map((p) => (
            <li key={p.id}>
              <WatchCard piece={p} sizes="(min-width: 1024px) 22vw, 46vw" />
            </li>
          ))}
        </ul>
        <Link href={`/pieces/${c.slug}`} className="link-arrow mt-8">
          All {c.pieces?.length} {c.title.toLowerCase()} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </>
  );
}
