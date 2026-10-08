"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CollTile } from "./data";

/**
 * Shop by collection, option B "Index": the categories as large names in a numbered list with
 * their counts; on a computer the photo of the one under the pointer or keyboard focus shows in
 * a frame beside the list, and on a phone each name carries its own small picture.
 */
export default function CollIndex({ tiles }: { tiles: CollTile[] }) {
  const [on, setOn] = useState(0);
  return (
    <div className="clb">
      <ul className="clb-list" aria-label="Collections">
        {tiles.map((t, i) => (
          <li key={t.slug}>
            <Link href={t.href} className={`clb-row${i === on ? " is-on" : ""}${t.empty ? " is-empty" : ""}`} onPointerEnter={() => setOn(i)} onFocus={() => setOn(i)}>
              <span className="clb-thumb" aria-hidden="true">
                <Image src={t.image} alt="" fill sizes="64px" style={{ objectPosition: t.focus }} />
              </span>
              <span className="clb-n tnum" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="clb-text">
                <span className="clb-name">{t.title}</span>
                <span className="clb-count tnum">{t.empty ? "Ask what is in" : `${t.count} in the case`}</span>
              </span>
              <span className="clb-arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="clb-stage" aria-hidden="true">
        <div className="clb-frame">
          {tiles.map((t, i) => (
            <Image key={t.slug} src={t.image} alt="" fill sizes="(min-width: 900px) 34vw, 1px" className={`clb-img${i === on ? " is-on" : ""}`} style={{ objectPosition: t.focus }} />
          ))}
        </div>
        <p className="clb-cap">
          <span className="tnum">{String(on + 1).padStart(2, "0")}</span> {tiles[on].title}
        </p>
      </div>
    </div>
  );
}
