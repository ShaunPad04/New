import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurvey, surveyServices } from "@/lib/pages-data";
import { surveysPage } from "@/lib/pages";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Prose } from "@/components/prose";
import { Button } from "@/components/button";
import { CtaBand } from "@/components/cta-band";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return surveyServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getSurvey(slug);
  if (!s) return {};
  const first = s.blocks.find(([t]) => t === "p")?.[1] ?? "";
  return { title: s.title, description: first.slice(0, 160) };
}

export default async function SurveyPage({ params }: Props) {
  const { slug } = await params;
  const s = getSurvey(slug);
  if (!s) notFound();
  const others = surveyServices.filter((x) => x.slug !== s.slug);

  return (
    <main>
      <PageHeader eyebrow="[ SURVEYS ]" title={s.title.toLowerCase()} compact />
      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-8">
            <Appear>
              <Prose blocks={s.blocks} />
            </Appear>
            <Appear delay={0.1} className="flex flex-wrap gap-2.5">
              <Button label="Request a survey" href="/rics-chartered-property-surveyors#request" />
              <Button label={`Call ${surveysPage.contact.phone}`} href={`tel:${surveysPage.contact.phone.replace(/\s/g, "")}`} variant="secondary" />
            </Appear>
          </div>
          <Appear delay={0.2} className="tablet:w-[380px]">
            <nav className="flex flex-col gap-1 rounded-lg bg-ink-50 p-5" aria-label="Other surveys">
              <p className="caption2 border-b border-ink-200 pb-3">[ OTHER SURVEYS ]</p>
              {others.map((o) => (
                <a key={o.slug} href={`/rics-chartered-property-surveyors/${o.slug}`} className="body-sm border-b border-ink-200 py-2 !text-ink-900 transition-colors hover:!text-ink-500">
                  {o.title}
                </a>
              ))}
            </nav>
          </Appear>
        </div>
      </section>
      <CtaBand
        eyebrow="[ SURVEY DEPARTMENT ]"
        title="national coverage with local knowledge"
        copy="Private individuals, companies, major banks and building societies — we survey throughout Lincolnshire and South Yorkshire."
        ctas={[{ label: "All surveys", href: "/rics-chartered-property-surveyors" }, { label: "Contact us", href: "/contact" }]}
      />
    </main>
  );
}
