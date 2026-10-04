import type { Metadata } from "next";
import { site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { HeroCta } from "@/components/v3/hero-cta";

export const metadata: Metadata = {
  title: `Page not found — ${site.name}`,
  // A 404 must never be indexed: it would compete with real pages for the
  // same query and it says nothing useful about the business.
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * Rebuilt from a supplied reference (2026-09-07). The idea worth taking from
 * it was the oversized numeral fading out at its foot — a 404 wants one strong
 * graphic and very little else. What the reference could not give us:
 *
 *  - It is a shadcn component built on `Button`, `Empty` and `Avatar`, none of
 *    which exist here, and it would have added four dependencies
 *    (lucide-react, class-variance-authority and two Radix packages) to render
 *    one page. The house `Cta` already does the job.
 *  - Its tokens — `bg-primary`, `text-muted-foreground`, `border-input`,
 *    `text-foreground/80` — do not exist in this project's `ink` scale.
 *  - Both of its buttons pointed at `href="#"`. On a 404, of all pages, a
 *    link to nowhere is the one thing you cannot ship.
 *  - It set the description `text-nowrap` with a hard `<br />`, which forces a
 *    two-line break that overflows a narrow phone. The text wraps naturally.
 *  - It rendered no navigation at all. That is backwards: a 404 exists to get
 *    a lost visitor somewhere useful, so this one carries the full header and
 *    footer, which between them offer every route on the site.
 *
 * `100svh` rather than `100vh`, so mobile browser chrome does not push the
 * buttons below the fold on the one page where the buttons are the point.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main"
        className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center sm:px-10 lg:min-h-[100svh]"
      >
        {/* The numeral is decoration, not content — the <h1> below is what
            announces the page, so this is hidden from assistive tech to avoid
            a screen reader reading out "four zero four" before the sentence
            that actually explains what happened. */}
        <p
          aria-hidden="true"
          className="display mask-b-from-20% mask-b-to-80% select-none text-[clamp(7rem,26vw,18rem)] leading-[0.8] tracking-[-0.04em] text-ink-1000"
        >
          404
        </p>

        {/* The site's display heading (its word spacing included: the old
            `display-soft` ran the words together). */}
        <h1 className="display -mt-4 max-w-[18ch] text-[clamp(1.75rem,4vw,3rem)] leading-[0.95] text-ink-1000 sm:-mt-8">
          This page does not exist.
        </h1>

        <p className="mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-700">
          The link may be out of date, or the page may have moved. Everything
          else is exactly where you left it.
        </p>

        {/* The white bar every page sends people with, and a quiet second
            way out (2026-10-04: the old bracket buttons were the last of the
            Nocta style on this page). */}
        <div className="mt-12 flex w-full max-w-[24rem] flex-col items-center gap-5">
          <HeroCta light label="Back to the homepage" href="/" />
          <Link
            href="/portfolio"
            className="group inline-flex min-h-11 items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[-0.02em] text-ink-1000 transition-colors hover:text-accent"
          >
            See the work <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
