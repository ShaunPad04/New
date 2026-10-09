"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { MENU_EVENT } from "./menu-state";

export type MenuItem = { href: string; label: string; desc: string; image: string };

/**
 * The menu's body, "Dial" (Shaun's pick C of three on 8 Oct 2026, over A Split stage and
 * B Cinema): the six items sit round a fine watch dial like hour markers; a gold hand swings to
 * the item under the pointer or keyboard focus and its photo shows in the dial's centre, with
 * its line underneath. Phones get the items as a centred list. Lives inside the drop-down
 * curtain (SiteMenu.tsx).
 *
 * The photos load only once someone heads for the menu: a pointer over the menu button, focus
 * on it, a touch, or the menu opening. They used to load with every page on a computer, closed
 * menu and all (six photos, about 215 KB), and the home page's 3D mark waited behind them (9 Oct
 * 2026). The hover is a few hundred milliseconds ahead of the click and the curtain takes longer
 * than that to drop, so they are in by the time it is open. Standard quality: q90 was 28% bigger
 * with no difference at the size the dial shows them.
 */
export default function MenuDial({ items, foot }: { items: MenuItem[]; foot: ReactNode }) {
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (armed) return;
    const arm = () => setArmed(true);
    const intent = (e: Event) => {
      if (e.target instanceof Element && e.target.closest("[data-menu-toggle]")) arm();
    };
    const opts = { passive: true, capture: true } as const;
    document.addEventListener("pointerover", intent, opts);
    document.addEventListener("focusin", intent, opts);
    document.addEventListener("touchstart", intent, opts);
    window.addEventListener(MENU_EVENT, arm);
    return () => {
      document.removeEventListener("pointerover", intent, opts);
      document.removeEventListener("focusin", intent, opts);
      document.removeEventListener("touchstart", intent, opts);
      window.removeEventListener(MENU_EVENT, arm);
    };
  }, [armed]);
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
            {armed && items.map((it, i) => (
              <Image key={it.href} src={it.image} alt="" fill sizes="(min-width: 768px) 320px, 1px" className={`mC-img${i === active ? " is-on" : ""}`} />
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
