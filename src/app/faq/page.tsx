import type { Metadata } from "next";
import { faqs } from "@/lib/content";
import { jsonLd } from "@/lib/json-ld";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Contact } from "@/components/contact";
import { PageHero } from "@/components/v3/page-hero";
import { FaqAccordion } from "@/components/v3/faq-accordion";
import { JumpList } from "@/components/v3/service-view";
import { Divided, Part } from "@/components/v3/pricing-parts";

export const metadata: Metadata = {
  title: "FAQ",
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
      dangerouslySetInnerHTML={{ __html: jsonLd(json) }}
    />
  );
}

/* Three groups, each read by `meta`. The last takes every meta the first two
   do not list, so a new question can never go missing from the page; it
   lands under "After launch" until it is placed. Within a group the order is
   `faqs`' own (cost, timing and ownership first; see the comment there). */
const GROUPS = [
  { id: "cost", label: "Cost & timing", heading: "Cost and timing.", lede: "What it costs, how you pay and when it goes live.", metas: ["Pricing", "Payment", "Timeline", "Packages", "Guarantee"] },
  { id: "working", label: "Working with us", heading: "Working with us.", lede: "What a build needs from you, and what we take on.", metas: ["Steps", "Process", "Development", "Brand", "Creative", "Ownership", "Local"] },
  { id: "after", label: "After launch", heading: "After launch.", lede: "Edits, hosting, the monthly plans and the AI systems.", metas: null },
] as const;
const placed: readonly string[] = GROUPS.flatMap((g) => g.metas ?? []);
const two = (n: number) => String(n).padStart(2, "0");

/**
 * /faq IN THE HOMEPAGE'S SYSTEM (Brad, 2026-10-05: "do the remaining old
 * pages"). Was Nocta's tabbed FAQ; tabs hid half the questions behind a
 * click, so every question is on the page now, in three groups on the
 * page's grid, each in the numbered accordion the other pages use ("x", not
 * a chevron). The enquiry form stays at the foot: the answer to "if yours is
 * not here, ask directly" is the form itself, not a link to another page.
 */
export default function FaqPage() {
  return (
    <>
      <FaqSchema />
      <Header />
      <main id="main" className="v3 flex-1">
        <PageHero
          id="faq-page-heading"
          title="FAQ"
          label="FAQ"
          ja="よくある質問"
          count={{ value: two(faqs.length), label: "questions" }}
          lede="The questions that decide whether someone commissions us, answered before you have to ask them. If yours is not here, ask directly — you will get the same kind of answer."
          image="/images/pages/faq.webp"
          aside={<JumpList rows={[...GROUPS.map((g, i) => ({ href: `#${g.id}`, label: g.label, tag: two(i + 1) })), { href: "#contact", label: "Ask us", tag: "→" }]} />}
        />

        <div className="bg-ink-0 px-6 sm:px-10">
          {GROUPS.map((g, i) => {
            const items = faqs.filter((f) => (g.metas ? (g.metas as readonly string[]).includes(f.meta) : !placed.includes(f.meta))).map(({ q, a }) => ({ q, a }));
            const part = (
              <Part id={g.id} index={two(i + 1)} label={g.label} heading={g.heading} lede={g.lede}>
                <div className="mt-12 lg:mt-16 lg:ml-[calc(100%/3)] lg:pl-3">
                  <FaqAccordion items={items} />
                </div>
              </Part>
            );
            return i ? <Divided key={g.id}>{part}</Divided> : <div key={g.id}>{part}</div>;
          })}
        </div>

        <div className="border-t border-white/12">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
