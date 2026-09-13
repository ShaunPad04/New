import { menu } from "@/lib/menu";
import { openingHours, site } from "@/lib/site";

/**
 * STRUCTURED DATA
 *
 * `CafeOrCoffeeShop` carries only verified facts: name, address, phone,
 * email, geo (from the FSA register), opening hours (official website),
 * the menu URL and the official social profiles. No aggregateRating, no
 * review objects, no priceRange, no founding date — none are verified to
 * Google's standard, and inventing them to enrich a search result is the
 * kind of schema fabrication that earns a manual action.
 *
 * The Menu schema mirrors the typed menu data one-to-one.
 */
export function LocalBusinessJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${site.url}/#cafe`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: "+441472472140",
    email: site.email,
    image: `${site.url}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.town,
      addressRegion: site.address.county,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    hasMap: site.googleMaps,
    openingHoursSpecification: openingHours.map((row) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: row.days,
      opens: row.opens,
      closes: row.closes,
    })),
    servesCuisine: ["Coffee", "Brunch", "Café", "Wine bar"],
    hasMenu: `${site.url}/menu`,
    sameAs: [site.instagram, site.facebook],
  };

  return (
    <script
      type="application/ld+json"
      // Serialised from literals we control — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function MenuJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${site.url}/menu#menu`,
    name: `${site.name} menu`,
    url: `${site.url}/menu`,
    inLanguage: "en-GB",
    hasMenuSection: menu.flatMap((category) =>
      category.sections.map((section) => ({
        "@type": "MenuSection",
        name: section.title,
        url: `${site.url}/menu#${section.id}`,
        hasMenuItem: section.items.map((item) => {
          const offers = item.price !== undefined
            ? [{ "@type": "Offer", price: item.price.toFixed(2), priceCurrency: "GBP" }]
            : item.wine
              ? [
                  { "@type": "Offer", name: "175ml", price: item.wine.g175.toFixed(2), priceCurrency: "GBP" },
                  { "@type": "Offer", name: "250ml", price: item.wine.g250.toFixed(2), priceCurrency: "GBP" },
                  { "@type": "Offer", name: "Bottle", price: item.wine.bottle.toFixed(2), priceCurrency: "GBP" },
                ]
              : item.sparkling
                ? [
                    ...(item.sparkling.glass
                      ? [{ "@type": "Offer", name: "Glass", price: item.sparkling.glass.toFixed(2), priceCurrency: "GBP" }]
                      : []),
                    { "@type": "Offer", name: "Bottle", price: item.sparkling.bottle.toFixed(2), priceCurrency: "GBP" },
                  ]
                : [];
          return {
            "@type": "MenuItem",
            name: item.name,
            ...(item.description ? { description: item.description } : {}),
            offers,
            ...(item.dietary?.includes("v")
              ? { suitableForDiet: "https://schema.org/VegetarianDiet" }
              : {}),
          };
        }),
      }))
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function BreadcrumbJsonLd({ name, path }: { name: string; path: string }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name, item: `${site.url}${path}` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
