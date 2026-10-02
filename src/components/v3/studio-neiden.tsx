import Image from "next/image";
import { founders, site } from "@/lib/content";
import { ScrollText } from "@/components/kit/scroll-text";
import { resolveFounderAvatar } from "@/lib/work-image";
import { StudioDrift } from "./studio-drift";

/**
 * 01 THE STUDIO, Neiden version — after the "Who we are" section of
 * neiden.framer.media (Brad, 2026-09-30: chose it over the Ovra version);
 * layout and motion measured, no assets, code or copy taken.
 *
 * A white band on the hero's three-column hairline grid. The statement is
 * DM Sans 600 at 5vw (Neiden at Brad's window), -0.06em, 1.1, first line
 * indented, set in
 * WHITE with `mix-blend-mode: difference`: over the white band it reads
 * black, and where it crosses a picture the letters invert the picture
 * (Neiden's effect). It lights word by word as it passes (ScrollText). Two
 * pictures sit on the outer edges and rise faster than the page, 1.1x and
 * 1.3x (Neiden's measured speeds; `.nd-drift-*`); phones drop them, as
 * Neiden's does. Our corner labels replace theirs: "Founder-led" where
 * Neiden counts projects, the town where it prints a founding year (none is
 * confirmed). No client logos on the pictures: Neiden's are its clients'.
 */
const LABEL = "text-[0.875rem] font-semibold tracking-[-0.04em]";

export function StudioNeiden({ headingId }: { headingId: string }) {
  const statement = site.description.split(". ")[0] + ".";
  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate overflow-hidden bg-ink-0 text-ink-1000"
    >
      {/* The hero's grid, carried on. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-6 right-6 grid grid-cols-3 border-x border-ink-1000/8 sm:left-10 sm:right-10"
      >
        <span className="border-r border-ink-1000/8" />
        <span className="border-r border-ink-1000/8" />
      </div>

      <StudioDrift className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* Proportions from Neiden at Brad's window (2026-09-30: "it barely
            overlaps on the left"): left picture flush to the edge, 0-23%;
            right picture 70.5-96%; the headline runs across both. */}
        <div className="nd-drift-a absolute left-0 top-[13rem] h-[28vw] max-h-[28rem] w-[23vw] max-w-[23rem] overflow-hidden">
          <Image src="/images/studio/soft-mono.2026-09-30.webp" alt="" fill sizes="23vw" className="object-cover" />
        </div>
        <div className="nd-drift-b absolute right-[4%] top-[11rem] h-[28vw] max-h-[28rem] w-[25.6vw] max-w-[25.5rem] overflow-hidden">
          <Image src="/images/studio/soft-red.2026-09-30.webp" alt="" fill sizes="26vw" className="object-cover" />
        </div>
      </StudioDrift>

      <div className="relative mx-auto w-full max-w-[1600px] px-6 pb-10 pt-10 sm:px-10 lg:pb-24 lg:pt-8">
        {/* Phones drop this corner label (the founders line says it) to keep
            the section short (Brad: "for mobile i think its too long"). */}
        <p className={`hidden text-right lg:block ${LABEL}`}>Founder-led</p>

        <div className="lg:mt-24 lg:grid lg:grid-cols-3">
          <p className={`flex items-center gap-3 lg:col-start-2 ${LABEL}`}>
            <span aria-hidden="true" className="flex gap-[3px]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-3 w-[5px] rounded-[1px] bg-accent-ink" />
              ))}
            </span>
            <span className="uppercase">
              [BL™ — The studio /{" "}
              {/* "The studio and its principles": our words, in Neiden's
                  bilingual label style (Brad asked to keep it). */}
              <span lang="ja" className="text-ink-1000/55">
                工房と理念
              </span>
              ]
            </span>
          </p>
        </div>

        <h2 id={headingId} className="sr-only">
          About Black Line Agency
        </h2>
        {/* White + difference: black on the band, inverted over a picture. */}
        <div className="mt-5 mix-blend-difference lg:mt-6 lg:ml-[6.2%] lg:mr-[8%]">
          <ScrollText
            text={statement}
            glyphs
            dim={0.45}
            className="text-[clamp(1.75rem,5vw,5.25rem)] font-semibold lg:[text-indent:7.2vw] leading-[1.1] tracking-[-0.06em] text-white"
          />
        </div>

        <div className="mt-6 lg:mt-12 lg:grid lg:grid-cols-3">
          <div className="lg:col-start-2 lg:pl-3">
            <p className="max-w-[32rem] text-[0.9375rem] font-medium leading-[1.45] lg:text-[1.0625rem] lg:leading-[1.4] tracking-[-0.04em] text-ink-1000/70">
              Two founders and no account managers. The people on the first call
              are the people who design, build and look after your site, and
              every enquiry is answered within one working day.
            </p>
            <div className="mt-6 flex items-center gap-4 lg:mt-10">
              <span className="flex -space-x-2" aria-hidden="true">
                {founders.map((f) => {
                  const avatar = resolveFounderAvatar(f.name);
                  return (
                    <span
                      key={f.name}
                      className="relative grid size-11 place-items-center lg:size-14 overflow-hidden rounded-full bg-ink-900 text-[0.8125rem] font-bold text-ink-0 ring-2 ring-ink-0"
                    >
                      {avatar ? (
                        <Image src={avatar} alt="" width={56} height={56} className="size-full object-cover" />
                      ) : (
                        f.name.split(" ").map((w) => w[0]).join("")
                      )}
                    </span>
                  );
                })}
              </span>
              <p className="text-[0.8125rem] leading-snug tracking-[-0.02em]">
                <span className="block font-semibold">{founders.map((f) => f.name).join(" & ")}</span>
                <span className="text-ink-1000/60">Founders at</span>
                <span className="block font-semibold">Black Line Agency™</span>
              </p>
            </div>
          </div>
        </div>

        <p className={`mt-8 uppercase ${LABEL} text-[0.75rem] tracking-[0.02em] lg:mt-16`}>
          Humberston, Grimsby
        </p>
      </div>
    </section>
  );
}
