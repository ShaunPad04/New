import {
  clientLogos,
  founders,
  LOGO_CLIENTS_VERIFIED,
  projectTiers,
  site,
  SHOW_TESTIMONIALS,
  stackLogos,
  TRUST_CLAIM,
  CREATIVE_SERVICE_READY,
} from "@/lib/content";
import { Header, HeaderSurfaceSentinel } from "@/components/header";
import { Hero } from "@/components/hero";
import { LogoCloud } from "@/components/logo-cloud";
import { Capabilities } from "@/components/capabilities";
import { Services } from "@/components/services";
import { Work } from "@/components/work";
import { Results } from "@/components/results";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { Comparison } from "@/components/comparison";
import { CreativeService } from "@/components/creative-service";
import { Studio } from "@/components/studio";
import { ProcessSection } from "@/components/process-section";
import { Faq } from "@/components/faq";
import { LetsWork } from "@/components/lets-work";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

/**
 * Structured data.
 *
 * Only verified facts appear here. No aggregateRating, no reviewCount, no
 * address and no founding date — none of those have been confirmed, and
 * inventing them to enrich a search result is exactly the kind of schema
 * fabrication that earns a manual action.
 */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    areaServed: "GB",
    /* Derived from the published build tiers rather than typed, so it cannot
       fall out of step with the grid the way a hand-written range would.
       Google reads `priceRange` on a local/professional service and it is the
       one structured field this business can state with certainty — the
       postal address, company number and social profiles are all still
       outstanding, and a fabricated value in any of them would be worse than
       their absence. */
    priceRange: `${site.currencySymbol}${projectTiers[0].price.toLocaleString("en-GB")}–${site.currencySymbol}${projectTiers[projectTiers.length - 1].price.toLocaleString("en-GB")}`,
    founder: founders.map((f) => ({ "@type": "Person", name: f.name })),
    knowsAbout: [
      "Web design",
      "Web development",
      "User interface design",
      "User experience design",
      "Search engine optimisation",
      "Email marketing",
      "SMS marketing",
      "Conversion rate optimisation",
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Serialised from a literal we control — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        {/* Marks the end of the hero for the header, which is transparent
            over it and takes a surface past it. Must sit outside the hero:
            ScrollTrigger pins that section, and anything inside it would be
            pinned along with it and never cross the viewport top. */}
        <HeaderSurfaceSentinel />
        {/*
          Redesign order (2026-09-11): Hero → Work → Services → Studio →
          Pricing → FAQ → Contact. Work leads because proof beats promises;
          Capabilities bridges the work into the service list; Results sits
          with Studio so the people and the standards they hold read as one
          argument before the price.

          THE LOGO STRIP MOVED BELOW THE WORK on 2026-09-14. It was 258px
          sitting between the hero and the only real proof on the page, so at
          390px a reader reached Selected Work at 2,368px — nearly three
          screens — having been shown a row of other companies' marks first.
          The strip is a supporting claim about our tooling; it belongs after
          the thing it supports, not in front of it. Desktop reads the same
          order, and nothing about the strip itself changed.
        */}
        <Work showPortfolioLink />
        <LogoCloud
          items={
            LOGO_CLIENTS_VERIFIED && clientLogos.length > 0
              ? clientLogos
              : stackLogos
          }
          label="The stack we build on"
          heading={TRUST_CLAIM}
        />

        <Capabilities />
        <Services compact />
        {/*
          Creative & aerial sits here on the client's own instruction: after
          the services list, before the studio story. He put it this way —
          the visitor has just read what we do, and this lands before they
          decide whether to trust us with it.

          GATED. `CREATIVE_SERVICE_READY` is false and the reasons are on
          `creativeService` in content.ts: the showcase has no work in it yet,
          and the aerial tier cannot be advertised until it is settled whether
          it is CAA-authorised drone work or AI-generated flythroughs, which
          are not the same offer and cannot be described the same way. The
          section is built and waiting; flipping one boolean ships it.
        */}
        {CREATIVE_SERVICE_READY ? <CreativeService /> : null}
        <Studio />
        {/* The process ride, as a sibling — see ProcessSection for why it
            cannot live inside the Studio section. */}
        <ProcessSection />
        <Results />
        {/* Hidden until real quotes exist — TESTIMONIALS_VERIFIED gates it
            everywhere, previews included. */}
        {SHOW_TESTIMONIALS ? <Testimonials /> : null}
        {/* The comparison sits between the measured results and the price:
            the reader has just seen what we hold ourselves to, and this
            frames the figure before they reach it. */}
        <Comparison />
        <Pricing compact />
        <Faq compact />
        {/* The invitation, then the form it hands off to. */}
        <LetsWork />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
