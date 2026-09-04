import type { Metadata } from "next";
import { faqs, site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Faq } from "@/components/faq";
import { PageIntro, ContactBand, BackHome } from "@/components/page-shell";

export const metadata: Metadata = {
  title: `FAQ — ${site.name}`,
  description:
    "Straight answers on timelines, ownership, handover, monthly plans and what we need from you before a build starts.",
  alternates: { canonical: "/faq" },
};

/**
 * FAQPage structured data.
 *
 * Every question and answer here is our own copy about our own process, so
 * there is no third-party claim being asserted and nothing to verify behind a
 * flag. It is emitted only on this route, where the FAQ is the page's subject.
 */
function FaqSchema() {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function FaqPage() {
  return (
    <>
      <FaqSchema />
      <Header />
      <main id="main" className="flex-1">
        <PageIntro
          eyebrow="FAQ"
          headingId="faq-page-heading"
          heading="Straight answers."
          lede="The questions that decide whether someone commissions us, answered before you have to ask them. If yours is not here, ask directly — you will get the same kind of answer."
        />
        <Faq />
        <ContactBand heading="Still got a question?" />
        <BackHome />
      </main>
      <Footer />
    </>
  );
}
