import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { PropertySearch } from "@/components/property-search";
import { ClosingCta } from "@/components/closing-cta";
import { getAllProperties, getLocations, parseSearchParams, SNAPSHOT_DATE } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Properties for sale",
  description: "Search new homes, part exchange and assisted move properties for sale across the UK with New Home Agents. Filter by location, price and bedrooms.",
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage(props: PageProps<"/properties">) {
  const ctaPhoto = getAllProperties().find((x) => x.images.length >= 3 && x.isNewHome);
  const sp = await props.searchParams;
  const initial = parseSearchParams(sp);
  const properties = getAllProperties();
  const captured = SNAPSHOT_DATE ? new Date(SNAPSHOT_DATE).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  return (
    <main id="main">
      <PageHero
        eyebrow="Property listings"
        title="Find a home that fits your life"
        description={`New homes and resale properties for sale across the UK. ${captured ? `Listings shown as published by New Home Agents on ${captured}.` : ""}`}
      />
      <section className="pb-20">
        <div className="container">
          <Suspense fallback={<p className="text-slate">Loading search…</p>}>
            <PropertySearch properties={properties} locations={getLocations()} initial={initial} />
          </Suspense>
        </div>
      </section>
      <ClosingCta photo={ctaPhoto} />
    </main>
  );
}
