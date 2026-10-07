import Image from "next/image";
import { Suspense } from "react";
import { BUSINESS, HOURS_ON } from "@/lib/content";
import OpenNowChip from "@/components/OpenNowChip";
import EnquiryForm from "@/components/EnquiryForm";
import { ContactPills, DarkForm } from "./enquiry-parts";
import EnquiryReasonForm from "./EnquiryReasonForm";
import EnquiryReasonTiles, { type Reason } from "./EnquiryReasonTiles";

/**
 * The enquiry page, three layouts on the walk-through's switch (?v=enq:a|b|c; round 7,
 * 7 Oct 2026, after Shaun called the old page "very generic and bad"). Same form, same
 * fields, same server checks in all three; what changes is how the page greets you.
 *   A  At the counter: the shop's own photo with the open-now chip on it, the four ways to
 *      reach it as pills, the form beside them.
 *   B  What's it about: six large tiles first (buying, selling gold, part-exchange, repairs,
 *      sourcing, something else); choosing one sets the form's subject and brings it up.
 *   C  A note to the shop: a short letter on ivory stationery under the S&L mark, the form
 *      written as its lines, the other ways to reach the shop signed off underneath.
 * Arriving from the basket (?basket=1) the form lists the pieces in every layout.
 */
const b = BUSINESS;

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
        <ContactPills className="mt-6" />
        {HOURS_ON && b.hours.enquiriesNote && <p className="enq-note">{b.hours.enquiriesNote}</p>}
      </div>
      <DarkForm className="enqa-form" />
    </div>
  );
}

const REASONS: Reason[] = [
  { type: "buying", label: "Buying a piece", line: "Something in the case, or on the site", image: "/images/reviews/case.2026-10-07.webp" },
  { type: "selling-gold", label: "Selling gold", line: "Weighed and priced in front of you", image: "/images/reviews/weighed.2026-10-07.webp" },
  { type: "part-exchange", label: "Part-exchange", line: "Trade what you have against what you want", image: "/images/services/exchange.2026-10-06-3.webp" },
  { type: "repair", label: "A repair", line: "Repairs and soldering, done in the shop", image: "/images/services/repairs.2026-10-06-2.webp" },
  { type: "bespoke", label: "Sourcing a piece", line: "Not in the case? We find it, or make it", image: "/images/services/sourcing.2026-10-06-3.webp" },
  { type: "other", label: "Something else", line: "Any question at all", image: "/images/menu/contact.webp" },
];

export function EnquiryReasons() {
  return (
    <div className="wrap enqb">
      <header className="enqb-head">
        <p className="eyebrow">Enquiry</p>
        <h1 className="enq-h">
          What is it <span className="text-gold">about?</span>
        </h1>
        <p className="enq-lede">Pick one and the form below is set up for it. Enquiries are answered 24/7, any day of the week.</p>
      </header>
      <Suspense fallback={null}>
        <EnquiryReasonTiles reasons={REASONS} />
      </Suspense>
      <div id="enquiry-form" className="enqb-form">
        <div className="enqb-form-side">
          <p className="enqb-form-title">Your enquiry</p>
          <p className="enq-lede">Or skip the form:</p>
          <ContactPills className="enq-pills-stack" />
        </div>
        <div className="enq-dark">
          <Suspense fallback={null}>
            <EnquiryReasonForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export function EnquiryLetter() {
  return (
    <div className="wrap enqc">
      <div className="enqc-sheet">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.svg" alt="" width="44" height="44" className="enqc-mark" />
        <p className="enqc-to">To S&amp;L Jewellers, {b.address.street}, {b.address.town}</p>
        <h1 className="enqc-h">A note to the shop.</h1>
        <p className="enqc-lede">
          Tell us what you are after, or what you have got. Enquiries are answered 24/7, any day of the week, and we come back to you the way you ask.
        </p>
        <div className="enqc-form">
          <Suspense fallback={null}>
            <EnquiryForm />
          </Suspense>
        </div>
      </div>
      <div className="enqc-sign">
        <p className="enqc-sign-title">Or reach us directly</p>
        <ContactPills className="enq-pills-row" />
      </div>
    </div>
  );
}
