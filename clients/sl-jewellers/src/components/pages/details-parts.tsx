import Link from "next/link";
import type { PieceDetails, Row } from "@/lib/piece-details";

/** The pieces of the product page's details (DetailsTabs.tsx, ProductViews.tsx). */
export function Rows({ rows, className = "" }: { rows: Row[]; className?: string }) {
  return (
    <dl className={`pdx-rows ${className}`}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Source({ d }: { d: PieceDetails }) {
  if (!d.spec) return null;
  return (
    <p className="pdx-src">
      Source:{" "}
      <a href={d.spec.source.url} target="_blank" rel="noopener nofollow">
        {d.spec.source.name}
      </a>
    </p>
  );
}

export function Notes({ notes }: { notes: string[] }) {
  return (
    <ul className="pdx-notes">
      {notes.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  );
}

export function Ask({ href }: { href: string }) {
  return (
    <Link href={href} className="pdx-ask">
      Ask about this piece <span aria-hidden="true">→</span>
    </Link>
  );
}
