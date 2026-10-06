import Hero from "@/components/sections/Hero";
import Collections from "@/components/sections/Collections";
import ServiceTiles from "@/components/sections/ServiceTiles";
import PricesStrip from "@/components/sections/PricesStrip";
import Reviews from "@/components/sections/Reviews";
import Reels from "@/components/sections/Reels";
import Visit from "@/components/sections/Visit";
import ProofMarquee from "@/components/motion/ProofMarquee";
import { BUSINESS, REVIEWS, SITE_URL } from "@/lib/content";
import { openingHoursSpec } from "@/lib/hours";

/** Hourly ISR: the gold strip's figures are rendered on the server, so they are in the HTML on
 *  first paint. The upstream price call is cached for a day inside that (see lib/metal-prices). */
export const revalidate = 3600;

export default function HomePage() {
  const b = BUSINESS;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "JewelryStore",
        "@id": `${SITE_URL}/#shop`,
        name: b.name,
        legalName: b.legalName,
        url: SITE_URL,
        telephone: b.phone.e164,
        email: b.email,
        image: `${SITE_URL}/og.jpg`,
        logo: `${SITE_URL}/logo-lockup.png`,
        priceRange: "££",
        address: {
          "@type": "PostalAddress",
          streetAddress: b.address.street,
          addressLocality: b.address.town,
          addressRegion: b.address.county,
          postalCode: b.address.postcode,
          addressCountry: b.address.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: b.geo.lat, longitude: b.geo.lng },
        hasMap: b.social.google.mapsUrl,
        ...(b.hours.confirmed ? { openingHoursSpecification: openingHoursSpec(b.hours.week) } : {}),
        sameAs: [b.social.instagram.url, b.social.facebook.url, b.social.tiktok.url, b.social.google.mapsUrl],
        // Real figure read from Google Maps on 25 Sep 2026.
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: REVIEWS.google.rating,
          reviewCount: REVIEWS.google.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: b.name,
        inLanguage: "en-GB",
        publisher: { "@id": `${SITE_URL}/#shop` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <ProofMarquee />
      <Collections />
      <ServiceTiles />
      <PricesStrip />
      <Reviews />
      <Reels />
      <Visit />
    </>
  );
}
