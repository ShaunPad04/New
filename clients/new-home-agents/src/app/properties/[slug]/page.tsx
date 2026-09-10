import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { EnquiryForm } from "@/components/enquiry-form";
import { PropertyCard, BedIcon, BathIcon, SofaIcon } from "@/components/property-card";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { Faq } from "@/components/faq";
import { ClosingCta } from "@/components/closing-cta";
import { site, faqs } from "@/lib/content";
import { formatPrice, getAllProperties, getProperty, getRelated, SNAPSHOT_DATE } from "@/lib/properties";

export function generateStaticParams() {
  return getAllProperties().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProperty(slug);
  if (!p) return { title: "Property not found" };
  const price = formatPrice(p);
  const title = `${p.beds ? `${p.beds} bedroom ` : ""}${p.isNewHome ? "new home" : "property"} for sale, ${p.title}`;
  return {
    title,
    description: p.metaDescription ?? `${p.title} — ${price.qualifier ? `${price.qualifier} ` : ""}${price.amount}. ${p.summary}`.slice(0, 160),
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: { title, images: p.images[0] ? [{ url: p.images[0].src, width: p.images[0].width, height: p.images[0].height, alt: p.images[0].alt }] : undefined },
  };
}

export default async function PropertyPage(props: PageProps<"/properties/[slug]">) {
  const { slug } = await props.params;
  const p = getProperty(slug);
  if (!p) notFound();
  const price = formatPrice(p);
  const related = getRelated(p);
  const captured = SNAPSHOT_DATE ? new Date(SNAPSHOT_DATE).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;
  const paragraphs = p.description.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    url: `${site.url}/properties/${p.slug}`,
    image: p.images.filter((i) => i.local).map((i) => `${site.url}${i.src}`),
    description: p.summary,
    datePosted: p.fetchedAt ?? undefined,
    offers: p.price.amount ? { "@type": "Offer", price: p.price.amount, priceCurrency: "GBP", availability: "https://schema.org/InStock" } : undefined,
    provider: { "@type": "RealEstateAgent", name: site.name, telephone: site.phone, email: site.email, url: site.url },
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pt-[120px] md:pt-[160px]">
        <div className="container">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-ink">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={p.isNewHome ? "/new-homes" : "/properties"} className="hover:text-ink">{p.isNewHome ? "New homes" : "Properties"}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">{p.title}</li>
            </ol>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-[1099px] flex-col gap-3">
              <Appear><p className="eyebrow">{p.isNewHome ? "New home" : "For sale"}{p.isNewListing ? " · New listing" : ""}</p></Appear>
              <Appear delay={0.05}><h1 className="h-page">{p.title}</h1></Appear>
              <Appear delay={0.1} className="flex items-center gap-2 text-lg font-medium text-slate">
                <PinIcon />
                <p>{p.area ? `${p.area}` : p.town}</p>
              </Appear>
            </div>
            <Appear delay={0.15} className="shrink-0 md:text-right">
              {price.qualifier ? <p className="text-base text-slate">{price.qualifier}</p> : null}
              <p className="h-section">{price.amount}</p>
            </Appear>
          </div>

          <Appear delay={0.2} className="mt-8 md:mt-[30px]">
            <Gallery images={p.images} title={p.title} />
          </Appear>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,804px)_402px] lg:gap-[50px]">
          <div className="flex flex-col gap-10">
            <Appear as="div" className="flex flex-col gap-5">
              <h2 className="h-sub">Description</h2>
              {p.summary ? <p className="lede">{p.summary}</p> : null}
            </Appear>

            <Appear>
              <div className="flex flex-col gap-6 rounded-[15px] bg-mist p-6 md:p-[25px]">
                <Row icon={<BedIcon />} label="Bedrooms" value={p.beds ?? "—"} />
                <Row icon={<BathIcon />} label="Bathrooms" value={p.baths ?? "—"} />
                <Row icon={<SofaIcon />} label="Reception rooms" value={p.receptions ?? "—"} />
                <Row icon={<HomeIcon />} label="Property type" value={p.isNewHome ? "New build" : "Resale"} />
                <Row icon={<TagIcon />} label="Status" value={p.status} />
                {p.epcRating ? <Row icon={<LeafIcon />} label="EPC rating" value={p.epcRating} /> : null}
              </div>
            </Appear>

            {p.features.length ? (
              <Appear className="flex flex-col gap-5">
                <h2 className="h-sub">Key features</h2>
                <ul className="flex flex-wrap gap-[15px]">
                  {p.features.map((f) => (
                    <li key={f} className="rounded-[10px] bg-mist px-4 py-2 text-base font-medium text-ink">{f}</li>
                  ))}
                </ul>
              </Appear>
            ) : null}

            {paragraphs.length ? (
              <Appear className="flex flex-col gap-5">
                <h2 className="h-sub">Full description</h2>
                <div className="flex flex-col gap-4 text-base leading-relaxed text-slate">
                  {paragraphs.map((para, i) => <p key={i} className="whitespace-pre-line">{para}</p>)}
                </div>
              </Appear>
            ) : null}

            {p.floorplans.length ? (
              <Appear className="flex flex-col gap-[15px]">
                <h2 className="h-sub">Floorplan{p.floorplans.length > 1 ? "s" : ""}</h2>
                {p.floorplans.map((fp, i) => (
                  <a key={fp.src} href={fp.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[20px] border border-hairline bg-white">
                    <Image src={fp.src} alt={fp.alt} width={fp.width} height={fp.height} sizes="(max-width: 809px) 100vw, 804px" className="h-auto w-full" loading={i === 0 ? "eager" : "lazy"} />
                    <span className="block px-4 py-3 text-sm text-slate">Open floorplan {i + 1} at full size</span>
                  </a>
                ))}
              </Appear>
            ) : null}

            {p.virtualTours.length || p.brochures.length ? (
              <Appear className="flex flex-col gap-3">
                <h2 className="h-sub">More</h2>
                <ul className="flex flex-wrap gap-3">
                  {p.virtualTours.map((v) => <li key={v}><a href={v} target="_blank" rel="noopener noreferrer" className="rounded-[10px] bg-mist px-4 py-2 text-sm hover:bg-hairline">Virtual tour ↗</a></li>)}
                  {p.brochures.map((v) => <li key={v}><a href={v} target="_blank" rel="noopener noreferrer" className="rounded-[10px] bg-mist px-4 py-2 text-sm hover:bg-hairline">Brochure (PDF) ↗</a></li>)}
                </ul>
              </Appear>
            ) : null}

            <p className="text-xs leading-relaxed text-slate">
              Listing details as published by {site.name}{captured ? ` on ${captured}` : ""}. Room measurements, tenure and availability should be confirmed with the agency before viewing.
              {" "}<a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">View on newhomeagents.co.uk</a>.
            </p>
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-[104px] lg:self-start">
            <Appear delay={0.1}>
              <div className="flex flex-col gap-5 rounded-[15px] bg-ink p-5 text-white">
                <div className="mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white text-ink"><KeyIcon /></div>
                <div className="flex flex-col gap-1 text-center">
                  <p className="h-sub text-white">Like this property?</p>
                  <p className="text-sm text-cloud">We&rsquo;d love to show you round. Call us seven days a week or send a viewing request.</p>
                </div>
                <div className="flex flex-col gap-3">
                  {["Nationwide new homes & resales", "Part exchange & assisted move support", "Free mortgage advice via New Home Mortgages"].map((t) => (
                    <p key={t} className="rounded-[10px] bg-white/15 px-4 py-2.5 text-sm">{t}</p>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Button href={site.phoneHref} variant="white" arrow={false} className="justify-center">Call {site.phone}</Button>
                  <Button href="#viewing" variant="secondary" arrow={false} className="justify-center">Request a viewing</Button>
                </div>
                <p className="text-center text-xs text-cloud/80">{site.openingHours}</p>
              </div>
            </Appear>
            <div id="viewing" className="scroll-mt-28">
              <EnquiryForm
                kind="viewing"
                context={{ property: p.title, propertyId: p.id, propertyUrl: p.sourceUrl }}
                submitLabel="Request a viewing"
                intro={`Viewing request for ${p.title}.`}
                fields={[
                  { name: "name", label: "Full name", required: true, autoComplete: "name" },
                  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
                  { name: "phone", label: "Telephone", type: "tel", required: true, autoComplete: "tel" },
                  { name: "message", label: "Message", type: "textarea", placeholder: "Preferred days and times, or any questions" },
                ]}
              />
            </div>
          </aside>
        </div>
      </section>

      {related.length ? (
        <section className="section bg-mist" aria-labelledby="related-heading">
          <div className="container">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex max-w-[600px] flex-col gap-4">
                <Appear><p className="eyebrow">Similar properties</p></Appear>
                <Appear delay={0.1}><h2 id="related-heading" className="h-section">You may also like</h2></Appear>
              </div>
              <Appear delay={0.2}><Button href={p.isNewHome ? "/new-homes" : "/properties"} variant="white">Back to search</Button></Appear>
            </div>
            <ul className="mt-12 grid gap-[15px] md:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <Appear as="li" key={r.id} delay={i * 0.1}><PropertyCard property={r} /></Appear>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <Faq items={faqs.filter((f) => /viewing|mortgage|Part Exchange|Assisted/i.test(f.q))} />
      <ClosingCta />
    </main>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[7px] bg-white text-ink">{icon}</span>
        <p className="text-lg font-medium">{label}</p>
      </div>
      <p className="text-[20px] font-medium">{value}</p>
    </div>
  );
}

function PinIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>; }
function HomeIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" /></svg>; }
function TagIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="8" cy="9" r="1.5" /></svg>; }
function LeafIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19l7-7" /></svg>; }
function KeyIcon() { return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M15 6l3 3M12 9l3 3" /></svg>; }
