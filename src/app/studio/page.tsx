import type { Metadata } from "next";
import Image from "next/image";
import { founders, processSteps, stackLogos, TRUST_CLAIM } from "@/lib/content";
import { resolveFounderAvatar } from "@/lib/work-image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/v3/page-hero";
import { Journey } from "@/components/v3/journey";
import { ProofBand } from "@/components/v3/proof-band";
import { Bridge } from "@/components/v3/bridge";
import { Grid, LABEL } from "@/components/v3/page-grid";
import { Divided, Part } from "@/components/v3/pricing-parts";
import { ChromeMonogram } from "@/components/v2/chrome-monogram";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Black Line Agency is a two-person, founder-led studio. The people you meet are the people who design, build and run your site.",
  alternates: { canonical: "/studio" },
};

const DARK = "#000000";
const LIGHT = "#f0f0f0";

/** The top's third column: the studio in three facts, each one already stated elsewhere on the site. */
function StudioFacts() {
  const rows = [
    ["Based", "Humberston, Grimsby"],
    ["Founders", founders.map((f) => f.name.split(" ")[0]).join(" & ")],
    ["Replies", "Within one working day"],
  ];
  return (
    <dl className={LABEL}>
      {rows.map(([k, v]) => (
        <div key={k} className="flex min-h-9 items-center justify-between gap-4 border-b border-white/12">
          <dt className="text-ink-600">{k}</dt>
          <dd className="m-0 text-right text-ink-900">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * /studio IN THE HOMEPAGE'S SYSTEM (Brad, 2026-10-05: "do the remaining old
 * pages"). The page top, then the founders (their avatars, the homepage
 * hero's, and the studio's three paragraphs), the chrome BL Brad moved here
 * from the homepage (2026-09-30), the homepage's journey in place of the old
 * horizontal process ride, the tools as a ruled grid rather than a moving
 * strip (the site has motion enough), and the measured standards on a light
 * band, as /services ends. The footer's "let's talk" closes it.
 */
export default function StudioPage() {
  const [a, b] = founders;
  return (
    <>
      <Header />
      <main id="main" className="v3 flex-1">
        <PageHero
          id="studio-page-heading"
          title="Studio"
          label="Studio"
          ja="工房"
          count={{ value: String(founders.length).padStart(2, "0"), label: "founders" }}
          lede="You will not be handed to a junior after signing. The founders design it, build it and answer the phone — which is why we take on a small number of projects at a time and say so plainly."
          image="/images/pages/studio.webp"
          aside={<StudioFacts />}
        />

        <div className="bg-ink-0 px-6 sm:px-10">
          <Part id="founders" index="01" label="Founders" heading="Two people. No account layer.">
            <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-0">
              <ul className="grid content-start gap-x-6 sm:grid-cols-2 lg:grid-cols-1 lg:pr-10">
                {founders.map((f) => {
                  const avatar = resolveFounderAvatar(f.name);
                  return (
                    <li key={f.name} className="flex items-center gap-4 border-t border-ink-300 py-5 last:border-b">
                      {avatar ? (
                        <Image src={avatar} alt="" width={176} height={176} sizes="72px" className="size-[4.5rem] shrink-0 rounded-full object-cover grayscale" />
                      ) : (
                        <span aria-hidden="true" className="grid size-[4.5rem] shrink-0 place-items-center rounded-full border border-ink-300 text-[1.125rem] font-semibold text-ink-800">
                          {f.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </span>
                      )}
                      <span>
                        <span className="block text-[1.125rem] font-semibold tracking-[-0.02em] text-ink-1000">{f.name}</span>
                        <span className="text-[0.875rem] text-ink-700">{f.role}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Reveal variant="settle" className="lg:col-span-2 lg:pl-3">
                <p className="max-w-[44ch] text-[clamp(1.375rem,2.1vw,1.875rem)] leading-[1.3] tracking-[-0.035em] text-ink-1000">
                  Black Line is a two-person studio — {a.name} and {b.name} — and that is the entire point. The people who design and build your site are the people you speak to.
                </p>
                <p className="mt-8 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-800">
                  There is no account layer relaying messages between you and whoever is actually doing the work. It means we take on fewer projects than a larger agency would, and we are direct about scope and timelines because we are the ones who have to deliver them. It also means you get senior attention on every detail rather than a junior working from a brief they were handed second-hand.
                </p>
                <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-800">
                  Our own brand is black and white with a single red accent, on purpose. Stripping colour out forces everything else — hierarchy, spacing, typography, motion — to do its job properly. If a layout works in black and white, it works.
                </p>
              </Reveal>
            </div>
          </Part>
        </div>

        {/* The chrome BL, moved here from the homepage (Brad, 2026-09-30),
            compact: one turn as it passes, no long pin. */}
        <ChromeMonogram compact />

        <Journey index="02" steps={processSteps.map(({ id, index, title, body }) => ({ id, index, title, body }))} />

        <div className="bg-ink-0 px-6 sm:px-10">
          <Divided>
            <Part id="stack" index="03" label="Stack" heading={`${TRUST_CLAIM.quiet} ${TRUST_CLAIM.loud}`}>
              <ul className="mt-12 grid grid-cols-2 border-t border-ink-1000 sm:grid-cols-4 lg:mt-16 lg:grid-cols-7">
                {stackLogos.map((l) => (
                  <li key={l.name} className="flex min-h-20 items-center gap-3 border-b border-ink-300 pr-4 text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink-1000">
                    {l.mark ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0 fill-current">
                        <use href={`/logo-marks.svg#logo-mark-${l.mark}`} />
                      </svg>
                    ) : null}
                    {l.name}
                  </li>
                ))}
              </ul>
            </Part>
          </Divided>
        </div>

        <Bridge from={DARK} to={LIGHT} />
        <div className="band-light relative bg-ink-0">
          <Grid rule="border-ink-1000/8" reading />
          <div className="relative px-6 sm:px-10">
            <ProofBand index="04" />
          </div>
        </div>
        <Bridge from={LIGHT} to={DARK} />
      </main>
      <Footer />
    </>
  );
}
