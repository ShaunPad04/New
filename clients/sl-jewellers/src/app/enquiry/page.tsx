import type { Metadata } from "next";
import { EnquiryCounter } from "@/components/pages/EnquiryLayouts";

export const metadata: Metadata = {
  title: "Make an Enquiry, Jewellers in Cleethorpes",
  description:
    "Ask S&L Jewellers in Cleethorpes about buying a piece, selling gold, part-exchange or a repair. Send a photo and we will come back with a straight answer.",
  alternates: { canonical: "/enquiry" },
};

// Static page: the ?type=, ?item= and ?basket= prefill is read on the client, so the
// metadata ships in <head> and the page is served from the CDN.
export default function EnquiryPage() {
  return (
    <div className="on-black enq">
      <EnquiryCounter />
    </div>
  );
}
