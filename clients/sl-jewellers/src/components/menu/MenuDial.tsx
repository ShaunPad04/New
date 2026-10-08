"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export type MenuItem = { href: string; label: string; desc: string; image: string };

/**
 * The menu's body, "Dial" (Shaun's pick C of three on 8 Oct 2026, over A Split stage and
 * B Cinema): the six items sit round a fine watch dial like hour markers; a gold hand swings to
 * the item under the pointer or keyboard focus and its photo shows in the dial's centre, with
 * its line underneath. Phones get the items as a centred list. Lives inside the drop-down
 * curtain (SiteMenu.tsx).
 */
export default function MenuDial({ items, foot }: { items: MenuItem[]; foot: ReactNode }) {
  const [active, setActive] = useState(0);
  const on = (i: number) => ({
    onPointerEnter: () => setActive(i),
    onFocus: () => setActive(i),
  });
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <>
      <div className="mC">
        <div className="mC-dial" style={{ "--a": `${active * 60}deg` } as CSSProperties}>
          <svg className="mC-ring" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.35" />
            {Array.from({ length: 60 }, (_, k) => (
              <line key={k} x1="100" y1={k % 5 === 0 ? 4 : 2.5} x2="100" y2={k % 5 === 0 ? 9 : 5.5} stroke="currentColor" strokeWidth={k % 5 === 0 ? 0.7 : 0.35} transform={`rotate(${k * 6} 100 100)`} />
            ))}
          </svg>
          <div className="mC-face" aria-hidden="true">
            {items.map((it, i) => (
              <Image key={it.href} src={it.image} alt="" fill sizes="(min-width: 768px) 320px, 1px" quality={90} className={`mC-img${i === active ? " is-on" : ""}`} />
            ))}
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
        <p className="mC-cap" aria-hidden="true">{items[active].desc}</p>
      </div>
      {foot}
    </>
  );
}
