import type { Metadata } from "next";
import { BUSINESS, LAUNCH, SERVICES } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import { ServicesBento, ServicesIndex, ServicesSticky } from "@/components/sections/ServicesLayouts";

const b = BUSINESS;
export const metadata: Metadata = {
  title: "Services: sell your gold, part-exchange, sourcing and repairs",
  description: `What S&L Jewellers does over the counter at ${b.address.street}, ${b.address.town}: buying gold and silver, part-exchange, sourcing and made to order, repairs and soldering. Bring it in and get a price.`,
  alternates: { canonical: "/services" },
};

/** "Bring it in. Get a price." on its own page (Shaun, 6 Oct 2026: off the home page). Round 8,
 *  7 Oct 2026: three new layouts on ?v=svc:a|b|c (components/sections/ServicesLayouts.tsx). */
export default function ServicesPage() {
  const services = SERVICES;
  return (
    <section id="services" className="on-black svx-page" aria-labelledby="services-title">
      <div className="wrap">
        <Reveal className="cxa">
          <div>
            <p className="eyebrow">Sell it, swap it, get it sent</p>
            <SplitHeading as="h1" load id="services-title" text={"Bring it in.\n*Get a price.*"} className="display-l mt-3" />
          </div>
          <div className="cxa-side">
            <p className="cxa-blurb">Chains, rings, odd earrings, old sovereigns, the lot. Anything gold or silver goes on the scale in front of you and you get a price while you wait.</p>
          </div>
        </Reveal>
        <div data-x="svc" data-x-dir="a">
          <ServicesIndex services={services} />
        </div>
        <div data-x="svc" data-x-dir="b">
          <ServicesSticky services={services} />
        </div>
        <div data-x="svc" data-x-dir="c">
          <ServicesBento services={services} />
        </div>
        {!LAUNCH && services.some((s) => s.todo) && <p className="todo mt-6">Some service details are still to confirm with S&amp;L (content/services.json).</p>}
      </div>
    </section>
  );
}
