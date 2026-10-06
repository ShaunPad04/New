import type { Metadata, ResolvingMetadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceStructuredData } from "@/components/service-structured-data";
import { AiAutomationPage } from "@/components/v3/ai-automation";
import { automationPage, automationPageFaqs, automationSystems } from "@/lib/ai-automation";
import { jsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/page-metadata";

/**
 * /ai — the AI automation landing page (2026-10-06).
 *
 * It REPLACES /services/ai (same two systems, same demos), which now
 * redirects here (next.config.ts), so this page is indexable and in the
 * sitemap: a noindex here would leave the site with no AI page in Google.
 * Preview builds stay noindex sitewide (`SITE_INDEXABLE`).
 */
export function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return pageMetadata(parent, { title: automationPage.title, description: automationPage.description, path: automationPage.href });
}

/** The page's questions as FAQPage data: the same list the page renders. */
function FaqSchema() {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: automationPageFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(json) }} />;
}

export default function AiRoute() {
  return (
    <>
      <ServiceStructuredData
        path={automationPage.href}
        name={automationPage.title}
        description={automationPage.description}
        parent={null}
        catalog={{ name: "AI automation systems", items: automationSystems.map((s) => ({ name: s.name, description: s.does })) }}
      />
      <FaqSchema />
      <Header />
      <main id="main" className="v3 flex-1">
        <AiAutomationPage />
      </main>
      <Footer />
    </>
  );
}
