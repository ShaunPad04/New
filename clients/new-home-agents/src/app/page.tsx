import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Statement } from "@/components/statement";
import { FeaturedStack } from "@/components/featured-stack";
import { Services } from "@/components/services";
import { Listings } from "@/components/listings";
import { Highlight } from "@/components/highlight";
import { Reviews } from "@/components/reviews";
import { Faq } from "@/components/faq";
import { ClosingCta } from "@/components/closing-cta";
import { aboutStatement, homepagePicks, site, statementAccents } from "@/lib/content";
import { getAllProperties, getFeatured, getHighlighted, type Property } from "@/lib/properties";

export default function HomePage() {
  const all = getAllProperties();
  const byId = new Map(all.map((p) => [p.id, p]));
  const photographed = (p: Property | undefined): p is Property => Boolean(p?.images[0]?.local);
  const pick = (ids: readonly string[]) => ids.map((id) => byId.get(id)).filter(photographed);
  const byPrice = all.filter((p) => photographed(p) && (p.price.amount ?? 0) > 0).sort((a, b) => (b.price.amount ?? 0) - (a.price.amount ?? 0));
  const topUp = (list: Property[], n: number, pool: Property[]) => {
    const out = [...list];
    for (const p of pool) { if (out.length >= n) break; if (!out.some((q) => q.id === p.id)) out.push(p); }
    return out;
  };

  // Curated frames first (homepagePicks), topped up from the price-sorted
  // list so the page never depends on a single listing staying live.
  const heroSlides = topUp(pick(homepagePicks.hero), 5, byPrice);
  const featured = topUp(pick(homepagePicks.featured), 3, getFeatured(6));
  const highlighted = byId.get(homepagePicks.highlight) ?? getHighlighted() ?? featured[0];
  const used = new Set([...heroSlides, ...featured].map((p) => p.id).concat(highlighted?.id ?? []));
  const rich = all.filter((p) => p.images.length >= 3 && !used.has(p.id));
  const [statsLeft = rich[1], statsRight = rich[2]] = pick(homepagePicks.stats);
  const servicePicks = pick(homepagePicks.services);
  const serviceImages = [0, 1, 2, 3].map((i) => servicePicks[i] ?? rich[3 + i]);
  const latest = all.filter((p) => !used.has(p.id) && p.images[0]?.local).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/images/brand/logo.png`,
    address: { "@type": "PostalAddress", streetAddress: "Unit 7, First Floor, Hepton Court", addressLocality: "Leeds", postalCode: "LS9 6PW", addressCountry: "GB" },
    openingHours: "Mo-Su 07:00-23:00",
    sameAs: [site.social.facebook],
    areaServed: "United Kingdom",
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      {/* Everything after the hero slides over it, so this canvas is opaque. */}
      <div className="relative z-10 bg-white">
      <Stats left={statsLeft} right={statsRight} />
      <Statement text={aboutStatement} accents={statementAccents} />
      <FeaturedStack properties={featured} />
      <Services images={serviceImages} />
      <Listings properties={latest} />
      <Highlight />
      <Reviews />
      <Faq />
      <ClosingCta />
      </div>
    </main>
  );
}
