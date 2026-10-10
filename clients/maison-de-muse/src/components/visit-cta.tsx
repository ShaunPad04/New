import Image from "next/image";
import { visitCta } from "@/lib/content";
import { site } from "@/lib/site";
import type { SiteImage } from "@/lib/images";
import { Cta } from "@/components/cta";
import { Reveal } from "@/components/reveal";

/**
 * VISIT CTA — the template's closing section: two tilted image plates
 * flanking a centred headline, a line of supporting text and the buttons.
 * Photographs are optional; without them the plates are designed colour.
 */
export function VisitCta({ left, right }: { left: SiteImage | null; right: SiteImage | null }) {
  const plate = (image: SiteImage | null, tilt: string, tone: string) => (
    <div className={`bezel hidden w-[15rem] lg:block ${tilt}`}>
      <div className="bezel-core relative aspect-[4/5]">
        {image ? (
          <Image src={image.src} alt="" fill sizes="15rem" className="object-cover" />
        ) : (
          <div aria-hidden="true" className="absolute inset-0" style={{ background: tone }} />
        )}
      </div>
    </div>
  );

  return (
    <section
      id="visit-cta"
      aria-labelledby="visit-cta-heading"
      className="relative overflow-hidden bg-plaster"
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-8 px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
        {plate(left, "-rotate-6", "linear-gradient(160deg,#f7e5d8,#e7c3b7)")}

        <div className="mx-auto max-w-[40rem] text-center">
          <Reveal>
            <p className="eyebrow mb-8">{visitCta.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="visit-cta-heading" className="display-xl text-display-lg text-espresso">
              {visitCta.headline[0]}
              <br />
              <em className="display-italic text-plum">{visitCta.headline[1]}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede mx-auto mt-6 max-w-[40ch]">{visitCta.body}</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 flex flex-wrap justify-center gap-4">
            <Cta href={site.phoneHref}>Call {site.phone}</Cta>
            <Cta href={site.directions} external variant="ghost">
              Directions
            </Cta>
          </Reveal>
          <p className="mt-8 text-sm text-mocha">
            {site.address.street}, {site.address.town} {site.address.postcode}
          </p>
        </div>

        {plate(right, "rotate-6", "linear-gradient(200deg,#eed8cc,#d9a99b)")}
      </div>
    </section>
  );
}
