import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CREATIVE_SERVICE_READY, creativeService, projectTiers, rateCard, retainerPicks, retainerTiers, site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/v3/page-hero";
import { PackageDeck } from "@/components/v3/package-deck";
import { FaqList } from "@/components/v3/faq-list";
import { Bridge } from "@/components/v3/bridge";
import { Grid } from "@/components/v3/page-grid";
import { AddOns, BuildNotes, creativePlans, CreativeRates, GridNote, Part, RateGlance, SharedLine, SmallPrint } from "@/components/v3/pricing-parts";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Fixed-price website builds and monthly plans, published openly in pounds. No hourly billing, no minimum term beyond the first month.",
  alternates: { canonical: "/pricing" },
};

const DARK = "#000000";
const LIGHT = "#f0f0f0";

function Light({ children }: { children: ReactNode }) {
  return (
    <div className="band-light relative bg-ink-0">
      <Grid rule="border-ink-1000/8" reading />
      <div className="relative px-6 sm:px-10">{children}</div>
    </div>
  );
}
function Dark({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-ink-0">
      <Grid rule="border-white/12" reading />
      <div className="relative px-6 sm:px-10">{children}</div>
    </div>
  );
}

/**
 * PRICING, regrouped (Brad, 2026-10-04: "I don't like the pricing page", "it
 * feels unorganised and messy"; previewed at /lab/pricing, then "go live
 * now"). Four bands instead of eight, each a kind of price: the builds, the
 * monthly plans, everything added on (AI, bookings, CRM, then creative), and
 * the terms with the money questions. Every set of plans is the same card
 * (`PackageDeck`), every line item the same row (`RateRows`). The ids the
 * At a glance index links to (#builds, #plans, #ai, #bookings, #crm,
 * #creative) all survive. Same figures, same load-bearing wording.
 */
export default function PricingPage() {
  const s = rateCard.sections;
  return (
    <>
      <Header />
      <main id="main" className="v3 flex-1">
        <PageHero
          id="pricing-page-heading"
          title="Pricing"
          label="Pricing"
          ja="料金"
          count={{ value: "06", label: "price lists" }}
          lede="Agencies hide pricing because it buys them a meeting. We would rather you arrive already knowing whether we are in your range."
          image="/images/pages/pricing.webp"
          aside={<RateGlance />}
          asidePhone
        />

        <Bridge from={DARK} to={LIGHT} />
        <Light>
          <Part id={s.builds.id} index="01" label={s.builds.label} heading={s.builds.heading} lede={s.builds.lede}>
            <SharedLine />
            <div className="mt-10">
              <PackageDeck label="Website builds" tiers={projectTiers} />
            </div>
            <BuildNotes />
          </Part>
        </Light>

        <Bridge from={LIGHT} to={DARK} />
        <Dark>
          <Part id={s.plans.id} index="02" label={s.plans.label} heading={s.plans.heading} lede={s.plans.lede}>
            <GridNote>{site.currencySymbol} GBP per month — no VAT charged</GridNote>
            <div className="mt-6">
              <PackageDeck label="Monthly plans" tiers={retainerTiers} onDark picks={retainerPicks} />
            </div>
            <ul className="mt-8 grid max-w-[72ch] gap-2 text-[0.9375rem] leading-relaxed text-ink-800 lg:ml-[calc(100%/3)] lg:pl-3">
              {rateCard.smallPrint.planTerms.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Part>
        </Dark>

        <Bridge from={DARK} to={LIGHT} />
        <Light>
          <Part id="add-ons" index="03" label="Add-ons" heading="Add what you need." lede="AI assistants, bookings and a CRM, each priced on its own, with every condition beside its figure.">
            <AddOns />
          </Part>
          {/* `id="creative"` is also the /pricing#creative target from other pages. */}
          {CREATIVE_SERVICE_READY ? (
            <div className="border-t border-ink-1000">
              <Part id={s.creative.id} index="04" label={s.creative.label} heading={s.creative.heading} lede={s.creative.lede}>
                <GridNote>{creativeService.pricing.currencyNote}</GridNote>
                <div className="mt-6">
                  <PackageDeck label="Creative plans" tiers={creativePlans} />
                </div>
                <CreativeRates />
              </Part>
            </div>
          ) : null}
        </Light>

        <Bridge from={LIGHT} to={DARK} />
        <Dark>
          <SmallPrint index={CREATIVE_SERVICE_READY ? "05" : "04"} />
          <div className="border-t border-white/12">
            <FaqList
              index={CREATIVE_SERVICE_READY ? "06" : "05"}
              metas={["Pricing", "Payment", "Timeline", "Guarantee", "Ownership", "Retainers", "Creative", "AI systems"]}
              heading="Money questions."
              lede="What the figures above usually prompt — cost, timing, ownership and what the monthly plans actually cover."
            />
          </div>
        </Dark>
      </main>
      <Footer />
    </>
  );
}
