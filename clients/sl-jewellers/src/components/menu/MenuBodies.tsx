"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FlipRows } from "@/components/ui/reveal-links";

export type MenuItem = { href: string; label: string; desc: string; image: string };

/**
 * Three menu layouts for a watch dealer while Shaun picks (?v=menu:b), all inside the same
 * drop-down curtain (SiteMenu.tsx). The item under the pointer or keyboard focus is "active":
 *   A  Split stage: the list on the left, a large framed photo on the right that wipes to
 *      the active item's photo, with its caption.
 *   B  Cinema: the active item's photo fills the screen behind its name set huge; the six
 *      items run along the foot as numbered tabs.
 *   C  Dial: the items sit round a fine watch dial like hour markers; a gold hand swings to
 *      the active one and its photo shows in the dial's centre. Phones get the list.
 * Images below each layout only load when that layout is the one showing.
 */
export default function MenuBodies({ items, foot }: { items: MenuItem[]; foot: ReactNode }) {
  const [active, setActive] = useState(0);
  const on = (i: number) => ({
    onPointerEnter: () => setActive(i),
    onFocus: () => setActive(i),
  });
  const num = (i: number) => String(i + 1).padStart(2, "0");
  const cur = items[active];

  // A plain function, not a component: the images keep their identity between renders.
  const photos = (sizes: string, className: string) =>
    items.map((it, i) => <Image key={it.href} src={it.image} alt="" fill sizes={sizes} quality={90} className={`${className}${i === active ? " is-on" : ""}`} />);

  return (
    <>
      {/* A · Split stage */}
      <div data-x="menu" data-x-dir="a">
        <div className="wrap mA">
          <nav aria-label="Menu" className="mA-list">
            <ul>
              {items.map((it, i) => (
                <li key={it.href} style={{ "--i": i } as CSSProperties}>
                  <Link href={it.href} className={`mA-link${i === active ? " is-on" : ""}`} aria-label={it.label} data-menu-first={i === 0 || undefined} {...on(i)}>
                    <span className="mA-num tnum" aria-hidden="true">{num(i)}</span>
                    <span className="mA-word mroll" aria-hidden="true">
                      <FlipRows text={it.label} />
                    </span>
                    <span className="mA-desc" aria-hidden="true">{it.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mA-stage" aria-hidden="true">
            <div className="mA-frame">
              {photos("(min-width: 1024px) 34vw, 1px", "mA-img")}
            </div>
            <p className="mA-cap">
              <span className="tnum">{num(active)}</span> {cur.label} <span className="mA-cap-desc">· {cur.desc}</span>
            </p>
          </div>
        </div>
        {foot}
      </div>

      {/* B · Cinema */}
      <div data-x="menu" data-x-dir="b">
        <div className="mB">
          <div className="mB-bg" aria-hidden="true">
            {photos("100vw", "mB-img")}
          </div>
          <div className="mB-title" aria-hidden="true" key={active}>
            <p className="mB-big">{cur.label}</p>
            <p className="mB-desc">{cur.desc}</p>
          </div>
          <nav aria-label="Menu" className="wrap mB-row">
            <ul>
              {items.map((it, i) => (
                <li key={it.href} style={{ "--i": i } as CSSProperties}>
                  <Link href={it.href} className={`mB-link${i === active ? " is-on" : ""}`} data-menu-first={i === 0 || undefined} {...on(i)}>
                    <span className="mB-num tnum" aria-hidden="true">{num(i)}</span>
                    <span>{it.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {foot}
        </div>
      </div>

      {/* C · Dial */}
      <div data-x="menu" data-x-dir="c">
        <div className="mC">
          <div className="mC-dial" style={{ "--a": `${active * 60}deg` } as CSSProperties}>
            <svg className="mC-ring" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.35" />
              {Array.from({ length: 60 }, (_, k) => (
                <line key={k} x1="100" y1={k % 5 === 0 ? 4 : 2.5} x2="100" y2={k % 5 === 0 ? 9 : 5.5} stroke="currentColor" strokeWidth={k % 5 === 0 ? 0.7 : 0.35} transform={`rotate(${k * 6} 100 100)`} />
              ))}
            </svg>
            <div className="mC-face" aria-hidden="true">
              {photos("(min-width: 1024px) 26vw, 1px", "mC-img")}
            </div>
            <span className="mC-hand" aria-hidden="true" />
            <span className="mC-pin" aria-hidden="true" />
            <nav aria-label="Menu" className="mC-nav">
              <ul>
                {items.map((it, i) => (
                  <li key={it.href} className="mC-pos" style={{ "--k": i } as CSSProperties}>
                    <Link href={it.href} className={`mC-link${i === active ? " is-on" : ""}`} data-menu-first={i === 0 || undefined} {...on(i)}>
                      <span className="mC-num tnum" aria-hidden="true">{num(i)}</span>
                      <span>{it.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="mC-cap" aria-hidden="true">{cur.desc}</p>
        </div>
        {foot}
      </div>
    </>
  );
}
