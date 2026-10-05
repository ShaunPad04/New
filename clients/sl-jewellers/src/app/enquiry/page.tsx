import type { Metadata } from "next";
import { Suspense } from "react";
import { BUSINESS, HOURS_ON, WHATSAPP_ON, whatsappUrl } from "@/lib/content";
import EnquiryForm from "@/components/EnquiryForm";
import OpenNowChip from "@/components/OpenNowChip";

export const metadata: Metadata = {
  title: "Make an enquiry",
  description:
    "Tell S&L Jewellers what you are after: buying, selling gold, part-exchange or a repair. Send a photo and we will come back with a straight answer.",
  alternates: { canonical: "/enquiry" },
};

// Static page: the ?type= and ?item= prefill is read on the client, so the
// metadata ships in <head> and the page is served from the CDN.
export default function EnquiryPage() {
  const b = BUSINESS;

  return (
    <div className="on-fog">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20 lg:py-24">
        <div>
          <p className="eyebrow">Enquiry</p>
          <h1 className="display-l mt-3">Tell us what you are after.</h1>
          <p className="mt-5 max-w-[42ch] text-steel">
            Buying, selling gold, a trade-in or something made to order. Send a photo if you have one and we will come back with a straight answer.
          </p>
          <div className="mt-8 space-y-3 text-[15px]">
            <p>
              <a href={`tel:${b.phone.e164}`} className="font-semibold tnum">
                {b.phone.display}
              </a>
            </p>
            {WHATSAPP_ON && (
              <p>
                <a href={whatsappUrl()} target="_blank" rel="noopener" className="font-semibold">
                  WhatsApp us
                </a>
              </p>
            )}
            <p>
              <a href={`mailto:${b.email}`} className="font-semibold">
                {b.email}
              </a>
            </p>
            <p className="text-steel">
              {b.address.street}, {b.address.town} {b.address.postcode}
            </p>
            {HOURS_ON && <OpenNowChip />}
            {HOURS_ON && b.hours.enquiriesNote && <p className="mt-3 text-sm text-wall">{b.hours.enquiriesNote}</p>}
          </div>
        </div>
        <div className="card card-fog p-5 sm:p-8">
          <Suspense fallback={null}>
            <EnquiryForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
