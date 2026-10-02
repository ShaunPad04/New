import { services } from "@/lib/content";
import { resolveServiceImage } from "@/lib/work-image";
import { ScrollText } from "@/components/kit/scroll-text";
import { BracketLink, Dots, GutterWord, SectionRule } from "./lurais-parts";
import { ExpandList } from "./services-expand-list";

/** Services, as the expanding list (preview, Brad 2026-10-02). Same shell as
    `LuraisServices`; the rows are `ExpandList`. */
export function ServicesExpand({ index }: { index: string }) {
  const items = services.map((s) => ({
    id: s.id,
    index: s.index,
    title: s.title,
    summary: s.summary,
    href: `/services/${s.page}`,
    img: resolveServiceImage(s.id),
  }));
  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-24 bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
        <SectionRule index={index} label="Services" />
      </div>
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-6 pb-24 pt-16 sm:px-8 lg:grid-cols-[14rem_1fr] lg:pb-32 lg:pt-24">
        <GutterWord>What we do</GutterWord>
        <div>
          <ScrollText as="h2" id="services-heading" lead={<Dots />} text="Services" dim={0.45} className="display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] text-ink-1000" />
          <ExpandList items={items} />
          <div className="mt-14">
            <BracketLink href="/services">All services</BracketLink>
          </div>
        </div>
      </div>
    </section>
  );
}
