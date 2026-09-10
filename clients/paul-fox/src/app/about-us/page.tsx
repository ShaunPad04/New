import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { aboutPage } from "@/lib/pages";
import { about } from "@/lib/content";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Features } from "@/components/features";
import { TeamRow } from "@/components/team-row";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "About Us",
  description: aboutPage.lede,
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow={aboutPage.eyebrow}
        title={aboutPage.title}
        copy={aboutPage.lede}
        image={upload(aboutPage.image)}
        imageAlt={aboutPage.imageAlt}
        ctas={[{ label: "Book a free valuation", href: "/valuation-request" }]}
      />

      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <Appear>
              <p className="caption2">[ OUR STORY ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">family-run, since 1990</h2>
            </Appear>
            <Appear delay={0.2}>
              <p className="h5 !font-normal !text-ink-600">{aboutPage.statement}</p>
            </Appear>
          </div>
          <div className="flex flex-1 flex-col gap-4 tablet:max-w-[560px]">
            {aboutPage.paragraphs.map((p, i) => (
              <Appear key={i} delay={0.2 + i * 0.1}>
                <p className="body">{p}</p>
              </Appear>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Appear>
              <p className="caption2">[ TIMELINE ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">35 years, five offices</h2>
            </Appear>
          </div>
          <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-4">
            {aboutPage.timeline.map((t, i) => (
              <Appear key={t.year} delay={0.2 + i * 0.05}>
                <div className="flex h-full flex-col gap-10 rounded-lg bg-ink-50 p-5">
                  <p className="caption2 border-b border-ink-200 pb-5">[{String(i + 1).padStart(2, "0")}]</p>
                  <div className="flex flex-col gap-2">
                    <p className="h3">{t.year}</p>
                    <p className="body-sm">{t.text}</p>
                  </div>
                </div>
              </Appear>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container flex flex-col gap-5 tablet:flex-row">
          {about.stats.map((stat, i) => (
            <Appear key={stat.index} delay={i * 0.1} className="flex flex-1">
              <div className="flex w-full flex-col gap-20 rounded-lg bg-ink-50 p-5">
                <p className="caption2 border-b border-ink-200 pb-5">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="h2 flex-1">{stat.value}</p>
                  <p className="caption text-right">{stat.index}</p>
                </div>
              </div>
            </Appear>
          ))}
        </div>
      </section>

      <TeamRow eyebrow="[ MEET OUR FAMILY ]" title="the foxes" slugs={aboutPage.family} />
      <Features />
      <CtaBand
        eyebrow="[ NEXT STEP ]"
        title="ready to move?"
        copy="Book a free, no-obligation valuation with one of our regional valuers, or search what we have for sale and to let today."
        ctas={[
          { label: "Book a free valuation", href: "/valuation-request" },
          { label: "Search properties", href: "/search-results" },
        ]}
      />
    </main>
  );
}
