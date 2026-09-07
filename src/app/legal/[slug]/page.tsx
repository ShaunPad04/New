import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/lib/content";
import {
  LEGAL_DETAILS_VERIFIED,
  LEGAL_LAST_UPDATED,
  legalDocuments,
} from "@/lib/legal";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

/**
 * LEGAL DOCUMENTS — privacy policy and terms of use.
 *
 * Deliberately plain: no reveal animations, no bezels, no display face at
 * scale. A legal document that performs is a legal document nobody trusts,
 * and these are the two pages on the site whose only job is to be read and
 * understood. Long-form measure is capped at 68 characters, headings are
 * anchored so a specific clause can be linked, and the whole thing is one
 * column at every width.
 *
 * The `LEGAL_DETAILS_VERIFIED` notice is visible on a preview build and gone
 * on a real one — but it is also wired into `pnpm verify`, so an indexable
 * build cannot ship while the controller's postal address and ICO
 * registration are still missing. A privacy notice without the controller's
 * full identity does not satisfy UK GDPR Article 13, and it is exactly the
 * detail that gets forgotten on launch day.
 */

export function generateStaticParams() {
  return legalDocuments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = legalDocuments.find((d) => d.slug === slug);
  if (!doc) return {};

  return {
    title: `${doc.title} — ${site.name}`,
    description: doc.lede,
    alternates: { canonical: `/legal/${doc.slug}` },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = legalDocuments.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <article className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-40 sm:px-10 lg:px-16 lg:pb-32 lg:pt-56">
          <header className="max-w-[68ch]">
            <p className="eyebrow mb-8">Legal</p>
            <h1 className="display text-display-md text-ink-1000">
              {doc.title}
            </h1>
            <p className="lede mt-8">{doc.lede}</p>
            <p className="field-label mt-8 text-ink-600">
              Last updated {LEGAL_LAST_UPDATED}
            </p>
          </header>

          {/* Preview-only. The machine gate in `pnpm verify` is what actually
              stops this shipping incomplete; this is so nobody reviewing the
              preview mistakes the gaps for finished copy. */}
          {!LEGAL_DETAILS_VERIFIED ? (
            <div className="mt-12 max-w-[68ch] border border-dashed border-ink-400 p-6">
              <p className="field-label text-ink-600">Not yet complete</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-800">
                This document still needs the controller&rsquo;s registered
                postal address, the company registration number if there is
                one, and the ICO registration reference. It has also not been
                reviewed by a solicitor. <code>pnpm verify</code> fails any
                indexable build until those are supplied.
              </p>
            </div>
          ) : null}

          {/* Contents. Long documents are navigated, not read start to end. */}
          <nav aria-label="On this page" className="mt-16 max-w-[68ch]">
            <h2 className="field-label text-ink-600">On this page</h2>
            <ol className="mt-5 space-y-2.5">
              {doc.sections.map((s, i) => (
                <li key={s.id} className="flex gap-4 text-[0.9375rem]">
                  <span
                    aria-hidden="true"
                    className="w-6 shrink-0 font-mono text-xs text-ink-600"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${s.id}`}
                    className="text-ink-800 underline-offset-4 transition-colors hover:text-ink-1000 hover:underline"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-16 max-w-[68ch] space-y-14">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="display-soft text-2xl text-ink-1000">
                  <span
                    aria-hidden="true"
                    className="mr-4 font-mono text-xs tracking-[0.2em] text-ink-600"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.heading}
                </h2>

                <div className="mt-6 space-y-5">
                  {s.body.map((p) => (
                    <p
                      key={p.slice(0, 24)}
                      className="text-[0.9375rem] leading-relaxed text-ink-800"
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {s.list ? (
                  <ul className="mt-6 space-y-3">
                    {s.list.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-4 text-[0.9375rem] leading-relaxed text-ink-800"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 block h-px w-4 shrink-0 bg-ink-500"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-20 max-w-[68ch] border-t border-ink-300 pt-10">
            <p className="text-sm leading-relaxed text-ink-700">
              Questions about any of this? Email{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-ink-1000 underline underline-offset-4"
              >
                {site.email}
              </a>
              {" "}or call{" "}
              <a
                href={site.phoneHref}
                className="text-ink-1000 underline underline-offset-4"
              >
                {site.phone}
              </a>
              .
            </p>
            <p className="mt-6 text-sm text-ink-700">
              <Link
                href="/"
                className="underline underline-offset-4 transition-colors hover:text-ink-1000"
              >
                Back to the homepage
              </Link>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
