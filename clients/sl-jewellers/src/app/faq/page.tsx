import type { Metadata } from "next";
import { FAQ, SITE_URL } from "@/lib/content";
import Faq from "@/components/sections/Faq";

/**
 * The questions on a page of their own. They used to sit on the home page, which
 * made it a screen longer without being what anyone had come for. The FAQPage
 * schema moved with them, so Google reads the answers here instead.
 */
export const metadata: Metadata = {
  title: "Questions, answered",
  description:
    "Solid gold only, genuine watches, whether S&L buy gold, how to know what you are buying, UK next-day delivery, buying through the shop and part-exchange. S&L Jewellers, 49 Cambridge Street, Cleethorpes.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faq`,
    mainEntity: FAQ.filter((f) => !f.todo).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Faq as="h1" />
    </>
  );
}
