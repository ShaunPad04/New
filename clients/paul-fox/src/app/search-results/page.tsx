import type { Metadata } from "next";
import { Suspense } from "react";
import { allProperties } from "@/lib/properties";
import { PageHeader } from "@/components/page-header";
import { PropertySearch } from "@/components/property-search";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Properties for Sale and to Let",
  description: "Search homes for sale and to let across Scunthorpe, Brigg, Barton-upon-Humber, Epworth, Gainsborough and the surrounding villages.",
};

export default function SearchPage() {
  return (
    <main>
      <PageHeader
        eyebrow="[ PROPERTIES ]"
        title="search for your ideal property"
        copy="Homes for sale and to let across North Lincolnshire, from five family-run offices. All our offices are computer linked, so whichever branch you contact can help with any of them."
        compact
      />
      <section className="section">
        <div className="container">
          <Suspense fallback={<p className="body-sm">Loading properties…</p>}>
            <PropertySearch properties={allProperties} />
          </Suspense>
        </div>
      </section>
      <CtaBand
        eyebrow="[ CAN’T FIND IT? ]"
        title="register with your local branch"
        copy="Tell us what you are looking for and we will call you the moment something suitable is instructed — often before it reaches the portals."
        ctas={[
          { label: "Contact us", href: "/contact" },
          { label: "Book a free valuation", href: "/valuation-request" },
        ]}
      />
    </main>
  );
}
