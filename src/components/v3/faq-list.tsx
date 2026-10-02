import Link from "next/link";
import { faqs } from "@/lib/content";
import { FaqAccordion } from "./faq-accordion";
import { H2, SectionLabel } from "./page-grid";

/**
 * A page's questions on the hero's grid (2026-10-02): the label in the first
 * column, heading, lede and the accordion across the other two. `metas`
 * picks the questions by their `meta` key, in the order `faqs` holds them
 * (cost, timing, ownership first; see the comment on `faqs`).
 */
export function FaqList({ index, metas, heading, lede }: { index: string; metas: string[]; heading: string; lede: string }) {
  const items = faqs.filter((f) => metas.includes(f.meta)).map(({ q, a }) => ({ q, a }));
  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative z-[2] scroll-mt-24 py-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-0">
        <SectionLabel index={index} label="Questions" className="lg:pr-10" />
        <div className="lg:col-span-2 lg:pl-3">
          <h2 id="faq-heading" className={H2}>
            {heading}
          </h2>
          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">{lede}</p>
          <div className="mt-12">
            <FaqAccordion items={items} />
          </div>
          {items.length < faqs.length ? (
            <p className="mt-8 text-[0.875rem] text-ink-700">
              Every question is answered on the{" "}
              <Link href="/faq" className="text-ink-1000 underline underline-offset-4 hover:text-accent">
                full FAQ page
              </Link>
              .
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
