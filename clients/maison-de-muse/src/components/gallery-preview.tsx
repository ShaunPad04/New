import Image from "next/image";
import type { SiteImage } from "@/lib/images";
import { site } from "@/lib/site";
import { Cta } from "@/components/cta";
import { Reveal } from "@/components/reveal";

/**
 * GALLERY PREVIEW — the template's image band. An asymmetric five-up grid
 * of the café's own photography with a link to the gallery and to
 * Instagram. Renders a designed plate and the Instagram link when no
 * photographs are present yet.
 */
export function GalleryPreview({ images }: { images: SiteImage[] }) {
  const picks = images.slice(0, 5);
  const spans = [
    "sm:col-span-2 sm:row-span-2",
    "",
    "",
    "sm:col-span-2",
    "",
  ];

  return (
    <section
      id="gallery-preview"
      aria-labelledby="gallery-preview-heading"
      className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Reveal>
            <p className="eyebrow mb-6">The room</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="gallery-preview-heading" className="display text-display-md text-espresso">
              A look
              <br />
              <em className="display-italic text-plum">inside.</em>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="flex flex-wrap gap-3">
          <Cta href="/gallery" variant="ghost">
            Gallery
          </Cta>
          <Cta href={site.instagram} external variant="ghost">
            {site.instagramHandle}
          </Cta>
        </Reveal>
      </div>

      {picks.length > 0 ? (
        <ul className="mt-14 grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:grid-cols-4 lg:auto-rows-[15rem] lg:gap-4">
          {picks.map((img, i) => (
            <Reveal as="li" key={img.src} delay={i * 0.06} className={spans[i]}>
              <figure className="group relative h-full overflow-hidden rounded-[1.5rem]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                />
              </figure>
            </Reveal>
          ))}
        </ul>
      ) : (
        <Reveal delay={0.1} className="mt-14">
          <div className="bezel">
            <div className="bezel-core relative flex min-h-[16rem] flex-col items-center justify-center gap-4 p-10 text-center">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 80% at 50% 100%, rgba(240,181,144,0.35) 0%, transparent 70%)",
                }}
              />
              <p className="relative serif text-2xl text-espresso">
                The room, the counter and the plates — on Instagram.
              </p>
              <p className="relative max-w-[40ch] text-sm text-mocha">
                Photographs from the café will appear here. Until then, follow{" "}
                {site.instagramHandle} for the latest from Sea View Street.
              </p>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
