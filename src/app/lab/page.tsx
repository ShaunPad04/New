import type { Metadata } from "next";
import Image from "next/image";
import { heroDisciplines, processSteps, projects, services, site } from "@/lib/content";
import { resolveProcessImage, resolveWorkImage } from "@/lib/work-image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollText } from "@/components/kit/scroll-text";
import { VelocityMarquee } from "@/components/kit/velocity-marquee";
import { Carousel3D } from "@/components/kit/carousel-3d";
import { Tilt } from "@/components/kit/tilt";
import { StackCards } from "@/components/kit/stack-cards";
import { TextRing } from "@/components/kit/text-ring";

/**
 * /lab — the design-system v2 kit, laid out for review.
 *
 * This page exists so Brad can judge the new primitives in isolation before
 * any of them replaces a section of the live site. It is built ONLY on the
 * preview branch `redesign/design-system-v2`:
 *   - `noindex, nofollow` below, and absent from `sitemap.ts` (an explicit
 *     list), so it can never be crawled even if it reached production;
 *   - linked from nowhere — no nav item, no footer link.
 * Delete it, or keep it as an internal pattern library, when the branch is
 * promoted. Do not leave it half-linked.
 *
 * Every string on it is real site copy read from content.ts — no lorem — so
 * what is being judged is the kit against Black Line's actual words.
 */
export const metadata: Metadata = {
  title: "Design system lab",
  robots: { index: false, follow: false },
};

function Section({
  eyebrow,
  title,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink-300 py-24 lg:py-36">
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <p className="kit-eyebrow">{eyebrow}</p>
        <h2 className="kit-display mt-5 max-w-[16ch] text-[clamp(2.25rem,5.5vw,5rem)] text-ink-1000">
          {title}
        </h2>
        <p className="mt-5 max-w-[56ch] text-sm leading-relaxed text-ink-700">{note}</p>
      </div>
      <div className="mt-14 lg:mt-20">{children}</div>
    </section>
  );
}

export default function LabPage() {
  const work = projects.map((p) => ({ ...p, cover: resolveWorkImage(p.id) }));
  const steps = processSteps.map((s) => ({ ...s, image: resolveProcessImage(s.id) }));

  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <header className="mx-auto w-full max-w-[1600px] px-6 pb-20 pt-40 sm:px-10 lg:px-16 lg:pt-52">
          <p className="kit-eyebrow">Design system v2 · Preview only</p>
          <h1 className="kit-display mt-6 max-w-[14ch] text-[clamp(3rem,9vw,9rem)] text-ink-1000">
            Motion that answers the scroll.
          </h1>
          <p className="mt-8 max-w-[58ch] text-base leading-relaxed text-ink-800">
            Every component below is driven by scroll position rather than a
            clock — stop scrolling and it stops, scroll back and it reverses.
            CSS 3D only, one shared animation loop, and every piece reads fully
            with motion turned off.
          </p>
        </header>

        <Section
          eyebrow="01 · Scroll text"
          title="Words that light as you read."
          note="Each word resolves from dim to lit, blur to sharp, as the paragraph travels up the screen — and dims again on the way back. The reader sets the pace."
        >
          <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16">
            <ScrollText
              text={site.heroLine}
              className="kit-display max-w-[22ch] text-[clamp(2rem,5vw,4.75rem)] text-ink-1000"
            />
          </div>
        </Section>

        <Section
          eyebrow="02 · Velocity marquee"
          title="A ribbon that feels the scroll."
          note="Drifts on its own, accelerates with scroll speed, leans into the motion and reverses when you scroll up. Two ribbons run in opposition."
        >
          <div className="grid gap-4">
            <VelocityMarquee>
              {services.map((s, i) => (
                <span
                  key={s.id}
                  className={`kit-display px-6 text-[clamp(3rem,9vw,8.5rem)] ${i % 2 ? "kit-outline" : "text-ink-1000"}`}
                >
                  {s.title}
                  <span className="px-6 text-ink-500" aria-hidden="true">
                    /
                  </span>
                </span>
              ))}
            </VelocityMarquee>
            <VelocityMarquee reverse speed={0.4}>
              {heroDisciplines.map((d) => (
                <span key={d} className="kit-eyebrow px-8 text-base text-ink-600">
                  {d} ·
                </span>
              ))}
            </VelocityMarquee>
          </div>
        </Section>

        <Section
          eyebrow="03 · Carousel 3D"
          title="Work, turned in space."
          note="A native scroll-snap track — so touch, trackpad and keyboard all behave — with a coverflow built in CSS 3D on top. Drag it with a mouse, swipe it on a phone."
        >
          <Carousel3D
            label="Selected work"
            slides={work.map((p) => ({
              key: p.id,
              label: p.title,
              node: (
                <article className="bezel">
                  <div className="bezel-core overflow-hidden p-2">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-ink-200">
                      {p.cover ? (
                        <Image
                          src={p.cover}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 34rem, 78vw"
                          className="object-cover"
                          draggable={false}
                        />
                      ) : null}
                    </div>
                    <div className="px-4 pb-4 pt-5">
                      <p className="kit-eyebrow">{p.status ?? "Live"}</p>
                      <h3 className="kit-display mt-3 text-2xl text-ink-1000">{p.title}</h3>
                      <p className="mt-2 text-sm text-ink-700">{p.sector}</p>
                    </div>
                  </div>
                </article>
              ),
            }))}
          />
        </Section>

        <Section
          eyebrow="04 · Tilt"
          title="Surfaces that catch the light."
          note="Follows a mouse in 3D with a specular glare, and settles back slowly on release. Desktop pointers only — a finger would cover the very thing being tilted."
        >
          <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-6 sm:grid-cols-2 sm:px-10 lg:grid-cols-3 lg:px-16">
            {services.slice(0, 3).map((s) => (
              <Tilt key={s.id}>
                <div className="bg-ink-100 p-8 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)] lg:p-10">
                  <p className="kit-eyebrow">{s.id}</p>
                  <h3 className="kit-display mt-16 text-3xl text-ink-1000">{s.title}</h3>
                </div>
              </Tilt>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="05 · Stack cards"
          title="Six steps, stacked in depth."
          note="Each step pins, and the next slides over it — the one beneath tips back, shrinks and falls into shadow. Native sticky, so nothing above can knock it out of place."
        >
          <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10">
            <StackCards
              cards={steps.map((s) => ({
                key: s.id,
                node: (
                  <article className="grid min-h-[60vh] overflow-hidden rounded-[2rem] bg-ink-100 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)] md:grid-cols-2">
                    <div className="flex flex-col justify-between p-8 lg:p-12">
                      <p className="kit-eyebrow">Step {s.index}</p>
                      <div>
                        <h3 className="kit-display text-[clamp(2.5rem,6vw,5.5rem)] text-ink-1000">{s.title}</h3>
                        <p className="mt-5 max-w-[40ch] text-sm leading-relaxed text-ink-700">{s.body}</p>
                      </div>
                    </div>
                    <div className="relative min-h-[16rem] bg-ink-200">
                      {s.image ? (
                        <Image src={s.image} alt="" fill sizes="(min-width: 768px) 600px, 100vw" className="object-cover grayscale" />
                      ) : null}
                    </div>
                  </article>
                ),
              }))}
            />
          </div>
        </Section>

        <Section
          eyebrow="06 · Text ring"
          title="An object in space, made of type."
          note="Words on the wall of a cylinder that turns with the scroll. Pure CSS transforms — no WebGL, no canvas. Under reduced motion it lays out flat as a line."
        >
          {/* Short labels only — the ring gives each word a fixed slot.
              The four hero disciplines plus the two messaging services, all
              real offerings, none longer than a dozen characters. */}
          <TextRing
            words={[...heroDisciplines, "Email", "SMS"]}
            className="kit-display text-[clamp(2rem,5.5vw,4.5rem)] text-ink-1000"
          />
        </Section>
      </main>
      <Footer />
    </>
  );
}
