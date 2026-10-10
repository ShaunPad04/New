import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { upload } from "@/lib/assets";
import { allProperties, DEPARTMENT_LABEL, district, getProperty, locality } from "@/lib/properties";
import { site } from "@/lib/content";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { Gallery } from "@/components/gallery";
import { EnquiryForm } from "@/components/enquiry-form";
import { PropertyCard } from "@/components/property-card";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allProperties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.qualifier ? `${p.qualifier} ` : ""}${p.price}`,
    description: p.summary,
    openGraph: { images: [{ url: upload(p.images[0]) }] },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const p = getProperty(slug);
  if (!p) notFound();

  const specs = [
    ["STATUS", p.availability || DEPARTMENT_LABEL[p.department]],
    ["TYPE", p.type || "Residential"],
    ["BEDROOMS", p.beds],
    ["BATHROOMS", p.baths],
    ["RECEPTIONS", p.receptions],
    ["TENURE", p.tenure],
    ["COUNCIL TAX", p.councilTax ? `Band ${p.councilTax}` : ""],
  ].filter(([, v]) => v);

  const similar = allProperties
    .filter((x) => x.slug !== p.slug && x.department === p.department && (district(x) === district(p) || locality(x) === locality(p)))
    .slice(0, 3);
  const fallback = similar.length ? similar : allProperties.filter((x) => x.slug !== p.slug && x.department === p.department).slice(0, 3);

  const phone = p.department === "residential-lettings" ? "01724 282868" : site.phone;

  return (
    <main>
      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex flex-col gap-5 tablet:flex-row tablet:items-end tablet:justify-between">
            <div className="flex flex-col gap-3">
              <Appear onMount>
                <p className="caption2">
                  [ {DEPARTMENT_LABEL[p.department].toUpperCase()} ] · {locality(p).toUpperCase()}, {district(p)}
                </p>
              </Appear>
              <Appear onMount delay={0.1}>
                <h1 className="h2">{p.title}</h1>
              </Appear>
            </div>
            <Appear onMount delay={0.2} className="flex flex-col items-start gap-1 tablet:items-end">
              {p.qualifier && <span className="caption2">{p.qualifier}</span>}
              <span className="h3">{p.price}</span>
            </Appear>
          </div>

          <Appear onMount delay={0.3}>
            <Gallery images={p.images.map((src, i) => ({ src: upload(src), alt: `${p.title} — photo ${i + 1}` }))} />
          </Appear>

          <div className="flex flex-col gap-10 tablet:flex-row">
            <div className="flex flex-1 flex-col gap-10">
              <div className="grid grid-cols-2 gap-x-6 plate px-5 py-2 tablet:grid-cols-3">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 border-b border-ink-200 py-2 last:border-b-0">
                    <span className="caption2">{k}</span>
                    <span className="body-sm !text-ink-900">{v}</span>
                  </div>
                ))}
              </div>

              {p.features.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="caption2">[ KEY FEATURES ]</p>
                  <ul className="grid grid-cols-1 gap-2 tablet:grid-cols-2">
                    {p.features.map((f) => (
                      <li key={f} className="body-sm flex gap-2 !text-ink-900">
                        <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-400" />
                        <span className="normal-case">{f.charAt(0) + f.slice(1).toLowerCase()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <p className="caption2">[ DESCRIPTION ]</p>
                {p.summary && <p className="body-lg !text-ink-900">{p.summary}</p>}
                {p.description.map((para, i) => (
                  <p key={i} className="body">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <aside className="flex flex-col gap-5 tablet:w-[420px]">
              <div className="sticky top-[100px] flex flex-col gap-5">
                <div className="flex flex-col gap-3 rounded-lg bg-ink-900 p-5">
                  <p className="caption2 !text-ink-300">[ ARRANGE A VIEWING ]</p>
                  <p className="h5 !text-ink-50">interested in this property?</p>
                  <p className="body-sm !text-ink-200">Call {phone} or send us a note and the team will be in touch to arrange a viewing.</p>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <Button label={`Call ${phone}`} href={`tel:${phone.replace(/\s/g, "")}`} variant="secondary" />
                    <Button label="Free valuation" href="/valuation-request" variant="icon" />
                  </div>
                </div>
                <EnquiryForm
                  label="Property enquiry form"
                  fields={[
                    { name: "property", label: "Property", value: p.title },
                    { name: "name", label: "Name", required: true, autoComplete: "name" },
                    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
                    { name: "phone", label: "Telephone", type: "tel", required: true, autoComplete: "tel" },
                    { name: "message", label: "Message", type: "textarea" },
                  ]}
                  submit="Send enquiry"
                  sent="Enquiry sent"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex items-end justify-between gap-5">
            <div className="flex flex-col gap-3">
              <Appear>
                <p className="caption2">[ SIMILAR PROPERTIES ]</p>
              </Appear>
              <Appear delay={0.1}>
                <h2 className="h2">you may also like</h2>
              </Appear>
            </div>
            <Appear delay={0.2}>
              <Button label="view all" href={`/search-results?department=${p.department}`} />
            </Appear>
          </div>
          <Appear delay={0.3} className="grid grid-cols-1 gap-5 tablet:grid-cols-3">
            {fallback.map((x, i) => (
              <PropertyCard key={x.slug} property={x} index={i} />
            ))}
          </Appear>
        </div>
      </section>
    </main>
  );
}
