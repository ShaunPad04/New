import { existsSync } from "node:fs";
import { join } from "node:path";
import { site, TESTIMONIALS_VERIFIED } from "@/lib/content";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Services } from "@/components/services";
import { Work } from "@/components/work";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { Studio } from "@/components/studio";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

/**
 * Resolve the hero photograph at build time.
 *
 * The asset is not in the repository yet, so rather than shipping a broken
 * <Image> the hero falls back to its designed CSS plate. Dropping any of the
 * filenames below into public/images/ upgrades the hero with no code change.
 */
const HERO_CANDIDATES = [
  "hero.avif",
  "hero.webp",
  "hero.jpg",
  "hero.png",
] as const;

function resolveHero(): string | null {
  for (const file of HERO_CANDIDATES) {
    if (existsSync(join(process.cwd(), "public", "images", file))) {
      return `/images/${file}`;
    }
  }
  return null;
}

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
    areaServed: "GB",
    knowsAbout: [
      "Web design",
      "Web development",
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
        <Hero heroSrc={resolveHero()} />
        <Marquee />
        <Services />
        <Work />
        {/* Gated at the tree, not just inside the component: Testimonials
            returns null while unverified, but rendering it would still ship
            embla-carousel (~15kB) in the initial bundle for a section that
            draws nothing. Excluding it here lets the bundler drop it. */}
        {TESTIMONIALS_VERIFIED ? <Testimonials /> : null}
        <Pricing />
        <Studio />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
