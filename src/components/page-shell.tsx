import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cta } from "@/components/cta";
import { Reveal } from "@/components/reveal";

/**
 * Shared chrome for the standalone category routes.
 *
 * Each nav category has its own URL rather than being an anchor on the
 * homepage: a page can be linked, shared, indexed and landed on from search,
 * which an in-page fragment cannot. The homepage keeps the same sections as a
 * scroll narrative; these routes are the destination version, opening with
 * their own <h1> and closing with a route back into the enquiry.
 */
export function PageIntro({
  eyebrow,
  heading,
  headingId,
  lede,
  image,
}: {
  eyebrow: string;
  heading: string;
  headingId: string;
  lede: string;
  /**
   * Optional cinematic backdrop (redesign, 2026-09-11): a monochrome still
   * behind the intro, heavily scrimmed so the type owns the band. The
   * images are AI-generated (Higgsfield, client-authorised) and live in
   * `public/images/pages/`. Decorative — always `alt=""`.
   */
  image?: string;
}) {
  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate overflow-hidden border-b border-ink-300"
    >
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover grayscale"
          />
          {/* Heavy foot, clear head — the type sits low, the picture
              breathes above it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(to top, rgb(0 0 0 / 0.92) 0%, rgb(0 0 0 / 0.72) 40%, rgb(0 0 0 / 0.45) 70%, rgb(0 0 0 / 0.25) 100%)",
            }}
          />
        </>
      ) : null}
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-20 pt-40 sm:px-10 lg:px-16 lg:pb-28 lg:pt-56">
        {/* The h1 is NEVER wrapped in a Reveal: a heading that depends on an
            observer firing is the failure reveal.tsx documents. The lede is
            supporting copy, so it may arrive. */}
        <p className="eyebrow mb-8">{eyebrow}</p>
        <h1
          id={headingId}
          className="display text-display-lg max-w-[16ch] text-ink-1000"
        >
          {heading}
        </h1>
        <Reveal delay={0.1} variant="unblur">
          <p className="lede mt-10 max-w-[54ch]">{lede}</p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Closing conversion band. A visitor who has read a category page should never
 * have to hunt for the next step, so every route ends on the same offer.
 */
export function ContactBand({
  heading = "Ready to talk about yours?",
  body = "Tell us what you are building. We reply within one working day and book a call at a time that suits you — and we will say honestly if we are not the right studio for it.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section
      aria-labelledby="page-cta-heading"
      className="border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="bezel">
          <div className="bezel-core flex flex-col gap-10 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-14">
            <div>
              <p className="field-label text-ink-600">Next step</p>
              <h2
                id="page-cta-heading"
                className="display mt-4 max-w-[18ch] text-display-sm text-ink-1000"
              >
                {heading}
              </h2>
              <p className="mt-5 max-w-[56ch] text-sm leading-relaxed text-ink-700">
                {body}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <Cta href="/#contact">Book a call</Cta>
              <Cta href="/portfolio" variant="ghost">
                See the work
              </Cta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Quiet route back to the homepage, matching the portfolio page. */
export function BackHome({ children }: { children?: ReactNode }) {
  return (
    <p className="mx-auto mb-24 w-full max-w-[1600px] px-6 text-center text-sm text-ink-700 sm:px-10 lg:px-16">
      <Link
        href="/"
        className="underline underline-offset-4 transition-colors hover:text-ink-1000"
      >
        {children ?? "Back to the homepage"}
      </Link>
    </p>
  );
}
