import { site } from "@/lib/content";
import { jsonLd } from "@/lib/json-ld";

/**
 * A Service node joined to the business by @id (the homepage defines it),
 * plus a BreadcrumbList so a result can show Home › Services › this page.
 * Only fields the page itself states; no prices, which live in the visible
 * pricing and change too often to duplicate here. Used by /services/<slug>
 * and by /ai, which has no parent under /services (`parent: null`).
 */
export function ServiceStructuredData({
  path,
  name,
  description,
  parent = { name: "Services", path: "/services" },
}: {
  path: string;
  name: string;
  description: string;
  parent?: { name: string; path: string } | null;
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
