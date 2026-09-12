import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { PropertySearch } from "@/components/property-search";
import { ClosingCta } from "@/components/closing-cta";
import { Faq } from "@/components/faq";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { getAllProperties, getLocations, parseSearchParams } from "@/lib/properties";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "New homes for sale",
  description: "New build homes for sale nationwide from some of the UK's best house builders, sold by New Home Agents. Part exchange and assisted move available on selected developments.",
  alternates: { canonical: "/new-homes" },
};

export default async function NewHomesPage(props: PageProps<"/new-homes">) {
  const sp = await props.searchParams;
  const initial = parseSearchParams(sp);
  const properties = getAllProperties().filter((p) => p.isNewHome);
  const locations = getLocations().filter((l) => properties.some((p) => p.town === l.name)).map((l) => ({ name: l.name, count: properties.filter((p) => p.town === l.name).length }));
  return (
    <main id="main">
      <PageHero
        eyebrow="New homes"
        title="Brand-new homes from the UK's leading house builders"
        description="We sell new build homes nationwide on behalf of some of the UK's best house builders — with part exchange and assisted move schemes available on selected developments."
      >
        <Appear className="flex flex-wrap gap-3">
          <Button href="/part-exchange-assisted-move" variant="secondary">Part exchange & assisted move</Button>
          <Button href="/mortgages" variant="secondary">Mortgage advice</Button>
        </Appear>
      </PageHero>
      <section className="pb-20">
        <div className="container">
          <Suspense fallback={<p className="text-slate">Loading search…</p>}>
            <PropertySearch properties={properties} locations={locations} initial={initial} lockedType="new" />
          </Suspense>
        </div>
      </section>
      <Faq items={faqs.filter((f) => /Part Exchange|Assisted Move|mortgage|viewing/i.test(f.q))} />
      <ClosingCta />
    </main>
  );
}
