import Image from "next/image";
import Link from "next/link";
import { brandOf, type Piece } from "@/lib/content";
import { splitTitle } from "./watch-data";
import { pieceHref } from "@/lib/piece-url";

/** A product card: the photo, S&L's own title split into name and details, "Ask for a price", through to the piece's own page (Shaun, 7 Oct 2026: a product page first, not straight to the enquiry form).
 *  A piece with a back (piece.back) shows it on hover, as a shop's second picture does (Shaun: "when you hover it, it shows another image"). */
export default function WatchCard({ piece, sizes, tag }: { piece: Piece; sizes: string; tag?: string }) {
  const { name, detail } = splitTitle(piece.title);
  const brand = brandOf(piece);
  return (
    <Link href={pieceHref(piece)} className="pcard" aria-label={`${piece.title}: view the piece`}>
      <span className="pcard-media">
        <Image src={piece.image} alt={piece.alt} fill sizes={sizes} className="pcard-img" />
        {piece.back && <Image src={piece.back} alt="" fill sizes={sizes} className="pcard-img pcard-back" />}
        {tag && <span className="pcard-tag">{tag}</span>}
      </span>
      <span className="pcard-body">
        {brand && <span className="pcard-brand">{brand}</span>}
        <span className="pcard-name">{name}</span>
        {detail && <span className="pcard-detail">{detail}</span>}
        <span className="pcard-foot">
          <span className="pcard-price">Ask for a price</span>
          <span className="pcard-enq">
            View
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </span>
      </span>
    </Link>
  );
}
