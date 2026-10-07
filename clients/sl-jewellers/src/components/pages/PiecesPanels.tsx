import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CATEGORY_CARDS } from "./pieces-data";
import { countLine, num2 } from "./pieces-format";

/**
 * /pieces A, "Expanding panels" (round 7, 7 Oct 2026; after 21st's expanding image
 * accordions): every category as a tall slice side by side, the name running up it. The
 * slice under the pointer or keyboard focus opens wide, its photo brightens and the name,
 * count and blurb slide in. CSS only. Phones: a stack of photo bands.
 */
export default function PiecesPanels() {
  return (
    <ul className="pxa" aria-label="Categories">
      {CATEGORY_CARDS.map((c, i) => (
        <li key={c.slug} className="pxa-item" style={{ "--i": i } as CSSProperties}>
          <Link href={`/pieces/${c.slug}`} className="pxa-link">
            {c.image && <Image src={c.image} alt="" fill sizes="(min-width: 900px) 46vw, 100vw" className="pxa-img" style={{ objectPosition: c.focus }} />}
            <span className="pxa-v" aria-hidden="true">
              <span className="tnum">{num2(i)}</span> {c.title}
            </span>
            <span className="pxa-h">
              <span className="pxa-num tnum" aria-hidden="true">{num2(i)}</span>
              <span className="pxa-name">{c.title}</span>
              <span className="pxa-blurb">{c.blurb}</span>
              <span className="pxa-count">
                {countLine(c.count)}
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
