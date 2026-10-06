"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { TILES } from "@/components/sections/ServiceTiles";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * What we do C, "Hover index" (round 3; 21st "Hover Image List"): the three services as large
 * numbered rows divided by hairlines; the row under the pointer brings up its photo, which
 * follows the cursor. Keyboard focus shows the photo too. Phones and reduced motion get a
 * small still photo in each row instead.
 */
export default function WhatWeDoIndex() {
  const list = useRef<HTMLUListElement>(null);
  const [hot, setHot] = useState(-1);
  const move = (e: PointerEvent) => {
    const el = list.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <section className="on-black section" aria-labelledby="tiles-title-c">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">What we do</p>
          <SplitHeading id="tiles-title-c" text={"Exchange, source,\n*repair.*"} className="display-l mt-3" />
        </Reveal>
        <ul ref={list} className="wwi mt-12" onPointerMove={move} onPointerLeave={() => setHot(-1)}>
          {TILES.map((t, i) => (
            <li key={t.href}>
              <Link href={t.href} className="wwi-row" onPointerEnter={() => setHot(i)} onFocus={() => setHot(i)} onBlur={() => setHot(-1)}>
                <span className="wwi-num tnum">{String(i + 1).padStart(2, "0")}</span>
                <span className="wwi-main">
                  <span className="wwi-cat">{t.category}</span>
                  <span className="wwi-title">{t.title}</span>
                </span>
                <span className="wwi-desc">{t.description}</span>
                <span className="wwi-thumb">
                  <Image src={t.image} alt="" fill sizes="120px" className="object-cover" />
                </span>
                <span className="wwi-cta">
                  {t.cta} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
          <li className="wwi-float" aria-hidden="true">
            {TILES.map((t, i) => (
              <Image key={t.href} src={t.image} alt="" fill sizes="360px" className={`wwi-float-img${i === hot ? " is-on" : ""}`} />
            ))}
          </li>
        </ul>
      </div>
    </section>
  );
}
