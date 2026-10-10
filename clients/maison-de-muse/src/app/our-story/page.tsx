import type { Metadata } from "next";
import Image from "next/image";
import { pillars, story } from "@/lib/content";
import { resolveImage } from "@/lib/images";
import { site } from "@/lib/site";
import { Cta } from "@/components/cta";
import { Marquee } from "@/components/marquee";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { BreadcrumbJsonLd } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Maison de Muse — ‘House of Inspiration’ — is a French-inspired coffee shop and wine bar that opened on Sea View Street, Cleethorpes, in February 2025.",
  alternates: { canonical: "/our-story" },
  openGraph: { title: `Our Story — ${site.name}`, url: `${site.url}/our-story` },
};

export default function OurStoryPage() {
  const image = resolveImage("story");
  const second = resolveImage("intro");

  return (
    <>
      <BreadcrumbJsonLd name="Our Story" path="/our-story" />
      <main id="main" className="flex-1">
        <PageHeader
          crumb="Our Story"
          eyebrow={story.eyebrow}
          title={story.headline[0]}
          accent={story.headline[1]}
        >
          <p className="lede max-w-[50ch]">{story.paragraphs[0]}</p>
        </PageHeader>

        <section
          aria-label="About Maison de Muse"
          className="mx-auto w-full max-w-[1400px] px-6 pb-24 sm:px-10 lg:px-16 lg:pb-36"
        >
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="bezel">
                  <div className="bezel-core relative aspect-[4/5]">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        priority
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(160deg, #f7eadf 0%, #ead0c6 50%, #cf9e90 100%)",
                        }}
                      >
                        <span className="display absolute bottom-8 left-8 text-[8rem] leading-none text-espresso/15">
                          M
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              {story.paragraphs.slice(1).map((p, i) => (
                <Reveal key={p} delay={0.05 + i * 0.05}>
                  <p className="lede mt-6 first:mt-0">{p}</p>
                </Reveal>
              ))}

              <Reveal delay={0.2}>
                <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-sand pt-8">
                  {story.facts.map((f) => (
                    <div key={f.label}>
                      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-mocha">
                        {f.label}
                      </dt>
                      <dd className="serif mt-1 text-xl text-espresso">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal delay={0.25} className="mt-10 flex flex-wrap gap-3">
                <Cta href="/menu">Explore the menu</Cta>
                <Cta href="/visit" variant="ghost">
                  Find us
                </Cta>
              </Reveal>
            </div>
          </div>
        </section>

        <Marquee />

        <section
          aria-labelledby="story-pillars-heading"
          className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36"
        >
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow mb-6">Our vibe</p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 id="story-pillars-heading" className="display text-display-md text-espresso">
                  Where sophistication
                  <br />
                  <em className="display-italic text-plum">meets comfort.</em>
                </h2>
              </Reveal>
              {second ? (
                <Reveal delay={0.1} className="mt-10">
                  <div className="bezel max-w-[20rem] -rotate-2">
                    <div className="bezel-core relative aspect-square">
                      <Image src={second.src} alt={second.alt} fill sizes="20rem" className="object-cover" />
                    </div>
                  </div>
                </Reveal>
              ) : null}
            </div>
            <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {pillars.map((p, i) => (
                <Reveal as="li" key={p.index} delay={0.05 + i * 0.07} className="bezel">
                  <article className="bezel-core flex h-full flex-col p-7">
                    <span className="display text-3xl text-clay">{p.index}</span>
                    <h3 className="display mt-8 text-[1.75rem] text-espresso">{p.title}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-mocha">{p.body}</p>
                  </article>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </>
  );
}
