import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { Faq } from "@/components/faq";
import { ClosingCta } from "@/components/closing-cta";
import { PropertyCard } from "@/components/property-card";
import { faqs, services } from "@/lib/content";
import { getAllProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Part exchange and assisted move",
  description: "How house builder part exchange and assisted move schemes work, and how New Home Agents sells the properties that come through them nationwide.",
  alternates: { canonical: "/part-exchange-assisted-move" },
};

const steps = {
  px: [
    ["Reserve your new build", "You find a new home with a house builder that offers Part Exchange."],
    ["The builder values your home", "Independent valuations set the offer for your existing property."],
    ["No chain, no waiting", "The builder buys your home as part payment, so you move on the builder's timescale."],
    ["We sell the part exchange home", "The builder appoints New Home Agents to market and sell the property it has taken in."],
  ],
  am: [
    ["Reserve your new build", "You choose a new home with a builder that offers Assisted Move (also called Assisted Sale)."],
    ["We value and market your home", "New Home Agents values your existing home and markets it through multi-agency channels."],
    ["The builder supports the sale", "Typically the builder contributes towards the estate agency fees, subject to its scheme terms."],
    ["Sales progression to completion", "Our team progresses both transactions so exchange and completion line up."],
  ],
};

export default function PxPage() {
  const resale = getAllProperties().filter((p) => !p.isNewHome && p.images[0]?.local).slice(0, 3);
  return (
    <main id="main">
      <PageHero
        eyebrow="Part exchange & assisted move"
        title="Two ways house builders help you move into a new home"
        description="We specialise in the residential sale of Part Exchange and Assisted Move properties on behalf of some of the UK's best house builders."
      />
      <section className="pb-20">
        <div className="container grid gap-5 lg:grid-cols-2">
          {[services[1], services[2]].map((s, i) => (
            <Appear key={s.slug} delay={i * 0.1} className="flex flex-col gap-6 rounded-[24px] bg-mist p-8 md:p-10">
              <span aria-hidden="true" className="numeral text-line">.{s.index}</span>
              <div>
                <p className="text-sm text-slate">{s.label}</p>
                <h2 className="h-sub mt-2">{s.title}</h2>
                <p className="mt-4 text-slate">{s.summary}</p>
              </div>
              <ol className="flex flex-col gap-3">
                {(i === 0 ? steps.px : steps.am).map(([t, d], n) => (
                  <li key={t} className="flex gap-4 rounded-[12px] bg-white p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm text-white">{n + 1}</span>
                    <div><p className="font-medium">{t}</p><p className="mt-1 text-sm text-slate">{d}</p></div>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-slate">Scheme eligibility, valuations and contributions are set by each house builder and vary by development. We will explain the terms that apply to the home you are interested in.</p>
              <div className="flex flex-wrap gap-3">
                <Button href="/new-homes">Browse new homes</Button>
                <Button href="/selling" variant="white">Request a valuation</Button>
              </div>
            </Appear>
          ))}
        </div>
      </section>
      {resale.length ? (
        <section className="section bg-mist" aria-labelledby="px-listings">
          <div className="container">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex max-w-[600px] flex-col gap-4">
                <Appear><p className="eyebrow">Resale properties</p></Appear>
                <Appear delay={0.1}><h2 id="px-listings" className="h-section">Homes we are selling on builders&rsquo; behalf</h2></Appear>
              </div>
              <Appear delay={0.2}><Button href="/properties?type=resale" variant="white">See all resale homes</Button></Appear>
            </div>
            <ul className="mt-12 grid gap-[15px] md:grid-cols-2 lg:grid-cols-3">
              {resale.map((p, i) => <Appear as="li" key={p.id} delay={i * 0.1}><PropertyCard property={p} /></Appear>)}
            </ul>
          </div>
        </section>
      ) : null}
      <Faq items={faqs.filter((f) => /Part Exchange|Assisted|sell|mortgage/i.test(f.q))} />
      <ClosingCta />
    </main>
  );
}
