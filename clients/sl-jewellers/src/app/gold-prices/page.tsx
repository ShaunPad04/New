import type { Metadata } from "next";
import Prices from "@/components/sections/Prices";

/** Hourly ISR, as the homepage had it: the table is in the HTML on first paint, and the
 *  upstream price call is cached for a day inside that (see lib/metal-prices). */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gold & Silver Prices Today, Cleethorpes",
  description: "Today's gold and silver prices at S&L Jewellers, Cleethorpes, and what we pay for scrap: a share of the London spot price, weighed in front of you.",
  alternates: { canonical: "/gold-prices" },
};

export default function GoldPricesPage() {
  return <Prices />;
}
