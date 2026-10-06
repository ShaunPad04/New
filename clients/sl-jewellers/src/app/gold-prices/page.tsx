import type { Metadata } from "next";
import Prices from "@/components/sections/Prices";
import { BUSINESS } from "@/lib/content";

/** Hourly ISR, as the homepage had it: the table is in the HTML on first paint, and the
 *  upstream price call is cached for a day inside that (see lib/metal-prices). */
export const revalidate = 3600;

const b = BUSINESS;
export const metadata: Metadata = {
  title: "Gold and silver prices: what we pay for scrap",
  description: `Today's gold and silver prices per gram at S&L Jewellers, Cleethorpes. We pay ${b.buying.goldScrapPercent}% of the London spot price for scrap gold and ${b.buying.silverPercent}% for silver, weighed in front of you at 49 Cambridge Street.`,
  alternates: { canonical: "/gold-prices" },
};

export default function GoldPricesPage() {
  return <Prices />;
}
