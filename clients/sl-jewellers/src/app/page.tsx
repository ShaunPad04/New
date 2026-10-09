import Hero from "@/components/sections/Hero";
import Collections from "@/components/sections/Collections";
import ServiceTiles from "@/components/sections/ServiceTiles";
import PricesStrip from "@/components/sections/PricesStrip";
import Visit from "@/components/sections/Visit";
import Statement from "@/components/sections/Statement";
import WatchShop from "@/components/sections/WatchShop";
import Reviews from "@/components/sections/Reviews";
import Reels from "@/components/sections/Reels";
import { BUSINESS, SITE_URL } from "@/lib/content";
import { openingHoursSpec } from "@/lib/hours";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/" } };

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
        parentOrganization: { "@id": `${SITE_URL}/#org` },
        // No aggregateRating: the stars are Google's and Facebook's, and Google's rules for
        // review markup forbid marking up ratings gathered on another site (QA, 8 Oct 2026).
        // The page still shows them, linked to where they live.
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: b.name,
        legalName: b.legalName,
        url: SITE_URL,
        logo: `${SITE_URL}/logo-lockup.png`,
        email: b.email,
        telephone: b.phone.e164,
        address: {
          "@type": "PostalAddress",
          streetAddress: b.address.street,
          addressLocality: b.address.town,
          addressRegion: b.address.county,
          postalCode: b.address.postcode,
          addressCountry: b.address.country,
        },
        identifier: { "@type": "PropertyValue", propertyID: "Companies House", value: b.companyNumber },
        sameAs: [b.social.instagram.url, b.social.facebook.url, b.social.tiktok.url],
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
      {/* the hero scrolls away with the page and the mark answers the scroll itself (HeroMark);
          the old pinned "Sheet" hand-off read as the logo falling down the screen */}
      <Hero />
      <Statement />
      <Collections />
      <WatchShop />
      <ServiceTiles />
      <PricesStrip />
      <div id="reviews" className="scroll-mt-16">
        <Reviews />
      </div>
      <Reels />
      <Visit />
    </>
  );
}
