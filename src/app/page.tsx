import { existsSync } from "node:fs";
import { join } from "node:path";
import { founders, site, faqs, SHOW_TESTIMONIALS } from "@/lib/content";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { ScrollStatement } from "@/components/scroll-statement";
import { Visibility } from "@/components/visibility";
import { Services } from "@/components/services";
import { Work } from "@/components/work";
import { Process } from "@/components/process";
import { Features } from "@/components/features";
import { Stack } from "@/components/stack";
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
 * <Image> the hero falls back to its designed CSS stage. Dropping any of the
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
 *
 * The FAQPage node is not decoration: it is the machine-readable half of the
 * AEO work this site sells. It is what an answer engine lifts, and it is
 * generated from the same `faqs` array the page renders, so the two can never
 * drift apart — marked-up answers that do not match the visible page are a
 * structured-data violation in their own right.
 */
function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#organisation`,
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
          "Search engine optimisation",
          "Answer engine optimisation",
          "Generative engine optimisation",
          "Structured data",
          "Core Web Vitals",
          "Email marketing",
          "SMS marketing",
          "Conversion rate optimisation",
          "Managed web hosting",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Serialised from a literal we control — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
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

        <div className="py-24 lg:py-36">
          <ScrollStatement
            label="About"
            text="We build websites that get found on every surface search now has — ranked by Google, quoted inside AI Overviews, and named when someone asks an assistant who to use."
          />
        </div>

        <Visibility />
        <Services />
        <Work />
        <Process />
        <Features />
        <Stack />
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
