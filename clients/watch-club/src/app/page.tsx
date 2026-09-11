import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { BrandMarquee } from "@/components/brand-marquee";
import { Collection } from "@/components/collection";
import { Patek } from "@/components/patek";
import { Promise as HousePromise } from "@/components/promise";
import { Testimonials } from "@/components/testimonials";
import { Heritage } from "@/components/heritage";
import { Services } from "@/components/services";
import { Visit } from "@/components/visit";
import { Footer } from "@/components/footer";
import { business, site } from "@/lib/content";

/**
 * LocalBusiness structured data.
 *
 * Only fields verified from public sources. Deliberately NO aggregateRating
 * and no review count: we have not verified the totals ourselves, and an
 * invented rating in structured data is both a Google policy violation and a
 * consumer-protection one.
 */
function structuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: business.name,
    description: site.description,
    foundingDate: String(business.founded),
    telephone: business.phone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postcode,
      addressCountry: business.address.country,
    },
    openingHours: business.hoursSchema,
  };
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <Header />
      <main id="main">
        <Hero />
        <BrandMarquee />
        <Collection />
        <Patek />
        <HousePromise />
        <Testimonials />
        <Heritage />
        <Services />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
