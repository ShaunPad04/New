import { faqs } from "@/lib/content";
import { Accordion } from "@/components/accordion";
import { Appear } from "@/components/appear";

/**
 * FAQ — reference layout: sticky left column (450px, top 100px) with the
 * eyebrow, 48px heading and 18px description; accordion in a 742px column.
 */
export function Faq({ items = faqs }: { items?: readonly { q: string; a: string }[] }) {
  return (
    <section className="section" aria-labelledby="faq-heading">
      <div className="container grid gap-10 lg:grid-cols-[450px_1fr] lg:gap-16">
        <div className="flex flex-col gap-4 lg:sticky lg:top-[100px] lg:self-start">
          <Appear><p className="eyebrow">FAQ</p></Appear>
          <Appear delay={0.1}><h2 id="faq-heading" className="h-section">Things you should know</h2></Appear>
          <Appear delay={0.2}><p className="lede max-w-[400px]">Straight answers on new homes, part exchange, assisted move and selling with New Home Agents.</p></Appear>
        </div>
        <Appear delay={0.15}><Accordion items={items} /></Appear>
      </div>
    </section>
  );
}
