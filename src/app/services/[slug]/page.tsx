import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publishedServicePages, services, site } from "@/lib/content";
import { jsonLd } from "@/lib/json-ld";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageIntro, ContactBand, BackHome } from "@/components/page-shell";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import {
  AiPricing,
  CreativeDetail,
  PlanPricing,
  ServiceDetail,
  ServicePageLinks,
} from "@/components/service-page";

/**
 * /services/<slug> — one page per service (2026-09-25).
 *
 * Why these exist, what they may say and where their figures come from is
 * the comment on `servicePages` in content.ts. Statically generated from
 * `publishedServicePages`; an unknown slug is a 404 rather than an empty
 * page, and the creative page disappears with its section's flag.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedServicePages.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = publishedServicePages.find((p) => p.slug === slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/services/${page.slug}` },
  };
}

/**
 * A Service node joined to the business by @id (the homepage defines it),
 * plus a BreadcrumbList so a result can show Home › Services › this page.
 * Only fields the page itself states; no prices, which live in the visible
 * pricing and change too often to duplicate here.
 */
function StructuredData({
  slug,
  name,
  description,
}: {
  slug: string;
  name: string;
  description: string;
}) {
  const url = `${site.url}/services/${slug}`;
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
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
      { "@type": "ListItem", position: 3, name, item: url },
    ],
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

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const page = publishedServicePages.find((p) => p.slug === slug);
  if (!page) notFound();

  const covered = page.serviceIds
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is (typeof services)[number] => Boolean(s));

  return (
    <>
      <StructuredData slug={page.slug} name={page.metaTitle} description={page.metaDescription} />
      <Header />
      <main id="main" className="flex-1">
        <PageIntro
          eyebrow={page.eyebrow}
          image={page.image}
          headingId="service-page-heading"
          heading={page.heading}
          lede={page.lede}
        />

        {covered.map((service) => (
          <ServiceDetail key={service.id} service={service} />
        ))}

        {page.pricing === "build" ? <Pricing /> : null}
        {page.pricing === "plans" ? (
          <PlanPricing planIds={page.planIds ?? []} note={page.pricingNote} />
        ) : null}
        {page.pricing === "ai" ? <AiPricing /> : null}
        {page.pricing === "creative" ? <CreativeDetail note={page.pricingNote} /> : null}

        {page.faqMetas.length > 0 ? (
          <Faq
            metas={page.faqMetas}
            heading="Questions we get asked."
            lede={`What people usually ask about ${page.label} before they get in touch.`}
          />
        ) : null}

        <ServicePageLinks current={page.slug} heading="Other services." />
        <ContactBand heading="Want to talk it through?" />
        <BackHome />
      </main>
      <Footer />
    </>
  );
}
