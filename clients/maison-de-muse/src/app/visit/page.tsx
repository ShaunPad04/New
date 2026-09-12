import type { Metadata } from "next";
import Image from "next/image";
import { resolveImage } from "@/lib/images";
import { formatAddress, openingHours, serviceHours, site } from "@/lib/site";
import { Cta } from "@/components/cta";
import { MapPreview } from "@/components/map-preview";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { BreadcrumbJsonLd } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "Visit",
  description: `Find Maison de Muse at ${formatAddress()}. Open from 7am every day; food 8am–5pm; evening menu and wine bar from 4pm on Fridays and Saturdays. Call ${site.phone}.`,
  alternates: { canonical: "/visit" },
  openGraph: { title: `Visit — ${site.name}`, url: `${site.url}/visit` },
};

export default function VisitPage() {
  const image = resolveImage("visit");

  return (
    <>
      <BreadcrumbJsonLd name="Visit" path="/visit" />
      <main id="main" className="flex-1">
        <PageHeader crumb="Visit" eyebrow="Find your muse" title="Sea View Street," accent="Cleethorpes.">
          <p className="lede max-w-[46ch]">
            A short walk from the seafront and the station. No booking system —
            call ahead for groups, or just come in.
          </p>
        </PageHeader>

        <section
          aria-label="Address, hours and contact"
          className="mx-auto w-full max-w-[1400px] px-6 pb-24 sm:px-10 lg:px-16 lg:pb-36"
        >
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
            {/* Address + contact */}
            <Reveal className="bezel lg:col-span-4">
              <div className="bezel-core flex h-full flex-col p-7 lg:p-9">
                <span className="eyebrow">Address</span>
                <address className="mt-8 not-italic">
                  <p className="serif text-2xl leading-tight text-espresso">
                    {site.address.street}
                    <br />
                    {site.address.town}
                    <br />
                    {site.address.postcode}
                  </p>
                </address>
                <dl className="mt-8 space-y-4 text-sm">
                  <div>
                    <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-mocha">
                      Telephone
                    </dt>
                    <dd>
                      <a href={site.phoneHref} className="link-line serif text-xl text-espresso">
                        {site.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-mocha">
                      Email
                    </dt>
                    <dd>
                      <a href={`mailto:${site.email}`} className="link-line text-espresso">
                        {site.email}
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className="mt-auto flex flex-wrap gap-3 pt-10">
                  <Cta href={site.directions} external>
                    Directions
                  </Cta>
                  <Cta href={site.googleMaps} external variant="ghost">
                    Google Maps
                  </Cta>
                </div>
              </div>
            </Reveal>

            {/* Hours */}
            <Reveal delay={0.06} className="bezel lg:col-span-4">
              <div className="bezel-core flex h-full flex-col p-7 lg:p-9">
                <span className="eyebrow">Opening hours</span>
                <dl className="mt-8 divide-y divide-sand">
                  {openingHours.map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-espresso-soft">{row.label}</dt>
                      <dd className="serif tabular text-lg text-espresso">{row.display}</dd>
                    </div>
                  ))}
                </dl>
                <dl className="mt-6 space-y-3 rounded-[1.25rem] bg-plaster p-5 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-mocha">Food served</dt>
                    <dd className="tabular text-espresso">{serviceHours.food.display}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-mocha">Evening menu</dt>
                    <dd className="text-right text-espresso">{serviceHours.evening.display}</dd>
                  </div>
                </dl>
                <p className="mt-6 text-xs leading-relaxed text-mocha">
                  Hours from the café’s website. Bank holidays may differ — call to check.
                </p>
              </div>
            </Reveal>

            {/* Photo / social */}
            <Reveal delay={0.12} className="bezel lg:col-span-4">
              <div className="bezel-core relative flex h-full min-h-[22rem] flex-col justify-end p-7 lg:p-9">
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(200deg, #f7eadf 0%, #ead0c6 55%, #cf9e90 100%)",
                    }}
                  />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent"
                />
                <div className="relative">
                  <span className="eyebrow eyebrow-on-dark">Follow along</span>
                  <ul className="mt-5 flex flex-col gap-2">
                    <li>
                      <a
                        href={site.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-line serif text-2xl text-cream"
                      >
                        Instagram {site.instagramHandle}
                      </a>
                    </li>
                    <li>
                      <a
                        href={site.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-line serif text-2xl text-cream"
                      >
                        Facebook
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Map */}
            <Reveal delay={0.1} className="bezel lg:col-span-12">
              <div className="bezel-core">
                <MapPreview />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center gap-6 text-sm text-mocha">
            <p>
              Food hygiene rating {site.hygiene.rating}, inspected{" "}
              {new Date(site.hygiene.ratingDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              —{" "}
              <a href={site.hygiene.url} target="_blank" rel="noopener noreferrer" className="link-line text-espresso">
                Food Standards Agency
              </a>
              .
            </p>
          </Reveal>
        </section>
      </main>
    </>
  );
}
