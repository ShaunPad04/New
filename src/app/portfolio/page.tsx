import type { Metadata } from "next";
import Link from "next/link";
import { projects, site, type Project } from "@/lib/content";
import { WorkCard } from "@/components/work-card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { Cta } from "@/components/cta";

export const metadata: Metadata = {
  title: `Portfolio — ${site.name}`,
  description:
    "Selected client websites built and run by Black Line Agency — measured against enquiries, bookings and revenue rather than launch-day looks.",
  alternates: { canonical: "/portfolio" },
};

/**
 * PORTFOLIO — its own route, not an anchor on the homepage.
 *
 * Case studies are the single most scrutinised thing on an agency site, so
 * they get a real URL that can be linked, shared and indexed on its own.
 *
 * `PORTFOLIO_VERIFIED` still governs whether real project data renders. While
 * it is false this page says plainly that case studies are being prepared
 * rather than printing placeholder tiles, because inventing project names or
 * results would be a fabricated claim about the business.
 */
export default function PortfolioPage() {
  // Real, client-approved work only. The invented placeholder set is not
  // rendered here at all any more — this reads from `projects`.
  const shown: Project[] = projects;

  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <section
          aria-labelledby="portfolio-heading"
          className="border-b border-ink-300"
        >
          <div className="mx-auto w-full max-w-[1600px] px-6 pb-20 pt-40 sm:px-10 lg:px-16 lg:pb-28 lg:pt-56">
            <p className="eyebrow mb-8">Portfolio</p>
            <h1
              id="portfolio-heading"
              className="display text-display-lg max-w-[16ch] text-ink-1000"
            >
              Proof, not promises.
            </h1>
            <p className="lede mt-10 max-w-[54ch]">
              Every project here is measured against what it was hired to do —
              enquiries, bookings, revenue — not how it looked on launch day.
            </p>
          </div>
        </section>

        <section className="bg-ink-50">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
            {shown.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2">
                {shown.map((project, i) => (
                  <Reveal as="li" key={project.id} delay={i * 0.06}>
                    <WorkCard project={project} />
                  </Reveal>
                ))}
              </ul>
            ) : (
              <div className="border border-dashed border-ink-400 px-8 py-20 text-center lg:px-16 lg:py-28">
                <p className="eyebrow mb-8 inline-block">In preparation</p>
                <h2 className="display mx-auto max-w-[22ch] text-display-sm text-ink-1000">
                  Case studies are being written up.
                </h2>
                <p className="mx-auto mt-8 max-w-[54ch] text-[0.9375rem] leading-relaxed text-ink-700">
                  We would rather publish a small number of projects properly —
                  with the client&rsquo;s permission and the numbers that
                  actually moved — than fill this page with screenshots.
                </p>
                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                  <Cta href="/#contact">Ask to see the work</Cta>
                  <Cta href="/#services" variant="ghost">
                    What we do
                  </Cta>
                </div>
              </div>
            )}

            <p className="mt-16 text-center text-sm text-ink-700">
              <Link
                href="/"
                className="underline underline-offset-4 transition-colors hover:text-ink-1000"
              >
                Back to the homepage
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
