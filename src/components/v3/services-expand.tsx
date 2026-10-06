import { services, servicesIntro } from "@/lib/content";
import { resolveServiceImage } from "@/lib/work-image";
import { HeroCta } from "./hero-cta";
import { SectionRule } from "./lurais-parts";
import { H2 } from "./page-grid";
import { ExpandList } from "./services-expand-list";

/** Services on the homepage: a statement and its line, then the expanding
    list, set as the price list further down is (Brad, 2026-10-04: the
    "•• SERVICES" heading "just looks weird"; under a rule that already says
    Services, beside a sideways "/What we do", it said the word three times).
    The rows are `ExpandList`: fixed-height text rows (2026-10-06, the
    opening rows were "glitchy"); stills only beside the line below lg. */
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
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-16 sm:px-8 lg:pb-32 lg:pt-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <h2 id="services-heading" className={H2}>
            {servicesIntro.heading}
          </h2>
          <p className="max-w-[44ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">{servicesIntro.lede}</p>
        </div>
        <ExpandList items={items} />
        <div className="mt-10 flex lg:justify-end">
          <div className="w-full lg:w-[24rem]">
            <HeroCta light label="All services" href="/services" />
          </div>
        </div>
      </div>
    </section>
  );
}
