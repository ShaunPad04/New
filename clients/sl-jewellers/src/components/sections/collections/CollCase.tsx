"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CollTile } from "./data";

/**
 * Shop by collection, option C "Display case": the categories as one row of trays to swipe
 * across, like the shop's window, each a photo set in a dark tray with its name and count
 * under it. Arrows and a hairline of progress on a computer; a swipe on a phone.
 */
export default function CollCase({ tiles }: { tiles: CollTile[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const on = () => setP(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
    on();
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, []);
  const step = (d: number) => {
    const el = rail.current;
    const card = el?.querySelector("li");
    if (el && card) el.scrollBy({ left: d * (card.getBoundingClientRect().width + 14), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <div className="clc">
      <ul ref={rail} className="clc-rail" aria-label="Collections">
        {tiles.map((t) => (
          <li key={t.slug}>
            <Link href={t.href} className={`clc-card${t.empty ? " is-empty" : ""}`}>
              <span className="clc-tray">
                <span className="clc-plate">
                  <Image src={t.image} alt="" fill sizes="(min-width: 900px) 24vw, 70vw" className="clc-img" style={{ objectPosition: t.focus }} />
                </span>
              </span>
              <span className="clc-name">{t.title}</span>
              <span className="clc-count tnum">{t.empty ? "Ask what is in" : `${t.count} in the case`}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="clc-foot">
        <span className="clc-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${0.18 + p * 0.82})` }} />
        </span>
        <div className="clc-steps">
          <button type="button" className="clc-step" onClick={() => step(-1)} aria-label="Previous collections">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" className="clc-step" onClick={() => step(1)} aria-label="More collections">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
