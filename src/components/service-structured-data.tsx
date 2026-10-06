import { site } from "@/lib/content";
import { jsonLd } from "@/lib/json-ld";

/**
 * A Service node joined to the business by @id (the homepage defines it),
 * plus a BreadcrumbList so a result can show Home › Services › this page.
 * Only fields the page itself states; no prices, which live in the visible
 * pricing and change too often to duplicate here. Used by /services/<slug>
 * and by /ai, which has no parent under /services (`parent: null`) and lists
 * its systems as an OfferCatalog (`catalog`: names and what each does, the
 * page's own words, still no prices).
 */
export function ServiceStructuredData({
  path,
  name,
  description,
  parent = { name: "Services", path: "/services" },
  catalog,
}: {
  path: string;
  name: string;
  description: string;
  parent?: { name: string; path: string } | null;
  catalog?: { name: string; items: { name: string; description: string }[] };
}) {
  const url = `${site.url}${path}`;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url,
    areaServed: "GB",
    provider: {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#business`,
      name: site.name,
      url: site.url,
    },
    ...(catalog
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: catalog.name,
            itemListElement: catalog.items.map((i) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: i.name, description: i.description },
            })),
          },
        }
      : {}),
  };
  const trail = [{ name: "Home", item: site.url }, ...(parent ? [{ name: parent.name, item: `${site.url}${parent.path}` }] : []), { name, item: url }];
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, ...t })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        /* `jsonLd`, not `JSON.stringify` — see lib/json-ld.ts. */
        dangerouslySetInnerHTML={{ __html: jsonLd(service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }}
      />
    </>
  );
}
