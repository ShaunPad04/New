import type { Metadata, ResolvingMetadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { processSteps, services, servicesIntro } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/v3/page-hero";
import { ServiceIndex, ServiceJump } from "@/components/v3/service-index";
import { Journey } from "@/components/v3/journey";
import { ProofBand } from "@/components/v3/proof-band";
import { Bridge } from "@/components/v3/bridge";
import { Grid } from "@/components/v3/page-grid";

export function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return pageMetadata(parent, {
    title: "Services",
    description:
      "Web design and build, UI and UX design, Google SEO management, email and SMS marketing, managed hosting and ongoing optimisation — run by the two people who do the work.",
    path: "/services",
  });
}

const DARK = "#000000";
const LIGHT = "#f0f0f0";

/**
 * SERVICES in the homepage's system (Brad, 2026-10-02: previewed at
 * /lab/services, then "put it on the site"). The page top, then the six
 * disciplines on a light band (each linking to its own page, creative and
 * AI after them), the homepage's journey, and the measured standards. Light
 * bands alternate with dark and every edge is a Bridge, as on the homepage.
 * The footer's "got a project? let's talk." closes the page.
 */
export default function ServicesPage() {
  return (
    <>
      <Header />
      <main id="main" className="v3 flex-1">
        <PageHero
          id="services-page-heading"
          title="Services"
          label="Services"
          ja="事業内容"
          count={{ value: String(services.length).padStart(2, "0"), label: "disciplines" }}
          lede={servicesIntro.lede}
          image="/images/pages/services.webp"
          aside={<ServiceJump />}
        />
        <Bridge from={DARK} to={LIGHT} />
        <div className="band-light relative bg-ink-0">
          <Grid rule="border-ink-1000/8" reading />
          <div className="relative px-6 sm:px-10">
            <ServiceIndex index="01" />
          </div>
        </div>
        <Bridge from={LIGHT} to={DARK} />
        <Journey index="02" steps={processSteps.map(({ id, index, title, body }) => ({ id, index, title, body }))} />
        <Bridge from={DARK} to={LIGHT} />
        <div className="band-light relative bg-ink-0">
          <Grid rule="border-ink-1000/8" reading />
          <div className="relative px-6 sm:px-10">
            <ProofBand index="03" />
          </div>
        </div>
        <Bridge from={LIGHT} to={DARK} />
      </main>
      <Footer />
    </>
  );
}
