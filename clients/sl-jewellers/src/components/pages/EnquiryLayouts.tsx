import Image from "next/image";
import { Suspense } from "react";
import { BUSINESS, COLLECTIONS, HOURS_ON } from "@/lib/content";
import { pieceHref } from "@/lib/piece-url";
import OpenNowChip from "@/components/OpenNowChip";
import EnquiryForm from "@/components/enquiry/EnquiryForm";

/**
 * The enquiry page, "At the counter" (Shaun's pick of three in round 7, 7 Oct 2026; the old
 * page was "very generic and bad"): the shop's own photo with the open-now chip on
 * it and the form beside it. No contact block: the footer carries every way to reach the shop
 * (Shaun, 7 Oct 2026). The form is one regular form (Shaun, 8 Oct 2026, in place of the chat:
 * "lets use a regular contact form"; components/enquiry/EnquiryForm.tsx). Arriving from the
 * basket or a product page brings the pieces already chosen.
 */
const b = BUSINESS;

/** Every listed piece, slimmed to what the form's piece picker shows (the visitor can tap the one they mean). */
const PIECES = COLLECTIONS.flatMap((c) =>
  (c.pieces ?? []).map((p) => ({ id: p.id, title: p.title, image: p.image, href: pieceHref(p), category: c.title })),
);

export function EnquiryCounter() {
  return (
    <div className="wrap enqa">
      <div className="enqa-side">
        <p className="eyebrow">Enquiry</p>
        <h1 className="enq-h">
          Talk to
          <br />
          <span className="text-gold">the counter.</span>
        </h1>
        <p className="enq-lede">
          Buying, selling, a trade-in or a repair. Tell us what you are after, send a photo if you have one, and you get a straight answer from
          the people behind the counter.
        </p>
        <figure className="enqa-photo">
          <Image src="/images/shop-interior.2026-10-06.webp" alt="Inside S&L Jewellers on Cambridge Street, Cleethorpes" fill sizes="(min-width: 1024px) 34vw, 92vw" className="object-cover" />
          {HOURS_ON && <OpenNowChip className="enqa-chip" />}
        </figure>
        {HOURS_ON && b.hours.enquiriesNote && <p className="enq-note">{b.hours.enquiriesNote}</p>}
      </div>
      <div className="enqa-form">
        <Suspense fallback={null}>
          <EnquiryForm pieces={PIECES} />
        </Suspense>
      </div>
    </div>
  );
}
