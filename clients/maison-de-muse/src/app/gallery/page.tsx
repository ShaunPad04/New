import type { Metadata } from "next";
import Image from "next/image";
import { resolveGallery } from "@/lib/images";
import { site } from "@/lib/site";
import { Cta } from "@/components/cta";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { BreadcrumbJsonLd } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from Maison de Muse on Sea View Street, Cleethorpes — the room, the counter, coffee, brunch and evenings.",
  alternates: { canonical: "/gallery" },
  openGraph: { title: `Gallery — ${site.name}`, url: `${site.url}/gallery` },
};

/**
 * Editorial gallery: an asymmetric CSS grid with a repeating rhythm of
 * spans (no masonry library). Every image is lazy-loaded except the first
 * two, which are above the fold on most viewports.
 */
const RHYTHM = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "sm:row-span-2",
  "sm:col-span-2",
  "",
  "",
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
];

export default function GalleryPage() {
  const images = resolveGallery();

  return (
    <>
      <BreadcrumbJsonLd name="Gallery" path="/gallery" />
      <main id="main" className="flex-1">
        <PageHeader crumb="Gallery" eyebrow="The room" title="A look" accent="inside.">
          <p className="lede max-w-[46ch]">
            The counter, the tables, the plates and the pours — photographed at
            the café on Sea View Street.
          </p>
        </PageHeader>

        <section
          aria-label="Photographs"
          className="mx-auto w-full max-w-[1400px] px-6 pb-24 sm:px-10 lg:px-16 lg:pb-36"
        >
          {images.length > 0 ? (
            <ul className="grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:grid-cols-4 lg:auto-rows-[16rem] lg:gap-4">
              {images.map((img, i) => (
                <Reveal as="li" key={img.src} delay={(i % 4) * 0.06} className={RHYTHM[i % RHYTHM.length]}>
                  <figure className="group relative h-full overflow-hidden rounded-[1.5rem]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      priority={i < 2}
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                    />
                    {img.alt ? (
                      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-espresso/60 to-transparent p-4 text-xs text-cream opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0 group-hover:opacity-100">
                        {img.alt}
                      </figcaption>
                    ) : null}
                  </figure>
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="bezel">
              <div className="bezel-core p-10 text-center lg:p-16">
                <p className="serif text-2xl text-espresso">Photographs are on their way.</p>
                <p className="mx-auto mt-3 max-w-[46ch] text-sm leading-relaxed text-mocha">
                  The café’s photography is being added to this page. In the
                  meantime, the latest pictures are on Instagram.
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Cta href={site.instagram} external>
              Follow {site.instagramHandle}
            </Cta>
            <Cta href={site.facebook} external variant="ghost">
              Facebook
            </Cta>
          </div>
        </section>
      </main>
    </>
  );
}
