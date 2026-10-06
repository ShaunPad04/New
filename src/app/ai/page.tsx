import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AiAutomationPage } from "@/components/v3/ai-automation";

/**
 * /ai — AI automation landing page. TEST VERSION on feature/ai-automation-page
 * (2026-10-06): noindex and left out of the sitemap until Brad signs it off.
 */
export const metadata: Metadata = {
  title: "AI Automation for UK Businesses",
  description:
    "AI receptionists, speed-to-lead, CRMs, review engines and admin automation for busy local businesses. Book a free automation audit.",
  alternates: { canonical: "/ai" },
  robots: { index: false, follow: false },
};

export default function AiRoute() {
  return (
    <>
      <Header />
      <main id="main" className="v3 flex-1">
        <AiAutomationPage />
      </main>
      <Footer />
    </>
  );
}
