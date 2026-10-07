"use client";

import type { PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { countLine, num2, type CategoryCard } from "./pieces-format";

/**
 * /pieces C, "Lit cards" (round 7, 7 Oct 2026; after 21st's 3D tilt and spotlight cards):
 * tall cards that lean toward the pointer, with a soft light following it across the glass
 * and the photo drifting the other way. The eighth tile asks after anything not listed.
 * Touch screens and reduced motion: flat cards.
 */
const tilt = (e: PointerEvent<HTMLAnchorElement>) => {
  if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  el.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
  el.classList.add("is-lit");
};
const untilt = (e: PointerEvent<HTMLAnchorElement>) => {
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
  el.classList.remove("is-lit");
};

export default function PiecesTilt({ cards }: { cards: CategoryCard[] }) {
  return (
    <ul className="pxc" aria-label="Categories">
      {cards.map((c, i) => (
        <li key={c.slug}>
          <Link href={`/pieces/${c.slug}`} className="pxc-card" onPointerMove={tilt} onPointerLeave={untilt}>
            <span className="pxc-media">
              {c.image && <Image src={c.image} alt="" fill sizes="(min-width: 900px) 24vw, 50vw" className="pxc-img" style={{ objectPosition: c.focus }} />}
            </span>
            <span className="pxc-num tnum" aria-hidden="true">{num2(i)}</span>
            <span className="pxc-cap">
              <span className="pxc-name">{c.title}</span>
              <span className="pxc-count">{countLine(c.count)}</span>
            </span>
          </Link>
        </li>
      ))}
      <li>
        <Link href="/enquiry?type=buying" className="pxc-card pxc-ask" onPointerMove={tilt} onPointerLeave={untilt}>
          <span className="pxc-ask-mark" aria-hidden="true">?</span>
          <span className="pxc-cap">
            <span className="pxc-name">Not listed?</span>
            <span className="pxc-count">Tell us what you are after →</span>
          </span>
        </Link>
      </li>
    </ul>
  );
}
