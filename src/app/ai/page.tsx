import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceStructuredData } from "@/components/service-structured-data";
import { AiAutomationPage } from "@/components/v3/ai-automation";
import { automationPage } from "@/lib/ai-automation";

/**
 * /ai — AI automation landing page. TEST VERSION on feature/ai-automation-page
 * (2026-10-06), not on production until Brad signs it off.
 *
 * It REPLACES /services/ai (same two systems, same demos), which now
 * redirects here (next.config.ts), so this page is indexable and in the
 * sitemap: a noindex here would leave the site with no AI page in Google once
 * the branch ships. Preview builds stay noindex sitewide (`SITE_INDEXABLE`).
 */
export const metadata: Metadata = {
  title: automationPage.title,
  description: automationPage.description,
  alternates: { canonical: automationPage.href },
};

export default function AiRoute() {
  return (
    <>
      <ServiceStructuredData path={automationPage.href} name={automationPage.title} description={automationPage.description} parent={null} />
      <Header />
      <main id="main" className="v3 flex-1">
        <AiAutomationPage />
      </main>
      <Footer />
    </>
  );
}
