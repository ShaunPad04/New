import type { Metadata } from "next";
import { EnquiryCounter, EnquiryLetter, EnquiryReasons } from "@/components/pages/EnquiryLayouts";

export const metadata: Metadata = {
  title: "Make an enquiry",
  description:
    "Tell S&L Jewellers what you are after: buying, selling gold, part-exchange or a repair. Send a photo and we will come back with a straight answer.",
  alternates: { canonical: "/enquiry" },
};

// Static page: the ?type=, ?item= and ?basket= prefill is read on the client, so the
// metadata ships in <head> and the page is served from the CDN.
export default function EnquiryPage() {
  return (
    <div className="on-black enq">
      {/* Round 7 of the walk-through (7 Oct 2026): three layouts on the preview switch, ?v=enq:b */}
      <div data-x="enq" data-x-dir="a">
        <EnquiryCounter />
      </div>
      <div data-x="enq" data-x-dir="b">
        <EnquiryReasons />
      </div>
      <div data-x="enq" data-x-dir="c">
        <EnquiryLetter />
      </div>
    </div>
  );
}
