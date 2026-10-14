import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOffice, officeCommon, officePages } from "@/lib/pages";
import { upload } from "@/lib/assets";
import { salesProperties, lettingsProperties } from "@/lib/properties";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { TeamRow } from "@/components/team-row";
import { PropertyCard } from "@/components/property-card";
import { CtaBand } from "@/components/cta-band";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return officePages.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const o = getOffice(slug);
  if (!o) return {};
  return { title: `${o.name} office`, description: o.intro };
}

export default async function OfficePage({ params }: Props) {
  const { slug } = await params;
  const o = getOffice(slug);
  if (!o) notFound();
  const isLettings = o.slug === "lettings";
  const pool = isLettings ? lettingsProperties : salesProperties;
  const nearby = pool.filter((p) => p.title.toLowerCase().includes(o.name.toLowerCase())).slice(0, 3);
  const featured = nearby.length ? nearby : pool.slice(0, 3);

  return (
    <main>
      <PageHeader
        eyebrow={`[ ${o.name.toUpperCase()} ]`}
        title={o.title}
        copy={o.intro}
        image={upload(o.image)}
        imageAlt={`Paul Fox ${o.name} office`}
        ctas={[
          { label: "Book a free valuation", href: "/valuation-request" },
          { label: "Search properties", href: isLettings ? "/search-results?department=residential-lettings" : "/search-results" },
        ]}
      />

      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            {[...officeCommon, ...(o.extra ?? [])].map((p, i) => (
              <Appear key={i} delay={i * 0.1}>
                <p className="body">{p}</p>
              </Appear>
            ))}
            <Appear delay={0.4}>
              <p className="body">Contact us today to start your property journey!</p>
            </Appear>
          </div>
          <Appear delay={0.2} className="tablet:w-[460px]">
            <div className="flex flex-col gap-4 plate p-5">
              <p className="caption2">[ GET IN TOUCH ]</p>
              <address className="h5 not-italic">
                {o.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <div className="flex items-center justify-between border-t border-ink-200 pt-3">
                <span className="caption2">TELEPHONE</span>
                <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="body-sm !text-ink-900">
                  {o.phone}
                </a>
              </div>
              <div className="flex items-center justify-between border-t border-ink-200 pt-3">
                <span className="caption2">EMAIL</span>
                <a href={`mailto:${o.email}`} className="body-sm !text-ink-900">
                  {o.email}
                </a>
              </div>
              <div className="pt-2">
                <Button label={`Email ${o.name}`} href={`mailto:${o.email}`} />
              </div>
            </div>
          </Appear>
        </div>
      </section>

      {o.review && (
        <section className="section">
          <div className="container">
            <Appear className="rounded-lg bg-ink-900 p-8 tablet:p-12">
              <p className="caption2 !text-ink-300">[ WHAT OUR CUSTOMERS SAY ]</p>
              <blockquote className="mt-5 flex flex-col gap-5">
                <p className="h5 !font-normal !text-ink-50">“{o.review.quote}”</p>
                <cite className="caption2 not-italic !text-ink-300">{o.review.about}</cite>
              </blockquote>
            </Appear>
          </div>
        </section>
      )}

      <TeamRow title={`meet the ${o.name.toLowerCase()} team`} slugs={o.team} />

      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex items-end justify-between gap-5">
            <div className="flex flex-col gap-3">
              <Appear>
                <p className="caption2">[ PROPERTIES ]</p>
              </Appear>
              <Appear delay={0.1}>
                <h2 className="h2">{isLettings ? "to let" : `for sale near ${o.name.toLowerCase()}`}</h2>
              </Appear>
            </div>
            <Appear delay={0.2}>
              <Button label="view more" href={isLettings ? "/search-results?department=residential-lettings" : "/search-results"} />
            </Appear>
          </div>
          <Appear delay={0.3} className="grid grid-cols-1 gap-5 tablet:grid-cols-3">
            {featured.map((p, i) => (
              <PropertyCard key={p.slug} property={p} index={i} />
            ))}
          </Appear>
        </div>
      </section>

      <CtaBand
        eyebrow="[ OUR OFFICES ]"
        title="five family-run offices"
        copy="Scunthorpe, Brigg, Barton, Epworth and Gainsborough — all computer linked, so whichever branch you walk into can help."
        ctas={officePages.filter((x) => x.slug !== o.slug).map((x) => ({ label: x.name, href: `/office/${x.slug}` }))}
      />
    </main>
  );
}
