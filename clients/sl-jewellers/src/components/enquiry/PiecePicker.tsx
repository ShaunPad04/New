"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { BasketItem } from "@/lib/basket";

export type PickPiece = BasketItem;
export const MAX_PICK = 12;

/** The shop's pieces as a searchable grid of photos to tap, one or several. */
export default function PiecePicker({ pieces, sel, setSel, onDone, onNone }: { pieces: PickPiece[]; sel: PickPiece[]; setSel: (s: PickPiece[]) => void; onDone: () => void; onNone: () => void }) {
  const [find, setFind] = useState("");
  const [cat, setCat] = useState("All");
  // whatever arrived already chosen leads the grid; order then stays put while tapping
  const [lead] = useState(() => new Set(sel.map((x) => x.id)));
  const ordered = useMemo(() => [...pieces.filter((p) => lead.has(p.id)), ...pieces.filter((p) => !lead.has(p.id))], [pieces, lead]);
  const cats = useMemo(() => ["All", ...Array.from(new Set(pieces.map((p) => p.category)))], [pieces]);
  const f = find.trim().toLowerCase();
  const list = ordered.filter((p) => (cat === "All" || p.category === cat) && (!f || `${p.title} ${p.category}`.toLowerCase().includes(f)));
  const on = (id: string) => sel.some((x) => x.id === id);
  const toggle = (p: PickPiece) => setSel(on(p.id) ? sel.filter((x) => x.id !== p.id) : sel.length < MAX_PICK ? [...sel, p] : sel);
  return (
    <div className="epk">
      <div className="epk-top">
        <label className="epk-find">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M13.2 13.2L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <span className="sr-only">Search the pieces</span>
          <input type="search" value={find} onChange={(ev) => setFind(ev.target.value)} placeholder="Search: Submariner, belcher, bangle…" />
        </label>
        <div className="epk-cats" role="group" aria-label="Category">
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <ul className="epk-grid" aria-label="Pieces on the site" data-lenis-prevent>
        {list.map((p) => (
          <li key={p.id}>
            <button type="button" className="epk-piece" aria-pressed={on(p.id)} onClick={() => toggle(p)}>
              <span className="epk-piece-img">
                <Image src={p.image} alt="" fill sizes="120px" />
                <span className="epk-piece-tick" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </span>
              <span className="epk-piece-name">{p.title}</span>
            </button>
          </li>
        ))}
        {!list.length && <li className="epk-none">Nothing matches. Carry on and describe it instead.</li>}
      </ul>
      <div className="epk-foot">
        <button type="button" className="epk-skip" onClick={onNone}>
          It isn&rsquo;t on the site
        </button>
        <button type="button" className="ef-send epk-go" onClick={onDone} disabled={!sel.length}>
          <span>{sel.length ? `Done, ${sel.length} chosen` : "Tap a piece"}</span>
        </button>
      </div>
    </div>
  );
}
