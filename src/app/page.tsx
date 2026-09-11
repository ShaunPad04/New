import {
  clientLogos,
  founders,
  LOGO_CLIENTS_VERIFIED,
  site,
  SHOW_TESTIMONIALS,
  stackLogos,
  TRUST_CLAIM,
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
import { Studio } from "@/components/studio";
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
          "Built with" is nominative use — a true statement about our own
          tooling that asserts nobody's endorsement — so the strip needs no
          gate. Client logos still require LOGO_CLIENTS_VERIFIED before they
          can replace the stack.
        */}
        <LogoCloud
          items={
            LOGO_CLIENTS_VERIFIED && clientLogos.length > 0
              ? clientLogos
              : stackLogos
          }
          label="The stack we build on"
          heading={TRUST_CLAIM}
        />

        {/*
          Redesign order (2026-09-11): Hero → Work → Services → Studio →
          Pricing → FAQ → Contact. Work leads because proof beats promises;
          Capabilities bridges the work into the service list; Results sits
          with Studio so the people and the standards they hold read as one
          argument before the price.
        */}
        <Work showPortfolioLink />
        <Capabilities />
        <Services compact />
        <Studio />
        <Results />
        {/* Hidden until real quotes exist — TESTIMONIALS_VERIFIED gates it
            everywhere, previews included. */}
        {SHOW_TESTIMONIALS ? <Testimonials /> : null}
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
