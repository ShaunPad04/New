import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CREATIVE_SERVICE_READY, creativeService, projectTiers, rateCard, retainerTiers, site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/v3/page-hero";
import { TierDeck } from "@/components/v3/tier-deck";
import { FaqList } from "@/components/v3/faq-list";
import { Bridge } from "@/components/v3/bridge";
import { Grid } from "@/components/v3/page-grid";
import { AiRates, Band, BespokeRow, CreativeRates, creativePlans, GridNote, Guarantee, LineItems, RateGlance, SharedLine, SmallPrint } from "@/components/v3/pricing-parts";

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
/** A note or list under a deck, on the band's content columns. */
function Under({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 lg:grid lg:grid-cols-3">
      <div className="lg:col-span-2 lg:col-start-2 lg:pl-3">{children}</div>
    </div>
  );
}

/**
 * PRICING in the homepage's system (Brad, 2026-10-02: previewed at
 * /lab/pricing, then "push it live"). The rate card's order and every
 * load-bearing line are unchanged from the 2026-09-25 restructure (see the
 * comment at the top of components/rate-card.tsx); the bands alternate light
 * and dark with a Bridge at every edge, as on the homepage.
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
          <Band section={s.builds}>
            <SharedLine />
            <div className="mt-10">
              <TierDeck tiers={projectTiers} />
            </div>
            <Under>
              <p className="max-w-[72ch] text-[0.9375rem] leading-relaxed text-ink-800">{s.builds.multiSiteNote}</p>
            </Under>
            <BespokeRow />
            <Guarantee />
          </Band>
        </Light>

        <Bridge from={LIGHT} to={DARK} />
        <Dark>
          <Band section={s.plans}>
            <GridNote>{site.currencySymbol} GBP per month — no VAT charged</GridNote>
            <div className="mt-6">
              <TierDeck tiers={retainerTiers} onDark />
            </div>
            <Under>
              <ul className="grid max-w-[72ch] gap-2 text-[0.9375rem] leading-relaxed text-ink-800">
                {rateCard.smallPrint.planTerms.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Under>
          </Band>
        </Dark>

        <Bridge from={DARK} to={LIGHT} />
        <Light>
          <Band section={s.ai}>
            <AiRates />
          </Band>
          <Band section={s.bookings}>
            <LineItems rows={s.bookings.rows} />
          </Band>
          <Band section={s.crm}>
            <LineItems rows={s.crm.rows} />
          </Band>
        </Light>

        {/* `id="creative"` is the homepage's /pricing#creative target. */}
        {CREATIVE_SERVICE_READY ? (
          <>
            <Bridge from={LIGHT} to={DARK} />
            <Dark>
              <Band section={s.creative}>
                <GridNote>{creativeService.pricing.currencyNote}</GridNote>
                <div className="mt-6">
                  <TierDeck tiers={creativePlans} onDark />
                </div>
                <CreativeRates />
              </Band>
            </Dark>
            <Bridge from={DARK} to={LIGHT} />
          </>
        ) : null}

        <Light>
          <SmallPrint index="07" />
        </Light>

        <Bridge from={LIGHT} to={DARK} />
        <Dark>
          <FaqList
            index="08"
            metas={["Pricing", "Payment", "Timeline", "Guarantee", "Ownership", "Retainers", "Creative", "AI systems"]}
            heading="Money questions."
            lede="What the figures above usually prompt — cost, timing, ownership and what the monthly plans actually cover."
          />
        </Dark>
      </main>
      <Footer />
    </>
  );
}
