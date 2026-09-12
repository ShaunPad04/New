import type { Metadata } from "next";
import { site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/pricing";
import { PageIntro, ContactBand, BackHome } from "@/components/page-shell";
import { Faq } from "@/components/faq";
import { BuildStandardsBand } from "@/components/build-standards-band";

export const metadata: Metadata = {
  title: `Pricing — ${site.name}`,
  description:
    "Fixed-price website builds and monthly plans, published openly in pounds. No hourly billing, no minimum term beyond the first month.",
  alternates: { canonical: "/pricing" },
};

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
        <Pricing />
        {/* Standards and method directly under the tiers (client,
            2026-09-13): the figure raises the question "is that justified",
            and this is the answer, before the FAQ picks up the rest. */}
        <BuildStandardsBand />
        {/* The money questions, right where the figures raised them
            (redesign, 2026-09-11). Filtered by meta so this stays in step
            with the FAQ data rather than duplicating copy. */}
        <Faq
          metas={["Pricing", "Timeline", "Guarantee", "Ownership", "Retainers", "AI systems"]}
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
