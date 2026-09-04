import type { Metadata } from "next";
import { site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/pricing";
import { PageIntro, ContactBand, BackHome } from "@/components/page-shell";

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
          headingId="pricing-page-heading"
          heading="No quote required to see a number."
          lede="Agencies hide pricing because it buys them a meeting. We would rather you arrive already knowing whether we are in your range — it makes the first call about the work instead of the invoice."
        />
        <Pricing />
        <ContactBand heading="Not sure which tier fits?" />
        <BackHome />
      </main>
      <Footer />
    </>
  );
}
