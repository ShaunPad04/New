import {
  founders,
  projectTiers,
  site,
  socials,
  SHOW_TESTIMONIALS,
  processSteps,
} from "@/lib/content";
import { jsonLd } from "@/lib/json-ld";
import { Header, HeaderSurfaceSentinel } from "@/components/header";
import { Testimonials } from "@/components/testimonials";
import { WhyUs } from "@/components/why-us";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { NeidenHero } from "@/components/v3/neiden-hero";
import { StudioNeiden } from "@/components/v3/studio-neiden";
import { Journey } from "@/components/v3/journey";
import { CaseStudies } from "@/components/v3/case-studies";
import { ServicesExpand } from "@/components/v3/services-expand";
import { PricingLine } from "@/components/v3/pricing-line";
import { Bridge } from "@/components/v3/bridge";
import { SectionRule } from "@/components/v3/lurais-parts";
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

/** The numbered hairline that opens a reused section on this page. */
function Rule({ index, label }: { index: string; label: string }) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
      <SectionRule index={index} label={label} />
    </div>
  );
}

/**
 * THE HOMEPAGE — Lurais direction on design system v2 (Brad, 2026-09-25:
 * approved from /preview; dark; the scroll film kept; the chrome BL
 * mid-page). Layout ideas from the Framer template Lurais, studied not
 * copied. Components in `src/components/v3/`.
 *
 * Every earlier rule that still applies, still applies: the work leads,
 * Concept badges are printed, pricing / FAQ / enquiry are the site's own
 * components with their legal wording untouched, testimonials stay behind
 * TESTIMONIALS_VERIFIED, and no figure appears that is not measured.
 */
/* The exact colours either side of each Bridge. */
const DARK = "#000000";
const CASE = "#161616";
const LIGHT = "#f0f0f0";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <main id="main" className="v3 flex-1">
        <NeidenHero />
        {/* Outside the pinned hero on purpose — see HeaderSurfaceSentinel. */}
        <HeaderSurfaceSentinel />
        {/* A clean portfolio (Brad, 2026-10-02: "not too much writing but
            enough for a homepage"): ~950 words, down from ~1,950. Principles,
            creative, "this site, measured" and the pricing cards left the
            homepage (their copy lives on /services, /pricing and /studio).
            Light bands (`.band-light`, #f0f0f0) alternate with the dark
            sections, and every light/dark edge is a `Bridge`, never a cut. */}
        <Bridge from={DARK} to={LIGHT} />
        <div className="band-light">
          <StudioNeiden headingId="intro-heading" />
        </div>
        <Bridge from={LIGHT} to={CASE} />
        <CaseStudies />
        <Bridge from={CASE} to={DARK} />
        <ServicesExpand index="03" />
        <Bridge from={DARK} to={LIGHT} />
        {/* The journey replaces the Process ride here (Brad, 2026-09-29);
            /services and /studio keep the ride. */}
        <div className="band-light bg-ink-0">
          <Journey index="04" steps={processSteps.map(({ id, index, title, body }) => ({ id, index, title, body }))} />
        </div>
        <Bridge from={LIGHT} to={DARK} />
        {SHOW_TESTIMONIALS ? <Testimonials /> : null}
        {/* Why choose us replaces the homepage FAQ (Brad, 2026-09-26); the
            full FAQ lives on /faq. */}
        <Rule index="05" label="Why us" />
        <WhyUs />
        {/* On black, not a light band (Brad, 2026-10-04: the white rate card
            looked "terrible"), so no Bridges either side. */}
        <PricingLine index="06" />
        <Rule index="07" label="Contact" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
