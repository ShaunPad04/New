import type { Metadata } from "next";
import { FAQ, SITE_URL } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import FaqIndex from "@/components/pages/FaqIndex";

/**
 * The questions on a page of their own. They used to sit on the home page, which
 * made it a screen longer without being what anyone had come for. The FAQPage
 * schema moved with them, so Google reads the answers here instead. Nine questions in
 * three topics since 8 Oct 2026, laid out as an index (FaqIndex.tsx).
 */
export const metadata: Metadata = {
  title: "FAQ: Buying, Selling & Repairs, Cleethorpes",
  description:
    "Answers from S&L Jewellers, Cleethorpes: solid gold only, genuine watches, buying, selling and part-exchange, repairs, made to order and next-day UK delivery.",
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
      <section className="section faqp" aria-labelledby="faq-title">
        <Reveal load className="wrap">
          <p className="eyebrow">Before you spend a penny</p>
          <SplitHeading as="h1" load id="faq-title" text={"Questions,\n*answered.*"} className="display-l mt-3" />
          <p className="faqp-lede">Nine things people ask at the counter, answered the way we would answer them there.</p>
        </Reveal>
        <FaqIndex />
      </section>
    </>
  );
}
