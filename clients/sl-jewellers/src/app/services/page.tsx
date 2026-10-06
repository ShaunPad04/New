import type { Metadata } from "next";
import Services from "@/components/sections/Services";
import { BUSINESS } from "@/lib/content";

const b = BUSINESS;
export const metadata: Metadata = {
  title: "Services: sell your gold, part-exchange, sourcing and repairs",
  description: `What S&L Jewellers does over the counter at ${b.address.street}, ${b.address.town}: buying gold and silver, part-exchange, sourcing and made to order, repairs and soldering. Bring it in and get a price.`,
  alternates: { canonical: "/services" },
};

/** "Bring it in. Get a price." on its own page (Shaun, 6 Oct 2026: off the home page). */
export default function ServicesPage() {
  return <Services page />;
}
