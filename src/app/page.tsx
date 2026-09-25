import {
  clientLogos,
  founders,
  LOGO_CLIENTS_VERIFIED,
  projectTiers,
  site,
  socials,
  SHOW_TESTIMONIALS,
  stackLogos,
  TRUST_CLAIM,
  CREATIVE_SERVICE_READY,
} from "@/lib/content";
import { jsonLd } from "@/lib/json-ld";
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
import { legalEntity } from "@/lib/legal";

/**
 * Structured data.
 *
 * Only verified facts appear here. No aggregateRating, no reviewCount and no
 * founding date — none of those have been confirmed, and inventing them to
 * enrich a search result is exactly the kind of schema fabrication that
 * earns a manual action.
 *
 * The postal address IS here (added 2026-09-17): it is the same
 * `legalEntity.address` the privacy policy prints, confirmed with the ICO
 * registration, so it is a published fact rather than a claim. It is what
 * lets a "brand + town" query — the first thing the founders searched for —
 * resolve to this site, and it is what the Business Profile is matched
 * against. Read from legal.ts so the two can never disagree.
 */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    /* One identifier for the business, so the WebSite node below and the
       Service node on /web-design-grimsby point at this entity rather than
       each restating it. Google joins nodes by @id. */
    "@id": `${site.url}/#business`,
    name: site.name,
    /* The solid logotype — the domain, the email domain and what the
       founders type into Google. Google's autocomplete rewrites that
       one-word query to two words and serves the other studios called
       Blackline (2026-09-18, the search that prompted this); `alternateName`
       is the documented way to state that the joined form is this business,
       not a typo. Only the form the client actually uses — no invented
       spellings. */
    alternateName: site.logotype,
    description: site.description,
    url: site.url,
    /* The BL monogram as a 512px PNG at a fixed path (public/logo.png,
       rendered from src/app/icon.svg). `logo` is what Google uses for the
       brand image beside results and in a knowledge panel; it must be a
       crawlable raster of at least 112px, and it must not move, which is
       why it is not the hashed favicon route. `image` is the recommended
       LocalBusiness field; the same mark is the honest answer until there
       is a photograph of the studio. */
    logo: `${site.url}/logo.png`,
    image: `${site.url}/logo.png`,
    email: site.email,
    telephone: site.phone,
    areaServed: "GB",
    ...(legalEntity.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: legalEntity.address.slice(0, -2).join(", "),
            addressLocality: legalEntity.address[legalEntity.address.length - 2],
            addressRegion: "Lincolnshire",
            postalCode: legalEntity.address[legalEntity.address.length - 1],
            addressCountry: "GB",
          },
        }
      : {}),
    /* Derived from the published build tiers rather than typed, so it cannot
       fall out of step with the grid the way a hand-written range would.
       Google reads `priceRange` on a local/professional service. The postal
       address and company number are still outstanding, and a fabricated
       value in either would be worse than its absence. */
    priceRange: `${site.currencySymbol}${projectTiers[0].price.toLocaleString("en-GB")}–${site.currencySymbol}${projectTiers[projectTiers.length - 1].price.toLocaleString("en-GB")}`,
    /*
     * `sameAs` is the claim "these profiles are this business" — it is how a
     * search engine reconciles a page with the accounts posting under the
     * same name, and it is what lets an entity panel resolve to the right
     * one. Read from the SAME array the footer renders, so the structured
     * data cannot assert a profile the site does not link to.
     *
     * Filtered on a non-empty `href`: unset entries in that array are marks
     * with no account behind them, and asserting one would be a fabricated
     * identity claim rather than a missing field. Omitted entirely when
     * nothing is confirmed — an empty array is still an assertion.
     */
    ...(socials.some((s) => s.href)
      ? { sameAs: socials.filter((s) => s.href).map((s) => s.href) }
      : {}),
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

  /* The WebSite node is what Google reads the SITE NAME from — the label
     shown above the URL in a result, and the entity a bare brand query is
     matched against. Separate from the business node: schema.org treats a
     website and the organisation behind it as different things, and Google's
     site-name guidance asks for WebSite on the homepage specifically. Same
     two name forms as above, nothing else claimed. */
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.logotype,
    url: site.url,
    publisher: { "@id": `${site.url}/#business` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        /* `jsonLd`, not `JSON.stringify` — the latter leaves `<` intact, so a
           value containing `</script>` would close this tag and everything
           after it would parse as markup. Every value here is ours today;
           `sameAs` already reads from an array that grows, and the escape
           costs nothing. See lib/json-ld.ts. */
        dangerouslySetInnerHTML={{ __html: jsonLd(json) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(website) }}
      />
    </>
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
        {CREATIVE_SERVICE_READY ? <CreativeService compact /> : null}
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
