import type { Metadata, ResolvingMetadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { CREATIVE_SERVICE_READY, creativeService, projectTiers, rateCard, retainerPicks, retainerTiers, site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/v3/page-hero";
import { PackageDeck } from "@/components/v3/package-deck";
import { FaqList } from "@/components/v3/faq-list";
import { AddOns, BuildNotes, creativePlans, CreativeRates, CreativeTerms, Divided, GridNote, Part, RateGlance, SharedLine } from "@/components/v3/pricing-parts";

export function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return pageMetadata(parent, {
    title: "Pricing",
    description:
      "Fixed-price website builds and monthly plans, published openly in pounds. No hourly billing, no minimum term beyond the first month.",
    path: "/pricing",
  });
}

/**
 * PRICING, regrouped (Brad, 2026-10-04: "I don't like the pricing page", "it
 * feels unorganised and messy"; previewed at /lab/pricing, then "go live
 * now"). Four kinds of price: the builds, the monthly plans, everything added
 * on (AI, bookings, CRM, then creative), and the terms with the money
 * questions. Every set of plans is the same card (`PackageDeck`), every line
 * item the same row (`RateRows`). The ids the At a glance index links to
 * (#builds, #plans, #ai, #bookings, #crm, #creative) all survive. Same
 * figures, same load-bearing wording.
 *
 * ALL DARK (Brad, same day: "the pricing page looks terrible. Why is it all
 * white?"). The two light bands were the page's longest stretches, small
 * print on #f0f0f0, and read as a spreadsheet. Every part sits on the black
 * now, split by the band's faint rule instead of a Bridge.
 *
 * LEANER (Brad, same day: "just so much on the pricing page"): the two card
 * decks lead; the add-ons and the one-off creative rates show an opening
 * figure with the rows one click away; the notes under the build cards are
 * one list; repeats and the method block are gone; six money questions, not
 * eight (the AI and creative ones repeated the price lists above them).
 *
 * NO SMALL-PRINT BLOCK (Brad, same day: a table, then a sideways swipe, both
 * "unorganised"; the Framer studios he pointed to go from the plans straight
 * to the questions). Every term sits where it applies: revision rounds in the
 * build cards, payment in the questions, plan terms under the plans, "no
 * VAT" beside each set of prices, the referral line in the build footnotes,
 * the creative terms (with the £75 extra round) under the creative cards.
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

        {/* No column rules under the hero: on this page they ran through the
            body text of every list and made it read as a spreadsheet. */}
        <div className="bg-ink-0">
          <div className="px-6 sm:px-10">
            <Part id={s.builds.id} index="01" label={s.builds.label} heading={s.builds.heading} lede={s.builds.lede}>
              <SharedLine />
              <div className="mt-10">
                <PackageDeck label="Website builds" tiers={projectTiers} onDark />
              </div>
              <BuildNotes />
            </Part>

            <Divided>
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
            </Divided>

            <Divided>
              <Part id="add-ons" index="03" label="Add-ons" heading="Add what you need." lede="AI assistants, bookings and a CRM, each priced on its own, with every condition beside its figure.">
                <AddOns />
              </Part>
            </Divided>

            {/* `id="creative"` is also the /pricing#creative target from other pages. */}
            {CREATIVE_SERVICE_READY ? (
              <Divided>
                <Part id={s.creative.id} index="04" label={s.creative.label} heading={s.creative.heading} lede={s.creative.lede}>
                  <GridNote>{creativeService.pricing.currencyNote}</GridNote>
                  <div className="mt-6">
                    <PackageDeck label="Creative plans" tiers={creativePlans} onDark />
                  </div>
                  <CreativeTerms />
                  <CreativeRates />
                </Part>
              </Divided>
            ) : null}

            <Divided>
              <FaqList
                index={CREATIVE_SERVICE_READY ? "05" : "04"}
                metas={["Pricing", "Payment", "Timeline", "Guarantee", "Ownership", "Retainers"]}
                heading="Money questions."
                lede="What the figures above usually prompt — cost, timing, ownership and what the monthly plans actually cover."
              />
            </Divided>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
