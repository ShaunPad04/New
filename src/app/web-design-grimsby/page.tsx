import type { Metadata } from "next";
import Link from "next/link";
import { localPage, site } from "@/lib/content";
import { jsonLd } from "@/lib/json-ld";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageIntro, ContactBand, BackHome } from "@/components/page-shell";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * /web-design-grimsby — the one local landing page (2026-09-25).
 *
 * Why it exists and why there is only one: see the comment on `localPage`
 * in content.ts. In short, a Humberston studio can win "web design Grimsby"
 * long before it can win "web design", and a page per town would be a
 * doorway pattern.
 *
 * Composition: the standard intro, one block of its own (three points and
 * the areas list), then the LIVE pricing and FAQ sections. Reusing those is
 * what keeps this page honest — it quotes no figure itself, so it cannot
 * disagree with /pricing when the tiers move, which they have, repeatedly.
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

function LocalSection() {
  return (
    <section
      aria-labelledby="local-heading"
      className="border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
        <p className="eyebrow eyebrow-plain mb-6">{localPage.sectionEyebrow}</p>
        <h2
          id="local-heading"
          className="display text-display-md max-w-[20ch] text-ink-1000"
        >
          <RevealWords text={localPage.sectionHeading[0]} />
          <span className="block text-ink-600">
            <RevealWords text={localPage.sectionHeading[1]} />
          </span>
        </h2>

        <Reveal className="mt-12 lg:mt-16" variant="settle">
          <div className="bezel">
            <div className="bezel-core grid gap-0 lg:grid-cols-3">
              {localPage.points.map((point, i) => (
                <div
                  key={point.title}
                  className={`flex flex-col p-7 sm:p-8 lg:p-10 ${
                    i > 0 ? "border-t border-ink-300 lg:border-t-0 lg:border-l" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.625rem] text-ink-600 tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-[1.0625rem] leading-snug font-medium text-ink-1000">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-800">
                    {point.body}
                  </p>
                  {"link" in point ? (
                    <Link
                      href={point.link.href}
                      className="field-label mt-6 inline-flex min-h-11 items-center gap-2 text-ink-1000 underline decoration-ink-500 underline-offset-4 hover:decoration-ink-1000"
                    >
                      {point.link.label}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col gap-4 lg:mt-16 lg:flex-row lg:items-baseline lg:gap-10">
          <h3 className="field-label shrink-0 text-ink-700">
            {localPage.areasLabel}
          </h3>
          <div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[1rem] text-ink-1000">
              {localPage.areas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
            <p className="mt-3 max-w-[56ch] text-[0.875rem] leading-relaxed text-ink-600">
              {localPage.areasNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WebDesignGrimsbyPage() {
  return (
    <>
      <StructuredData />
      <Header />
      <main id="main" className="flex-1">
        <PageIntro
          eyebrow={localPage.eyebrow}
          image="/images/capabilities/build-tolerance.webp"
          headingId="local-page-heading"
          heading={localPage.heading}
          lede={localPage.lede}
        />
        <LocalSection />
        <Pricing compact />
        <Faq compact />
        <ContactBand heading={localPage.contactHeading} />
        <BackHome />
      </main>
      <Footer />
    </>
  );
}
