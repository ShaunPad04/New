import type { ReactNode } from "react";
import Link from "next/link";
import { Cta } from "@/components/cta";

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
}: {
  eyebrow: string;
  heading: string;
  headingId: string;
  lede: string;
}) {
  return (
    <section aria-labelledby={headingId} className="border-b border-ink-300">
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-20 pt-40 sm:px-10 lg:px-16 lg:pb-28 lg:pt-56">
        <p className="eyebrow mb-8">{eyebrow}</p>
        <h1
          id={headingId}
          className="display text-display-lg max-w-[16ch] text-ink-1000"
        >
          {heading}
        </h1>
        <p className="lede mt-10 max-w-[54ch]">{lede}</p>
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
