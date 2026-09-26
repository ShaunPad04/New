import type { Metadata } from "next";
import { HeaderA, HeaderB } from "@/components/concepts/header-concepts";
import { PricingA, PricingB } from "@/components/concepts/pricing-concepts";
import { FaqA, FaqB } from "@/components/concepts/faq-concepts";
import { FooterA, FooterB } from "@/components/concepts/footer-concepts";

/**
 * /concepts — design options for Brad to choose between (2026-09-25):
 * header mark, pricing, FAQ, footer. Two each, real content only.
 * Noindex, not in the sitemap, linked from nowhere. Delete once chosen.
 */
export const metadata: Metadata = {
  title: "Design concepts",
  robots: { index: false, follow: false },
};

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-ink-300 px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-ink-600">Concept</p>
      <h2 className="display mt-3 text-4xl text-ink-1000">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export default function ConceptsPage() {
  return (
    <main id="main" className="flex-1 bg-ink-0">
      <header className="px-6 pb-10 pt-16 sm:px-10 lg:px-16">
        <h1 className="display text-5xl text-ink-1000">Design concepts</h1>
        <p className="mt-4 max-w-[60ch] text-sm text-ink-700">
          Two options each. Pick one per part. Every price, answer and legal
          line is the live site&rsquo;s, unchanged.
        </p>
      </header>
      <Block id="header-a" title="Header A — monogram centred"><HeaderA /></Block>
      <Block id="header-b" title="Header B — monogram + name, left"><HeaderB /></Block>
      <Block id="pricing-a" title="Pricing A — the rate sheet"><PricingA /></Block>
      <Block id="pricing-b" title="Pricing B — the selector"><PricingB /></Block>
      <Block id="faq-a" title="FAQ A — the index"><FaqA /></Block>
      <Block id="faq-b" title="FAQ B — the reader"><FaqB /></Block>
      <Block id="footer-a" title="Footer A — the signature"><FooterA /></Block>
      <Block id="footer-b" title="Footer B — the plate"><FooterB /></Block>
    </main>
  );
}
