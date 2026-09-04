import type { Metadata, Viewport } from "next";
import { business, SITE_URL, SITE_INDEXABLE } from "@/lib/site";
import { shellHtml } from "@/lib/content";
import { SiteBehaviour } from "@/components/site-behaviour";
import "./zenden.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Zen Den Beauty & Wellbeing Centre | Humberston",
    template: "%s",
  },
  description:
    "Premium beauty and wellbeing treatments in Humberston — facials, lashes, brows, massage, holistic therapies and more. Book with Zen Den Beauty & Wellbeing Centre.",
  applicationName: business.name,
  authors: [{ name: business.name }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: business.name,
    title: "Zen Den Beauty & Wellbeing Centre | Humberston",
    description:
      "A calm place to pause, restore and feel looked after. Beauty and wellbeing treatments in the heart of Humberston.",
  },
  // Preview builds are not indexed. Production sets NEXT_PUBLIC_SITE_INDEXABLE=true.
  robots: SITE_INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e9",
  colorScheme: "light",
};

const shellStyle = { display: "contents" as const };

function StructuredData() {
  const openingHours = business.hours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.open,
      closes: h.close,
    }));
  const json = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: business.name,
    url: SITE_URL,
    telephone: business.telephoneE164,
    image: `${SITE_URL}/images/zen/asset-02.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.line1,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postcode,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: openingHours,
    sameAs: [business.links.instagram, business.links.facebook, business.links.fresha],
    // Rating is shown on the page and sourced from the live Fresha profile.
    // Re-verify the count before indexing (see src/lib/site.ts).
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating.value,
      reviewCount: business.rating.count,
      bestRating: "5",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <div
          style={shellStyle}
          dangerouslySetInnerHTML={{ __html: shellHtml("header") }}
        />
        {children}
        <div
          style={shellStyle}
          dangerouslySetInnerHTML={{ __html: shellHtml("footer") }}
        />
        <SiteBehaviour />
        <StructuredData />
      </body>
    </html>
  );
}
