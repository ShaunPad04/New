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

        {/* Eleven words of outcome between the logo strip and the long
            sections, at the point where the page starts arguing. */}
        <Capabilities />

        <Services />
        <Work showPortfolioLink />
        {/* Proof of work, then proof in numbers, then proof in words. */}
        <Results />
        {/* Testimonials render when verified, OR on a non-indexable preview
            so the carousel can be reviewed with the temporary samples in
            lib/content.ts. On an indexable build with unverified quotes,
            `pnpm verify` fails before this can ever reach the public. */}
        {SHOW_TESTIMONIALS ? <Testimonials /> : null}
        <Pricing />
        <Studio />
        <Faq />
        {/* The invitation, then the form it hands off to. */}
        <LetsWork />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
