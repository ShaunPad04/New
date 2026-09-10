import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { finestPage } from "@/lib/pages";
import { salesProperties, priceNumber } from "@/lib/properties";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { PropertyCard } from "@/components/property-card";
import { TeamRow } from "@/components/team-row";
import { Features } from "@/components/features";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Paul Fox Finest",
  description: `${finestPage.copy[0]} ${finestPage.copy[1]}`,
};

export default function FinestPage() {
  const finest = [...salesProperties].sort((a, b) => priceNumber(b) - priceNumber(a)).slice(0, 6);
  return (
    <main>
      <PageHeader
        eyebrow={finestPage.eyebrow}
        title={finestPage.title}
        copy={finestPage.copy[0]}
        image={upload(finestPage.image)}
        ctas={[{ label: "Contact the Finest team", href: "/contact" }]}
      />

      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <Appear>
              <img src={upload(finestPage.logo)} alt="Paul Fox Finest" className="h-16 w-auto rounded-lg bg-ink-900 p-3" loading="lazy" />
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">selling homes for over 30 years</h2>
            </Appear>
          </div>
          <div className="flex flex-1 flex-col gap-4 tablet:max-w-[560px]">
            {finestPage.copy.slice(1).map((p, i) => (
              <Appear key={i} delay={0.2 + i * 0.1}>
                <p className="body">{p}</p>
              </Appear>
            ))}
            <Appear delay={0.5}>
              <Button label="Book a Finest valuation" href="/valuation-request" />
            </Appear>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Appear>
              <p className="caption2">[ FINEST SERVICES ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">we offer a range of finest services</h2>
            </Appear>
          </div>
          <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-5">
            {finestPage.services.map((s, i) => (
              <Appear key={s.number} delay={0.1 + i * 0.05}>
                <div className="flex h-full flex-col justify-between gap-10 rounded-lg bg-ink-50 p-5">
                  <p className="caption2 border-b border-ink-200 pb-5">{s.number}</p>
                  <div className="flex flex-col gap-2">
                    <h3 className="h6">{s.title}</h3>
                    <p className="body-sm">{s.text}</p>
                  </div>
                </div>
              </Appear>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Appear className="overflow-clip rounded-lg bg-ink-900">
            <div className="aspect-video w-full">
              <iframe
                src={finestPage.video}
                title="Paul Fox Finest"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </Appear>
        </div>
      </section>

      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex items-end justify-between gap-5">
            <div className="flex flex-col gap-3">
              <Appear>
                <p className="caption2">[ FINEST HOMES ]</p>
              </Appear>
              <Appear delay={0.1}>
                <h2 className="h2">currently for sale</h2>
              </Appear>
            </div>
            <Appear delay={0.2}>
              <Button label="view all" href="/search-results" />
            </Appear>
          </div>
          <Appear delay={0.3} className="grid grid-cols-1 gap-5 tablet:grid-cols-3">
            {finest.map((p, i) => (
              <PropertyCard key={p.slug} property={p} index={i} />
            ))}
          </Appear>
        </div>
      </section>

      <Features />
      <TeamRow title="meet the paul fox finest team" slugs={finestPage.team} />
      <CtaBand
        eyebrow="[ FINEST ]"
        title="the finest touch"
        copy="Period farmhouses, bespoke new builds, prestige homes and village properties with land. One to one, from appraisal to completion."
        ctas={[{ label: "Contact the Finest team", href: "/contact" }, { label: "Book a valuation", href: "/valuation-request" }]}
      />
    </main>
  );
}
