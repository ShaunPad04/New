import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageIntro, ContactBand, BackHome } from "@/components/page-shell";
import { Faq } from "@/components/faq";
import { BuildStandardsBand } from "@/components/build-standards-band";
import {
  AiBand,
  BookingsBand,
  BuildsBand,
  CrmBand,
  CreativeBand,
  PlansBand,
  RateIndex,
  SmallPrint,
} from "@/components/rate-card";
import { CREATIVE_SERVICE_READY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Fixed-price website builds and monthly plans, published openly in pounds. No hourly billing, no minimum term beyond the first month.",
  alternates: { canonical: "/pricing" },
};

/**
 * One rate card, read top to bottom (restructure, 2026-09-25): an index with
 * a figure per band, the four numbered bands, the terms together, then the
 * money questions. The reasoning is the comment at the top of rate-card.tsx.
 */
export default function PricingPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <PageIntro
          eyebrow="Pricing"
          image="/images/pages/pricing.webp"
          headingId="pricing-page-heading"
          heading="No quote required to see a number."
          lede="Agencies hide pricing because it buys them a meeting. We would rather you arrive already knowing whether we are in your range — it makes the first call about the work instead of the invoice."
        />
        <RateIndex />
        <BuildsBand />
        {/* Standards directly under the build tiers (client, 2026-09-13): the
            figure raises "is that justified", and this is the answer. It is
            also where the guarantee's conditions are stated in full. */}
        <BuildStandardsBand />
        <PlansBand />
        <AiBand />
        <BookingsBand />
        <CrmBand />
        {/* `id="creative"` is the target of the homepage's "See creative
            pricing" (/pricing#creative), so the band keeps that id. */}
        {CREATIVE_SERVICE_READY ? <CreativeBand /> : null}
        <SmallPrint />
        <Faq
          metas={["Pricing", "Payment", "Timeline", "Guarantee", "Ownership", "Retainers", "Creative", "AI systems"]}
          heading="Money questions."
          lede="What the figures above usually prompt — cost, timing, ownership and what the monthly plans actually cover."
        />
        <ContactBand heading="Not sure which tier fits?" />
        <BackHome />
      </main>
      <Footer />
    </>
  );
}
