import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { epcPage } from "@/lib/pages";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { TeamRow } from "@/components/team-row";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Energy Performance Certificates (EPCs)",
  description: epcPage.lede,
};

export default function EpcPage() {
  return (
    <main>
      <PageHeader eyebrow={epcPage.eyebrow} title={epcPage.title} copy={epcPage.lede} image={upload(epcPage.image)} ctas={[{ label: "Request an EPC", href: "/contact" }]} />
      <section className="section">
        <div className="container flex flex-col gap-10">
          {epcPage.sections.map((s, i) => (
            <Appear key={s.title} delay={i * 0.1}>
              <div className="flex flex-col gap-5 border-b border-ink-200 pb-10 tablet:flex-row">
                <div className="flex flex-1 items-start gap-5">
                  <p className="h5">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="h4">{s.title}</h2>
                </div>
                <p className="body flex-1 tablet:max-w-[560px]">{s.text}</p>
              </div>
            </Appear>
          ))}
          <Appear delay={0.3}>
            <div className="flex flex-col gap-2 rounded-lg bg-ink-50 p-5 tablet:flex-row tablet:items-center tablet:justify-between">
              <p className="caption2">[ FEE ]</p>
              <p className="body-sm !text-ink-900">{epcPage.fee}</p>
            </div>
          </Appear>
        </div>
      </section>
      <TeamRow eyebrow="[ SURVEY STAFF MEMBERS ]" title="your energy assessors" slugs={epcPage.team} />
      <CtaBand
        eyebrow="[ REQUEST AN EPC ]"
        title="contact your local branch today"
        copy="Our independent Energy Assessor covers Lincolnshire and South Yorkshire at a competitive fee."
        ctas={[{ label: "Contact us", href: "/contact" }, { label: "All surveys", href: "/rics-chartered-property-surveyors" }]}
      />
    </main>
  );
}
