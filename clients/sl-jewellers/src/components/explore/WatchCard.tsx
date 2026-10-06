import Image from "next/image";
import Link from "next/link";
import type { Piece } from "@/lib/content";
import { enquiryHref, splitTitle } from "./watch-data";

/** A product card for the watch options: the photo, S&L's title, "Ask for a price" and Enquire. Enquiry only, never a basket. */
export default function WatchCard({ piece, sizes, rail = false, tag }: { piece: Piece; sizes: string; rail?: boolean; tag?: string }) {
  const { name, detail } = splitTitle(piece.title);
  return (
    <Link href={enquiryHref(piece)} className="pcard" data-rail-item={rail || undefined} aria-label={`${piece.title}: ask for a price`}>
      <span className="pcard-media">
        <Image src={piece.image} alt={piece.alt} fill sizes={sizes} className="pcard-img" />
        {tag && <span className="pcard-tag">{tag}</span>}
      </span>
      <span className="pcard-body">
        <span className="pcard-name">{name}</span>
        {detail && <span className="pcard-detail">{detail}</span>}
        <span className="pcard-foot">
          <span className="pcard-price">Ask for a price</span>
          <span className="pcard-enq">
            Enquire
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </span>
      </span>
    </Link>
  );
}
