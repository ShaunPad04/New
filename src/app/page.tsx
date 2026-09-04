import {
  clientLogos,
  founders,
  LOGO_CLIENTS_VERIFIED,
  site,
  SHOW_TESTIMONIALS,
  SHOW_TRUST_CLAIM,
  stackLogos,
  TRUST_CLAIM,
} from "@/lib/content";
import { Header, HeaderSurfaceSentinel } from "@/components/header";
import { Hero } from "@/components/hero";
import { LogoCloud } from "@/components/logo-cloud";
import { Services } from "@/components/services";
import { Work } from "@/components/work";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { Studio } from "@/components/studio";
import { Faq } from "@/components/faq";
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
        {/* The heading is the client's requested copy and is an objective
            claim about the business, so it is gated exactly like the sample
            testimonials: preview only, with a visible marker, and `pnpm
            verify` refuses an indexable build while LOGO_CLIENTS_VERIFIED is
            false. The row itself stays on the stack we build on until real
            client logos are supplied and cleared. */}
        <LogoCloud
          items={
            LOGO_CLIENTS_VERIFIED && clientLogos.length > 0
              ? clientLogos
              : stackLogos
          }
          label={
            LOGO_CLIENTS_VERIFIED && clientLogos.length > 0
              ? "Clients we work with"
              : "The technology we build on"
          }
          heading={SHOW_TRUST_CLAIM ? TRUST_CLAIM : undefined}
          unverified={!LOGO_CLIENTS_VERIFIED}
          eyebrow={
            LOGO_CLIENTS_VERIFIED && clientLogos.length > 0
              ? undefined
              : "The stack we build on"
          }
        />
        <Services />
        <Work />
        {/* Testimonials render when verified, OR on a non-indexable preview
            so the carousel can be reviewed with the temporary samples in
            lib/content.ts. On an indexable build with unverified quotes,
            `pnpm verify` fails before this can ever reach the public. */}
        {SHOW_TESTIMONIALS ? <Testimonials /> : null}
        <Pricing />
        <Studio />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
