import type { Metadata } from "next";
import { BUSINESS, LAUNCH, SERVICES } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import ServicesSticky from "@/components/sections/ServicesSticky";

const b = BUSINESS;
export const metadata: Metadata = {
  title: "Sell Gold, Trade-In & Repairs in Cleethorpes",
  description: `Sell gold, silver and watches, part-exchange, sourcing, repairs and soldering at S&L Jewellers, ${b.address.street}, ${b.address.town}. Bring it in for a price.`,
  alternates: { canonical: "/services" },
};

/** "Bring it in. Get a price." on its own page (Shaun, 6 Oct 2026: off the home page), laid out
 *  as the sticky picture (Shaun's pick B in round 8, components/sections/ServicesSticky.tsx). */
export default function ServicesPage() {
  const services = SERVICES;
  return (
    <section id="services" className="on-black svx-page" aria-labelledby="services-title">
      <div className="wrap">
        <Reveal load className="cxa">
          <div>
            <p className="eyebrow">Sell it, swap it, get it sent</p>
            <SplitHeading as="h1" load id="services-title" text={"Bring it in.\n*Get a price.*"} className="display-l mt-3" />
          </div>
          <div className="cxa-side">
            <p className="cxa-blurb">Chains, rings, odd earrings, old sovereigns, the lot. Anything gold or silver goes on the scale in front of you and you get a price while you wait.</p>
          </div>
        </Reveal>
        <ServicesSticky services={services} />
        {!LAUNCH && services.some((s) => s.todo) && <p className="todo mt-6">Some service details are still to confirm with S&amp;L (content/services.json).</p>}
      </div>
    </section>
  );
}
