"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type IndexPiece = { id: string; title: string; image: string; alt: string; href: string; name: string; detail: string };

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Category C, "Stock list" (round 7, 7 Oct 2026; after watch dealers' stock books and 21st's
 * hover-reveal lists): every piece as one ruled line, number, name, details and "Ask for a
 * price", with a large framed photo held beside the list that changes to the line under the
 * pointer or keyboard focus. Phones: each line carries its own small photo.
 */
export default function CategoryIndex({ pieces }: { pieces: IndexPiece[] }) {
  const [active, setActive] = useState(0);
  const cur = pieces[active];
  return (
    <div className="cxc">
      <ol className="cxc-list">
        {pieces.map((p, i) => (
          <li key={p.id}>
            <Link
              href={p.href}
              className={`cxc-row${i === active ? " is-on" : ""}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="cxc-thumb" aria-hidden="true">
                <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span className="cxc-no tnum" aria-hidden="true">{num(i)}</span>
              <span className="cxc-text">
                <span className="cxc-name">{p.name}</span>
                {p.detail && <span className="cxc-detail">{p.detail}</span>}
              </span>
              <span className="cxc-ask">
                Ask for a price
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span className="sr-only">: {p.title}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="cxc-stage" aria-hidden="true">
        <div className="cxc-frame">
          {pieces.map((p, i) => (
            <Image key={p.id} src={p.image} alt="" fill sizes="(min-width: 1024px) 34vw, 1px" className={`cxc-img${i === active ? " is-on" : ""}`} />
          ))}
        </div>
        <p className="cxc-cap">
          <span className="tnum">{num(active)}</span> {cur.name}
        </p>
      </div>
    </div>
  );
}
