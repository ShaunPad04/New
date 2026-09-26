import Image from "next/image";
import Link from "next/link";
import { buildStandardsBand, projectTiers, site } from "@/lib/content";

/**
 * WHY CHOOSE US — concept to replace the homepage FAQ (Brad, 2026-09-25),
 * after his reference: a three-column bento — tall image card, two stacked
 * feature cells, tall image card with the call to action.
 *
 * The reference leads with "4.9/5 from 100+ client projects". We have no
 * rating and no such count, and publishing one would be a fabricated claim
 * (CPUTR / DMCCA). Every line here is already stated elsewhere on the site
 * and is read from the same data: the scores band, the Essential delivery
 * window WITH its content caveat, the ownership answer, the lowest build
 * price and the fixed-price promise from the pricing section.
 *
 * Images: two AI-generated grainy monochrome photographs Brad picked
 * (Higgsfield gpt_image_2_5, 0.25 credits each) at public/images/why/.
 * Atmosphere only — never captioned or implied as founders or clients.
 */
function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhyUs() {
  const measured = buildStandardsBand.blocks[0];
  const essential = projectTiers[0];
  const from = `${site.currencySymbol}${new Intl.NumberFormat("en-GB").format(essential.price)}`;
  const label = "flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-white";

  return (
    <section aria-labelledby="why-heading" className="bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-8 lg:py-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-3 border border-ink-400 px-3 py-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-1000">
              <span aria-hidden="true" className="flex gap-[2px]">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className={`h-3 w-[2px] ${i < 5 ? "bg-ink-1000" : "bg-ink-500"}`} />
                ))}
              </span>
              Why us
            </p>
            <h2 id="why-heading" className="display mt-5 text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.86] text-ink-1000">
              Why choose us
            </h2>
          </div>
          <p className="max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-700">
            Founder-led design and build. Fixed prices agreed in writing,
            scores measured rather than promised, and a site that is yours.
          </p>
        </div>

        <div className="mt-12 grid border border-ink-300 lg:grid-cols-3">
          {/* Left — the measured promise over a photograph */}
          <div className="relative min-h-[30rem] overflow-hidden border-b border-ink-300 lg:border-b-0 lg:border-r">
            {/* Brad's pick: the laughing portrait (AI-generated atmosphere —
                never presented as a client or a founder). */}
            <Image src="/images/why/portrait.2026-09-26.webp" alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover object-top opacity-70" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9),rgba(0,0,0,0.2)_55%,rgba(0,0,0,0.55))]" />
            <div className="relative flex h-full min-h-[30rem] flex-col justify-between p-7">
              <p className={label}><span aria-hidden="true" className="h-1.5 w-1.5 bg-white" />{measured.label}</p>
              <div className="text-center">
                <p className="display text-[clamp(2.25rem,3.6vw,3.25rem)] leading-none text-white">{measured.heading}</p>
                <p className="mt-3 text-sm text-white/80">Lighthouse, mobile and desktop</p>
              </div>
              <p className="text-right text-sm text-white/75">Every build ships above these, or we keep working at no extra cost.</p>
            </div>
          </div>

          {/* Middle — two feature cells */}
          <div className="grid border-b border-ink-300 lg:border-b-0 lg:border-r">
            <div className="flex flex-col items-center justify-center gap-3 border-b border-ink-300 px-8 py-14 text-center text-ink-1000">
              <Icon d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" />
              <p className="display text-2xl text-ink-1000">Fast turnaround</p>
              <p className="max-w-[30ch] text-[0.9375rem] leading-relaxed text-ink-700">{essential.delivery}.</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-14 text-center text-ink-1000">
              <Icon d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" />
              <p className="display text-2xl text-ink-1000">Yours outright</p>
              <p className="max-w-[30ch] text-[0.9375rem] leading-relaxed text-ink-700">The code, the domain and every account are yours.</p>
            </div>
          </div>

          {/* Right — price and the way in */}
          <div className="relative min-h-[30rem] overflow-hidden">
            {/* Brad's pick (photo 8): the man at the laptop, as in his
                reference. AI-generated atmosphere — never presented as a
                founder or a client. */}
            <Image src="/images/why/laptop.2026-09-26.webp" alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover object-[65%_center] opacity-70" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9),rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.55))]" />
            <div className="relative flex h-full min-h-[30rem] flex-col justify-between p-7">
              <p className={label}><span aria-hidden="true" className="h-1.5 w-1.5 bg-white" />Builds from {from} / project</p>
              <div className="text-center">
                <span className="inline-block bg-white px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-black">Fixed</span>
                <p className="display mt-3 text-[clamp(2.25rem,3.6vw,3.25rem)] leading-none text-white">Pricing</p>
                <p className="mx-auto mt-3 max-w-[30ch] text-sm text-white/80">Agreed in writing before anything starts.</p>
              </div>
              <Link href="/#contact" className="group ml-auto inline-flex min-h-11 items-center gap-3 text-sm font-semibold uppercase tracking-[0.06em] text-white">
                Get started
                <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center border border-white/60 transition-transform group-hover:rotate-45">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
