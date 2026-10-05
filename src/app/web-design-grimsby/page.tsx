import type { Metadata } from "next";
import Link from "next/link";
import { localPage, rateCard, site } from "@/lib/content";
import { jsonLd } from "@/lib/json-ld";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/v3/page-hero";
import { FaqList } from "@/components/v3/faq-list";
import { LABEL } from "@/components/v3/page-grid";
import { Divided, Part } from "@/components/v3/pricing-parts";
import { BuildPrices, JumpList } from "@/components/v3/service-view";

/**
 * /web-design-grimsby — the one local landing page (2026-09-25).
 *
 * Why it exists and why there is only one: see the comment on `localPage`
 * in content.ts. In short, a Humberston studio can win "web design Grimsby"
 * long before it can win "web design", and a page per town would be a
 * doorway pattern.
 *
 * In the homepage's system since 2026-10-05 (Brad: "do the remaining old
 * pages"): the page top with "grimsby" enormous, the local studio (three
 * points and the areas, set large), the builds exactly as /pricing and the
 * web design page set them, and the local questions. It still quotes no
 * figure itself, so it cannot disagree with /pricing when the tiers move,
 * which they have, repeatedly.
 */
export const metadata: Metadata = {
  title: localPage.metaTitle,
  description: localPage.metaDescription,
  alternates: { canonical: localPage.path },
};

/**
 * A Service node scoped to the area. The business itself is described once,
 * on the homepage; this names what is offered HERE and where, which is the
 * question a local search and an AI answer engine are both asking. Only the
 * towns the page lists, only the business's verified name and URL.
 */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Web design",
    name: localPage.metaTitle,
    description: localPage.metaDescription,
    url: `${site.url}${localPage.path}`,
    /* The same entity the homepage describes, joined by @id. */
    provider: {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#business`,
      name: site.name,
      url: site.url,
    },
    areaServed: localPage.areas.map((name) => ({ "@type": "City", name })),
  };

  return (
    <script
      type="application/ld+json"
      /* `jsonLd`, not `JSON.stringify` — see lib/json-ld.ts. */
      dangerouslySetInnerHTML={{ __html: jsonLd(json) }}
    />
  );
}

export default function WebDesignGrimsbyPage() {
  const { areas } = localPage;
  return (
    <>
      <StructuredData />
      <Header />
      <main id="main" className="v3 flex-1">
        <PageHero
          id="local-page-heading"
          title={localPage.heading}
          word="grimsby"
          label="Grimsby"
          ja="グリムズビー"
          count={{ value: String(areas.length).padStart(2, "0"), label: "areas" }}
          lede={localPage.lede}
          image="/images/process/launch.webp"
          aside={
            <JumpList
              rows={[
                { href: "#local", label: localPage.sectionEyebrow, tag: "01" },
                { href: "#prices", label: "Prices", tag: "02" },
                { href: "#faq", label: "Questions", tag: "03" },
                { href: "/pricing", label: "All pricing", tag: "→" },
              ]}
            />
          }
        />

        <div className="bg-ink-0 px-6 sm:px-10">
          <Part
            id="local"
            index="01"
            label={localPage.sectionEyebrow}
            heading={
              <>
                {localPage.sectionHeading[0]} <span className="text-ink-600">{localPage.sectionHeading[1]}</span>
              </>
            }
          >
            <ul className="mt-12 grid border-t border-ink-1000 lg:mt-16 lg:grid-cols-3">
              {localPage.points.map((p, i) => (
                <li key={p.title} className={`border-b border-ink-300 py-8 max-lg:last:border-b-0 lg:border-b-0 lg:py-10 lg:pr-8 ${i ? "lg:border-l lg:pl-8" : ""}`}>
                  <Reveal variant="settle" delay={i * 0.07}>
                    <span className="font-[family-name:var(--font-cal-ui)] text-[1.125rem] leading-none tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-4 text-[1.375rem] font-semibold uppercase leading-none tracking-[-0.03em] text-ink-1000">{p.title}</h3>
                    <p className="mt-3 max-w-[40ch] text-[1rem] leading-relaxed text-ink-800">{p.body}</p>
                    {"link" in p ? (
                      <Link href={p.link.href} className={`group mt-5 inline-flex min-h-11 items-center gap-2 text-ink-1000 transition-colors hover:text-accent ${LABEL}`}>
                        {p.link.label}
                        <span aria-hidden="true" className="text-base transition-transform duration-500 group-hover:rotate-180">
                          +
                        </span>
                      </Link>
                    ) : null}
                  </Reveal>
                </li>
              ))}
            </ul>

            <div className="mt-14 grid gap-6 border-t border-ink-300 pt-10 lg:mt-20 lg:grid-cols-3 lg:gap-0">
              <h3 className={`${LABEL} text-ink-700 lg:pr-10 lg:pt-3`}>{localPage.areasLabel}</h3>
              <div className="lg:col-span-2 lg:pl-3">
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[clamp(1.75rem,3.4vw,3.25rem)] font-semibold uppercase leading-[1.05] tracking-[-0.045em] text-ink-1000">
                  {areas.map((area, i) => (
                    <li key={area}>
                      {area}
                      {i < areas.length - 1 ? (
                        <span aria-hidden="true" className="text-ink-600">
                          {" "}
                          /
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 max-w-[56ch] text-[1rem] leading-relaxed text-ink-700">{localPage.areasNote}</p>
              </div>
            </div>
          </Part>

          <Divided>
            <Part id="prices" index="02" label="Prices" heading="How it's priced." lede={rateCard.sections.builds.lede}>
              <BuildPrices />
            </Part>
          </Divided>

          {/* Not the homepage's first five: this page has a local question to
              answer, and `Local` does not sit at the top of `faqs`. Selecting
              by meta keeps the set local-first while the answers stay in
              content.ts. */}
          <Divided>
            <FaqList
              index="03"
              metas={["Local", "Pricing", "Timeline", "Guarantee", "Process"]}
              heading="Asked by local businesses."
              lede="What people in Grimsby and Cleethorpes ask before they commission us. If yours is not here, ask directly — you will get a straight answer."
            />
          </Divided>
        </div>
      </main>
      <Footer />
    </>
  );
}
