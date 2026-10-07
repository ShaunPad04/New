"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export type Reason = { type: string; label: string; line: string; image: string };

/** Layout B's six tiles; the one matching ?type= is marked as chosen. Each sets ?type= and
 *  brings the form up, without a new page. */
export default function EnquiryReasonTiles({ reasons }: { reasons: Reason[] }) {
  const current = useSearchParams().get("type") ?? "";
  return (
    <ul className="enqb-tiles">
      {reasons.map((r, i) => (
        <li key={r.type}>
          <Link href={`/enquiry?type=${r.type}#enquiry-form`} scroll={false} replace className="enqb-tile" aria-current={current === r.type ? "true" : undefined}>
            <Image src={r.image} alt="" fill sizes="(min-width: 900px) 30vw, 46vw" className="enqb-img" />
            <span className="enqb-num tnum" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="enqb-cap">
              <span className="enqb-label">{r.label}</span>
              <span className="enqb-line">{r.line}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
