import Image from "next/image";
import { Suspense } from "react";
import { BUSINESS, HOURS_ON } from "@/lib/content";
import OpenNowChip from "@/components/OpenNowChip";
import { ContactPills } from "./enquiry-parts";
import FormSteps from "@/components/enquiry/FormSteps";
import FormRefined from "@/components/enquiry/FormRefined";
import FormChat from "@/components/enquiry/FormChat";

/**
 * The enquiry page, "At the counter" (Shaun's pick of three in round 7, 7 Oct 2026, after he
 * called the old page "very generic and bad"): the shop's own photo with the open-now chip on
 * it, the four ways to reach it as pills, and the form beside them. The form itself is being
 * chosen from three designs on the walk-through's switch (?v=form:a|b|c): A step by step,
 * B one refined page, C a chat with the counter. All three send the same fields through the
 * same checks (components/enquiry). Arriving from the basket (?basket=1) lists its pieces.
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
      <div className="enqa-form">
        <div data-x="form" data-x-dir="a">
          <Suspense fallback={null}>
            <FormSteps />
          </Suspense>
        </div>
        <div data-x="form" data-x-dir="b">
          <Suspense fallback={null}>
            <FormRefined />
          </Suspense>
        </div>
        <div data-x="form" data-x-dir="c">
          <Suspense fallback={null}>
            <FormChat />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
