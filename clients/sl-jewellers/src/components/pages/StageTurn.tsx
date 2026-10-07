"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";

/**
 * The piece on the product stage, front and back on one plate that turns over (Shaun, 7 Oct
 * 2026: "upon hovering the watches, it should show the back of the watch as well as the front
 * ... same with all of the products"). A mouse turns it by moving over it; a tap turns it on a phone;
 * the Front / Back switch does it from the keyboard and pins it. Transform only; with reduced
 * motion the two faces cross-fade instead. A piece without a back is the plain photo it was.
 */
export default function StageTurn({ front, back, alt, cut }: { front: string; back?: string; alt: string; cut: boolean }) {
  const [side, setSide] = useState<"front" | "back">("front");
  // the switch pins a side; hovering only turns it while the pointer is over the piece
  const pinned = useRef(false);
  const choose = (s: "front" | "back") => {
    pinned.current = s === "back";
    setSide(s);
  };
  const mouse = (e: PointerEvent) => e.pointerType === "mouse";
  // a mouse turns it once it actually moves over the piece: a cursor that happens to rest where
  // the piece appears (arriving from a card, or scrolling) leaves the front showing
  const from = useRef<[number, number] | null>(null);
  const enter = (e: PointerEvent) => { if (mouse(e)) from.current = [e.clientX, e.clientY]; };
  const move = (e: PointerEvent) => {
    if (!mouse(e) || pinned.current || side === "back") return;
    const o = from.current;
    if (!o) from.current = [e.clientX, e.clientY];
    else if (Math.hypot(e.clientX - o[0], e.clientY - o[1]) > 6) setSide("back");
  };
  const leave = (e: PointerEvent) => {
    if (!mouse(e)) return;
    from.current = null;
    if (!pinned.current) setSide("front");
  };
  // a finger or pen turns it with a tap
  const tap = (e: PointerEvent) => !mouse(e) && choose(side === "front" ? "back" : "front");
  const sizes = "(min-width: 900px) 46vw, 92vw";
  const cls = `pdb-photo${cut ? " is-cut" : ""}${back ? " has-back" : ""}`;

  if (!back) {
    return (
      <div className={cls}>
        <Image src={front} alt={alt} fill priority sizes={sizes} className="pdb-img" />
      </div>
    );
  }
  return (
    <>
      <div className={cls} data-side={side} onPointerEnter={enter} onPointerMove={move} onPointerLeave={leave} onPointerUp={tap}>
        <div className="pdb-turn">
          <div className="pdb-face is-front" aria-hidden={side === "back"}>
            <Image src={front} alt={alt} fill priority sizes={sizes} className="pdb-img" />
          </div>
          <div className="pdb-face is-back" aria-hidden={side === "front"}>
            <Image src={back} alt={`The back of the ${alt.charAt(0).toLowerCase()}${alt.slice(1)}`} fill sizes={sizes} className="pdb-img" />
          </div>
        </div>
      </div>
      <div className="pdb-sides" role="group" aria-label="Show the front or the back">
        <button type="button" className="pdb-side" aria-pressed={side === "front"} onClick={() => choose("front")}>
          Front
        </button>
        <button type="button" className="pdb-side" aria-pressed={side === "back"} onClick={() => choose("back")}>
          Back
        </button>
      </div>
    </>
  );
}
