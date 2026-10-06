import type { Metadata, ResolvingMetadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { notFound } from "next/navigation";
import { publishedServicePages } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceStructuredData } from "@/components/service-structured-data";
import { ServiceView } from "@/components/v3/service-view";

/**
 * /services/<slug> — one page per service (2026-09-25).
 *
 * Why these exist, what they may say and where their figures come from is
 * the comment on `servicePages` in content.ts. Statically generated from
 * `publishedServicePages`; an unknown slug is a 404 rather than an empty
 * page, and the creative page disappears with its section's flag.
 * /services/ai was retired on 2026-10-06 for /ai (redirect in next.config.ts).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedServicePages.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const page = publishedServicePages.find((p) => p.slug === slug);
  if (!page) return {};
  return pageMetadata(parent, { title: page.metaTitle, description: page.metaDescription, path: `/services/${page.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const page = publishedServicePages.find((p) => p.slug === slug);
  if (!page) notFound();

  /* Every service page is in the homepage's system (Brad, 2026-10-05: "do
     the remaining old pages"), all on `ServiceView`. */
  return (
    <>
      <ServiceStructuredData path={`/services/${page.slug}`} name={page.metaTitle} description={page.metaDescription} />
      <Header />
      <main id="main" className="v3 flex-1">
        <ServiceView page={page} />
      </main>
      <Footer />
    </>
  );
}
