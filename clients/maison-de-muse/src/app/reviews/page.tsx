import type { Metadata } from "next";
import { site } from "@/lib/site";
import { GOOGLE_REVIEWS_URL, TRIPADVISOR_URL, reviews } from "@/lib/reviews";
import { Cta } from "@/components/cta";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { BreadcrumbJsonLd } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What visitors say about Maison de Muse in Cleethorpes — welcoming service, speciality coffee and matcha, beautifully presented food and a calm, stylish room.",
  alternates: { canonical: "/reviews" },
  openGraph: { title: `Reviews — ${site.name}`, url: `${site.url}/reviews` },
};

export default function ReviewsPage() {
  return (
    <>
      <BreadcrumbJsonLd name="Reviews" path="/reviews" />
      <main id="main" className="flex-1">
        <PageHeader crumb="Reviews" eyebrow="In their words" title="Loved by" accent="the regulars.">
          <p className="lede max-w-[48ch]">
            Summaries of public reviews, each linked to the page it was read
            from. The latest reviews and the current rating are on Google and
            Tripadvisor.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Cta href={GOOGLE_REVIEWS_URL} external>
              Reviews on Google
            </Cta>
            <Cta href={TRIPADVISOR_URL} external variant="ghost">
              Tripadvisor
            </Cta>
          </div>
        </PageHeader>

        <section
          aria-label="Selected reviews"
          className="mx-auto w-full max-w-[1400px] px-6 pb-24 sm:px-10 lg:px-16 lg:pb-36"
        >
          <ul className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {reviews.map((r, i) => (
              <Reveal as="li" key={r.id} delay={(i % 2) * 0.06} className="bezel">
                <figure className="bezel-core flex h-full flex-col justify-between p-7 lg:p-9">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="eyebrow">{r.theme}</span>
                      <span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-mocha">
                        {r.kind === "quote" ? "Quote" : "Summary"}
                      </span>
                    </div>
                    <blockquote className="mt-8">
                      <p className="serif text-[1.375rem] leading-snug text-espresso lg:text-2xl">
                        {r.kind === "quote" ? `“${r.text}”` : r.text}
                      </p>
                    </blockquote>
                  </div>
                  <figcaption className="mt-10 border-t border-sand pt-5 text-sm text-mocha">
                    {r.kind === "paraphrase" ? "Paraphrased from a " : "From a "}
                    <a
                      href={r.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-line text-espresso"
                    >
                      {r.source.label}
                    </a>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1} className="mt-16 max-w-[60ch]">
            <p className="text-sm leading-relaxed text-mocha">
              Reviews are shown as summaries so that nobody is quoted with
              words they did not write. To read them in full, or to leave your
              own, use the links above. Been in? The team would love to hear
              from you.
            </p>
          </Reveal>
        </section>
      </main>
    </>
  );
}
