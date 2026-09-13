import Image from "next/image";
import { intro } from "@/lib/content";
import type { SiteImage } from "@/lib/images";
import { Cta } from "@/components/cta";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * INTRO — the template's "about" beat: a small eyebrow above one large,
 * centred statement in the display face. The statement is the café's own
 * copy; a photograph, when present, is tucked to one side.
 */
export function Intro({ image }: { image: SiteImage | null }) {
  return (
    <section
      id="welcome"
      aria-labelledby="intro-heading"
      className="relative mx-auto w-full max-w-[1400px] scroll-mt-28 px-6 py-24 sm:px-10 lg:px-16 lg:py-36"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow mb-8">{intro.eyebrow}</p>
        </Reveal>
        <h2 id="intro-heading" className="display text-display-md text-espresso">
          <RevealWords text={intro.statement} />
        </h2>
        <Reveal delay={0.2} className="mt-10 flex flex-col items-center gap-8">
          <p className="lede max-w-[52ch]">{intro.meaning}</p>
          <Cta href="/our-story" variant="ghost">
            Our story
          </Cta>
        </Reveal>
      </div>

      {image ? (
        <Reveal
          delay={0.25}
          className="pointer-events-none absolute right-6 top-24 hidden w-[11rem] rotate-[6deg] xl:block"
        >
          <div className="bezel">
            <div className="bezel-core relative aspect-[4/5]">
              <Image src={image.src} alt={image.alt} fill sizes="11rem" className="object-cover" />
            </div>
          </div>
        </Reveal>
      ) : null}
    </section>
  );
}
