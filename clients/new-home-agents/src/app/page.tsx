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
import { aboutStatement, site } from "@/lib/content";
import { getAllProperties, getFeatured, getHighlighted } from "@/lib/properties";

export default function HomePage() {
  const all = getAllProperties();
  const featured = getFeatured(3);
  const highlighted = getHighlighted() ?? featured[0];
  const used = new Set([...featured.map((p) => p.id), highlighted?.id]);
  const rich = all.filter((p) => p.images.length >= 3 && !used.has(p.id));
  // Hero slideshow: the five highest-value listings with local photography.
  const heroSlides = [...all].filter((p) => p.images[0]?.local && (p.price.amount ?? 0) > 0).sort((a, b) => (b.price.amount ?? 0) - (a.price.amount ?? 0)).slice(0, 5);
  for (const p of heroSlides) used.add(p.id);
  const statsLeft = rich[1];
  const statsRight = rich[2];
  const serviceImages = [rich.find((p) => p.isNewHome), rich[3], rich[4], rich.find((p) => !p.isNewHome)];
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
      <Hero slides={heroSlides} />
      <Stats left={statsLeft} right={statsRight} />
      <Statement text={aboutStatement} />
      <FeaturedStack properties={featured} />
      <Services images={serviceImages} />
      <Listings properties={latest} />
      {highlighted ? <Highlight property={highlighted} /> : null}
      <Reviews />
      <Faq />
      <ClosingCta />
    </main>
  );
}
